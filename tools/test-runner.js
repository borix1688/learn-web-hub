#!/usr/bin/env node
/* ============================================================================
   runner.js 單元測試（開發工具，網站執行時「不需要」這個檔案）
   ----------------------------------------------------------------------------
   用法：node tools/test-runner.js

   為甚麼可以不用瀏覽器測試？
     runner.js 的沙箱腳本是用「組合 HTML 字串」的方式產生（srcdoc），
     所以我們可以在 Node 裡把它抽出來，用 vm 模擬一個 iframe 環境
     （window / parent.postMessage / console / setTimeout），
     真的跑一次「送出程式碼 → 收集 console.log → 回報」的流程。

   測試內容：
     1. buildSrcdoc：CSS 模式、HTML 片段、完整 HTML 文件（DOCTYPE 要保留）
     2. 沙箱腳本語法正確（真的可以 new vm.Script 解析）
     3. console.log 的顯示格式同 Chrome DevTools 一致（[ 'A', 'B' ]）
     4. console.error / 執行期錯誤會變成紅色輸出，不會令沙箱爆掉
     5. renderCode：html / css / js 三種語法高亮都會 escape，不會產生壞 HTML
     6. renderOutput：logs / error / 逾時 / 截斷提示
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
let fails = 0;

function check(name, cond, extra) {
  console.log((cond ? 'PASS  ' : 'FAIL  ') + name + (extra ? '   :: ' + extra : ''));
  if (!cond) fails++;
}

/* ---------------------------------------------------------------------------
   載入 runner.js（它只會定義 window.Runner，不會碰 DOM）
   ------------------------------------------------------------------------- */
function loadRunner() {
  const sb = { window: {} };
  vm.createContext(sb);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'runner.js'), 'utf8'), sb, { filename: 'runner.js' });
  return sb.window.Runner;
}

const Runner = loadRunner();
check('runner.js 載入後有 window.Runner', !!Runner);
check('Runner 提供 run / renderCode / renderOutput / buildSrcdoc',
  !!(Runner.run && Runner.renderCode && Runner.renderOutput && Runner.buildSrcdoc));

/* ---------------------------------------------------------------------------
   抽出 srcdoc 裡面的沙箱腳本
   ------------------------------------------------------------------------- */
function extractSandboxScript(srcdoc) {
  const m = /<script>([\s\S]*?)<\/script>/.exec(srcdoc);
  return m ? m[1] : null;
}

/* ---------------------------------------------------------------------------
   在 Node 裡模擬沙箱環境，跑一段學員程式碼，回傳 { messages, token, result }
     learnerCode 有值 → 模擬 console 模式：送出程式碼、執行、回報
     learnerCode 為 null → 模擬 preview 模式：觸發 DOMContentLoaded 之後回報
   ------------------------------------------------------------------------- */
function runInFakeSandbox(srcdoc, learnerCode) {
  const script = extractSandboxScript(srcdoc);
  const messages = [];
  const timers = [];
  const handlers = {};

  const fakeWindow = {
    addEventListener: function (type, fn) { (handlers[type] = handlers[type] || []).push(fn); },
    removeEventListener: function () {},
    jsOut: null
  };

  /* 內層在 preview 模式會讀 document.readyState 並註冊 DOMContentLoaded */
  const fakeDocument = {
    readyState: 'loading',
    addEventListener: function (type, fn) {
      const key = 'doc:' + type;
      (handlers[key] = handlers[key] || []).push(fn);
    }
  };

  const sandbox = {
    window: fakeWindow,
    document: fakeDocument,
    parent: { postMessage: function (payload) { messages.push(payload); } },
    console: { log: function () {}, info: function () {}, warn: function () {}, error: function () {} },
    setTimeout: function (fn) { timers.push(fn); return timers.length; },
    clearTimeout: function () {},
    JSON: JSON, Math: Math, Array: Array, Object: Object, String: String, Number: Number,
    Date: Date
  };
  sandbox.window.console = sandbox.console;
  vm.createContext(sandbox);
  vm.runInContext(script, sandbox, { filename: 'sandbox' });

  /* ready 訊息一定會有，token 由它提供 */
  const ready = messages.filter(function (m) { return m && m.ready; })[0];
  const token = ready ? ready.token : null;

  if (learnerCode != null) {
    (handlers.message || []).forEach(function (fn) {
      fn({ data: { token: token, cmd: 'run', code: learnerCode } });
    });
  } else {
    /* 模擬文件載入完成（preview 模式靠這個事件回報，不用 timer） */
    (handlers['doc:DOMContentLoaded'] || []).forEach(function (fn) { fn(); });
  }

  /* 清空 timer 佇列（正常情況下已經沒有 timer 依賴，這裡只是保險） */
  while (timers.length) timers.shift()();

  const result = messages.filter(function (m) { return m && m.run; }).pop();
  return { messages: messages, token: token, result: result, handlers: handlers };
}

