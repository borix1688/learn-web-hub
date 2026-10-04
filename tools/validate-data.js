#!/usr/bin/env node
/* ============================================================================
   課程資料驗證器（開發工具，網站本身執行時「不需要」這個檔案）
   ----------------------------------------------------------------------------
   用法（在專案資料夾執行）：
       node tools/validate-data.js

   它會做三件事：
     1. 把 data-html.js / data-css.js / data-js.js 讀進一個獨立沙箱執行，
        檢查有沒有 JavaScript 語法錯誤。
     2. 檢查資料結構是否符合 _SPEC-課程資料格式.md 的規定
        （章節數、學習點數、測驗題數、答案索引、必要欄位…）。
     3. 提醒可能誤用簡體字的地方（只警告，不當錯誤）。

   全部通過會印出 ✅ 並以 exit code 0 結束；有錯誤則以 exit code 1 結束。
   ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const FILES = ['data-html.js', 'data-css.js', 'data-js.js'];
const LANGS = ['html', 'css', 'js'];
const MODES = ['preview', 'console'];
const QUIZ_TYPES = ['mc', 'tf'];

/* 只在簡體字出現、繁體中文不會用到的字（用來提示，不是判錯）
   注意：像「元、素、面、包、章、建、步、默、嵌」等在繁體同樣使用，所以不要放進來。 */
const SIMPLIFIED_ONLY =
  '学习网线规则会话练习测验节标题样对错这们个来后过还开关实现发觉单双击键图标记当应该读写说话为与从电脑软数据编语变组条断转换类属选择输认识让讲请问间时长门书见观视种点万东车内结缩进签闭历调异栈队针报抛获举层级复杂优简传删创听触绝宽颜体细隐显' +
  '运动员别义众儿处备极构检环织继绿维统联许试词谢议购货费载边达违远连迟邮钟钱铁银阴随难';

const errors = [];
const warnings = [];

function err(where, msg) { errors.push(`❌ ${where}：${msg}`); }
function warn(where, msg) { warnings.push(`⚠️  ${where}：${msg}`); }

function isNonEmptyString(v) { return typeof v === 'string' && v.trim().length > 0; }

/* ---------------------------------------------------------------------------
   文字欄位允許的 HTML 標籤
     task / hint        → 直接當 HTML 插入畫面（可以用 <code> <b> <br> <ul> 等）
     其他文字欄位        → 先 escape，只會還原 <code> <b> <strong> <em> <br>
   如果作者寫了主程式不認得的標籤，畫面就會出現一堆「<div>」字面文字，
   所以這裡提出警告（想顯示標籤本身應該寫 &lt;div&gt;）。
   ------------------------------------------------------------------------- */
const KNOWN_SAFE_RAW = /^(code|b|strong|em|br|i|u|small|kbd|ul|ol|li|p|span|div|table|tr|td|th|h1|h2|h3|h4|hr|blockquote)$/i;

/* ---------------------------------------------------------------------------
   顏色寫法檢查
     零基礎學員睇唔明色碼（#0b6e63 係咩色？），所以課程統一用：
       ‧ 說明文字（q／explain／task／hint／tip…）→ 用中文描述（深綠色、淺黃色）
       ‧ 程式碼 → 用官方英文顏色名（teal、crimson、lightyellow）
       ‧ 只有教「透明度」時才用 rgba()
     出現色碼就提出警告，避免日後又混入睇唔明嘅寫法。
   ------------------------------------------------------------------------- */
const HEX_COLOR = /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b/g;
const PROSE_FIELDS = ['q', 'explain', 'options', 'task', 'hint', 'tip', 'analogy', 'title', 'summary', 'result'];
const CODE_FIELDS = ['code', 'solution', 'starter', 'previewHtml', 'css', 'html'];
/* 如果色碼附近有這些字，就當作「已經有中文解說」，不再警告。
   例：<code>#b91c1c</code>（深紅色）——這樣寫反而係好教材。 */
const COLOR_GLOSS = /[色紅綠藍黃紫灰黑白橙粉啡金銀深淺淡]/;

