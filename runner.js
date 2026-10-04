/* ============================================================================
   前端基礎學堂 Frontend Foundations — runner.js
   ----------------------------------------------------------------------------
   作用：安全地執行學員在練習框寫的程式碼，並把結果帶回畫面。

   這一版支援「兩種」執行模式：

     1. mode: 'preview'（HTML / CSS 科用）
        學員寫的 HTML 或 CSS 會被放進一個 iframe 真正渲染出來，
        學員即時看到版面效果；裡面若有 <script>，console.log 亦會被抓到下面顯示。

     2. mode: 'console'（JavaScript 科用）
        學員寫的 JS 由 postMessage 送入沙箱執行，然後好像 DevTools 一樣
        把 console.log 的輸出帶回畫面。

   安全設計（跟原本樣本一致）：
     ‧ iframe 用 sandbox="allow-scripts"，**沒有** allow-same-origin，
       所以學員的程式碼讀不到本網站的 DOM 或 localStorage。
     ‧ 沙箱與外層只透過 window.postMessage 溝通。
     ‧ 逾時（死循環）就整個 iframe 換掉，主網站不會卡死。

   對外提供（window.Runner）：
     run(options)                                  → Promise<{logs, error, timedOut, truncated}>
     renderOutput(logs, error, timedOut, truncated) → HTML 字串
     renderCode(code, lang)                         → HTML 字串（語法高亮：html / css / js）
     DEFAULT_CSS_HTML                               → CSS 練習用的預設示範 HTML
   ========================================================================== */

