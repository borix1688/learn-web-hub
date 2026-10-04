/* ============================================================================
   前端基礎學堂 Frontend Foundations — data-css.js（CSS 課程資料庫）
   ----------------------------------------------------------------------------
   這個檔案 = CSS 課程嘅全部內容。網站上嘅課程文字、示範、練習同測驗都來自這裡，
   改這裡就等於改課程，網站其他檔案完全唔使動。

   載入後會把一個科目物件加入 window.LEARN_DATA.subjects。

   結構速覽：
     id / name / icon / tagline / intro / runMode / codeLang / theme   科目基本資料
     chapters[ ]   8 章（id 固定 s1–s8）
       points[ ]   學習點：analogy（生活比喻）+ code（範例）+ preview（即時效果）
       puzzle      互動練習（CSS 練習一定要有 previewHtml，學員只寫 CSS）
       quiz[ ]     測驗題：type 'mc'（選擇）或 'tf'（判斷）
   ========================================================================== */
window.LEARN_DATA = window.LEARN_DATA || { subjects: [] };

window.LEARN_DATA.subjects.push({

  /* ---------------- 科目基本資料 ---------------- */
  id: 'css',
  name: 'CSS',
  icon: '🎨',
  tagline: '網頁嘅外表',
  intro: '學識用 CSS 揀顏色、排位置、加外觀，令一個只有文字嘅網頁變成睇得舒服、手機都啱睇嘅成品。',
  runMode: 'preview',
  codeLang: 'css',
  theme: 'css',

  /* ---------------- 8 章內容 ---------------- */
  chapters: [

    /* ================================================================
       s1：CSS 係乜嘢？三種寫法
       ================================================================ */
    {
      id: 's1',
      title: 'CSS 係乜嘢？三種寫法',
      icon: '🎨',
      summary: '搞清楚 CSS 係做咩嘅，同埋三種寫法——inline（行內）、internal（內部）、external（外部）——分別幾時用邊一種。',
      points: [
        {
          title: 'CSS 係乜嘢？一條規則睇清楚',
          analogy: 'HTML 係一間屋嘅牆同間隔，CSS 就係油漆、牆紙同傢俬擺位。同一間屋，換咗呢層外表，' +
            '可以係茶餐廳，也可以係酒店房。',
          code:
            '/* 選擇器 { 屬性: 值; } —— 呢個就係一條 CSS 規則 */\n' +
            'h2 {\n' +
            '  color: crimson;      /* 文字顏色 */\n' +
            '  font-size: 26px;     /* 字嘅大細 */\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<h2>我係一個標題</h2>\n' +
              '<p>我只係普通文字，冇被 CSS 揀中。</p>',
            css:
              'h2 {\n' +
              '  color: crimson;\n' +
              '  font-size: 26px;\n' +
              '}'
          },
          tip: '選擇器（selector）話畀瀏覽器知「邊個要被改」；屬性（property）話「改咩」；' +
            '值（value）話「改成點」。每句後面嘅分號 ; 唔可以漏。'
        },
        {
          title: '寫法一：inline（行內樣式，直接寫喺標籤嘅 style 屬性）',
          analogy: 'inline style 好似喺件衫上面直接貼一張貼紙：只影響呢一件衫，換衫就冇。' +
            '快、直接，但件衫一多就會亂。',
          code:
            '<p style="color: crimson; font-size: 20px;">我係一行文字</p>',
          lang: 'html',
          preview: {
            html:
              '<p style="color: crimson; font-size: 20px;">我係一行文字</p>\n' +
              '<p>隔籬呢行冇貼紙，所以仲係黑色。</p>',
            css:
              '/* 呢個寫法唔使寫選擇器：所有設定直接放喺標籤嘅 style 屬性入面 */'
          },
          tip: 'style 屬性入面嘅寫法同普通 CSS 一樣（屬性: 值;），但唔使寫選擇器，' +
            '因為已經指明係「呢個標籤」。'
        },
        {
          title: '寫法二：internal（內部樣式表，寫喺 HTML 檔嘅 style 標籤）',
          analogy: '內部樣式表好似把一張裝修清單貼喺屋企大門後面：屋企所有地方都跟佢，' +
            '但只限呢一間屋，搬去第二間屋就要再寫一次。',
          code:
            '<!-- 寫喺 HTML 檔嘅 <head> 裏面 -->\n' +
            '<style>\n' +
            '  p {\n' +
            '    color: teal;\n' +
            '    background: lightcyan;\n' +
            '    padding: 8px;\n' +
            '  }\n' +
            '</style>',
          lang: 'html',
          preview: {
            html:
              '&lt;style&gt;  p { color: teal; }  &lt;/style&gt;\n' +
              '<p>我呢行先係真實效果</p>',
            css:
              'p {\n' +
              '  color: teal;\n' +
              '  background: lightcyan;\n' +
              '  padding: 8px;\n' +
              '}'
          },
          tip: '上面灰色嗰句係「寫法示範」，用文字顯示，唔會真的執行；下面嗰行先係即時效果。' +
            '真實網站要把 style 標籤放在 head 標籤裏面。'
        },
        {
          title: '寫法三：external（外部樣式表，link 連去另一個 .css 檔）',
          analogy: '外部樣式表好似屋苑共用嘅一本裝修手冊：全部單位都照佢做，改一頁就全屋苑一齊變。' +
            '網站有幾十個 HTML 檔時，呢個寫法最省事。',
          code:
            '<!-- 寫喺 HTML 檔嘅 <head> 裏面 -->\n' +
            '<link rel="stylesheet" href="style.css">\n' +
            '\n' +
            '/* 另一個檔 style.css 入面就係普通 CSS */\n' +
            'p {\n' +
            '  color: navy;\n' +
            '}',
          lang: 'html',
          preview: {
            html:
              '&lt;link rel="stylesheet" href="style.css"&gt;\n' +
              '<p>我呢行係由 style.css 上色</p>',
            css:
              'p {\n' +
              '  color: navy;\n' +
              '  font-weight: bold;\n' +
              '}'
          },
          tip: 'rel="stylesheet" 係固定寫法，唔可以少；href 就係 .css 檔嘅路徑。' +
            '本章嘅預覽框唔會真的去下載外部檔案（可能冇網路），所以示範時直接寫 CSS。'
        },
        {
          title: '三種寫法並排對照：inline vs internal vs external',
          analogy: '三種寫法好似三個地方貼通告：inline 係貼喺自己件衫（只有你自己睇到）、' +
            'internal 係貼喺屋企大門後面（全屋都睇到，但只限呢一間屋）、' +
            'external 係貼喺屋苑大堂（全個屋苑都睇到，改一張就全部更新）。',
          code:
            '<!-- ① inline：寫喺標籤嘅 style 屬性，只影響呢一個標籤 -->\n' +
            '<p style="color: crimson;">我係 inline</p>\n' +
            '\n' +
            '<!-- ② internal：寫喺 HTML 檔嘅 <head> 裏面，影響呢一頁 -->\n' +
            '<style>\n' +
            '  p { color: teal; }\n' +
            '</style>\n' +
            '\n' +
            '<!-- ③ external：另存一個 .css 檔，再用 link 連入嚟，影響全部頁面 -->\n' +
            '<link rel="stylesheet" href="style.css">',
          lang: 'html',
          preview: {
            html:
              '<table class="cmp">\n' +
              '  <caption>三種寫法點揀？</caption>\n' +
              '  <thead>\n' +
              '    <tr><th>寫法</th><th>寫喺邊度</th><th>影響範圍</th><th>幾時用</th></tr>\n' +
              '  </thead>\n' +
              '  <tbody>\n' +
              '    <tr><td>inline</td><td>標籤嘅 style 屬性</td><td>只有呢一個標籤</td><td>臨時改一個位，或者測試</td></tr>\n' +
              '    <tr><td>internal</td><td>HTML 檔嘅 style 標籤</td><td>呢一頁</td><td>得一頁、又想集中寫</td></tr>\n' +
              '    <tr><td>external</td><td>獨立 .css 檔 + link</td><td>連過去嘅所有頁面</td><td>正式專案，最常用</td></tr>\n' +
              '  </tbody>\n' +
              '</table>',
            css:
              '.cmp {\n' +
              '  border-collapse: collapse;\n' +
              '  font-size: 14px;\n' +
              '  width: 100%;\n' +
              '}\n' +
              '.cmp caption {\n' +
              '  text-align: left;\n' +
              '  font-weight: bold;\n' +
              '  padding-bottom: 8px;\n' +
              '}\n' +
              '.cmp th {\n' +
              '  background: teal;\n' +
              '  color: white;\n' +
              '  text-align: left;\n' +
              '  padding: 8px 10px;\n' +
              '}\n' +
              '.cmp td {\n' +
              '  border-bottom: 1px solid lightgray;\n' +
              '  padding: 8px 10px;\n' +
              '}\n' +
              '.cmp tbody tr td:first-child {\n' +
              '  font-weight: bold;\n' +
              '  color: teal;\n' +
              '}'
          },
          tip: '初學口訣：一個標籤臨時改 → inline；得一頁 → internal；正式專案（多過一頁）→ external。' +
            '真實專案九成時間都用 external，因為改一次就全站生效。'
        },
        {
          title: '三種寫法嘅優先次序：inline 最大',
          analogy: '同一個位置有三個人落指示：inline 係貼喺衫上嘅貼紙，最大聲；' +
            '內部樣式表係貼喺大門後面嘅清單；外部樣式表係屋苑手冊，最細聲。',
          code:
            'p { color: navy; }        /* 標籤選擇器：最細聲 */\n' +
            '.hot { color: green; }    /* class 選擇器：大過標籤 */\n' +
            '\n' +
            '/* HTML 係：<p class="hot" style="color: crimson;"> */',
          lang: 'css',
          preview: {
            html:
              '<p class="hot" style="color: crimson;">我有 inline style，所以係深紅色</p>\n' +
              '<p class="hot">我冇 inline style，class 贏咗標籤，所以係綠色</p>',
            css:
              'p { color: navy; }\n' +
              '.hot { color: green; }'
          },
          tip: '口訣：越貼近標籤嘅寫法越大聲。同一級數（例如兩條都係 class 規則）' +
            '就後面寫嘅蓋過前面寫嘅。'
        }
      ],
      puzzle: {
        title: '練習 1：用「內部樣式表（internal）」幫卡片上色',
        task: '試一次 internal 寫法：喺編輯框寫一個 <code>&lt;style&gt;</code> 區塊，' +
          '裏面寫一條 <code>.card</code> 規則，令卡片有淺黃色背景（例如 <code>lightyellow</code>）、' +
          '深咖啡色文字（例如 <code>saddlebrown</code>）、<code>16px</code> 內距；' +
          '然後喺 <code>&lt;style&gt;</code> 之後寫返 <code>&lt;div class="card"&gt;我係一張卡片&lt;/div&gt;</code>。',
        hint: '結構係：<code>&lt;style&gt;</code> … CSS 規則 … <code>&lt;/style&gt;</code>，' +
          '之後再寫 <code>&lt;div class="card"&gt;文字&lt;/div&gt;</code>。' +
          '要寫三個屬性：<code>background-color</code>、<code>color</code>、<code>padding</code>，每句後面都要有分號。',
        starter: '<!-- ① 喺下面寫 internal 樣式表嘅區塊 -->\n\n\n' +
          '<!-- ② 喺下面寫返嗰張卡片 -->\n',
        solution:
          '<style>\n' +
          '  .card {\n' +
          '    background-color: lightyellow;\n' +
          '    color: saddlebrown;\n' +
          '    padding: 16px;\n' +
          '  }\n' +
          '</style>\n' +
          '<div class="card">我係一張卡片</div>',
        mode: 'preview',
        lang: 'html',
        expectCode: '<style>',
        previewHeight: 200
      },
      quiz: [
        {
          type: 'mc',
          q: 'CSS 主要負責網頁嘅邊一部分？',
          options: ['文字內容同結構', '外觀同排版（顏色、大小、位置）', '伺服器上嘅資料庫', '網址同域名'],
          answer: 1,
          explain: 'HTML 負責內容結構，CSS 負責外觀同排版，JavaScript 負責互動反應，三個各司其職。'
        },
        {
          type: 'mc',
          q: '以下邊句係正確嘅 CSS 寫法？',
          options: ['p [ color: red; ]', 'p { color: red; }', 'p ( color: red )', 'p { color = red; }'],
          answer: 1,
          explain: 'CSS 規則係「選擇器 { 屬性: 值; }」：用大括號，屬性同值之間用冒號，每句結尾用分號。'
        },
        {
          type: 'tf',
          q: '判斷：inline style 嘅優先次序高過寫喺內部樣式表嘅規則。',
          answer: 0,
          explain: 'inline style 最貼近標籤，優先次序最高，所以會蓋過內部樣式表同外部樣式表嘅設定。'
        },
        {
          type: 'mc',
          q: '一個網站有 40 個 HTML 檔，想全部共用同一套外觀，最好用邊種寫法？',
          options: [
            '每個檔都用 inline style',
            '每個檔都寫一次內部樣式表',
            '寫一個 style.css，每個 HTML 檔用 link 連過去',
            '唔用 CSS，逐句文字改顏色'
          ],
          answer: 2,
          explain: '外部樣式表改一次就全站生效，唔使逐個檔改，最省事又最易打理。'
        },
        {
          type: 'mc',
          q: 'CSS 註解嘅正確寫法係？',
          options: ['// 呢句係註解', '<!-- 呢句係註解 -->', '/* 呢句係註解 */', '# 呢句係註解'],
          answer: 2,
          explain: 'CSS 用 /* 同 */ 括住註解；// 係 JavaScript 嘅寫法，HTML 就用 <!-- -->，唔好混亂。'
        },
        {
          type: 'mc',
          q: '同一級數嘅兩條規則都揀中同一個標籤、都設定 color，邊條生效？',
          options: ['寫喺前面嗰條', '寫喺後面嗰條', '兩條一齊生效，顏色會混合', '兩條都唔生效'],
          answer: 1,
          explain: '優先次序相同時，後寫嘅蓋過先寫嘅，所以排規則嘅先後都有影響。'
        },
        {
          type: 'tf',
          q: '判斷：CSS 只可以寫喺另一個 .css 檔，唔可以寫喺 HTML 檔裏面。',
          answer: 1,
          explain: '三種寫法都得：inline（標籤嘅 style 屬性）、internal（HTML 檔裏面嘅 style 標籤）、' +
            'external（獨立 .css 檔再用 link 連入嚟）。'
        },
        {
          type: 'mc',
          q: '把 CSS 寫喺 HTML 檔 <head> 裏面嘅 <style> 標籤，係邊一種寫法？',
          options: ['inline（行內）', 'internal（內部樣式表）', 'external（外部樣式表）', '咁樣唔算 CSS'],
          answer: 1,
          explain: '寫喺 HTML 檔嘅 style 標籤 = internal；寫喺標籤嘅 style 屬性 = inline；' +
            '另存一個 .css 檔再用 link 連入嚟 = external。'
        },
        {
          type: 'mc',
          q: '以下邊個係 inline style 嘅正確寫法？',
          options: ['<p style="color: red;">', '<p css="color: red;">', '<p style:color=red>', '<p { color: red; }>'],
          answer: 0,
          explain: 'inline style 要寫喺 style 屬性入面，值用雙引號括住，格式係「屬性: 值」。'
        },
        {
          type: 'mc',
          q: '一條規則 h2 { color: crimson; font-size: 26px; } 入面，crimson 係咩？',
          options: ['選擇器', '屬性', '值', '註解'],
          answer: 2,
          explain: 'h2 係選擇器（邊個），color 同 font-size 係屬性（改咩），crimson 同 26px 係值（改成點）。'
        }
      ]
    },

    /* ================================================================
       s2：選擇器同偽類
       ================================================================ */
    {
      id: 's2',
      title: '選擇器同偽元素',
      icon: '🎯',
      summary: '學識用標籤、class、id、群組同後代選擇器揀中你想改嘅嘢，再用 :hover 同 ::before / ::after 加動態效果。',
      points: [
        {
          title: '標籤選擇器：一次改晒同一款標籤',
          analogy: '標籤選擇器好似學校宣布「所有中一學生聽日帶運動衫」：唔理你叫咩名，' +
            '只要係中一就一律跟。',
          code:
            '/* 所有 h3 標籤都跟 */\n' +
            'h3 {\n' +
            '  color: teal;\n' +
            '}\n' +
            '\n' +
            '/* 所有 li 標籤都跟 */\n' +
            'li {\n' +
            '  margin-bottom: 6px;\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<h3>我係一個 h3 標題</h3>\n' +
              '<ul>\n' +
              '  <li>第一項</li>\n' +
              '  <li>第二項</li>\n' +
              '</ul>',
            css:
              'h3 { color: teal; }\n' +
              'li { margin-bottom: 6px; }'
          },
          tip: '標籤選擇器影響範圍最大，所以要小心：寫 p { color: red; } 會令整份文件所有段落都變紅。'
        },
        {
          title: 'class 同 id：指名道姓改某幾個標籤',
          analogy: 'class 好似「班別」——同一班可以有幾十人，一個標籤也可以有幾個 class；' +
            'id 好似「身分證號碼」——同一個 HTML 檔只可以有一個，獨一無二。',
          code:
            '/* class 前面加一點，可以多個標籤共用 */\n' +
            '.warn {\n' +
            '  color: chocolate;\n' +
            '}\n' +
            '\n' +
            '/* id 前面加 #，一個檔只應該用一次 */\n' +
            '#site-title {\n' +
            '  font-size: 28px;\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<h3 id="site-title">我係網站標題</h3>\n' +
              '<p class="warn">我呢個警告用 class</p>\n' +
              '<p class="warn">我都係同一個 class</p>',
            css:
              '.warn { color: chocolate; }\n' +
              '#site-title { font-size: 28px; }'
          },
          tip: '一個標籤可以有兩個 class：class="warn big"。至於 id，同一個 HTML 檔唔應該有兩個標籤用同一個 id。'
        },
        {
          title: '群組逗號 , 同後代空格',
          analogy: '群組逗號好似茶餐廳落單：「凍奶茶、檸檬茶、好立克」都要少甜——幾個選擇器共用同一套設定。' +
            '後代空格好似講「只限喺廚房裏面嘅雪櫃」——一定要喺某個範圍之內先算。',
          code:
            '/* 逗號 = 幾個選擇器共用同一套設定 */\n' +
            'h3, h4 {\n' +
            '  color: navy;\n' +
            '}\n' +
            '\n' +
            '/* 空格 = 只揀「.menu 裏面」嘅 a */\n' +
            '.menu a {\n' +
            '  color: darkred;\n' +
            '  text-decoration: none;\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<h3>標題一</h3>\n' +
              '<h4>標題二</h4>\n' +
              '<div class="menu">\n' +
              '  <a href="#">我喺 .menu 裏面，所以變紅色</a>\n' +
              '</div>\n' +
              '<a href="#">我唔喺 .menu 裏面，冇被揀中</a>',
            css:
              'h3, h4 { color: navy; }\n' +
              '.menu a { color: darkred; text-decoration: none; }'
          },
          tip: '逗號兩邊係「並列」，空格兩邊係「上下層」。.menu a 唔等於 a.menu：' +
            '後者係指一個本身有 class menu 嘅連結。'
        },
        {
          title: ':hover：滑鼠一指過去就變樣',
          analogy: '好似舖頭門口嘅感應燈：平時暗暗地，有人行近（滑鼠移過去）先著燈。',
          code:
            '.btn {\n' +
            '  background: teal;\n' +
            '  color: white;\n' +
            '  padding: 10px 18px;\n' +
            '  border-radius: 8px;\n' +
            '}\n' +
            '\n' +
            '.btn:hover {\n' +
            '  background: gold;\n' +
            '  color: dimgray;\n' +
            '}',
          lang: 'css',
          preview: {
            html: '<p class="btn">滑鼠移過我呢度睇下</p>',
            css:
              '.btn { background: teal; color: white; padding: 10px 18px; border-radius: 8px; }\n' +
              '.btn:hover { background: gold; color: dimgray; }'
          },
          tip: ':hover 要直接連住選擇器，中間唔可以有空格。手機用手指撳係冇「移過去」呢個動作，' +
            '所以重要功能唔好只靠 :hover。'
        },
        {
          title: '::before 同 ::after：自動加前綴後綴',
          analogy: '好似相框：相片本身唔變，但框嘅左邊自動多一個「💡」貼紙，右邊自動多一個印仔。' +
            '貼紙同印仔都係 CSS 加上去嘅，HTML 入面冇寫過。',
          code:
            '.tip::before {\n' +
            '  content: "💡 ";\n' +
            '}\n' +
            '\n' +
            '.tip::after {\n' +
            '  content: "（記住呢點）";\n' +
            '  color: gray;\n' +
            '}',
          lang: 'css',
          preview: {
            html: '<p class="tip">HTML 只有呢句文字，箭嘴同尾註都係 CSS 加嘅</p>',
            css:
              '.tip::before { content: "💡 "; }\n' +
              '.tip::after { content: "（記住呢點）"; color: gray; }'
          },
          tip: '::before 同 ::after 一定要寫 content 先會出現，就算冇字都要寫 content: "";。' +
            '另外偽標籤預設係行內，想設定寬高就要先加 display: inline-block。'
        }
      ],
      puzzle: {
        title: '練習 2：整一個會變色嘅標籤',
        task: '預覽框有一句固定嘅 <code>&lt;p class="tag"&gt;新貨&lt;/p&gt;</code>。喺編輯框寫 CSS：' +
          '令 <code>.tag</code> 有深綠色背景、白色文字、<code>6px</code> 圓角；' +
          '再用 <code>:hover</code> 令滑鼠移過去嗰陣變成金色背景（例如 <code>gold</code>）。',
        hint: '先寫一條 <code>.tag { ... }</code> 規則，再寫一條 <code>.tag:hover { ... }</code> 規則。' +
          ':hover 前面唔可以有空格。',
        starter: '/* 喺下面寫你嘅 CSS */\n.tag {\n\n}\n\n/* 再寫一條「滑鼠移過去」嘅規則（提示：選擇器後面加偽類） */\n',
        solution:
          '.tag {\n' +
          '  background: teal;\n' +
          '  color: white;\n' +
          '  padding: 8px 14px;\n' +
          '  border-radius: 6px;\n' +
          '}\n' +
          '\n' +
          '.tag:hover {\n' +
          '  background: gold;\n' +
          '  color: dimgray;\n' +
          '}',
        mode: 'preview',
        lang: 'css',
        previewHtml: '<p class="tag">新貨</p>',
        expectCode: ':hover',
        previewHeight: 160
      },
      quiz: [
        {
          type: 'mc',
          q: '想揀所有 class 叫 box 嘅標籤，選擇器要點寫？',
          options: ['box', '.box', '#box', '*box'],
          answer: 1,
          explain: 'class 選擇器前面加一點 .；加 # 就變成搵 id；就咁寫 box 就係搵一個叫 box 嘅標籤。'
        },
        {
          type: 'tf',
          q: '判斷：同一個網頁可以有兩個標籤用同一個 id。',
          answer: 1,
          explain: 'id 應該全份文件獨一無二。想幾個標籤共用同一套樣式，就應該用 class。'
        },
        {
          type: 'mc',
          q: 'h3, h4 { color: navy; } 呢句入面嘅逗號代表咩？',
          options: ['只揀 h3', 'h3 同 h4 都跟呢套設定', '只揀 h3 裏面嘅 h4', '語法錯誤'],
          answer: 1,
          explain: '逗號將幾個選擇器串成一群，同一套設定會套用到每一個，所以 h3 同 h4 都會變深藍色。'
        },
        {
          type: 'mc',
          q: '想只揀「.menu 裏面嘅 a 標籤」，要點寫？',
          options: ['.menu, a', '.menu a', 'a.menu', 'menu a'],
          answer: 1,
          explain: '空格代表「裏面」（後代關係）；逗號代表「兩者都要」。a.menu 係指一個本身有 class menu 嘅連結。'
        },
        {
          type: 'tf',
          q: '判斷：寫 .btn:hover 嘅時候，冒號前面唔可以加空格。',
          answer: 0,
          explain: '加了空格就變成「.btn 裏面嘅 :hover」，意思完全唔同，所以偽類要直接連住選擇器。'
        },
        {
          type: 'mc',
          q: '::before 同 ::after 一定要有邊個屬性先會顯示出嚟？',
          options: ['display', 'content', 'color', 'position'],
          answer: 1,
          explain: '偽標籤要靠 content 先會產生；就算冇文字內容，都要寫 content: ""; 先會出現。'
        },
        {
          type: 'mc',
          q: '以下邊個選擇器嘅優先次序最高？',
          options: ['p（標籤）', '.note（class）', '#note（id）', '*（全部）'],
          answer: 2,
          explain: 'id 大過 class，class 大過標籤，而 * 揀中所有標籤、優先次序最低。'
        },
        {
          type: 'tf',
          q: '判斷：選擇器一定要寫齊整條路徑先揀得中，唔可以只寫 class。',
          answer: 1,
          explain: '可以只寫 .note。寫得越具體（例如 .menu .note）就只揀某個範圍裏面嘅標籤，但唔一定要寫齊。'
        },
        {
          type: 'mc',
          q: 'p.warn 同 .warn 有咩分別？',
          options: [
            '完全一樣',
            'p.warn 只揀「本身係 p 而且有 class warn」嘅標籤',
            'p.warn 揀 p 裏面全部 .warn',
            'p.warn 係寫錯嘅'
          ],
          answer: 1,
          explain: '同一個選擇器連住寫（冇空格）代表「同時符合兩個條件」；中間有空格先代表「裏面」。'
        }
      ]
    }
