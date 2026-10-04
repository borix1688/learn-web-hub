# 課程資料格式規格（給編寫課程內容的人／AI 看的）

專案：`learn-web-hub` —— 「前端基礎學堂 Frontend Foundations」，
一個純 HTML + CSS + JavaScript 的三科（HTML / CSS / JavaScript）學習站。
主程式（`index.html` / `app.js` / `runner.js` / `quiz.js`）已經寫好，**課程內容全部放在三個資料檔**：

| 檔案 | 科目 | 內容 |
| --- | --- | --- |
| `data-html.js` | HTML | 8 章（h1–h8） |
| `data-css.js` | CSS | 8 章（s1–s8） |
| `data-js.js` | JavaScript | 9 章（c1–c9） |

改課程**只需要改這三個檔案**，不用碰任何其他檔案。

---

## 0. 最重要的一句話

每個檔案都是「追加一個科目物件到 `window.LEARN_DATA.subjects`」。檔案骨架一定要這樣開始：

```js
/* ============================================================================
   前端基礎學堂 Frontend Foundations — data-html.js（HTML 課程資料庫）
   ========================================================================== */
window.LEARN_DATA = window.LEARN_DATA || { subjects: [] };

window.LEARN_DATA.subjects.push({

  /* ---------------- 科目基本資料 ---------------- */
  id: 'html',              // 固定：'html' / 'css' / 'js'（不可改）
  name: 'HTML',            // 顯示名稱
  icon: '🏗️',              // 卡片圖示（emoji）
  tagline: '網頁的骨架',      // 一句話副標題（8 字以內最好）
  intro: '一句話講清楚呢一科係學咩、學完可以做到咩。',
  runMode: 'preview',      // html = 'preview'；css = 'preview'；js = 'console'
  codeLang: 'html',        // html = 'html'；css = 'css'；js = 'js'
  theme: 'html',           // 固定用同 id 一樣的值

  chapters: [ /* 章節放這裡 */ ]

});

/* ==== 檔案結束（以下不要再加內容）==== */
```

> 寫長檔案時，可以分幾次寫入：每次都係用 `edit` 工具，把最後那行
> `/* ==== 檔案結束（以下不要再加內容）==== */` 取代成「新章節 + 同一行註解」。
> 這樣就不需要一次過寫完，也不會漏掉逗號。

---

## 1. 章節（chapter）結構

```js
{
  id: 'h1',                          // 全站唯一，規定見下面「章節大綱」
  title: 'HTML 文件結構同 DOCTYPE',    // 章節名
  icon: '📄',                        // emoji
  summary: '一句話介紹呢一章會學到咩。',

  points: [ /* 學習點，4–6 個 */ ],

  puzzle: { /* 互動練習，每章一個 */ },

  quiz: [ /* 測驗題，8–10 題 */ ]
}
```

---

## 2. 學習點（point）結構

| 欄位 | 必填 | 說明 |
| --- | --- | --- |
| `title` | ✅ | 學習點標題（例如「用 `<ul>` 做項目符號清單」）。可以含 HTML。 |
| `analogy` | ✅ | **生活化比喻**，用香港日常場景（茶餐廳、地鐵、八達通、超市貨架、書包分格、收納盒、點心紙…）。2–4 句。 |
| `code` | ✅ | 程式碼範例（純文字，會自動語法高亮）。多行用 `\n` 連接。 |
| `lang` | ⭕ | `'html'` / `'css'` / `'js'`。省略就跟科目的 `codeLang`。 |
| `result` | ⭕ | **文字版輸出結果**（給 JS 站、或解釋 console 輸出用）。多行用 `\n`。 |
| `preview` | ⭕ | **即時渲染預覽**，物件：`{ html: '片段', css: '可省略' }`。HTML / CSS 站的學習點**盡量每個都有**（這就是學員看到的「輸出結果」）。 |
| `tip` | ⭕ | 重點提示／常見錯誤。 |

`result` 與 `preview` 兩者可以同時出現（先看渲染結果，再看文字說明），但**至少要有一個**。

`preview.html` 的硬性規定：

