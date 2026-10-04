#!/usr/bin/env node
/* ============================================================================
   練習答案檢查器（開發工具，網站執行時「不需要」這個檔案）
   ----------------------------------------------------------------------------
   用法（在專案資料夾執行）：
       node tools/check-solutions.js

   它會拿每一章的「參考答案」去驗證：

     1. console 模式（JavaScript 練習）
        → 真的用 Node 執行那段 solution，收集 console.log 輸出，
          檢查輸出是否包含 puzzle.expect（否則學員照抄答案都不會過關）。
          ※ 用 vm 的 timeout，所以就算答案有死循環都會被中断，不會卡住。

     2. preview 模式
        → 檢查 solution 是否包含 puzzle.expectCode（否則照抄答案也不會過關）。
        → 如果是 CSS，額外檢查大括號 {} 是否成對。

   任何一項失敗都會以 exit code 1 結束。
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const FILES = ['data-html.js', 'data-css.js', 'data-js.js'];

const errors = [];
const warnings = [];
const notes = [];

/* 把值轉成類似 Chrome DevTools console.log 的字串
   （同 runner.js 的沙箱顯示格式保持一致，這樣才能正確比對課程資料的 result）
   console.log('a')        → a
   console.log(['A','B'])  → [ 'A', 'B' ]
   console.log({n:'花'})   → { n: '花' } */
function quote(s) {
  return "'" + String(s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t') + "'";
}

function inspect(v, depth, seen) {
  depth = depth || 0;
  seen = seen || [];

  if (v === undefined) return 'undefined';
  if (v === null) return 'null';

  const t = typeof v;
  if (t === 'string') return depth === 0 ? v : quote(v);
  if (t === 'number' || t === 'boolean') return String(v);
  if (t === 'bigint') return String(v) + 'n';
  if (t === 'symbol') return String(v);
  if (t === 'function') return 'ƒ ' + (v.name || 'anonymous') + '()';

  if (v instanceof Date) return v.toString();
  if (seen.indexOf(v) !== -1) return '[Circular]';
  seen = seen.concat([v]);
  if (depth > 3) return Array.isArray(v) ? '[Array]' : '[Object]';

  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    const items = [];
    for (let i = 0; i < v.length && i < 100; i++) items.push(inspect(v[i], depth + 1, seen));
    if (v.length > 100) items.push('… ' + (v.length - 100) + ' more items');
    return '[ ' + items.join(', ') + ' ]';
  }

  let keys;
  try { keys = Object.keys(v); } catch (e) { return String(v); }
  if (!keys.length) return '{}';
  const parts = [];
  for (let j = 0; j < keys.length && j < 100; j++) {
    parts.push(keys[j] + ': ' + inspect(v[keys[j]], depth + 1, seen));
  }
  return '{ ' + parts.join(', ') + ' }';
}

function fmt(v) {
  try { return inspect(v, 0, []); } catch (e) { return String(v); }
}

/* 由一段 CSS 抽出所有選擇器（用在「選擇器有冇對應到 HTML」的檢查） */
function extractSelectors(css) {
  const noComment = String(css).replace(/\/\*[\s\S]*?\*\//g, '');
  const sels = [];
  const re = /([^{}]+)\{/g;
  let m;
  while ((m = re.exec(noComment)) !== null) {
    m[1].split(',').forEach(function (s) {
      const t = s.trim();
      if (t && t.charAt(0) !== '@') sels.push(t);
    });
  }
  return sels;
}

/* 找出「CSS 選擇器講嘅元素，HTML 裡面根本冇」的情況。
   這種情況下學員／預覽寫得再對都睇唔到任何效果，是最常見的 CSS 教材錯誤。 */
function findMissingTargets(css, html) {
  const missing = [];
  extractSelectors(css).forEach(function (sel) {
    sel.split(/[\s>+~]+/).filter(Boolean).forEach(function (part) {
      const simple = part.replace(/::?[a-zA-Z-]+(\([^)]*\))?/g, '').trim();
      if (!simple || simple === '*') return;
      if (simple.charAt(0) === '.') {
        if (String(html).indexOf(simple.slice(1)) === -1) missing.push(simple);
      } else if (simple.charAt(0) === '#') {
        if (String(html).indexOf(simple.slice(1)) === -1) missing.push(simple);
      } else {
        const tag = simple.replace(/\[[^\]]*\]/g, '');
        if (!tag) return;
        if (!new RegExp('<' + tag + '[\\s>/]', 'i').test(String(html))) missing.push(tag);
      }
    });
  });
  return missing;
}

