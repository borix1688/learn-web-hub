/* ============================================================================
   前端基礎學堂 Frontend Foundations — app.js
   ----------------------------------------------------------------------------
   主程式負責：
     1. 讀寫學習進度（localStorage）
     2. 首頁「揀科目」（HTML / CSS / JavaScript）
     3. 產生左邊章節選單、學習（Learn）模組、練習（Interactive）模組
     4. 三大模組分頁切換、深色模式、手機側欄
     5. 呼叫 Runner 執行程式碼（HTML/CSS 即時預覽；JS 睇 console 輸出）
     6. 呼叫 Quiz（quiz.js）處理測驗模組

   想改課程內容 → 改 data-html.js / data-css.js / data-js.js，不用改這個檔案。
   想改外觀    → 改 styles.css。
   想改站名    → 只改下面第 0 節的 BRAND（記得同時改 index.html 的 <title> 及
                 「品牌靜態文字」，因為那是 JS 未載入前的顯示）。
   ========================================================================== */

(function () {
  'use strict';

  /* ==================================================================
     0) 品牌設定（BRAND）——想改站名／副標題，只改這裡
     ================================================================== */
  var BRAND = {
    name: '前端基礎學堂',                        // 中文站名（顯示在左上角）
    nameEn: 'Frontend Foundations',            // 英文站名（用於瀏覽器標籤、頁尾）
    mark: 'F',                                 // 左上角標誌（文字方塊）
    taglineSubjects: 'HTML · CSS · JavaScript，由零開始打穩基礎',   // 首頁副標題
    subjectSuffix: '課程'                       // 進入科目後顯示「HTML 課程」
  };

  /* ==================================================================
     0) 小工具
     ================================================================== */

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* 只開放 <code> <b> <strong> <em> <br> 幾種標籤，其他一律當純文字（安全） */
  function rich(str) {
    return esc(str).replace(
      /&lt;(\/?)(code|b|strong|em|br)\s*\/?&gt;/gi,
      function (all, slash, tag) {
        tag = tag.toLowerCase();
        if (tag === 'br') return '<br>';
        return '<' + slash + tag + '>';
      }
    );
  }

  function nl2brRich(str) {
    return rich(str).replace(/\n/g, '<br>');
  }

  function nl2br(str) {
    return esc(str).replace(/\n/g, '<br>');
  }

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  /* 捲返最頂。
     smooth = true 用平滑捲動（切換科目／分頁時），false 就即時跳（切換章節時，
     因為內容已經完全不同，平滑捲動反而會令人等）。
     注意：這裡一定要用 'instant'，唔可以用 'auto'——因為 CSS 設定了
     `html { scroll-behavior: smooth }`，而 'auto' 的意思係「跟隨 CSS 設定」，
     結果就會變成平滑捲動（測試時見到 350ms 後仍然停在半路）。
     兩者都尊重系統的「減少動畫」設定。 */
  function scrollToTop(smooth) {
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var behavior = (smooth && !reduced) ? 'smooth' : 'instant';
    try {
      window.scrollTo({ top: 0, behavior: behavior });
    } catch (e) {
      window.scrollTo(0, 0);   // 極舊瀏覽器不認識 'instant'：退回傳統寫法（即時）
    }
  }

  /* 語法高亮：交給 runner.js；如果 runner.js 未載入，就退回純文字（不會拋錯） */
  function highlight(code, lang) {
    if (window.Runner && typeof window.Runner.renderCode === 'function') {
      return window.Runner.renderCode(code, lang);
    }
    return esc(code);
  }

  var LANG_LABEL = { html: 'HTML', css: 'CSS', js: 'JavaScript' };

  /* localStorage 包一層 try/catch：有些瀏覽器（隱私模式）會禁止寫入 */
  var storage = {
    available: (function () {
      try {
        window.localStorage.setItem('__t', '1');
        window.localStorage.removeItem('__t');
        return true;
      } catch (e) {
        return false;
      }
    })(),
    get: function (key, fallback) {
      if (!this.available) return fallback;
      try {
        var raw = window.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        return fallback;
      }
    },
    set: function (key, value) {
      if (!this.available) return;
      try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* 忽略 */ }
    },
    remove: function (key) {
      if (!this.available) return;
      try { window.localStorage.removeItem(key); } catch (e) { /* 忽略 */ }
    }
  };

  /* ==================================================================
     1) 課程資料
     ================================================================== */
  var DATA = window.LEARN_DATA || { subjects: [] };
  var ORDER = ['html', 'css', 'js'];

  var SUBJECTS = (DATA.subjects || []).slice().sort(function (a, b) {
    var ia = ORDER.indexOf(a.id);
    var ib = ORDER.indexOf(b.id);
    if (ia === -1) ia = 99;
    if (ib === -1) ib = 99;
    return ia - ib;
  });

  function findSubject(id) {
    for (var i = 0; i < SUBJECTS.length; i++) {
      if (SUBJECTS[i].id === id) return SUBJECTS[i];
    }
    return null;
  }

  /* ==================================================================
     2) 全域狀態
     ================================================================== */
  var STORE_KEY = 'weblearn.progress.v1';
  var THEME_KEY = 'weblearn.theme';

  var state = {
    view: 'home',      // 'home'（揀科目）| 'subject'（學習中）
    subject: null,     // 目前科目 id
    tab: 'learn',      // learn | practice | quiz
    chapter: {},       // { html: 0, css: 0, js: 0 }：每個科目各自記住睇到第幾章
    done: {},          // { 'html::h1::0': true } 已學會的學習點
    answers: {},       // { 'h1': { 0: 2 } } 測驗已選答案
    drafts: {},        // { 'html::h1': '程式碼草稿' }
    savedAt: null
  };

  (function loadState() {
    var saved = storage.get(STORE_KEY, null);
    if (!saved || typeof saved !== 'object') return;

    if (typeof saved.view === 'string') state.view = saved.view;
    if (saved.subject && findSubject(saved.subject)) state.subject = saved.subject;
    if (typeof saved.tab === 'string') state.tab = saved.tab;
    state.chapter = saved.chapter || {};
    state.done = saved.done || {};
    state.answers = saved.answers || {};
    state.drafts = saved.drafts || {};
    state.savedAt = saved.savedAt || null;

    if (state.view === 'subject' && !state.subject) state.view = 'home';
    if (['learn', 'practice', 'quiz'].indexOf(state.tab) === -1) state.tab = 'learn';
  })();

  function saveState() {
    state.savedAt = new Date().toISOString();
    storage.set(STORE_KEY, {
      view: state.view,
      subject: state.subject,
      tab: state.tab,
      chapter: state.chapter,
      done: state.done,
      answers: state.answers,
      drafts: state.drafts,
      savedAt: state.savedAt
    });
  }

  function currentSubject() {
    return state.view === 'subject' ? findSubject(state.subject) : null;
  }

  function currentChapterIndex(subject) {
    var i = state.chapter[subject.id];
    if (typeof i !== 'number' || i < 0 || i >= (subject.chapters || []).length) return 0;
    return i;
  }

  function currentChapter(subject) {
    return (subject.chapters || [])[currentChapterIndex(subject)] || null;
  }

  /* 給 quiz.js 用的介面（避免兩個檔案互相依賴內部變數） */
  var quizCtx = {
    getSubject: currentSubject,
    getChapterIndex: function () {
      var s = currentSubject();
      return s ? currentChapterIndex(s) : 0;
    },
    getAnswers: function (chapterId) { return state.answers[chapterId] || {}; },
    getAllAnswers: function () { return state.answers; },
    setAnswer: function (chapterId, qIndex, optionIndex) {
      if (!state.answers[chapterId]) state.answers[chapterId] = {};
      state.answers[chapterId][qIndex] = optionIndex;
      saveState();
    },
    clearAnswer: function (chapterId, qIndex) {
      if (state.answers[chapterId]) {
        delete state.answers[chapterId][qIndex];
        saveState();
      }
    },
    onProgressChange: function () {
      renderSidebar();
      renderRing();
    },
    gotoChapter: function (i) {
      setChapter(i, { focus: true });
    }
  };

  /* ==================================================================
     3) 進度計算
     ================================================================== */
  function pointKey(subjectId, chapterId, i) {
    return subjectId + '::' + chapterId + '::' + i;
  }

  function draftKey(subjectId, chapterId) {
    return subjectId + '::' + chapterId;
  }

  function chapterStats(subject, ch) {
    var total = (ch.points || []).length;
    var done = 0;
    for (var i = 0; i < total; i++) {
      if (state.done[pointKey(subject.id, ch.id, i)]) done++;
    }
    return { total: total, done: done, percent: total ? Math.round((done / total) * 100) : 0 };
  }

  function subjectStats(subject) {
    var total = 0, done = 0;
    (subject.chapters || []).forEach(function (ch) {
      var s = chapterStats(subject, ch);
      total += s.total;
      done += s.done;
    });
    return { total: total, done: done, percent: total ? Math.round((done / total) * 100) : 0 };
  }

  function subjectQuizStats(subject) {
    var total = 0, correct = 0, answered = 0;
    (subject.chapters || []).forEach(function (ch) {
      (ch.quiz || []).forEach(function (q, i) {
        total++;
        var picked = (state.answers[ch.id] || {})[i];
        if (typeof picked === 'number') {
          answered++;
          if (picked === q.answer) correct++;
        }
      });
    });
    return { total: total, correct: correct, answered: answered };
  }

  function chapterQuizStats(ch) {
    var qs = ch.quiz || [];
    var answers = state.answers[ch.id] || {};
    var correct = 0, answered = 0;
    qs.forEach(function (q, i) {
      if (typeof answers[i] === 'number') {
        answered++;
        if (answers[i] === q.answer) correct++;
      }
    });
    return { total: qs.length, correct: correct, answered: answered };
  }

  function overallStats() {
    var total = 0, done = 0;
    SUBJECTS.forEach(function (s) {
      var st = subjectStats(s);
      total += st.total;
      done += st.done;
    });
    return { total: total, done: done, percent: total ? Math.round((done / total) * 100) : 0 };
  }

  /* ==================================================================
     4) 渲染：頂部進度環
     ================================================================== */
  function renderRing() {
    var subject = currentSubject();
    var s = subject ? subjectStats(subject) : overallStats();
    var label = subject ? (subject.name + ' 進度') : '整體學習進度';

    var fg = $('#overall-ring-fg');
    if (fg) {
      var circumference = 100;
      fg.setAttribute('stroke-dasharray', circumference + ' ' + circumference);
      fg.setAttribute('stroke-dashoffset', String(circumference - (circumference * s.percent / 100)));
    }
    var text = $('#overall-ring-label');
    if (text) text.textContent = s.percent + '%';
    var ring = $('#overall-ring');
    if (ring) {
      ring.setAttribute('title', label + '：' + s.done + ' / ' + s.total + ' 個學習點（' + s.percent + '%）');
    }
  }

  /* ==================================================================
     5) 渲染：首頁（科目卡片）
     ================================================================== */
  function renderHome() {
    var grid = $('#subject-grid');
    if (!grid) return;

    if (!SUBJECTS.length) {
      grid.innerHTML = '<p class="quiz-empty">載入不到課程資料，請確認 data-html.js / data-css.js / data-js.js 有沒有放在同一個資料夾。</p>';
      return;
    }

    grid.innerHTML = SUBJECTS.map(function (sub) {
      var s = subjectStats(sub);
      var q = subjectQuizStats(sub);
      var points = (sub.chapters || []).reduce(function (a, c) { return a + (c.points || []).length; }, 0);
      var doneAll = s.percent === 100;

      return '<button class="subject-card theme-' + esc(sub.id) + (doneAll ? ' is-done' : '') + '"' +
        ' type="button" data-subject="' + esc(sub.id) + '">' +
        '<span class="sc-top">' +
          '<span class="sc-icon" aria-hidden="true">' + esc(sub.icon || '📘') + '</span>' +
          '<span class="sc-title">' +
            '<span class="sc-name">' + esc(sub.name) + '</span>' +
            '<span class="sc-tag">' + esc(sub.tagline || '') + '</span>' +
          '</span>' +
          (doneAll ? '<span class="sc-badge">已完成 ✔</span>' : '') +
        '</span>' +
        '<span class="sc-intro">' + esc(sub.intro || '') + '</span>' +
        '<span class="sc-meta">' + (sub.chapters || []).length + ' 章 · ' + points + ' 個學習點 · ' + q.total + ' 條測驗題</span>' +
        '<span class="sc-bar"><i style="width:' + s.percent + '%"></i></span>' +
        '<span class="sc-foot">' +
          '<span>📖 學習進度 ' + s.percent + '%（' + s.done + '/' + s.total + '）</span>' +
          '<span>📝 答對 ' + q.correct + '/' + q.total + '</span>' +
          '<span class="sc-go">開始學習 →</span>' +
        '</span>' +
      '</button>';
    }).join('');
  }

  /* ==================================================================
     6) 渲染：左邊章節選單
     ================================================================== */
  function renderSidebar() {
    var nav = $('#chapter-list');
    var subject = currentSubject();
    if (!nav) return;
    if (!subject) { nav.innerHTML = ''; return; }

    var ci = currentChapterIndex(subject);
    var title = $('#sidebar-title');
    if (title) title.textContent = (subject.icon || '') + ' ' + subject.name + ' 課程目錄';

    nav.innerHTML = (subject.chapters || []).map(function (ch, i) {
      var s = chapterStats(subject, ch);
      var active = i === ci ? ' is-active' : '';
      var doneMark = s.percent === 100 ? '<span class="done" title="已完成">✔</span>' : '';
      return '<button class="chapter-link' + active + '" type="button" data-chapter="' + i + '"' +
        ' aria-current="' + (i === ci ? 'true' : 'false') + '">' +
        '<span class="num">' + (i + 1) + '</span>' +
        '<span class="label">' + esc(ch.icon ? ch.icon + ' ' + ch.title : ch.title) + '</span>' +
        doneMark +
        '</button>';
    }).join('');
  }

  /* ==================================================================
     7) 渲染：學習模組
     ================================================================== */
  function renderLearn() {
    var body = $('#learn-body');
    var subject = currentSubject();
    if (!body) return;
    if (!subject) { body.innerHTML = ''; return; }

    var ci = currentChapterIndex(subject);
    var ch = (subject.chapters || [])[ci];
    if (!ch) {
      body.innerHTML = '<p class="quiz-empty">未有課程內容，請檢查資料檔。</p>';
      return;
    }

    var s = chapterStats(subject, ch);
    var previewJobs = [];

    var head =
      '<header class="chapter-head">' +
        '<span class="kicker">' + esc(subject.name) + ' · 第 ' + (ci + 1) + ' 章 ' + esc(ch.icon || '') + '</span>' +
        '<h1>' + esc(ch.title) + '</h1>' +
        '<p>' + esc(ch.summary || '') + '</p>' +
        '<div class="chapter-progress">' +
          '<div class="bar"><span style="width:' + s.percent + '%"></span></div>' +
          '<small>已學會 ' + s.done + ' / ' + s.total + ' 個學習點</small>' +
        '</div>' +
      '</header>';

    var points = (ch.points || []).map(function (p, i) {
      var key = pointKey(subject.id, ch.id, i);
      var isDone = !!state.done[key];
      var lang = p.lang || subject.codeLang;

      var html = '<article class="point' + (isDone ? ' is-done' : '') + '" id="point-' + esc(ch.id) + '-' + i + '">';

      html += '<div class="point-head">' +
          '<span class="point-no">學習點 ' + (i + 1) + '</span>' +
          '<h3>' + rich(p.title) + '</h3>' +
        '</div>';

      html += '<div class="point-body">';

      if (p.analogy) {
        html += '<div class="analogy"><b>🫧 生活化比喻：</b>' + nl2brRich(p.analogy) + '</div>';
      }

      if (p.code) {
        html += '<p class="subhead">💻 程式碼範例（' + esc(LANG_LABEL[lang] || lang) + '）</p>' +
          '<div class="codeblock">' +
            '<div class="codeblock-head"><span>' + esc(LANG_LABEL[lang] || lang) + '</span>' +
            '<span>唔可以改，想試就去「🧪 練習」分頁</span></div>' +
            '<pre><code>' + highlight(p.code, lang) + '</code></pre>' +
          '</div>';
      }

      if (p.preview) {
        var pvId = 'pvpoint-' + esc(ch.id) + '-' + i;
        previewJobs.push({ id: pvId, preview: p.preview });
        html += '<p class="subhead">🖥️ 即時預覽（下面係真實渲染出嚟嘅效果）</p>' +
          '<div class="preview-mount" id="' + pvId + '"></div>';
      }

      if (p.result) {
        html += '<p class="subhead">' + (lang === 'js' ? '🖥️ Console 輸出' : '🖥️ 輸出結果') + '</p>' +
          '<div class="outputbox"><pre>' + esc(p.result) + '</pre></div>';
      }

      if (p.tip) {
        html += '<p class="subhead">💡 重點提示</p>' +
          '<p class="tip">' + nl2brRich(p.tip) + '</p>';
      }

      html += '<label class="learn-check">' +
          '<input type="checkbox" data-done="' + esc(ch.id) + '" data-point="' + i + '"' +
          (isDone ? ' checked' : '') + '>' +
          '<span>我已經學會這一點</span>' +
        '</label>';

      html += '</div></article>';
      return html;
    }).join('');

    var qs = chapterQuizStats(ch);
    var quizCta =
      '<div class="quiz-done" style="margin-top:16px">' +
        '<p style="margin:0 0 8px"><b>📝 這一章的小測驗</b>：共 ' + qs.total + ' 題，' +
        (qs.answered ? '已答 ' + qs.answered + ' 題，暫時答對 ' + qs.correct + ' 題。' : '還未開始。') + '</p>' +
        '<button class="btn btn-primary" type="button" data-goto="quiz">去測驗 →</button>' +
      '</div>';

    body.innerHTML = head + points + quizCta;

    /* 插入完 HTML 之後，才為每個預覽建立 iframe（避免屬性逃逸問題） */
    previewJobs.forEach(function (job) {
      var host = document.getElementById(job.id);
      if (!host) return;
      host.appendChild(makePreviewFrame(job.preview, 0));
    });

    updatePager();
  }

  /* 建立一個「只睇效果」的預覽 iframe（學習模組用） */
  function makePreviewFrame(preview, height) {
    var iframe = document.createElement('iframe');
    iframe.className = 'preview-frame';
    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.setAttribute('title', '即時預覽');
    if (height) iframe.style.height = height + 'px';

    if (window.Runner && typeof window.Runner.buildSrcdoc === 'function') {
      iframe.srcdoc = window.Runner.buildSrcdoc({
        code: preview.css || preview.html,
        lang: preview.css ? 'css' : 'html',
        mode: 'preview',
        previewHtml: preview.html
      });
    }
    return iframe;
  }

  function updatePager() {
    var subject = currentSubject();
    var prev = $('#btn-prev-chapter');
    var next = $('#btn-next-chapter');
    var total = subject ? (subject.chapters || []).length : 0;
    var ci = subject ? currentChapterIndex(subject) : 0;
    if (prev) prev.disabled = ci <= 0;
    if (next) next.disabled = ci >= total - 1;
  }

  /* ==================================================================
     8) 渲染：練習模組
     ================================================================== */
  function currentDraft(subject, ch) {
    var key = draftKey(subject.id, ch.id);
    return Object.prototype.hasOwnProperty.call(state.drafts, key)
      ? state.drafts[key]
      : (ch.puzzle ? ch.puzzle.starter || '' : '');
  }

  /* ------------------------------------------------------------------
     手機／鍵盤快速輸入符號列
     為甚麼要有？初學者在手機上面打 { } < > ; " 極之痛苦（要切兩次鍵盤），
     所以提供一排符號掣，一撳就插入。按科目用不同的符號組。
     ------------------------------------------------------------------ */
  var SYMBOLS = {
    html: ['<', '>', '/', '=', '"', "'", '#', '.', ':', ';', '{', '}', '\t'],
    css: ['{', '}', ':', ';', '.', '#', '(', ')', '-', '%', '"', "'", '\t'],
    js: ['{', '}', '(', ')', '[', ']', ';', '=', '+', '-', "'", '"', '`', '=>', '\t']
  };

  function symbolBar(lang) {
    var list = SYMBOLS[lang] || SYMBOLS.js;
    return '<div class="symbol-bar" role="group" aria-label="快速輸入符號">' +
        '<span class="symbol-bar-label" aria-hidden="true">⌨️ 快速輸入</span>' +
        list.map(function (s) {
          if (s === '\t') {
            return '<button class="symbol-btn symbol-btn-wide" type="button" data-insert="  "' +
              ' title="縮排兩個空格" aria-label="縮排兩個空格">⇥</button>';
          }
          return '<button class="symbol-btn" type="button" data-insert="' + esc(s) + '"' +
            ' title="插入 ' + esc(s) + '" aria-label="插入 ' + esc(s) + '">' + esc(s) + '</button>';
        }).join('') +
      '</div>';
  }

  /* 在游標位置插入文字：保留 Ctrl+Z 復原，並且同手打一樣記入草稿 */
  function insertAtCursor(ta, text) {
    if (!ta) return;
    ta.focus();

    var done = false;
    try {
      done = document.execCommand('insertText', false, text);   // 有選取範圍就會取代
    } catch (e) { done = false; }

    if (!done) {
      /* 舊瀏覽器／execCommand 失效時的後備寫法 */
      var start = ta.selectionStart;
      var end = ta.selectionEnd;
      ta.value = ta.value.slice(0, start) + text + ta.value.slice(end);
      ta.selectionStart = ta.selectionEnd = start + text.length;
    }

    var subject = currentSubject();
    if (subject) {
      state.drafts[draftKey(subject.id, ta.getAttribute('data-editor'))] = ta.value;
      clearTimeout(ta._saveTimer);
      ta._saveTimer = setTimeout(saveState, 400);
    }
  }

  function renderPracticeTabs() {    var tabs = $('#practice-tabs');
    var subject = currentSubject();
    if (!tabs || !subject) return;

    var ci = currentChapterIndex(subject);
    tabs.innerHTML = (subject.chapters || []).map(function (ch, i) {
      if (!ch.puzzle) return '';
      return '<button class="tab' + (i === ci ? ' is-active' : '') + '" type="button" role="tab"' +
        ' data-practice="' + i + '" aria-selected="' + (i === ci ? 'true' : 'false') + '"' +
        ' title="' + esc(ch.puzzle.title || ch.title) + '">' + (i + 1) + '. ' + esc(ch.title) + '</button>';
    }).join('');
  }

  function renderPractice() {
    var list = $('#practice-list');
    var subject = currentSubject();
    if (!list || !subject) return;

    renderPracticeTabs();

    var lead = $('#practice-lead');
    if (lead) {
      lead.innerHTML = subject.runMode === 'preview'
        ? '揀一個練習，直接改下面嘅程式碼，再撳「▶ 執行」——' +
          '結果會<b>即時渲染</b>成真實網頁顯示喺下面（如果程式碼有 <code>console.log</code>，亦會顯示出嚟）。'
        : '揀一個練習，直接改下面嘅程式碼，再撳「▶ 執行」，' +
          '<code>console.log()</code> 嘅輸出會顯示喺輸出區（唔會用 alert 彈窗）。';
    }

    var ci = currentChapterIndex(subject);

    list.innerHTML = (subject.chapters || []).map(function (ch, i) {
      var p = ch.puzzle;
      if (!p) return '';

      var mode = p.mode || subject.runMode;
      var lang = p.lang || subject.codeLang;
      var isActive = i === ci;

      return '<article class="practice-card' + (isActive ? ' is-active' : '') + '"' +
        ' id="practice-' + esc(ch.id) + '" data-chapter-index="' + i + '">' +

        '<h3>🧪 ' + esc(p.title || ('練習 ' + (i + 1))) + '</h3>' +
        '<div class="practice-meta">' +
          '<span class="pill pill-accent">第 ' + (i + 1) + ' 章 · ' + esc(ch.title) + '</span>' +
          '<span class="pill">' + esc(LANG_LABEL[lang] || lang) + '</span>' +
          '<span class="pill">' + (mode === 'preview' ? '即時預覽' : 'Console 輸出') + '</span>' +
        '</div>' +

        '<div class="task">' + (p.task || '') + '</div>' +

        (mode === 'preview' && lang === 'css' && p.previewHtml
          ? '<p class="subhead">🧱 固定 HTML（唔可以改，你只需要寫 CSS）</p>' +
            '<div class="codeblock is-static"><div class="codeblock-head"><span>HTML</span>' +
            '<span>學員唔需要改呢部分</span></div>' +
            '<pre><code>' + highlight(p.previewHtml, 'html') + '</code></pre></div>'
          : '') +

        '<label class="sr-only" for="code-' + esc(ch.id) + '">程式碼輸入框</label>' +
        '<div class="editor">' +
          '<div class="editor-head">' +
            '<span>✏️ 可編輯程式碼（按 Tab 可以縮排）</span>' +
            '<span>Ctrl / Cmd + Enter 都可以執行</span>' +
          '</div>' +
          '<textarea id="code-' + esc(ch.id) + '" data-editor="' + esc(ch.id) + '" spellcheck="false"' +
          ' autocapitalize="off" autocomplete="off" autocorrect="off">' + esc(currentDraft(subject, ch)) + '</textarea>' +
          /* 手機／鍵盤快速輸入：初學者在手機打 { } < > ; " 很痛苦，所以提供一排符號掣 */
          symbolBar(lang) +
        '</div>' +

        '<div class="practice-actions">' +
          '<button class="btn btn-primary" type="button" data-run="' + esc(ch.id) + '">▶ 執行</button>' +
          '<button class="btn" type="button" data-hint="' + esc(ch.id) + '">💡 提示</button>' +
          '<button class="btn" type="button" data-answer="' + esc(ch.id) + '">👀 顯示答案</button>' +
          '<button class="btn btn-ghost" type="button" data-reset-code="' + esc(ch.id) + '">↺ 還原範例</button>' +
          '<span class="run-status" data-status="' + esc(ch.id) + '"></span>' +
        '</div>' +

        '<div class="hidden-box" data-hintbox="' + esc(ch.id) + '">' +
          '<p class="subhead">💡 提示</p>' +
          '<p class="tip">' + (p.hint || '冇提示，試下自己諗。') + '</p>' +
        '</div>' +

        '<div class="hidden-box" data-answerbox="' + esc(ch.id) + '">' +
          '<div class="answerbox">' +
            '<p class="subhead">👀 參考答案（唔止一個寫法，啱就得）</p>' +
            '<div class="codeblock"><pre><code>' + highlight(p.solution || '', lang) + '</code></pre></div>' +
          '</div>' +
        '</div>' +

        (mode === 'preview'
          ? '<p class="subhead">🖥️ 即時預覽</p>' +
            '<div class="preview-mount" data-preview-mount="' + esc(ch.id) + '"' +
              ' style="height:' + (p.previewHeight || 260) + 'px">' +
              '<span class="preview-placeholder">撳「▶ 執行」就會喺呢度顯示結果</span>' +
            '</div>'
          : '') +

        '<p class="subhead">📋 Console 輸出</p>' +
        '<div class="outputbox is-empty" data-output="' + esc(ch.id) + '"><pre>' +
          (mode === 'preview' ? '（執行後，有 console.log 就會顯示喺呢度）' : '（未執行）') +
        '</pre></div>' +

        '<div class="feedback hidden-box" data-feedback="' + esc(ch.id) + '"></div>' +
        '</article>';
    }).join('');
  }

  function setStatus(chapterId, text) {
    var el = document.querySelector('[data-status="' + chapterId + '"]');
    if (el) el.textContent = text || '';
  }

  function showFeedback(chapterId, kind, html) {
    var el = document.querySelector('[data-feedback="' + chapterId + '"]');
    if (!el) return;
    if (!html) { el.className = 'feedback hidden-box'; el.innerHTML = ''; return; }
    el.className = 'feedback is-open ' + kind;
    el.innerHTML = html;
  }

  function showOutput(chapterId, html, isEmpty) {
    var el = document.querySelector('[data-output="' + chapterId + '"]');
    if (!el) return;
    el.className = 'outputbox' + (isEmpty ? ' is-empty' : '');
    el.innerHTML = '<pre>' + (html || '') + '</pre>';
  }

  function toggleBox(selector, force) {
    var el = document.querySelector(selector);
    if (!el) return;
    var open = typeof force === 'boolean' ? force : !el.classList.contains('is-open');
    el.classList.toggle('is-open', open);
  }

  /* 把學員的輸出攤平成純文字，用來自動檢查 expect */
  function logsToText(logs) {
    return (logs || []).map(function (e) {
      return (e.parts || []).map(function (p) { return p.text; }).join(' ');
    }).join('\n');
  }

  /* ==================================================================
     9) 執行練習
     ================================================================== */
  function runPuzzle(chapterId) {
    var subject = currentSubject();
    if (!subject) return;

    var ch = (subject.chapters || []).filter(function (c) { return c.id === chapterId; })[0];
    var editor = document.querySelector('[data-editor="' + chapterId + '"]');
    if (!ch || !editor || !ch.puzzle) return;

    var p = ch.puzzle;
    var mode = p.mode || subject.runMode;
    var lang = p.lang || subject.codeLang;
    var code = editor.value;

    state.drafts[draftKey(subject.id, ch.id)] = code;   // 記住草稿
    saveState();

    var runBtn = document.querySelector('[data-run="' + chapterId + '"]');
    if (runBtn) runBtn.disabled = true;
    setStatus(chapterId, '⏳ 執行中…');
    showFeedback(chapterId, 'info', '');

    /* 保護：萬一 runner.js 載入失敗，唔好令整個練習分頁爆掉 */
    if (!window.Runner || typeof window.Runner.run !== 'function') {
      if (runBtn) runBtn.disabled = false;
      setStatus(chapterId, '⚠️ 執行器未載入');
      showFeedback(chapterId, 'bad', '載入不到程式碼執行器（runner.js），請確認檔案有沒有放在同一個資料夾。');
      return;
    }

    var mount = document.querySelector('[data-preview-mount="' + chapterId + '"]');

    window.Runner.run({
      code: code,
      mode: mode,
      lang: lang,
      previewHtml: p.previewHtml,
      mount: mount
    }).then(function (res) {
      if (runBtn) runBtn.disabled = false;

      var logs = res.logs || [];
      var hasError = !!res.error;
      var hasLogs = logs.length > 0;
      var html = window.Runner.renderOutput(logs, res.error, res.timedOut, res.truncated);

      if (mode === 'preview') {
        if (hasLogs || hasError) {
          showOutput(chapterId, html, false);
        } else {
          showOutput(chapterId, '（呢段程式碼冇 console 輸出，睇上面嘅即時預覽就係結果）', true);
        }
      } else {
        showOutput(chapterId, html, !hasLogs && !hasError);
      }

      setStatus(chapterId, res.timedOut ? '⏱️ 逾時' : (hasError ? '⚠️ 執行時有錯誤' : '✅ 執行完成'));

      /* ---- 逾時 ---- */
      if (res.timedOut) {
        showFeedback(chapterId, 'bad',
          '<b>執行超時，程式可能跑唔完。</b><br>' +
          '最常見原因：<code>while</code> 條件永遠成立（死循環），或者漏寫了改變條件的程式碼（例如 <code>i++</code>）。');
        return;
      }

      /* ---- 即時預覽模式的回饋 ---- */
      if (mode === 'preview') {
        if (!code.trim()) {
          showFeedback(chapterId, 'info', '編輯框係空嘅，先寫啲程式碼再撳「▶ 執行」。');
          return;
        }

        var expectCode = p.expectCode;
        var extra = hasError
          ? '<br><br><b>另外：</b>預覽裡面嘅 <code>&lt;script&gt;</code> 有錯誤，睇下下面 Console 輸出嘅紅字。'
          : '';

        if (!expectCode) {
          showFeedback(chapterId, hasError ? 'bad' : 'ok',
            '預覽已經更新，睇下上面嘅效果對唔對。' + extra);
          return;
        }

        var hit = code.toLowerCase().indexOf(String(expectCode).toLowerCase()) !== -1;
        if (hit) {
          showFeedback(chapterId, 'ok',
            '🎉 <b>做得好！</b>程式碼見到「<code>' + esc(expectCode) + '</code>」，' +
            '睇下上面嘅預覽係咪你想要嘅效果。' + extra);
        } else {
          showFeedback(chapterId, 'bad',
            '預覽已經更新，但程式碼見不到「<b>' + esc(expectCode) + '</b>」。' +
            '檢查下係咪漏寫或者打錯字（例如大小寫、少了一個 <code>&gt;</code>）。' + extra);
        }
        return;
      }

      /* ---- Console 模式的回饋 ---- */
      if (hasError) {
        showFeedback(chapterId, 'bad',
          '<b>程式碼有錯誤，睇下上面輸出區嘅紅字。</b><br>' +
          '常見原因：漏了括號、串錯變數名、用了未宣告的變數。');
        return;
      }
      if (!p.expect) {
        if (!hasLogs) {
          showFeedback(chapterId, 'info',
            '程式執行過，但沒有任何輸出。記得用 <code>console.log()</code> 印出結果。');
        } else {
          showFeedback(chapterId, 'ok', '程式執行成功！睇下輸出區嘅結果。');
        }
        return;
      }
      if (!hasLogs) {
        showFeedback(chapterId, 'info',
          '程式執行過，但沒有任何輸出。記得用 <code>console.log()</code> 印出結果。');
        return;
      }
      if (logsToText(logs).indexOf(String(p.expect)) !== -1) {
        showFeedback(chapterId, 'ok',
          '🎉 <b>做得好！</b>輸出見到「' + esc(p.expect) + '」，即係同預期一樣。');
      } else {
        showFeedback(chapterId, 'bad',
          '輸出嘅內容同預期唔同。預期應該包含「<b>' + esc(p.expect) + '</b>」。' +
          '睇下係咪改漏了變數，或者印錯了嘢？');
      }
    });
  }

  /* ==================================================================
     10) 分頁 / 科目 / 章節切換
     ================================================================== */

  /* 統一入口：quiz.js 載入失敗時亦不會拋錯 */
  function renderQuiz() {
    var box = $('#quiz-body');
    if (!box) return;
    if (!window.Quiz || typeof window.Quiz.render !== 'function') {
      box.innerHTML = '<p class="quiz-empty">載入不到測驗模組（quiz.js），請確認檔案有沒有放在同一個資料夾。</p>';
      return;
    }
    window.Quiz.render(box, quizCtx);
  }

  /* 首頁 / 科目：切換整個版面 */
  function renderView() {
    var subject = currentSubject();
    var isHome = !subject;

    $$('.view').forEach(function (v) {
      var name = v.getAttribute('data-view');
      v.classList.toggle('is-active', isHome ? name === 'home' : name === state.tab);
    });

    var tabs = $('#main-tabs');
    if (tabs) tabs.hidden = isHome;
    var sidebar = $('#sidebar');
    if (sidebar) sidebar.hidden = isHome;
    var homeBtn = $('#btn-home');
    if (homeBtn) homeBtn.hidden = isHome;

    var logo = $('#brand-logo');
    var title = $('#brand-title');
    var sub = $('#brand-sub');
    if (isHome) {
      document.documentElement.removeAttribute('data-subject');
      if (logo) logo.textContent = BRAND.mark;
      if (title) title.textContent = BRAND.name;
      if (sub) sub.textContent = BRAND.taglineSubjects;
      document.title = BRAND.name + ' ' + BRAND.nameEn + '｜HTML · CSS · JavaScript 零基礎入門';
      renderHome();
    } else {
      document.documentElement.setAttribute('data-subject', subject.id);
      if (logo) logo.textContent = subject.icon || '📘';
      if (title) title.textContent = subject.name + ' ' + BRAND.subjectSuffix;
      if (sub) sub.textContent = BRAND.name + ' · ' + (subject.tagline || '由零開始，一步一步學識');
      document.title = subject.name + ' ' + BRAND.subjectSuffix + '｜' + BRAND.name + ' ' + BRAND.nameEn;
      renderSidebar();
      if (state.tab === 'learn') renderLearn();
      if (state.tab === 'practice') renderPractice();
      if (state.tab === 'quiz') renderQuiz();
    }

    renderRing();
    updatePager();
  }

  function setTab(tab) {
    if (['learn', 'practice', 'quiz'].indexOf(tab) === -1) tab = 'learn';
    state.tab = tab;
    saveState();

    $$('.tab[data-tab]').forEach(function (btn) {
      var isActive = btn.getAttribute('data-tab') === tab;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    if (currentSubject()) {
      $$('.view').forEach(function (v) {
        v.classList.toggle('is-active', v.getAttribute('data-view') === tab);
      });
      if (tab === 'learn') renderLearn();
      if (tab === 'practice') renderPractice();
      if (tab === 'quiz') renderQuiz();
    }

    closeSidebar();
    scrollToTop(true);
  }

  function setSubject(id) {
    var subject = findSubject(id);
    if (!subject) return;
    state.view = 'subject';
    state.subject = id;
    state.tab = 'learn';
    saveState();

    $$('.tab[data-tab]').forEach(function (btn) {
      var isActive = btn.getAttribute('data-tab') === 'learn';
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    renderView();
    closeSidebar();
    scrollToTop(true);
  }

  function goHome() {
    state.view = 'home';
    saveState();
    renderView();
    closeSidebar();
    scrollToTop(true);
  }

  function setChapter(index, opts) {
    opts = opts || {};
    var subject = currentSubject();
    if (!subject) return;
    var total = (subject.chapters || []).length;
    if (index < 0 || index >= total) return;

    state.chapter[subject.id] = index;
    saveState();

    renderSidebar();
    renderRing();
    if (state.tab === 'learn') renderLearn();
    if (state.tab === 'practice') renderPractice();
    if (state.tab === 'quiz') renderQuiz();

    if (state.tab === 'learn') {
      /* 學習分頁：跳到新章節的第 1 個學習點（只有明確要求 focus 才做，
         例如撳側欄章節或者上一章／下一章） */
      if (opts.focus) {
        var card = $('#point-' + (subject.chapters[index] || {}).id + '-0');
        if (card) card.scrollIntoView({ block: 'start' });
      }
    } else {
      /* 練習／測驗分頁：一律捲返最頂。
         這樣在「📝 測驗」揀章節（側欄或者底部的全科總分表）之後，
         畫面就會由第 1 題開始，唔使學員自己捲上去。 */
      scrollToTop(false);
      /* 內容剛剛換過，瀏覽器的 scroll anchoring 可能在排版完成後又微調位置，
         所以下一幀再確認一次，確保真係停在最頂（第 1 題）。 */
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(function () { scrollToTop(false); });
      }
    }
  }

  /* ==================================================================
     11) 手機側欄
     ================================================================== */
  function openSidebar() {
    var sb = $('#sidebar');
    var bd = $('#backdrop');
    var btn = $('#btn-menu');
    if (sb) sb.classList.add('is-open');
    if (bd) bd.hidden = false;
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    var sb = $('#sidebar');
    var bd = $('#backdrop');
    var btn = $('#btn-menu');
    if (sb) sb.classList.remove('is-open');
    if (bd) bd.hidden = true;
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  /* ==================================================================
     12) 深色模式
     ================================================================== */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var btn = $('#btn-theme');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('title', theme === 'dark' ? '切換淺色模式' : '切換深色模式');
    }
    storage.set(THEME_KEY, theme);
  }

  function initTheme() {
    var saved = storage.get(THEME_KEY, null);
    if (saved !== 'dark' && saved !== 'light') {
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      saved = prefersDark ? 'dark' : 'light';
    }
    applyTheme(saved);
  }

  /* ==================================================================
     13) 事件綁定（用事件委派，減少監聽器數量）
     ================================================================== */
  function bindEvents() {

    /* --- 三大模組分頁 --- */
    $$('.tab[data-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () { setTab(btn.getAttribute('data-tab')); });
    });

    /* --- 首頁：揀科目 --- */
    var grid = $('#subject-grid');
    if (grid) {
      grid.addEventListener('click', function (e) {
        var card = e.target.closest('[data-subject]');
        if (card) setSubject(card.getAttribute('data-subject'));
      });
    }

    /* --- 返回科目選擇 --- */
    var homeBtn = $('#btn-home');
    if (homeBtn) homeBtn.addEventListener('click', goHome);

    /* --- 側欄：揀章節 --- */
    var chapterList = $('#chapter-list');
    if (chapterList) {
      chapterList.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-chapter]');
        if (!btn) return;
        setChapter(Number(btn.getAttribute('data-chapter')), { focus: true });
      });
    }

    /* --- 上一章 / 下一章 --- */
    var prev = $('#btn-prev-chapter');
    var next = $('#btn-next-chapter');
    if (prev) {
      prev.addEventListener('click', function () {
        var s = currentSubject();
        if (s) setChapter(currentChapterIndex(s) - 1, { focus: true });
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        var s = currentSubject();
        if (s) setChapter(currentChapterIndex(s) + 1, { focus: true });
      });
    }

    /* --- 學習模組：勾選「已學會」、去測驗 --- */
    var learnBody = $('#learn-body');
    if (learnBody) {
      learnBody.addEventListener('change', function (e) {
        var input = e.target.closest('[data-done]');
        if (!input) return;
        var subject = currentSubject();
        if (!subject) return;

        var chId = input.getAttribute('data-done');
        var idx = input.getAttribute('data-point');
        var key = pointKey(subject.id, chId, idx);

        if (input.checked) state.done[key] = true; else delete state.done[key];
        saveState();

        var card = input.closest('.point');
        if (card) card.classList.toggle('is-done', input.checked);

        renderSidebar();
        renderRing();

        /* 更新章節進度條（不重繪整頁，保留捲動位置） */
        var ch = (subject.chapters || []).filter(function (c) { return c.id === chId; })[0];
        if (ch) {
          var s = chapterStats(subject, ch);
          var bar = document.querySelector('.chapter-progress .bar > span');
          var label = document.querySelector('.chapter-progress small');
          if (bar) bar.style.width = s.percent + '%';
          if (label) label.textContent = '已學會 ' + s.done + ' / ' + s.total + ' 個學習點';
        }
      });

      learnBody.addEventListener('click', function (e) {
        var goto = e.target.closest('[data-goto]');
        if (goto) setTab(goto.getAttribute('data-goto'));
      });
    }

    /* --- 練習模組 --- */
    var practiceTabs = $('#practice-tabs');
    if (practiceTabs) {
      practiceTabs.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-practice]');
        if (!btn) return;
        setChapter(Number(btn.getAttribute('data-practice')));
      });
    }

    var practiceList = $('#practice-list');
    if (practiceList) {
      /* 記住草稿 */
      practiceList.addEventListener('input', function (e) {
        var ta = e.target.closest('[data-editor]');
        if (!ta) return;
        var subject = currentSubject();
        if (!subject) return;
        state.drafts[draftKey(subject.id, ta.getAttribute('data-editor'))] = ta.value;
        clearTimeout(ta._saveTimer);
        ta._saveTimer = setTimeout(saveState, 600);
      });

      /* 按鈕 */
      practiceList.addEventListener('click', function (e) {
        var subject = currentSubject();
        if (!subject) return;

        var run = e.target.closest('[data-run]');
        if (run) { runPuzzle(run.getAttribute('data-run')); return; }

        var hint = e.target.closest('[data-hint]');
        if (hint) {
          toggleBox('[data-hintbox="' + hint.getAttribute('data-hint') + '"]');
          return;
        }

        var ans = e.target.closest('[data-answer]');
        if (ans) {
          toggleBox('[data-answerbox="' + ans.getAttribute('data-answer') + '"]');
          return;
        }

        /* 快速輸入符號列：把符號插入對應編輯框的游標位置 */
        var sym = e.target.closest('[data-insert]');
        if (sym) {
          var box = sym.closest('.editor');
          insertAtCursor(box ? box.querySelector('[data-editor]') : null, sym.getAttribute('data-insert'));
          return;
        }

        var reset = e.target.closest('[data-reset-code]');
        if (reset) {
          var rid = reset.getAttribute('data-reset-code');
          var ch = (subject.chapters || []).filter(function (c) { return c.id === rid; })[0];
          var ta = document.querySelector('[data-editor="' + rid + '"]');
          if (ch && ta && ch.puzzle) {
            ta.value = ch.puzzle.starter || '';
            state.drafts[draftKey(subject.id, rid)] = ta.value;
            saveState();
            showOutput(rid, '（已還原，未執行）', true);
            showFeedback(rid, 'info', '');
            setStatus(rid, '');
            var mount = document.querySelector('[data-preview-mount="' + rid + '"]');
            if (mount) mount.innerHTML = '<span class="preview-placeholder">撳「▶ 執行」就會喺呢度顯示結果</span>';
          }
          return;
        }
      });

      /* Tab 縮排 + Ctrl/Cmd + Enter 執行 */
      practiceList.addEventListener('keydown', function (e) {
        var ta = e.target.closest('[data-editor]');
        if (!ta) return;

        if (e.key === 'Tab') {
          e.preventDefault();
          var start = ta.selectionStart;
          var end = ta.selectionEnd;
          ta.value = ta.value.slice(0, start) + '  ' + ta.value.slice(end);
          ta.selectionStart = ta.selectionEnd = start + 2;
          var subject = currentSubject();
          if (subject) state.drafts[draftKey(subject.id, ta.getAttribute('data-editor'))] = ta.value;
          return;
        }

        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          runPuzzle(ta.getAttribute('data-editor'));
        }
      });
    }

    /* --- 手機側欄 --- */
    var menuBtn = $('#btn-menu');
    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        var sb = $('#sidebar');
        if (sb && sb.classList.contains('is-open')) closeSidebar(); else openSidebar();
      });
    }
    var backdrop = $('#backdrop');
    if (backdrop) backdrop.addEventListener('click', closeSidebar);

    /* --- 深色模式 --- */
    var themeBtn = $('#btn-theme');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var now = document.documentElement.getAttribute('data-theme');
        applyTheme(now === 'dark' ? 'light' : 'dark');
      });
    }

    /* --- 重置進度（要撳兩次確認，避免誤觸） --- */
    var resetBtn = $('#btn-reset');
    if (resetBtn) {
      var confirming = false;
      resetBtn.addEventListener('click', function () {
        if (!confirming) {
          confirming = true;
          resetBtn.textContent = '再撳一次確認';
          setTimeout(function () {
            confirming = false;
            resetBtn.textContent = '重置進度';
          }, 4000);
          return;
        }
        confirming = false;
        resetBtn.textContent = '重置進度';
        state.done = {};
        state.answers = {};
        state.drafts = {};
        saveState();
        renderView();
      });
    }

    /* --- 鍵盤：Ctrl / Cmd + Enter 快速執行目前練習 --- */
    document.addEventListener('keydown', function (e) {
      if (e.defaultPrevented) return;         // 編輯框自己已經處理過
      if (!(e.ctrlKey || e.metaKey) || e.key !== 'Enter') return;
      if (state.tab !== 'practice') return;
      var subject = currentSubject();
      if (!subject) return;
      var ch = currentChapter(subject);
      if (ch && ch.puzzle) runPuzzle(ch.id);
    });
  }

  /* ==================================================================
     14) 啟動
     ================================================================== */
  function init() {
    try {
      initTheme();

      if (!SUBJECTS.length) {
        var body = $('#learn-body');
        if (body) {
          body.innerHTML = '<p class="quiz-empty">載入不到課程資料，請確認 <code>data-html.js</code>、' +
            '<code>data-css.js</code>、<code>data-js.js</code> 有沒有放在同一個資料夾，' +
            '而且同 <code>index.html</code> 一齊開啟。</p>';
        }
        renderView();
      } else {
        /* 測驗模組：監聽器只註冊一次，之後用 render 更新內容 */
        if (window.Quiz && typeof window.Quiz.init === 'function') {
          window.Quiz.init($('#quiz-body'), quizCtx);
        }
        bindEvents();
        renderView();
        setTab(state.tab);
      }
    } catch (err) {
      console.error('初始化失敗：', err);
      var learn = $('#learn-body');
      if (learn) {
        learn.innerHTML = '<div class="chapter-head"><h1>😵 網站啟動出錯</h1>' +
          '<p>請打開瀏覽器 DevTools（F12）的 Console 睇下紅字。錯誤訊息：<code>' +
          esc(String((err && err.message) || err)) + '</code></p></div>';
      }
    } finally {
      var boot = $('#boot-note');
      if (boot) boot.classList.add('is-hidden');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
