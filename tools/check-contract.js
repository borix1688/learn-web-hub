#!/usr/bin/env node
/* ============================================================================
   選擇器契約檢查（開發工具，網站執行時「不需要」這個檔案）
   ----------------------------------------------------------------------------
   用法（在專案資料夾執行）：
       node tools/check-contract.js

   為甚麼需要它？
     這個網站由 6 個 JS 檔案互相配合（index.html 提供骨架、app.js 產生畫面），
     如果 app.js 查詢一個 index.html 裡面唔存在的 id（例如打錯字：
     #overview-ring 而唔係 #overall-ring），網站就會在某一步靜靜地失效——
     冇紅字、冇提示，只係「撳咗冇反應」。這一類 bug 最難找。

   它會檢查：
     1. app.js / quiz.js 用 $('...')、$$('...')、querySelector()、getElementById()
        查詢的 #id 與 .class，是否真的存在於 index.html。
     2. index.html 有沒有重複的 id。
     3. 順便列出 index.html 有、但 JS 從未用過的 id（提示性質，唔算錯）。

   全部通過會以 exit code 0 結束。
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

/* ---- 收集 index.html 裡面所有的 id 與 class ---- */
const htmlIds = new Set();
(html.match(/\bid="([^"]+)"/g) || []).forEach(function (m) {
  htmlIds.add(m.replace(/.*id="([^"]+)".*/, '$1'));
});

const htmlClasses = new Set();
(html.match(/\bclass="([^"]+)"/g) || []).forEach(function (m) {
  m.replace(/.*class="([^"]+)".*/, '$1').split(/\s+/).forEach(function (c) {
    if (c) htmlClasses.add(c);
  });
});

let problems = 0;

/* ---- 檢查 JS 查詢的選擇器 ---- */
['app.js', 'quiz.js'].forEach(function (file) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const re = /(?:\$\$?|querySelectorAll?|getElementById)\(\s*'([^']+)'/g;
  let m;
  const seen = new Set();

  while ((m = re.exec(src)) !== null) {
    const sel = m[1];
    if (seen.has(sel)) continue;
    seen.add(sel);

    /* 只檢查單純的 #id / .class；含 [ ] 或空格的複雜選擇器跳過 */
    if (/^#[\w-]+$/.test(sel)) {
      const id = sel.slice(1);
      if (id.charAt(id.length - 1) === '-') continue;   // 動態組合的 id，例如 '#point-' + x + '-0'
      if (!htmlIds.has(id)) {
        console.log('❌ ' + file + ' 查詢 ' + sel + '，但 index.html 沒有這個 id');
        problems++;
      }
    } else if (/^\.[\w-]+$/.test(sel)) {
      const cls = sel.slice(1);
      if (!htmlClasses.has(cls)) {
        console.log('❌ ' + file + ' 查詢 ' + sel + '，但 index.html 沒有這個 class');
        problems++;
      }
    }
  }
});

/* ---- 重複 id ---- */
const idDefs = (html.match(/\bid="([^"]+)"/g) || []).map(function (m) {
  return m.replace(/.*id="([^"]+)".*/, '$1');
});
const dup = idDefs.filter(function (v, i) { return idDefs.indexOf(v) !== i; });
if (dup.length) {
  console.log('❌ index.html 有重複 id：' + dup.join('、'));
  problems++;
}

/* ---- 未被使用的 id（只提示） ---- */
const allJs = ['app.js', 'quiz.js']
  .map(function (f) { return fs.readFileSync(path.join(ROOT, f), 'utf8'); })
  .join('\n');
const unused = [];
htmlIds.forEach(function (id) {
  if (allJs.indexOf(id) === -1) unused.push(id);
});
if (unused.length) {
  console.log('ℹ️  index.html 有但 JS 未直接引用的 id（可能只是 aria 標籤，通常冇問題）：' + unused.join('、'));
}

console.log(problems
  ? '\n===== 契約檢查：FAIL (' + problems + ') ====='
  : '\n===== 契約檢查：ALL PASS =====');
process.exit(problems ? 1 : 0);