* 只可以是**片段**，不可以有 `<!DOCTYPE>`、`<html>`、`<head>`、`<body>`。
* **不可以依賴外部資源**（外部圖片 URL、CDN、外部字體、外部影片）——學員可能在無網路環境開檔。
  需要圖就用 emoji、CSS 畫形狀、`background: linear-gradient(...)`、或純色方塊代替。
* 長度盡量在 20 行以內，讓學員一眼睇得完。

### 學習點範例（HTML）

```js
{
  title: '用 <ul> 做項目符號清單',
  analogy: '清單就好似去茶餐廳點餐：一張點心紙上面一行一行寫住「蝦餃」「燒賣」「叉燒包」，' +
    '每樣都係並排、冇先後次序。HTML 嘅 <ul>（unordered list）就係呢張點心紙，每一行用 <li> 包住。',
  code:
    '<h3>今日點心</h3>\n' +
    '<ul>\n' +
    '  <li>蝦餃</li>\n' +
    '  <li>燒賣</li>\n' +
    '  <li>叉燒包</li>\n' +
    '</ul>',
  lang: 'html',
  preview: {
    html: '<h3>今日點心</h3>\n<ul>\n  <li>蝦餃</li>\n  <li>燒賣</li>\n  <li>叉燒包</li>\n</ul>'
  },
  tip: '<ul> 只可以放 <li> 做直接子元素，唔好直接塞文字入去。'
}
```

### 學習點範例（CSS：預覽要同時給 HTML 同 CSS）

```js
{
  title: 'border-radius：把方角變圓角',
  analogy: 'border-radius 就好似幫一張正方形卡片剪圓角，用剪角器剪幾多，就寫幾多 px。',
  code: '.card {\n  border-radius: 16px;\n  background: #e3f0ef;\n  padding: 16px;\n}',
  lang: 'css',
  preview: {
    html: '<div class="card">圓角卡片</div>',
    css: '.card { border-radius: 16px; background: #e3f0ef; padding: 16px; }'
  },
  tip: '寫 50% 就會變成圓形（正方形元素嘅情況）。'
}
```

### 學習點範例（JavaScript：用 result 顯示 console 輸出）

```js
{
  title: '用 let 宣告變數',
  analogy: '變數就好似一個貼上標籤嘅收納盒：盒名 = 變數名，盒入面嘅嘢 = 值，隨時可以換。',
  code:
    'let score = 0;\n' +
    'console.log(score);\n' +
    'score = 100;\n' +
    'console.log(score);',
  lang: 'js',
  result: '0\n100',
  tip: '第二次賦值唔可以再寫 let，否則會報錯。'
}
```

---

## 3. 互動練習（puzzle）結構

| 欄位 | 必填 | 說明 |
| --- | --- | --- |
| `title` | ✅ | 例如 `'練習 3：整一個有 3 樣嘢嘅清單'` |
| `task` | ✅ | 要學員做咩。**可以用 HTML**（例如 `<code>`、`<b>`）。 |
| `hint` | ✅ | 提示。**可以用 HTML**。 |
| `starter` | ✅ | 一開始放在編輯框的程式碼（通常係一兩行註解 + 未完成的部分）。 |
| `solution` | ✅ | 參考答案（完整、可執行）。 |
| `mode` | ⭕ | `'preview'`（即時預覽）或 `'console'`（只睇 console 輸出）。省略就跟科目 `runMode`。 |
| `lang` | ⭕ | `'html'` / `'css'` / `'js'`。省略就跟科目 `codeLang`。 |
| `previewHtml` | ✅（CSS 練習） | CSS 練習時，CSS 要套用的**固定 HTML 片段**（學員不可以改，只在編輯框寫 CSS）。 |
| `expect` | ⭕ | `console` 模式專用：輸出必須包含這個關鍵字才算過關（例如 `'15'`、`'完成'`）。填穩定嘅短字串。 |
| `expectCode` | ⭕ | `preview` 模式專用：學員的程式碼必須包含這個子字串才算過關（例如 `'<ul>'`、`'border-radius'`）。 |
| `previewHeight` | ⭕ | 預覽框高度（px），預設 240。 |

### 練習範例（HTML，preview 模式）