/* ===========================================================================
   1) buildSrcdoc
   =========================================================================== */
const cssDoc = Runner.buildSrcdoc({
  code: 'p { color: red; }',
  lang: 'css',
  mode: 'preview',
  previewHtml: '<p>示範</p>'
});
check('[buildSrcdoc/CSS] 有 DOCTYPE', /^<!DOCTYPE html>/i.test(cssDoc));
check('[buildSrcdoc/CSS] 學員 CSS 放進 <style>', cssDoc.indexOf('<style>p { color: red; }</style>') !== -1);
check('[buildSrcdoc/CSS] 固定 HTML 放進 <body>', /<body><p>示範<\/p><\/body>/.test(cssDoc));
check('[buildSrcdoc/CSS] 有沙箱腳本', !!extractSandboxScript(cssDoc));

const cssDefault = Runner.buildSrcdoc({ code: 'p{}', lang: 'css', mode: 'preview' });
check('[buildSrcdoc/CSS] 沒給 previewHtml 時用預設示範 HTML',
  cssDefault.indexOf(Runner.DEFAULT_CSS_HTML.slice(0, 20)) !== -1);

const fragDoc = Runner.buildSrcdoc({ code: '<h1>你好</h1>', lang: 'html', mode: 'preview' });
check('[buildSrcdoc/HTML 片段] 片段放進 <body>', /<body><h1>你好<\/h1><\/body>/.test(fragDoc));

const fullDoc = Runner.buildSrcdoc({
  code: '<!DOCTYPE html>\n<html lang="zh-Hant-HK">\n<head>\n<title>我個網頁</title>\n</head>\n<body>\n<h1>Hi</h1>\n</body>\n</html>',
  lang: 'html',
  mode: 'preview'
});
check('[buildSrcdoc/完整文件] DOCTYPE 留在最前面', /^<!DOCTYPE html>/i.test(fullDoc));
check('[buildSrcdoc/完整文件] 注入碼放在 <head> 之後', /<head>\s*<script>/.test(fullDoc));
check('[buildSrcdoc/完整文件] 學員的 title 仍然存在', fullDoc.indexOf('<title>我個網頁</title>') !== -1);

/* ===========================================================================
   2) 沙箱腳本本身要語法正確
   =========================================================================== */
const sandboxScript = extractSandboxScript(cssDoc);
let syntaxOk = true;
let syntaxErr = '';
try { new vm.Script(sandboxScript); } catch (e) { syntaxOk = false; syntaxErr = e.message; }
check('[沙箱] 產生的內層腳本語法正確', syntaxOk, syntaxErr);

/* ===========================================================================
   3) console.log 格式（要同 Chrome DevTools 一致）
   =========================================================================== */
const schemaTests = [
  { code: 'console.log("你好");', expect: '你好', label: '字串不加引號' },
  { code: 'console.log("a", 1);', expect: 'a 1', label: '多個參數用空格分隔' },
  { code: 'console.log([1,2,3]);', expect: '[ 1, 2, 3 ]', label: '數字陣列' },
  { code: 'console.log(["A","B"]);', expect: "[ 'A', 'B' ]", label: '字串陣列用單引號' },
  { code: 'console.log({ name: "阿明", age: 20 });', expect: "{ name: '阿明', age: 20 }", label: '物件' },
  { code: 'console.log(true, null, undefined);', expect: 'true null undefined', label: '布林 / null / undefined' },
  { code: 'console.log([]);', expect: '[]', label: '空陣列' },
  { code: 'console.log({});', expect: '{}', label: '空物件' },
  { code: 'console.log(1 + 2);', expect: '3', label: '算式先計好' }
];

