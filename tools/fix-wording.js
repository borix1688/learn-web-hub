#!/usr/bin/env node
/* ============================================================================
   用語還原腳本（一次性，已經跑過；保留作紀錄）
   ----------------------------------------------------------------------------
   背景：
     驗證器早期的「簡體字提示」名單誤把「面」列為簡體字，導致編寫課程時
     刻意避開「面」字，把「上面／下面／裏面／入面」寫成「上邊／下邊／裏面→裏邊」，
     又用「下方／上方」代替「下面／上面」。
     名單已修正，這裡把用語還原成香港人更常寫、更口語的講法。

   安全設計（重要）：
     1. 「以下邊句」「之後邊個」裡面的「邊」是疑問詞（邊句 = 哪一句），
        唔可以變成「下面句」。所以用 lookbehind 排除前面是「以」或「之」的情況，
        後面接疑問詞（邊個／邊句／邊位…）亦一律不動。
     2. 「上下方向」裡面的「下方」是「上下 + 方向」，唔可以變成「上下面向」，
        所以加 lookahead 排除後面是「向」的情況。
     3. 「左邊／右邊」是正確粵語，保持不變。

   用法：
     node tools/fix-wording.js --dry    只報告，不寫入
     node tools/fix-wording.js          直接改寫 data-*.js
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FILES = ['data-html.js', 'data-css.js', 'data-js.js'];
const DRY = process.argv.indexOf('--dry') !== -1;

const RULES = [
  {
    name: '方位詞：X邊 → X面',
    /* 後面接住空白的一律不動：那多數是「左邊 10px、上邊 20px」這類
       同「邊」一致的寫法，改成「面」反而前後不一致。 */
    re: /(?<![以之])(上|下|裏|入|外|前|後)邊(?![ 個句位種樣時度陣次條件隻啲條款邊])/g,
    to: function (m, head) { return head + '面'; }
  },
  {
    name: '下方 → 下面',
    re: /(?<!上)下方(?!向)/g,
    to: function () { return '下面'; }
  },
  {
    name: '上方 → 上面',
    re: /上方(?!向)/g,
    to: function () { return '上面'; }
  },
  {
    name: '章／課 統一（介面寫「章」）',
    /* 只改「第 N 課」「每課」這類章節指稱；
       「課程」（course）同「功課表」必須保留，所以前後都要排除。 */
    re: /(?<!功)課(?!程)/g,
    to: function () { return '章'; }
  }
];

let grand = 0;

FILES.forEach(function (file) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) { console.log('（跳過，不存在）' + file); return; }

  let text = fs.readFileSync(p, 'utf8');
  const report = [];

  RULES.forEach(function (rule) {
    let n = 0;
    text = text.replace(rule.re, function () {
      n++;
      return rule.to.apply(null, arguments);
    });
    if (n) report.push(rule.name + ' ×' + n);
  });

  if (!report.length) { console.log(file + '：不需要修改'); return; }

  const sum = report.reduce(function (a, s) { return a + Number(s.split('×')[1]); }, 0);
  grand += sum;
  console.log(file + '：' + report.join('、'));

  if (!DRY) fs.writeFileSync(p, text, 'utf8');
});

console.log((DRY ? '[dry-run] 將會修改 ' : '已修改 ') + grand + ' 處。');
if (!DRY && grand) {
  console.log('記得重新執行：node tools/validate-data.js 及 node tools/check-solutions.js');
}