```js
puzzle: {
  title: '練習 3：整一個購物清單',
  task: '用 <code>&lt;ul&gt;</code> 同 <code>&lt;li&gt;</code> 整一個有 3 樣嘢嘅清單，' +
    '外面加一個 <code>&lt;h3&gt;</code> 標題寫「購物清單」。',
  hint: '結構係：<code>&lt;h3&gt;標題&lt;/h3&gt;</code> 之後再包住三個 <code>&lt;li&gt;</code>。',
  starter: '<!-- 喺下面寫你嘅清單 -->\n',
  solution: '<h3>購物清單</h3>\n<ul>\n  <li>牛奶</li>\n  <li>麵包</li>\n  <li>雞蛋</li>\n</ul>',
  mode: 'preview',
  lang: 'html',
  expectCode: '<li>',
  previewHeight: 220
}
```

### 練習範例（CSS，preview 模式，必須有 previewHtml）

```js
puzzle: {
  title: '練習 2：幫卡片加圓角同陰影',
  task: '喺編輯框寫 CSS，令 <code>.card</code> 有 <code>border-radius: 14px</code> 同 ' +
    '<code>box-shadow</code>，背景用淺藍綠色。',
  hint: '格式係 <code>.card { 屬性: 值; }</code>，每句後面要有分號。',
  starter: '/* 喺下面寫 CSS */\n.card {\n\n}\n',
  solution: '.card {\n  border-radius: 14px;\n  background: #e3f0ef;\n  padding: 20px;\n  box-shadow: 0 6px 18px rgba(0,0,0,.15);\n}',
  mode: 'preview',
  lang: 'css',
  previewHtml: '<div class="card">我係一張卡片</div>',
  expectCode: 'border-radius',
  previewHeight: 200
}
```

### 練習範例（JS，console 模式）

```js
puzzle: {
  title: '練習 5：用 for 迴圈印出 1 到 5',
  task: '用 <code>for</code> 迴圈，把 1、2、3、4、5 逐個用 <code>console.log()</code> 印出。',
  hint: 'for (let i = 1; i <= 5; i++) { ... }',
  starter: '// 喺下面寫你嘅迴圈\n',
  solution: 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}',
  mode: 'console',
  expect: '5'
}
```

---

## 4. 測驗題（quiz）結構

每章 **8–10 題**（建議 9 題），混合選擇題（`mc`）同判斷題（`tf`），難度由淺入深。

```js
{ type: 'mc', q: '題目文字', options: ['A', 'B', 'C', 'D'], answer: 1, explain: '解釋點解係 B，同埋其他選項錯喺邊。' },
{ type: 'tf', q: '判斷：<ul> 可以用嚟做有次序嘅清單。', answer: 1, explain: '有次序（1. 2. 3.）要用 <ol>；<ul> 只出項目符號。' }
```

* `type: 'tf'` 不需要 `options`，畫面會自動出「對 / 不對」；`answer: 0` = 對，`answer: 1` = 不對。
* `answer` 一定要落在 `options` 索引範圍內（由 0 開始）。
* `explain` 唔可以求其寫「因為 A 係答案」，要講到原理，1–3 句。
* 唔好出「以上皆是」「以上皆非」呢類劣質選項。
* 同一章唔好重複考同一個點。

---

## 5. 固定章節大綱（**必須照跟**，唔可以加減章節）

### `data-html.js`（`runMode: 'preview'`, `codeLang: 'html'`）

| id | 標題 | 必須覆蓋的內容 |
| --- | --- | --- |
| h1 | HTML 文件結構同 `<!DOCTYPE html>` | `<!DOCTYPE html>`、`<html>`、`<head>`、`<title>`、`<body>`、註解 `<!-- -->`、標籤／元素／屬性概念 |
| h2 | 標題同段落 | `<h1>`–`<h6>`、`<p>`、`<br>`、`<hr>`、`<strong>`、`<em>`、巢狀規則 |
| h3 | 清單 | `<ul>`、`<ol>`、`<li>`、巢狀清單、`<dl>`／`<dt>`／`<dd>` |
| h4 | 表格 | `<table>`、`<caption>`、`<tr>`、`<th>`、`<td>`、`<thead>`／`<tbody>`、`colspan`／`rowspan` |
| h5 | 圖片同多媒體 | `<img>`（`src`／`alt`／`width`）、`<figure>`／`<figcaption>`、`<video>`、`<audio>`、`<source>`、`controls` |
| h6 | 連結、`<div>`／`<span>` 同語意標籤 | `<a href>`、`target="_blank"`、頁內錨點 `#id`、`<div>`、`<span>`、`<header>`／`<nav>`／`<main>`／`<section>`／`<footer>` |
| h7 | 表單入門 | `<form>`、`<label>`、`<input type="text/password/email/number/checkbox/radio/date">`、`<select>`／`<option>`、`<textarea>`、`<button>`、`placeholder`／`required` |
| h8 | Bootstrap 5 快速排版 | 用 CDN `<link>` 引入、`container`／`row`／`col` 格線、`btn`／`card`／`alert` class 用法、為何 Bootstrap 可以省時間（**注意：預覽片段唔可以真係依賴 CDN，示範要用純文字解釋 + 用純 CSS 模擬出類似外觀**） |