const previewDoc = Runner.buildSrcdoc({ code: '', lang: 'html', mode: 'preview' });
schemaTests.forEach(function (t) {
  const r = runInFakeSandbox(previewDoc, t.code);
  const got = r.result && r.result.logs && r.result.logs[0]
    ? r.result.logs[0].parts.map(function (p) { return p.text; }).join(' ')
    : '(沒有回報)';
  check('[格式] ' + t.label + ' → ' + JSON.stringify(t.expect), got === t.expect, '實際：' + JSON.stringify(got));
});

/* 多行輸出 */
const multi = runInFakeSandbox(previewDoc, 'console.log("第一行");\nconsole.log("第二行");');
check('[格式] 兩次 console.log 會產生兩行',
  !!multi.result && multi.result.logs.length === 2 &&
  multi.result.logs[1].parts[0].text === '第二行',
  multi.result ? JSON.stringify(multi.result.logs.map(function (l) { return l.parts[0].text; })) : '');

/* ===========================================================================
   4) 錯誤處理
   =========================================================================== */
const errRun = runInFakeSandbox(previewDoc, 'throw new Error("爆咗");');
const errEntry = errRun.result && errRun.result.logs.filter(function (l) { return l.level === 'error'; })[0];
check('[錯誤] throw 會變成 error 級別的輸出而不是整個爆掉',
  !!errEntry && /爆咗/.test(errEntry.parts.map(function (p) { return p.text; }).join(' ')),
  errEntry ? JSON.stringify(errEntry.parts[0].text) : '(冇 error 輸出)');

const refErr = runInFakeSandbox(previewDoc, 'console.log(notDefined);');
const refEntry = refErr.result && refErr.result.logs.filter(function (l) { return l.level === 'error'; })[0];
check('[錯誤] 用未宣告的變數會顯示 ReferenceError',
  !!refEntry && /notDefined/.test(refEntry.parts.map(function (p) { return p.text; }).join(' ')),
  refEntry ? JSON.stringify(refEntry.parts[0].text) : '(冇 error 輸出)');

/* console 模式：應該要有 message 監聽器 */
const consoleDoc = Runner.buildSrcdoc({ code: '', lang: 'js', mode: 'console' });
const consoleRun = runInFakeSandbox(consoleDoc, 'console.log("來自 console 模式");');
check('[console 模式] 有 message 監聽器並成功回報',
  !!consoleRun.result && consoleRun.result.logs[0].parts[0].text === '來自 console 模式',
  consoleRun.result ? JSON.stringify(consoleRun.result.logs[0].parts[0].text) : '(冇回報)');

const previewNoRun = runInFakeSandbox(previewDoc, null);
check('[preview 模式] ready 訊息有 token', !!previewNoRun.token);
check('[preview 模式] DOMContentLoaded 之後立即回報（不靠 timer）',
  !!previewNoRun.result, previewNoRun.result ? 'OK' : '(冇回報)');
check('[preview 模式] 有註冊 DOMContentLoaded 監聽器',
  (previewNoRun.handlers['doc:DOMContentLoaded'] || []).length > 0);

/* 重要回歸測試：內層腳本不可以用 setTimeout 回報結果
   （跨來源 iframe 的 timer 會被 Chrome 節流，會令練習永遠停在「執行中」） */
const scriptSrcAll = extractSandboxScript(previewDoc) + extractSandboxScript(consoleDoc);
check('[回歸] 沙箱腳本不再用 setTimeout 回報結果', scriptSrcAll.indexOf('setTimeout(finish') === -1);
check('[回歸] 沙箱腳本不再用 window load 事件回報', scriptSrcAll.indexOf('addEventListener("load"') === -1);

/* 重要回歸測試：每則訊息都要帶 runId
   （否則舊 iframe 的 ready 會令外層把程式碼送去未準備好的新 iframe，
     那次執行就會遺失，永遠停在「執行中」） */
const withIdDoc = Runner.buildSrcdoc({ code: '', lang: 'js', mode: 'console', runId: 'RID-1' });
const withIdRun = runInFakeSandbox(withIdDoc, 'console.log("x");');
check('[runId] 執行回報帶有正確的 runId',
  !!withIdRun.result && withIdRun.result.runId === 'RID-1',
  withIdRun.result ? JSON.stringify(withIdRun.result.runId) : '(冇回報)');
