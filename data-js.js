/* ============================================================================
   前端基礎學堂 Frontend Foundations — data-js.js（JavaScript 課程資料庫）
   ----------------------------------------------------------------------------
   這個檔案 = JavaScript 科嘅全部課程內容。改課程只需要改呢個檔案，
   唔需要碰 index.html / app.js / runner.js / quiz.js。
   載入之後，會把 JavaScript 科目 push 入 window.LEARN_DATA.subjects。

   寫作規則（同 _SPEC-課程資料格式.md 一致）：
     1. 資料字串主要用單引號；如果字串內容本身有單引號（例如 Node 印物件嘅格式
        { name: '阿明' }），就改用雙引號包住，避免漏咗跳脫。
     2. 唔會用反引號樣板字串做「資料字串」；需要示範樣板字串嘅 code 會用雙引號包住。
     3. 每個 result 都要同 Node.js 真實輸出完全一致（連標點、大小寫、空格）。
   ========================================================================== */

window.LEARN_DATA = window.LEARN_DATA || { subjects: [] };

window.LEARN_DATA.subjects.push({

  /* ---------------- 科目基本資料 ---------------- */
  id: 'js',
  name: 'JavaScript',
  icon: '⚡',
  tagline: '網頁的大腦',
  intro: '由零開始學 JavaScript：變數、資料類型、運算子、條件、迴圈、函數、陣列、物件，最後用 DOM 令網頁真的動起來。',
  runMode: 'console',
  codeLang: 'js',
  theme: 'js',

  chapters: [

    /* ================= c1：JS 入門與變數 ================= */
    {
      id: 'c1',
      title: 'JS 入門與變數',
      icon: '📦',
      summary: '認識 JavaScript、學會用 let / const 存放資料。',
      points: [
        {
          title: 'JavaScript 是甚麼？第一個程式',
          analogy: 'JavaScript（簡稱 JS）就好似網頁嘅「大腦」。HTML 係骨架、CSS 係外表，' +
            'JS 就負責思考同反應：撳個掣彈出訊息、幫你計數、檢查表格填得對唔對，全部都係佢做。',
          code:
            "// 兩條斜線之後嘅文字叫「註解」，電腦會完全無視，係寫畀人睇嘅筆記。\n" +
            "// console.log() = 「喺控制台講一句話」，係初學者最重要嘅工具。\n" +
            "console.log('Hello, World!');\n" +
            "console.log('我開始學 JavaScript！');",
          lang: 'js',
          result: 'Hello, World!\n我開始學 JavaScript！',
          tip: '每句程式碼結尾嘅分號（;）唔寫都跑得，但養成習慣寫，出錯機會少啲。'
        },
        {
          title: '用 let 宣告變數（可以換內容）',
          analogy: '變數就好似一個貼上標籤嘅收納盒：盒名就係變數名，盒內嘅嘢就係值。' +
            '你開一個盒叫 score，第一次放 0，之後想換成 100 都得。',
          code:
            "let score = 0;          // 開一個盒叫 score，盒內放 0\n" +
            "console.log(score);     // 睇下而家係幾多\n" +
            "\n" +
            "score = 100;            // 換走盒內嘅嘢（唔使再寫 let）\n" +
            "console.log(score);\n" +
            "\n" +
            "let name = '阿明';\n" +
            "console.log('你好，' + name + '！');",
          lang: 'js',
          result: '0\n100\n你好，阿明！',
          tip: '第二次賦值唔可以再寫 let，否則等於重新開一個同名嘅盒，會直接報錯。'
        },
        {
          title: '用 const 宣告常數（唔可以換）',
          analogy: 'const 就好似用箱頭筆寫死嘅標籤：一貼咗上去就唔換得。' +
            '適合放「一路都唔會變」嘅嘢，例如圓周率、網站名、稅率。',
          code:
            "const PI = 3.14159;\n" +
            "console.log(PI);\n" +
            "\n" +
            "// 以下呢句會出錯，你可以刪走句首兩個斜線試下：\n" +
            "// PI = 3;   // TypeError: Assignment to constant variable.\n" +
            "\n" +
            "const city = '香港';\n" +
            "console.log('我住喺' + city);",
          lang: 'js',
          result: '3.14159\n我住喺香港',
          tip: '初學者口訣：預設用 const，真係要改先用 let。咁樣可以減少好多「幾時被改過」嘅混亂。'
        },
        {
          title: '變數命名規則',
          analogy: '改名有規矩，就好似身分證上嘅名唔可以亂用符號。名改得好，半年後你自己都睇得明。',
          code:
            "let userName = '阿花';      // ✅ 用 camelCase（第二個字起大寫）\n" +
            "let user_age = 18;          // ✅ 用底線都可以，但風格要統一\n" +
            "let 分數 = 90;              // ✅ 技術上可行，但唔建議\n" +
            "\n" +
            "// ❌ 以下幾個都會出錯：\n" +
            "// let 123abc = 1;   // 唔可以用數字開頭\n" +
            "// let my-name = 1;  // 唔可以有減號\n" +
            "// let let = 1;      // 唔可以用 JS 保留字（let、const、if…）\n" +
            "\n" +
            "console.log(userName + ' 今年 ' + user_age + ' 歲');",
          lang: 'js',
          result: '阿花 今年 18 歲',
          tip: '變數名要一睇就明：用 totalPrice 好過用 x、a1、temp2；名愈清楚，除錯愈快。'
        },
        {
          title: 'console.log 一次印幾樣嘢',
          analogy: 'console.log 好似茶餐廳落單：你可以一樣一樣分開嗌，' +
            '亦可以一次過用逗號嗌齊。用逗號嗌，伙記會自動幫你隔開一個空格。',
          code:
            "let name = '阿明';\n" +
            "let age = 20;\n" +
            "\n" +
            "// 用逗號分隔：console.log 會自動喺中間加一個空格\n" +
            "console.log('姓名：', name, '年齡：', age);\n" +
            "console.log('1 + 2 =', 1 + 2);\n" +
            "\n" +
            "// 用 + 自己駁：空格要自己寫\n" +
            "console.log('姓名：' + name + ' 年齡：' + age);",
          lang: 'js',
          result: '姓名： 阿明 年齡： 20\n1 + 2 = 3\n姓名：阿明 年齡：20',
          tip: '想睇變數嘅真身（例如空字串、空格），用逗號印會清楚過用 + 駁，' +
            '因為 + 會把兩邊都變成文字，睇唔出邊部分係邊個。'
        }
      ],
      puzzle: {
        title: '練習 1：改一個變數，再印出嚟',
        task: '把 <code>message</code> 嘅內容改成 <code>我學緊 JavaScript！</code>，' +
          '然後用 <code>console.log()</code> 印出嚟。',
        hint: '只需要改引號內嘅文字，再補上 <code>console.log(message);</code>。',
        starter:
          "// 1) 改以下引號內嘅文字\n" +
          "let message = '改我啦';\n" +
          "\n" +
          "// 2) 用 console.log() 印出 message\n" +
          "// 喺呢度寫你嘅程式碼\n",
        solution:
          "let message = '我學緊 JavaScript！';\n" +
          "console.log(message);",
        mode: 'console',
        lang: 'js',
        expect: '我學緊 JavaScript'
      },
      quiz: [
        {
          type: 'mc',
          q: '以下程式碼輸出係咩？\nlet a = 5;\na = 8;\nconsole.log(a);',
          options: ['5', '8', 'Error', 'undefined'],
          answer: 1,
          explain: 'let 宣告嘅變數可以重新賦值；第二行把 a 由 5 改成 8，所以印出 8。'
        },
        {
          type: 'tf',
          q: '判斷：用 const 宣告咗 x 之後，可以再寫「const x = 10;」把佢改成 10。',
          answer: 1,
          explain: '同一個範圍內唔可以重複用 const（或 let）宣告同一個名，會拋出 SyntaxError，所以呢句係錯。'
        },
        {
          type: 'mc',
          q: '以下邊個變數名係唔合法嘅？',
          options: ['userName', '_count', 'total2', '2total'],
          answer: 3,
          explain: '變數名唔可以用數字開頭，所以 2total 會直接報錯；其餘三個都合法。'
        },
        {
          type: 'mc',
          q: '註解（例如 // 之後嘅文字）有咩作用？',
          options: ['令程式跑快啲', '寫筆記畀人睇，電腦完全無視', '刪除變數', '唔寫就會報錯'],
          answer: 1,
          explain: '註解只係寫畀人（包括將來嘅自己）睇嘅說明，電腦執行時會整段跳過，亦唔會影響速度。'
        },
        {
          type: 'tf',
          q: '判斷：console.log() 嘅作用係彈出一個 alert 對話框。',
          answer: 1,
          explain: 'console.log() 係把訊息印喺控制台；要彈對話框才寫 alert()。呢個網站會把 console.log 嘅輸出顯示喺練習卡下面。'
        },
        {
          type: 'mc',
          q: 'console.log("a", 1) 會印出咩？',
          options: ['a1', 'a 1', 'a,1', 'Error'],
          answer: 1,
          explain: 'console.log 用逗號分隔多個值時，會自動喺中間加一個空格，所以印出 a 1（唔係 a1）。'
        },
        {
          type: 'mc',
          q: '想宣告一個之後唔會再改嘅值，應該用邊個關鍵字？',
          options: ['let', 'const', 'function', 'console'],
          answer: 1,
          explain: 'const 係常數，宣告之後唔可以再賦值；真係要改嘅值才用 let。'
        },
        {
          type: 'tf',
          q: '判斷：每句程式碼結尾嘅分號（;）唔寫都跑得到，但建議寫。',
          answer: 0,
          explain: 'JS 有自動補分號嘅機制，所以唔寫多數都跑得；但自動補嘅位置有時出乎意料，養成寫嘅習慣最穩陣。'
        },
        {
          type: 'mc',
          q: '邊個變數名唔可以用？',
          options: ['userName', 'new', 'myAge', '_temp'],
          answer: 1,
          explain: 'new 係 JS 嘅保留字（用嚟開新物件），唔可以當變數名；其餘三個都合法。'
        }
      ]
    },

    /* ================= c2：資料類型 ================= */
    {
      id: 'c2',
      title: '資料類型',
      icon: '🔤',
      summary: '字串、數字、布林值、兩種「空」，同用 typeof 檢查。',
      points: [
        {
          title: '字串 String（一串文字）',
          analogy: '字串就係「一串文字」，好似寫喺便利貼嘅一句話。' +
            '要話畀 JS 知呢串係文字，就要用引號包住佢；單引號同雙引號都可以，最緊要前後一致。',
          code:
            "let a = '你好';\n" +
            "let b = '世界';\n" +
            "let c = 'I am fine';        // 引號內嘅文字會原封不動\n" +
            "\n" +
            "console.log(a);\n" +
            "console.log(a + '，' + b);         // 用 + 駁埋兩段文字\n" +
            "console.log('長度係 ' + a.length);  // .length = 有幾個字",
          lang: 'js',
          result: '你好\n你好，世界\n長度係 2',
          tip: '兩個字串用 + 駁埋一齊，叫做「字串串接」。' +
            '如果想喺字串內出現引號，就外層用一款引號、內層用另一款，例如用雙引號包住單引號。'
        },
        {
          title: '數字 Number（唔使引號）',
          analogy: '數字就係數字，唔使引號，直接寫。有小數點就係小數，冇就係整數，' +
            'JS 唔似其他語言要分開兩種寫法。',
          code:
            "let price = 19.9;      // 小數\n" +
            "let count = 3;         // 整數\n" +
            "let negative = -5;     // 負數\n" +
            "\n" +
            "console.log(price * count);        // 19.9 乘 3\n" +
            "console.log(Math.round(price));    // 四捨五入：20\n" +
            "console.log(10 / 4);               // 除法：2.5（唔會自動變整數）\n" +
            "\n" +
            "// 覺得條尾巴太長，可以用 toFixed(1) 指定顯示一位小數\n" +
            "console.log((price * count).toFixed(1));",
          lang: 'js',
          result: '59.699999999999996\n20\n2.5\n59.7',
          tip: '兩件事要記住：一、「3」（有引號）係文字，3（冇引號）才係數字，混住用會出意外。' +
            '二、用小數做運算，電腦有機會出現好長嘅尾巴（19.9 乘 3 唔係啱啱 59.7），' +
            '呢個係用二進位儲存小數嘅限制；想靚仔就寫 .toFixed(位數)，它會回傳一個字串。'
        },
        {
          title: '布林值 Boolean（真／假）',
          analogy: '布林值只有兩個答案：true（真）同 false（假）。好似燈掣，一係開一係關，冇中間。',
          code:
            "let isStudent = true;\n" +
            "let hasTicket = false;\n" +
            "\n" +
            "console.log(isStudent);\n" +
            "console.log(3 > 2);            // 3 大過 2，所以 true\n" +
            "console.log(1 > 100);          // false\n" +
            "console.log(typeof isStudent); // boolean",
          lang: 'js',
          result: 'true\ntrue\nfalse\nboolean',
          tip: '布林值係之後「條件判斷」同「迴圈」嘅基礎，幾乎每一章都會再見到佢。'
        },
        {
          title: 'undefined 與 null（兩種「空」）',
          analogy: 'undefined = 「我未放嘢入去」；null = 「我特登放一個空」。' +
            '一個係未填，一個係刻意留白，寫程式時嘅意思唔同。',
          code:
            "let a;                     // 宣告咗但未放值\n" +
            "let b = null;              // 特登設成「冇」\n" +
            "let c = '';                // 空字串，都係一種「空」\n" +
            "\n" +
            "console.log(a);\n" +
            "console.log(b);\n" +
            "console.log(c === '');\n" +
            "console.log(typeof a);\n" +
            "console.log(typeof b);",
          lang: 'js',
          result: "undefined\nnull\ntrue\nundefined\nobject",
          tip: '如果程式報錯話 Cannot read properties of undefined，通常就係你未放值就想用佢；' +
            '記住 undefined 係「未填」，唔係「0」或者「空字串」。'
        },
        {
          title: '用 typeof 檢查類型',
          analogy: 'typeof 好似行李檢查機：你唔肯定盒內係咩，就問一句「呢個係邊種資料？」佢會答你一個英文字。',
          code:
            "console.log(typeof '你好');          // string\n" +
            "console.log(typeof 42);              // number\n" +
            "console.log(typeof true);            // boolean\n" +
            "console.log(typeof undefined);       // undefined\n" +
            "console.log(typeof null);            // object（出名嘅歷史陷阱）\n" +
            "console.log(typeof [1, 2, 3]);       // object（陣列都算 object）\n" +
            "console.log(typeof function () {});  // function",
          lang: 'js',
          result: 'string\nnumber\nboolean\nundefined\nobject\nobject\nfunction',
          tip: 'typeof null 回傳 "object" 係一個好出名嘅舊問題，但因為太多舊網站依賴佢，所以一直冇改。' +
            '想檢查一個值係唔係 null，要直接寫 value === null。'
        },
        {
          title: '樣板字串：用反引號串字更方便',
          analogy: '用 + 駁字好似用膠紙逐段黐；樣板字串就好似一張表格，' +
            '你喺句子嘅空位直接填上變數，一次過印出嚟，唔使拆到一句句。',
          code:
            "const name = '阿明';\n" +
            "const age = 20;\n" +
            "\n" +
            "// 舊寫法：用 + 一段段駁\n" +
            "console.log('我叫 ' + name + '，今年 ' + age + ' 歲。');\n" +
            "\n" +
            "// 樣板字串：用反引號（鍵盤左上角、Esc 下面嗰個鍵）包住，${} 內放變數\n" +
            "console.log(`我叫 ${name}，今年 ${age} 歲。`);\n" +
            "console.log(`1 + 2 = ${1 + 2}`);     // ${} 內可以直接計數\n" +
            "console.log(`It isn't hard`);        // 樣板字串內可以直接用單引號",
          lang: 'js',
          result: "我叫 阿明，今年 20 歲。\n我叫 阿明，今年 20 歲。\n1 + 2 = 3\nIt isn't hard",
          tip: '樣板字串用反引號包住，唔係單引號；${} 內可以放變數、算式，甚至函數呼叫，' +
            '個個都會先計好再放入句子。'
        }
      ],
      puzzle: {
        title: '練習 2：認清三種資料類型',
        task: '已經有三個變數：<code>name</code>（字串）、<code>age</code>（數字）、' +
          '<code>isHappy</code>（布林值）。請用 <code>typeof</code> 逐一印出佢哋嘅類別。',
        hint: '寫三次，每次換一個變數名：<code>console.log(typeof name);</code>',
        starter:
          "let name = '阿明';\n" +
          "let age = 20;\n" +
          "let isHappy = true;\n" +
          "\n" +
          "// 喺以下位置印出三個類別\n",
        solution:
          "let name = '阿明';\n" +
          "let age = 20;\n" +
          "let isHappy = true;\n" +
          "\n" +
          "console.log(typeof name);\n" +
          "console.log(typeof age);\n" +
          "console.log(typeof isHappy);",
        mode: 'console',
        lang: 'js',
        expect: 'boolean'
      },
      quiz: [
        {
          type: 'mc',
          q: 'typeof "123" 嘅結果係咩？',
          options: ['number', 'string', 'boolean', 'NaN'],
          answer: 1,
          explain: '有引號就係字串，所以 typeof "123" 係 "string"。想變成數字要另外寫 Number("123")。'
        },
        {
          type: 'mc',
          q: '以下邊個係布林值？',
          options: ['"true"', 'true', '1', '"yes"'],
          answer: 1,
          explain: 'true 唔加引號才係布林值；"true" 只係一串文字，typeof 會答你 string。'
        },
        {
          type: 'tf',
          q: '判斷：let x; 之後即刻 console.log(x); 會印出 undefined。',
          answer: 0,
          explain: '宣告咗但未賦值嘅變數，值就係 undefined（未填），所以呢句係對。'
        },
        {
          type: 'mc',
          q: 'null 同 undefined 最主要嘅分別係咩？',
          options: [
            '完全一樣，冇分別',
            'undefined 係「未放值」，null 係「刻意設成空」',
            'null 係數字，undefined 係字串',
            'null 唔可以用嚟做變數嘅值'
          ],
          answer: 1,
          explain: '兩者都代表「空」，但意圖唔同：undefined 通常係系統自動產生（未賦值），null 通常係程式員刻意設定。'
        },
        {
          type: 'mc',
          q: 'console.log(typeof null) 會印出咩？',
          options: ['null', 'object', 'undefined', 'number'],
          answer: 1,
          explain: 'typeof null 回傳 "object"，係 JS 早期留落嚟嘅問題；要檢查 null 就直接寫 value === null。'
        },
        {
          type: 'tf',
          q: '判斷：樣板字串係用反引號包住，${} 內可以放變數或者算式。',
          answer: 0,
          explain: '樣板字串用反引號包住，${} 內嘅內容會先計好再放入字串，所以呢句係對。'
        },
        {
          type: 'mc',
          q: 'let s = "hello";\nconsole.log(s.length); 會印出咩？',
          options: ['4', '5', '6', 'undefined'],
          answer: 1,
          explain: '.length 係字串有幾個字，hello 有五個字母，所以係 5（唔係索引嘅 0 至 4）。'
        },
        {
          type: 'mc',
          q: '邊個寫法可以把字串 "123" 變成數字 123？',
          options: ['Number("123")', '"123".toFixed()', 'typeof "123"', 'len("123")'],
          answer: 0,
          explain: 'Number() 會把可以解讀成數字嘅字串轉成 number；typeof 只係檢查類型，唔會轉換。'
        },
        {
          type: 'mc',
          q: 'console.log(0.1 + 0.2); 會印出咩？',
          options: ['0.3', '0.30000000000000004', '0.30', 'NaN'],
          answer: 1,
          explain: '電腦用二進位儲存小數，0.1 同 0.2 都唔係啱啱好，相加之後會有極細嘅誤差，所以唔係啱啱 0.3。'
        }
      ]
    },

    /* ================= c3：運算子 ================= */
    {
      id: 'c3',
      title: '運算子',
      icon: '➗',
      summary: '計數、比較、邏輯運算，同好易踩中嘅類型陷阱。',
      points: [
        {
          title: '算術運算子（+ - * / %）',
          analogy: '就係小學數學，只不過符號用鍵盤打得出嘅版本：* 係乘、/ 係除，' +
            '% 係「除完之後剩幾多」（餘數）。',
          code:
            "console.log(7 + 3);      // 10\n" +
            "console.log(7 - 3);      // 4\n" +
            "console.log(7 * 3);      // 21\n" +
            "console.log(7 / 2);      // 3.5\n" +
            "console.log(7 % 2);      // 1（7 除 2 剩 1）\n" +
            "console.log(2 + 3 * 4);  // 14（先乘除後加減）\n" +
            "console.log((2 + 3) * 4); // 20（括號最優先）",
          lang: 'js',
          result: '10\n4\n21\n3.5\n1\n14\n20',
          tip: '% 好實用：n % 2 === 0 就代表 n 係雙數。想改變計算次序，就用括號，唔好靠背口訣。'
        },
        {
          title: '+ 嘅雙重身份：加數 vs 駁字',
          analogy: '同一個 + 號，兩邊都係數字就做加法；只要有一邊係字串，佢就會變成「膠水」，' +
            '把兩邊黐成一串文字。',
          code:
            "console.log(1 + 2);              // 3（數字加數字）\n" +
            "console.log('1' + 2);            // 12（變咗駁字，唔係 3）\n" +
            "console.log(1 + '2');            // 12\n" +
            "console.log('總數：' + 3 + 4);    // 總數：34（由左至右，先把 3 駁成文字）\n" +
            "console.log('總數：' + (3 + 4));  // 總數：7（用括號先計數）\n" +
            "console.log('5' - 2);            // 3（減號冇雙重身份，會自動轉數字）",
          lang: 'js',
          result: '3\n12\n12\n總數：34\n總數：7\n3',
          tip: '呢個係初學者最常中嘅陷阱。凡係「文字 + 數字」，就先用 Number() 轉好，或者用括號寫清楚你想點計。'
        },
        {
          title: '比較運算子（> < >= <= === !==）',
          analogy: '比較運算子係一條「問題」，答案永遠只有 true 或 false，好似問「你夠 18 歲未？」',
          code:
            "let age = 17;\n" +
            "console.log(age > 18);     // false\n" +
            "console.log(age >= 17);    // true\n" +
            "console.log(age < 100);    // true\n" +
            "console.log(age !== 20);   // true（唔等於）\n" +
            "console.log(age === 17);   // true（嚴格相等）",
          lang: 'js',
          result: 'false\ntrue\ntrue\ntrue\ntrue',
          tip: '呢啲 true / false 之後會直接餵畀 if 用：if (age >= 18) { ... }，所以係必學嘅基礎。'
        },
        {
          title: '=== 同 == 嘅分別（好重要）',
          analogy: '=== 係「嚴格」檢查，連類型都要一樣；== 係「寬鬆」檢查，' +
            '會偷偷幫你轉類型，所以成日估錯。做正經事要用嚴格嘅 ===。',
          code:
            "console.log(1 == '1');             // true  ← 偷偷把 '1' 轉成數字\n" +
            "console.log(1 === '1');            // false ← 類型唔同（number 對 string）\n" +
            "console.log(0 == false);           // true  ← 好易估錯\n" +
            "console.log('' == 0);              // true\n" +
            "console.log(null == undefined);    // true\n" +
            "console.log(null === undefined);   // false",
          lang: 'js',
          result: 'true\nfalse\ntrue\ntrue\ntrue\nfalse',
          tip: '口訣：永遠用 === 同 !==，除非你有非常明確嘅理由要用 ==。'
        },
        {
          title: '邏輯運算子（&& || !）',
          analogy: '&&（AND）係「兩樣都要」；||（OR）係「是但一樣」；!（NOT）係「相反」。' +
            '好似入戲院：要有票 而且 要戴口罩，缺一不可。',
          code:
            "let hasTicket = true;\n" +
            "let hasMask = false;\n" +
            "\n" +
            "console.log(hasTicket && hasMask);    // false（兩樣都要，今次唔齊）\n" +
            "console.log(hasTicket || hasMask);    // true（有一樣就夠）\n" +
            "console.log(!hasMask);                // true（相反）\n" +
            "\n" +
            "let age = 20;\n" +
            "console.log(age >= 18 && hasTicket);  // true\n" +
            "console.log(!hasTicket || hasMask);   // false（兩邊都唔成立）",
          lang: 'js',
          result: 'false\ntrue\ntrue\ntrue\nfalse',
          tip: '|| 有個好常用嘅用途：設定預設值，例如 let name = input || \'訪客\';' +
            '（input 係空字串嘅話，就會用之後嗰個）。'
        },
        {
          title: 'NaN：唔係一個數字',
          analogy: 'NaN 係 Not a Number 嘅縮寫，即係「計唔到」。好似你問「蘋果乘三等於幾多」，' +
            '答案唔係 0，而係「計唔到」。',
          code:
            "console.log(Number('abc'));        // 轉唔到，得 NaN\n" +
            "console.log('abc' * 2);            // 文字做乘法，得 NaN\n" +
            "console.log(0 / 0);                // 得 NaN\n" +
            "console.log(NaN === NaN);          // false（NaN 唔等於自己）\n" +
            "console.log(Number.isNaN(NaN));    // true（正確嘅檢查方法）\n" +
            "console.log('10' * '2');           // 20（* 會自動把字串轉數字）",
          lang: 'js',
          result: 'NaN\nNaN\nNaN\nfalse\ntrue\n20',
          tip: '想檢查一個值係唔係 NaN，唔可以用 === NaN，要寫 Number.isNaN(值)，' +
            '因為 NaN 連自己都唔等於。'
        }
      ],
      puzzle: {
        title: '練習 3：計購物總數，再判斷夠唔夠 50 蚊',
        task: '有三件貨，價錢係 <code>25</code>、<code>18</code>、<code>7</code>。' +
          '先計算總數，再判斷 <code>total &gt; 50</code> 係 true 定 false，兩樣都印出嚟。',
        hint: '先把三件貨加起：<code>let total = 25 + 18 + 7;</code>，再 <code>console.log(total &gt; 50);</code>',
        starter:
          "// 1) 計出總數（改呢行）\n" +
          "let total = 0;\n" +
          "\n" +
          "// 2) 印出總數\n" +
          "console.log('總數：' + total);\n" +
          "\n" +
          "// 3) 印出「total 大過 50」嘅判斷結果\n" +
          "// 喺呢度寫你嘅程式碼\n",
        solution:
          "let total = 25 + 18 + 7;\n" +
          "console.log('總數：' + total);\n" +
          "console.log('大過 50？ ' + (total > 50));",
        mode: 'console',
        lang: 'js',
        expect: '總數：50'
      },
      quiz: [
        {
          type: 'mc',
          q: 'console.log("5" + 5) 嘅輸出係咩？',
          options: ['10', '55', 'NaN', 'Error'],
          answer: 1,
          explain: '+ 只要有一邊係字串，就會做「駁字」，所以得出字串 "55"，印出嚟睇落似 55。'
        },
        {
          type: 'mc',
          q: '10 % 3 嘅結果係咩？',
          options: ['3', '3.33', '1', '0'],
          answer: 2,
          explain: '% 係取餘數：10 除 3 得 3 剩 1，所以結果係 1。'
        },
        {
          type: 'tf',
          q: '判斷：1 === "1" 嘅結果係 true。',
          answer: 1,
          explain: '=== 會連類型一齊比較：1 係 number，"1" 係 string，所以係 false。'
        },
        {
          type: 'mc',
          q: '要表達「有票 而且 戴口罩」，應該點寫？',
          options: ['hasTicket || hasMask', 'hasTicket && hasMask', '!hasTicket && hasMask', 'hasTicket == hasMask'],
          answer: 1,
          explain: '「而且」= 兩樣都要成立 = &&；|| 係「是但一樣成立就夠」。'
        },
        {
          type: 'tf',
          q: '判斷：!true 嘅結果係 false。',
          answer: 0,
          explain: '! 係「相反」，所以 !true === false，呢句係對。'
        },
        {
          type: 'mc',
          q: 'console.log(2 + 3 * 4); 會印出咩？',
          options: ['20', '14', '24', '9'],
          answer: 1,
          explain: '乘法優先過加法：先計 3 * 4 = 12，再加 2，所以係 14。想先加就要寫 (2 + 3) * 4。'
        },
        {
          type: 'mc',
          q: 'console.log("總數：" + 3 + 4); 會印出咩？',
          options: ['總數：7', '總數：34', '34', '7'],
          answer: 1,
          explain: '程式由左至右計：先做 "總數：" + 3，變成字串 "總數：3"，再駁 4，所以係總數：34。'
        },
        {
          type: 'tf',
          q: '判斷：NaN === NaN 嘅結果係 true。',
          answer: 1,
          explain: 'NaN 代表「計唔到」，佢連自己都唔等於自己，所以要寫 Number.isNaN(x) 來檢查。'
        },
        {
          type: 'mc',
          q: '想知變數 n 係唔係雙數，應該點寫？',
          options: ['n / 2 === 0', 'n % 2 === 0', 'n * 2 === 0', 'n + 2 === 0'],
          answer: 1,
          explain: 'n % 2 係 n 除 2 嘅餘數；雙數嘅餘數係 0，所以 n % 2 === 0。'
        }
      ]
    },

    /* ================= c4：條件判斷 ================= */
    {
      id: 'c4',
      title: '條件判斷',
      icon: '🔀',
      summary: 'if / else if / else、三元運算子，同 switch 分流。',
      points: [
        {
          title: 'if：符合條件才做',
          analogy: 'if 好似守閘員：「如果年齡夠 18，就畀你入場。」' +
            '條件括號內嘅結果係 true，大括號內嘅程式碼才會執行。',
          code:
            "let age = 20;\n" +
            "\n" +
            "if (age >= 18) {\n" +
            "  console.log('你可以入場');\n" +
            "}\n" +
            "\n" +
            "let age2 = 15;\n" +
            "if (age2 >= 18) {\n" +
            "  console.log('呢句唔會執行');\n" +
            "}\n" +
            "console.log('程式繼續行落去');",
          lang: 'js',
          result: '你可以入場\n程式繼續行落去',
          tip: '大括號 { } 唔可以漏，佢係「要做嘅事」嘅範圍；漏咗嘅話只有緊接嗰一句受 if 控制。'
        },
        {
          title: 'if / else：二選一',
          analogy: 'else 係「否則」。好似天氣：「如果落雨，帶傘；否則，戴太陽眼鏡。」' +
            '兩邊永遠只會行一邊。',
          code:
            "let score = 55;\n" +
            "\n" +
            "if (score >= 60) {\n" +
            "  console.log('合格 🎉');\n" +
            "} else {\n" +
            "  console.log('唔合格，再努力 💪');\n" +
            "}\n" +
            "\n" +
            "let isRain = false;\n" +
            "if (isRain) {\n" +
            "  console.log('帶傘');\n" +
            "} else {\n" +
            "  console.log('戴太陽眼鏡');\n" +
            "}",
          lang: 'js',
          result: '唔合格，再努力 💪\n戴太陽眼鏡',
          tip: 'if (isRain) 呢種寫法等於 if (isRain === true)，係常見簡寫；' +
            '但唔好寫 if (isRain = true)，一個等號係賦值，會直接把 true 塞入去。'
        },
        {
          title: 'else if：多過兩個可能',
          analogy: 'else if 好似自動樓梯：由上至下逐個條件試，一試中就做完嗰級，' +
            '之後嘅級數唔會再試。所以條件嘅先後次序好重要。',
          code:
            "function grade(score) {\n" +
            "  if (score >= 90) {\n" +
            "    return 'A';\n" +
            "  } else if (score >= 75) {\n" +
            "    return 'B';\n" +
            "  } else if (score >= 60) {\n" +
            "    return 'C';\n" +
            "  } else {\n" +
            "    return 'F';\n" +
            "  }\n" +
            "}\n" +
            "\n" +
            "console.log(grade(95));\n" +
            "console.log(grade(80));\n" +
            "console.log(grade(61));\n" +
            "console.log(grade(30));",
          lang: 'js',
          result: 'A\nB\nC\nF',
          tip: '如果次序調轉（先寫 score >= 60），咁 95 分都會被判成 C，因為第一個條件已經成立。'
        },
        {
          title: '三元運算子：一句寫完 if / else',
          analogy: '好似即食麵版本嘅 if / else：條件 ? 係咁就呢個 : 唔係就嗰個。' +
            '短小情況好好用，太複雜就唔好硬用。',
          code:
            "let age = 20;\n" +
            "let type = age >= 18 ? '成人' : '小童';\n" +
            "console.log(type);\n" +
            "\n" +
            "let price = 100;\n" +
            "console.log('價錢：' + price + (price > 50 ? '（貴）' : '（平）'));",
          lang: 'js',
          result: '成人\n價錢：100（貴）',
          tip: '讀法：條件 ? 真嘅時候用呢個 : 假嘅時候用呢個。問號之前係條件，冒號兩邊係兩個結果。'
        },
        {
          title: 'switch：一個值，多個分岔',
          analogy: 'switch 好似自動販賣機：你揀一個號碼（值），佢就跳去對應嗰格。' +
            '每格記住加 break，否則會「跌落」下一格繼續做。',
          code:
            "let day = '三';\n" +
            "\n" +
            "switch (day) {\n" +
            "  case '一':\n" +
            "    console.log('星期一，加油');\n" +
            "    break;\n" +
            "  case '三':\n" +
            "    console.log('星期三，過咗一半');\n" +
            "    break;\n" +
            "  case '五':\n" +
            "    console.log('星期五，就嚟放假');\n" +
            "    break;\n" +
            "  default:\n" +
            "    console.log('普通日子');\n" +
            "}\n" +
            "\n" +
            "// 以下示範漏寫 break 會點：跌落下一個 case 繼續做\n" +
            "switch (2) {\n" +
            "  case 1:\n" +
            "    console.log('一');\n" +
            "  case 2:\n" +
            "    console.log('二');\n" +
            "  case 3:\n" +
            "    console.log('三');\n" +
            "    break;\n" +
            "  case 4:\n" +
            "    console.log('四');\n" +
            "}",
          lang: 'js',
          result: '星期三，過咗一半\n二\n三',
          tip: 'default 等於 else：所有 case 都唔中就行呢個。switch 適合「一個值對幾個固定選項」，其他情況用 if 更清楚。'
        }
      ],
      puzzle: {
        title: '練習 4：自動評分機',
        task: '寫一個 <code>if / else</code>，按分數印出等級：60 分或以上印「<code>合格</code>」，' +
          '否則印「<code>唔合格</code>」。變數 <code>score</code> 可以自己改嚟試。',
        hint: '結構係 <code>if (score &gt;= 60) { ... } else { ... }</code>，兩邊各寫一個 console.log。',
        starter:
          "let score = 58;   // 試下改成 75、90、59\n" +
          "\n" +
          "// 喺呢度寫 if / else\n",
        solution:
          "let score = 58;\n" +
          "\n" +
          "if (score >= 60) {\n" +
          "  console.log('合格');\n" +
          "} else {\n" +
          "  console.log('唔合格');\n" +
          "}",
        mode: 'console',
        lang: 'js',
        expect: '唔合格'
      },
      quiz: [
        {
          type: 'mc',
          q: 'let n = 5;\nif (n > 10) { console.log("大"); } else { console.log("細"); }\n輸出係咩？',
          options: ['大', '細', '兩句都印', '冇輸出'],
          answer: 1,
          explain: '5 > 10 係 false，所以行 else 分支，印「細」。'
        },
        {
          type: 'tf',
          q: '判斷：switch 內嘅 break 可以省略，唔會影響結果。',
          answer: 1,
          explain: '漏寫 break 會 fall through，程式會繼續執行下一個 case，通常造成意料之外嘅結果。'
        },
        {
          type: 'mc',
          q: 'let x = 80;\nlet r = x >= 60 ? "合格" : "唔合格";\nr 嘅值係咩？',
          options: ['"合格"', '"唔合格"', 'true', 'undefined'],
          answer: 0,
          explain: '三元運算子先計條件：80 >= 60 成立，所以取問號之後、冒號之前嗰個值。'
        },
        {
          type: 'mc',
          q: '以下邊句係「如果 a 等於 b 就做事」最穩陣嘅寫法？',
          options: ['if (a = b)', 'if (a == b)', 'if (a === b)', 'if a === b'],
          answer: 2,
          explain: '要用 === 做嚴格比較；a = b 係賦值（會把 b 塞入 a），而 if a === b 漏咗括號，係語法錯誤。'
        },
        {
          type: 'mc',
          q: '以下邊個值放入 if 條件內，會被當成「假」（唔會執行）？',
          options: ['0', '1', '"a"', '-1'],
          answer: 0,
          explain: '0、空字串、null、undefined、NaN 都會被當成假；其餘數字（包括負數）都係真。'
        },
        {
          type: 'tf',
          q: '判斷：if / else 嘅兩個分支，每次執行時兩邊都會行一次。',
          answer: 1,
          explain: 'if / else 係二選一，只會行其中一邊：條件成立行 if，唔成立行 else。'
        },
        {
          type: 'tf',
          q: '判斷：喺 if / else if 鏈內，只要有一個條件成立，之後嘅 else if 就唔會再檢查。',
          answer: 0,
          explain: '條件由上至下檢查，一試中就會執行嗰個分支並跳過其餘分支，所以次序會影響結果。'
        },
        {
          type: 'mc',
          q: 'switch 內嘅 default 有咩作用？',
          options: [
            '所有 case 都唔中嘅時候執行',
            '一定要寫，唔寫會報錯',
            '等同 break',
            '把條件值變成 true'
          ],
          answer: 0,
          explain: 'default 等於 else：當所有 case 都比對唔中，就會行 default 嗰段。'
        },
        {
          type: 'mc',
          q: '以下邊個 if 寫法係正確嘅？',
          options: ['if a > 5 { }', 'if (a > 5) { }', 'if (a > 5) then { }', 'if a > 5 then { }'],
          answer: 1,
          explain: '條件一定要用括號包住，之後直接接大括號；JS 冇 then 呢個關鍵字。'
        }
      ]
    },

    /* ================= c5：迴圈 ================= */
    {
      id: 'c5',
      title: '迴圈',
      icon: '🔁',
      summary: 'for 同 while，幫你重複做同一件事，仲有 break / continue。',
      points: [
        {
          title: '為甚麼要迴圈？',
          analogy: '如果要你抄 100 次同一句，你會想搵部影印機。' +
            '迴圈就係程式嘅影印機：寫一次，執行好多次。',
          code:
            "// 冇迴圈：同一個意思要抄三次\n" +
            "console.log('第 1 次');\n" +
            "console.log('第 2 次');\n" +
            "console.log('第 3 次');\n" +
            "\n" +
            "// 有迴圈：寫一次，執行三次\n" +
            "for (let i = 1; i <= 3; i++) {\n" +
            "  console.log('第 ' + i + ' 次');\n" +
            "}",
          lang: 'js',
          result: '第 1 次\n第 2 次\n第 3 次\n第 1 次\n第 2 次\n第 3 次',
          tip: '如果之後要改成 1000 次，用迴圈只需改一個數字；冇用迴圈就要複製一千行。'
        },
        {
          title: 'for 迴圈三件零件',
          analogy: 'for 好似跑步機設定：起點（i = 1）、幾時停（i <= 5）、每次加幾多（i++）。' +
            '三樣寫齊，佢就會自動跑。',
          code:
            "// 由 1 數到 5\n" +
            "for (let i = 1; i <= 5; i++) {\n" +
            "  console.log(i);\n" +
            "}\n" +
            "\n" +
            "console.log('--- 倒數 ---');\n" +
            "for (let i = 5; i >= 1; i--) {\n" +
            "  console.log(i);\n" +
            "}\n" +
            "console.log('發射 🚀');",
          lang: 'js',
          result: '1\n2\n3\n4\n5\n--- 倒數 ---\n5\n4\n3\n2\n1\n發射 🚀',
          tip: 'i++ 等於 i = i + 1，i-- 等於 i = i - 1。三件零件之間一定要用分號分隔，唔係逗號。'
        },
        {
          title: 'while 迴圈：唔知要跑幾多次時用',
          analogy: 'for 係「跑 10 個圈」；while 係「跑到攰為止」。' +
            '當你唔確定要重複幾多次，就用 while。',
          code:
            "let count = 1;\n" +
            "while (count <= 3) {\n" +
            "  console.log('count 係 ' + count);\n" +
            "  count++;   // 千祈唔好漏！否則永遠跑唔完（死循環）\n" +
            "}\n" +
            "console.log('跑完喇');",
          lang: 'js',
          result: 'count 係 1\ncount 係 2\ncount 係 3\n跑完喇',
          tip: '死循環會令瀏覽器卡住。呢個網站有逾時保護，但自己寫程式時一定要確保條件最終會變成 false。'
        },
        {
          title: 'break 同 continue',
          analogy: 'break 係「即刻收工，唔做喇」；continue 係「跳過呢一次，繼續下一次」。' +
            '好似食自助餐：break 係走人，continue 係跳過青椒但繼續食。',
          code:
            "for (let i = 1; i <= 5; i++) {\n" +
            "  if (i === 3) {\n" +
            "    continue;   // 跳過 3\n" +
            "  }\n" +
            "  console.log('跳過 3 之後印：' + i);\n" +
            "}\n" +
            "\n" +
            "for (let i = 1; i <= 10; i++) {\n" +
            "  if (i === 4) {\n" +
            "    console.log('搵到 4，收工');\n" +
            "    break;\n" +
            "  }\n" +
            "  console.log('檢查 ' + i);\n" +
            "}",
          lang: 'js',
          result: '跳過 3 之後印：1\n跳過 3 之後印：2\n跳過 3 之後印：4\n跳過 3 之後印：5\n檢查 1\n檢查 2\n檢查 3\n搵到 4，收工',
          tip: 'continue 只跳過今次；break 直接離開整個迴圈，跟住嘅次數都唔會再跑。'
        },
        {
          title: '累加器：迴圈最常見嘅用途',
          analogy: '累加器好似一個錢罌：每次迴圈都扔錢入去，最後打開睇總數。' +
            '記得錢罌一開始要係 0。',
          code:
            "let sum = 0;              // 錢罌，一開始係 0\n" +
            "\n" +
            "for (let i = 1; i <= 10; i++) {\n" +
            "  sum = sum + i;          // 或者寫 sum += i;\n" +
            "}\n" +
            "\n" +
            "console.log('1 加到 10 係 ' + sum);\n" +
            "\n" +
            "// 順便數下有幾個雙數\n" +
            "let evenCount = 0;\n" +
            "for (let i = 1; i <= 10; i++) {\n" +
            "  if (i % 2 === 0) {\n" +
            "    evenCount++;\n" +
            "  }\n" +
            "}\n" +
            "console.log('雙數有 ' + evenCount + ' 個');",
          lang: 'js',
          result: '1 加到 10 係 55\n雙數有 5 個',
          tip: 'sum += i 係簡寫，等於 sum = sum + i。累加器一定要喺迴圈外開，' +
            '如果寫喺迴圈內，每次都重新變 0，最後只會加到最後一個數。'
        }
      ],
      puzzle: {
        title: '練習 5：用迴圈計 1 加到 5',
        task: '用 <code>for</code> 迴圈計算 1 + 2 + 3 + 4 + 5 嘅總和，並印出答案（應該係 <code>15</code>）。',
        hint: '開一個 <code>let sum = 0;</code>，然後 <code>for (let i = 1; i &lt;= 5; i++) { sum += i; }</code>，最後印 sum。',
        starter:
          "let sum = 0;\n" +
          "\n" +
          "// 用 for 迴圈把 1 到 5 加落 sum\n" +
          "// 喺呢度寫你嘅程式碼\n" +
          "\n" +
          "console.log('總和係 ' + sum);\n",
        solution:
          "let sum = 0;\n" +
          "\n" +
          "for (let i = 1; i <= 5; i++) {\n" +
          "  sum += i;\n" +
          "}\n" +
          "\n" +
          "console.log('總和係 ' + sum);",
        mode: 'console',
        lang: 'js',
        expect: '15'
      },
      quiz: [
        {
          type: 'mc',
          q: 'for (let i = 0; i < 3; i++) { console.log(i); } 會印出咩？',
          options: ['1 2 3', '0 1 2', '0 1 2 3', '3 2 1'],
          answer: 1,
          explain: '由 i = 0 開始，條件 i < 3 為止，所以印 0、1、2 共三次。'
        },
        {
          type: 'tf',
          q: '判斷：while 迴圈如果條件永遠為 true，就會變成死循環。',
          answer: 0,
          explain: '條件永遠成立就永遠跑唔完，所以 while 內必須有嘢令條件最終變成 false（例如 count++）。'
        },
        {
          type: 'mc',
          q: '喺迴圈內，break 嘅作用係咩？',
          options: ['跳過今次，繼續下一次', '立即離開整個迴圈', '重新由頭開始', '暫停一秒'],
          answer: 1,
          explain: 'break 直接結束整個迴圈；只跳過一次嘅係 continue。'
        },
        {
          type: 'tf',
          q: '判斷：sum += i 同 sum = sum + i 係同一個意思。',
          answer: 0,
          explain: '+= 係複合賦值運算子，意思完全一樣，只係寫短啲，呢句係對。'
        },
        {
          type: 'mc',
          q: '以下邊個 for 迴圈會執行 5 次？',
          options: [
            'for (let i = 0; i < 5; i++)',
            'for (let i = 1; i < 5; i++)',
            'for (let i = 0; i <= 4; i--)',
            'for (let i = 5; i > 0; i++)'
          ],
          answer: 0,
          explain: 'i 會係 0、1、2、3、4，共 5 次。第二個只有 4 次；第三、四個嘅 i 會一路遠離條件，變成死循環。'
        },
        {
          type: 'mc',
          q: 'for (let i = 1; i <= 3; i++) { console.log(i * 2); } 會印出咩？',
          options: ['2 4 6', '1 2 3', '2 4 6 8', '6 4 2'],
          answer: 0,
          explain: 'i 由 1 到 3，每次乘 2 再印，所以係 2、4、6。'
        },
        {
          type: 'tf',
          q: '判斷：continue 會即刻離開整個迴圈，之後嘅次數都唔會再跑。',
          answer: 1,
          explain: 'continue 只係跳過今次剩落嚟嘅程式碼，跟住繼續下一次；離開整個迴圈嘅係 break。'
        },
        {
          type: 'mc',
          q: '用迴圈把 1 加到 5，最後 sum 係幾多？',
          options: ['5', '10', '15', '20'],
          answer: 2,
          explain: '1 + 2 + 3 + 4 + 5 = 15。呢種「一路加落去」嘅寫法叫累加器。'
        },
        {
          type: 'mc',
          q: '以下邊個係死循環（永遠跑唔完）？',
          options: [
            'for (let i = 0; i < 3; i++) { }',
            'for (let i = 3; i > 0; i--) { }',
            'for (let i = 0; i < 3; i--) { }',
            'while (count < 3) { count++; }'
          ],
          answer: 2,
          explain: 'i 由 0 開始越減越細，條件 i < 3 永遠成立，所以永遠跑唔完。'
        }
      ]
    },

    /* ================= c6：函數 ================= */
    {
      id: 'c6',
      title: '函數',
      icon: '🧰',
      summary: '把程式碼打包成可以重複使用嘅工具，仲有作用域概念。',
      points: [
        {
          title: '函數係一部「機器」',
          analogy: '函數好似一部榨汁機：你放水果入去（參數），佢吐果汁出嚟（回傳值）。' +
            '同一部機可以不停用，唔使每次重新砌一部。',
          code:
            "function makeJuice(fruit) {\n" +
            "  return fruit + '汁';\n" +
            "}\n" +
            "\n" +
            "console.log(makeJuice('橙'));\n" +
            "console.log(makeJuice('蘋果'));\n" +
            "console.log(makeJuice('西瓜'));",
          lang: 'js',
          result: '橙汁\n蘋果汁\n西瓜汁',
          tip: 'function 係關鍵字，makeJuice 係函數名，fruit 係參數，return 係交貨。' +
            '寫好之後，只要寫 makeJuice(值) 就可以叫佢做嘢。'
        },
        {
          title: '參數同回傳值（return）',
          analogy: '參數係你放入機器嘅材料；return 係機器交返畀你嘅成品。' +
            '如果冇 return，機器交返嘅係 undefined（即係冇嘢）。',
          code:
            "// 有 return：交返個結果\n" +
            "function add(a, b) {\n" +
            "  return a + b;\n" +
            "}\n" +
            "let result = add(3, 4);\n" +
            "console.log('3 + 4 = ' + result);\n" +
            "\n" +
            "// 冇 return：交返 undefined\n" +
            "function sayHi(name) {\n" +
            "  console.log('你好 ' + name);\n" +
            "}\n" +
            "let nothing = sayHi('阿明');\n" +
            "console.log('sayHi 交返嘅係：' + nothing);",
          lang: 'js',
          result: '3 + 4 = 7\n你好 阿明\nsayHi 交返嘅係：undefined',
          tip: 'return 之後嘅程式碼永遠唔會執行，所以 return 亦可以當「提早收工」用。' +
            '函數內 console.log 只係「講出嚟」，唔等於交返個值。'
        },
        {
          title: '箭頭函數（Arrow Function）',
          analogy: '箭頭函數係函數嘅精簡版，好似把長句子縮短：同一個意思，打字少啲，' +
            '現代 JS 好常用。',
          code:
            "// 傳統寫法\n" +
            "function double(n) {\n" +
            "  return n * 2;\n" +
            "}\n" +
            "\n" +
            "// 箭頭函數寫法\n" +
            "const double2 = (n) => {\n" +
            "  return n * 2;\n" +
            "};\n" +
            "\n" +
            "// 更精簡：只有一行表達式，可以省略 return 同大括號\n" +
            "const double3 = (n) => n * 2;\n" +
            "\n" +
            "console.log(double(5));\n" +
            "console.log(double2(5));\n" +
            "console.log(double3(5));",
          lang: 'js',
          result: '10\n10\n10',
          tip: '（n）=> n * 2 之中，箭頭之後係表達式，會自動當成回傳值；' +
            '一寫成大括號 { }，就要自己寫 return。'
        },
        {
          title: '預設參數值',
          analogy: '好似自動販賣機嘅預設選項：你唔揀，佢就畀你預設嗰個，程式唔會因為少咗資料而爆。',
          code:
            "function greet(name = '訪客') {\n" +
            "  return '你好，' + name + '！';\n" +
            "}\n" +
            "\n" +
            "console.log(greet('阿花'));\n" +
            "console.log(greet());          // 冇傳參數，用預設值\n" +
            "\n" +
            "function total(price, qty = 1) {\n" +
            "  return price * qty;\n" +
            "}\n" +
            "console.log(total(20));        // 只買一件\n" +
            "console.log(total(20, 3));     // 買三件",
          lang: 'js',
          result: '你好，阿花！\n你好，訪客！\n20\n60',
          tip: '預設值要寫喺參數右邊，寫法係 name = \'訪客\'。' +
            '有人傳 undefined 入去都會用預設值，但傳 null 就唔會。'
        },
        {
          title: '函數可以呼喚另一個函數',
          analogy: '好似廚房分工：洗菜嘅人洗完交畀切菜嘅人，切完交畀炒鑊嘅人。' +
            '細細件分開做，好過一個巨型函數做晒所有嘢。',
          code:
            "function isEven(n) {\n" +
            "  return n % 2 === 0;\n" +
            "}\n" +
            "\n" +
            "function describe(n) {\n" +
            "  if (isEven(n)) {\n" +
            "    return n + ' 係雙數';\n" +
            "  }\n" +
            "  return n + ' 係單數';\n" +
            "}\n" +
            "\n" +
            "for (let i = 1; i <= 4; i++) {\n" +
            "  console.log(describe(i));\n" +
            "}",
          lang: 'js',
          result: '1 係單數\n2 係雙數\n3 係單數\n4 係雙數',
          tip: '一個函數只做一件事，程式就會易讀、易除錯、易重用。' +
            'describe 唔需要知 isEven 點寫，只要知佢會回傳 true / false 就夠。'
        },
        {
          title: '作用域：變數嘅活動範圍',
          analogy: '作用域好似公司嘅樓層權限：入到公司（函數）就睇得到大堂（外部）嘅告示，' +
            '但大堂嘅人睇唔到你自己房間（函數內）嘅嘢。',
          code:
            "let globalMsg = '我係函數外嘅變數';\n" +
            "\n" +
            "function show() {\n" +
            "  let localMsg = '我係函數內嘅變數';\n" +
            "  console.log(globalMsg);   // 函數內睇得到函數外\n" +
            "  console.log(localMsg);\n" +
            "}\n" +
            "\n" +
            "show();\n" +
            "\n" +
            "// 函數外睇唔到函數內：console.log(localMsg);\n" +
            "// 會報 ReferenceError: localMsg is not defined\n" +
            "\n" +
            "function counter() {\n" +
            "  let n = 0;      // 每次呼叫都重新開一個 n\n" +
            "  n++;\n" +
            "  return n;\n" +
            "}\n" +
            "console.log(counter());\n" +
            "console.log(counter());   // 又係 1，唔會變 2",
          lang: 'js',
          result: '我係函數外嘅變數\n我係函數內嘅變數\n1\n1',
          tip: '函數內用 let / const 宣告嘅變數，函數外用唔到；' +
            '想「記住」上次嘅值，就要把變數開喺函數外。'
        }
      ],
      puzzle: {
        title: '練習 6：寫一個計長乘闊嘅函數',
        task: '寫一個箭頭函數 <code>area</code>，收「長」同「闊」兩個參數，回傳長乘闊嘅結果。' +
          '然後印出 <code>area(5, 4)</code> 嘅結果（應該係 20）。',
        hint: '<code>const area = (w, h) =&gt; w * h;</code>，然後 <code>console.log(area(5, 4));</code>',
        starter:
          "// 寫一個箭頭函數 area\n" +
          "// const area = ...\n" +
          "\n" +
          "// 印出 area(5, 4)\n",
        solution:
          "const area = (w, h) => w * h;\n" +
          "\n" +
          "console.log(area(5, 4));",
        mode: 'console',
        lang: 'js',
        expect: '20'
      },
      quiz: [
        {
          type: 'mc',
          q: 'function f(x) { return x * 3; }\nconsole.log(f(4)); 輸出係咩？',
          options: ['7', '12', '43', 'undefined'],
          answer: 1,
          explain: '把 4 傳入參數 x，函數回傳 4 * 3 = 12。'
        },
        {
          type: 'tf',
          q: '判斷：函數如果冇寫 return，佢回傳嘅值係 undefined。',
          answer: 0,
          explain: '冇 return 嘅函數會自動回傳 undefined，所以拎到嘅結果係 undefined，呢句係對。'
        },
        {
          type: 'mc',
          q: '以下邊個係箭頭函數嘅正確寫法？',
          options: [
            'const f = (a) => a + 1;',
            'const f = (a) -> a + 1;',
            'function f => a + 1;',
            'const f = arrow(a) { a + 1 };'
          ],
          answer: 0,
          explain: '箭頭函數用 => 符號；只有單一表達式時，可以省略 return 同大括號。'
        },
        {
          type: 'mc',
          q: 'function greet(name = "訪客") { return "Hi " + name; }\ngreet(); 會回傳咩？',
          options: ['"Hi "', '"Hi undefined"', '"Hi 訪客"', 'Error'],
          answer: 2,
          explain: '冇傳參數時會用預設值 "訪客"，所以回傳 "Hi 訪客"。'
        },
        {
          type: 'mc',
          q: 'function f() { return 1; console.log("hi"); }\nf();\n呢個網站嘅輸出區會顯示咩？',
          options: ['冇任何輸出', '1', 'hi', '1 同 hi'],
          answer: 0,
          explain: 'f() 只係回傳 1，冇用 console.log 印出嚟；而 return 之後嘅 console.log 永遠唔會執行。'
        },
        {
          type: 'tf',
          q: '判斷：函數內用 let 宣告嘅變數，喺函數外一樣用得到。',
          answer: 1,
          explain: '函數內宣告嘅變數只有函數內部睇得到，函數外用會報 ReferenceError。'
        },
        {
          type: 'mc',
          q: 'const f = (a) => a * 2;\nconsole.log(f(3)); 輸出係咩？',
          options: ['3', '5', '6', 'undefined'],
          answer: 2,
          explain: '箭頭之後嘅表達式就係回傳值，所以 3 * 2 = 6。'
        },
        {
          type: 'mc',
          q: 'return 喺函數內嘅作用係咩？',
          options: [
            '把結果交返畀呼叫佢嘅地方，同時即刻結束函數',
            '把結果印出螢幕',
            '重新開始執行函數',
            '宣告一個新變數'
          ],
          answer: 0,
          explain: 'return 負責交貨同收工：交返個值，同時函數即刻結束，之後嘅程式碼唔會再跑。想印出嚟要另外寫 console.log。'
        },
        {
          type: 'tf',
          q: '判斷：一個函數內可以呼喚另一個函數。',
          answer: 0,
          explain: '函數之間可以互相呼喚，把大問題拆成細步驟，係好常見嘅做法，呢句係對。'
        }
      ]
    },

    /* ================= c7：陣列 ================= */
    {
      id: 'c7',
      title: '陣列',
      icon: '📋',
      summary: '一次過存放一堆有次序嘅資料，同常用嘅陣列方法。',
      points: [
        {
          title: '陣列：一個有次序嘅清單',
          analogy: '陣列好似超市收銀排隊：一個跟一個，位置由 0 開始數。' +
            '排第一嘅人，位置係 0，唔係 1。',
          code:
            "let fruits = ['蘋果', '香蕉', '橙'];\n" +
            "\n" +
            "console.log(fruits[0]);                   // 蘋果（第 0 個）\n" +
            "console.log(fruits[1]);                   // 香蕉\n" +
            "console.log(fruits[2]);                   // 橙\n" +
            "console.log(fruits[3]);                   // undefined（冇第 3 個）\n" +
            "console.log(fruits.length);               // 3（有幾個項目）\n" +
            "console.log(fruits[fruits.length - 1]);   // 橙（最後一個）",
          lang: 'js',
          result: '蘋果\n香蕉\n橙\nundefined\n3\n橙',
          tip: '記住「索引由 0 開始」呢個規則，可以避免一大半初學者錯誤。' +
            '要拎最後一個，用 arr[arr.length - 1] 最穩陣。'
        },
        {
          title: 'push / pop / unshift / shift',
          analogy: '陣列好似一疊碟：push 放一隻喺最尾，pop 由最尾拎走；' +
            'unshift 塞入最前，shift 由最前拎走。',
          code:
            "let queue = ['A', 'B'];\n" +
            "\n" +
            "queue.push('C');          // 尾加\n" +
            "console.log(queue);\n" +
            "\n" +
            "queue.unshift('X');       // 頭加\n" +
            "console.log(queue);\n" +
            "\n" +
            "let last = queue.pop();   // 尾拎走\n" +
            "console.log('拎走咗：' + last);\n" +
            "console.log(queue);\n" +
            "\n" +
            "let first = queue.shift();  // 頭拎走\n" +
            "console.log('拎走咗：' + first);\n" +
            "console.log(queue);",
          lang: 'js',
          result: "[ 'A', 'B', 'C' ]\n[ 'X', 'A', 'B', 'C' ]\n拎走咗：C\n[ 'X', 'A', 'B' ]\n拎走咗：X\n[ 'A', 'B' ]",
          tip: '呢四個方法都會直接改動原本嘅陣列（叫做「原地修改」）。' +
            '另外，console.log 印陣列嘅格式會跟執行環境有少少差別，睇內容就得。'
        },
        {
          title: 'forEach：逐個處理',
          analogy: 'forEach 好似班主任點名：逐個同學叫一次，逐個處理，最後冇交返任何嘢。',
          code:
            "let scores = [88, 72, 95];\n" +
            "\n" +
            "scores.forEach(function (score, index) {\n" +
            "  console.log('第 ' + index + ' 位：' + score + ' 分');\n" +
            "});\n" +
            "\n" +
            "// 用箭頭函數寫更短\n" +
            "scores.forEach((score) => {\n" +
            "  console.log('分數：' + score);\n" +
            "});",
          lang: 'js',
          result: '第 0 位：88 分\n第 1 位：72 分\n第 2 位：95 分\n分數：88\n分數：72\n分數：95',
          tip: '回呼函數嘅第二個參數係索引（由 0 開始）。forEach 冇回傳值，只係「行一次」。'
        },
        {
          title: 'map：每個都變身，產生新陣列',
          analogy: 'map 好似影印機加濾鏡：把清單每個項目都加工一次，產生一張新清單，' +
            '原本嗰張唔會變。',
          code:
            "let prices = [10, 20, 30];\n" +
            "\n" +
            "let doubled = prices.map((p) => p * 2);\n" +
            "console.log(doubled);\n" +
            "\n" +
            "let withTax = prices.map((p) => (p * 1.1).toFixed(2));\n" +
            "console.log(withTax);\n" +
            "\n" +
            "console.log('原本嘅 prices 冇變：' + prices);",
          lang: 'js',
          result: "[ 20, 40, 60 ]\n[ '11.00', '22.00', '33.00' ]\n原本嘅 prices 冇變：10,20,30",
          tip: 'map 一定回傳一個新陣列，長度同原本一樣。' +
            '如果回呼函數冇 return，新陣列每個位都會係 undefined。'
        },
        {
          title: 'filter：揀出符合條件嘅',
          analogy: 'filter 好似一個篩：只留下符合條件嘅嘢，其餘篩走。' +
            '好似喺班房只揀合格嘅同學出嚟。',
          code:
            "let scores = [45, 88, 60, 30, 95];\n" +
            "\n" +
            "let pass = scores.filter((s) => s >= 60);\n" +
            "console.log('合格：' + pass);\n" +
            "\n" +
            "let fail = scores.filter((s) => s < 60);\n" +
            "console.log('唔合格：' + fail);\n" +
            "\n" +
            "console.log('合格人數：' + pass.length);",
          lang: 'js',
          result: '合格：88,60,95\n唔合格：45,30\n合格人數：3',
          tip: 'filter 嘅回呼函數要回傳 true / false：true 就保留嗰個項目。' +
            '用 + 直接駁陣列，會自動變成用逗號分隔嘅文字。'
        },
        {
          title: 'join：把陣列變返一句文字',
          analogy: 'join 好似把一疊卡片用膠紙連成一句：中間塞咩都由你決定，' +
            '可以係「、」，可以係「 + 」，亦可以咩都唔塞。',
          code:
            "let fruits = ['蘋果', '香蕉', '橙'];\n" +
            "\n" +
            "console.log(fruits.join('、'));     // 用「、」駁埋\n" +
            "console.log(fruits.join(' + '));\n" +
            "console.log(fruits.join(''));       // 完全貼埋\n" +
            "console.log(fruits.length + ' 種生果');\n" +
            "console.log('直接印：' + fruits);    // 用 + 會自動用逗號駁埋",
          lang: 'js',
          result: '蘋果、香蕉、橙\n蘋果 + 香蕉 + 橙\n蘋果香蕉橙\n3 種生果\n直接印：蘋果,香蕉,橙',
          tip: 'join 唔會改動原本嘅陣列，只係回傳一句新字串，好適合用嚟砌顯示文字。'
        }
      ],
      puzzle: {
        title: '練習 7：用 map 幫價錢加價 10%',
        task: '有一個價錢陣列，請用 <code>map</code> 產生一個「加價 10%、四捨五入到整數」嘅新陣列，' +
          '再印出嚟（提示：<code>Math.round(p * 1.1)</code>）。',
        hint: '<code>let newPrices = prices.map((p) =&gt; Math.round(p * 1.1));</code>，然後 <code>console.log(newPrices);</code>',
        starter:
          "let prices = [100, 200, 300];\n" +
          "\n" +
          "// 用 map 產生加價 10% 嘅新陣列（記得四捨五入）\n" +
          "// 喺呢度寫你嘅程式碼\n",
        solution:
          "let prices = [100, 200, 300];\n" +
          "\n" +
          "let newPrices = prices.map((p) => Math.round(p * 1.1));\n" +
          "console.log(newPrices);",
        mode: 'console',
        lang: 'js',
        expect: '220'
      },
      quiz: [
        {
          type: 'mc',
          q: 'let arr = ["a", "b", "c"];\nconsole.log(arr[1]); 輸出係咩？',
          options: ['"a"', '"b"', '"c"', 'undefined'],
          answer: 1,
          explain: '索引由 0 開始：arr[0] 係 "a"，arr[1] 係 "b"，arr[2] 係 "c"。'
        },
        {
          type: 'mc',
          q: '邊個方法會回傳一個新陣列？',
          options: ['forEach', 'map', 'push', 'console.log'],
          answer: 1,
          explain: 'map 回傳加工後嘅新陣列；forEach 冇回傳值；push 回傳新長度（一個數字）。'
        },
        {
          type: 'tf',
          q: '判斷：arr.length 會回傳陣列內有幾個項目。',
          answer: 0,
          explain: 'length 係陣列嘅長度，例如 [1, 2, 3].length 係 3，呢句係對。'
        },
        {
          type: 'mc',
          q: '要由 [45, 88, 60] 揀出 60 分或以上嘅項目，應該用邊個方法？',
          options: ['map', 'filter', 'push', 'pop'],
          answer: 1,
          explain: 'filter 專門按條件篩選，回傳符合條件嘅新陣列；map 係把每個項目加工，唔會篩走嘢。'
        },
        {
          type: 'mc',
          q: 'let q = [1, 2];\nq.push(3);\nconsole.log(q.length); 輸出係咩？',
          options: ['2', '3', '4', 'undefined'],
          answer: 1,
          explain: 'push 喺尾部加一個，陣列變成 [1, 2, 3]，長度係 3。'
        },
        {
          type: 'mc',
          q: 'console.log([1, 2, 3].join("-")); 輸出係咩？',
          options: ['1-2-3', '123', '1,2,3', 'undefined'],
          answer: 0,
          explain: 'join 會用你畀嘅分隔符號把每個項目駁埋，所以係 1-2-3（一個字串）。'
        },
        {
          type: 'tf',
          q: '判斷：陣列嘅索引由 1 開始數。',
          answer: 1,
          explain: '陣列索引由 0 開始，arr[0] 才係第一個項目，所以呢句係錯。'
        },
        {
          type: 'mc',
          q: 'let a = [10, 20, 30];\nconsole.log(a[a.length - 1]); 輸出係咩？',
          options: ['10', '20', '30', 'undefined'],
          answer: 2,
          explain: 'a.length 係 3，所以 a[2] 就係最後一個項目 30。'
        },
        {
          type: 'mc',
          q: 'arr.pop() 嘅作用係咩？',
          options: [
            '由尾部拎走一個，並回傳嗰個值',
            '由頭部拎走一個，並回傳嗰個值',
            '在尾部加一個新項目',
            '清空整個陣列'
          ],
          answer: 0,
          explain: 'pop 由尾部拎走一個並回傳佢；由頭部拎走係 shift，尾部新增係 push。'
        }
      ]
    },

    /* ================= c8：物件 ================= */
    {
      id: 'c8',
      title: '物件',
      icon: '🗂️',
      summary: '用 key-value 描述一個「有屬性、有技能」嘅嘢。',
      points: [
        {
          title: '物件：一組有名嘅資料',
          analogy: '物件好似一張學生證：有姓名、學號、班別，每一格都有「名稱」同「內容」。' +
            '唔似陣列只靠位置認人。',
          code:
            "let student = {\n" +
            "  name: '阿明',\n" +
            "  class: '5A',\n" +
            "  score: 88\n" +
            "};\n" +
            "\n" +
            "console.log(student.name);      // 點記法\n" +
            "console.log(student['class']);  // 括號記法（屬性名係字串）\n" +
            "console.log(student.score + 5);",
          lang: 'js',
          result: '阿明\n5A\n93',
          tip: 'key 叫屬性名，value 叫屬性值，中間用冒號分隔，一格一格用逗號隔開。' +
            '屬性名係固定嘅話，用點記法最易讀。'
        },
        {
          title: '新增、修改、刪除屬性',
          analogy: '好似填表格：可以加一行新資料、改一格內容，或者擦走一行。',
          code:
            "let user = { name: '阿花' };\n" +
            "\n" +
            "user.age = 18;             // 新增（個格本來唔存在）\n" +
            "user.name = '陳阿花';       // 修改（個格本來有）\n" +
            "console.log(user);\n" +
            "\n" +
            "delete user.age;           // 刪除屬性\n" +
            "console.log(user);\n" +
            "\n" +
            "console.log('有冇 age？ ' + ('age' in user));",
          lang: 'js',
          result: "{ name: '陳阿花', age: 18 }\n{ name: '陳阿花' }\n有冇 age？ false",
          tip: '用 delete 刪走屬性係可行嘅，但實務上唔算常用；' +
            '想檢查某個屬性存唔存在，用 in 運算子，唔好用 == null。'
        },
        {
          title: '物件內放方法（函數）',
          analogy: '物件唔止可以放資料，仲可以放技能。好似一部手機有型號（資料）同打電話（技能）。' +
            '放喺物件內嘅函數，叫做「方法」。',
          code:
            "let dog = {\n" +
            "  name: '小白',\n" +
            "  bark: function () {\n" +
            "    return '汪汪！我係 ' + this.name;\n" +
            "  }\n" +
            "};\n" +
            "\n" +
            "console.log(dog.bark());\n" +
            "\n" +
            "// 現代寫法：方法簡寫\n" +
            "let cat = {\n" +
            "  name: '花花',\n" +
            "  meow() {\n" +
            "    return '喵～我係 ' + this.name;\n" +
            "  }\n" +
            "};\n" +
            "console.log(cat.meow());",
          lang: 'js',
          result: '汪汪！我係 小白\n喵～我係 花花',
          tip: '方法內嘅 this 代表「叫呢個方法嘅物件」。' +
            '如果用箭頭函數寫方法，this 會唔同咗，所以物件方法通常用傳統寫法或者簡寫。'
        },
        {
          title: '解構賦值：快速拆出屬性',
          analogy: '好似拆速遞箱：唔使整箱搬，直接拎出你要嘅嗰幾件。',
          code:
            "let product = { title: '無線耳機', price: 399, brand: 'SoundX' };\n" +
            "\n" +
            "// 傳統寫法：一行一個\n" +
            "let t1 = product.title;\n" +
            "let p1 = product.price;\n" +
            "\n" +
            "// 解構寫法：一行搞掂\n" +
            "let { title, price } = product;\n" +
            "console.log(title + ' 賣 ' + price + ' 蚊');\n" +
            "\n" +
            "// 順便改名\n" +
            "let { brand: brandName } = product;\n" +
            "console.log('牌子：' + brandName);",
          lang: 'js',
          result: '無線耳機 賣 399 蚊\n牌子：SoundX',
          tip: '大括號內嘅名要同屬性名一樣，除非你用冒號改名（brand: brandName）。' +
            '解構只係快手拎值，唔會改動原本嘅物件。'
        },
        {
          title: '物件陣列：真實世界嘅資料樣貌',
          analogy: '物件係「一張卡」，物件陣列就係「一疊卡」。' +
            '你嘅購物車、聯絡人清單、功課表，通常都係呢個樣。',
          code:
            "let products = [\n" +
            "  { name: '耳機', price: 399 },\n" +
            "  { name: '滑鼠', price: 129 },\n" +
            "  { name: '鍵盤', price: 259 }\n" +
            "];\n" +
            "\n" +
            "// 逐個印出\n" +
            "products.forEach((p) => {\n" +
            "  console.log(p.name + '：$' + p.price);\n" +
            "});\n" +
            "\n" +
            "// 篩選 200 蚊以下\n" +
            "let cheap = products.filter((p) => p.price < 200);\n" +
            "console.log('平嘢有：' + cheap.map((p) => p.name).join('、'));\n" +
            "\n" +
            "// 計總數\n" +
            "let total = products.reduce((sum, p) => sum + p.price, 0);\n" +
            "console.log('總值 $' + total);",
          lang: 'js',
          result: '耳機：$399\n滑鼠：$129\n鍵盤：$259\n平嘢有：滑鼠\n總值 $787',
          tip: 'reduce 係進階少少嘅方法：把整個陣列「摺疊」成一個值（例如總數）。' +
            '最後嗰個 0 係起始值，唔寫嘅話會由第一個項目開始。'
        },
        {
          title: '用 Object.keys / Object.values 列出屬性',
          analogy: 'Object.keys 好似把一個櫃嘅抽屜標籤逐個讀出嚟；' +
            'Object.values 就係打開每個抽屜睇下抽屜內嘅嘢。',
          code:
            "let score = { 中文: 88, 英文: 92, 數學: 79 };\n" +
            "\n" +
            "console.log(Object.keys(score));      // 全部屬性名\n" +
            "console.log(Object.values(score));    // 全部屬性值\n" +
            "console.log('科目數：' + Object.keys(score).length);\n" +
            "\n" +
            "// 用 for...of 逐個印\n" +
            "for (let subject of Object.keys(score)) {\n" +
            "  console.log(subject + '：' + score[subject] + ' 分');\n" +
            "}",
          lang: 'js',
          result: "[ '中文', '英文', '數學' ]\n[ 88, 92, 79 ]\n科目數：3\n中文：88 分\n英文：92 分\n數學：79 分",
          tip: 'Object.keys 回傳嘅係一個陣列，所以可以配 forEach、map、length 一齊用。' +
            '屬性名有空格或者係變數嘅時候，要用括號記法 score[subject]。'
        }
      ],
      puzzle: {
        title: '練習 8：印出一句自我介紹',
        task: '以下已經有一個物件 <code>me</code>。請用點記法，印出「<code>阿明 今年 20 歲</code>」呢句。',
        hint: '用 <code>me.name</code> 同 <code>me.age</code> 加埋文字，記得中間嘅空格要自己寫，' +
          '最後用 <code>console.log()</code> 印出嚟。',
        starter:
          "let me = {\n" +
          "  name: '阿明',\n" +
          "  age: 20\n" +
          "};\n" +
          "\n" +
          "// 用 me.name 同 me.age 印出一句介紹\n",
        solution:
          "let me = {\n" +
          "  name: '阿明',\n" +
          "  age: 20\n" +
          "};\n" +
          "\n" +
          "console.log(me.name + ' 今年 ' + me.age + ' 歲');",
        mode: 'console',
        lang: 'js',
        expect: '阿明 今年 20 歲'
      },
      quiz: [
        {
          type: 'mc',
          q: 'let o = { a: 1, b: 2 };\nconsole.log(o.b); 輸出係咩？',
          options: ['1', '2', '"b"', 'undefined'],
          answer: 1,
          explain: '用點記法取出 b 屬性，值係 2；o.a 才係 1。'
        },
        {
          type: 'mc',
          q: '邊個寫法可以喺物件 o 新增一個屬性 color？',
          options: ['o.color = "red";', 'o.push("color");', 'let color = o;', 'o[0] = "red";'],
          answer: 0,
          explain: '直接指定一個唔存在嘅屬性名就會新增，例如 o.color = "red"。物件冇 push 方法，o[0] 只會加一個叫 "0" 嘅屬性。'
        },
        {
          type: 'tf',
          q: '判斷：let { name } = person; 會把 person.name 拆出嚟，放入一個叫 name 嘅變數。',
          answer: 0,
          explain: '呢個叫解構賦值：屬性名要對應，會建立同名變數並放入對應嘅值，所以呢句係對。'
        },
        {
          type: 'mc',
          q: '物件內嘅函數通常叫咩？',
          options: ['參數', '方法（method）', '索引', '陣列'],
          answer: 1,
          explain: '物件內嘅函數叫「方法」；喺方法內可以用 this 指向該物件自己。'
        },
        {
          type: 'mc',
          q: 'let p = { name: "明" };\nconsole.log(p.age); 輸出係咩？',
          options: ['null', 'undefined', '0', 'Error'],
          answer: 1,
          explain: '物件冇 age 呢個屬性，唔係報錯，而係回傳 undefined。所以要小心比較，例如寫 p.age === undefined 嚟檢查。'
        },
        {
          type: 'mc',
          q: 'Object.keys({ a: 1, b: 2 }) 回傳咩？',
          options: ["[ 'a', 'b' ]", "[ 'a', 'b', 'c' ]", '[1, 2]', '2'],
          answer: 0,
          explain: 'Object.keys 回傳一個由屬性名組成嘅陣列；屬性值要用 Object.values 才拎到。'
        },
        {
          type: 'tf',
          q: '判斷：讀取屬性時，點記法（o.name）同括號記法（o["name"]）都行得通。',
          answer: 0,
          explain: '兩種寫法都可以讀到屬性；括號記法方便用變數做屬性名，例如 o[key]，所以呢句係對。'
        },
        {
          type: 'mc',
          q: 'let o = { a: 1 };\no.a = 5;\nconsole.log(o.a); 輸出係咩？',
          options: ['1', '5', 'undefined', 'Error'],
          answer: 1,
          explain: '物件嘅屬性值可以隨時改，o.a = 5 會蓋掉原本嘅 1，所以印出 5。'
        },
        {
          type: 'mc',
          q: '喺 dog.bark() 呢個方法內，this 代表咩？',
          options: ['dog 呢個物件', 'bark 呢個函數自己', 'undefined', '一個新嘅空物件'],
          answer: 0,
          explain: '方法用邊個物件呼叫，this 就指向嗰個物件；所以 dog.bark() 內 this.name 就係 dog.name。'
        }
      ]
    },

    /* ================= c9：DOM 操作 ================= */
    {
      id: 'c9',
      title: 'DOM 操作',
      icon: '🖱️',
      summary: '用 JS 揀節點、改內容、監聽事件，令網頁真的動起來。',
      points: [
        {
          title: 'DOM 係咩？用 querySelector 揀節點',
          analogy: 'DOM 就係瀏覽器幫你畫嘅「家族圖」：每個 HTML 標籤都係圖嘅一個節點。' +
            'JS 可以沿住呢張圖搵到任何一個節點，然後改佢。',
          code:
            '// 假設網頁內已經有：<div id="demo">原本嘅文字</div> 同 <button id="btn">撳我</button>\n' +
            'const btn = document.querySelector("#btn");     // # = id\n' +
            'const demo = document.querySelector("#demo");   // . = class\n' +
            '\n' +
            'btn.addEventListener("click", () => {\n' +
            '  demo.textContent = "文字被 JS 改咗！";\n' +
            '});\n' +
            '\n' +
            'console.log("撳之前：" + demo.textContent);\n' +
            'btn.click();   // 用程式模擬撳一下（等於真人撳一下）\n' +
            'console.log("撳完之後：" + demo.textContent);',
          lang: 'js',
          result: '撳之前：原本嘅文字\n撳完之後：文字被 JS 改咗！',
          preview: {
            html:
              '<div id="demo">原本嘅文字</div>\n' +
              '<button id="btn">撳我</button>\n' +
              '<script>\n' +
              '  document.querySelector("#btn").addEventListener("click", function () {\n' +
              '    document.querySelector("#demo").textContent = "文字被 JS 改咗！";\n' +
              '  });\n' +
              '<\/script>'
          },
          tip: 'querySelector 只回傳第一個符合嘅節點，搵唔到會回傳 null（所以要用之前最好檢查一下）；' +
            '想一次過拎晒全部就用 querySelectorAll。'
        },
        {
          title: '改文字同改樣式',
          analogy: '揀到節點之後，就好似揀到一個燈箱：可以換節點內嘅字，可以換顏色同大細。',
          code:
            'const h = document.createElement("h1");\n' +
            '\n' +
            'h.textContent = "你好，DOM！";   // 改文字\n' +
            'h.style.color = "teal";          // 改顏色（CSS 屬性名用 camelCase）\n' +
            'h.style.fontSize = "22px";       // 改字級\n' +
            'h.classList.add("title");        // 加一個 CSS class\n' +
            '\n' +
            'document.body.appendChild(h);\n' +
            '\n' +
            'console.log("文字內容：" + h.textContent);\n' +
            'console.log("有冇 title class？ " + h.classList.contains("title"));',
          lang: 'js',
          result: '文字內容：你好，DOM！\n有冇 title class？ true',
          preview: {
            html:
              '<p style="margin:6px 0;font-size:14px;color:gray">以下嗰句本來係「未改嘅文字」（灰色、16px），載入之後即刻被 JS 改咗：</p>\n' +
              '<h1 id="demo" style="margin:6px 0;color:gray;font-size:16px">未改嘅文字</h1>\n' +
              '<p id="log" style="margin:6px 0;font-size:14px;color:teal">…</p>\n' +
              '<script>\n' +
              '  const demo = document.querySelector("#demo");\n' +
              '  demo.textContent = "你好，DOM！";        // 改文字\n' +
              '  demo.style.color = "teal";               // 改顏色\n' +
              '  demo.style.fontSize = "22px";            // 改字級\n' +
              '  demo.classList.add("title");             // 加一個 CSS class\n' +
              '  console.log("文字內容：" + demo.textContent);\n' +
              '  console.log("有冇 title class？ " + demo.classList.contains("title"));\n' +
              '  document.querySelector("#log").textContent =\n' +
              '    "class 而家係：" + demo.className + "（文字、顏色、大細都係 JS 改嘅）";\n' +
              '<\/script>'
          },
          tip: 'CSS 寫 font-size，喺 JS 要寫 fontSize（減號變 camelCase）。' +
            'textContent 只放純文字（安全）；innerHTML 可以放 HTML 標籤，但內容來自用家時會有風險。'
        },
        {
          title: 'createElement + appendChild：動態加節點',
          analogy: 'createElement 好似喺廚房整好一碟餸，appendChild 才係真正端上枱。' +
            '整好未端上去，網頁係見唔到嘅。',
          code:
            'const ul = document.createElement("ul");\n' +
            'document.body.appendChild(ul);\n' +
            '\n' +
            'const items = ["蝦餃", "燒賣", "叉燒包"];\n' +
            'let count = 0;\n' +
            '\n' +
            'items.forEach((text) => {\n' +
            '  const li = document.createElement("li");   // 開一個新節點\n' +
            '  li.textContent = text;\n' +
            '  ul.appendChild(li);                        // 掛上去 ul 內\n' +
            '  count++;\n' +
            '  console.log("加咗：" + li.textContent);\n' +
            '});\n' +
            '\n' +
            'console.log("總共 " + count + " 項");',
          lang: 'js',
          result: '加咗：蝦餃\n加咗：燒賣\n加咗：叉燒包\n總共 3 項',
          preview: {
            html:
              '<p style="margin:6px 0;font-size:14px;color:gray">以下個清單一開始係空嘅，載入時由 JS 一項一項加落去：</p>\n' +
              '<ul id="list" style="margin:6px 0 6px 22px"></ul>\n' +
              '<p id="log" style="margin:6px 0;font-size:14px;color:teal">…</p>\n' +
              '<script>\n' +
              '  const list = document.querySelector("#list");\n' +
              '  const items = ["蝦餃", "燒賣", "叉燒包"];\n' +
              '  let count = 0;\n' +
              '  items.forEach((text) => {\n' +
              '    const li = document.createElement("li");\n' +
              '    li.textContent = text;\n' +
              '    list.appendChild(li);\n' +
              '    count++;\n' +
              '    console.log("加咗：" + li.textContent);\n' +
              '  });\n' +
              '  console.log("總共 " + count + " 項");\n' +
              '  document.querySelector("#log").textContent =\n' +
              '    "ul.children.length 而家係 " + list.children.length + "，即係 " + count + " 項";\n' +
              '<\/script>'
          },
          tip: 'createElement 只係喺記憶體內整咗個節點，一定要 appendChild 掛上去網頁才見到。' +
            '想知一個節點有幾個子節點，可以睇 el.children.length。'
        },
        {
          title: '監聽事件：等用家行動',
          analogy: '事件監聽好似門鐘：你唔會不斷開門睇下有冇人，而係裝個門鐘，' +
            '有人撳就響。addEventListener 就係裝門鐘。',
          code:
            'const btn = document.createElement("button");\n' +
            'btn.textContent = "撳我";\n' +
            '\n' +
            'let count = 0;\n' +
            '\n' +
            '// 裝門鐘：click 事件\n' +
            'btn.addEventListener("click", () => {\n' +
            '  count++;\n' +
            '  btn.textContent = "撳咗 " + count + " 次";\n' +
            '  console.log("撳咗 " + count + " 次");\n' +
            '});\n' +
            '\n' +
            'document.body.appendChild(btn);\n' +
            '\n' +
            '// 用程式模擬撳兩下（等於真人撳兩下）\n' +
            'btn.click();\n' +
            'btn.click();',
          lang: 'js',
          result: '撳咗 1 次\n撳咗 2 次',
          preview: {
            html:
              '<button id="btn" style="font-size:15px;padding:6px 14px">撳我</button>\n' +
              '<p id="state" style="margin:8px 0;font-size:17px;color:teal">撳咗 0 次</p>\n' +
              '<p style="margin:6px 0;font-size:13px;color:gray">👆 試下撳呢粒掣：撳到第 3 次，呢行字同個掣都會變紅色。</p>\n' +
              '<script>\n' +
              '  const btn = document.querySelector("#btn");\n' +
              '  const state = document.querySelector("#state");\n' +
              '  let count = 0;\n' +
              '  btn.addEventListener("click", function () {\n' +
              '    count++;\n' +
              '    btn.textContent = "撳咗 " + count + " 次";\n' +
              '    state.textContent = "計數器：" + count;\n' +
              '    const hot = count >= 3;\n' +
              '    btn.style.color = hot ? "crimson" : "teal";\n' +
              '    state.style.color = hot ? "crimson" : "teal";\n' +
              '    console.log("撳咗 " + count + " 次");\n' +
              '  });\n' +
              '  btn.click();   // 先用程式模擬撳一下（同範例輸出第 1 行對應）\n' +
              '  btn.click();   // 再撳一下（同範例輸出第 2 行對應）\n' +
              '<\/script>'
          },
          tip: '事件名要係字串，例如 "click"、"input"、"submit"、"keydown"。' +
            'btn.click() 會觸發同一個 click 事件處理器，所以可以用嚟模擬用家撳掣。'
        },
        {
          title: '讀取輸入框嘅值',
          analogy: '好似填問卷：用家填咗嘢，你撳「提交」嗰刻就用 .value 拎返佢填嘅內容。',
          code:
            'const input = document.createElement("input");\n' +
            'input.value = "阿明";            // 模擬用家輸入\n' +
            'document.body.appendChild(input);\n' +
            '\n' +
            'const btn = document.createElement("button");\n' +
            'btn.textContent = "打招呼";\n' +
            'document.body.appendChild(btn);\n' +
            '\n' +
            'btn.addEventListener("click", () => {\n' +
            '  const name = input.value.trim();   // 拎出值，順便去掉前後空白\n' +
            '  if (name === "") {\n' +
            '    console.log("請先輸入名字");\n' +
            '  } else {\n' +
            '    console.log("你好，" + name + "！");\n' +
            '  }\n' +
            '});\n' +
            '\n' +
            'btn.click();',
          lang: 'js',
          result: '你好，阿明！',
          preview: {
            html:
              '<p style="margin:6px 0;font-size:14px;color:gray">輸入框預設填咗「阿明」，載入時會自動示範一次；你可以改個名再撳「打招呼」：</p>\n' +
              '<input id="name" value="阿明" style="font-size:15px;padding:5px 8px;width:110px">\n' +
              '<button id="go" style="font-size:15px;padding:5px 12px;margin-left:6px">打招呼</button>\n' +
              '<p id="out" style="margin:8px 0;font-size:18px;color:teal">…</p>\n' +
              '<script>\n' +
              '  const input = document.querySelector("#name");\n' +
              '  const btn = document.querySelector("#go");\n' +
              '  const out = document.querySelector("#out");\n' +
              '  function greet() {\n' +
              '    const name = input.value.trim();\n' +
              '    if (name === "") {\n' +
              '      out.textContent = "請先輸入名字";\n' +
              '      console.log("請先輸入名字");\n' +
              '    } else {\n' +
              '      out.textContent = "你好，" + name + "！";\n' +
              '      console.log("你好，" + name + "！");\n' +
              '    }\n' +
              '  }\n' +
              '  btn.addEventListener("click", greet);\n' +
              '  greet();   // 載入即刻示範一次（用預設值「阿明」）\n' +
              '<\/script>'
          },
          tip: 'input.value 拎到嘅永遠係字串，要計數就要先 Number(input.value)。' +
            '用家可能打好多空白，所以成日會加 .trim() 清一清。'
        }
      ],
      puzzle: {
        title: '練習 9：撳個掣改標題（HTML + JS）',
        task: '喺編輯框寫一個 <code>&lt;h2 id="title"&gt;</code>、一個 <code>&lt;button id="btn"&gt;</code>，' +
          '再用 <code>&lt;script&gt;</code> 寫 JS：撳個掣就把標題文字改成 <code>我學識 DOM 喇！</code>。' +
          '預覽框可以真的撳個掣試效果。',
        hint: '先用 <code>document.querySelector("#btn")</code> 揀到按鈕，再 <code>addEventListener("click", ...)</code>，' +
          '處理函數內寫 <code>document.querySelector("#title").textContent = "我學識 DOM 喇！";</code>',
        starter:
          '<h2 id="title">未改嘅標題</h2>\n' +
          '<button id="btn">撳我改標題</button>\n' +
          '\n' +
          '<script>\n' +
          '  // 喺呢度寫 JS：撳 #btn 就改 #title 嘅文字\n' +
          '<\/script>\n',
        solution:
          '<h2 id="title">未改嘅標題</h2>\n' +
          '<button id="btn">撳我改標題</button>\n' +
          '\n' +
          '<script>\n' +
          '  document.querySelector("#btn").addEventListener("click", function () {\n' +
          '    document.querySelector("#title").textContent = "我學識 DOM 喇！";\n' +
          '  });\n' +
          '<\/script>',
        mode: 'preview',
        lang: 'html',
        expectCode: 'addEventListener',
        previewHeight: 220
      },
      quiz: [
        {
          type: 'mc',
          q: '要揀一個 id 係 "title" 嘅節點，以下邊個寫法正確？',
          options: [
            'document.querySelector("title")',
            'document.querySelector("#title")',
            'document.querySelector(".title")',
            'document.getElementById("title") 同 document.querySelector("#title") 都得'
          ],
          answer: 3,
          explain: '# 代表 id，. 代表 class；所以 querySelector("title") 係揀網頁標題嗰個標籤，而 getElementById("title") 同 querySelector("#title") 都揀得到。'
        },
        {
          type: 'mc',
          q: '要把按鈕「被撳」同一個函數連埋，應該用邊個方法？',
          options: ['btn.onChange()', 'btn.addEventListener("click", fn)', 'btn.click = fn', 'btn.listen(fn)'],
          answer: 1,
          explain: '標準做法係 addEventListener("click", 處理函數)，同一個事件可以掛多個處理函數。'
        },
        {
          type: 'tf',
          q: '判斷：element.textContent = "Hello"; 會把該節點嘅文字內容改成 Hello。',
          answer: 0,
          explain: 'textContent 用嚟讀寫節點內嘅純文字，所以呢句係對。'
        },
        {
          type: 'mc',
          q: 'input.value 拎到嘅資料類型通常係咩？',
          options: ['number', 'string', 'boolean', 'object'],
          answer: 1,
          explain: '表單值永遠係字串，要計數就要先寫 Number(input.value) 轉換。'
        },
        {
          type: 'mc',
          q: 'document.querySelector(".item") 會揀到咩？',
          options: [
            '第一個 class 係 item 嘅節點',
            '全部 class 係 item 嘅節點',
            'id 係 item 嘅節點',
            '第一個叫 item 嘅標籤'
          ],
          answer: 0,
          explain: '. 代表 class，而 querySelector 只回傳第一個符合嘅節點；想拎全部要用 querySelectorAll。'
        },
        {
          type: 'tf',
          q: '判斷：document.createElement("p") 之後，個 p 標籤會即刻喺網頁出現。',
          answer: 1,
          explain: 'createElement 只係喺記憶體整咗個節點，要再 appendChild 掛上去網頁才會出現。'
        },
        {
          type: 'mc',
          q: '要把一個新整好嘅節點加入 body，應該點寫？',
          options: ['document.body.appendChild(el)', 'document.body.create(el)', 'el.addTo(body)', 'document.body += el'],
          answer: 0,
          explain: 'appendChild 會把節點掛喺父節點嘅最尾；document.body 就係 body 呢個節點。'
        },
        {
          type: 'tf',
          q: '判斷：el.textContent = "<b>你好</b>"; 會令「你好」變成粗體。',
          answer: 1,
          explain: 'textContent 會把內容當成純文字，所以會直接顯示 <b> 呢幾個字；想解析標籤要用 innerHTML，但內容來自用家時要小心。'
        },
        {
          type: 'mc',
          q: '用家撳一下按鈕，通常會觸發邊個事件？',
          options: ['click', 'input', 'submit', 'load'],
          answer: 0,
          explain: '撳掣係 click 事件；input 係輸入框內容改變，submit 係表格送出，load 係資源載入完成。'
        }
      ]
    }

/* ==== 檔案結束（以下不要再加內容）==== */
  ]
});
