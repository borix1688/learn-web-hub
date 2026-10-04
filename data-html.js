/* ============================================================================
   前端基礎學堂 Frontend Foundations — data-html.js（HTML 課程資料庫）
   ----------------------------------------------------------------------------
   呢個檔案 = 你嘅「課程資料庫」。網站嘅 HTML 課程內容全部來自呢度，
   改呢個檔案就等於改課程，唔使碰其他檔案。
   載入之後會產生 window.LEARN_DATA.subjects，內裡就係 'html' 呢一科。

   資料結構（想加新一章，照抄一份再改就得）：
     {
       id: 'h1', title: '…', icon: '📄', summary: '…',
       points: [                       // 學習點（4–6 個）
         { title: '…', analogy: '生活化比喻', code: '程式碼範例',
           lang: 'html', preview: { html: '即時預覽用嘅 HTML 片段' }, tip: '提示' }
       ],
       puzzle: {                       // 互動練習（每章一個）
         title: '…', task: '…', hint: '…', starter: '…', solution: '…',
         mode: 'preview', lang: 'html', expectCode: '…', previewHeight: 240
       },
       quiz: [                         // 測驗（8–10 條，混合 mc 同 tf）
         { type: 'mc', q: '…', options: ['A', 'B'], answer: 0, explain: '…' },
         { type: 'tf', q: '…', answer: 0, explain: '…' }
       ]
     }
   ========================================================================== */
window.LEARN_DATA = window.LEARN_DATA || { subjects: [] };