,
    /* ================================================================
       s3：盒模型
       ================================================================ */
    {
      id: 's3',
      title: '盒模型',
      icon: '📦',
      summary: '每一個標籤都係一個盒：搞清 width / height、padding、border、margin 四層關係，同埋 box-sizing 嘅陷阱。',
      points: [
        {
          title: '盒模型係乜？先睇 width 同 height',
          analogy: '喺瀏覽器眼中，每一個標籤都是一個盒。好似外賣便當：飯同餸係內容，' +
            '飯同盒邊之間嘅空位係 padding，飯盒嘅膠邊係 border，兩個飯盒之間嘅距離係 margin。',
          code:
            '.box {\n' +
            '  width: 200px;\n' +
            '  height: 120px;\n' +
            '  background: aliceblue;\n' +
            '}',
          lang: 'css',
          preview: {
            html: '<div class="box">我係一個 200 x 120 嘅盒</div>',
            css:
              '.box {\n' +
              '  width: 200px;\n' +
              '  height: 120px;\n' +
              '  background: aliceblue;\n' +
              '}'
          },
          tip: 'width 同 height 講嘅係「內容區」嘅大細，未計 padding 同 border。' +
            '呢點好緊要，下一節嘅 box-sizing 就係講呢個陷阱。'
        },
        {
          title: 'padding：內容同邊框之間嘅空位',
          analogy: '好似便當盒分格：食物唔會貼死格邊，中間總要留少少空位，睇落先舒服。' +
            'padding 就係呢個空位，佢屬於盒嘅一部分，所以會撐大個盒。',
          code:
            '/* 四邊都 16px */\n' +
            '.pad {\n' +
            '  padding: 16px;\n' +
            '  background: lightyellow;\n' +
            '}\n' +
            '\n' +
            '/* 上下 8px、左右 24px */\n' +
            '.pad2 {\n' +
            '  padding: 8px 24px;\n' +
            '  background: honeydew;\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<p class="pad">上下左右都留 16px</p>\n' +
              '<p class="pad2">上下 8px、左右 24px</p>',
            css:
              '.pad { padding: 16px; background: lightyellow; }\n' +
              '.pad2 { padding: 8px 24px; background: honeydew; }'
          },
          tip: 'padding 一個值 = 四邊一樣；兩個值 = 上下、左右；四個值 = 上、右、下、左（順時針）。'
        },
        {
          title: 'border：幫個盒加一條邊框',
          analogy: '好似幫一幅畫加相框：畫嘅內容唔變，但外面多咗一條有粗細、有顏色、有款式嘅框。',
          code:
            '.frame {\n' +
            '  border: 3px solid teal;\n' +
            '  padding: 12px;\n' +
            '}\n' +
            '\n' +
            '.dash {\n' +
            '  border: 3px dashed chocolate;\n' +
            '  padding: 12px;\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<p class="frame">solid：實線框</p>\n' +
              '<p class="dash">dashed：虛線框</p>',
            css:
              '.frame { border: 3px solid teal; padding: 12px; }\n' +
              '.dash { border: 3px dashed chocolate; padding: 12px; }'
          },
          tip: '寫法係「粗細 款式 顏色」。款式常用 solid、dashed、dotted；' +
            '如果唔寫 border-style，就算寫咗粗細同顏色都唔會見到框。'
        },
        {
          title: 'margin 同 margin: 0 auto 水平居中',
          analogy: 'margin 好似兩張枱之間嘅走廊位：唔想兩張枱黐埋就要留位。' +
            '而 margin: 0 auto 好似把一張枱擺喺房嘅正中間——左右兩邊嘅空位由瀏覽器自動平均分。',
          code:
            '.center {\n' +
            '  width: 200px;\n' +
            '  margin: 0 auto;   /* 左右自動 = 水平居中 */\n' +
            '  background: aliceblue;\n' +
            '}',
          lang: 'css',
          preview: {
            html: '<div class="center">我喺正中間</div>',
            css:
              '.center {\n' +
              '  width: 200px;\n' +
              '  margin: 0 auto;\n' +
              '  background: aliceblue;\n' +
              '  padding: 8px;\n' +
              '}'
          },
          tip: 'margin: 0 auto 要配合固定 width 先有效。預設嘅 block 標籤本身撐滿一行，' +
            '左右冇空位可以分，就睇唔出居中效果。'
        },
        {
          title: 'box-sizing: border-box：唔想個盒無啦啦變肥',
          analogy: '好似訂造書枱：師傅問你「要幾闊」，你可以理解成「連兩邊櫃桶一齊計」，' +
            '也可以理解成「只計塊枱板」。預設係只計塊枱板，所以加咗櫃桶（padding 同 border）就會比你想要嘅闊。',
          code:
            '.a {\n' +
            '  width: 150px;\n' +
            '  padding: 20px;\n' +
            '  border: 5px solid darkgray;\n' +
            '  /* 預設 content-box：實際闊 = 150 + 20x2 + 5x2 = 200px */\n' +
            '}\n' +
            '\n' +
            '.b {\n' +
            '  box-sizing: border-box;\n' +
            '  width: 150px;\n' +
            '  padding: 20px;\n' +
            '  border: 5px solid darkgray;\n' +
            '  /* 實際闊就係 150px，padding 同 border 喺裏面扣 */\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<p class="a">預設：睇落闊 200px</p>\n' +
              '<p class="b">border-box：睇落闊 150px</p>',
            css:
              '.a { width: 150px; padding: 20px; border: 5px solid darkgray; background: mistyrose; }\n' +
              '.b { box-sizing: border-box; width: 150px; padding: 20px; border: 5px solid darkgray; background: honeydew; }'
          },
          tip: '實務做法：喺 CSS 最上面寫 *, *::before, *::after { box-sizing: border-box; }，' +
            '之後所有標籤嘅 width 就係「真實佔位」，唔使再自己加數。'
        }
      ],
      puzzle: {
        title: '練習 3：整一個有內距同邊框嘅盒',
        task: '預覽框入面已經有一個固定嘅盒 <code>&lt;div class="panel"&gt;我係一個告示板&lt;/div&gt;</code>。' +
          '喺編輯框寫 CSS，令 <code>.panel</code> 有 <code>200px</code> 闊、<code>16px</code> 內距、' +
          '<code>2px</code> 實線邊框、淺藍背景，再用 <code>margin: 0 auto</code> 令佢水平居中。',
        hint: '一定要寫 <code>width</code>，<code>margin: 0 auto</code> 先會有效。' +
          'border 嘅寫法係「粗細 款式 顏色」，例如 <code>2px solid teal</code>。',
        starter: '/* 喺下面寫你嘅 CSS */\n.panel {\n\n}\n',
        solution:
          '.panel {\n' +
          '  width: 200px;\n' +
          '  padding: 16px;\n' +
          '  border: 2px solid teal;\n' +
          '  background: lightcyan;\n' +
          '  margin: 0 auto;\n' +
          '}',
        mode: 'preview',
        lang: 'css',
        previewHtml: '<div class="panel">我係一個告示板</div>',
        expectCode: 'margin',
        previewHeight: 200
      },
      quiz: [
        {
          type: 'mc',
          q: '盒模型由內到外嘅次序係？',
          options: [
            '內容 → padding → border → margin',
            'margin → border → padding → 內容',
            'padding → 內容 → margin → border',
            'border → 內容 → padding → margin'
          ],
          answer: 0,
          explain: '最裏面係內容，跟住係 padding（內距）、border（邊框）、最外面係 margin（外距）。'
        },
        {
          type: 'mc',
          q: '文字同邊框之間嘅空位，係邊個屬性控制？',
          options: ['margin', 'padding', 'border', 'outline'],
          answer: 1,
          explain: 'padding 係盒裏面嘅空位，會撐大個盒；margin 係盒外面同其他標籤之間嘅距離。'
        },
        {
          type: 'tf',
          q: '判斷：margin 係盒外面嘅距離，padding 係盒裏面嘅空位。',
          answer: 0,
          explain: '記法：padding 有背景色（屬於盒），margin 冇背景色（盒外面）。'
        },
        {
          type: 'mc',
          q: '想令一個固定闊度嘅盒喺父層水平居中，要寫咩？',
          options: ['margin: 0 auto;', 'padding: 0 auto;', '只寫 text-align: center;', 'margin: auto 0;'],
          answer: 0,
          explain: 'margin: 0 auto 嘅 auto 會把剩餘空間平分到左右。text-align 只影響盒裏面嘅文字，唔會移動個盒。'
        },
        {
          type: 'mc',
          q: 'box-sizing: border-box 嘅效果係？',
          options: [
            'width 只計內容，padding 同 border 另外加',
            'width 連 padding 同 border 一齊計',
            '取消所有 border',
            '自動令個盒居中'
          ],
          answer: 1,
          explain: 'border-box 之下，padding 同 border 喺 width 裏面扣，所以寫幾多 px 就真係佔幾多 px。'
        },
        {
          type: 'tf',
          q: '判斷：一個 width: 200px 嘅盒加咗 20px padding，預設情況下總闊度會大過 200px。',
          answer: 0,
          explain: '預設係 content-box，200px 只計內容，左右各 20px padding 加上去，總闊就係 240px。'
        },
        {
          type: 'mc',
          q: '兩個上下相鄰嘅盒想分開遠啲，應該改邊個屬性？',
          options: ['padding', 'margin', 'font-size', 'width'],
          answer: 1,
          explain: '盒與盒之間嘅距離係 margin 控制；改 padding 只會令盒自己變大，兩者仍然貼住。'
        },
        {
          type: 'mc',
          q: '一個 width: 300px 嘅盒入面有一句好長嘅英文，預設會點？',
          options: [
            '內容想辦法喺 300px 內換行，太長嘅字會溢出',
            '瀏覽器自動把個盒加闊',
            '超出嘅內容會被刪走',
            '整句文字會縮細到啱位'
          ],
          answer: 0,
          explain: '盒嘅闊度唔會因為內容而自動變，文字會換行；如果係一個超長嘅英文字，就會溢出盒外。'
        },
        {
          type: 'tf',
          q: '判斷：padding: 10px; 代表四邊都係 10px。',
          answer: 0,
          explain: '寫一個值就四邊一樣；要分開就寫 padding: 10px 20px（上下、左右）或者四個值。'
        }
      ]
    },

    /* ================================================================
       s4：文字同顏色
       ================================================================ */
    {
      id: 's4',
      title: '文字同顏色',
      icon: '🔤',
      summary: '由 color 開始，學識揀字體、控制字級同粗細、設定對齊同行距，令文字睇得舒服。',
      points: [
        {
          title: 'color：改文字嘅顏色',
          analogy: 'color 好似揀一支筆寫字：同一個字，用紅色筆寫同用藍色筆寫，內容一樣但感覺完全唔同。',
          code:
            '.danger { color: darkred; }\n' +
            '.muted  { color: slategray; }\n' +
            '.brand  { color: teal; }',
          lang: 'css',
          preview: {
            html:
              '<p class="danger">注意：呢句係警告字</p>\n' +
              '<p class="muted">我呢句係次要資訊，用灰色</p>\n' +
              '<p class="brand">我呢句用品牌色</p>',
            css:
              '.danger { color: darkred; }\n' +
              '.muted { color: slategray; }\n' +
              '.brand { color: teal; }'
          },
          tip: '顏色有三種寫法：① 英文名（<code>red</code>、<code>navy</code>、<code>gold</code>）——最好讀，' +
            '初學先用這種；② 十六進位（<code>#b91c1c</code>）——真實專案最常用，但單看代碼唔知係咩色，' +
            '要用色板或者設計工具揀；③ <code>rgb(185, 28, 28)</code>——同 <code>#b91c1c</code> 係同一個深紅色。' +
            '寫英文名最易明、最易改，睇唔明嘅代碼就唔好用。'
        },
        {
          title: 'font-family：揀字體同寫定後備',
          analogy: '揀字體好似茶餐廳叫飲品：你叫「凍檸茶」，如果冇就問你「檸水得唔得」，再冇就「可樂」。' +
            'font-family 就係一路排落去嘅後備名單。',
          code:
            'body {\n' +
            '  font-family: "Microsoft JhengHei", "PingFang HK", sans-serif;\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<p class="a">我呢段用名單第一隻有嘅字體</p>\n' +
              '<p class="b">我呢段改用襯線字體（serif）</p>',
            css:
              '.a { font-family: "Microsoft JhengHei", "PingFang HK", sans-serif; }\n' +
              '.b { font-family: Georgia, serif; }'
          },
          tip: '字體名有空格就要用雙引號括住。最後一個一定要寫通用字體（sans-serif / serif / monospace）做後備，' +
            '因為唔係每部電腦都有你寫嘅字體。'
        },
        {
          title: 'font-size 同 font-weight：大細同粗細',
          analogy: '好似報紙嘅標題同內文：標題大字又粗，內文細字又正常。層次做出嚟，' +
            '讀者一眼就知邊樣重要。',
          code:
            'h2 {\n' +
            '  font-size: 28px;\n' +
            '  font-weight: 700;   /* 700 = 粗體 */\n' +
            '}\n' +
            '\n' +
            'p {\n' +
            '  font-size: 16px;\n' +
            '  font-weight: 400;   /* 400 = 正常 */\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<h2>我係又大又粗嘅標題</h2>\n' +
              '<p>我係正常粗細嘅內文</p>',
            css:
              'h2 { font-size: 28px; font-weight: 700; }\n' +
              'p { font-size: 16px; font-weight: 400; }'
          },
          tip: 'font-weight 用 100 至 900 嘅數字：400 係正常、700 係粗體，寫 bold 同 700 效果一樣。' +
            '字級用 rem 會跟隨用戶設定縮放，對閱讀體驗更好。'
        },
        {
          title: 'text-align 同 line-height：對齊同行距',
          analogy: 'text-align 好似把一疊紙靠左邊、靠右邊定擺中間；line-height 好似筆記簿嘅行距——' +
            '行距太窄，字黐埋一齊睇到頭痛。',
          code:
            '.center { text-align: center; }\n' +
            '\n' +
            '.read {\n' +
            '  font-size: 16px;\n' +
            '  line-height: 1.8;   /* 字級嘅 1.8 倍 */\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<p class="center">我呢句係居中嘅</p>\n' +
              '<p class="read">行距 1.8 嘅段落：行與行之間鬆動啲，' +
              '長段落睇落舒服好多。試下改成 1.2，就會覺得擠。</p>',
            css:
              '.center { text-align: center; }\n' +
              '.read { font-size: 16px; line-height: 1.8; }'
          },
          tip: 'line-height 最好寫冇單位嘅數字（例如 1.6），會自動跟隨 font-size 計算；' +
            '寫死 px 就唔會跟字級變。'
        },
        {
          title: 'letter-spacing 同 text-decoration：字距同裝飾線',
          analogy: 'letter-spacing 好似寫字時特登把每個字隔開少少，做標題好睇；' +
            'text-decoration 好似幫文字加底線或者刪除線，就好似改卷嗰陣畫嘅紅線。',
          code:
            '.title {\n' +
            '  letter-spacing: 4px;\n' +
            '}\n' +
            '\n' +
            '.done {\n' +
            '  text-decoration: line-through;\n' +
            '  color: darkgray;\n' +
            '}\n' +
            '\n' +
            'a {\n' +
            '  text-decoration: none;\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<p class="title">特別字距</p>\n' +
              '<p class="done">呢項已經做完</p>\n' +
              '<p><a href="#">我呢條連結冇底線</a></p>',
            css:
              '.title { letter-spacing: 4px; }\n' +
              '.done { text-decoration: line-through; color: darkgray; }\n' +
              'a { text-decoration: none; }'
          },
          tip: 'a 標籤預設有底線，所以好多人第一件事就寫 a { text-decoration: none; }。' +
            '但刪走底線之後，記得靠顏色或者 hover 效果令人睇得出可以撳。'
        }
      ],
      puzzle: {
        title: '練習 4：整一段易讀嘅文字',
        task: '預覽框有一句固定嘅 <code>&lt;p class="note"&gt;...&lt;/p&gt;</code>。喺編輯框寫 CSS，' +
          '令 <code>.note</code> 有 <code>18px</code> 字、行距 <code>1.8</code>、字距 <code>1px</code>、' +
          '深灰色文字（例如 <code>darkslategray</code>），同埋 <code>text-align: center</code> 居中。',
        hint: '用五個屬性：<code>font-size</code>、<code>line-height</code>、<code>letter-spacing</code>、' +
          '<code>color</code>、<code>text-align</code>。',
        starter: '/* 喺下面寫你嘅 CSS */\n.note {\n\n}\n',
        solution:
          '.note {\n' +
          '  font-size: 18px;\n' +
          '  line-height: 1.8;\n' +
          '  letter-spacing: 1px;\n' +
          '  color: darkslategray;\n' +
          '  text-align: center;\n' +
          '}',
        mode: 'preview',
        lang: 'css',
        previewHtml: '<p class="note">我係一段要慢慢讀嘅文字，行距鬆動啲會舒服好多。</p>',
        expectCode: 'line-height',
        previewHeight: 180
      },
      quiz: [
        {
          type: 'mc',
          q: '改文字顏色要用邊個屬性？',
          options: ['background-color', 'color', 'font-color', 'text-color'],
          answer: 1,
          explain: '文字顏色係 color；background-color 改嘅係標籤嘅背景色，兩個好容易撈亂。'
        },
        {
          type: 'mc',
          q: 'font-family 後面列咗幾個字體名，瀏覽器會點揀？',
          options: [
            '一次過用晒幾個',
            '由左至右揀第一個電腦有嘅',
            '最後一個最優先',
            '完全隨機'
          ],
          answer: 1,
          explain: '名單由左至右試，邊個有就用邊個；所以最後要放通用字體做後備。'
        },
        {
          type: 'tf',
          q: '判斷：font-weight: 700 同 font-weight: bold 效果大致相同。',
          answer: 0,
          explain: 'bold 就係 700 嘅關鍵字寫法。數字寫法可以揀 100 至 900，控制更細緻。'
        },
        {
          type: 'mc',
          q: 'line-height 係控制咩？',
          options: ['行與行之間嘅高度（行距）', '文字嘅粗細', '字同字之間嘅距離', '段落嘅闊度'],
          answer: 0,
          explain: 'line-height 係每一行嘅高度，直接影響段落嘅鬆緊；字同字之間嘅距離係 letter-spacing。'
        },
        {
          type: 'mc',
          q: '想段落裏面嘅文字居中，要寫咩？',
          options: ['text-align: center;', 'margin: 0 auto;', 'align: center;', 'text-center: yes;'],
          answer: 0,
          explain: 'text-align 控制盒裏面文字嘅對齊；margin: 0 auto 係移動整個盒，兩者用途唔同。'
        },
        {
          type: 'tf',
          q: '判斷：letter-spacing 係字同字之間嘅距離。',
          answer: 0,
          explain: 'letter-spacing 加值就會把每個字拉開，做標題或者按鈕文字時常用。'
        },
        {
          type: 'mc',
          q: '想刪走連結底部嘅底線，要寫咩？',
          options: ['text-decoration: none;', 'text-style: none;', 'underline: off;', 'border: none;'],
          answer: 0,
          explain: '連結嘅底線係 text-decoration: underline，改成 none 就會消失。'
        },
        {
          type: 'mc',
          q: 'font-size 用 rem 而唔用 px，主要好處係？',
          options: [
            '會跟隨根字級縮放，用戶改大細字時一齊變',
            '一定比 px 細',
            '唔可以再改',
            '只有手機支援'
          ],
          answer: 0,
          explain: 'rem 係相對單位，跟住 html 嘅字級計。用戶喺瀏覽器設定放大字體時，用 rem 嘅文字會一齊放大。'
        },
        {
          type: 'tf',
          q: '判斷：一段文字只可以設定一種字體，唔可以寫後備名單。',
          answer: 1,
          explain: '可以寫一整條名單，例如 "Microsoft JhengHei", "PingFang HK", sans-serif，瀏覽器會逐個試。'
        }
      ]
    }