/* 在受限的沙箱裡執行一段 JS，回傳 console 輸出 */
function runJs(code) {
  const logs = [];

  // 注意：一定要用 function（不是箭頭函式），才拿得到 arguments
  function push() {
    logs.push(Array.prototype.map.call(arguments, fmt).join(' '));
  }

  const sandbox = {
    console: { log: push, info: push, warn: push, error: push },
    Math: Math, JSON: JSON, Date: Date, Number: Number, String: String,
    Boolean: Boolean, Array: Array, Object: Object, parseInt: parseInt,
    parseFloat: parseFloat, isNaN: isNaN, undefined: undefined
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { timeout: 1500 });
  return logs.join('\n');
}

/* 載入三個資料檔 */
const sandbox = { window: {} };
vm.createContext(sandbox);
FILES.forEach(function (f) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) { warnings.push('缺少檔案：' + f); return; }
  try {
    vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: f });
  } catch (e) {
    errors.push(f + ' 執行失敗：' + e.message);
  }
});

const DATA = sandbox.window.LEARN_DATA;
if (!DATA || !Array.isArray(DATA.subjects)) {
  console.error('❌ 讀不到 window.LEARN_DATA');
  process.exit(1);
}

let checked = 0;

DATA.subjects.forEach(function (sub) {
  (sub.chapters || []).forEach(function (ch) {
    /* ---- 0) 學習點的即時預覽：CSS 選擇器要對得上預覽的 HTML ----
       （同下面練習的檢查同一個道理：對唔上就即係學員睇唔到任何效果） */
    (ch.points || []).forEach(function (pt, pi) {
      if (!pt.preview || !pt.preview.css) return;
      const missing = findMissingTargets(pt.preview.css, pt.preview.html || '');
      if (missing.length) {
        warnings.push(`${sub.id} / ${ch.id} 學習點${pi + 1}「${pt.title}」：` +
          `preview.css 的選擇器 ${missing.join('、')} 在 preview.html 找不到對應元素，` +
          '學員會睇唔到效果');
      }
    });

    const pz = ch.puzzle;
    if (!pz) return;

    const where = `${sub.id} / ${ch.id} ${ch.title}`;
    const mode = pz.mode || sub.runMode;
    const lang = pz.lang || sub.codeLang;
    const solution = pz.solution || '';
    checked++;

    /* ---- 1) solution 不應該是空的 ---- */
    if (!solution.trim()) {
      errors.push(`${where}：solution 是空的`);
      return;
    }

    /* ---- 1b) starter 不應該一開始就包含 expectCode ----
       （否則學員未做任何事就會自動過關） */
    if (pz.expectCode && typeof pz.starter === 'string' &&
        pz.starter.toLowerCase().indexOf(String(pz.expectCode).toLowerCase()) !== -1) {
      errors.push(`${where}：starter 已經包含 expectCode「${pz.expectCode}」，學員未做就已經過關`);
    }

    /* ---- 2) preview 模式：檢查 expectCode ---- */
    if (mode === 'preview') {
      if (pz.expectCode) {
        if (solution.toLowerCase().indexOf(String(pz.expectCode).toLowerCase()) === -1) {
          errors.push(`${where}：參考答案沒有包含 expectCode「${pz.expectCode}」，學員照抄都不會過關`);
        }
      } else {
        warnings.push(`${where}：preview 模式沒有 expectCode，學員的答案不會被檢查`);
      }

      if (lang === 'css') {
        const open = (solution.match(/\{/g) || []).length;
        const close = (solution.match(/\}/g) || []).length;
        if (open !== close) {
          errors.push(`${where}：CSS 參考答案大括號不成對（{ ×${open}、} ×${close}）`);
        }
        if (!pz.previewHtml) {
          errors.push(`${where}：CSS 練習缺少 previewHtml`);
        } else {
          /* 檢查 CSS 選擇器是否真的對應到固定 HTML 裡的元素，
             否則學員寫對 CSS 都不會見到任何變化。 */
          const missing = findMissingTargets(solution, pz.previewHtml);
          if (missing.length) {
            warnings.push(`${where}：CSS 選擇器 ${missing.join('、')} 在 previewHtml 裡找不到對應元素，` +
              '學員寫對都不會見到變化');
          }
        }
      }
      return;
    }

    /* ---- 3) console 模式：真的執行 solution ---- */
    let output;
    try {
      output = runJs(solution);
    } catch (e) {
      errors.push(`${where}：參考答案執行時出錯 → ${e.message}`);
      return;
    }

    if (!output.trim()) {
      errors.push(`${where}：參考答案沒有任何 console 輸出（學員會看不到結果）`);
      return;
    }

    if (pz.expect) {
      if (output.indexOf(String(pz.expect)) === -1) {
        errors.push(`${where}：參考答案的輸出沒有包含 expect「${pz.expect}」\n` +
          `      實際輸出：${JSON.stringify(output.slice(0, 200))}`);
      } else {
        notes.push(`OK  ${where} → 輸出包含「${pz.expect}」`);
      }
    } else {
      warnings.push(`${where}：console 模式沒有 expect，學員的答案不會被檢查`);
    }
  });
});