### `data-css.js`（`runMode: 'preview'`, `codeLang: 'css'`）

| id | 標題 | 必須覆蓋的內容 |
| --- | --- | --- |
| s1 | CSS 係乜嘢？三種寫法 | inline style 屬性、`<style>` 內部樣式表、`<link rel="stylesheet">` 外部樣式表、基本語法 `選擇器 { 屬性: 值; }`、`/* 註解 */`、優先次序（inline 最大） |
| s2 | 選擇器同偽元素 | 標籤選擇器、`.class`、`#id`、群組 `,`、後代（空格）、`:hover`、`::before`／`::after` 加 `content` |
| s3 | 盒模型 | `width`／`height`、`padding`、`border`、`margin`、`box-sizing: border-box`、`margin: 0 auto` 居中 |
| s4 | 文字同顏色 | `color`、`font-family`、`font-size`、`font-weight`、`text-align`、`line-height`、`letter-spacing`、`text-decoration` |
| s5 | 背景同外觀 | `background-color`、`linear-gradient`、`border-radius`、`box-shadow`、`opacity`、`border` 樣式 |
| s6 | display 同版面流 | `display: block／inline／inline-block／none`、`max-width`、`overflow`、`cursor` |
| s7 | 定位 position | `static`／`relative`／`absolute`／`fixed`／`sticky`、`top`／`left`／`z-index`、`position: relative` 做定位父層嘅技巧 |
| s8 | Flexbox 同響應式 | `display: flex`、`flex-direction`、`justify-content`、`align-items`、`gap`、`flex-wrap`、`@media (max-width: 600px)`、行動優先概念 |

### `data-js.js`（`runMode: 'console'`, `codeLang: 'js'`）

| id | 標題 | 內容（**沿用現有樣本課程的內容再擴寫**） |
| --- | --- | --- |
| c1 | JS 入門與變數 | `console.log`、註解、`let`／`const`、命名規則 |
| c2 | 資料類型 | 字串／數字／布林／`null`／`undefined`、`typeof`、樣板字串 |
| c3 | 運算子 | 算術、`+` 字串串接、比較 `===` vs `==`、`&&`／`||`／`!` |
| c4 | 條件判斷 | `if`／`else if`／`else`、三元運算子、`switch` |
| c5 | 迴圈 | `for`、`while`、`break`／`continue`、累加技巧 |
| c6 | 函數 | 宣告、參數、`return`、箭頭函數、作用域概念 |
| c7 | 陣列 | 索引、`length`、`push`／`pop`、`forEach`、`map`、`join` |
| c8 | 物件 | key-value、點記法 vs 括號記法、物件裡面的函數、`Object.keys` |
| c9 | DOM 操作 | `document.querySelector`、`textContent`、`style`、`addEventListener`、`createElement`／`appendChild` |

> c9 的練習可以用 `mode: 'preview'` + `lang: 'html'`，讓學員在編輯框寫
> HTML + `<script>`，真的看到按鈕同文字變化（console 輸出照樣會顯示在下面）。

---

## 6. 寫作風格（非常緊要）

1. **語言：繁體中文、香港用語。** 可以用「唔、嘅、係、喺、撳、睇、啲、咁、揀、我哋、唔使、好緊要」等口語。
   唔好用簡體字（例如要寫「頁面」唔好寫「页面」，「選擇」唔好寫「选择」）。