function checkColors(where, field, text) {
  if (typeof text !== 'string') return;

  const bare = [];
  HEX_COLOR.lastIndex = 0;
  let m;
  while ((m = HEX_COLOR.exec(text)) !== null) {
    const around = text.slice(Math.max(0, m.index - 45), m.index + 45);
    if (COLOR_GLOSS.test(around)) continue;   // 附近有中文顏色描述 → 可以接受
    bare.push(m[0]);
  }
  if (!bare.length) return;

  const uniq = Array.from(new Set(bare)).join('、');
  if (PROSE_FIELDS.indexOf(field) !== -1) {
    warn(where, `${field} 出現冇解說嘅色碼 ${uniq}——學員睇唔明係咩色，` +
      '請改用中文描述（例如「深綠色」）或官方顏色名（teal、lightyellow）；' +
      '如果一定要寫色碼，請在旁邊用中文講明係咩色');
  } else if (CODE_FIELDS.indexOf(field) !== -1) {
    warn(where, `${field} 出現冇解說嘅色碼 ${uniq}——建議改用可讀嘅英文顏色名` +
      '（teal、crimson、lightyellow）；只有教透明度時才用 rgba()');
  }
}

function checkTags(where, field, text, raw) {  if (typeof text !== 'string') return;

  /* 非 raw 的欄位（title / analogy / tip / q / explain / options）：
     主程式會先 escape 再只還原 <code> <b> <strong> <em> <br>，
     所以其他標籤（例如 <p>、<title>）會原樣顯示成「<p>」——這通常正是作者想要的
     （教人認識標籤時就是想顯示標籤本身），因此不需要警告。 */
  if (!raw) return;

  const re = /<\/?([a-zA-Z][\w-]*)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const tag = m[1];
    if (KNOWN_SAFE_RAW.test(tag)) continue;
    warn(where, `${field} 用了 <${tag}>；這個欄位會直接當 HTML 插入畫面，` +
      '建議只用 <code> <b> <br> <ul> <li> <p> 等簡單標籤，避免影響版面');
  }
}

/* ---------------------------------------------------------------------------
   1) 載入三個資料檔
   ------------------------------------------------------------------------- */
const sandbox = { window: {} };
vm.createContext(sandbox);

const rawText = {};
FILES.forEach(function (f) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) { warn(f, '檔案未建立（如果只是驗證其中一科，可以忽略）'); return; }
  const code = fs.readFileSync(p, 'utf8');
  rawText[f] = code;
  try {
    vm.runInContext(code, sandbox, { filename: f });
  } catch (e) {
    err(f, '無法執行（多數是語法錯誤）：' + e.message);
  }
});

const DATA = sandbox.window.LEARN_DATA;
if (!DATA || !Array.isArray(DATA.subjects)) {
  err('全部', 'window.LEARN_DATA.subjects 不存在或不是陣列');
  report();
  process.exit(1);
}

/* ---------------------------------------------------------------------------
   2) 結構驗證
   ------------------------------------------------------------------------- */
const seenSubjectIds = {};
const seenChapterIds = {};
let totalPoints = 0, totalQuestions = 0, totalPuzzles = 0;

