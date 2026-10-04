#!/usr/bin/env node
/* ============================================================================
   顏色寫法統一工具（開發工具，網站執行時「不需要」這個檔案）
   ----------------------------------------------------------------------------
   為甚麼要這樣做？
     零基礎學員睇 <code>#0b6e63</code> 係完全唔知咩色，阻礙理解。
     所以課程的顏色寫法統一改成「英文顏色名」（teal、crimson、lightyellow…），
     這些名一睇就明，而且係 CSS 標準名稱，一樣可以照用。
     只有在講「透明」時才保留 rgba()（因為那正是教學重點）。

   用法：
       node tools/normalize-colors.js --dry    只報告
       node tools/normalize-colors.js          直接改寫 data-*.js

   安全設計：
     每個替換目標都會對照「官方 CSS 顏色名單」驗證，
     打錯字（例如 lightyellow 寫成 lightyelow）會立即報錯，唔會靜靜地失效。
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FILES = ['data-html.js', 'data-css.js', 'data-js.js'];
const DRY = process.argv.indexOf('--dry') !== -1;

/* 官方 CSS 具名顏色（用來驗證替換目標） */
const NAMED = new Set(('aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue ' +
  'blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan ' +
  'darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange ' +
  'darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet ' +
  'deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite ' +
  'gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush ' +
  'lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey ' +
  'lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow ' +
  'lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen ' +
  'mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin ' +
  'navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise ' +
  'palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue ' +
  'saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow ' +
  'springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen')
  .split(' '));

/* 色碼 → 顏色名。只保留相近色相／明度，避免文字與背景的對比爆掉。 */
const MAP = {
  '#0b6e63': 'teal',
  '#ffffff': 'white',
  '#fff': 'white',
  '#333333': 'dimgray',
  '#94a3b8': 'darkgray',
  '#64748b': 'slategray',
  '#e0f2fe': 'lightcyan',
  '#cbd5e1': 'lightgray',
  '#dbeafe': 'aliceblue',
  '#fef3c7': 'lightyellow',
  '#f1f5f9': 'whitesmoke',
  '#dcfce7': 'honeydew',
  '#b45309': 'chocolate',
  '#fef9c3': 'lightyellow',
  '#fde68a': 'khaki',
  '#be123c': 'crimson',
  '#e2e8f0': 'gainsboro',
  '#e0a800': 'gold',
  '#1e293b': 'darkslategray',
  '#475569': 'slategray',
  '#0369a1': 'steelblue',
  '#b91c1c': 'darkred',
  '#f59e0b': 'orange',
  '#666': 'gray',
  '#bfdbfe': 'lightblue',
  '#0f172a': 'midnightblue',
  '#6c757d': 'gray',
  '#dc3545': 'crimson',
  '#e6f6f4': 'lightcyan',
  '#fff4c2': 'lightyellow',
  '#6b4b16': 'saddlebrown',
  '#123c69': 'navy',
  '#b00020': 'darkred',
  '#6b7280': 'gray',
  '#334155': 'darkslategray',
  '#f8fafc': 'whitesmoke',
  '#7c3aed': 'blueviolet',
  '#888': 'gray',
  '#0a7': 'teal',
  '#c084fc': 'mediumpurple',
  '#bae6fd': 'lightblue',
  '#fca5a5': 'lightcoral',
  '#fbcfe8': 'pink',
  '#93c5fd': 'lightskyblue',
  '#fef08a': 'khaki',
  '#ede9fe': 'lavender',
  '#dee2e6': 'gainsboro',
  '#d1e7dd': 'honeydew',
  '#0f5132': 'darkgreen',
  '#badbcc': 'lightgreen',
  '#fff3cd': 'lightyellow',
  '#664d03': 'olive',
  '#ffecb5': 'moccasin',
  '#fee2e2': 'mistyrose',
  '#eef2f7': 'whitesmoke',
  '#fbc2eb': 'pink',
  '#a6c1ee': 'lightblue',
  '#0d6efd': 'royalblue',
  '#cfe2ff': 'aliceblue',
  '#9ec5fe': 'lightskyblue'
};

/* 非色碼的寫法（先處理較長的 pattern） */
const SPECIAL = [
  ['rgba(11, 110, 99, 0.2)', 'rgba(0, 128, 128, 0.2)'],
  ['rgb(11, 110, 99)', 'teal'],
  ['rgba(15,23,42,.08)', 'rgba(0, 0, 0, 0.08)']
];

/* 驗證每個替換目標 */
let bad = 0;
Object.keys(MAP).forEach(function (k) {
  const v = MAP[k];
  if (!NAMED.has(v)) { console.error('❌ 替換目標不是官方 CSS 顏色名：' + k + ' → ' + v); bad++; }
});
if (bad) process.exit(1);

let grand = 0;

FILES.forEach(function (file) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) { console.log('（跳過）' + file); return; }
  let text = fs.readFileSync(p, 'utf8');
  const counts = {};

  SPECIAL.forEach(function (pair) {
    const parts = text.split(pair[0]);
    if (parts.length > 1) {
      counts[pair[0] + ' → ' + pair[1]] = parts.length - 1;
      text = parts.join(pair[1]);
    }
  });

  Object.keys(MAP).forEach(function (hex) {
    /* 用大小寫不敏感的方式找，但只替換完整色碼（後面不可以再接 hex 字元） */
    const re = new RegExp(hex.replace('#', '#') + '(?![0-9a-fA-F])', 'gi');
    const found = text.match(re);
    if (!found) return;
    counts[hex + ' → ' + MAP[hex]] = found.length;
    text = text.replace(re, MAP[hex]);
  });

  const keys = Object.keys(counts);
  if (!keys.length) { console.log(file + '：不需要修改'); return; }
  const sum = keys.reduce(function (a, k) { return a + counts[k]; }, 0);
  grand += sum;
  console.log(file + '：' + sum + ' 處');
  keys.sort().forEach(function (k) { console.log('    ' + String(counts[k]).padStart(3) + '  ' + k); });

  if (!DRY) fs.writeFileSync(p, text, 'utf8');
});

console.log((DRY ? '[dry-run] 將會修改 ' : '已修改 ') + grand + ' 處。');
if (!DRY && grand) {
  console.log('改完記得跑：node tools/validate-data.js 及 node tools/check-solutions.js');
}