2. **對象係完全零基礎、冇寫過一行程式的人。** 每個新名詞第一次出現都要解釋，唔好假設佢識。
3. **比喻要具體、要係香港生活場景**，唔好寫「就好似一個容器」呢種冇內容的比喻。
4. **唔好講廢話。** 每段都要有資訊量。
5. **正確性最緊要**：程式碼一定要真係跑得，輸出結果一定要同真實輸出**完全一致**（連標點、大小寫）。
   JS 的 `result` 要按 `console.log` 的實際顯示方式寫（字串唔會自動加引號，但 `console.log` 一個物件會有格式）。
   唔肯定就自己用 `node -e "…"` 驗一次。
6. 唔好承諾網站做唔到嘅事（例如「呢個練習會改到你電腦嘅檔案」）。
7. **顏色寫法（好重要）**：唔好用色碼。零基礎學員睇 `#0b6e63` 係完全唔知咩色，
   會直接阻礙理解。規則如下：

   | 用在哪裡 | 寫法 | 例子 |
   | --- | --- | --- |
   | 說明文字（`task`／`hint`／`q`／`explain`／`options`／`tip`／`analogy`） | **中文描述**為主，需要例子時用官方顏色名 | 「深綠色背景」「淺黃色文字」「例如 <code>gold</code>」 |
   | 程式碼（`code`／`solution`／`starter`） | **官方 CSS 英文顏色名** | `background: teal;`、`color: crimson;`、`border: 2px solid saddlebrown;` |
   | 預覽（`preview.css`／`preview.html`） | 同程式碼保持一致（用同一個顏色名） | — |
   | 教「透明度」時 | 才用 `rgba()`，並用中文解釋 | `rgba(0, 0, 0, 0.15)`（黑色、15% 透明） |

   * 顏色名一定要係 **CSS 標準名**（`teal`、`gold`、`lightyellow`、`saddlebrown`…）。
     打錯名（例如 `lightyelow`）瀏覽器會**靜靜地唔套用**，肉眼睇唔出，所以驗證器與測試都會檢查。
   * 唯一的例外：如果課文本身就在教「十六進位」寫法，可以寫色碼，
     但**必須在旁邊用中文講明係咩色**（例如「`#b91c1c` 係深紅色」）。
     驗證器會放行有中文說明的色碼，冇說明的就會警告。
   * 現時全站只剩 1 處刻意的教學例子，其餘 276 處已經全部改成顏色名。

---

## 7. 語法規則（**踩過坑，一定要跟**）

1. **字串一律用單引號 `'...'`**（跟現有樣本一致）。字串裡面唔可以出現未跳脫的單引號 `'`。
   要引號就用全角「」或者 `\'`；HTML 屬性一律用雙引號（`class="card"`），咁就唔會撞。
2. **唔可以用反引號樣板字串**（避免 `${}` 被當成插值）。
3. 多行文字用 `\n`，並用 `+` 連接多個字串（跟樣本風格，方便閱讀）：
   ```js
   code:
     'let a = 1;\n' +
     'console.log(a);',
   ```
4. 每個物件屬性之間**一定要有逗號**，最後一個屬性後面**唔可以有**逗號以外的殘留符號。
5. `task`／`hint`／`title` 允許 HTML；其他欄位（`analogy`、`tip`、`result`、`explain`、`q`）
   **如果用到 HTML 標籤，只可以用 `<code>`／`<b>`／`<br>`**，主程式會用安全方式顯示。
   （`q` 同 `explain` 目前是當純文字處理，要顯示標籤就寫 `<code>` 都得，但唔好寫 `<div>` 之類。）
6. 學習點的 `code` 唔可以包含 `</script>` 呢個字（會影響部分瀏覽器解析）。

---

## 8. 自我檢查（交件前必做）

在專案資料夾（`C:\Users\User\Desktop\DSH WorkPlace\learn-web-hub`）執行：

```
node tools/validate-data.js
```

* 有 `❌ 錯誤` → 一定要改到冇為止。
* `⚠️ 警告` → 可以接受，但要睇下有冇道理（尤其是簡體字提示）。
* 亦可以單獨驗語法：`node --check data-html.js`

驗證器會檢查：章節數、學習點數、測驗題數、`answer` 索引範圍、必要欄位、
CSS 練習有冇 `previewHtml`、以及有冇誤用簡體字。