DATA.subjects.forEach(function (sub, si) {
  const S = `科目[${si}] ${sub && sub.id ? sub.id : '(無 id)'}`;

  if (!isNonEmptyString(sub.id)) err(S, '缺少 id');
  else if (seenSubjectIds[sub.id]) err(S, `id 重複：${sub.id}`);
  else seenSubjectIds[sub.id] = true;

  ['name', 'icon', 'tagline', 'intro'].forEach(function (k) {
    if (!isNonEmptyString(sub[k])) err(S, `缺少 ${k}`);
  });
  if (MODES.indexOf(sub.runMode) === -1) err(S, `runMode 必須是 ${MODES.join(' 或 ')}，現在是 ${JSON.stringify(sub.runMode)}`);
  if (LANGS.indexOf(sub.codeLang) === -1) err(S, `codeLang 必須是 ${LANGS.join(' / ')}`);

  if (!Array.isArray(sub.chapters)) { err(S, '缺少 chapters 陣列'); return; }
  if (sub.chapters.length < 6 || sub.chapters.length > 9) {
    warn(S, `章節數 ${sub.chapters.length}，規格建議 6–9 章`);
  }

  sub.chapters.forEach(function (ch, ci) {
    const C = `${S} → 第 ${ci + 1} 章 ${ch && ch.id ? ch.id : '(無 id)'}`;

    if (!isNonEmptyString(ch.id)) err(C, '缺少 id');
    else if (seenChapterIds[ch.id]) err(C, `章節 id 重複：${ch.id}`);
    else seenChapterIds[ch.id] = true;

    ['title', 'icon', 'summary'].forEach(function (k) {
      if (!isNonEmptyString(ch[k])) err(C, `缺少 ${k}`);
    });

    /* ---- 學習點 ---- */
    if (!Array.isArray(ch.points) || ch.points.length === 0) {
      err(C, '缺少 points 陣列');
    } else {
      if (ch.points.length < 4 || ch.points.length > 6) {
        warn(C, `學習點 ${ch.points.length} 個，規格建議 4–6 個`);
      }
      ch.points.forEach(function (p, pi) {
        const P = `${C} → 學習點 ${pi + 1}`;
        if (!isNonEmptyString(p.title)) err(P, '缺少 title');
        else { checkTags(P, 'title', p.title, false); checkColors(P, 'title', p.title); }
        if (!isNonEmptyString(p.analogy)) err(P, '缺少 analogy（生活化比喻）');
        else { checkTags(P, 'analogy', p.analogy, false); checkColors(P, 'analogy', p.analogy); }
        if (p.tip) { checkTags(P, 'tip', p.tip, false); checkColors(P, 'tip', p.tip); }
        if (!isNonEmptyString(p.code)) err(P, '缺少 code（程式碼範例）');
        else checkColors(P, 'code', p.code);
        checkColors(P, 'result', p.result);
        if (p.lang !== undefined && LANGS.indexOf(p.lang) === -1) err(P, `lang 必須是 ${LANGS.join(' / ')}`);
        if (!isNonEmptyString(p.result) && !p.preview) {
          warn(P, '既沒有 result 也沒有 preview，學員看不到「輸出結果」');
        }
        if (p.preview) {
          if (typeof p.preview !== 'object') err(P, 'preview 必須是物件');
          else {
            if (!isNonEmptyString(p.preview.html)) err(P, 'preview.html 必須是非空字串');
            else checkColors(P, 'html', p.preview.html);
            if (p.preview.css !== undefined && typeof p.preview.css !== 'string') err(P, 'preview.css 必須是字串');
            else checkColors(P, 'css', p.preview.css);
          }
        }
        totalPoints++;
      });
    }

    /* ---- 互動練習 ---- */
    const pz = ch.puzzle;
    if (!pz || typeof pz !== 'object') {
      err(C, '缺少 puzzle（互動練習）');
    } else {
      totalPuzzles++;
      ['title', 'task', 'hint', 'starter', 'solution'].forEach(function (k) {
        if (typeof pz[k] !== 'string') err(C, `puzzle 缺少 ${k}（可以是空字串，但必須存在）`);
      });
      checkTags(C, 'puzzle.task', pz.task, true);
      checkTags(C, 'puzzle.hint', pz.hint, true);
      checkColors(C, 'task', pz.task);
      checkColors(C, 'hint', pz.hint);
      checkColors(C, 'starter', pz.starter);
      checkColors(C, 'solution', pz.solution);
      checkColors(C, 'previewHtml', pz.previewHtml);
      if (pz.mode !== undefined && MODES.indexOf(pz.mode) === -1) err(C, `puzzle.mode 必須是 ${MODES.join(' 或 ')}`);
      if (pz.lang !== undefined && LANGS.indexOf(pz.lang) === -1) err(C, `puzzle.lang 必須是 ${LANGS.join(' / ')}`);
      const mode = pz.mode || sub.runMode;
      if (mode === 'preview' && pz.lang === 'css' && !isNonEmptyString(pz.previewHtml)) {
        err(C, 'CSS 練習（preview 模式）必須有 previewHtml：套用 CSS 的固定 HTML');
      }
      if (isNonEmptyString(pz.solution) && isNonEmptyString(pz.starter) && pz.solution === pz.starter) {
        warn(C, 'puzzle.solution 與 starter 完全相同，學員會看不到示範分別');
      }
    }

    /* ---- 測驗 ---- */
    if (!Array.isArray(ch.quiz) || ch.quiz.length === 0) {
      err(C, '缺少 quiz 陣列');
    } else {
      if (ch.quiz.length < 8 || ch.quiz.length > 10) {
        warn(C, `測驗題 ${ch.quiz.length} 題，規格要求 8–10 題`);
      }
      ch.quiz.forEach(function (q, qi) {
        const Q = `${C} → 第 ${qi + 1} 題`;
        totalQuestions++;
        if (QUIZ_TYPES.indexOf(q.type) === -1) err(Q, `type 必須是 'mc' 或 'tf'，現在是 ${JSON.stringify(q.type)}`);
        if (!isNonEmptyString(q.q)) err(Q, '缺少題目文字 q');
        else { checkTags(Q, 'q', q.q, false); checkColors(Q, 'q', q.q); }
        if (!isNonEmptyString(q.explain)) err(Q, '缺少 explain（解釋）');
        else {
          checkTags(Q, 'explain', q.explain, false);
          checkColors(Q, 'explain', q.explain);
          if (q.explain.length < 10) warn(Q, 'explain 太短，學員看不明白');
        }
        if (typeof q.answer !== 'number' || !Number.isInteger(q.answer)) {
          err(Q, 'answer 必須是整數索引');
          return;
        }
        if (q.type === 'mc') {
          if (!Array.isArray(q.options) || q.options.length < 2) err(Q, 'mc 題必須有至少 2 個 options');
          else {
            if (q.answer < 0 || q.answer >= q.options.length) {
              err(Q, `answer=${q.answer} 超出 options 範圍（0–${q.options.length - 1}）`);
            }
            q.options.forEach(function (o, oi) {
              if (!isNonEmptyString(o)) err(Q, `options[${oi}] 是空的`);
              else checkTags(Q, `options[${oi}]`, o, false);
            });
            if (new Set(q.options).size !== q.options.length) warn(Q, 'options 有重複選項');
          }
        } else {
          if (q.answer !== 0 && q.answer !== 1) err(Q, `tf 題的 answer 只可以是 0（對）或 1（不對），現在是 ${q.answer}`);
        }
      });
    }
  });
});

