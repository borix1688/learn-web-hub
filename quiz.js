/* ============================================================================
   前端基礎學堂 Frontend Foundations — quiz.js
   ----------------------------------------------------------------------------
   測驗模組（三大模組之三）負責：
     1. 一題一題顯示選擇題 / 判斷題
     2. 揀答案即刻判分，顯示對錯顏色同解釋
     3. 頂部顯示本章得分同進度條；底部顯示「全科總分」同各章一覽
     4. 答錯可以撳「🔄 重做呢題」，亦可以一次過重做所有答錯的題
     5. 答案交畀 app.js 存入 localStorage，所以換章節都唔會消失

   同 app.js 的分工：
     app.js  ── 提供資料（科目、章節、進度、儲存）＋ 呼叫 Quiz
     quiz.js ── 只負責「畫測驗畫面」同「處理答題」
   ========================================================================== */

(function () {
  'use strict';

  var container = null;
  var ctx = null;
  var bound = false;

  /* ------------------------------ 小工具 ------------------------------ */

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* 只開放 <code> <b> <strong> <em> <br> 幾種標籤，其他一律當純文字（安全） */
  function rich(str) {
    return escapeHtml(str).replace(
      /&lt;(\/?)(code|b|strong|em|br)\s*\/?&gt;/gi,
      function (all, slash, tag) {
        tag = tag.toLowerCase();
        if (tag === 'br') return '<br>';
        return '<' + slash + tag + '>';
      }
    );
  }

  /* 把題目正規化：判斷題（type: 'tf'）自動補「對 / 不對」兩個選項 */
  function normalize(q) {
    var type = q.type === 'tf' ? 'tf' : 'mc';
    var options = type === 'tf'
      ? (q.options && q.options.length ? q.options : ['對', '不對'])
      : (q.options || []);
    return {
      type: type,
      text: q.q || '',
      options: options,
      answer: typeof q.answer === 'number' ? q.answer : 0,
      explain: q.explain || ''
    };
  }

  /* 本章計分 */
  function score(chapter, answers) {
    var quiz = chapter.quiz || [];
    var total = quiz.length;
    var answered = 0;
    var correct = 0;

    quiz.forEach(function (q, i) {
      var picked = answers[i];
      if (typeof picked === 'number') {
        answered++;
        if (picked === normalize(q).answer) correct++;
      }
    });

    return {
      total: total,
      answered: answered,
      correct: correct,
      percent: total ? Math.round((correct / total) * 100) : 0
    };
  }

  /* 全科計分（連每章一覽） */
  function subjectScore(subject, allAnswers) {
    var per = [];
    var total = 0;
    var correct = 0;
    var answered = 0;

    (subject.chapters || []).forEach(function (ch, i) {
      var s = score(ch, allAnswers[ch.id] || {});
      per.push({ index: i, chapter: ch, stats: s });
      total += s.total;
      correct += s.correct;
      answered += s.answered;
    });

    return {
      per: per,
      total: total,
      correct: correct,
      answered: answered,
      percent: total ? Math.round((correct / total) * 100) : 0
    };
  }

  /* ------------------------------ 主渲染 ------------------------------ */

  function render(el, context) {
    if (el) container = el;
    if (context) ctx = context;
    if (!container || !ctx) return;

    var subject = ctx.getSubject();
    if (!subject) {
      container.innerHTML = '<p class="quiz-empty">請先揀一個科目。</p>';
      return;
    }

    var chapters = subject.chapters || [];
    var ci = ctx.getChapterIndex();
    var chapter = chapters[ci];
    if (!chapter) {
      container.innerHTML = '<p class="quiz-empty">未有章節可以測驗。</p>';
      return;
    }

    var quiz = chapter.quiz || [];
    var allAnswers = ctx.getAllAnswers ? ctx.getAllAnswers() : {};
    var subj = subjectScore(subject, allAnswers);

    var html = '';

    /* ---------- 頂部：標題 + 本章分數 + 進度條 ---------- */
    if (!quiz.length) {
      html += '<div class="view-head"><h2>📝 測驗</h2><p>' + escapeHtml(chapter.title) +
        ' 這一章未加入測驗題。</p></div>';
    } else {
      var answers = ctx.getAnswers(chapter.id) || {};
      var s = score(chapter, answers);
      var tone = s.percent >= 80 ? 'good' : (s.percent >= 50 ? 'mid' : 'low');
      var wrongList = [];
      quiz.forEach(function (q, i) {
        if (typeof answers[i] === 'number' && answers[i] !== normalize(q).answer) wrongList.push(i);
      });

      html +=
        '<div class="quiz-head">' +
          '<div class="view-head" style="margin-bottom:0">' +
            '<h2>📝 ' + escapeHtml(chapter.title) + ' — 章節測驗</h2>' +
            '<p>共 ' + s.total + ' 題。揀了答案即刻話你知對唔對，並解釋原因。答錯可以撳「🔄 重做呢題」再試。</p>' +
          '</div>' +
          '<div class="quiz-score-row">' +
            '<strong class="' + tone + '">得分 ' + s.correct + ' / ' + s.total + '（' + s.percent + '%）</strong>' +
            '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + s.percent + '"><span style="width:' + s.percent + '%"></span></div>' +
            '<small>' + (s.answered === s.total
              ? '已全部作答 ✔'
              : '已答 ' + s.answered + ' / ' + s.total + ' 題') + '</small>' +
          '</div>' +
          (s.answered
            ? '<div class="quiz-tools">' +
                (wrongList.length
                  ? '<button class="btn btn-sm" type="button" data-quiz-redoall="1">🔄 重做所有答錯的題（' + wrongList.length + '）</button>'
                  : '') +
                '<button class="btn btn-sm btn-ghost" type="button" data-quiz-clear="1">🧹 清除本章答案</button>' +
              '</div>'
            : '') +
        '</div>';

      /* ---------- 每一題 ---------- */
      quiz.forEach(function (rawQ, qi) {
        var q = normalize(rawQ);
        var picked = answers[qi];
        var answered = typeof picked === 'number';
        var isCorrect = answered && picked === q.answer;
        var qClass = 'question' + (answered ? (isCorrect ? ' is-correct' : ' is-wrong') : '');

        html += '<article class="' + qClass + '">';
        html += '<h3>' +
            '<span class="q-no">第 ' + (qi + 1) + ' 題</span>' +
            '<span class="q-tag">' + (q.type === 'tf' ? '判斷題' : '選擇題') + '</span>' +
          '</h3>';
        html += '<p class="q-text">' + rich(q.text) + '</p>';

        html += '<ul class="options">';
        q.options.forEach(function (opt, oi) {
          var cls = 'option';
          var mark = '';

          if (answered) {
            if (oi === q.answer) { cls += ' is-correct'; mark = ' ✔'; }
            else if (oi === picked) { cls += ' is-wrong'; mark = ' ✘'; }
          }

          html += '<li>' +
            '<button class="' + cls + '" type="button" data-quiz-option="' + oi + '"' +
              ' data-quiz-index="' + qi + '"' + (answered ? ' disabled' : '') + '>' +
              '<span class="key">' + String.fromCharCode(65 + oi) + '</span>' +
              '<span class="opt-text">' + rich(opt) + mark + '</span>' +
            '</button>' +
          '</li>';
        });
        html += '</ul>';

        if (answered) {
          html += '<div class="explain">' +
            (isCorrect
              ? '<b>✅ 答對了！</b> '
              : '<b>❌ 答錯了。</b> 正確答案係「' + rich(q.options[q.answer]) + '」。 ') +
            rich(q.explain) +
          '</div>';

          if (!isCorrect) {
            html += '<div class="question-actions">' +
              '<button class="btn btn-sm" type="button" data-quiz-redo="' + qi + '">🔄 重做呢題</button>' +
            '</div>';
          }
        }

        html += '</article>';
      });

      /* ---------- 本章總結 ---------- */
      if (s.answered === s.total) {
        var advice;
        if (s.percent >= 90) advice = '非常好！你已經掌握咗呢一章，可以放心去下一章。';
        else if (s.percent >= 80) advice = '好犀利！你已經掌握咗呢一章，可以去下一章。';
        else if (s.percent >= 50) advice = '唔錯，但仲有進步空間。睇返上面答錯嘅解釋，再撳「🔄 重做呢題」試多次。';
        else advice = '唔使急，零基礎一開始係咁。返去「📖 學習」分頁再睇一次範例，然後返嚟重做。';

        html += '<div class="quiz-done">' +
          '<p style="margin:0 0 8px"><b>🎯 本章完成！</b>得分 ' + s.correct + ' / ' + s.total +
            '（' + s.percent + '%）。</p>' +
          '<p style="margin:0">' + advice + '</p>' +
          (ci < chapters.length - 1
            ? '<div class="question-actions"><button class="btn btn-primary btn-sm" type="button" data-quiz-next="1">去下一章嘅測驗 →</button></div>'
            : '') +
        '</div>';
      }
    }

    /* ---------- 底部：全科總分 + 各章一覽 ---------- */
    var subjTone = subj.percent >= 80 ? 'good' : (subj.percent >= 50 ? 'mid' : 'low');
    html +=
      '<div class="quiz-subject">' +
        '<h3>🏁 ' + escapeHtml(subject.name) + ' 全科測驗總分</h3>' +
        '<div class="quiz-score-row">' +
          '<strong class="' + subjTone + '">' + subj.correct + ' / ' + subj.total +
            '（' + subj.percent + '%）</strong>' +
          '<div class="bar"><span style="width:' + subj.percent + '%"></span></div>' +
          '<small>已答 ' + subj.answered + ' / ' + subj.total + ' 題</small>' +
        '</div>' +
        '<ul class="chapter-scores">' +
          subj.per.map(function (row) {
            var st = row.stats;
            var tone = st.percent >= 80 ? 'good' : (st.percent >= 50 ? 'mid' : 'low');
            return '<li>' +
              '<button class="chapter-score' + (row.index === ci ? ' is-active' : '') + '" type="button"' +
                ' data-quiz-goto="' + row.index + '">' +
                '<span class="cs-title">' + escapeHtml((row.chapter.icon || '') + ' ' + row.chapter.title) + '</span>' +
                '<span class="cs-score ' + tone + '">' + st.correct + ' / ' + st.total + '</span>' +
              '</button>' +
            '</li>';
          }).join('') +
        '</ul>' +
      '</div>';

    container.innerHTML = html;
  }

  /* ------------------------------ 事件 ------------------------------ */

  function init(el, context) {
    container = el;
    ctx = context;
    if (!container || bound) return;
    bound = true;

    container.addEventListener('click', function (e) {
      var subject = ctx.getSubject();
      if (!subject) return;
      var chapters = subject.chapters || [];
      var ci = ctx.getChapterIndex();
      var chapter = chapters[ci];
      if (!chapter) return;

      /* 1) 揀答案 */
      var optBtn = e.target.closest('[data-quiz-option]');
      if (optBtn && !optBtn.disabled) {
        ctx.setAnswer(chapter.id, Number(optBtn.getAttribute('data-quiz-index')),
          Number(optBtn.getAttribute('data-quiz-option')));
        render();
        ctx.onProgressChange();
        return;
      }

      /* 2) 重做單一題 */
      var redoBtn = e.target.closest('[data-quiz-redo]');
      if (redoBtn) {
        ctx.clearAnswer(chapter.id, Number(redoBtn.getAttribute('data-quiz-redo')));
        render();
        ctx.onProgressChange();
        return;
      }

      /* 3) 重做所有答錯的題 */
      if (e.target.closest('[data-quiz-redoall]')) {
        var answers = ctx.getAnswers(chapter.id) || {};
        (chapter.quiz || []).forEach(function (q, i) {
          if (typeof answers[i] === 'number' && answers[i] !== normalize(q).answer) {
            ctx.clearAnswer(chapter.id, i);
          }
        });
        render();
        ctx.onProgressChange();
        return;
      }

      /* 4) 清除本章答案 */
      if (e.target.closest('[data-quiz-clear]')) {
        (chapter.quiz || []).forEach(function (q, i) { ctx.clearAnswer(chapter.id, i); });
        render();
        ctx.onProgressChange();
        return;
      }

      /* 5) 去下一章測驗 */
      if (e.target.closest('[data-quiz-next]')) {
        ctx.gotoChapter(ci + 1);
        return;
      }

      /* 6) 由總分表跳去某一章 */
      var goto = e.target.closest('[data-quiz-goto]');
      if (goto) {
        ctx.gotoChapter(Number(goto.getAttribute('data-quiz-goto')));
        return;
      }
    });
  }

  window.Quiz = {
    init: init,
    render: render,
    score: score,
    subjectScore: subjectScore,
    normalize: normalize
  };
})();
