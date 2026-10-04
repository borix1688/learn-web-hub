/* ============================================================================
   自動化煙霧測試（開發工具，網站執行時「不需要」這個檔案）
   ----------------------------------------------------------------------------
   為甚麼要有它？
     這個網站有 6 個 JS 檔案互相配合（資料 → 沙箱 → 測驗 → 主程式），
     任何一個 id / class 名對唔上，學員一打開就會撞板。所以我們用
     headless Chrome 真的把網站開一次，模擬學員撳掣，檢查每個模組有冇正常運作。

   用法（兩步，中間要用 PowerShell 執行 Chrome）：
      1) node tools/smoke-test.js build      → 產生 tools/_smoke.html
      2) & "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
           --headless=new --disable-gpu --no-first-run --no-default-browser-check ^
           --user-data-dir=tools\_chrome-profile --virtual-time-budget=25000 ^
           --dump-dom "file:///<專案路徑>/tools/_smoke.html" > tools\_smoke-dom.html
      3) node tools/smoke-test.js parse      → 印出測試結果

   它會做嘅事：
     build  → 讀 index.html，把 ./xxx 改成 ../xxx，注入錯誤收集器 + 測試腳本
     parse  → 由 dump 出嚟嘅 DOM 抽出 <pre id="smoke-log"> 嘅內容並印出
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TOOLS = __dirname;
const SMOKE_HTML = path.join(TOOLS, '_smoke.html');
const SMOKE_DOM = path.join(TOOLS, '_smoke-dom.html');

/* ---------------------------------------------------------------------------
   build：產生 tools/_smoke.html
   ------------------------------------------------------------------------- */
function build() {
  const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

  // 1) 相對路徑要由 tools/ 出發
  let html = index.replace(/(href|src)="\.\//g, '$1="../');

  // 2) 注入「錯誤收集器」（一定要在所有其他腳本之前，
  //    但要放在 <meta charset> 之後，否則瀏覽器可能判斷錯編碼令中文變亂碼）
  const collector =
    '<script>\n' +
    'window.__errors = [];\n' +
    'window.addEventListener("error", function (e) {\n' +
    '  window.__errors.push(String(e.message) + " @ " + (e.filename || "") + ":" + (e.lineno || 0));\n' +
    '});\n' +
    'window.addEventListener("unhandledrejection", function (e) {\n' +
    '  window.__errors.push("unhandledrejection: " + String((e.reason && e.reason.message) || e.reason));\n' +
    '});\n' +
    '</script>\n';

  const headOpen = /<head>\s*<meta charset="[^"]*"\s*\/?>/i;
  if (headOpen.test(html)) {
    html = html.replace(headOpen, function (all) { return all + '\n' + collector; });
  } else {
    html = html.replace(/<head>/i, function (all) { return all + collector; });
  }

  // 3) 在 </body> 之前注入測試腳本
  html = html.replace('</body>', '<script src="./_smoke-assert.js"></script>\n</body>');

  fs.writeFileSync(SMOKE_HTML, html, 'utf8');
  console.log('已產生 ' + SMOKE_HTML);
}

/* ---------------------------------------------------------------------------
   parse：抽出測試結果
   ------------------------------------------------------------------------- */
function decodeEntities(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

function parse() {
  /* 優先讀「真實時間」模式的結果（beacon-server.js 收到並寫入的檔案），
     沒有的話才讀 chrome --dump-dom 的輸出。
     可以指定 tag：node tools/smoke-test.js parse mobile
     → 讀 tools/_smoke-result-mobile.txt */
  const tag = process.argv[3] ? String(process.argv[3]).replace(/[^\w-]/g, '') : '';
  const BEACON = path.join(TOOLS, tag ? '_smoke-result-' + tag + '.txt' : '_smoke-result.txt');
  let text = null;

  if (fs.existsSync(BEACON)) {
    text = fs.readFileSync(BEACON, 'utf8');
    console.log('（讀取真實時間模式結果：tools/' + path.basename(BEACON) + '）');
    console.log(text);
    process.exit(/FAIL|EXCEPTION/.test(text) ? 1 : 0);
  }

  if (!fs.existsSync(SMOKE_DOM)) {
    console.error('找不到 ' + SMOKE_DOM + ' 或 ' + BEACON + '。');
    console.error('請用 tools/beacon-server.js 的真實時間模式，或用 headless Chrome --dump-dom。');
    process.exit(2);
  }
  const dom = fs.readFileSync(SMOKE_DOM, 'utf8');
  const m = /<pre id="smoke-log">([\s\S]*?)<\/pre>/.exec(dom);
  if (!m) {
    console.error('❌ dump 出嚟嘅 DOM 裡面找不到 #smoke-log —— 即係測試腳本冇跑到（可能 app.js 一開始就拋錯）。');
    const err = /window\.__errors[\s\S]{0,400}/.exec(dom);
    if (err) console.error('線索：' + err[0].slice(0, 400));
    process.exit(1);
  }
  text = decodeEntities(m[1]);
  console.log(text);
  process.exit(/FAIL|EXCEPTION/.test(text) ? 1 : 0);
}

const cmd = process.argv[2];
if (cmd === 'build') build();
else if (cmd === 'parse') parse();
else if (cmd === 'clean') {
  const files = [SMOKE_HTML, SMOKE_DOM].concat(
    fs.readdirSync(TOOLS)
      .filter(function (f) { return /^_smoke-result.*\.txt$/.test(f); })
      .map(function (f) { return path.join(TOOLS, f); })
  );
  files.forEach(function (f) {
    if (fs.existsSync(f)) { fs.unlinkSync(f); console.log('已刪除 ' + f); }
  });
} else {
  console.log('用法：node tools/smoke-test.js build|parse|clean');
  process.exit(2);
}
