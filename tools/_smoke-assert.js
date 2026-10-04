/* ============================================================================
   煙霧測試的斷言腳本（開發工具，網站執行時「不需要」這個檔案）
   由 tools/smoke-test.js build 時注入 tools/_smoke.html 的最後面。
   它會模擬一個學員：揀科目 → 睇學習內容 → 改程式碼執行 → 答測驗題，
   然後把結果寫入 <pre id="smoke-log">，再由 smoke-test.js parse 印出。
   ========================================================================== */
(function () {
  'use strict';

  /* ---- 由網址參數決定這次跑哪一種測試 ----
       ?tag=xxx     結果 POST 到 /beacon?tag=xxx（分開收集）
       ?keep=1      「重新開啟」模式：唔清 localStorage，改為檢查上次進度有冇還原
       （視窗寬度 < 900px 時會自動加做手機版檢查） */
  var PARAMS = (function () {
    var o = {};
    String(location.search || '').replace(/^\?/, '').split('&').forEach(function (kv) {
      if (!kv) return;
      var i = kv.indexOf('=');
      var k = i === -1 ? kv : kv.slice(0, i);
      try { o[decodeURIComponent(k)] = i === -1 ? '1' : decodeURIComponent(kv.slice(i + 1)); }
      catch (e) { o[k] = '1'; }
    });
    return o;
  })();
  var KEEP = PARAMS.keep === '1';

  /* 「重新開啟／重新載入」測試用：第一次載入跑完整 suite，然後記住旗標並 reload，
     第二次載入就只驗證「上次進度有沒有還原」。
     為甚麼用 reload 而唔用兩個 Chrome 實例？因為重用同一個 profile 目錄時，
     上一個 Chrome 被強制結束可能留下鎖，新實例會把 URL 轉交給已死的舊實例然後退出。 */
  var PHASE2 = false;
  try { PHASE2 = window.sessionStorage.getItem('smoke:restore') === '1'; } catch (e) { /* 忽略 */ }
  if (PHASE2) KEEP = true;

  /* 測試一定要從「乾淨狀態」開始：
     這個 script 在 body 最尾、DOMContentLoaded 之前執行，
     而 app.js 是在 DOMContentLoaded 才讀 localStorage，
     所以在這裡清掉就一定趕得及，唔會被上一次執行的進度影響。
     （?keep=1 的模式例外，它正是要驗證「重新開啟之後有冇還原」。） */
  if (!KEEP) {
    try { window.localStorage.clear(); } catch (e) { /* 隱私模式可能禁止，忽略 */ }
  }

  /* ---- 沙箱訊息診斷 ----
     測試環境用 --virtual-time-budget 加速時間，虛擬時間可能跑得比 iframe 真正載入快，
     令外層的逾時 timer 先觸發。這裡做兩件事：
       1. 記錄所有 postMessage，萬一失敗都可以知道流程停在哪一步。
       2. 把沙箱逾時放寬到 60 秒（只影響測試，交付的程式碼不變），
          用來分辨「真 bug」同「測試環境的虛擬時間假象」。 */
  window.__msgStats = { ready: 0, run: 0, other: 0 };
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || typeof d !== 'object' || !d.type) { window.__msgStats.other++; return; }
    if (d.ready) window.__msgStats.ready++;
    else if (d.run) window.__msgStats.run++;
    else window.__msgStats.other++;
  });

  var log = [];
  var fails = 0;

  function check(name, cond, extra) {
    log.push((cond ? 'PASS  ' : 'FAIL  ') + name + (extra ? '   :: ' + extra : ''));
    if (!cond) fails++;
  }
  function q(s) { return document.querySelector(s); }
  function qa(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function click(el) { if (el) { el.click(); return true; } return false; }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function waitFor(fn, ms, stepMs) {
    ms = ms || 4000; stepMs = stepMs || 60;
    var waited = 0;
    return new Promise(function (resolve) {
      (function tick() {
        var v;
        try { v = fn(); } catch (e) { v = null; }
        if (v) return resolve(v);
        waited += stepMs;
        if (waited >= ms) return resolve(null);
        setTimeout(tick, stepMs);
      })();
    });
  }

  function subjectCard(id) {
    return qa('#subject-grid .subject-card').filter(function (c) {
      return c.getAttribute('data-subject') === id;
    })[0];
  }
  function data(id) {
    return (window.LEARN_DATA.subjects || []).filter(function (s) { return s.id === id; })[0];
  }
  function tab(name) { return q('.tab[data-tab="' + name + '"]'); }
  function setEditor(chapterId, value) {
    var ta = q('[data-editor="' + chapterId + '"]');
    if (!ta) return null;
    ta.value = value;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    return ta;
  }

  function finish() {
    var text = '\n===== SMOKE RESULT: ' + (fails ? 'FAIL (' + fails + ')' : 'ALL PASS') +
      ' =====\n' + log.join('\n') + '\n===== END =====\n';

    var pre = document.createElement('pre');
    pre.id = 'smoke-log';
    pre.textContent = text;
    document.body.appendChild(pre);

    /* 如果用 http:// 開（配合 tools/beacon-server.js），就順便把結果 POST 出去。
       這樣就不需要依賴 chrome --dump-dom 的虛擬時間，測試結果更可靠。 */
    if (location.protocol === 'http:' && window.fetch) {
      try {
        window.fetch('/beacon' + (PARAMS.tag ? '?tag=' + encodeURIComponent(PARAMS.tag) : ''),
          { method: 'POST', body: text, mode: 'same-origin' });
      } catch (e) { /* 忽略 */ }
    }
  }

  /* ==================================================================
     手機版（窄螢幕）檢查：只在視窗寬度 < 900px 時執行
     ================================================================== */
  async function runMobileChecks() {
    check('[手機] 視窗寬度 < 900px', window.innerWidth < 900, window.innerWidth + 'px');

    var menu = q('#btn-menu');
    check('[手機] 漢堡選單按鈕顯示出嚟', !!menu && getComputedStyle(menu).display !== 'none');

    var sb = q('#sidebar');
    check('[手機] 側欄預設收埋喺畫面外', sb.getBoundingClientRect().right <= 2,
      'right=' + Math.round(sb.getBoundingClientRect().right));

    click(menu);
    await sleep(450);
    var r = sb.getBoundingClientRect();
    check('[手機] 撳漢堡選單之後側欄滑出', r.left >= -2 && r.width > 100, 'left=' + Math.round(r.left) + ' width=' + Math.round(r.width));
    check('[手機] 側欄打開時有遮罩', q('#backdrop') && !q('#backdrop').hasAttribute('hidden'));
    check('[手機] 漢堡選單 aria-expanded 正確', menu.getAttribute('aria-expanded') === 'true');

    click(q('#backdrop'));
    await sleep(450);
    check('[手機] 撳遮罩之後側欄收返', sb.getBoundingClientRect().right <= 2,
      'right=' + Math.round(sb.getBoundingClientRect().right));

    var cols = getComputedStyle(q('.layout')).gridTemplateColumns;
    check('[手機] 版面變成單欄', cols.split(' ').filter(Boolean).length === 1, cols);

    var topbar = getComputedStyle(q('.topbar'));
    check('[手機] 置頂工具列仍然固定', topbar.position === 'sticky');
  }

  /* ==================================================================
     「重新開啟」模式：驗證上次進度真的有還原
     （先跑一次普通測試寫入進度，再用 ?keep=1 開一次）
     ================================================================== */
  async function runRestore() {
    /* 用過就清掉旗標，避免之後再意外進入這個模式 */
    try { window.sessionStorage.removeItem('smoke:restore'); } catch (e) { /* 忽略 */ }

    var saved = null;
    try { saved = JSON.parse(window.localStorage.getItem('weblearn.progress.v1') || 'null'); } catch (e) { /* 忽略 */ }

    check('[重新開啟] 讀到上次的進度記錄', !!saved);
    if (!saved) return;

    check('[重新開啟] 記住上次科目（js）', saved.subject === 'js', String(saved.subject));
    check('[重新開啟] 版面還原到練習分頁', q('#view-practice').classList.contains('is-active'));
    check('[重新開啟] <html data-subject="js">',
      document.documentElement.getAttribute('data-subject') === 'js');
    check('[重新開啟] 還原到上次章節（第 3 章）',
      !!q('#practice-tabs .tab.is-active[data-practice="2"]'),
      (q('#practice-tabs .tab.is-active') || {}).textContent);
    /* 注意：還原後停在 JS 科，而頂部進度環顯示的是「目前科目」的進度，
       已學會的那一點在 HTML 科，所以這裡量到 0% 是正確的。
       要驗證進度有還原，應該去首頁睇 HTML 科卡片顯示的進度。 */
    check('[重新開啟] 「已學會」記錄還在',
      Object.keys(saved.done || {}).length > 0, Object.keys(saved.done || {}).length + ' 個學習點');
    check('[重新開啟] 練習草稿還在',
      Object.keys(saved.drafts || {}).length > 0, Object.keys(saved.drafts || {}).length + ' 份');
    check('[重新開啟] 測驗答案還在',
      Object.keys(saved.answers || {}).length > 0, Object.keys(saved.answers || {}).length + ' 章有答案');
    check('[重新開啟] 主題設定還在',
      (window.localStorage.getItem('weblearn.theme') || '').indexOf(
        document.documentElement.getAttribute('data-theme')) !== -1,
      document.documentElement.getAttribute('data-theme'));

    /* 首頁的科目卡要反映已還原的進度（不是 0%） */
    click(q('#btn-home'));
    await sleep(250);
    var htmlCard = qa('#subject-grid .subject-card').filter(function (c) {
      return c.getAttribute('data-subject') === 'html';
    })[0];
    var cardText = htmlCard ? htmlCard.textContent : '';
    check('[重新開啟] 首頁科目卡顯示已還原的學習進度（不是 0%）',
      /學習進度 [1-9]/.test(cardText), (cardText.match(/學習進度 [\d]+%/) || ['(搵唔到)'])[0]);

    /* 畫面上真的見到還原：去 HTML 科第 2 章（之前答過題的地方）睇解釋 */
    click(subjectCard('html'));
    await sleep(250);
    click(qa('#chapter-list .chapter-link')[1]);
    await sleep(250);
    click(tab('quiz'));
    await sleep(300);
    check('[重新開啟] 之前答過的題目仍然顯示為已作答（有解釋）',
      !!q('#quiz-body .question .explain'));
    check('[重新開啟] 測驗分數有還原（不是 0 分）',
      !/得分 0 \//.test((q('#quiz-body .quiz-score-row strong') || {}).textContent || ''),
      (q('#quiz-body .quiz-score-row strong') || {}).textContent);
  }

  window.addEventListener('load', function () {
    setTimeout(function () {
      var task = KEEP ? runRestore()
        /* 手機版檢查要放在完整 suite「之後」：
           因為首頁時側欄是 hidden（display:none），量不到寬度；
           要進入科目之後側欄才存在。 */
        : (window.innerWidth < 900 ? run().then(runMobileChecks) : run());

      task.catch(function (e) {
        log.push('EXCEPTION  ' + String((e && e.stack) || e));
        fails++;
      }).then(function () {
        /* ?reload=1：第一階段（完整 suite）零失敗的話，記住旗標再重新載入，
           第二次載入就會跑 runRestore()，驗證「重新載入之後進度有冇還原」。 */
        if (PARAMS.reload === '1' && !PHASE2 && fails === 0) {
          try { window.sessionStorage.setItem('smoke:restore', '1'); } catch (e) { /* 忽略 */ }
          window.location.reload();
          return;   // 頁面即將重新載入，唔需要 finish()
        }
        finish();
      });
    }, 250);
  });

  async function run() {
    var subjects = window.LEARN_DATA && window.LEARN_DATA.subjects;
    check('window.LEARN_DATA 有 3 個科目', !!subjects && subjects.length === 3,
      subjects ? subjects.map(function (s) { return s.id + '(' + s.chapters.length + '章)'; }).join(', ') : 'undefined');
    if (!subjects || subjects.length !== 3) return;

    /* 註：早期版本曾在這裡把沙箱逾時放寬到 60 秒，用來繞過
       chrome --dump-dom 的「虛擬時間」假象。改用 tools/beacon-server.js
       以真實時間執行之後已經不需要，所以沙箱維持交付時的 5／6 秒逾時，
       測試出來的行為就同使用者實際體驗一致。 */

    var totalQ = 0, totalPts = 0;
    subjects.forEach(function (s) {
      s.chapters.forEach(function (c) {
        totalQ += (c.quiz || []).length;
        totalPts += (c.points || []).length;
      });
    });
    log.push('INFO  全站 ' + subjects.reduce(function (a, s) { return a + s.chapters.length; }, 0) +
      ' 章、' + totalPts + ' 個學習點、' + totalQ + ' 條測驗題');

    /* ---------------- 首頁 ---------------- */
    check('首頁顯示 3 張科目卡', qa('#subject-grid .subject-card').length === 3);
    check('首頁 view 是 active', q('#view-home') && q('#view-home').classList.contains('is-active'));
    check('首頁時側欄隱藏', q('#sidebar') && q('#sidebar').hasAttribute('hidden'));

    /* 品牌顯示（泛用檢查：不寫死站名，所以日後改名不會令測試失敗） */
    var brandTitle = (q('#brand-title') || {}).textContent || '';
    var brandSub = (q('#brand-sub') || {}).textContent || '';
    var brandLogo = (q('#brand-logo') || {}).textContent || '';
    check('[品牌] 首頁有顯示品牌名、副標題、標誌',
      brandTitle.trim().length > 0 && brandSub.trim().length > 0 && brandLogo.trim().length > 0,
      JSON.stringify({ 標誌: brandLogo, 名: brandTitle, 副標: brandSub }));
    check('[品牌] 瀏覽器標題包含品牌名',
      document.title.indexOf(brandTitle.trim()) !== -1, document.title);
    check('[品牌] 頁尾有品牌資訊',
      ((q('.site-foot') || {}).textContent || '').trim().length > 10,
      ((q('.site-foot') || {}).textContent || '').trim().slice(0, 70));

    /* ---------------- HTML：學習 ---------------- */
    click(subjectCard('html'));
    await sleep(250);
    var H = data('html');
    check('[HTML] 進入後 learn view active', q('#view-learn').classList.contains('is-active'));
    check('[HTML] <html data-subject="html">', document.documentElement.getAttribute('data-subject') === 'html');
    check('[品牌] 進入科目後，標題換成科目名',
      ((q('#brand-title') || {}).textContent || '').indexOf('HTML') !== -1 &&
      document.title.indexOf('HTML') !== -1,
      (q('#brand-title') || {}).textContent + ' ／ ' + document.title);
    check('[HTML] 側欄章節數正確', qa('#chapter-list .chapter-link').length === H.chapters.length,
      qa('#chapter-list .chapter-link').length + ' / ' + H.chapters.length);
    check('[HTML] 學習點全部渲染', qa('#learn-body .point').length === (H.chapters[0].points || []).length,
      qa('#learn-body .point').length + ' / ' + (H.chapters[0].points || []).length);
    var pv = qa('#learn-body .preview-frame');
    check('[HTML] 學習模組有即時預覽 iframe', pv.length > 0, pv.length + ' 個');
    check('[HTML] 預覽 iframe 有 srcdoc', pv.length > 0 && (pv[0].getAttribute('srcdoc') || '').length > 100);
    check('[HTML] 程式碼有語法高亮',
      qa('#learn-body .codeblock .tk-tag, #learn-body .codeblock .tk-keyword, #learn-body .codeblock .tk-comment').length > 0);

    /* 勾選「我已經學會」→ 進度 + localStorage */
    var cb = q('#learn-body .learn-check input');
    click(cb);
    await sleep(150);
    check('[HTML] 勾選後進度環不是 0%', q('#overall-ring-label').textContent !== '0%');
    check('[HTML] 進度寫入 localStorage', !!window.localStorage.getItem('weblearn.progress.v1'));

    /* 換章節 */
    click(qa('#chapter-list .chapter-link')[1]);
    await sleep(200);
    check('[HTML] 切換到第 2 章', qa('#learn-body .point').length === (H.chapters[1].points || []).length,
      qa('#learn-body .point').length + ' / ' + (H.chapters[1].points || []).length);

    /* ---------------- HTML：練習（即時預覽模式） ---------------- */
    click(tab('practice'));
    await sleep(250);
    check('[HTML] 練習卡 active', !!q('#practice-list .practice-card.is-active'));
    var h1 = H.chapters[1];
    check('[HTML] 編輯框有預設 starter', (q('[data-editor="' + h1.id + '"]') || {}).value === h1.puzzle.starter);

    /* 快速輸入符號列（手機好難打 { } < > ;，所以要有得撳）
       注意：所有練習卡都會渲染（只有當前嗰張可見），所以一定要在「當前卡」裡面找掣。 */
    var activeCard0 = q('#practice-list .practice-card.is-active');
    var symBtns = activeCard0 ? qa('#practice-list .practice-card.is-active [data-insert]') : [];
    check('[鍵盤] 當前練習有快速輸入符號列', symBtns.length >= 8, symBtns.length + ' 個符號掣');
    var ta0 = q('[data-editor="' + h1.id + '"]');
    ta0.value = 'ABC';
    ta0.selectionStart = ta0.selectionEnd = 1;      // 游標放在 A 同 B 之間
    var openTag = activeCard0 ? activeCard0.querySelector('[data-insert="<"]') : null;
    check('[鍵盤] 有「<」符號掣', !!openTag);
    click(openTag);
    await sleep(150);
    check('[鍵盤] 撳符號掣會在游標位置插入',
      ta0.value === 'A<BC', JSON.stringify(ta0.value));
    /* 插入之後要同手打一樣記入草稿 */
    await sleep(500);
    var savedDraft = null;
    try { savedDraft = JSON.parse(window.localStorage.getItem('weblearn.progress.v1') || '{}'); } catch (e) { /* 忽略 */ }
    check('[鍵盤] 插入符號後草稿有更新',
      !!savedDraft && !!savedDraft.drafts && savedDraft.drafts['html::' + h1.id] === 'A<BC',
      savedDraft && savedDraft.drafts ? JSON.stringify(savedDraft.drafts['html::' + h1.id]) : '(冇讀到)');

    /* 提示／顯示答案 */
    click(q('[data-hint="' + h1.id + '"]'));
    await sleep(100);
    check('[HTML] 撳提示會打開提示框', q('[data-hintbox="' + h1.id + '"]').classList.contains('is-open'));
    click(q('[data-answer="' + h1.id + '"]'));
    await sleep(100);
    check('[HTML] 撳顯示答案會打開答案框', q('[data-answerbox="' + h1.id + '"]').classList.contains('is-open'));

    setEditor(h1.id, h1.puzzle.solution);
    click(q('[data-run="' + h1.id + '"]'));    var got = await waitFor(function () { return q('[data-preview-mount="' + h1.id + '"] iframe'); }, 6000);
    check('[HTML] 執行後即時預覽 iframe 出現', !!got);
    var fb = await waitFor(function () {
      var el = q('[data-feedback="' + h1.id + '"]');
      return el && el.classList.contains('is-open') ? el : null;
    }, 6000);
    check('[HTML] 執行後有回饋訊息', !!fb, fb ? fb.className : '(冇)');
    check('[HTML] 回饋判斷為過關', !!fb && fb.classList.contains('ok'), fb ? fb.textContent.trim().slice(0, 50) : '');
    check('[HTML] 狀態顯示執行完成', /完成/.test((q('[data-status="' + h1.id + '"]') || {}).textContent || ''),
      (q('[data-status="' + h1.id + '"]') || {}).textContent);

    /* 還原範例 */
    click(q('[data-reset-code="' + h1.id + '"]'));
    await sleep(100);
    check('[HTML] 還原範例會回復 starter', (q('[data-editor="' + h1.id + '"]') || {}).value === h1.puzzle.starter);

    /* ---------------- HTML：測驗 ---------------- */
    click(tab('quiz'));
    await sleep(250);
    check('[HTML] 測驗題數正確', qa('#quiz-body .question').length === h1.quiz.length,
      qa('#quiz-body .question').length + ' / ' + h1.quiz.length);
    check('[HTML] 有全科總分區', !!q('#quiz-body .quiz-subject'));
    check('[HTML] 全科總分有進度條', !!q('#quiz-body .quiz-subject .bar > span'));

    var q0 = h1.quiz[0];
    click(qa('#quiz-body .question')[0].querySelectorAll('.option')[q0.answer]);
    await sleep(150);
    check('[HTML] 答對後標記 is-correct', q('#quiz-body .question').classList.contains('is-correct'));
    check('[HTML] 答對後顯示解釋', !!q('#quiz-body .question .explain'));
    check('[HTML] 得分有更新', /得分 [1-9]/.test((q('#quiz-body .quiz-score-row strong') || {}).textContent || ''),
      (q('#quiz-body .quiz-score-row strong') || {}).textContent);

    if (h1.quiz.length > 1) {
      var q1 = h1.quiz[1];
      var wrongIdx = q1.answer === 0 ? 1 : 0;
      click(qa('#quiz-body .question')[1].querySelectorAll('.option')[wrongIdx]);
      await sleep(150);
      check('[HTML] 答錯後標記 is-wrong', qa('#quiz-body .question')[1].classList.contains('is-wrong'));
      var redo = qa('#quiz-body .question')[1].querySelector('[data-quiz-redo]');
      check('[HTML] 答錯有「重做呢題」按鈕', !!redo);
      click(redo);
      await sleep(150);
      check('[HTML] 重做後該題回復未作答', !qa('#quiz-body .question')[1].classList.contains('is-wrong'));
    }

    /* 使用者要求：在測驗分頁揀另一章（底部全科總分表或側欄）之後，
       畫面應該跳返最頂，即係由嗰一章的第 1 題開始，唔需要自己捲上去。 */
    window.scrollTo(0, 2500);
    await sleep(200);
    var scrollBefore = window.scrollY;
    var gotoBtn = q('#quiz-body .chapter-scores [data-quiz-goto="1"]');
    check('[HTML] 全科總分表有可撳嘅章節', !!gotoBtn);
    click(gotoBtn);
    await sleep(350);
    check('[答題體驗] 揀另一章測驗後跳返最頂（由第 1 題開始）',
      window.scrollY < 150, '捲動前 ' + scrollBefore + ' → 捲動後 ' + window.scrollY);
    check('[答題體驗] 跳過去之後係嗰一章嘅測驗',
      ((q('#quiz-body h2') || {}).textContent || '').indexOf(H.chapters[1].title) !== -1,
      (q('#quiz-body h2') || {}).textContent);

    /* ---------------- 返回首頁 → CSS 科 ---------------- */
    click(q('#btn-home'));
    await sleep(200);
    check('返回科目選擇首頁', q('#view-home').classList.contains('is-active'));
    check('返回首頁後移除 data-subject', !document.documentElement.hasAttribute('data-subject'));

    click(subjectCard('css'));
    await sleep(250);
    var S = data('css');
    check('[CSS] data-subject 切換成 css', document.documentElement.getAttribute('data-subject') === 'css');
    check('[CSS] 側欄章節數正確', qa('#chapter-list .chapter-link').length === S.chapters.length);
    check('[CSS] 學習模組有 CSS 即時預覽', qa('#learn-body .preview-frame').length > 0);
    check('[CSS] CSS 程式碼有語法高亮',
      qa('#learn-body .codeblock .tk-attr, #learn-body .codeblock .tk-keyword, #learn-body .codeblock .tk-number').length > 0);

    /* 「CSS 三種寫法」這一章：確認 inline / internal / external 三個術語都在，
       而且新加的「三種寫法對照表」預覽真的有渲染出來。 */
    var learnText = q('#learn-body').textContent;
    check('[CSS] s1 學習點標明 inline / internal / external',
      /inline/.test(learnText) && /internal/.test(learnText) && /external/.test(learnText));
    var cmpPreview = qa('#learn-body .preview-frame').filter(function (f) {
      return (f.getAttribute('srcdoc') || '').indexOf('.cmp') !== -1;
    });
    check('[CSS] 三種寫法對照表預覽有渲染出來', cmpPreview.length > 0,
      qa('#learn-body .preview-frame').length + ' 個預覽之中搵到 ' + cmpPreview.length + ' 個');

    /* 「背景同外觀」那一章有一個 box-shadow 模糊對照預覽（模糊 0/8/18/32px），
       確認它真的有渲染出來（教材內容的實際效果）。 */
    click(qa('#chapter-list .chapter-link')[4]);
    await sleep(400);
    var shadowPreview = qa('#learn-body .preview-frame').filter(function (f) {
      return (f.getAttribute('srcdoc') || '').indexOf('.b18') !== -1;
    });
    check('[CSS] box-shadow 模糊對照預覽有渲染出來', shadowPreview.length > 0,
      qa('#learn-body .preview-frame').length + ' 個預覽之中搵到 ' + shadowPreview.length + ' 個');
    click(qa('#chapter-list .chapter-link')[0]);   // 返回第 1 章，唔影響之後的練習測試
    await sleep(300);

    click(tab('practice'));
    await sleep(250);
    var s0 = S.chapters[0];
    var mode0 = s0.puzzle.mode || S.runMode;
    check('[CSS] 練習是 preview 模式', mode0 === 'preview', mode0);
    if (s0.puzzle.lang === 'css') {
      check('[CSS] CSS 練習顯示固定 HTML 區', qa('#practice-list .codeblock.is-static').length > 0);
    }
    check('[CSS] 練習 1 用「內部樣式表（internal）」寫法',
      /internal/.test((q('#practice-list .practice-card.is-active .task') || {}).textContent || ''),
      (q('#practice-list .practice-card.is-active .task') || {}).textContent ?
        (q('#practice-list .practice-card.is-active .task').textContent.slice(0, 60)) : '(冇 task)');
    setEditor(s0.id, s0.puzzle.solution);
    click(q('[data-run="' + s0.id + '"]'));
    var cgot = await waitFor(function () { return q('[data-preview-mount="' + s0.id + '"] iframe'); }, 6000);
    check('[CSS] 執行後即時預覽 iframe 出現', !!cgot);
    var cfb = await waitFor(function () {
      var el = q('[data-feedback="' + s0.id + '"]');
      return el && el.classList.contains('is-open') ? el : null;
    }, 6000);
    check('[CSS] 執行後有回饋訊息', !!cfb, cfb ? cfb.className : '(冇)');

    /* ---------------- JS 科（console 模式） ---------------- */
    click(q('#btn-home'));
    await sleep(200);
    click(subjectCard('js'));
    await sleep(250);
    var J = data('js');
    check('[JS] data-subject 切換成 js', document.documentElement.getAttribute('data-subject') === 'js');
    check('[JS] 側欄章節數正確', qa('#chapter-list .chapter-link').length === J.chapters.length);
    check('[JS] 學習模組有 console 輸出區', qa('#learn-body .outputbox').length > 0);

    click(tab('practice'));
    await sleep(250);
    var j0 = J.chapters[0];
    check('[JS] 練習卡的編輯框存在', !!q('[data-editor="' + j0.id + '"]'));
    setEditor(j0.id, 'console.log("測試" + (1 + 1));');
    click(q('[data-run="' + j0.id + '"]'));
    var out = await waitFor(function () {
      var el = q('[data-output="' + j0.id + '"]');
      var t = el ? el.textContent : '';
      return t.indexOf('測試2') !== -1 ? t : null;
    }, 8000);
    check('[JS] console 輸出正確（測試2）', !!out, out ? out.trim().slice(0, 50) : '冇輸出');
    check('[JS] 執行後狀態顯示完成', /完成/.test((q('[data-status="' + j0.id + '"]') || {}).textContent || ''),
      (q('[data-status="' + j0.id + '"]') || {}).textContent);

    /* 錯誤處理：寫錯語法應該顯示紅字，唔會令成頁死掉 */
    setEditor(j0.id, 'this is not javascript');
    click(q('[data-run="' + j0.id + '"]'));
    var errOut = await waitFor(function () {
      var el = q('[data-output="' + j0.id + '"]');
      return el && el.querySelector('.line-err') ? el.textContent : null;
    }, 8000);
    check('[JS] 語法錯誤會顯示錯誤訊息', !!errOut, errOut ? errOut.trim().slice(0, 50) : '冇錯誤訊息');

    /* 練習分頁揀另一章，同樣要跳返最頂 */
    window.scrollTo(0, 2500);
    await sleep(200);
    click(q('#practice-tabs [data-practice="2"]'));
    await sleep(350);
    check('[答題體驗] 練習分頁揀章節後跳返最頂',
      window.scrollY < 150, '捲動後 ' + window.scrollY);
    check('[答題體驗] 練習分頁真係換咗章節',
      !!q('#practice-list .practice-card.is-active[data-chapter-index="2"]'),
      (q('#practice-list .practice-card.is-active') || {}).id);

    /* 深色模式（注意：headless Chrome 預設可能已經是深色，
       所以只檢查「有切換」，不假設切換後的顏色） */
    var themeBefore = document.documentElement.getAttribute('data-theme');
    click(q('#btn-theme'));
    await sleep(150);
    var themeAfter = document.documentElement.getAttribute('data-theme');
    check('深色／淺色模式切換成功', themeAfter !== themeBefore &&
      (themeAfter === 'dark' || themeAfter === 'light'),
      themeBefore + ' → ' + themeAfter);

    /* ---------------- 顏色寫法檢查 ----------------
       課程已經由色碼改成英文顏色名。打錯名（例如 lightyelow）瀏覽器會靜靜地
       唔套用，肉眼睇唔出，所以在這裡用「style.color 只接受有效值」這個特性驗一次。 */
    var ALL_NAMED = ('aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue ' +
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
      'springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen').split(' ');

    var dataText = JSON.stringify(window.LEARN_DATA);
    var probe = document.createElement('div');
    probe.style.display = 'none';
    document.body.appendChild(probe);
    var usedNames = [];
    var invalidNames = [];
    ALL_NAMED.forEach(function (n) {
      if (!new RegExp('\\b' + n + '\\b').test(dataText)) return;
      usedNames.push(n);
      probe.style.color = '';
      probe.style.color = n;
      if (probe.style.color === '') invalidNames.push(n);
    });
    if (probe.parentNode) probe.parentNode.removeChild(probe);

    check('[顏色] 課程用到的英文顏色名都是有效 CSS',
      invalidNames.length === 0,
      '課程用了 ' + usedNames.length + ' 種顏色名' +
      (invalidNames.length ? '；⚠️ 無效：' + invalidNames.join('、') : '（' + usedNames.join('、') + '）'));
    check('[顏色] 全站色碼已清到只剩教學例子（≤2 處）',
      (dataText.match(/#[0-9a-fA-F]{6}\b/g) || []).length <= 2,
      '（剩 ' + ((dataText.match(/#[0-9a-fA-F]{6}\b/g) || []).join('、') || '0 處') + '）');

    /* ---------------- 全域錯誤 ---------------- */
    var errs = window.__errors || [];
    check('執行期間沒有任何 JS 錯誤', errs.length === 0, errs.slice(0, 5).join(' | '));

    /* ---------------- 沙箱訊息統計（診斷用） ---------------- */
    log.push('INFO  沙箱訊息統計：ready=' + window.__msgStats.ready +
      '、執行回報=' + window.__msgStats.run + '、其他=' + window.__msgStats.other);
  }
})();