console.log('===== 練習答案檢查報告 =====');
console.log(`已檢查 ${checked} 個練習。`);
notes.slice(0, 12).forEach(function (n) { console.log('  ' + n); });
if (notes.length > 12) console.log(`  …（其餘 ${notes.length - 12} 個同樣通過）`);

/* ---------------------------------------------------------------------------
   額外模式：--points
   把 JS 科每個「學習點」的 code 真的跑一次，同資料裡聲明的 result 比對。
   純粹提示用（有些學習點是刻意示範錯誤，所以不會當成錯誤）。
   ------------------------------------------------------------------------- */
if (process.argv.indexOf('--points') !== -1) {
  const diffs = [];
  let ran = 0;

  function norm(s) {
    const lines = String(s).split('\n').map(function (l) { return l.replace(/\s+$/, ''); });
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    return lines.join('\n');
  }

  DATA.subjects.forEach(function (sub) {
    (sub.chapters || []).forEach(function (ch) {
      (ch.points || []).forEach(function (p, i) {
        const lang = p.lang || sub.codeLang;
        if (lang !== 'js' || !p.code || !p.result) return;
        ran++;
        const where = `${sub.id} / ${ch.id} 學習點${i + 1} ${p.title}`;
        let out;
        try {
          out = runJs(p.code);
        } catch (e) {
          diffs.push({ where: where, kind: '執行出錯', actual: e.message, declared: p.result });
          return;
        }
        if (norm(out) !== norm(p.result)) {
          diffs.push({ where: where, kind: '輸出不同', actual: out, declared: p.result });
        }
      });
    });
  });

  console.log('\n===== 學習點 result 抽查（--points）=====');
  console.log(`已跑 ${ran} 個 JS 學習點。`);
  if (!diffs.length) {
    console.log('✅ 全部同資料聲明的 result 一致。');
  } else {
    console.log(`⚠️  有 ${diffs.length} 個需要人手確認：`);
    diffs.forEach(function (d) {
      console.log('--- ' + d.where + '（' + d.kind + '）');
      console.log('    實際  : ' + JSON.stringify(d.actual).slice(0, 240));
      console.log('    聲明  : ' + JSON.stringify(d.declared).slice(0, 240));
    });
  }
}

if (warnings.length) {
  console.log('\n--- 警告（' + warnings.length + '）---');
  warnings.forEach(function (w) { console.log('⚠️  ' + w); });
}
if (errors.length) {
  console.log('\n--- 錯誤（' + errors.length + '）---');
  errors.forEach(function (e) { console.log('❌ ' + e); });
  process.exit(1);
}
console.log('\n✅ 全部練習的參考答案都通過檢查。');