,
    /* ================================================================
       s5：背景同外觀
       ================================================================ */
    {
      id: 's5',
      title: '背景同外觀',
      icon: '🌈',
      summary: '用 background-color、linear-gradient、border-radius、box-shadow 同 opacity，把平平無奇嘅方塊變成有質感嘅卡片。',
      points: [
        {
          title: 'background-color：幫標籤髹底色',
          analogy: '好似裝修時先髹一層底油：牆身（內容）唔變，但底色一改，整個空間嘅感覺就唔同。',
          code:
            '.note {\n' +
            '  background-color: lightyellow;\n' +
            '  padding: 12px;\n' +
            '}\n' +
            '\n' +
            '.dark {\n' +
            '  background-color: darkslategray;\n' +
            '  color: whitesmoke;\n' +
            '  padding: 12px;\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<p class="note">淺黃底：好似便利貼</p>\n' +
              '<p class="dark">深色底配淺色字：夜晚模式常用</p>',
            css:
              '.note { background-color: lightyellow; padding: 12px; }\n' +
              '.dark { background-color: darkslategray; color: whitesmoke; padding: 12px; }'
          },
          tip: 'background-color 可以簡寫成 background: lightyellow;。底色係喺文字後面，' +
            '深色底記得同時改 color，唔係會睇唔到字。'
        },
        {
          title: 'linear-gradient：漸層底色',
          analogy: '好似沖一杯凍檸茶：上面濃、下面淡，中間自然過渡。漸層就係由一種色慢慢變成另一種色，冇硬邊。',
          code:
            '.sky {\n' +
            '  background: linear-gradient(160deg, pink, lightblue);\n' +
            '  color: darkslategray;\n' +
            '  padding: 24px;\n' +
            '  border-radius: 12px;\n' +
            '}',
          lang: 'css',
          preview: {
            html: '<div class="sky">我係漸層背景</div>',
            css:
              '.sky {\n' +
              '  background: linear-gradient(160deg, pink, lightblue);\n' +
              '  color: darkslategray;\n' +
              '  padding: 24px;\n' +
              '  border-radius: 12px;\n' +
              '}'
          },
          tip: '第一個參數係方向：to right（由左到右）或者角度（0deg 由下到上、90deg 由左到右）。' +
            '後面最少寫兩種色，越多層次就越平滑。'
        },
        {
          title: 'border-radius：把方角剪成圓角',
          analogy: '好似用剪角器剪一張卡紙：剪得多就變成圓形，剪少少就係微微圓角。',
          code:
            '.card {\n' +
            '  border-radius: 16px;\n' +
            '  background: lightcyan;\n' +
            '  padding: 16px;\n' +
            '}\n' +
            '\n' +
            '.pill {\n' +
            '  border-radius: 999px;   /* 藥丸形按鈕 */\n' +
            '  background: teal;\n' +
            '  color: white;\n' +
            '  padding: 8px 18px;\n' +
            '}\n' +
            '\n' +
            '.circle {\n' +
            '  border-radius: 50%;     /* 正方形變圓形 */\n' +
            '  width: 72px;\n' +
            '  height: 72px;\n' +
            '  background: orange;\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<p class="card">16px 圓角</p>\n' +
              '<p class="pill">999px = 藥丸形按鈕</p>\n' +
              '<div class="circle">圓形</div>',
            css:
              '.card { border-radius: 16px; background: lightcyan; padding: 16px; }\n' +
              '.pill { border-radius: 999px; background: teal; color: white; padding: 8px 18px; }\n' +
              '.circle { border-radius: 50%; width: 72px; height: 72px; background: orange; }'
          },
          tip: 'border-radius: 50% 用喺正方形度就會變成正圓形。寫四個值可以逐個角控制，' +
            '例如 12px 0 12px 0（左上、右上、右下、左下）。'
        },
        {
          title: 'box-shadow：加陰影，令卡片升起',
          analogy: '好似把一張卡片由枱板拎起少少：卡片下面出現一層影，睇落有立體感，好似疊喺其他嘢上面。',
          code:
            '.card {\n' +
            '  background: white;\n' +
            '  padding: 16px;\n' +
            '  border-radius: 12px;\n' +
            '\n' +
            '  /* 語法：box-shadow: 左右偏移 上下偏移 模糊半徑 顏色; */\n' +
            '  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);\n' +
            '  /*            0    = 左右偏移（0 即係唔偏左唔偏右）\n' +
            '                6px  = 上下偏移（正數 = 影向下；負數 = 影向上）\n' +
            '                18px = 模糊半徑（越大越柔、越散）\n' +
            '                rgba(0, 0, 0, 0.15) = 影嘅顏色，最後 0.15 係透明度 */\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<div class="board">\n' +
              '  <div class="card">模糊 0px：影嘅邊緣好硬，似一塊板</div>\n' +
              '  <div class="card b8">模糊 8px：開始柔</div>\n' +
              '  <div class="card b18">模糊 18px：柔和，最常用</div>\n' +
              '  <div class="card b32">模糊 32px：散到好遠，似浮起好多</div>\n' +
              '</div>',
            css:
              '.board {\n' +
              '  background: whitesmoke;\n' +
              '  padding: 20px 18px 6px;\n' +
              '  border-radius: 12px;\n' +
              '}\n' +
              '.card {\n' +
              '  background: white;\n' +
              '  padding: 12px 16px;\n' +
              '  border-radius: 10px;\n' +
              '  margin-bottom: 20px;\n' +
              '  font-size: 14px;\n' +
              '  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.18);\n' +
              '}\n' +
              '.b8  { box-shadow: 0 6px 8px rgba(0, 0, 0, 0.18); }\n' +
              '.b18 { box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18); }\n' +
              '.b32 { box-shadow: 0 6px 32px rgba(0, 0, 0, 0.18); }'
          },
          tip: 'box-shadow 嘅次序係：左右偏移 → 上下偏移 → 模糊半徑 →（可選）擴散 → 顏色。\n' +
            '以 0 6px 18px rgba(0, 0, 0, 0.15) 為例：0 係唔偏左右、6px 係影向下 6px、' +
            '18px 係模糊半徑（越大越柔）、最後 rgba(0, 0, 0, 0.15) 就係「黑色、15% 透明」，' +
            '所以瞓落去只係一層淡淡嘅影。\n' +
            '想影再散開少少，可以喺模糊後面加擴散值，例如 0 6px 18px 2px rgba(0, 0, 0, 0.15)。' +
            '另外盡量用半透明嘅顏色而唔好用實心黑色，睇落自然好多。'
        },
        {
          title: 'opacity：整個標籤嘅透明程度',
          analogy: '好似磨砂玻璃：後面嘅嘢仍然見到，但淡淡地。opacity 越低，就越似隔住一層薄紗睇嘢。',
          code:
            '.half {\n' +
            '  opacity: 0.5;\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<p class="solid">opacity: 1（完全不透明）</p>\n' +
              '<p class="half">opacity: 0.5（半透明）</p>\n' +
              '<p class="ghost">opacity: 0.2（幾乎睇唔到）</p>',
            css:
              '.solid, .half, .ghost { background: teal; color: white; padding: 8px; }\n' +
              '.solid { opacity: 1; }\n' +
              '.half { opacity: 0.5; }\n' +
              '.ghost { opacity: 0.2; }'
          },
          tip: 'opacity 會影響成個標籤，連文字同邊框一齊變透明。想只係背景透明、文字照樣清楚，' +
            '就改用 <code>background: rgba(0, 128, 128, 0.2);</code>——前面三個數字係紅、綠、藍（' +
            '<code>0, 128, 128</code> 就係 teal 嗰隻藍綠色），最後 0.2 係透明度。'
        },
        {
          title: 'border 樣式：實線以外嘅選擇',
          analogy: '好似揀信封嘅邊框款式：有實線、有虛線、有點線，仲有雙線，用嚟表達唔同感覺。',
          code:
            '.a { border: 2px solid teal; }\n' +
            '.b { border: 2px dashed chocolate; }\n' +
            '.c { border: 2px dotted blueviolet; }\n' +
            '.d { border: 4px double crimson; }\n' +
            '\n' +
            '/* 只加左邊一條粗線，做引言條 */\n' +
            '.quote { border-left: 6px solid teal; }',
          lang: 'css',
          preview: {
            html:
              '<p class="a">solid 實線</p>\n' +
              '<p class="b">dashed 虛線</p>\n' +
              '<p class="c">dotted 點線</p>\n' +
              '<p class="d">double 雙線</p>\n' +
              '<p class="quote">只加左邊嘅引言條</p>',
            css:
              '.a, .b, .c, .d, .quote { padding: 8px; }\n' +
              '.a { border: 2px solid teal; }\n' +
              '.b { border: 2px dashed chocolate; }\n' +
              '.c { border: 2px dotted blueviolet; }\n' +
              '.d { border: 4px double crimson; }\n' +
              '.quote { border-left: 6px solid teal; }'
          },
          tip: 'border 可以只改一邊：border-top、border-right、border-bottom、border-left。' +
            '平嘅寫法會把四邊一次過蓋過，所以只改一邊嘅規則要寫喺後面。'
        }
      ],
      puzzle: {
        title: '練習 5：整一張有漸層嘅宣傳卡',
        task: '預覽框有固定嘅 <code>&lt;div class="promo"&gt;今日限定優惠&lt;/div&gt;</code>。寫 CSS 令佢有' +
          '漸層背景（例如 <code>linear-gradient(120deg, pink, lightblue)</code>，即係由粉紅色斜斜哋漸變到淺藍色）、' +
          '白色文字、<code>18px</code> 內距、<code>16px</code> 圓角，再加一層 <code>box-shadow</code>。',
        hint: '漸層寫 <code>background: linear-gradient(120deg, pink, lightblue);</code>（<code>120deg</code> ' +
          '係漸變方向，兩個顏色名就係起點同終點）；' +
          '陰影寫 <code>box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);</code>（黑色、15% 透明）。',
        starter: '/* 喺下面寫你嘅 CSS */\n.promo {\n\n}\n',
        solution:
          '.promo {\n' +
          '  background: linear-gradient(120deg, pink, lightblue);\n' +
          '  color: white;\n' +
          '  padding: 18px;\n' +
          '  border-radius: 16px;\n' +
          '  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);\n' +
          '}',
        mode: 'preview',
        lang: 'css',
        previewHtml: '<div class="promo">今日限定優惠</div>',
        expectCode: 'linear-gradient',
        previewHeight: 200
      },
      quiz: [
        {
          type: 'mc',
          q: '想一個標籤有淺黃色底，要寫咩？',
          options: ['color: lightyellow;', 'background-color: lightyellow;', 'bg-color: lightyellow;', 'fill: lightyellow;'],
          answer: 1,
          explain: '底色係 background-color；color 改嘅係文字顏色，兩者好容易撈亂。'
        },
        {
          type: 'mc',
          q: 'linear-gradient(90deg, red, blue) 出嚟嘅效果係？',
          options: ['由左至右紅色漸變去藍色', '由上至下紅色漸變去藍色', '紅色同藍色嘅格仔', '只有紅色'],
          answer: 0,
          explain: '90deg 代表漸層方向由左去右；0deg 係由下到上，180deg 就係由上到下。'
        },
        {
          type: 'tf',
          q: '判斷：border-radius: 50% 用喺一個正方形標籤度，會變成圓形。',
          answer: 0,
          explain: '50% 代表每個角都變成半徑一半嘅圓弧，正方形四邊相等，合埋就係正圓。'
        },
        {
          type: 'mc',
          q: 'box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15)（黑色、15% 透明）入面，18px 代表咩？',
          options: ['左右偏移', '上下偏移', '模糊半徑（越柔越散）', '顏色深淺'],
          answer: 2,
          explain: '次序係：左右偏移、上下偏移、模糊半徑、顏色。所以 0 係左右偏移、6px 係上下偏移、' +
            '18px 係模糊半徑（越大越柔）。'
        },
        {
          type: 'mc',
          q: '想個陰影嘅邊緣更柔、更散，應該改 box-shadow 邊一個值？',
          options: ['第三個值（模糊半徑）', '第一個值（左右偏移）', '顏色嘅 alpha 值', 'border-radius'],
          answer: 0,
          explain: '第三個值係模糊半徑：0px 會見到硬邊，18px 已經好柔，32px 就更散。' +
            '改 alpha（例如 0.15 變 0.5）只會令影變深色／明顯，唔會令邊緣變柔。'
        },
        {
          type: 'mc',
          q: '設定 opacity: 0.5 之後，個標籤會點？',
          options: ['變成半透明', '文字變粗', '顏色變深', '完全冇變化'],
          answer: 0,
          explain: 'opacity 由 0（全透明）到 1（不透明），0.5 就係一半透明。'
        },
        {
          type: 'tf',
          q: '判斷：opacity 會同時影響標籤嘅背景同文字。',
          answer: 0,
          explain: 'opacity 係整個標籤一齊變透明。想只背景透明，就要用 rgba() 嘅背景色。'
        },
        {
          type: 'mc',
          q: '想只加一條左邊嘅粗線做引言條，要寫咩？',
          options: ['border-left: 6px solid teal;', 'border: left 6px solid;', 'left-border: 6px;', 'border-side: left;'],
          answer: 0,
          explain: 'border-left 係單邊嘅簡寫，格式同 border 一樣：粗細、款式、顏色。'
        },
        {
          type: 'mc',
          q: '以下邊個係虛線邊框嘅款式？',
          options: ['solid', 'dashed', 'dotted', 'double'],
          answer: 1,
          explain: 'dashed 係一段段嘅虛線，dotted 係一點點嘅點線，double 係雙線。'
        },
        {
          type: 'mc',
          q: '想一個標籤有 12px 圓角，要寫咩？',
          options: ['border-radius: 12px;', 'radius: 12px;', 'corner: 12px;', 'border: radius 12px;'],
          answer: 0,
          explain: '圓角係 border-radius，寫一個值就四個角一樣。'
        }
      ]
    },

    /* ================================================================
       s6：display 同版面流
       ================================================================ */
    {
      id: 's6',
      title: 'display 同版面流',
      icon: '🧱',
      summary: '搞清楚 block、inline、inline-block、none 四種顯示方式，同埋 max-width、overflow、cursor 嘅實際用途。',
      points: [
        {
          title: 'display: block：自己霸一行',
          analogy: '好似一幢幢樓：每幢都係獨立，一幢霸一個位，唔會同隔籬嗰幢排埋一齊。' +
            'div、p、h1 預設就係 block。',
          code:
            '.block {\n' +
            '  display: block;\n' +
            '  background: aliceblue;\n' +
            '  padding: 8px;\n' +
            '  margin-bottom: 6px;\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<div class="block">方塊一：我自己佔一整行</div>\n' +
              '<div class="block">方塊二：所以我會喺下一行</div>',
            css:
              '.block {\n' +
              '  display: block;\n' +
              '  background: aliceblue;\n' +
              '  padding: 8px;\n' +
              '  margin-bottom: 6px;\n' +
              '}'
          },
          tip: 'block 標籤可以設定 width 同 height，而且預設由左邊開始、獨佔一行。'
        },
        {
          title: 'display: inline：同一行一個跟一個',
          analogy: '好似地鐵月台排隊：一個跟一個企喺同一條線度，隊伍有幾長就幾長，' +
            '唔可以由你話事去設定佢嘅闊度。',
          code:
            '.tag {\n' +
            '  display: inline;\n' +
            '  background: honeydew;\n' +
            '  padding: 4px 10px;\n' +
            '}\n' +
            '\n' +
            '/* 喺 inline 標籤寫 width: 200px; 係唔會生效嘅 */',
          lang: 'css',
          preview: {
            html:
              '<span class="tag">標籤一</span>\n' +
              '<span class="tag">標籤二</span>\n' +
              '<span class="tag">標籤三</span>\n' +
              '<div>上面三個 span 排喺同一行，因為 span 預設係行內。</div>',
            css:
              '.tag { display: inline; background: honeydew; padding: 4px 10px; }'
          },
          tip: 'inline 標籤設定 width 同 height 係冇效嘅。想控制大細，就要改成 inline-block 或者 block。'
        },
        {
          title: 'display: inline-block：並排得嚟又可以設定大細',
          analogy: '好似茶餐廳嘅卡位：幾張卡位可以並排一行，但每張卡位本身有固定大細，' +
            '唔會被擠到變形。',
          code:
            '.card {\n' +
            '  display: inline-block;\n' +
            '  width: 120px;\n' +
            '  padding: 12px;\n' +
            '  background: lightyellow;\n' +
            '  margin: 4px;\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<div class="card">卡位一</div>\n' +
              '<div class="card">卡位二</div>\n' +
              '<div class="card">卡位三</div>',
            css:
              '.card {\n' +
              '  display: inline-block;\n' +
              '  width: 120px;\n' +
              '  padding: 12px;\n' +
              '  background: lightyellow;\n' +
              '  margin: 4px;\n' +
              '}'
          },
          tip: 'inline-block 係「並排 + 可以設定大細」嘅組合，做按鈕或者一排卡片好常用。' +
            '而家做一整排卡片，多數會用 Flexbox（最後一章會講）。'
        },
        {
          title: 'display: none：索性收埋唔顯示',
          analogy: '好似舖頭落閘：唔單止見唔到，連個位都唔會霸住，後面嘅嘢會自動補上。',
          code:
            '.hide {\n' +
            '  display: none;\n' +
            '}\n' +
            '\n' +
            '/* 對比：visibility: hidden; 會隱形，但仍然霸住個位 */',
          lang: 'css',
          preview: {
            html:
              '<p>第一行：你一定見到</p>\n' +
              '<p class="hide">第二行：我 display: none，完全消失</p>\n' +
              '<p>第三行：我補上第二行嘅位置</p>',
            css: '.hide { display: none; }'
          },
          tip: 'display: none 同 visibility: hidden 唔同：前者連位都唔佔，後者隱形但保留空間。'
        },
        {
          title: 'max-width 同 overflow：控制最闊同溢出',
          analogy: '好似一個水杯：max-width 係「最多裝到咁多」，倒多過頭水就會瀉出嚟——' +
            'overflow 就話你知溢出嘅水點處理（切走、出捲軸、定係照流出嚟）。',
          code:
            '.wrap {\n' +
            '  max-width: 320px;\n' +
            '  height: 60px;\n' +
            '  padding: 8px;\n' +
            '  border: 2px solid darkgray;\n' +
            '  overflow: auto;\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<div class="wrap">max-width 令個盒最闊 320px，窄過 320px 嘅時候會自動縮細，' +
              '所以手機度都唔會爆版。呢句文字刻意寫長啲，令內容高度超過 60px，' +
              '於是 overflow: auto 就會出捲軸。</div>',
            css:
              '.wrap {\n' +
              '  max-width: 320px;\n' +
              '  height: 60px;\n' +
              '  padding: 8px;\n' +
              '  border: 2px solid darkgray;\n' +
              '  overflow: auto;\n' +
              '}'
          },
          tip: 'overflow 常用值：visible（預設，照流出嚟）、hidden（切走）、auto（有需要先出捲軸）、' +
            'scroll（一定出捲軸）。'
        },
        {
          title: 'cursor：話畀用戶知呢度可以撳',
          analogy: '好似商場嘅指示牌：撳得嘅掣，滑鼠移過去會變成手指公；唔撳得嘅會顯示禁止符號，' +
            '用戶未撳之前就知。',
          code:
            '.btn {\n' +
            '  cursor: pointer;\n' +
            '  background: teal;\n' +
            '  color: white;\n' +
            '  padding: 8px 16px;\n' +
            '  border-radius: 6px;\n' +
            '}\n' +
            '\n' +
            '.locked {\n' +
            '  cursor: not-allowed;\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<p class="btn">滑鼠移過我：會變手指</p>\n' +
              '<p class="locked">滑鼠移過我：會變禁止符號</p>',
            css:
              '.btn { cursor: pointer; background: teal; color: white; padding: 8px 16px; border-radius: 6px; }\n' +
              '.locked { cursor: not-allowed; background: gainsboro; padding: 8px 16px; border-radius: 6px; }'
          },
          tip: 'cursor 只係一個「提示」，唔會令標籤真的可以撳。真正嘅點擊反應要靠連結、按鈕或者 JavaScript。'
        }
      ],
      puzzle: {
        title: '練習 6：用 inline-block 排一排卡片',
        task: '預覽框有三個固定嘅 <code>&lt;div class="chip"&gt;...&lt;/div&gt;</code>（div 預設會各霸一行）。' +
          '喺編輯框寫 CSS，令 <code>.chip</code> 用 <code>display: inline-block</code>、' +
          '闊 <code>100px</code>、<code>12px</code> 內距、淺綠背景、<code>8px</code> 圓角，' +
          '令佢哋並排成一行。',
        hint: '關鍵係 <code>display: inline-block;</code>；唔寫嘅話每個 div 都會霸一整行。',
        starter: '/* 喺下面寫你嘅 CSS */\n.chip {\n\n}\n',
        solution:
          '.chip {\n' +
          '  display: inline-block;\n' +
          '  width: 100px;\n' +
          '  padding: 12px;\n' +
          '  background: honeydew;\n' +
          '  border-radius: 8px;\n' +
          '  margin: 4px;\n' +
          '}',
        mode: 'preview',
        lang: 'css',
        previewHtml:
          '<div class="chip">卡片一</div>\n' +
          '<div class="chip">卡片二</div>\n' +
          '<div class="chip">卡片三</div>',
        expectCode: 'inline-block',
        previewHeight: 200
      },
      quiz: [
        {
          type: 'mc',
          q: '以下邊個標籤預設係 block？',
          options: ['span', 'a', 'div', 'img'],
          answer: 2,
          explain: 'div、p、h1 呢類係 block；span、a、img、strong 就係 inline。'
        },
        {
          type: 'mc',
          q: 'div 同 span 最大嘅分別係？',
          options: [
            'div 係 block（霸一行），span 係 inline（同一行排）',
            'div 唔可以加 class',
            'span 唔可以放文字',
            '兩者完全一樣'
          ],
          answer: 0,
          explain: 'div 預設獨佔一行，用嚟做區塊；span 預設行內，用嚟括住一小段文字做樣式。'
        },
        {
          type: 'tf',
          q: '判斷：喺一個 display: inline 嘅標籤度寫 width: 200px; 會生效。',
          answer: 1,
          explain: 'inline 標籤唔接受 width 同 height。要設定大細，就要改成 inline-block 或者 block。'
        },
        {
          type: 'mc',
          q: '想幾張卡片並排一行，而且每張都可以設定固定闊度，要用邊個？',
          options: ['display: inline;', 'display: inline-block;', 'display: none;', 'display: block;'],
          answer: 1,
          explain: 'inline-block 同時有「並排」同「可以設定大細」兩個特性，最適合做一排卡片。'
        },
        {
          type: 'mc',
          q: 'display: none 同 visibility: hidden 有咩分別？',
          options: [
            '完全一樣',
            'display: none 連位都唔佔，visibility: hidden 保留原本空間',
            'visibility: hidden 會刪除標籤',
            'display: none 只影響文字'
          ],
          answer: 1,
          explain: 'display: none 令標籤完全退出排版，後面嘅內容會補上；visibility: hidden 只係隱形，位置仍然留住。'
        },
        {
          type: 'tf',
          q: '判斷：max-width 令個盒最闊唔超過指定值，容器窄嘅時候會自動縮細。',
          answer: 0,
          explain: '所以做響應式排版時，用 max-width 比寫死 width 好，唔會喺手機度溢出。'
        },
        {
          type: 'mc',
          q: '內容超出盒嘅大細，想自動出捲軸，要寫咩？',
          options: ['overflow: auto;', 'overflow: bigger;', 'scroll: yes;', 'max-width: auto;'],
          answer: 0,
          explain: 'overflow: auto 係有需要先出捲軸；scroll 就一定會出，就算內容夠位都出。'
        },
        {
          type: 'mc',
          q: 'cursor: pointer 嘅作用係？',
          options: [
            '滑鼠移過去變成手指，提示用戶可以撳',
            '令標籤自動變成可點擊',
            '改文字顏色',
            '加陰影'
          ],
          answer: 0,
          explain: 'cursor 只係外觀提示，唔會令標籤真的可以撳；實際反應要另外寫。'
        },
        {
          type: 'tf',
          q: '判斷：block 標籤同 inline 標籤可以透過 display 屬性互換。',
          answer: 0,
          explain: '例如 span { display: block; } 就會令 span 變成霸一整行嘅區塊。'
        }
      ]
    }