(function () {
  'use strict';

  var TOKEN = 'weblearn-' + Math.random().toString(36).slice(2);
  var MSG_TYPE = 'weblearn:result';

  /* 沙箱內的基本樣式：刻意保持「中性、最少」，
     否則會蓋過學員正在學的 CSS 效果（例如 box-sizing 預設值）。 */
  var BASE_CSS =
    'html,body{margin:0;padding:14px 16px;background:#fff;color:#2f3336;' +
    'font-family:system-ui,"Segoe UI","PingFang HK","Microsoft JhengHei",sans-serif;' +
    'font-size:15px;line-height:1.7;}' +
    'img,video{max-width:100%;}';

  /* CSS 練習如果沒有指定 previewHtml，就用這個示範結構 */
  var DEFAULT_CSS_HTML =
    '<h3>示範區</h3>\n' +
    '<p class="demo">一段文字，用嚟睇顏色同字體。</p>\n' +
    '<div class="card">一張卡片</div>\n' +
    '<ul>\n  <li>項目一</li>\n  <li>項目二</li>\n</ul>\n' +
    '<button>撳我</button>';

  var _pending = null;   // 目前等待中的執行
  var _listening = false;
  var _seq = 0;          // 執行序號，用來產生唯一的 runId

  /* ---------------------------------------------------------------------
     0) 顯示格式：模仿 Chrome DevTools 的 console.log 外觀
        為甚麼要自己寫？
          console.log([ 'A', 'B' ]) 在 DevTools 會顯示成  [ 'A', 'B' ]
          但用 JSON.stringify 就會變成多行的  [\n  "A",\n  "B"\n ]
        課程資料裡的「預期輸出」是按 DevTools 格式寫的，
        所以沙箱要用同一種格式，學員照抄範例時才不會覺得「點解唔同咗？」。

        這兩個函數會被 toString() 注入沙箱（見 buildSandboxScript），
        所以它們**不可以**引用任何外部變數。
     --------------------------------------------------------------------- */
  function sandboxQuote(s) {
    return "'" + String(s)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\n/g, '\\n')
      .replace(/\t/g, '\\t') + "'";
  }

  function sandboxInspect(v, depth, seen) {
    depth = depth || 0;
    seen = seen || [];

    if (v === undefined) return 'undefined';
    if (v === null) return 'null';

    var t = typeof v;
    if (t === 'string') return depth === 0 ? v : sandboxQuote(v);
    if (t === 'number' || t === 'boolean') return String(v);
    if (t === 'bigint') return String(v) + 'n';
    if (t === 'symbol') return String(v);
    if (t === 'function') return 'ƒ ' + (v.name || 'anonymous') + '()';

    if (v.nodeType) return '<' + String(v.tagName || 'node').toLowerCase() + '>';
    if (v instanceof Date) return v.toString();

    if (seen.indexOf(v) !== -1) return '[Circular]';
    seen = seen.concat([v]);

    if (depth > 3) return Array.isArray(v) ? '[Array]' : '[Object]';

    if (Array.isArray(v)) {
      if (!v.length) return '[]';
      var items = [];
      for (var i = 0; i < v.length && i < 100; i++) items.push(sandboxInspect(v[i], depth + 1, seen));
      if (v.length > 100) items.push('… ' + (v.length - 100) + ' more items');
      return '[ ' + items.join(', ') + ' ]';
    }

    var keys;
    try { keys = Object.keys(v); } catch (e) { return String(v); }
    if (!keys.length) return '{}';

    var parts = [];
    for (var j = 0; j < keys.length && j < 100; j++) {
      parts.push(keys[j] + ': ' + sandboxInspect(v[keys[j]], depth + 1, seen));
    }
    return '{ ' + parts.join(', ') + ' }';
  }

  /* ---------------------------------------------------------------------
     1) 沙箱內層腳本
        注意：console.log 必須由內層自己覆寫，因為 postMessage 不可以傳函數／DOM。
        MODE 會由外層插入，決定「預覽模式」還是「console 模式」。
     --------------------------------------------------------------------- */
  function buildSandboxScript(mode, runId) {
    return '(function(){\n' +
      '  var TOKEN = ' + JSON.stringify(TOKEN) + ';\n' +
      '  var MODE = ' + JSON.stringify(mode) + ';\n' +
      '  var RUN_ID = ' + JSON.stringify(runId === undefined ? null : runId) + ';\n' +
      '  var logs = [];\n' +
      '  var MAX = 200;\n' +
      '  var truncated = false;\n' +
      '  var sent = false;\n' +
      '\n' +
      '  // ---- 顯示格式工具（由外層函數 toString() 注入，所以不用處理多層轉義）----\n' +
      '  var sandboxQuote = ' + sandboxQuote.toString() + ';\n' +
      '  var sandboxInspect = ' + sandboxInspect.toString() + ';\n' +
      '\n' +
      '  // 把值轉成可以安全 postMessage 的形式（順便變成似 DevTools 的文字）\n' +
      '  function safe(v){\n' +
      '    var text;\n' +
      '    try { text = sandboxInspect(v, 0, []); } catch (e) { text = String(v); }\n' +
      '    return { k: typeof v, text: text };\n' +
      '  }\n' +
      '\n' +
      '  function push(level, args){\n' +
      '    if (logs.length >= MAX) { truncated = true; return; }\n' +
      '    var out = [];\n' +
      '    for (var i = 0; i < args.length; i++) out.push(safe(args[i]));\n' +
      '    logs.push({ level: level, parts: out });\n' +
      '  }\n' +
      '\n' +
      '  console.log   = function(){ push("log", arguments); };\n' +
      '  console.info  = function(){ push("info", arguments); };\n' +
      '  console.warn  = function(){ push("warn", arguments); };\n' +
      '  console.error = function(){ push("error", arguments); };\n' +
      '  window.jsOut  = function(s){ push("raw", [String(s)]); };\n' +
      '\n' +
      '  function send(payload){\n' +
      '    payload.token = TOKEN;\n' +
      '    payload.type = "weblearn:result";\n' +
      '    payload.runId = RUN_ID;          // 讓外層認得出係「哪一次執行」的 iframe\n' +
      '    try { parent.postMessage(payload, "*"); } catch (e) { /* 忽略 */ }\n' +
      '  }\n' +
      '\n' +
      '  function finish(){\n' +
      '    if (sent) return;\n' +
      '    sent = true;\n' +
      '    send({ run:true, ok:true, logs:logs, truncated:truncated });\n' +
      '  }\n' +
      '\n' +
      '  // 抓執行期錯誤：加入輸出而不是整頁爆掉，學員仍然睇得到預覽\n' +
      '  window.addEventListener("error", function(ev){\n' +
      '    var where = ev && ev.lineno ? "（第 " + ev.lineno + " 行）" : "";\n' +
      '    push("error", [String((ev && ev.message) || "未知錯誤") + where]);\n' +
      '    if (ev && ev.preventDefault) ev.preventDefault();\n' +
      '    return true;\n' +
      '  });\n' +
      '\n' +
      '  window.addEventListener("unhandledrejection", function(ev){\n' +
      '    var r = ev && ev.reason;\n' +
      '    push("error", ["Promise 錯誤：" + String((r && r.message) || r)]);\n' +
      '  });\n' +
      '\n' +
      '  if (MODE === "console") {\n' +
      '    // 收到外層指令才執行，執行完「立即」回報。\n' +
      '    // 為甚麼不用 setTimeout 等多 0.8 秒去收集非同步輸出？\n' +
      '    //   因為沙箱 iframe 是跨來源（sandbox 沒有 allow-same-origin），又被放在畫面外，\n' +
      '    //   Chrome 會節流跨來源 iframe 的 timer，可能永遠都唔會觸發，\n' +
      '    //   結果學員撳「執行」之後一直停在「執行中」。所以這裡完全不用 timer。\n' +
      '    window.addEventListener("message", function(ev){\n' +
      '      var d = ev.data;\n' +
      '      if (!d || d.token !== TOKEN || d.cmd !== "run") return;\n' +
      '      try {\n' +
      '        (new Function(d.code))();\n' +
      '      } catch (err) {\n' +
      '        push("error", [String((err && err.name) || "Error") + ": " + String((err && err.message) || err)]);\n' +
      '      }\n' +
      '      finish();\n' +
      '    });\n' +
      '  } else {\n' +
      '    // 預覽模式：等 DOMContentLoaded（代表片段內所有同步 script 都跑完）就回報，\n' +
      '    // 同樣不用 timer。\n' +
      '    if (document.readyState === "loading") {\n' +
      '      document.addEventListener("DOMContentLoaded", finish);\n' +
      '    } else {\n' +
      '      finish();\n' +
      '    }\n' +
      '    window.addEventListener("message", function(ev){\n' +
      '      var d = ev.data;\n' +
      '      if (!d || d.token !== TOKEN || d.cmd !== "run") return;\n' +
      '      try { (new Function(d.code))(); }\n' +
      '      catch (err) { push("error", [String((err && err.message) || err)]); }\n' +
      '      finish();\n' +
      '    });\n' +
      '  }\n' +
      '\n' +
      '  send({ ready:true });\n' +
      '})();\n';
  }

  /* 把一段注入碼放入一份完整 HTML 文件（放在 <head> 之後，保持 DOCTYPE 有效） */
  function injectIntoDocument(code, injection) {
    var m = /<head[^>]*>/i.exec(code);
    if (m) {
      var i = m.index + m[0].length;
      return code.slice(0, i) + injection + code.slice(i);
    }
    m = /<html[^>]*>/i.exec(code);
    if (m) {
      var j = m.index + m[0].length;
      return code.slice(0, j) + '<head>' + injection + '</head>' + code.slice(j);
    }
    m = /<!doctype[^>]*>/i.exec(code);
    if (m) {
      var k = m.index + m[0].length;
      return code.slice(0, k) + '<head>' + injection + '</head>' + code.slice(k);
    }
    return injection + code;
  }

  /* ---------------------------------------------------------------------
     2) 組合 iframe 內的完整 HTML（只用於 preview 模式）
     --------------------------------------------------------------------- */
  function buildSrcdoc(options) {
    var code = String(options.code || '');
    var lang = options.lang === 'css' ? 'css' : 'html';
    var mode = options.mode === 'console' ? 'console' : 'preview';

    // 沙箱腳本要拆開 </script，避免影響 srcdoc 的解析
    var script = '<scr' + 'ipt>' +
      buildSandboxScript(mode, options.runId).split('</script').join('<\\/script') +
      '</scr' + 'ipt>';
    var baseStyle = '<style>' + BASE_CSS + '</style>';
    var injection = script + baseStyle;

    if (lang === 'css') {
      // CSS 模式：固定 HTML（或預設示範）+ 學員寫的 CSS
      var html = typeof options.previewHtml === 'string' && options.previewHtml.trim()
        ? options.previewHtml
        : DEFAULT_CSS_HTML;
      return '<!DOCTYPE html><html lang="zh-Hant-HK"><head><meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1">' +
        injection +
        '<style>' + code + '</style>' +
        '</head><body>' + html + '</body></html>';
    }

    // HTML 模式：學員寫的片段或完整文件
    var looksLikeDocument = /<!doctype|<html[\s>]/i.test(code);
    if (looksLikeDocument) {
      return injectIntoDocument(code, injection);
    }
    return '<!DOCTYPE html><html lang="zh-Hant-HK"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      injection +
      '</head><body>' + code + '</body></html>';
  }

  /* ---------------------------------------------------------------------
     3) 監聽沙箱回報
     --------------------------------------------------------------------- */
  function ensureListener() {
    if (_listening) return;
    _listening = true;

    window.addEventListener('message', function (ev) {
      var d = ev.data;
      if (!d || d.token !== TOKEN || d.type !== MSG_TYPE) return;
      if (!_pending) return;

      if (d.ready) {
        _pending.ready = true;
        tryRun();
        return;
      }

      finish({
        logs: d.logs || [],
        error: null,
        timedOut: false,
        truncated: !!d.truncated
      });
    });
  }

  /* console 模式：沙箱準備好就落指令；preview 模式不用送指令 */
  function tryRun() {
    var p = _pending;
    if (!p || p.sent || p.mode !== 'console') return;
    if (!p.host || !p.host.contentWindow) {
      if (p.retries >= 40) return;
      p.retries++;
      setTimeout(tryRun, 25);
      return;
    }
    p.sent = true;
    try {
      p.host.contentWindow.postMessage({ token: TOKEN, cmd: 'run', code: p.code }, '*');
    } catch (e) {
      finish({ logs: [], error: '無法把程式碼送入沙箱：' + e.message, timedOut: false });
    }
  }

  /* 結束一次執行 */
  function finish(result) {
    var p = _pending;
    _pending = null;
    if (!p) return;

    if (p.timer) clearTimeout(p.timer);

    // 預覽模式要保留 iframe（學員要睇住結果），其他情況一律清走
    if (p.host && p.host.parentNode && !p.keepAlive) {
      try { p.host.parentNode.removeChild(p.host); } catch (e) { /* 忽略 */ }
    }

    p.resolve(result);
  }

  /* ---------------------------------------------------------------------
     4) 對外：run(options) → Promise
        options = {
          code,                // 學員的程式碼
          mode,                // 'preview' | 'console'（預設 preview）
          lang,                // 'html' | 'css' | 'js'
          previewHtml,         // CSS 模式要套用的固定 HTML
          mount,               // preview 模式：把 iframe 掛到這個元素裡面
          height,              // preview 模式：iframe 高度（px，預設 240）
          timeout              // 逾時毫秒（預設 6000 preview / 5000 console）
        }
     --------------------------------------------------------------------- */
  function run(options) {
    options = options || {};

    var mode = options.mode === 'console' ? 'console' : 'preview';
    var lang = options.lang === 'css' ? 'css' : (options.lang === 'js' ? 'js' : 'html');
    var code = String(options.code || '');
    var limit = options.timeout || (mode === 'preview' ? 6000 : 5000);

    // preview 模式（或 JS 科但 lang 是 html 的 DOM 練習）→ 用 iframe 渲染
    var usePreview = (mode === 'preview');
    var runId = 'run' + (++_seq) + '-' + Math.random().toString(36).slice(2, 8);

    return new Promise(function (resolve) {
      if (_pending) {
        finish({ logs: [], error: '已被新的執行取代', timedOut: false });
      }
      ensureListener();

      var host = document.createElement('iframe');
      host.setAttribute('title', '程式碼執行沙箱');

      if (usePreview) {
        host.className = 'preview-frame';
        host.setAttribute('sandbox', 'allow-scripts');
        if (options.height) host.style.height = options.height + 'px';
      } else {
        host.setAttribute('sandbox', 'allow-scripts');
        host.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;' +
          'left:-9999px;top:0;border:0;pointer-events:none;';
      }

      /* 先把 srcdoc 準備好，之後才掛上畫面，避免閃一下空白 */
      if (usePreview) {
        host.srcdoc = buildSrcdoc({
          code: code, lang: lang, mode: mode,
          previewHtml: options.previewHtml, runId: runId
        });
      } else {
        // console 模式：code 由 postMessage 送入，srcdoc 只有沙箱腳本
        host.srcdoc = buildSrcdoc({ code: '', lang: 'js', mode: 'console', runId: runId });
      }

      _pending = {
        code: code,
        mode: mode,
        runId: runId,
        sent: false,
        ready: false,
        retries: 0,
        keepAlive: usePreview,
        host: host,
        resolve: resolve,
        timer: setTimeout(function () {
          if (!_pending) return;
          finish({
            logs: [],
            error: '執行超時（超過 ' + (limit / 1000) + ' 秒）。可能有死循環（例如 while (true)），' +
              '或者漏寫了令條件改變的程式碼。',
            timedOut: true
          });
        }, limit)
      };

      if (usePreview) {
        if (options.mount) {
          options.mount.innerHTML = '';           // 清走舊的預覽
          options.mount.appendChild(host);
        } else {
          document.body.appendChild(host);        // 理論上不會發生
        }
      } else {
        document.body.appendChild(host);
      }
    });
  }

  /* ---------------------------------------------------------------------
     5) 輸出渲染：logs → HTML
     --------------------------------------------------------------------- */
  function escapeHtml(text) {
    return String(text == null ? '' : text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderOutput(logs, error, timedOut, truncated) {
    var rows = [];

    (logs || []).forEach(function (entry) {
      var text = (entry.parts || []).map(function (p) { return p.text; }).join(' ');
      var cls = '';
      var prefix = '';

      if (entry.level === 'error') { cls = ' class="line-err"'; prefix = '❌ '; }
      else if (entry.level === 'warn') { cls = ' class="line-warn"'; prefix = '⚠️ '; }
      else if (entry.level === 'info') { prefix = 'ℹ️ '; }

      // jsOut() 的輸出會接在同一行
      if (entry.level === 'raw' && rows.length) {
        rows[rows.length - 1] += escapeHtml(text);
        return;
      }
      rows.push('<div' + cls + '>' + prefix + escapeHtml(text) + '</div>');
    });

    var combined = rows.join('');

    if (truncated) {
      combined += '<div class="line-warn">⚠️ 輸出太多，只顯示頭 200 條。</div>';
    }
    if (error) {
      combined += '<div class="line-err">' + (timedOut ? '⏱️ ' : '❌ ') + escapeHtml(error) + '</div>';
    }
    return combined;
  }

  /* ---------------------------------------------------------------------
     6) 語法高亮（自己手寫，不依賴外部 library）
        renderCode(code, lang)，lang = 'html' | 'css' | 'js'
     --------------------------------------------------------------------- */

  /* ---- 6a. 共用工具 ---- */
  function colorTag(tok) {
    // tok 例如：<div class="card"> 或 </div> 或 <img src="a.png" />
    var m = /^(<\/?)([a-zA-Z][\w:-]*)([\s\S]*?)(\/?>)$/.exec(tok);
    if (!m) return escapeHtml(tok);

    var open = escapeHtml(m[1]);
    var name = '<span class="tk-tag">' + escapeHtml(m[2]) + '</span>';
    var rest = m[3];
    var close = escapeHtml(m[4]);

    var attrOut = '';
    var are = /([a-zA-Z_:][-\w:.]*)(\s*=\s*)("[^"]*"|'[^']*'|[^\s>]+)|([a-zA-Z_:][-\w:.]*)/g;
    var pos = 0;
    var am;
    while ((am = are.exec(rest)) !== null) {
      attrOut += escapeHtml(rest.slice(pos, am.index));
      if (am[1]) {
        attrOut += '<span class="tk-attr">' + escapeHtml(am[1]) + '</span>' +
          escapeHtml(am[2]) + '<span class="tk-string">' + escapeHtml(am[3]) + '</span>';
      } else {
        attrOut += '<span class="tk-attr">' + escapeHtml(am[4]) + '</span>';
      }
      pos = am.index + am[0].length;
    }
    attrOut += escapeHtml(rest.slice(pos));

    return open + name + attrOut + close;
  }

  function hlHtml(src) {
    var re = /<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?[a-zA-Z][\w:-]*[^>]*>/gi;
    var out = '';
    var last = 0;
    var m;

    while ((m = re.exec(src)) !== null) {
      out += escapeHtml(src.slice(last, m.index));
      var tok = m[0];
      if (tok.indexOf('<!--') === 0) {
        out += '<span class="tk-comment">' + escapeHtml(tok) + '</span>';
      } else if (/^<!doctype/i.test(tok)) {
        out += '<span class="tk-keyword">' + escapeHtml(tok) + '</span>';
      } else {
        out += colorTag(tok);
      }
      last = m.index + tok.length;
      if (tok === '') re.lastIndex++;
    }
    out += escapeHtml(src.slice(last));
    return out;
  }

  function hlCss(src) {
    var re = new RegExp([
      '(\\/\\*[\\s\\S]*?\\*\\/)',                        // 1 註解
      '("(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\')', // 2 字串
      '(@[a-zA-Z-]+)',                                    // 3 at-rule
      '(#[0-9a-fA-F]{3,8}\\b)',                           // 4 顏色
      '([-a-zA-Z]+)(?=\\s*:)',                            // 5 屬性名
      '\\b(\\d+(?:\\.\\d+)?)(px|em|rem|%|s|ms|vh|vw|pt|fr|deg|ch|ex)?\\b' // 6 數字 + 7 單位
    ].join('|'), 'g');

    var out = '';
    var last = 0;
    var m;

    while ((m = re.exec(src)) !== null) {
      out += escapeHtml(src.slice(last, m.index));
      if (m[1]) out += '<span class="tk-comment">' + escapeHtml(m[1]) + '</span>';
      else if (m[2]) out += '<span class="tk-string">' + escapeHtml(m[2]) + '</span>';
      else if (m[3]) out += '<span class="tk-keyword">' + escapeHtml(m[3]) + '</span>';
      else if (m[4]) out += '<span class="tk-number">' + escapeHtml(m[4]) + '</span>';
      else if (m[5]) out += '<span class="tk-attr">' + escapeHtml(m[5]) + '</span>';
      else if (m[6]) out += '<span class="tk-number">' + escapeHtml(m[6] + (m[7] || '')) + '</span>';
      last = m.index + m[0].length;
      if (m[0] === '') re.lastIndex++;
    }
    out += escapeHtml(src.slice(last));
    return out;
  }

  var HL_JS = new RegExp([
    '(\\/\\/[^\\n]*)',
    '(/\\*[\\s\\S]*?\\*/)',
    '("(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\'|`(?:\\\\.|[^`\\\\])*`)',
    '(\\b\\d+\\.?\\d*\\b)',
    '(\\b(?:let|const|var|function|return|if|else|for|while|do|break|continue|new|typeof|instanceof|switch|case|default|delete|in|of|class|try|catch|finally|throw|this|null|undefined|true|false|void|yield|async|await|document|window)\\b)',
    '([A-Za-z_$][\\w$]*)(?=\\s*\\()'
  ].join('|'), 'g');

  function hlJs(src) {
    var out = '';
    var last = 0;
    var m;
    HL_JS.lastIndex = 0;

    while ((m = HL_JS.exec(src)) !== null) {
      out += escapeHtml(src.slice(last, m.index));
      var cls = null;
      if (m[1] || m[2]) cls = 'tk-comment';
      else if (m[3]) cls = 'tk-string';
      else if (m[4]) cls = 'tk-number';
      else if (m[5]) cls = 'tk-keyword';
      else if (m[6]) cls = 'tk-function';

      out += cls ? '<span class="' + cls + '">' + escapeHtml(m[0]) + '</span>' : escapeHtml(m[0]);
      last = m.index + m[0].length;
      if (m[0] === '') HL_JS.lastIndex++;
    }
    out += escapeHtml(src.slice(last));
    return out;
  }

  function renderCode(code, lang) {
    var src = String(code == null ? '' : code);
    if (lang === 'html') return hlHtml(src);
    if (lang === 'css') return hlCss(src);
    return hlJs(src);
  }

  /* ---------------------------------------------------------------------
     7) 滙出
     --------------------------------------------------------------------- */
  window.Runner = {
    run: run,
    renderOutput: renderOutput,
    renderCode: renderCode,
    escapeHtml: escapeHtml,
    buildSrcdoc: buildSrcdoc,        // 方便除錯
    DEFAULT_CSS_HTML: DEFAULT_CSS_HTML
  };
})();