/* ---------------------------------------------------------------------------
   3) 簡體字提示
   ------------------------------------------------------------------------- */
Object.keys(rawText).forEach(function (f) {
  const lines = rawText[f].split('\n');
  const hits = {};
  lines.forEach(function (line, i) {
    for (const ch of line) {
      if (SIMPLIFIED_ONLY.indexOf(ch) !== -1) {
        if (!hits[ch]) hits[ch] = [];
        if (hits[ch].length < 3) hits[ch].push(i + 1);
      }
    }
  });
  const list = Object.keys(hits);
  if (list.length) {
    warn(f, '可能用了簡體字（行號）：' +
      list.map(function (c) { return `「${c}」第 ${hits[c].join('/')} 行`; }).join('、'));
  }
});

/* ---------------------------------------------------------------------------
   4) 報告
   ------------------------------------------------------------------------- */
function report() {
  console.log('===== 課程資料驗證報告 =====');
  if (DATA && Array.isArray(DATA.subjects)) {
    console.log('科目數：' + DATA.subjects.length);
    DATA.subjects.forEach(function (s) {
      console.log(`  · ${s.id}｜${s.name}｜${(s.chapters || []).length} 章｜` +
        `${(s.chapters || []).reduce(function (a, c) { return a + ((c.points || []).length); }, 0)} 個學習點｜` +
        `${(s.chapters || []).reduce(function (a, c) { return a + ((c.quiz || []).length); }, 0)} 條測驗題`);
    });
    console.log(`總計：${totalPoints} 個學習點、${totalPuzzles} 個練習、${totalQuestions} 條測驗題`);
  }
  if (warnings.length) {
    console.log('\n--- 警告（' + warnings.length + '）---');
    warnings.forEach(function (w) { console.log(w); });
  }
  if (errors.length) {
    console.log('\n--- 錯誤（' + errors.length + '）---');
    errors.forEach(function (e) { console.log(e); });
  } else {
    console.log('\n✅ 沒有錯誤，資料結構通過。');
  }
  return errors.length;
}

const failed = report();
process.exit(failed ? 1 : 0);