,
    /* ================================================================
       s7：定位 position
       ================================================================ */
    {
      id: 's7',
      title: '定位 position',
      icon: '📍',
      summary: '一次過搞清楚 static、relative、absolute、fixed、sticky，同埋 top / left / z-index 點用。',
      points: [
        {
          title: 'position: static：預設嘅排版方式',
          analogy: '好似戲院劃位：你買咗第 5 行第 8 座，就乖乖坐喺度，唔可以自己搬位。' +
            '標籤預設就係咁，順住文件次序由上到下排。',
          code:
            '.box {\n' +
            '  position: static;   /* 預設值，唔寫都一樣 */\n' +
            '  background: aliceblue;\n' +
            '  padding: 8px;\n' +
            '  margin-bottom: 6px;\n' +
            '}\n' +
            '\n' +
            '/* 喺 static 標籤寫 top / left 係冇效嘅 */',
          lang: 'css',
          preview: {
            html:
              '<div class="box">方塊一：正常排喺上面</div>\n' +
              '<div class="box">方塊二：順住落</div>',
            css:
              '.box { position: static; background: aliceblue; padding: 8px; margin-bottom: 6px; }'
          },
          tip: 'static 標籤寫 top、left、z-index 都會被忽略。想用呢三個屬性，' +
            '就要先把 position 改成 relative、absolute、fixed 或者 sticky。'
        },
        {
          title: 'position: relative：微調位置，原位仍然留住',
          analogy: '好似把枱上嘅文件輕輕推右 10 毫米：文件移咗位，但原本嗰格空間仍然留白，' +
            '唔會被其他文件佔用。',
          code:
            '.box {\n' +
            '  position: relative;\n' +
            '  top: 10px;     /* 由原本位置向下推 10px */\n' +
            '  left: 20px;    /* 向右推 20px */\n' +
            '  background: lightyellow;\n' +
            '  padding: 8px;\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<p>上面係一句正常文字</p>\n' +
              '<div class="box">我用 relative 推落 10px、推右 20px</div>\n' +
              '<p>留意：原本嗰格空間仍然留住，所以呢句冇貼上嚟</p>',
            css:
              '.box { position: relative; top: 10px; left: 20px; background: lightyellow; padding: 8px; }'
          },
          tip: 'relative 有兩個用途：微調自己嘅位置，同埋做 absolute 子標籤嘅「定位父層」（下一節就講）。'
        },
        {
          title: 'position: absolute + relative 父層：把標籤釘喺盒裏面',
          analogy: '好似喺便當盒裏面貼一張貼紙：貼紙嘅位置係「離盒邊 8 毫米」，所以你連盒一齊搬，' +
            '貼紙都跟住走。如果個盒冇設 position: relative，貼紙就會以整份文件做基準，亂咁飛。',
          code:
            '.card {\n' +
            '  position: relative;   /* 做定位父層 */\n' +
            '  height: 90px;\n' +
            '  background: lightcyan;\n' +
            '}\n' +
            '\n' +
            '.badge {\n' +
            '  position: absolute;\n' +
            '  top: 8px;\n' +
            '  right: 8px;\n' +
            '  background: crimson;\n' +
            '  color: white;\n' +
            '}',
          lang: 'css',
          preview: {
            html: '<div class="card">我係「定位父層」<span class="badge">NEW</span></div>',
            css:
              '.card { position: relative; height: 90px; background: lightcyan; padding: 8px; }\n' +
              '.badge { position: absolute; top: 8px; right: 8px; background: crimson; color: white; padding: 2px 8px; border-radius: 6px; }'
          },
          tip: '口訣：子標籤寫 absolute，父標籤就寫 relative。absolute 標籤會離開原本嘅排版流，' +
            '唔會霸位，其他標籤會當佢唔存在。'
        },
        {
          title: 'position: fixed：貼死喺視窗，捲極都唔走',
          analogy: '好似茶餐廳牆上嘅鐘：你點樣行、枱點樣搬，個鐘都係釘死喺同一格牆。' +
            'fixed 標籤係以瀏覽器視窗做基準，唔係以文件做基準。',
          code:
            '.topbar {\n' +
            '  position: fixed;\n' +
            '  top: 0;\n' +
            '  left: 0;\n' +
            '  right: 0;          /* 左右都貼邊，就係全闊 */\n' +
            '  background: teal;\n' +
            '  color: white;\n' +
            '  padding: 10px;\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<div class="topbar">我係貼死喺上面嘅工具列</div>\n' +
              '<p>下面係普通內容，你可以捲動預覽框，見到我唔會跟住走。</p>\n' +
              '<p>內容第二行……</p>\n' +
              '<p>內容第三行……</p>\n' +
              '<p>內容第四行……</p>',
            css:
              '.topbar { position: fixed; top: 0; left: 0; right: 0; background: teal; color: white; padding: 10px; }'
          },
          tip: 'fixed 標籤完全離開排版流，所以要自己留位：通常會喺最上面嘅內容加 padding-top，' +
            '唔係第一段就會被條 bar 蓋住。'
        },
        {
          title: 'position: sticky：捲到某個位就黏住',
          analogy: '好似超市貨架嘅分類牌：平時跟住貨架行，但當你捲到佢嗰個位，就會黏住喺頂，' +
            '一直到貨架行完為止。',
          code:
            '.head {\n' +
            '  position: sticky;\n' +
            '  top: 0;             /* 捲到最上面就黏住 */\n' +
            '  background: khaki;\n' +
            '  padding: 8px;\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<div class="head">捲動預覽框，我會黏喺最上面</div>\n' +
              '<p>內容一</p>\n' +
              '<p>內容二</p>\n' +
              '<p>內容三</p>\n' +
              '<p>內容四</p>\n' +
              '<p>內容五</p>',
            css:
              '.head { position: sticky; top: 0; background: khaki; padding: 8px; }'
          },
          tip: 'sticky 一定要寫 top（或者 bottom / left / right），唔寫就同 static 一樣。' +
            '另外父層唔可以設定 overflow: hidden，否則會黏唔住。'
        },
        {
          title: 'top / left / z-index：邊個方向、邊個喺上面',
          analogy: 'top / left 好似喺地圖上講「由邊度出發，行幾多」；z-index 好似疊報紙：' +
            '號碼大嘅放最上面，可以蓋住號碼細嘅。',
          code:
            '.stage {\n' +
            '  position: relative;\n' +
            '}\n' +
            '\n' +
            '.a {\n' +
            '  position: absolute;\n' +
            '  top: 10px;\n' +
            '  left: 10px;\n' +
            '  z-index: 2;      /* 喺上面 */\n' +
            '}\n' +
            '\n' +
            '.b {\n' +
            '  position: absolute;\n' +
            '  top: 34px;\n' +
            '  left: 40px;\n' +
            '  z-index: 1;      /* 喺下面，會被蓋住 */\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<div class="stage">\n' +
              '  <div class="a">A（z-index: 2）</div>\n' +
              '  <div class="b">B（z-index: 1）</div>\n' +
              '</div>',
            css:
              '.stage { position: relative; height: 100px; background: whitesmoke; }\n' +
              '.a { position: absolute; top: 10px; left: 10px; z-index: 2; background: teal; color: white; padding: 8px; }\n' +
              '.b { position: absolute; top: 34px; left: 40px; z-index: 1; background: orange; padding: 8px; }'
          },
          tip: 'z-index 只對設定咗 position（非 static）嘅標籤有效，冇寫就當係 0；' +
            '同一個父層之下，數字大嘅會蓋住數字細嘅。'
        }
      ],
      puzzle: {
        title: '練習 7：把小標記釘喺卡片右上角',
        task: '預覽框有固定嘅 <code>&lt;div class="card"&gt;我係一張卡片&lt;span class="badge"&gt;NEW&lt;/span&gt;&lt;/div&gt;</code>。' +
          '寫 CSS：令 <code>.card</code> 成為定位父層（<code>position: relative</code>、高 <code>90px</code>、淺藍背景），' +
          '再令 <code>.badge</code> 用 <code>position: absolute</code> 釘喺右上角（<code>top: 8px; right: 8px</code>），' +
          '加上紅色背景同白色文字。',
        hint: '<code>.card</code> 一定要寫 <code>position: relative;</code>。唔寫嘅話 <code>.badge</code> ' +
          '會以整份文件做基準，飛到好遠。',
        starter: '/* 喺下面寫你嘅 CSS */\n.card {\n\n}\n\n.badge {\n\n}\n',
        solution:
          '.card {\n' +
          '  position: relative;\n' +
          '  height: 90px;\n' +
          '  background: lightcyan;\n' +
          '  padding: 8px;\n' +
          '}\n' +
          '\n' +
          '.badge {\n' +
          '  position: absolute;\n' +
          '  top: 8px;\n' +
          '  right: 8px;\n' +
          '  background: crimson;\n' +
          '  color: white;\n' +
          '  padding: 2px 8px;\n' +
          '  border-radius: 6px;\n' +
          '}',
        mode: 'preview',
        lang: 'css',
        previewHtml: '<div class="card">我係一張卡片<span class="badge">NEW</span></div>',
        expectCode: 'absolute',
        previewHeight: 220
      },
      quiz: [
        {
          type: 'mc',
          q: '標籤預設嘅 position 值係邊個？',
          options: ['static', 'relative', 'absolute', 'fixed'],
          answer: 0,
          explain: '所有標籤一開始都係 static，即係乖乖跟住文件次序排，top / left 對佢冇作用。'
        },
        {
          type: 'mc',
          q: '想 absolute 子標籤以「父層盒」做基準定位，父層應該寫咩？',
          options: ['position: relative;', 'position: static;', 'display: block;', 'overflow: hidden;'],
          answer: 0,
          explain: 'absolute 會搵最近一個「有設定 position（非 static）」嘅祖先做基準；冇就搵整份文件。'
        },
        {
          type: 'tf',
          q: '判斷：標籤用 relative 搬位之後，原本嘅位置會留空。',
          answer: 0,
          explain: 'relative 只係視覺上偏移，原本佔嘅空間仍然留住，唔會影響其他標籤嘅排位。'
        },
        {
          type: 'mc',
          q: '邊個值會令標籤貼住瀏覽器視窗，捲動都唔走？',
          options: ['static', 'relative', 'fixed', 'sticky'],
          answer: 2,
          explain: 'fixed 以視窗做基準，所以捲動時位置唔變；sticky 要捲到指定位置先會黏住。'
        },
        {
          type: 'mc',
          q: 'position: sticky 要配合咩先會黏住？',
          options: [
            'top（或者 left / right / bottom）',
            'display: flex',
            'z-index: 0',
            'overflow: visible'
          ],
          answer: 0,
          explain: '冇寫黏住嘅臨界位置，sticky 同 static 冇分別；通常會寫 top: 0;。'
        },
        {
          type: 'tf',
          q: '判斷：absolute 標籤會離開原本嘅排版流，唔會霸住原本嘅位。',
          answer: 0,
          explain: '所以 absolute 常用嚟做小標記、關閉掣呢類「疊喺其他內容上面」嘅小標籤。'
        },
        {
          type: 'mc',
          q: '兩個 absolute 標籤疊埋一齊，想 A 喺上面，可以點做？',
          options: [
            'A 嘅 z-index 寫大過 B',
            'A 加 margin-top',
            'A 改成 position: static',
            '冇辦法控制'
          ],
          answer: 0,
          explain: '同一層之下 z-index 大嘅喺上面；如果兩個都冇寫 z-index，就會按 HTML 出現嘅先後決定。'
        },
        {
          type: 'mc',
          q: '一個 absolute 標籤想距離父層左邊 10px、上邊 20px，要寫咩？',
          options: ['left: 10px; top: 20px;', 'top: 10px; left: 20px;', 'margin: 20px 10px; 就夠', 'padding: 10px 20px;'],
          answer: 0,
          explain: 'left 管距離左邊幾多，top 管距離上面幾多，兩者係獨立嘅。'
        },
        {
          type: 'tf',
          q: '判斷：一個 position: static 嘅標籤寫 z-index 會生效。',
          answer: 1,
          explain: 'z-index 只對非 static 嘅定位標籤有效，所以要先把 position 改成 relative 之類。'
        }
      ]
    },

    /* ================================================================
       s8：Flexbox 同響應式
       ================================================================ */
    {
      id: 's8',
      title: 'Flexbox 同響應式',
      icon: '🧩',
      summary: '用 display: flex 一行搞定排版，再用 @media 媒體查詢令同一個網頁喺手機同電腦都睇得順。',
      points: [
        {
          title: 'display: flex + flex-direction：一排定一棟',
          analogy: 'display: flex 好似把幾個標籤放上地鐵月台排隊，父層做隊長發號施令。' +
            'flex-direction 就決定條隊係「橫向一排」定係「由上到下直排」。',
          code:
            '.row {\n' +
            '  display: flex;\n' +
            '  flex-direction: row;      /* 預設：橫向一排 */\n' +
            '}\n' +
            '\n' +
            '.col {\n' +
            '  display: flex;\n' +
            '  flex-direction: column;   /* 由上到下直排 */\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<div class="row">\n' +
              '  <div class="item">1</div>\n' +
              '  <div class="item">2</div>\n' +
              '  <div class="item">3</div>\n' +
              '</div>\n' +
              '<div class="col">\n' +
              '  <div class="item">A</div>\n' +
              '  <div class="item">B</div>\n' +
              '</div>',
            css:
              '.row { display: flex; flex-direction: row; gap: 8px; margin-bottom: 10px; }\n' +
              '.col { display: flex; flex-direction: column; gap: 8px; width: 120px; }\n' +
              '.item { background: aliceblue; padding: 8px 14px; text-align: center; }'
          },
          tip: 'display: flex 係寫喺「父層容器」度，唔係逐個小朋友寫。小朋友會自動並排，' +
            '唔使再用 inline-block。'
        },
        {
          title: 'justify-content：主軸方向點分配空位',
          analogy: '好似一排人等入場：可以全部靠左企、靠右企、擺中間，或者平均分開企。' +
            'justify-content 就係話畀瀏覽器知你想點企。',
          code:
            '.a { display: flex; justify-content: flex-start; }\n' +
            '.b { display: flex; justify-content: center; }\n' +
            '.c { display: flex; justify-content: space-between; }',
          lang: 'css',
          preview: {
            html:
              '<div class="a"><span class="box">1</span><span class="box">2</span></div>\n' +
              '<div class="b"><span class="box">1</span><span class="box">2</span></div>\n' +
              '<div class="c"><span class="box">1</span><span class="box">2</span></div>',
            css:
              '.a, .b, .c { display: flex; margin-bottom: 8px; gap: 4px; }\n' +
              '.a { justify-content: flex-start; }\n' +
              '.b { justify-content: center; }\n' +
              '.c { justify-content: space-between; }\n' +
              '.box { background: lightyellow; padding: 6px 12px; }'
          },
          tip: '常用值：flex-start（靠開頭）、center（居中）、flex-end（靠尾）、' +
            'space-between（兩頭貼邊、中間平均）、space-around（每件左右各留半份空位）。'
        },
        {
          title: 'align-items：交叉軸方向點對齊',
          analogy: '好似一排人身高唔同：可以個個貼住天花板、個個貼住地板，或者全部腳踏同一條中線。' +
            'align-items 就係控制呢條「交叉方向」嘅對齊。',
          code:
            '.a {\n' +
            '  display: flex;\n' +
            '  align-items: flex-start;   /* 貼頂 */\n' +
            '  height: 80px;\n' +
            '}\n' +
            '\n' +
            '.b {\n' +
            '  display: flex;\n' +
            '  align-items: center;       /* 垂直居中 */\n' +
            '  height: 80px;\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<div class="a"><span class="tall">高</span><span class="short">矮</span></div>\n' +
              '<div class="b"><span class="tall">高</span><span class="short">矮</span></div>',
            css:
              '.a, .b { display: flex; height: 70px; gap: 8px; border: 1px dashed darkgray; margin-bottom: 8px; }\n' +
              '.a { align-items: flex-start; }\n' +
              '.b { align-items: center; }\n' +
              '.tall { background: lightblue; padding: 18px 10px; }\n' +
              '.short { background: khaki; padding: 6px 10px; }'
          },
          tip: '記法：flex-direction: row 嗰陣，justify-content 管左右、align-items 管上下；' +
            '改成 column 之後就掉轉。'
        },
        {
          title: 'gap 同 flex-wrap：留空位同自動換行',
          analogy: 'gap 好似貨架度每件貨之間留嘅空位；flex-wrap 好似超市貨架——' +
            '一行擺唔落就自動擺落第二行，唔會夾硬擠到變形。',
          code:
            '.wrap {\n' +
            '  display: flex;\n' +
            '  flex-wrap: wrap;   /* 一行唔夠位就換行 */\n' +
            '  gap: 10px;         /* 每件之間留 10px */\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<div class="wrap">\n' +
              '  <div class="chip">貨品一</div>\n' +
              '  <div class="chip">貨品二</div>\n' +
              '  <div class="chip">貨品三</div>\n' +
              '  <div class="chip">貨品四</div>\n' +
              '  <div class="chip">貨品五</div>\n' +
              '</div>',
            css:
              '.wrap { display: flex; flex-wrap: wrap; gap: 10px; }\n' +
              '.chip { background: honeydew; padding: 10px 16px; }'
          },
          tip: '有咗 gap 就唔使逐個小朋友寫 margin：空位只會出現喺中間，' +
            '唔會出現最頭或者最尾多咗一份嘅怪問題。'
        },
        {
          title: '@media (max-width: 600px)：細螢幕另一套規則',
          analogy: '好似同一間茶餐廳：日頭擺大枱做午市，夜晚收起兩張枱做小菜——' +
            '地方一樣，但會按情況換另一套擺法。',
          code:
            '.card {\n' +
            '  width: 320px;\n' +
            '}\n' +
            '\n' +
            '@media (max-width: 600px) {\n' +
            '  .card {\n' +
            '    width: 100%;   /* 手機度撐滿闊度 */\n' +
            '  }\n' +
            '}',
          lang: 'css',
          preview: {
            html: '<div class="card">試下把預覽框拉窄（或者用手機睇），我會由 320px 變成撐滿闊度</div>',
            css:
              '.card { width: 320px; max-width: 100%; box-sizing: border-box; background: lightcyan; padding: 10px; }\n' +
              '@media (max-width: 600px) {\n' +
              '  .card { width: 100%; background: khaki; }\n' +
              '}'
          },
          tip: 'max-width: 600px 意思係「螢幕闊度細過或者等於 600px 嗰陣」套用。' +
            '媒體查詢（media query）入面嘅規則同樣受優先次序限制，所以通常寫喺相關規則之後。'
        },
        {
          title: '行動優先（mobile first）：先寫手機版，再加大',
          analogy: '好似開一間細舖：先擺得落最緊要嘅貨，等舖頭擴充之後才加貨架。' +
            '如果一開始就當自己有大舖，縮返細嘅時候就會塞唔落。',
          code:
            '/* 1. 預設寫手機版：單欄直排 */\n' +
            '.layout {\n' +
            '  display: flex;\n' +
            '  flex-direction: column;\n' +
            '  gap: 12px;\n' +
            '}\n' +
            '\n' +
            '/* 2. 螢幕夠闊先變成兩欄 */\n' +
            '@media (min-width: 700px) {\n' +
            '  .layout {\n' +
            '    flex-direction: row;\n' +
            '  }\n' +
            '}',
          lang: 'css',
          preview: {
            html:
              '<div class="layout">\n' +
              '  <div class="pane">左欄</div>\n' +
              '  <div class="pane">右欄</div>\n' +
              '</div>',
            css:
              '.layout { display: flex; flex-direction: column; gap: 12px; }\n' +
              '@media (min-width: 700px) {\n' +
              '  .layout { flex-direction: row; }\n' +
              '}\n' +
              '.pane { background: aliceblue; padding: 12px; flex: 1; }'
          },
          tip: '行動優先嘅好處：預設規則已經係最狹窄嘅情況，之後用 min-width 一層層加闊，' +
            '唔會出現「手機版被電腦版規則蓋住」嘅混亂。闊度盡量用 max-width 同百分比，唔好寫死 px。'
        }
      ],
      puzzle: {
        title: '練習 8：用 Flexbox 排一個會自動換行嘅工具列',
        task: '預覽框有固定嘅 <code>&lt;div class="bar"&gt;</code> 裏面有三個 ' +
          '<code>&lt;span class="btn"&gt;</code>。寫 CSS 令 <code>.bar</code> 用 ' +
          '<code>display: flex</code>、<code>justify-content: center</code>、<code>flex-wrap: wrap</code>、' +
          '<code>gap: 10px</code>，並令 <code>.btn</code> 有淺藍背景同 <code>8px</code> 內距。',
        hint: '三個 Flexbox 屬性都要寫喺父層 <code>.bar</code> 度；<code>.btn</code> 只需要管自己嘅外觀。',
        starter: '/* 喺下面寫你嘅 CSS */\n.bar {\n\n}\n\n.btn {\n\n}\n',
        solution:
          '.bar {\n' +
          '  display: flex;\n' +
          '  justify-content: center;\n' +
          '  flex-wrap: wrap;\n' +
          '  gap: 10px;\n' +
          '}\n' +
          '\n' +
          '.btn {\n' +
          '  background: aliceblue;\n' +
          '  padding: 8px;\n' +
          '}',
        mode: 'preview',
        lang: 'css',
        previewHtml:
          '<div class="bar">\n' +
          '  <span class="btn">首頁</span>\n' +
          '  <span class="btn">課程</span>\n' +
          '  <span class="btn">關於</span>\n' +
          '</div>',
        expectCode: 'display: flex',
        previewHeight: 180
      },
      quiz: [
        {
          type: 'mc',
          q: 'display: flex 應該寫喺邊個標籤度？',
          options: ['父層（容器）', '每一個小朋友', 'body 以外任何標籤', '唔關標籤事，寫喺 CSS 最上面就得'],
          answer: 0,
          explain: 'Flexbox 係「父層發號施令」嘅模式：容器設定 display: flex，裏面嘅小朋友就自動並排。'
        },
        {
          type: 'mc',
          q: 'flex-direction: column 嘅效果係？',
          options: ['小朋友由左至右排', '小朋友由上到下排', '隱藏所有小朋友', '自動換行'],
          answer: 1,
          explain: 'row 係橫向（預設），column 係縱向，即係由上到下一個跟一個。'
        },
        {
          type: 'tf',
          q: '判斷：justify-content: space-between 會令第一個同最後一個小朋友貼住容器兩邊。',
          answer: 0,
          explain: 'space-between 會把剩餘空位平均分配到小朋友之間，所以兩頭貼邊、中間平均分開。'
        },
        {
          type: 'mc',
          q: 'flex-direction 係 row 嗰陣，想小朋友喺容器高度入面垂直居中，要用邊個？',
          options: ['align-items: center;', 'justify-content: center;', 'text-align: center;', 'margin: 0 auto;'],
          answer: 0,
          explain: 'row 嘅交叉軸係上下方向，所以用 align-items；justify-content 管嘅係左右。'
        },
        {
          type: 'mc',
          q: '想小朋友一行擺唔落就自動換行，要寫咩？',
          options: ['flex-wrap: wrap;', 'flex-wrap: nowrap;', 'overflow: hidden;', 'display: block;'],
          answer: 0,
          explain: 'Flexbox 預設係 nowrap（唔換行，會夾硬擠），要換行就要寫 flex-wrap: wrap;。'
        },
        {
          type: 'tf',
          q: '判斷：gap 可以喺 Flexbox 容器度統一設定小朋友之間嘅空位。',
          answer: 0,
          explain: 'gap 只會喺小朋友之間留空位，容器最頭同最尾都唔會有，比逐個寫 margin 乾淨。'
        },
        {
          type: 'mc',
          q: '@media (max-width: 600px) { ... } 入面嘅規則幾時生效？',
          options: ['螢幕闊度 600px 或者以下', '螢幕闊度 600px 或者以上', '永遠生效', '只有列印嗰陣'],
          answer: 0,
          explain: 'max-width 係「最闊到呢個數為止」，所以適用於 600px 或更窄嘅螢幕；反過來用 min-width 就係最窄由呢個數起。'
        },
        {
          type: 'mc',
          q: '行動優先（mobile first）嘅做法係？',
          options: [
            '先寫手機版嘅規則，再用 min-width 為闊螢幕加規則',
            '先寫電腦版，再用 max-width 逐個縮細',
            '只寫電腦版，手機用家自己放大',
            '唔寫 CSS，靠瀏覽器自己處理'
          ],
          answer: 0,
          explain: '先寫最基本（最窄）嘅樣式，再用 min-width 一層層加強，規矩清楚又唔會互相蓋住。'
        },
        {
          type: 'tf',
          q: '判斷：Flexbox 嘅 gap 只可以寫一個值。',
          answer: 1,
          explain: 'gap 可以寫兩個值，例如 gap: 10px 20px，即係上下 10px、左右 20px。'
        }
      ]
    }
/* ==== 檔案結束（以下不要再加內容）==== */
  ]
});