window.LEARN_DATA.subjects.push({

  /* ---------------- 科目基本資料 ---------------- */
  id: 'html',
  name: 'HTML',
  icon: '🏗️',
  tagline: '網頁嘅骨架',
  intro: 'HTML 係所有網頁嘅骨架：學完你可以自己砌出有標題、段落、清單、表格、圖片、連結同表單嘅網頁，仲識用 Bootstrap 快速排版。',
  runMode: 'preview',
  codeLang: 'html',
  theme: 'html',

  /* ---------------- 課程內容：8 章 ---------------- */
  chapters: [

    /* ================= 第 1 章：HTML 文件結構同 DOCTYPE ================= */
    {
      id: 'h1',
      title: 'HTML 文件結構同 DOCTYPE',
      icon: '📄',
      summary: '認清 HTML 係乜，同埋每個網頁都一定要有嘅基本骨架。',

      points: [
        {
          title: 'HTML 係乜？標籤、屬性同 element',
          analogy: 'HTML 標籤好似貼喺快遞箱嘅標籤紙：箱上寫「呢箱係段落」就係 p 標籤，' +
            '寫「呢箱係圖片」就係 img 標籤。標籤仲可以寫附加資料（屬性），' +
            '好似快遞箱寫「易碎」「向上」咁，話畀人知呢箱嘢要點處理。',
          code:
            '<!-- 一對開合標籤 + 中間嘅內容 = 一個 element -->\n' +
            '<p>我係一個段落。</p>\n' +
            '\n' +
            '<!-- 開標籤可以帶屬性，格式係：屬性名="值" -->\n' +
            '<p class="note">我有一個 class 屬性。</p>',
          lang: 'html',
          preview: {
            html:
              '<p>我係一個段落。</p>\n' +
              '<p style="color: chocolate; font-weight: 700;">我有一個 style 屬性，所以字會變橙色同變粗。</p>'
          },
          tip: '屬性一定要寫喺「開標籤」之內，即係 p 同右角括號之間，唔可以寫喺閂標籤嗰邊。'
        },
        {
          title: 'DOCTYPE 宣告同最基本嘅骨架',
          analogy: 'DOCTYPE 好似喺報名表最頂寫「我係用中文填呢張表」。' +
            '冇寫嘅話，職員可能用舊規矩去睇你張表，甚至睇錯內容。',
          code:
            '<!DOCTYPE html>\n' +
            '<html lang="zh-Hant">\n' +
            '  <head>\n' +
            '    <meta charset="utf-8">\n' +
            '    <title>阿明嘅第一頁</title>\n' +
            '  </head>\n' +
            '  <body>\n' +
            '    <h1>你好，我係阿明</h1>\n' +
            '  </body>\n' +
            '</html>',
          lang: 'html',
          preview: {
            html:
              '<h1>你好，我係阿明</h1>\n' +
              '<p>預覽框只會顯示 body 之內嘅嘢；head 同 DOCTYPE 係唔會顯示出嚟嘅。</p>'
          },
          tip: 'DOCTYPE 一定要放喺檔案第一行，之前連空格同空行都唔好有，否則瀏覽器可能當佢係普通文字。'
        },
        {
          title: 'head 同 title：睇唔到但好緊要',
          analogy: 'head 好似信封背後嘅資料：寄件人、日期、標籤。' +
            '收信人拆開信封睇內容時唔會見到，但郵差同系統全靠佢運作。',
          code:
            '<head>\n' +
            '  <meta charset="utf-8">\n' +
            '  <title>茶餐廳點餐系統</title>\n' +
            '</head>',
          lang: 'html',
          preview: {
            html:
              '<div style="border: 2px solid lightgray; border-radius: 10px; overflow: hidden;">\n' +
              '  <div style="background: gainsboro; padding: 8px 12px; font-size: 14px;">🔖 茶餐廳點餐系統　|　另一個分頁</div>\n' +
              '  <div style="padding: 14px;">最頂嗰個分頁名，就係 title 標籤寫嘅字；呢句先係 body 嘅內容。</div>\n' +
              '</div>'
          },
          tip: 'meta charset 負責話畀瀏覽器知用邊種編碼，唔寫就有可能出現亂碼，即係一堆問號同怪符號。'
        },
        {
          title: 'body 同註解：邊啲會顯示，邊啲唔會',
          analogy: 'body 好似茶餐廳嘅餐盤：客人真正睇到、食到嘅嘢全部放喺餐盤度。' +
            '註解就好似廚房嘅便利貼，客人睇唔到，但同事一睇就明你想講咩。',
          code:
            '<body>\n' +
            '  <h1>今日推介</h1>\n' +
            '  <!-- 呢句要等冬天先開返 -->\n' +
            '  <p>凍檸茶 $22</p>\n' +
            '</body>',
          lang: 'html',
          preview: {
            html:
              '<p>呢度原本有一句註解，但你係睇唔到嘅。</p>\n' +
              '<!-- 呢句係註解，瀏覽器會完全無視 -->\n' +
              '<p>所以顯示出嚟只會見到呢兩句。</p>'
          },
          tip: '註解唔可以疊住寫，內裡再寫一個開註解符號就會提早結束，之後嘅文字會變成正常內容顯示出嚟。'
        },
        {
          title: '開合標籤、縮排同巢狀結構',
          analogy: '縮排好似背囊分格：大格之內放細格，一眼睇得出邊樣嘢屬於邊一格。' +
            '冇縮排嘅話，好似所有嘢倒晒喺同一個袋度，搵一樣嘢都要搵半日。',
          code:
            '<div>\n' +
            '  <p>外層</p>\n' +
            '  <div>\n' +
            '    <p>內層，呢個就係巢狀</p>\n' +
            '  </div>\n' +
            '</div>',
          lang: 'html',
          preview: {
            html:
              '<div style="border: 2px dashed darkgray; padding: 12px;">\n' +
              '  <p style="margin: 0 0 8px;">外層嘅盒</p>\n' +
              '  <div style="border: 2px dashed mediumpurple; padding: 12px;">\n' +
              '    <p style="margin: 0;">內層嘅盒（巢狀）</p>\n' +
              '  </div>\n' +
              '</div>'
          },
          tip: '有開就要有閂，次序係「後開先閂」：先開 div 再開 p，就要先閂 p 再閂 div，掉轉就會亂晒。'
        }
      ],

      puzzle: {
        title: '練習 1：補完你第一個網頁',
        task: '喺編輯框補完一個最基本嘅 HTML 文件：要有 <code>&lt;!DOCTYPE html&gt;</code>、' +
          '<code>&lt;html&gt;</code>、<code>&lt;head&gt;</code>（內加一個 <code>&lt;title&gt;</code>）、' +
          '同 <code>&lt;body&gt;</code>（內寫一句「我學緊 HTML！」）。',
        hint: '次序係：<code>&lt;!DOCTYPE html&gt;</code> → <code>&lt;html&gt;</code> → ' +
          '<code>&lt;head&gt;</code> → <code>&lt;title&gt;</code> → <code>&lt;/head&gt;</code> → ' +
          '<code>&lt;body&gt;</code> → 內容 → <code>&lt;/body&gt;</code> → <code>&lt;/html&gt;</code>。',
        starter:
          '<!DOCTYPE html>\n' +
          '<html lang="zh-Hant">\n' +
          '  <head>\n' +
          '    <!-- 喺呢度加 title -->\n' +
          '  </head>\n' +
          '  <body>\n' +
          '    <!-- 喺呢度寫一句文字 -->\n' +
          '  </body>\n' +
          '</html>',
        solution:
          '<!DOCTYPE html>\n' +
          '<html lang="zh-Hant">\n' +
          '  <head>\n' +
          '    <meta charset="utf-8">\n' +
          '    <title>我嘅第一個網頁</title>\n' +
          '  </head>\n' +
          '  <body>\n' +
          '    <h1>我學緊 HTML！</h1>\n' +
          '  </body>\n' +
          '</html>',
        mode: 'preview',
        lang: 'html',
        expectCode: '<title>',
        previewHeight: 260
      },

      quiz: [
        {
          type: 'mc',
          q: '一個 HTML 檔案最頂第一行通常要寫咩？',
          options: ['DOCTYPE 宣告', 'html 標籤', 'head 標籤', 'title 標籤'],
          answer: 0,
          explain: 'DOCTYPE 宣告要放喺最頂，話畀瀏覽器知呢個檔案用 HTML5 嘅規則去解讀。其餘三個標籤都係喺佢之後先出現。'
        },
        {
          type: 'mc',
          q: 'DOCTYPE 宣告嘅作用係咩？',
          options: [
            '話畀瀏覽器知呢個檔案用 HTML5 規則嚟解讀',
            '話畀瀏覽器知網頁標題',
            '通知搜尋引擎網站已經完成',
            '設定網頁嘅背景顏色'
          ],
          answer: 0,
          explain: 'DOCTYPE 係「版本宣告」，唔係內容。網頁標題由 title 負責，顏色由 CSS 負責。'
        },
        {
          type: 'mc',
          q: '邊個標籤內嘅內容唔會直接顯示喺網頁內容區？',
          options: ['head 標籤', 'body 標籤', 'h1 標籤', 'p 標籤'],
          answer: 0,
          explain: 'head 係放「關於網頁本身」嘅資料，例如編碼同標題；真正顯示出嚟嘅內容全部放喺 body。'
        },
        {
          type: 'mc',
          q: 'title 標籤寫嘅文字會出現喺邊？',
          options: [
            '瀏覽器分頁或者視窗嘅標題',
            '網頁最頂嘅大字',
            '網頁最底嘅位置',
            '完全唔會出現喺任何地方'
          ],
          answer: 0,
          explain: 'title 會成為分頁名，書籤同搜尋結果都會用到佢。想喺網頁內容顯示大字，要用 body 內嘅 h1。'
        },
        {
          type: 'mc',
          q: '屬性（attribute）應該寫喺邊？',
          options: ['開標籤內', '閂標籤內', '標籤外嘅任何位置', '註解內裡'],
          answer: 0,
          explain: '屬性係寫喺開標籤內，例如 p 標籤加 class。寫去閂標籤或者標籤之外，瀏覽器都唔會當佢係屬性。'
        },
        {
          type: 'mc',
          q: '一個完整嘅 element（例如一段段落）通常由咩組成？',
          options: ['開標籤、內容、閂標籤', '只有一個閂標籤', '兩個開標籤', '內容加一句註解'],
          answer: 0,
          explain: '開標籤負責「開始」，閂標籤負責「結束」，中間就係內容。冇閂標籤就可能連累之後嘅內容。'
        },
        {
          type: 'tf',
          q: '判斷：註解內嘅文字會喺網頁上顯示出嚟。',
          answer: 1,
          explain: '註解係寫畀人睇嘅筆記，瀏覽器會完全無視佢，所以訪客係睇唔到嘅。'
        },
        {
          type: 'tf',
          q: '判斷：html 標籤要夾住 head 同 body 兩個標籤。',
          answer: 0,
          explain: 'html 標籤係整個文件嘅外層盒，head 同 body 都要放喺內裡，所以佢哋係巢狀喺 html 之下。'
        },
        {
          type: 'tf',
          q: '判斷：縮排係 HTML 規定嘅語法，唔縮排瀏覽器就會報錯。',
          answer: 1,
          explain: '縮排對瀏覽器嚟講只係空白，唔縮排一樣行得。但縮排令程式碼一睇就知層級，係專業寫法嘅基本習慣。'
        }
      ]
    },

    /* ================= 第 2 章：標題同段落 ================= */
    {
      id: 'h2',
      title: '標題同段落',
      icon: '📝',
      summary: '學識用六級標題分層，用段落講清楚一件事，同埋點樣標示重點。',

      points: [
        {
          title: 'h1 到 h6：六級標題',
          analogy: '六級標題好似商場嘅指示牌：最大嗰個寫商場名（h1），' +
            '跟住係樓層牌（h2），再落係分區牌（h3）……數字越大，層級越深、字越細。',
          code:
            '<h1>h1 最大：商場名</h1>\n' +
            '<h2>h2：一樓</h2>\n' +
            '<h3>h3：電器部</h3>\n' +
            '<h4>h4：手機</h4>\n' +
            '<h5>h5：配件</h5>\n' +
            '<h6>h6 最細：充電線</h6>',
          lang: 'html',
          preview: {
            html:
              '<h1 style="margin: 4px 0;">h1 最大：商場名</h1>\n' +
              '<h2 style="margin: 4px 0;">h2：一樓</h2>\n' +
              '<h3 style="margin: 4px 0;">h3：電器部</h3>\n' +
              '<h4 style="margin: 4px 0;">h4：手機</h4>\n' +
              '<h5 style="margin: 4px 0;">h5：配件</h5>\n' +
              '<h6 style="margin: 4px 0;">h6 最細：充電線</h6>'
          },
          tip: '標題要跟層級用：有 h2 先好用 h3。跳級唔會報錯，但對讀者同搜尋引擎都唔友善。'
        },
        {
          title: 'p 段落：空白會被壓縮',
          analogy: '段落好似講電話，一句講完就停一停。' +
            '你喺程式碼內打幾多個空格同換行，瀏覽器都只會當「一個空格」，好似填表打多幾個空格都只會顯示一格。',
          code:
            '<p>第一段：呢句會自己獨佔一行。</p>\n' +
            '\n' +
            '<p>第二段：就算我喺程式碼內\n' +
            '        打好多個空格同換行，\n' +
            '        出到嚟都只會係一行。</p>',
          lang: 'html',
          preview: {
            html:
              '<p>第一段：呢句會自己獨佔一行。</p>\n' +
              '<p>第二段：就算我喺程式碼內        打好多個空格，出到嚟都只會壓縮成一個空格。</p>'
          },
          tip: '想保留原本嘅空格同換行，要用 pre 標籤；想強制換行就睇下一個學習點。'
        },
        {
          title: 'br 換行同 hr 分隔線',
          analogy: 'br 好似喺 WhatsApp 打訊息時撳「換行」：同一個訊息框繼續寫，但強制跳去下一行。' +
            'hr 好似餐牌嗰條分隔線，話你知一邊係飲品、另一邊係食物。',
          code:
            '<p>\n' +
            '  阿明茶餐廳<br>\n' +
            '  旺角彌敦道 100 號<br>\n' +
            '  電話：2345 6789\n' +
            '</p>\n' +
            '<hr>\n' +
            '<p>今日甜品：紅豆冰 $26</p>',
          lang: 'html',
          preview: {
            html:
              '<p>\n' +
              '  阿明茶餐廳<br>\n' +
              '  旺角彌敦道 100 號<br>\n' +
              '  電話：2345 6789\n' +
              '</p>\n' +
              '<hr>\n' +
              '<p>今日甜品：紅豆冰 $26</p>'
          },
          tip: 'br 同 hr 都係「自己一個就完成」嘅標籤，唔需要閂標籤，亦都唔應該夾住任何文字。'
        },
        {
          title: 'strong 同 em：重點同語氣',
          analogy: 'strong 好似老師用紅筆圈住「必考」；' +
            'em 好似講嘢時加重語氣：「你今晚真係要交」。兩個都會變樣，但意思唔同。',
          code:
            '<p>請喺 <strong>星期五之前</strong> 交表。</p>\n' +
            '<p>你<em>真係</em>唔使咁緊張。</p>\n' +
            '<p><strong><em>兩樣都要留意</em></strong></p>',
          lang: 'html',
          preview: {
            html:
              '<p>請喺 <strong>星期五之前</strong> 交表。</p>\n' +
              '<p>你<em>真係</em>唔使咁緊張。</p>\n' +
              '<p><strong><em>兩樣都要留意</em></strong></p>'
          },
          tip: '想純粹令字變粗，係 CSS 嘅工作；strong 同 em 嘅價值在於講出「點解要強調」，讀屏軟件都讀得出。'
        },
        {
          title: '巢狀規則：邊個標籤可以放喺邊個之內',
          analogy: '標籤好似收納盒：大盒之內可以放細盒，但細盒唔可以裝住個大盒。' +
            '段落盒就係一個「唔可以再放段落盒」嘅細盒。',
          code:
            '<div>\n' +
            '  <h2>早餐時段</h2>\n' +
            '  <p>供應時間：早上 7 點到 11 點。</p>\n' +
            '  <p>套餐有<strong>奶茶</strong>一杯。</p>\n' +
            '</div>\n' +
            '\n' +
            '<!-- 呢種寫法係錯嘅：p 之內唔可以再放 p -->\n' +
            '<!-- <p>第一段<p>第二段</p></p> -->',
          lang: 'html',
          preview: {
            html:
              '<div style="border: 2px solid lightblue; border-radius: 10px; padding: 12px;">\n' +
              '  <h2 style="margin: 0 0 8px; font-size: 20px;">早餐時段</h2>\n' +
              '  <p style="margin: 0 0 6px;">供應時間：早上 7 點到 11 點。</p>\n' +
              '  <p style="margin: 0;">套餐有<strong>奶茶</strong>一杯。</p>\n' +
              '</div>'
          },
          tip: '標題之內亦唔應該再放標題；段落之內想分段，應該開一個新嘅 p，而唔係喺 p 之內再塞 p。'
        }
      ],

      puzzle: {
        title: '練習 2：寫一篇有標題同段落嘅自我介紹',
        task: '用 <code>&lt;h1&gt;</code> 寫你嘅名，用 <code>&lt;h2&gt;</code> 寫「關於我」，' +
          '再用 <code>&lt;p&gt;</code> 寫兩句介紹，其中一句要用 <code>&lt;strong&gt;</code> 標出重點。',
        hint: '標籤要一對一對咁寫：<code>&lt;h1&gt;內容&lt;/h1&gt;</code>。' +
          '每段寫完記得補返 <code>&lt;/p&gt;</code>。',
        starter: '<!-- 由呢度開始寫你嘅自我介紹 -->\n',
        solution:
          '<h1>阿明</h1>\n' +
          '<h2>關於我</h2>\n' +
          '<p>我住喺香港，最鍾意食<strong>雲吞麵</strong>。</p>\n' +
          '<p>我而家開始學 HTML，希望可以自己整一個網頁。</p>',
        mode: 'preview',
        lang: 'html',
        expectCode: '<p>',
        previewHeight: 240
      },

      quiz: [
        {
          type: 'mc',
          q: '想寫「全頁最重要嘅大標題」，用邊個標籤最好？',
          options: ['h1', 'h6', 'p', 'strong'],
          answer: 0,
          explain: 'h1 係最高層級，通常一個網頁只有一個。h6 係最細層級，p 係段落，strong 只係語氣強調。'
        },
        {
          type: 'mc',
          q: 'h1 同 h3 比較，邊個標題嘅字大啲？',
          options: ['h1 大啲', 'h3 大啲', '兩個一樣大', '要自己寫 CSS 先分得出'],
          answer: 0,
          explain: '瀏覽器有預設樣式：數字越細，字越大、層級越高。所以 h1 最搶眼，h6 最細。'
        },
        {
          type: 'mc',
          q: '想喺同一段文字中間強制跳去下一行，但唔想開新段落，應該用邊個標籤？',
          options: ['br', 'p', 'hr', 'h2'],
          answer: 0,
          explain: 'br 係「換行」，仍然屬於同一個段落。p 會開一個新段落，段落之間會有空白距離，效果唔同。'
        },
        {
          type: 'mc',
          q: '邊個標籤用嚟畫一條水平分隔線？',
          options: ['hr', 'br', 'p', 'em'],
          answer: 0,
          explain: 'hr 係 horizontal rule，會畫一條橫線，用嚟分隔唔同主題嘅內容，例如地址同餐牌。'
        },
        {
          type: 'mc',
          q: '你喺程式碼內連續打 5 個空格，網頁會顯示幾多個空格？',
          options: ['1 個', '5 個', '冇空格', '10 個'],
          answer: 0,
          explain: 'HTML 會把連續空白壓縮成一個，換行都一樣。想保留原本格式就要用 pre 標籤。'
        },
        {
          type: 'mc',
          q: 'strong 同 em 嘅分別係咩？',
          options: [
            'strong 表示「好緊要」，em 表示語氣上嘅強調',
            'strong 出大字，em 出細字',
            '兩個完全一樣，隨便揀一個',
            'em 只可以用喺標題之內'
          ],
          answer: 0,
          explain: '兩者預設都只係粗體同斜體，真正分別係意思：一個講重要性，一個講語氣，讀屏軟件嘅讀法都唔同。'
        },
        {
          type: 'tf',
          q: '判斷：hr 標籤係用嚟畫一條水平分隔線。',
          answer: 0,
          explain: 'hr 就係水平線，用嚟分隔兩段唔同主題嘅內容，佢自己一個就完成，唔需要閂標籤。'
        },
        {
          type: 'tf',
          q: '判斷：p 標籤之內可以再放一個 p 標籤，瀏覽器一定會照你嘅意思顯示。',
          answer: 1,
          explain: 'p 唔可以巢狀 p。瀏覽器會自動幫你提早閂咗第一個 p，出到嚟嘅結構同你想像中唔同。'
        },
        {
          type: 'tf',
          q: '判斷：標題標籤（h1 到 h6）應該用嚟表達內容層級，唔應該為咗「字大啲」而亂用。',
          answer: 0,
          explain: '想字大係 CSS 嘅工作。標題標籤嘅價值係講出結構，亂用會令讀屏軟件同搜尋引擎都睇錯重點。'
        }
      ]
    },

    /* ================= 第 3 章：清單 ================= */
    {
      id: 'h3',
      title: '清單',
      icon: '📋',
      summary: '用清單把一堆項目排得整整齊齊，仲學識三種唔同嘅清單。',

      points: [
        {
          title: 'ul 同 li：無序清單',
          analogy: 'ul 清單好似茶餐廳嘅點心紙：一行一行寫住「蝦餃」「燒賣」「鳳爪」，' +
            '每樣並排、冇先後次序，每行開頭有一個圓點做記號。',
          code:
            '<h3>今日點心</h3>\n' +
            '<ul>\n' +
            '  <li>蝦餃</li>\n' +
            '  <li>燒賣</li>\n' +
            '  <li>鳳爪</li>\n' +
            '</ul>',
          lang: 'html',
          preview: {
            html:
              '<h3 style="margin: 0 0 8px;">今日點心</h3>\n' +
              '<ul style="margin: 0;">\n' +
              '  <li>蝦餃</li>\n' +
              '  <li>燒賣</li>\n' +
              '  <li>鳳爪</li>\n' +
              '</ul>'
          },
          tip: 'ul 只可以直接放 li，唔好將文字或者其他標籤直接塞入 ul 度，否則瀏覽器會幫你亂咁搬位。'
        },
        {
          title: 'ol 同 li：有序清單',
          analogy: 'ol 好似酒樓等位嘅號碼牌：1 號、2 號、3 號，次序本身有意義。' +
            '掉亂咗次序，出到嚟嘅意思就完全唔同。',
          code:
            '<h3>煲湯做法</h3>\n' +
            '<ol>\n' +
            '  <li>洗乾淨材料</li>\n' +
            '  <li>加水煲滾</li>\n' +
            '  <li>轉細火煲兩個鐘</li>\n' +
            '</ol>',
          lang: 'html',
          preview: {
            html:
              '<h3 style="margin: 0 0 8px;">煲湯做法</h3>\n' +
              '<ol style="margin: 0;">\n' +
              '  <li>洗乾淨材料</li>\n' +
              '  <li>加水煲滾</li>\n' +
              '  <li>轉細火煲兩個鐘</li>\n' +
              '</ol>'
          },
          tip: 'ol 嘅號碼由瀏覽器自動加上，你唔需要自己打「1.」「2.」，打咗反而會變成兩重號碼。'
        },
        {
          title: '巢狀清單：清單內再放清單',
          analogy: '好似超市貨架嘅分類：大牌寫「零食」，再細分「薯片」「朱古力」，' +
            '薯片再細分落去仲可以分牌子。一層一層落去，客人先搵得到。',
          code:
            '<ul>\n' +
            '  <li>零食\n' +
            '    <ul>\n' +
            '      <li>薯片</li>\n' +
            '      <li>朱古力</li>\n' +
            '    </ul>\n' +
            '  </li>\n' +
            '  <li>飲品</li>\n' +
            '</ul>',
          lang: 'html',
          preview: {
            html:
              '<ul style="margin: 0;">\n' +
              '  <li>零食\n' +
              '    <ul>\n' +
              '      <li>薯片</li>\n' +
              '      <li>朱古力</li>\n' +
              '    </ul>\n' +
              '  </li>\n' +
              '  <li>飲品</li>\n' +
              '</ul>'
          },
          tip: '內層清單一定要放喺一個 li 之內。直接掛喺 ul 之下，會變成一個唔屬於任何項目嘅怪清單。'
        },
        {
          title: 'dl、dt、dd：名詞加解釋',
          analogy: '好似茶餐廳嘅餐牌：左邊寫飲品名「凍檸茶」，右邊寫價錢「$22」。' +
            ' dt 係個名，dd 就係解釋、價錢或者描述。',
          code:
            '<dl>\n' +
            '  <dt>凍檸茶</dt>\n' +
            '  <dd>凍底加兩片檸檬，$22</dd>\n' +
            '  <dt>鴦走</dt>\n' +
            '  <dd>咖啡溝奶茶，走甜，$24</dd>\n' +
            '</dl>',
          lang: 'html',
          preview: {
            html:
              '<dl style="margin: 0;">\n' +
              '  <dt style="font-weight: 700;">凍檸茶</dt>\n' +
              '  <dd style="margin: 0 0 10px 20px;">凍底加兩片檸檬，$22</dd>\n' +
              '  <dt style="font-weight: 700;">鴦走</dt>\n' +
              '  <dd style="margin: 0 0 0 20px;">咖啡溝奶茶，走甜，$24</dd>\n' +
              '</dl>'
          },
          tip: '一個 dt 之後可以跟幾個 dd；但唔可以反過嚟，冇 dt 就直接寫 dd。'
        },
        {
          title: '清單嘅實際用途：網站選單',
          analogy: '網站最頂嘅選單其實就係一個清單：好似地鐵站嘅出口指示牌，' +
            '一行一行列出「中環」「金鐘」「尖沙咀」，只係用 CSS 收埋咗個圓點。',
          code:
            '<nav>\n' +
            '  <ul>\n' +
            '    <li>首頁</li>\n' +
            '    <li>餐牌</li>\n' +
            '    <li>分店</li>\n' +
            '  </ul>\n' +
            '</nav>',
          lang: 'html',
          preview: {
            html:
              '<p style="margin: 0 0 6px; color: slategray; font-size: 14px;">呢個例子用咗少少 CSS 把清單排成一行：</p>\n' +
              '<ul style="display: flex; gap: 14px; list-style: none; padding: 0; margin: 0;">\n' +
              '  <li style="background: lightcyan; padding: 6px 14px; border-radius: 6px;">首頁</li>\n' +
              '  <li style="background: lightcyan; padding: 6px 14px; border-radius: 6px;">餐牌</li>\n' +
              '  <li style="background: lightcyan; padding: 6px 14px; border-radius: 6px;">分店</li>\n' +
              '</ul>'
          },
          tip: '用清單做選單唔止好睇，讀屏軟件仲會讀出「呢度有 3 個項目」，比一堆 div 清楚得多。'
        }
      ],

      puzzle: {
        title: '練習 3：整一個購物清單',
        task: '用 <code>&lt;ul&gt;</code> 同 <code>&lt;li&gt;</code> 整一個有 3 樣嘢嘅購物清單，' +
          '上面加一個 <code>&lt;h3&gt;</code> 標題寫「購物清單」。',
        hint: '結構係：<code>&lt;h3&gt;標題&lt;/h3&gt;</code>，跟住 <code>&lt;ul&gt;</code>，' +
          '內放三個 <code>&lt;li&gt;</code>，最後記得閂 <code>&lt;/ul&gt;</code>。',
        starter: '<!-- 喺下面寫你嘅購物清單 -->\n',
        solution:
          '<h3>購物清單</h3>\n' +
          '<ul>\n' +
          '  <li>牛奶</li>\n' +
          '  <li>牛油</li>\n' +
          '  <li>雞蛋</li>\n' +
          '</ul>',
        mode: 'preview',
        lang: 'html',
        expectCode: '<li>',
        previewHeight: 220
      },

      quiz: [
        {
          type: 'mc',
          q: '想整一個「購物清單」，每樣嘢地位平等、冇先後次序，應該用邊個標籤？',
          options: ['ul', 'ol', 'dl', 'table'],
          answer: 0,
          explain: 'ul 係無序清單，會出圓點。ol 會出 1. 2. 3. 嘅號碼，dl 係名詞加解釋，table 係表格。'
        },
        {
          type: 'mc',
          q: '清單內每一個項目，要用邊個標籤裝住？',
          options: ['li', 'p', 'td', 'br'],
          answer: 0,
          explain: 'li 係 list item，即係清單嘅一個項目。用 p 唔會出圓點，亦唔會算做清單嘅一部分。'
        },
        {
          type: 'mc',
          q: '想整「1. 2. 3.」嘅次序清單，應該用邊個標籤？',
          options: ['ol', 'ul', 'dl', 'h3'],
          answer: 0,
          explain: 'ol 係有序清單，會自動加上號碼。次序、排名、做法呢類內容都應該用 ol。'
        },
        {
          type: 'mc',
          q: 'ol 清單嗰啲號碼係邊個加上去嘅？',
          options: ['瀏覽器自動產生', '要自己打「1.」', '要寫 CSS 先有', '要寫 JavaScript 先有'],
          answer: 0,
          explain: '瀏覽器會自動為 ol 嘅每個 li 加上號碼，而且你中間插入新項目時，號碼會自動重排。'
        },
        {
          type: 'mc',
          q: '想寫「名詞 + 解釋」嘅清單，例如餐牌上嘅飲品名同價錢，應該用邊組標籤？',
          options: ['dl 加 dt 同 dd', 'ul 加 li', 'ol 加 li', 'table 加 tr'],
          answer: 0,
          explain: 'dl 係描述清單，dt 放名詞，dd 放解釋。ul 同 ol 只會出一行一行嘅項目，冇「名＋解釋」嘅配對關係。'
        },
        {
          type: 'mc',
          q: '巢狀清單嘅內層清單，應該放喺邊？',
          options: ['外層其中一個 li 之內', '外層 ul 之下、li 之外', '清單外', 'h3 之內'],
          answer: 0,
          explain: '內層清單係某一個項目嘅細分，所以要放喺負責嗰個項目嘅 li 之內，先至算係佢嘅一部分。'
        },
        {
          type: 'tf',
          q: '判斷：ul 可以直接放一段文字入去，唔需要 li。',
          answer: 1,
          explain: 'ul 嘅直接子項目應該只有 li。直接塞文字入去，瀏覽器會自己幫你補 li，出到嚟嘅結構同你想嘅唔同。'
        },
        {
          type: 'tf',
          q: '判斷：網站最頂嘅導覽選單，通常都係用清單標籤寫，再用 CSS 收埋圓點、排成一行。',
          answer: 0,
          explain: '選單本質就係一串項目，用 ul 加 li 最貼切。外觀（橫排、顏色）全部都交畀 CSS 處理。'
        },
        {
          type: 'tf',
          q: '判斷：dl 清單內，dd 係用嚟寫名詞，dt 係用嚟寫解釋。',
          answer: 1,
          explain: '掉轉咗：dt 係 term（名詞），dd 係 description（解釋）。記法係「先有名，後有解釋」。'
        }
      ]
    },

    /* ================= 第 4 章：表格 ================= */
    {
      id: 'h4',
      title: '表格',
      icon: '📊',
      summary: '用表格把有行列關係嘅資料排得清清楚楚，仲學識合併格。',

      points: [
        {
          title: 'table、tr、td：最基本嘅表格',
          analogy: '表格好似酒樓嘅點心卡：橫行係一行、每一格係一款點心同一格價錢，' +
            '橫橫豎豎對齊，一睇就知邊個價錢屬於邊款點心。',
          code:
            '<table>\n' +
            '  <tr>\n' +
            '    <td>蝦餃</td>\n' +
            '    <td>$28</td>\n' +
            '  </tr>\n' +
            '  <tr>\n' +
            '    <td>燒賣</td>\n' +
            '    <td>$26</td>\n' +
            '  </tr>\n' +
            '</table>',
          lang: 'html',
          preview: {
            html:
              '<table style="border-collapse: collapse;">\n' +
              '  <tr>\n' +
              '    <td style="border: 1px solid darkgray; padding: 6px 14px;">蝦餃</td>\n' +
              '    <td style="border: 1px solid darkgray; padding: 6px 14px;">$28</td>\n' +
              '  </tr>\n' +
              '  <tr>\n' +
              '    <td style="border: 1px solid darkgray; padding: 6px 14px;">燒賣</td>\n' +
              '    <td style="border: 1px solid darkgray; padding: 6px 14px;">$26</td>\n' +
              '  </tr>\n' +
              '</table>'
          },
          tip: '純 HTML 嘅表格預設係冇線嘅，一格一格會貼埋一齊。以上預覽加咗少少 CSS 邊框，睇得清楚啲。'
        },
        {
          title: 'th 同 caption：表頭同表格名',
          analogy: 'th 好似餐牌最頂一行寫「點心」「價錢」，話你知下面每格係咩；' +
            'caption 好似貼喺表格對上嘅名牌，寫「今日點心表」。',
          code:
            '<table>\n' +
            '  <caption>今日點心表</caption>\n' +
            '  <tr>\n' +
            '    <th>點心</th>\n' +
            '    <th>價錢</th>\n' +
            '  </tr>\n' +
            '  <tr>\n' +
            '    <td>蝦餃</td>\n' +
            '    <td>$28</td>\n' +
            '  </tr>\n' +
            '</table>',
          lang: 'html',
          preview: {
            html:
              '<table style="border-collapse: collapse;">\n' +
              '  <caption style="font-weight: 700; padding: 6px;">今日點心表</caption>\n' +
              '  <tr>\n' +
              '    <th style="border: 1px solid darkgray; padding: 6px 14px; background: whitesmoke;">點心</th>\n' +
              '    <th style="border: 1px solid darkgray; padding: 6px 14px; background: whitesmoke;">價錢</th>\n' +
              '  </tr>\n' +
              '  <tr>\n' +
              '    <td style="border: 1px solid darkgray; padding: 6px 14px;">蝦餃</td>\n' +
              '    <td style="border: 1px solid darkgray; padding: 6px 14px;">$28</td>\n' +
              '  </tr>\n' +
              '</table>'
          },
          tip: 'th 出嚟會自動變粗同居中，仲會話畀讀屏軟件知「呢一格係標題」，唔止係好睇咁簡單。'
        },
        {
          title: 'thead 同 tbody：分明表頭同資料',
          analogy: '好似一本點心簿：簿皮寫住每一欄係咩（thead），' +
            '內頁先係一格格真正嘅資料（tbody）。分開之後，就算表格好長都好易睇。',
          code:
            '<table>\n' +
            '  <thead>\n' +
            '    <tr><th>點心</th><th>價錢</th></tr>\n' +
            '  </thead>\n' +
            '  <tbody>\n' +
            '    <tr><td>蝦餃</td><td>$28</td></tr>\n' +
            '    <tr><td>燒賣</td><td>$26</td></tr>\n' +
            '  </tbody>\n' +
            '</table>',
          lang: 'html',
          preview: {
            html:
              '<table style="border-collapse: collapse;">\n' +
              '  <thead>\n' +
              '    <tr>\n' +
              '      <th style="border: 1px solid darkgray; padding: 6px 14px; background: whitesmoke;">點心</th>\n' +
              '      <th style="border: 1px solid darkgray; padding: 6px 14px; background: whitesmoke;">價錢</th>\n' +
              '    </tr>\n' +
              '  </thead>\n' +
              '  <tbody>\n' +
              '    <tr><td style="border: 1px solid darkgray; padding: 6px 14px;">蝦餃</td><td style="border: 1px solid darkgray; padding: 6px 14px;">$28</td></tr>\n' +
              '    <tr><td style="border: 1px solid darkgray; padding: 6px 14px;">燒賣</td><td style="border: 1px solid darkgray; padding: 6px 14px;">$26</td></tr>\n' +
              '  </tbody>\n' +
              '</table>'
          },
          tip: 'thead 同 tbody 唔會改變外觀，但結構清楚咗，之後寫 CSS 或者用程式讀資料都輕鬆好多。'
        },
        {
          title: 'colspan 同 rowspan：合併格',
          analogy: '好似點心紙嘅合併格：「飲品」呢一格橫跨兩欄，因為下面兩欄都係飲品；' +
            'rowspan 就係向下合併，好似一個價錢同時適用於兩行。',
          code:
            '<table>\n' +
            '  <tr>\n' +
            '    <th colspan="2">飲品</th>\n' +
            '  </tr>\n' +
            '  <tr>\n' +
            '    <td>凍檸茶</td>\n' +
            '    <td>$22</td>\n' +
            '  </tr>\n' +
            '  <tr>\n' +
            '    <td>鴦走</td>\n' +
            '    <td>$24</td>\n' +
            '  </tr>\n' +
            '</table>',
          lang: 'html',
          preview: {
            html:
              '<table style="border-collapse: collapse;">\n' +
              '  <tr>\n' +
              '    <th colspan="2" style="border: 1px solid darkgray; padding: 6px 14px; background: whitesmoke;">飲品</th>\n' +
              '  </tr>\n' +
              '  <tr>\n' +
              '    <td style="border: 1px solid darkgray; padding: 6px 14px;">凍檸茶</td>\n' +
              '    <td style="border: 1px solid darkgray; padding: 6px 14px;">$22</td>\n' +
              '  </tr>\n' +
              '  <tr>\n' +
              '    <td style="border: 1px solid darkgray; padding: 6px 14px;">鴦走</td>\n' +
              '    <td style="border: 1px solid darkgray; padding: 6px 14px;">$24</td>\n' +
              '  </tr>\n' +
              '</table>'
          },
          tip: '合併咗之後，同一行就要少寫相應數量嘅格，否則整張表會歪，甚至有一格飛咗去右邊。'
        },
        {
          title: '表格唔應該用嚟做排版',
          analogy: '以前好多人用表格去砌整個網頁嘅排版，好似用月餅盒嘅分格去擺傢俬：' +
            '擺得落，但你想換一格就要拆晒個盒，非常麻煩。',
          code:
            '<!-- 唔好咁做：用表格砌排版 -->\n' +
            '<table>\n' +
            '  <tr>\n' +
            '    <td>左邊嘅內容</td>\n' +
            '    <td>右邊嘅內容</td>\n' +
            '  </tr>\n' +
            '</table>\n' +
            '\n' +
            '<!-- 應該咁做：用 div 做排版，外觀交畀 CSS -->\n' +
            '<div class="columns">\n' +
            '  <div>左邊嘅內容</div>\n' +
            '  <div>右邊嘅內容</div>\n' +
            '</div>',
          lang: 'html',
          preview: {
            html:
              '<div style="display: flex; gap: 12px;">\n' +
              '  <div style="flex: 1; background: lightcyan; padding: 14px; border-radius: 8px;">左邊嘅內容</div>\n' +
              '  <div style="flex: 1; background: lightyellow; padding: 14px; border-radius: 8px;">右邊嘅內容</div>\n' +
              '</div>\n' +
              '<p style="margin: 10px 0 0; color: slategray; font-size: 14px;">左右排位用 div 加 CSS，唔關表格嘅事。</p>'
          },
          tip: '判斷準則好簡單：資料有「行列關係」（例如點心對價錢）就用表格，純粹想左右排位就用 div。'
        }
      ],

      puzzle: {
        title: '練習 4：整一個點心價錢表',
        task: '用 <code>&lt;table&gt;</code> 整一個表：有 <code>&lt;caption&gt;</code> 寫「今日點心」，' +
          '第一行用 <code>&lt;th&gt;</code> 寫「點心」同「價錢」，' +
          '下面再用兩行 <code>&lt;tr&gt;</code>，每行用 <code>&lt;td&gt;</code> 寫一款點心同價錢。',
        hint: '表係一層一層咁落：<code>&lt;table&gt;</code> → <code>&lt;tr&gt;</code>（一行）→ ' +
          '<code>&lt;td&gt;</code>（一格）。記住每一格都要有開有閂。',
        starter: '<!-- 喺下面寫你嘅表格 -->\n<table>\n\n</table>\n',
        solution:
          '<table>\n' +
          '  <caption>今日點心</caption>\n' +
          '  <tr>\n' +
          '    <th>點心</th>\n' +
          '    <th>價錢</th>\n' +
          '  </tr>\n' +
          '  <tr>\n' +
          '    <td>蝦餃</td>\n' +
          '    <td>$28</td>\n' +
          '  </tr>\n' +
          '  <tr>\n' +
          '    <td>燒賣</td>\n' +
          '    <td>$26</td>\n' +
          '  </tr>\n' +
          '</table>',
        mode: 'preview',
        lang: 'html',
        expectCode: '<td>',
        previewHeight: 260
      },

      quiz: [
        {
          type: 'mc',
          q: '表格內，一行（橫行）用邊個標籤？',
          options: ['tr', 'td', 'th', 'caption'],
          answer: 0,
          explain: 'tr 係 table row，即係一行。td 係一行內嘅一格，caption 係成個表嘅名。'
        },
        {
          type: 'mc',
          q: '表格內，一格普通資料用邊個標籤？',
          options: ['td', 'tr', 'caption', 'li'],
          answer: 0,
          explain: 'td 係 table data，即一格資料。li 係清單項目，唔屬於表格。'
        },
        {
          type: 'mc',
          q: '想表達「呢一格係標題」，應該用邊個標籤？',
          options: ['th', 'td', 'caption', 'strong'],
          answer: 0,
          explain: 'th 係 table header。佢會自動變粗同居中，亦會話畀讀屏軟件知呢格係標題。'
        },
        {
          type: 'mc',
          q: 'caption 嘅作用係咩？',
          options: ['寫出成個表格嘅標題', '寫其中一行', '畫表格嘅邊框', '合併兩格'],
          answer: 0,
          explain: 'caption 係表格嘅名字，預設會顯示喺表格上面。邊框係 CSS 嘅工作，合併格要用 colspan 或者 rowspan。'
        },
        {
          type: 'mc',
          q: 'colspan 嘅作用係咩？',
          options: ['令一格橫向跨過幾欄', '令一格向下跨過幾行', '令表格居中', '令字變粗'],
          answer: 0,
          explain: 'colspan 係 column span，橫向合併；向下合併要用 rowspan。'
        },
        {
          type: 'mc',
          q: '邊種情況最適合用表格？',
          options: [
            '資料本身有行列關係，例如點心對價錢',
            '想左右兩邊排位',
            '想整一個按鈕',
            '想整一個影片播放器'
          ],
          answer: 0,
          explain: '表格係為「有行列關係嘅資料」而設。純粹排位應該用 div 加 CSS，唔好攞表格嚟做排版工具。'
        },
        {
          type: 'tf',
          q: '判斷：HTML 表格預設就會有黑色邊框。',
          answer: 1,
          explain: '表格預設係冇邊框嘅，每格會貼埋一齊。想睇到線就要用 CSS 加 border。'
        },
        {
          type: 'tf',
          q: '判斷：thead 用嚟放表頭（標題列），tbody 用嚟放真正嘅資料行。',
          answer: 0,
          explain: '兩者係分工：thead 放表頭，tbody 放資料。分開之後結構清晰，寫 CSS 或者用程式讀資料都方便。'
        },
        {
          type: 'tf',
          q: '判斷：rowspan 係用嚟令一格橫向合併。',
          answer: 1,
          explain: 'rowspan 係向下（跨行）合併，橫向合併係 colspan。記法：row 係行，col 係欄。'
        }
      ]
    },

    /* ================= 第 5 章：圖片同多媒體 ================= */
    {
      id: 'h5',
      title: '圖片同多媒體',
      icon: '🖼️',
      summary: '學識放圖片、寫好替代文字，同埋點樣放片同聲音。',

      points: [
        {
          title: 'img：src 同 alt',
          analogy: 'img 好似一個相框：src 話你知相片擺喺邊（檔名同路徑），' +
            'alt 就係貼喺相框背後嘅紙條，講明「呢度原本應該有咩」。',
          code:
            '<img src="cat.jpg" alt="一隻趴喺梳化上嘅貓">\n' +
            '\n' +
            '<!-- src 可以指向資料夾： -->\n' +
            '<img src="images/cat.jpg" alt="同一隻貓，放喺 images 資料夾">',
          lang: 'html',
          preview: {
            html:
              '<div style="width: 220px; height: 130px; background: linear-gradient(135deg, khaki, lightcoral); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 50px;">🐱</div>\n' +
              '<p style="color: slategray; font-size: 14px;">預覽唔可以連外部檔案，所以呢度用 emoji 代替真實圖檔；你落手寫嘅時候，src 要指向你自己嘅圖片路徑。</p>'
          },
          tip: 'alt 唔止係「圖壞咗先睇到」：讀屏軟件會讀出 alt 內容，搜尋引擎都靠佢明白張圖講咩，所以一定要寫。'
        },
        {
          title: 'width 同 height：控制大細',
          analogy: 'width 同 height 好似喺相簿預留位置：先話定一格有幾大，' +
            '就算相片仲未載入完，個位都已經霸好，唔會成個網頁跳嚟跳去。',
          code:
            '<img src="cat.jpg" alt="貓" width="160" height="100">\n' +
            '<img src="cat.jpg" alt="同一隻貓，縮細啲" width="90" height="100">',
          lang: 'html',
          preview: {
            html:
              '<div style="display: flex; gap: 16px; align-items: flex-end;">\n' +
              '  <div style="width: 160px; height: 100px; background: khaki; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 34px;">🐱</div>\n' +
              '  <div style="width: 90px; height: 100px; background: pink; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 26px;">🐱</div>\n' +
              '</div>\n' +
              '<p style="color: slategray; font-size: 14px;">同一張圖，width 寫唔同數值，出到嚟就唔同大細。</p>'
          },
          tip: '淨係寫 width，瀏覽器會按原圖比例自動計高度，唔會拉變形；兩個都寫就要自己留意比例，否則張圖會變扁或者變瘦。'
        },
        {
          title: 'figure 同 figcaption：圖加說明',
          analogy: 'figure 好似一個相架連名牌：相架放相，名牌寫「2024 年山頂夜景」。' +
            '兩樣嘢綁埋一齊，搬去邊都唔會失散。',
          code:
            '<figure>\n' +
            '  <img src="peak.jpg" alt="山頂夜景" width="220">\n' +
            '  <figcaption>2024 年山頂夜景</figcaption>\n' +
            '</figure>',
          lang: 'html',
          preview: {
            html:
              '<figure style="margin: 0; width: 220px;">\n' +
              '  <div style="height: 130px; background: linear-gradient(135deg, lightblue, lightskyblue); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 46px;">🌃</div>\n' +
              '  <figcaption style="font-size: 14px; color: slategray; padding-top: 6px;">2024 年山頂夜景</figcaption>\n' +
              '</figure>'
          },
          tip: 'figure 唔一定放圖，都可以放程式碼或者圖表；重點係「一件自己完整嘅內容加上佢嘅說明」。'
        },
        {
          title: 'video 同 controls：放一段片',
          analogy: 'video 標籤好似一部電視機：src 係要播嘅片，controls 就係遙控器。' +
            '冇 controls，觀眾就只能夠睇住個黑盒，撳唔到播放。',
          code:
            '<video src="movie.mp4" controls width="320">\n' +
            '  你呢個瀏覽器唔支援 video 標籤。\n' +
            '</video>',
          lang: 'html',
          preview: {
            html:
              '<div style="width: 300px; border-radius: 10px; overflow: hidden; background: midnightblue; color: lightgray;">\n' +
              '  <div style="height: 150px; display: flex; align-items: center; justify-content: center; font-size: 44px;">🎬</div>\n' +
              '  <div style="padding: 8px 12px; display: flex; gap: 12px; font-size: 14px;">▶ 播放　⏸ 暫停　🔊 音量　⛶ 全螢幕</div>\n' +
              '</div>\n' +
              '<p style="color: slategray; font-size: 14px;">以上係模擬嘅播放器：真實嘅 video 標籤加咗 controls，瀏覽器就會自動出呢一排控制列。</p>'
          },
          tip: '以上嘅 movie.mp4 只係示範路徑。真實使用時要換成你自己嘅檔案路徑，例如 video/movie.mp4，播放器先至搵到條片。'
        },
        {
          title: 'audio、source 同多種格式',
          analogy: 'audio 好似一部收音機；source 好似一條同時帶幾種插頭嘅充電線：' +
            'USB-C 唔得就試另一個，瀏覽器會揀一個佢播得到嘅格式。',
          code:
            '<audio controls>\n' +
            '  <source src="song.mp3" type="audio/mpeg">\n' +
            '  <source src="song.ogg" type="audio/ogg">\n' +
            '  你呢個瀏覽器唔支援 audio 標籤。\n' +
            '</audio>',
          lang: 'html',
          preview: {
            html:
              '<div style="display: flex; align-items: center; gap: 12px; background: whitesmoke; padding: 10px 14px; border-radius: 30px; width: 260px;">\n' +
              '  <span style="font-size: 22px;">▶️</span>\n' +
              '  <div style="flex: 1; height: 6px; background: lightgray; border-radius: 3px;"></div>\n' +
              '  <span style="font-size: 14px; color: slategray;">1:20</span>\n' +
              '</div>\n' +
              '<p style="color: slategray; font-size: 14px;">以上係模擬嘅播放列：真實嘅 audio 標籤加 controls 就會出類似嘅嘢。</p>'
          },
          tip: '上面嘅 song.mp3 同 song.ogg 只係示範路徑。真實使用時要換成你自己嘅檔案路徑；另外 source 一定要放喺 video 或者 audio 之內，佢自己一個就完成，唔需要寫閂標籤。'
        }
      ],

      puzzle: {
        title: '練習 5：整一張有說明嘅圖片卡',
        task: '用 <code>&lt;figure&gt;</code> 裝住一個 <code>&lt;img&gt;</code>（src 用示範路徑 cat.jpg，' +
          'alt 寫一句描述）同一個 <code>&lt;figcaption&gt;</code> 寫圖片說明。',
        hint: '結構係 figure → img（自己一個，唔使閂）→ figcaption → 閂 figure。' +
          '因為冇真實圖檔，預覽框會顯示 alt 嘅文字。',
        starter: '<!-- 喺下面寫你嘅圖片卡 -->\n',
        solution:
          '<figure>\n' +
          '  <img src="cat.jpg" alt="一隻趴喺梳化上嘅貓" width="220">\n' +
          '  <figcaption>我隻貓「阿柑」</figcaption>\n' +
          '</figure>',
        mode: 'preview',
        lang: 'html',
        expectCode: '<figcaption>',
        previewHeight: 240
      },

      quiz: [
        {
          type: 'mc',
          q: 'img 標籤嘅 src 屬性係用嚟寫咩？',
          options: ['圖檔嘅路徑或者檔名', '圖片嘅替代文字', '圖片嘅闊度', '圖片嘅顏色'],
          answer: 0,
          explain: 'src 係 source（來源），要寫圖檔喺邊。替代文字係 alt，大細係 width 同 height。'
        },
        {
          type: 'mc',
          q: 'alt 屬性最重要嘅作用係咩？',
          options: [
            '圖片載入唔到、或者用讀屏軟件嘅時候，用文字講出張圖係咩',
            '令圖片自動變大',
            '設定圖片嘅透明度',
            '令圖片可以撳'
          ],
          answer: 0,
          explain: 'alt 係無障礙嘅基本功：圖睇唔到嘅人要知張圖講咩。順帶一提，搜尋引擎都靠 alt 理解圖片內容。'
        },
        {
          type: 'mc',
          q: '想喺網頁播放一段影片，應該用邊個標籤？',
          options: ['video', 'audio', 'img', 'figure'],
          answer: 0,
          explain: 'video 專責影片，audio 專責聲音，img 係靜態圖片，figure 只係一個內容加上說明嘅外框。'
        },
        {
          type: 'mc',
          q: 'controls 屬性嘅作用係咩？',
          options: ['顯示播放控制列，例如播放、暫停同音量', '自動播放段片', '令段片循環播放', '靜音'],
          answer: 0,
          explain: 'controls 會叫瀏覽器畫出控制列。自動播放、循環、靜音各自有自己嘅屬性，唔關 controls 事。'
        },
        {
          type: 'mc',
          q: 'figcaption 應該放喺邊？',
          options: ['figure 之內，做圖片嘅說明', 'figure 之外', 'img 之內', 'body 最尾'],
          answer: 0,
          explain: 'figcaption 係 figure 嘅說明，放喺 figure 之內先至有「綁埋一齊」嘅意思。'
        },
        {
          type: 'mc',
          q: '一次過用幾個 source 標籤嘅好處係咩？',
          options: [
            '提供幾個格式，等瀏覽器揀一個佢播得到嘅',
            '令段片清啲',
            '加快上網速度',
            '令播放器自動變大'
          ],
          answer: 0,
          explain: '唔同瀏覽器支援嘅格式唔同。寫幾個 source，瀏覽器會由上而下揀第一個播得到嘅，等於自己帶幾個插頭。'
        },
        {
          type: 'tf',
          q: '判斷：img 標籤需要寫閂標籤。',
          answer: 1,
          explain: 'img 係自己完成嘅標籤，冇內容夾喺中間，所以佢冇閂標籤。'
        },
        {
          type: 'tf',
          q: '判斷：圖檔路徑寫錯，網頁一樣會顯示 alt 內嘅文字。',
          answer: 0,
          explain: '圖載入唔到時，瀏覽器會顯示 alt 文字同一個爛圖示。所以 alt 寫得好，出錯時都仲有人睇得明。'
        },
        {
          type: 'tf',
          q: '判斷：video 只寫 src、唔寫 controls，觀眾一樣可以撳播放。',
          answer: 1,
          explain: '冇 controls 就冇控制列，觀眾撳唔到播放。想畀人自己控制，就一定要加 controls。'
        }
      ]
    },

    /* ================= 第 6 章：連結、div 同 span、語意標籤 ================= */
    {
      id: 'h6',
      title: '連結、div 同 span、語意標籤',
      icon: '🔗',
      summary: '用連結把網頁連埋一齊，再學識用盒同語意標籤砌出清楚嘅結構。',

      points: [
        {
          title: 'a 標籤同 href：整一條連結',
          analogy: 'a 標籤好似地鐵嘅指示牌：href 係目的地，牌上寫嘅字係畀人睇嘅站名。' +
            '指示牌寫得清楚，乘客先敢跟住行。',
          code:
            '<a href="https://example.com">去範例網站</a>\n' +
            '\n' +
            '<!-- 連結文字要講清楚目的地 -->\n' +
            '<a href="menu.html">睇今日餐牌</a>',
          lang: 'html',
          preview: {
            html:
              '<p style="margin: 0 0 8px;"><a href="#menu" style="color: steelblue;">撳我去睇餐牌</a>（呢個係頁內連結，唔會跳出預覽框）</p>\n' +
              '<h3 id="menu" style="background: whitesmoke; padding: 10px; border-radius: 8px; margin: 0;">餐牌：凍檸茶 $22</h3>'
          },
          tip: '連結文字要寫得有意義，例如「睇餐牌」好過「撳呢度」，因為讀屏軟件會逐條連結讀出嚟，冇上文就唔知去邊。'
        },
        {
          title: 'target="_blank" 同 rel="noopener"',
          analogy: 'target 加 _blank 好似叫店員「呢件事另外開一張單」：' +
            '新分頁開連結，你原本睇緊嘅網頁繼續留喺度，唔會唔見咗。',
          code:
            '<a href="https://example.com" target="_blank" rel="noopener">\n' +
            '  開新分頁睇範例\n' +
            '</a>',
          lang: 'html',
          preview: {
            html:
              '<div style="border: 2px solid lightgray; border-radius: 10px; overflow: hidden; font-size: 14px;">\n' +
              '  <div style="background: gainsboro; padding: 8px 12px;">🔖 原本嘅網頁　|　🔖 範例網站（新分頁）</div>\n' +
              '  <div style="padding: 12px;">target 加 _blank 會令連結喺新分頁打開，原本嗰頁繼續留喺度，訪客睇完可以返轉頭。</div>\n' +
              '</div>'
          },
          tip: '加 rel="noopener" 係安全習慣：防止新開嘅分頁透過 JavaScript 控制你原本嗰一版。'
        },
        {
          title: '頁內錨點：用 id 跳去同一頁嘅另一段',
          analogy: '頁內錨點好似商場嘅樓層索引：「撳 3 樓」就即刻帶你上去，' +
            '唔需要離開個商場，亦唔需要重新搭車。',
          code:
            '<a href="#drinks">跳去飲品區</a>\n' +
            '\n' +
            '<h3 id="drinks">飲品區</h3>\n' +
            '<p>凍檸茶 $22、鴦走 $24</p>',
          lang: 'html',
          preview: {
            html:
              '<p style="margin: 0 0 8px;"><a href="#floor3" style="color: steelblue;">撳呢度跳去 3 樓</a></p>\n' +
              '<div style="height: 60px;"></div>\n' +
              '<h3 id="floor3" style="background: lightyellow; padding: 10px; border-radius: 8px; margin: 0;">3 樓：電器部（你到咗啦）</h3>'
          },
          tip: 'href 嘅 # 之後要同目標嘅 id 完全一樣，連大細寫都要一樣，否則撳完冇反應。'
        },
        {
          title: 'div 同 span：兩種盒',
          analogy: 'div 好似一個紙箱，自己霸一整行；' +
            'span 好似一支螢光筆，只喺文字中間畫一段，唔會令句子斷開。',
          code:
            '<div class="card">\n' +
            '  <p>我係一個 div：我會獨佔一整行。</p>\n' +
            '  <p>句子中間有 <span class="highlight">螢光筆效果</span> 都唔會斷行。</p>\n' +
            '</div>',
          lang: 'html',
          preview: {
            html:
              '<div style="background: lightcyan; padding: 10px; border-radius: 8px;">我係一個 div：獨佔一整行。</div>\n' +
              '<p style="margin-top: 10px;">我係一段文字，中間有 <span style="background: khaki; padding: 0 4px;">螢光筆畫過</span> 嘅效果，但我冇斷行。</p>'
          },
          tip: 'div 同 span 本身冇任何意思，只用嚟分組或者方便 CSS 揀位；有意義嘅內容應該用下面嘅語意標籤。'
        },
        {
          title: '語意標籤：header、nav、main、section、footer',
          analogy: '語意標籤好似一間屋嘅間隔：玄關（header）、走廊指示（nav）、大廳（main）、' +
            '房間（section）、後門（footer）。一睇就知邊度做咩。',
          code:
            '<header>\n' +
            '  <nav>選單放呢度</nav>\n' +
            '</header>\n' +
            '<main>\n' +
            '  <section>主要內容</section>\n' +
            '</main>\n' +
            '<footer>版權同聯絡方法</footer>',
          lang: 'html',
          preview: {
            html:
              '<div style="border: 2px solid lightgray; border-radius: 10px; overflow: hidden; font-size: 14px;">\n' +
              '  <div style="background: lightcyan; padding: 8px 12px;">header：網站最頂，通常放標誌同選單</div>\n' +
              '  <div style="background: lavender; padding: 8px 12px;">nav：導覽連結</div>\n' +
              '  <div style="background: honeydew; padding: 12px;">main：主要內容，一個網頁只應該有一個</div>\n' +
              '  <div style="background: lightyellow; padding: 8px 12px;">footer：頁尾，放版權同聯絡方法</div>\n' +
              '</div>'
          },
          tip: '語意標籤嘅外觀同 div 一樣，唔會自動變靚。佢嘅價值係令結構一目了然，對搜尋引擎同讀屏軟件特別有用。'
        }
      ],

      puzzle: {
        title: '練習 6：整一個有選單嘅網頁',
        task: '用 <code>&lt;header&gt;</code> 裝住一個 <code>&lt;nav&gt;</code>（內放兩個 ' +
          '<code>&lt;a&gt;</code> 連結，其中一個要係頁內錨點，例如 href="#menu"），' +
          '再用 <code>&lt;main&gt;</code> 裝住一段有 id 嘅內容，最後加 <code>&lt;footer&gt;</code>。',
        hint: '頁內錨點要兩邊夾埋：目標寫 <code>id="menu"</code>，連結寫 <code>href="#menu"</code>。',
        starter: '<!-- 喺下面寫你嘅網頁 -->\n',
        solution:
          '<header>\n' +
          '  <nav>\n' +
          '    <a href="#menu">睇餐牌</a>\n' +
          '    <a href="#contact">聯絡我們</a>\n' +
          '  </nav>\n' +
          '</header>\n' +
          '<main>\n' +
          '  <h2 id="menu">餐牌</h2>\n' +
          '  <p>凍檸茶 $22</p>\n' +
          '</main>\n' +
          '<footer id="contact">電話：2345 6789</footer>',
        mode: 'preview',
        lang: 'html',
        expectCode: '<nav>',
        previewHeight: 260
      },

      quiz: [
        {
          type: 'mc',
          q: 'a 標籤嘅 href 屬性係用嚟寫咩？',
          options: ['連結要去嘅目的地', '連結文字嘅顏色', '連結嘅大細', '連結嘅圖示'],
          answer: 0,
          explain: 'href 係 hyperlink reference，即係「去邊」。顏色同大細全部係 CSS 嘅工作。'
        },
        {
          type: 'mc',
          q: '想連結撳完喺新分頁打開，要加咩屬性？',
          options: ['target="_blank"', 'href="_blank"', 'new="tab"', 'open="new"'],
          answer: 0,
          explain: 'target 話畀瀏覽器知喺邊度打開；_blank 代表新分頁或者新視窗。'
        },
        {
          type: 'mc',
          q: '假設目標段落嘅 id 係 menu，頁內錨點嘅連結應該點寫？',
          options: ['href="#menu"', 'href="menu"', 'href="menu.html"', 'id="#menu"'],
          answer: 0,
          explain: '頁內連結要有 # 開頭，之後接目標嘅 id。冇 # 就會當成另一個檔案嘅路徑。'
        },
        {
          type: 'mc',
          q: 'div 同 span 最大嘅分別係咩？',
          options: [
            'div 會獨佔一整行，span 只影響文字中間嘅一小段',
            'div 有顏色，span 冇顏色',
            'span 唔可以加 class',
            'div 一定要放喺 span 之內'
          ],
          answer: 0,
          explain: 'div 係區塊盒，前後都會斷行；span 係行內盒，用嚟裝住句中嘅一小段文字。'
        },
        {
          type: 'mc',
          q: '以下邊組全部係語意標籤？',
          options: ['header、nav、main、footer', 'div、span', 'b、i', 'img、video'],
          answer: 0,
          explain: '語意標籤嘅名字本身就講出用途。div 同 span 冇意思，b 同 i 只講外觀。'
        },
        {
          type: 'mc',
          q: '一個網頁嘅主要內容，應該放喺邊個標籤之內？',
          options: ['main', 'footer', 'nav', 'head'],
          answer: 0,
          explain: 'main 代表呢一頁獨有嘅主要內容，通常一個網頁只寫一個。footer 係頁尾，nav 係導覽。'
        },
        {
          type: 'tf',
          q: '判斷：用 target="_blank" 開新分頁時，習慣上會再加 rel="noopener" 提升安全。',
          answer: 0,
          explain: '新開嘅分頁有機會透過 JavaScript 控制原本嗰版。加 rel="noopener" 就可以切斷呢條路。'
        },
        {
          type: 'tf',
          q: '判斷：div 同 span 本身帶有「呢度係導覽」或者「呢度係主要內容」嘅意思。',
          answer: 1,
          explain: 'div 同 span 完全冇意思，只係一群盒。想表達意思，就要用 nav、main 呢類語意標籤。'
        },
        {
          type: 'tf',
          q: '判斷：語意標籤例如 main，預設就會有特別外觀，一定比 div 靚。',
          answer: 1,
          explain: '大部分語意標籤嘅預設外觀同 div 一樣，唔會自動變靚。好唔好睇全部靠 CSS，語意標籤負責嘅係結構同意思。'
        }
      ]
    },

    /* ================= 第 7 章：表單入門 ================= */
    {
      id: 'h7',
      title: '表單入門',
      icon: '📮',
      summary: '學識整表單：由文字框、密碼框，到剔選項同下拉選單。',

      points: [
        {
          title: 'form 同 label：表單嘅外框',
          analogy: 'form 好似一張點心紙：一張紙收集好多項資料，填完就交去廚房。' +
            'label 好似每格旁邊嘅欄名，話你知呢格要填咩。',
          code:
            '<form>\n' +
            '  <label for="name">姓名</label>\n' +
            '  <input id="name" type="text">\n' +
            '</form>',
          lang: 'html',
          preview: {
            html:
              '<form style="font-size: 15px;">\n' +
              '  <label for="demoName" style="display: block; margin-bottom: 4px;">姓名</label>\n' +
              '  <input id="demoName" type="text" style="padding: 6px 10px; border: 1px solid lightgray; border-radius: 6px;">\n' +
              '</form>\n' +
              '<p style="color: slategray; font-size: 14px;">撳一撳「姓名」兩個字，游標會自動跳去輸入框，呢個就係 label 配 id 嘅效果。</p>'
          },
          tip: 'label 嘅 for 要同 input 嘅 id 一模一樣，咁撳落個名度都會自動跳去輸入框，手指粗嘅人都唔會撳錯。'
        },
        {
          title: 'input 嘅 type：文字、密碼、電郵、數字',
          analogy: 'input 好似表格其中一格空格，type 決定呢格收咩：' +
            'text 收文字、password 收密碼（打字時會變圓點）、email 收電郵地址、number 收數字。' +
            'placeholder 就好似用鉛筆寫住嘅灰色示範，你一打字就消失。',
          code:
            '<label for="user">用戶名</label>\n' +
            '<input id="user" type="text" placeholder="例如：ming123" required>\n' +
            '\n' +
            '<label for="pw">密碼</label>\n' +
            '<input id="pw" type="password">\n' +
            '\n' +
            '<label for="age">年齡</label>\n' +
            '<input id="age" type="number" min="1" max="120">',
          lang: 'html',
          preview: {
            html:
              '<div style="font-size: 15px; display: grid; gap: 10px;">\n' +
              '  <div><label for="p1">用戶名</label><br><input id="p1" type="text" placeholder="例如：ming123" style="padding: 6px 10px; border: 1px solid lightgray; border-radius: 6px;"></div>\n' +
              '  <div><label for="p2">密碼</label><br><input id="p2" type="password" style="padding: 6px 10px; border: 1px solid lightgray; border-radius: 6px;"></div>\n' +
              '  <div><label for="p3">年齡</label><br><input id="p3" type="number" min="1" max="120" style="padding: 6px 10px; border: 1px solid lightgray; border-radius: 6px; width: 90px;"></div>\n' +
              '</div>'
          },
          tip: 'placeholder 唔可以代替 label：佢一打字就消失，讀屏軟件對佢嘅支援亦唔好，所以兩樣都要寫。'
        },
        {
          title: 'checkbox 同 radio：剔選項',
          analogy: 'checkbox 好似酒樓點心紙，你可以一次過剔「蝦餃」同「燒賣」；' +
            'radio 好似揀座位，一排座位只可以揀一個，揀咗第二個就自動取消第一個。',
          code:
            '<p>要咩點心：</p>\n' +
            '<input id="a1" type="checkbox"><label for="a1">蝦餃</label>\n' +
            '<input id="a2" type="checkbox"><label for="a2">燒賣</label>\n' +
            '\n' +
            '<p>揀飲品（只可以揀一款）：</p>\n' +
            '<input id="d1" type="radio" name="drink"><label for="d1">奶茶</label>\n' +
            '<input id="d2" type="radio" name="drink"><label for="d2">咖啡</label>',
          lang: 'html',
          preview: {
            html:
              '<div style="font-size: 15px;">\n' +
              '  <p style="margin: 0 0 6px;">要咩點心：</p>\n' +
              '  <input id="c1" type="checkbox"><label for="c1">蝦餃</label>\n' +
              '  <input id="c2" type="checkbox"><label for="c2">燒賣</label>\n' +
              '  <p style="margin: 12px 0 6px;">揀飲品（只可以揀一款）：</p>\n' +
              '  <input id="r1" type="radio" name="drinkDemo"><label for="r1">奶茶</label>\n' +
              '  <input id="r2" type="radio" name="drinkDemo"><label for="r2">咖啡</label>\n' +
              '</div>'
          },
          tip: '同一組 radio 一定要用同一個 name，否則會變成幾組獨立選項，可以同時揀幾個，失去「只揀一個」嘅意思。'
        },
        {
          title: 'select、option 同 textarea',
          analogy: 'select 好似酒樓嘅「揀飲品」牌：收起時只見一款，撳落去先彈晒所有選擇出嚟。' +
            'textarea 好似一塊留言板，可以寫幾行字。',
          code:
            '<label for="ice">冰量</label>\n' +
            '<select id="ice">\n' +
            '  <option>正常冰</option>\n' +
            '  <option>少冰</option>\n' +
            '  <option>走冰</option>\n' +
            '</select>\n' +
            '\n' +
            '<label for="note">備註</label>\n' +
            '<textarea id="note" rows="3">唔要甜</textarea>',
          lang: 'html',
          preview: {
            html:
              '<div style="font-size: 15px; display: grid; gap: 10px;">\n' +
              '  <div><label for="iceDemo">冰量</label><br>\n' +
              '    <select id="iceDemo" style="padding: 6px 10px; border: 1px solid lightgray; border-radius: 6px;">\n' +
              '      <option>正常冰</option>\n' +
              '      <option>少冰</option>\n' +
              '      <option>走冰</option>\n' +
              '    </select>\n' +
              '  </div>\n' +
              '  <div><label for="noteDemo">備註</label><br>\n' +
              '    <textarea id="noteDemo" rows="3" style="padding: 6px 10px; border: 1px solid lightgray; border-radius: 6px; width: 90%;">唔要甜</textarea>\n' +
              '  </div>\n' +
              '</div>'
          },
          tip: 'select 嘅每個選項都要用 option 裝住；textarea 嘅預設文字要寫喺開閂標籤中間，佢冇 value 屬性。'
        },
        {
          title: 'button 同表單送出',
          analogy: 'button 好似點心紙最後嗰格「確認落單」。' +
            '真實網站撳完之後，資料會送去伺服器處理；冇伺服器嘅話，撳完就只會令成個網頁重新載入。',
          code:
            '<form>\n' +
            '  <label for="tel">電話</label>\n' +
            '  <input id="tel" type="tel">\n' +
            '  <button type="submit">送出</button>\n' +
            '  <button type="button">清除</button>\n' +
            '</form>',
          lang: 'html',
          preview: {
            html:
              '<form style="font-size: 15px;">\n' +
              '  <label for="telDemo">電話</label>\n' +
              '  <input id="telDemo" type="tel" style="padding: 6px 10px; border: 1px solid lightgray; border-radius: 6px; margin-left: 6px;">\n' +
              '  <div style="margin-top: 12px; display: flex; gap: 10px;">\n' +
              '    <button type="submit" style="background: steelblue; color: white; border: 0; padding: 8px 18px; border-radius: 6px;">送出</button>\n' +
              '    <button type="button" style="background: gainsboro; color: midnightblue; border: 0; padding: 8px 18px; border-radius: 6px;">清除</button>\n' +
              '  </div>\n' +
              '</form>\n' +
              '<p style="color: slategray; font-size: 14px;">呢個學習站係純前端示範，冇伺服器，所以撳「送出」唔會真係送到任何地方。</p>'
          },
          tip: 'button 喺 form 之內冇寫 type 嘅話，預設就係 submit；唔想佢送出表單，就要寫 type="button"。'
        }
      ],

      puzzle: {
        title: '練習 7：整一個報名表',
        task: '用 <code>&lt;form&gt;</code> 整一個報名表：一個 <code>&lt;label&gt;</code> 加 ' +
          '<code>&lt;input type="text"&gt;</code> 收姓名（要有 placeholder）、' +
          '一個 <code>&lt;input type="email"&gt;</code> 收電郵，最後加一個 <code>&lt;button&gt;</code> 寫「送出」。',
        hint: 'label 同 input 用 for／id 配對：<code>&lt;label for="name"&gt;</code> 要配 ' +
          '<code>&lt;input id="name"&gt;</code>。',
        starter: '<!-- 喺下面寫你嘅報名表 -->\n<form>\n\n</form>\n',
        solution:
          '<form>\n' +
          '  <label for="name">姓名</label>\n' +
          '  <input id="name" type="text" placeholder="例如：阿明">\n' +
          '  <label for="email">電郵</label>\n' +
          '  <input id="email" type="email" placeholder="ming@example.com">\n' +
          '  <button type="submit">送出</button>\n' +
          '</form>',
        mode: 'preview',
        lang: 'html',
        expectCode: '<label',
        previewHeight: 260
      },

      quiz: [
        {
          type: 'mc',
          q: 'form 標籤嘅作用係咩？',
          options: ['裝住一群用嚟收集資料嘅控制項', '畫一個表格', '放圖片', '做導覽選單'],
          answer: 0,
          explain: 'form 係表單嘅外框，把相關嘅輸入欄位同送出按鈕歸成一組。畫表格係 table 嘅工作。'
        },
        {
          type: 'mc',
          q: 'label 嘅 for 屬性要對應 input 嘅邊個屬性？',
          options: ['id', 'name', 'type', 'value'],
          answer: 0,
          explain: 'for 要寫目標欄位嘅 id，兩者一樣就綁埋一齊。咁撳 label 就等於撳輸入框，對細螢幕同無障礙都好緊要。'
        },
        {
          type: 'mc',
          q: '想收密碼（打字時顯示圓點），input 嘅 type 應該寫咩？',
          options: ['password', 'text', 'secret', 'hidden'],
          answer: 0,
          explain: 'password 會把輸入嘅字遮成圓點。hidden 係完全唔顯示嘅隱藏欄位，用途完全唔同。'
        },
        {
          type: 'mc',
          q: '想一次過可以剔幾個選項（例如點心），應該用邊種 input？',
          options: ['checkbox', 'radio', 'text', 'submit'],
          answer: 0,
          explain: 'checkbox 係方格，可以同時剔幾個；radio 係圓點，同一組只可以揀一個。'
        },
        {
          type: 'mc',
          q: '同一組 radio 要共用邊個屬性，先算係同一組？',
          options: ['name', 'id', 'value', 'placeholder'],
          answer: 0,
          explain: '同名嘅 radio 屬於同一組，揀一個就會自動取消其他。id 只係每格獨一無二嘅身份證，唔可以用嚟分組。'
        },
        {
          type: 'mc',
          q: '想寫一段可以打幾行字嘅留言區，應該用邊個標籤？',
          options: ['textarea', 'input type="text"', 'select', 'button'],
          answer: 0,
          explain: 'textarea 係多行文字框。input 只可以打一行，select 係下拉選單。'
        },
        {
          type: 'tf',
          q: '判斷：placeholder 可以代替 label，所以唔寫 label 都得。',
          answer: 1,
          explain: 'placeholder 一打字就消失，讀屏軟件嘅支援亦唔好。label 係長期存在嘅欄名，兩者唔可以互相代替。'
        },
        {
          type: 'tf',
          q: '判斷：button 喺 form 之內，冇寫 type 嘅話預設係 submit。',
          answer: 0,
          explain: 'form 內嘅 button 預設就係送出按鈕。唔想佢送出，就要明確寫 type="button"。'
        },
        {
          type: 'tf',
          q: '判斷：喺 input 加 required 屬性，呢一欄唔填就唔可以送出表單。',
          answer: 0,
          explain: 'required 係瀏覽器內置嘅檢查：空白就唔畀送出，仲會自動彈出提示，唔使自己寫 JavaScript。'
        }
      ]
    },

    /* ================= 第 8 章：Bootstrap 5 快速排版 ================= */
    {
      id: 'h8',
      title: 'Bootstrap 5 快速排版',
      icon: '🧱',
      summary: '用現成嘅 CSS 工具庫，幾行 class 就砌出整齊嘅排版。',

      points: [
        {
          title: 'Bootstrap 係乜？點樣引入',
          analogy: 'Bootstrap 好似一套預先鋸好嘅衣櫃組件：' +
            '你唔需要自己鋸木板，揀現成嘅層板同門就可以砌出一個衣櫃。',
          code:
            '<head>\n' +
            '  <meta charset="utf-8">\n' +
            '  <title>用 Bootstrap 嘅網頁</title>\n' +
            '  <link rel="stylesheet"\n' +
            '        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">\n' +
            '</head>',
          lang: 'html',
          preview: {
            html:
              '<div style="background: royalblue; color: white; padding: 10px 16px; border-radius: 6px;">呢個係 Bootstrap 嘅主要藍色 royalblue</div>\n' +
              '<p style="color: slategray; font-size: 14px;">預覽框唔可以連 CDN，所以呢一章全部示範都係用純 CSS 模擬 Bootstrap 嘅外觀。真實專案要先喺 head 加 link 標籤引入 Bootstrap，class 先會生效。</p>'
          },
          tip: 'link 標籤要放喺 head 之內，而且次序好緊要：自己寫嘅 CSS 要放喺 Bootstrap 之後，先至蓋得過佢嘅預設樣式。'
        },
        {
          title: 'container、row、col：十二格線',
          analogy: '格線好似停車場嘅車位：container 係成個停車場，row 係一行車位，col 係一個車位。' +
            'Bootstrap 把一行分做 12 格，你想佔幾多格就寫幾多。',
          code:
            '<div class="container">\n' +
            '  <div class="row">\n' +
            '    <div class="col">第一欄</div>\n' +
            '    <div class="col">第二欄</div>\n' +
            '    <div class="col">第三欄</div>\n' +
            '  </div>\n' +
            '  <div class="row">\n' +
            '    <div class="col-8">佔 8 格</div>\n' +
            '    <div class="col-4">佔 4 格</div>\n' +
            '  </div>\n' +
            '</div>',
          lang: 'html',
          preview: {
            html:
              '<div style="max-width: 520px; margin: 0 auto; font-size: 14px;">\n' +
              '  <div style="display: flex; gap: 8px; margin-bottom: 8px;">\n' +
              '    <div style="flex: 1; background: aliceblue; border: 1px solid lightskyblue; border-radius: 6px; padding: 10px; text-align: center;">col</div>\n' +
              '    <div style="flex: 1; background: aliceblue; border: 1px solid lightskyblue; border-radius: 6px; padding: 10px; text-align: center;">col</div>\n' +
              '    <div style="flex: 1; background: aliceblue; border: 1px solid lightskyblue; border-radius: 6px; padding: 10px; text-align: center;">col</div>\n' +
              '  </div>\n' +
              '  <div style="display: flex; gap: 8px;">\n' +
              '    <div style="flex: 8; background: aliceblue; border: 1px solid lightskyblue; border-radius: 6px; padding: 10px; text-align: center;">col-8</div>\n' +
              '    <div style="flex: 4; background: aliceblue; border: 1px solid lightskyblue; border-radius: 6px; padding: 10px; text-align: center;">col-4</div>\n' +
              '  </div>\n' +
              '</div>'
          },
          tip: '一行總共 12 格，所以 col-8 加 col-4 剛剛好填滿一行；加埋超過 12 就會自動換去下一行。'
        },
        {
          title: 'btn：現成按鈕',
          analogy: 'btn 好似即食麵嘅調味粉：加咗 btn 就有基本形狀，再加 btn-primary 就有主要顏色。' +
            '想要咩色，換另一個字就得。',
          code:
            '<button class="btn btn-primary">主要動作</button>\n' +
            '<button class="btn btn-outline-secondary">次要動作</button>\n' +
            '<button class="btn btn-danger">刪除</button>',
          lang: 'html',
          preview: {
            html:
              '<div style="display: flex; gap: 10px; flex-wrap: wrap;">\n' +
              '  <button style="background: royalblue; color: white; border: 1px solid royalblue; padding: 8px 16px; border-radius: 6px;">主要動作</button>\n' +
              '  <button style="background: transparent; color: gray; border: 1px solid gray; padding: 8px 16px; border-radius: 6px;">次要動作</button>\n' +
              '  <button style="background: crimson; color: white; border: 1px solid crimson; padding: 8px 16px; border-radius: 6px;">刪除</button>\n' +
              '</div>\n' +
              '<p style="color: slategray; font-size: 14px;">以上三個按鈕係用純 CSS 模擬 btn、btn-primary、btn-outline-secondary、btn-danger 嘅外觀。</p>'
          },
          tip: 'class 可以疊幾個，順序唔影響效果；但一定要成對咁用，例如 btn 之後要跟一個顏色 class，唔可以只寫 btn 就想要顏色。'
        },
        {
          title: 'card：卡片組件',
          analogy: 'card 好似茶餐廳嘅餐牌卡：一個框、一個標題、一段文字、一個按鈕，' +
            '全部已經排好靚位，你只需要換入自己嘅內容。',
          code:
            '<div class="card" style="width: 18rem;">\n' +
            '  <div class="card-body">\n' +
            '    <h5 class="card-title">凍檸茶</h5>\n' +
            '    <p class="card-text">凍底加兩片檸檬，$22。</p>\n' +
            '    <a class="btn btn-primary">落單</a>\n' +
            '  </div>\n' +
            '</div>',
          lang: 'html',
          preview: {
            html:
              '<div style="width: 280px; border: 1px solid gainsboro; border-radius: 10px; overflow: hidden; background: white; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);">\n' +
              '  <div style="padding: 16px;">\n' +
              '    <h5 style="margin: 0 0 8px; font-size: 18px;">凍檸茶</h5>\n' +
              '    <p style="margin: 0 0 12px; color: slategray;">凍底加兩片檸檬，$22。</p>\n' +
              '    <span style="background: royalblue; color: white; padding: 7px 14px; border-radius: 6px; font-size: 14px;">落單</span>\n' +
              '  </div>\n' +
              '</div>\n' +
              '<p style="color: slategray; font-size: 14px;">呢張卡係用純 CSS 模擬 card 加 card-body 嘅外觀。</p>'
          },
          tip: 'Bootstrap 嘅組件都係由幾個固定 class 夾出嚟：外層係 card，內容放喺 card-body 之內，標題同文字各有自己嘅 class。'
        },
        {
          title: 'alert 同埋點解 Bootstrap 可以省時間',
          analogy: 'alert 好似超市嘅廣播提示：「今日下午三點暫停營業」。' +
            '一睇就知係提醒，唔需要自己由零畫一個提示框。',
          code:
            '<div class="alert alert-success" role="alert">\n' +
            '  落單成功，師傅開始整啦！\n' +
            '</div>\n' +
            '<div class="alert alert-warning" role="alert">\n' +
            '  今日珍珠賣完咗。\n' +
            '</div>',
          lang: 'html',
          preview: {
            html:
              '<div style="background: honeydew; color: darkgreen; border: 1px solid lightgreen; border-radius: 8px; padding: 12px 14px; margin-bottom: 10px;">落單成功，師傅開始整啦！</div>\n' +
              '<div style="background: lightyellow; color: olive; border: 1px solid moccasin; border-radius: 8px; padding: 12px 14px;">今日珍珠賣完咗。</div>\n' +
              '<p style="color: slategray; font-size: 14px;">以上兩個提示框係用純 CSS 模擬 alert-success 同 alert-warning 嘅外觀。</p>'
          },
          tip: 'Bootstrap 幫你處理埋響應式、瀏覽器差異同無障礙屬性，代價係檔案比較大；小專案自己寫 CSS 亦一樣得。'
        }
      ],

      puzzle: {
        title: '練習 8：用 class 砌一張卡片',
        task: '寫一個 <code>&lt;div class="card"&gt;</code>，內用 ' +
          '<code>&lt;div class="card-body"&gt;</code> 裝住一個 ' +
          '<code>&lt;h5 class="card-title"&gt;</code> 同一個 <code>&lt;p class="card-text"&gt;</code>，' +
          '最後加一個 <code>&lt;a class="btn btn-primary"&gt;</code> 寫「落單」。',
        hint: '純 HTML 嘅 class 唔會自動變靚，要靠 Bootstrap 嘅 CSS 檔。呢個練習係檢查你嘅 class 名寫得啱唔啱。',
        starter: '<!-- 喺下面砌一張 Bootstrap 卡片 -->\n<div class="card">\n\n</div>\n',
        solution:
          '<div class="card">\n' +
          '  <div class="card-body">\n' +
          '    <h5 class="card-title">凍檸茶</h5>\n' +
          '    <p class="card-text">凍底加兩片檸檬，$22。</p>\n' +
          '    <a class="btn btn-primary">落單</a>\n' +
          '  </div>\n' +
          '</div>',
        mode: 'preview',
        lang: 'html',
        expectCode: 'card-body',
        previewHeight: 260
      },

      quiz: [
        {
          type: 'mc',
          q: 'Bootstrap 係乜？',
          options: [
            '一套現成嘅 CSS 工具庫，加 class 就可以快速排版',
            '一種新嘅程式語言',
            '一個瀏覽器',
            '一種圖片格式'
          ],
          answer: 0,
          explain: 'Bootstrap 係一堆預先寫好嘅 CSS。你唔需要自己寫排版規則，加幾個 class 名就得。'
        },
        {
          type: 'mc',
          q: '喺 HTML 檔案引入 Bootstrap 嘅 CSS，主要用邊個標籤？',
          options: ['link', 'script', 'img', 'video'],
          answer: 0,
          explain: '引入外部 CSS 用 link 標籤加 rel="stylesheet"。script 係用嚟引入 JavaScript 檔。'
        },
        {
          type: 'mc',
          q: 'Bootstrap 把一行分做幾多格？',
          options: ['12 格', '10 格', '16 格', '100 格'],
          answer: 0,
          explain: '一行固定 12 格，所以 col-6 係一半、col-4 係三分一、col-8 加 col-4 剛剛好一行。'
        },
        {
          type: 'mc',
          q: '想一個 div 佔一行嘅一半，應該寫咩 class？',
          options: ['col-6', 'col-12', 'col-half', 'col-50'],
          answer: 0,
          explain: '12 格嘅一半係 6。col-12 係佔滿一行，另外兩個寫法 Bootstrap 唔認識。'
        },
        {
          type: 'mc',
          q: 'Bootstrap 卡片嘅內容，通常放喺邊個 class 之內？',
          options: ['card-body', 'card-text', 'card-title', 'container'],
          answer: 0,
          explain: 'card 係外框，card-body 放內容；card-title 同 card-text 係 body 之內嘅標題同文字。'
        },
        {
          type: 'mc',
          q: 'alert 加 role="alert" 有咩好處？',
          options: [
            '話畀讀屏軟件知呢度係一個提示訊息',
            '令顏色靚啲',
            '令訊息自動消失',
            '加快網頁載入'
          ],
          answer: 0,
          explain: 'role="alert" 係無障礙屬性，讀屏軟件會特別讀出呢段提示，等睇唔到顏色嘅人都收到訊息。'
        },
        {
          type: 'tf',
          q: '判斷：只要喺 HTML 寫 class="btn"，就算冇引入 Bootstrap 嘅 CSS，按鈕一樣會自動變靚。',
          answer: 1,
          explain: 'class 只係一個名字，本身唔會產生任何樣式。一定要引入 Bootstrap 嘅 CSS 檔，class 先會生效。'
        },
        {
          type: 'tf',
          q: '判斷：container 用嚟裝住內容，令佢居中同有適當嘅左右留白。',
          answer: 0,
          explain: 'container 係 Bootstrap 嘅排版外框：幫你限制闊度、居中，兩邊留白，內容唔會貼住螢幕邊。'
        },
        {
          type: 'tf',
          q: '判斷：自己寫嘅 CSS 應該放喺 Bootstrap 之後，先至蓋得過 Bootstrap 嘅預設樣式。',
          answer: 0,
          explain: '同一層級嘅規則，後寫嘅會贏。所以自己嘅 CSS 放喺 Bootstrap 之後，先改得動佢嘅樣式。'
        }
      ]
    },

    /* ==== 檔案結束（以下不要再加內容）==== */
  ]

});