check('[runId] ready 訊息亦帶 runId',
  withIdRun.messages[0] && withIdRun.messages[0].runId === 'RID-1',
  withIdRun.messages[0] ? JSON.stringify(withIdRun.messages[0].runId) : '(冇 ready)');
check('[runId] 沒有指定 runId 時是 null（學習模組的預覽用）',
  previewNoRun.messages[0] && previewNoRun.messages[0].runId === null,
  previewNoRun.messages[0] ? JSON.stringify(previewNoRun.messages[0].runId) : '(冇 ready)');

/* ===========================================================================
   5) 語法高亮
   =========================================================================== */
const hlHtml = Runner.renderCode('<div class="card">文字 & 符號</div><!-- 註解 -->', 'html');
check('[高亮/HTML] 標籤名有 tk-tag', hlHtml.indexOf('tk-tag') !== -1);
check('[高亮/HTML] 屬性名有 tk-attr', hlHtml.indexOf('tk-attr') !== -1);
check('[高亮/HTML] 註解有 tk-comment', hlHtml.indexOf('tk-comment') !== -1);
check('[高亮/HTML] & 和 < 已經 escape（不會產生壞 HTML）',
  hlHtml.indexOf('&amp;') !== -1 && hlHtml.indexOf('&lt;') !== -1 && hlHtml.indexOf('<div') === -1,
  JSON.stringify(hlHtml.slice(0, 90)));

const hlCss = Runner.renderCode('.card {\n  color: #fff;\n  /* 註解 */\n  width: 50%;\n}', 'css');
check('[高亮/CSS] 屬性名有 tk-attr', hlCss.indexOf('tk-attr') !== -1);
check('[高亮/CSS] 顏色／數字有 tk-number', hlCss.indexOf('tk-number') !== -1);
check('[高亮/CSS] 註解有 tk-comment', hlCss.indexOf('tk-comment') !== -1);

const hlJs = Runner.renderCode('// 註解\nconst a = 1;\nconsole.log("嗨");', 'js');
check('[高亮/JS] 關鍵字有 tk-keyword', hlJs.indexOf('tk-keyword') !== -1);
check('[高亮/JS] 字串有 tk-string', hlJs.indexOf('tk-string') !== -1);
check('[高亮/JS] 註解有 tk-comment', hlJs.indexOf('tk-comment') !== -1);

/* 未知語言要退回 JS 高亮而不是拋錯 */
let fallbackOk = true;
try { Runner.renderCode('abc', 'python'); } catch (e) { fallbackOk = false; }
check('[高亮] 未知語言不會拋錯', fallbackOk);

/* 高亮不可以產生未 escape 的 < > */
['html', 'css', 'js'].forEach(function (lang) {
  const out = Runner.renderCode('<script>alert(1)</script>', lang);
  check('[高亮/' + lang + '] 不會原樣輸出 <script>', out.indexOf('<script>') === -1);
});

/* ===========================================================================
   6) renderOutput
   =========================================================================== */
const out1 = Runner.renderOutput([
  { level: 'log', parts: [{ text: '普通輸出' }] },
  { level: 'warn', parts: [{ text: '警告' }] },
  { level: 'error', parts: [{ text: '錯誤' }] }
], null, false, false);
check('[輸出] log/warn/error 各有對應 class',
  out1.indexOf('line-err') !== -1 && out1.indexOf('line-warn') !== -1 && out1.indexOf('普通輸出') !== -1);

const out2 = Runner.renderOutput([], '執行超時', true, false);
check('[輸出] 逾時會顯示 ⏱️ 同錯誤訊息', out2.indexOf('⏱️') !== -1 && out2.indexOf('執行超時') !== -1);

const out3 = Runner.renderOutput([], null, false, true);
check('[輸出] 截斷提示', out3.indexOf('200') !== -1);

const out4 = Runner.renderOutput([{ level: 'log', parts: [{ text: '<b>不是標籤</b>' }] }], null, false, false);
check('[輸出] 會 escape HTML', out4.indexOf('&lt;b&gt;') !== -1);

/* ===========================================================================
   結果
   =========================================================================== */
console.log('\n===== ' + (fails ? 'FAIL (' + fails + ')' : 'ALL PASS') + ' =====');
process.exit(fails ? 1 : 0);
