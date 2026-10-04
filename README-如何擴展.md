# 前端基礎學堂 Frontend Foundations — 使用與擴展說明

一個純前端（HTML + CSS + JavaScript，**無框架、無伺服器**）的互動學習網站，寫給完全零基礎、
講粵語（香港用語）的初學者。**一個主程式，三個科目**：HTML、CSS、JavaScript。

> **想改站名？** 只改 `app.js` 最上面的 `BRAND`（中文名、英文名、左上角標誌、副標題），
> 再改 `index.html` 的 `<title>`、`<meta name="description">` 與「品牌靜態文字」兩行
>（那兩行是 JS 未載入前的顯示，開機後由 `app.js` 接手）。

---

## 一、檔案結構

```
learn-web-hub/
├── index.html          ← 頁面骨架（首頁揀科目 + 三大模組的容器）
├── styles.css          ← 全部樣式：配色、排版、響應式、深色模式、三個科目的主題色
├── data-html.js        ← HTML 課程資料（8 章）★ 想改內容就改這裡
├── data-css.js         ← CSS 課程資料（8 章）★ 想改內容就改這裡
├── data-js.js          ← JavaScript 課程資料（9 章）★ 想改內容就改這裡
├── runner.js           ← 沙箱執行器（即時預覽 iframe + console 輸出收集 + 語法高亮）
├── quiz.js             ← 測驗模組（判分、解釋、重做、總分）
├── app.js              ← 主程式（科目切換、分頁、側欄、進度、localStorage）
├── _SPEC-課程資料格式.md ← 課程資料的完整欄位規格（想自己加內容就看這份）
├── README-如何擴展.md    ← 本文件
└── tools/              ← 開發工具（網站本身不需要，可以整個資料夾刪掉）
    ├── validate-data.js   ← 課程資料驗證器（結構、答案索引、簡體字…）
    ├── check-solutions.js ← 練習參考答案檢查器（真的執行 JS 答案，比對 expect）
    ├── check-contract.js  ← 選擇器契約檢查（app.js 查詢的 id 是否存在於 index.html）
    ├── test-runner.js     ← runner.js 單元測試（沙箱、console 格式、語法高亮）
    ├── normalize-colors.js ← 顏色寫法統一（色碼 → 官方顏色名，含顏色名驗證）
    ├── beacon-server.js   ← 測試用迷你伺服器（真實時間跑端到端測試，也可用來預覽網站）
    ├── smoke-test.js      ← 端到端測試的產生／解析腳本
    ├── _smoke-assert.js   ← 端到端測試的斷言腳本
    └── fix-wording.js     ← 一次性用語還原腳本（已跑過，保留作紀錄）
```

### 載入順序（**不可以調換**）

`index.html` 最底部：

```html
<script src="./data-html.js"></script>   <!-- 1. 先有三科資料 -->
<script src="./data-css.js"></script>
<script src="./data-js.js"></script>
<script src="./runner.js"></script>      <!-- 2. 再有執行工具 -->
<script src="./quiz.js"></script>        <!-- 3. 再有測驗模組 -->
<script src="./app.js"></script>         <!-- 4. 最後由主程式砌畫面 -->
```

原因：`app.js` 啟動時會用到 `LEARN_DATA`（三個 data 檔）、`Runner`（runner.js）、`Quiz`（quiz.js）。
三者都是「全域變數」，所以順序錯就會出現 `undefined` 錯誤。

### 怎樣執行

直接雙擊 `index.html` 就可以（`file://` 都行，不需伺服器）。建議用 Chrome / Edge / Firefox / Safari 最新版。

> 進度存在瀏覽器的 localStorage，所以換瀏覽器或清除網站資料就會重設。儲存用的 key 是
> `weblearn.progress.v1`。

---

## 二、網站四大模組

| 模組 | 位置 | 功能 |
| --- | --- | --- |
| 🎓 首頁（揀科目） | `app.js` → `renderHome()` | 三張科目卡（各有自己的主題色），顯示每科的學習進度、答對題數、章節／學習點／題目數量；下面有建議學習次序 |
| 📖 學習（Learn） | `app.js` → `renderLearn()` | 逐章顯示學習點：生活化比喻 → 程式碼範例（有語法高亮）→ **即時渲染預覽**（HTML/CSS）或 console 輸出（JS）→ 重點提示，附「我已經學會」勾選 |
| 🧪 練習（Interactive） | `app.js` → `renderPractice()` + `runner.js` | 每章一個可編輯程式碼框，可「執行 / 提示 / 顯示答案 / 還原範例」，輸出顯示在下方（**不用 alert**）；編輯框下面有一排**快速輸入符號掣**（按語言不同，手機打 `{ } < > ;` 唔使切鍵盤） |
| 📝 測驗（Quiz） | `quiz.js` | 每章 8–10 題選擇／判斷題，即時判分、顯示解釋、可重做（單題或全部答錯的題）、頂部有得分與進度條、底部有**全科總分**與各章一覽 |

### 課程內容一覽（現況）

| 科目 | 章節 | 學習點 | 測驗題 |
| --- | --- | --- | --- |
| **HTML** | 8 章：文件結構同 DOCTYPE／標題同段落／清單／表格／圖片同多媒體／連結、div 同 span、語意標籤／表單入門／Bootstrap 5 快速排版 | 40 | 72 |
| **CSS** | 8 章：CSS 係乜嘢？三種寫法（inline／internal／external ＋對照表）／選擇器同偽元素（`:hover`、`::before`／`::after`）／盒模型／文字同顏色／背景同外觀／display 同版面流／定位 position（relative／absolute／fixed／sticky）／Flexbox 同響應式 | 45 | 74 |
| **JavaScript** | 9 章：入門與變數／資料類型／運算子／條件判斷／迴圈／函數／陣列／物件／DOM 操作 | 50 | 81 |
| **合計** | **25 章** | **135** | **227** |

每個學習點都有「生活化比喻 → 程式碼範例（語法高亮）→ 即時預覽或 console 輸出 → 重點提示」；
HTML／CSS 科的學習點**全部**都有即時渲染預覽；每章都有一個可執行的練習。

### 科目主題色是怎樣做的

`app.js` 進入某一科時會設定 `<html data-subject="css">`，而 `styles.css` 最上面有：

```css
html[data-subject="html"] { --accent: #bf7a3c; --accent-soft: #faefe1; }  /* 暖橙 */
html[data-subject="css"]  { --accent: #5a76c0; --accent-soft: #e9edfa; }  /* 藍紫 */
html[data-subject="js"]   { --accent: #4f8a8b; --accent-soft: #e3f0ef; }  /* 藍綠 */
```

只要改這幾行就可以換掉整個科目的配色（深色模式的版本就在下面幾行）。

---

## 三、程式碼是怎樣被執行的（兩種模式）

`runner.js` 會建立一個 `<iframe sandbox="allow-scripts">`（**沒有** `allow-same-origin`），
再把學員的程式碼放進去。因為沙箱沒有同源權限，學員的程式碼**無法**讀取本網站的 DOM 或 localStorage。

| 模式 | 用在哪 | 行為 |
| --- | --- | --- |
| `preview` | HTML / CSS 科的全部練習、JS 科第 9 章（DOM） | 學員的 HTML／CSS 會被**真正渲染**在預覽框裡（可捲動、可互動）；如果程式碼裡有 `<script>`，`console.log` 的輸出會顯示在下面的「Console 輸出」區 |
| `console` | JS 科的其餘練習 | 程式碼用 `postMessage` 送入沙箱執行，好像 DevTools 一樣把 `console.log` 的輸出帶回畫面 |

其他細節：

1. **CSS 練習的固定 HTML**：學員只寫 CSS，要套用的 HTML 由資料的 `puzzle.previewHtml` 決定
   （畫面會先把這段 HTML 顯示出來，並標明「學員唔需要改呢部分」）。
2. **逾時保護**：預覽模式 6 秒、console 模式 5 秒，逾時就整個 iframe 換掉，主網站不會卡死。
   想改就搜尋 `runner.js` 裡面的 `6000` / `5000`。
3. **錯誤收集**：沙箱內用 `window.addEventListener('error', ...)` 把錯誤變成一行紅字輸出，
   所以預覽照樣睇得到，唔會白畫面。
4. **輸出上限**：最多 200 條，超過會提示「只顯示頭 200 條」（`MAX = 200`）。
5. **學習模組的預覽**係靜態 iframe（每次渲染該章時建立），不會有 console 收集，
   純粹讓學員睇效果。
6. 沙箱的 `console.log` 會被覆寫，所以學員程式碼的輸出**不會**出現在瀏覽器 DevTools，只會顯示在頁面上。

### ⚠️ 一個很重要的實作陷阱（改 `runner.js` 前必讀）

沙箱 iframe 是 `sandbox="allow-scripts"`、**沒有** `allow-same-origin`，所以它是「跨來源」的；
而 console 模式的 iframe 更加是 1×1、放在畫面外（`left:-9999px`）。

**Chrome 會節流（throttle）跨來源／畫面外 iframe 的 `setTimeout`**——實測結果是：內層用
`setTimeout(回報結果, 800)` 的話，那個 timer **可能永遠都不會觸發**，學員撳「執行」之後就
一直停在「⏳ 執行中…」，完全沒有輸出。

所以 `runner.js` 內層**完全不用 timer 回報結果**：

| 模式 | 幾時回報 |
| --- | --- |
| `console` | 學員程式碼執行完，**立即**回報（同步） |
| `preview` | 等 `DOMContentLoaded`（代表片段內所有同步 `<script>` 都跑完）就回報 |

逾時保護由**外層（主頁面，不是跨來源）**的 timer 負責，所以不受節流影響。

副作用：學員寫 `setTimeout(() => console.log('x'), 1000)` 這種**非同步輸出不會顯示**。
本課程的 JavaScript 章節沒有教 `setTimeout`，所以不影響；如果你日後要教非同步，
其中一個可行做法是叫學員用「即時預覽」模式（`preview`）寫，把結果寫進 DOM 而不是 console。

### ⚠️ 捲動相關的陷阱（改捲動行為前必讀）

切換章節時的捲動行為在 `app.js` → `setChapter()`：

| 分頁 | 行為 |
| --- | --- |
| 📖 學習 | 跳到新章節的**第 1 個學習點**（`scrollIntoView`） |
| 🧪 練習 / 📝 測驗 | **立即跳返最頂**，即係由第 1 題／第一個練習開始 |

三個容易踩到的細節：

1. **`behavior: 'auto'` 不等於「即時」**。因為 `styles.css` 設定了 `html { scroll-behavior: smooth }`，
   而 `'auto'` 的意思是「跟隨 CSS 設定」，所以仍然會平滑捲動（測試時見到 350ms 後還在半路）。
   要即時到位必須寫 `behavior: 'instant'`（`app.js` 的 `scrollToTop()` 就是這樣做，
   並包了 try/catch 讓極舊瀏覽器退回 `window.scrollTo(0, 0)`）。
2. **Chrome 的 scroll anchoring** 會在內容被抽換之後自行微調捲動位置，令「跳返最頂」之後
   又偏離幾十 px。所以 `styles.css` 的 `html` 加了 `overflow-anchor: none`，
   而且 `setChapter()` 在下一幀（`requestAnimationFrame`）會再確認一次位置。
3. **置頂工具列會遮住目標**。`scrollIntoView` 跳到學習點時，卡片頂部會藏在 62px 高的工具列後面，
   所以 `.point` 加了 `scroll-margin-top: calc(var(--topbar-h) + 14px)`。

---

## 四、測驗怎樣判分與重做

* 每題的答案存在 `state.answers[章節id][題號]`，答完即時重繪，正確答案綠色、錯選紅色。
* 答錯會出現「🔄 重做呢題」；頂部亦有「重做所有答錯的題」與「🧹 清除本章答案」。
* 分數 = 答對題數 / 總題數；`quiz.js` 的 `score()` 計本章、`subjectScore()` 計全科。
* 底部「🏁 全科測驗總分」會列出每一章的得分，撳某一章可以直接跳去那一章的測驗。
* 全部答完會顯示總結與建議文字（`advice`）。

---

## 五、怎樣擴展一個新章節（最常見的改動）

只需要改對應的 **`data-*.js`** 一個檔案，在 `chapters: [ ... ]` 陣列加一個物件：

```js
{
  id: 'h9',                       // 唯一 id（不要同前面重複）
  title: '表單驗證入門',            // 章節名（會出現在側欄、練習分頁、測驗標題）
  icon: '✅',                     // emoji 小圖示
  summary: '一句話介紹這一章。',

  // ---- 學習點：想加幾個就加幾個 ----
  points: [
    {
      title: 'required 屬性',
      analogy: '生活化比喻：好似茶餐廳落單一定要寫「幾多位」……',
      code: '<input type="text" required>',
      lang: 'html',
      preview: { html: '<input type="text" required placeholder="必填">' },  // HTML/CSS 科用
      result: '文字結果（JS 科用，可省略）',
      tip: '重點提示（可以省略整個 tip）'
    }
  ],

  // ---- 互動練習：每章一個 ----
  puzzle: {
    title: '練習 9：加一個必填欄位',
    task: '用 <code>&lt;input&gt;</code> 加一個必填的文字欄位。',   // 可以用 HTML
    hint: '加上 <code>required</code> 屬性。',                    // 可以用 HTML
    starter: '<!-- 喺下面寫 -->\n',
    solution: '<input type="text" required placeholder="必填">',
    mode: 'preview',        // 可省略，預設跟科目
    lang: 'html',           // 可省略，預設跟科目
    expectCode: 'required', // 可省略：程式碼要包含這個字串才算過關
    previewHeight: 180      // 可省略：預覽框高度
  },

  // ---- 測驗：8–10 題 ----
  quiz: [
    {
      type: 'mc',
      q: '<code>required</code> 屬性的作用係咩？',
      options: ['令欄位唔可以空白', '令欄位變灰色', '隱藏欄位', '限制字數'],
      answer: 0,
      explain: '加了 required，送出表單時如果留空，瀏覽器會阻止送出並提示使用者。'
    },
    {
      type: 'tf',
      q: '判斷：<code>required</code> 只適用於文字欄位。',
      answer: 1,
      explain: 'checkbox、radio、select、file 等都可以用 required。'
    }
  ]
}
```

加完之後**不需要**改 `index.html`、`app.js` 或 `quiz.js`——側欄、練習分頁、測驗分頁都會自動多一章。

### 注意事項（很容易踩到的坑）

1. **引號**：`data-*.js` 的字串用單引號 `'...'` 包住，所以字串裡面**不可以**再出現單引號
   （要寫 `\'`）。HTML 屬性請用雙引號（`class="card"`），就不會撞。
2. **不要用反引號樣板字串**（`` ` ``），避免 `${}` 被當成插值。
3. **`\n`**：字串裡的 `\n` 代表換行。學習點的 `code` 和 `result` 靠它保持多行顯示。
4. **`answer` 索引**：一定要落在 `options` 的範圍內（由 0 開始），否則顯示會出錯。
5. **`type: 'tf'`**：不用寫 `options`，網站會自動顯示「對 / 不對」；`answer: 0` = 對、`1` = 不對。
6. **`preview.html` 只是片段**：不可以有 `<!DOCTYPE>`、`<html>`、`<body>`，也不可以依賴外部
   圖片／CDN（學員可能在無網路環境開檔）。
7. **CSS 練習一定要有 `previewHtml`**（套用 CSS 的固定 HTML），否則驗證器會報錯。
8. **`id` 必須全站唯一**：進度是用 `科目id::章節id::學習點序號` 作為 key 存在 localStorage。
9. **加完一定要跑驗證器**（見下面第八節）。
10. **顏色唔好用色碼**：學員睇 `#0b6e63` 係唔知咩色。
    * 說明文字（`task`／`hint`／`q`／`explain`／`options`／`tip`）→ 用中文描述（「深綠色」「淺黃色」）
    * 程式碼（`code`／`solution`／`preview`）→ 用官方 CSS 顏色名（`teal`、`crimson`、`lightyellow`、`saddlebrown`…）
    * 只有教透明度時才用 `rgba()`，並用中文講明（例如「黑色、15% 透明」）
    * 例外：課文本身教「十六進位」時可以寫色碼，但旁邊一定要用中文講明係咩色
    * 想批次改色碼：`node tools/normalize-colors.js --dry` 先睇報告，再執行 `node tools/normalize-colors.js`
      （它會用官方顏色名驗證，打錯名會立即報錯）

---

## 六、怎樣加一個全新科目（例如 Python 入門）

1. 複製 `data-js.js` 做 `data-python.js`，改成 `id: 'python'`、`name: 'Python'`、
   `codeLang: 'js'`（目前語法高亮只支援 html / css / js）、`runMode: 'console'`。
2. 在 `index.html` 加一行 `<script src="./data-python.js"></script>`（放在其他 data 檔之後、`runner.js` 之前）。
3. 在 `app.js` 最上面的 `ORDER = ['html', 'css', 'js']` 加上 `'python'`（控制首頁卡片次序）。
4. 在 `styles.css` 加一組主題色：`html[data-subject="python"] { --accent: ...; --accent-soft: ...; }`
   與深色模式版本，再加 `.subject-card.theme-python { --card-accent: ...; --card-soft: ...; }`。
5. 跑 `node tools/validate-data.js` 確認沒問題。

---

## 七、其他常見改動

| 想改什麼 | 改哪裡 |
| --- | --- |
| 配色、圓角、字體、深色模式顏色 | `styles.css` 最上面的 `:root { ... }` 一段 |
| 某個科目的主色 | `styles.css` 的 `html[data-subject="..."]` |
| 網站名稱、副標題、左上角標誌 | `app.js` 最上面的 `BRAND`（＋ `index.html` 的 `<title>`、`<meta name="description">`、品牌靜態文字） |
| 練習的快速輸入符號（想加減符號） | `app.js` 最上面的 `SYMBOLS`（分 `html` / `css` / `js` 三組；`'\t'` 代表縮排掣） |
| 首頁文案／建議學習次序 | `index.html` 的 `#view-home` 一段 |
| 執行沙箱逾時 | `runner.js` → `run()` 內的 `6000` / `5000` |
| 學習點的「生活化比喻 / 程式碼 / 預覽 / 提示」小標題文字 | `app.js` → `renderLearn()` 內的 `subhead` |
| 練習按鈕文字 | `app.js` → `renderPractice()` 內的按鈕區塊 |
| 測驗給分建議文字 | `quiz.js` → `render()` 最後的 `advice` |
| 進度儲存的 key（想開多份進度時） | `app.js` 的 `STORE_KEY` |

---

## 八、開發工具（改完課程後請跑一次）

```powershell
cd learn-web-hub

# 1) 檢查課程資料有沒有結構錯誤（章節數、答案索引、必要欄位、簡體字…）
node tools/validate-data.js

# 2) 檢查每個練習的「參考答案」是否真的做得到（會用 Node 跑 JS 答案，比對 expect）
node tools/check-solutions.js

#    加 --points 可以順便抽查每個 JS 學習點聲明的「輸出結果」是否準確：
node tools/check-solutions.js --points

# 3) 檢查 app.js / quiz.js 查詢的 id 是否真的存在於 index.html（改過 HTML 骨架後必跑）
node tools/check-contract.js

# 4) 測試執行沙箱本身（console 格式、錯誤處理、語法高亮、srcdoc 組合）
node tools/test-runner.js

# 5) 語法檢查（可選）
node --check data-html.js
node --check app.js
```

各工具的用途：

| 工具 | 檢查什麼 | 幾時要跑 |
| --- | --- | --- |
| `validate-data.js` | 資料結構：章節數、學習點數、題數、`answer` 索引範圍、CSS 練習有冇 `previewHtml`、簡體字 | 每次改完 `data-*.js` |
| `check-solutions.js` | 每章 `puzzle.solution` 是否真的能通過自己的 `expect`／`expectCode`（照抄答案一定要過關）；starter 不可以一開始就達標；CSS 練習的選擇器是否真的對應到 `previewHtml` 的元素 | 每次改練習 |
| `check-solutions.js --points` | 每個 JS 學習點的 `code` 實際輸出 vs 聲明的 `result` | 改 JS 內容後 |
| `check-contract.js` | app.js / quiz.js 查詢的 `#id`、`.class` 是否存在於 `index.html`；有沒有重複 id | 改完 `index.html` 或 `app.js` |
| `test-runner.js` | 沙箱行為：`console.log` 是不是 Chrome DevTools 格式、錯誤會不會被接住、高亮會不會產生壞 HTML | 改完 `runner.js` |
| `normalize-colors.js` | 色碼 → 官方英文顏色名（含顏色名驗證、報告每個色碼出現次數） | 想統一顏色寫法時 |
| `smoke-test.js` + `_smoke-assert.js` | 真實瀏覽器端到端：揀科目 → 學習 → 練習執行 → 測驗判分 → 重做錯題；另驗證顏色名有效、無色碼 | 大改動之後 |

### 端到端測試怎樣跑（**建議用真實時間模式**）

```powershell
# 1) 產生測試頁
node tools/smoke-test.js build

# 2) 啟動測試伺服器（它同時是靜態檔案伺服器 + 結果收集器）
Start-Process node -ArgumentList 'tools/beacon-server.js'      # http://127.0.0.1:8791

# 3) 用 Chrome 開（不需要 --virtual-time-budget）
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --headless=new --disable-gpu --no-sandbox --user-data-dir="$env:TEMP\dsh-chrome-profile" `
  http://127.0.0.1:8791/tools/_smoke.html

# 4) 測試頁跑完會把結果 POST 到伺服器，然後讀出來
node tools/smoke-test.js parse        # 讀 tools/_smoke-result.txt
node tools/smoke-test.js clean        # 清掉產生的檔案
```

### 三種 pass（可以分開跑，也可以在同一次執行跑）

| pass | 開的網址 | 測什麼 |
| --- | --- | --- |
| 桌面版 | `.../_smoke.html?tag=desktop`（`--window-size=1440,900`） | 完整 57 項：三科學習／練習／測驗、預覽、判分、捲動、深色模式 |
| 重新載入還原 | `.../_smoke.html?tag=restore&reload=1` | 先跑完整 suite，再 `location.reload()`，驗證進度／草稿／答案／主題有還原 |
| 手機版 | `.../_smoke.html?tag=mobile`（`--window-size=390,844`，實測 512px） | 完整 suite ＋ 手機檢查：漢堡選單、側欄抽屜滑出／收返、遮罩、單欄版面 |

```powershell
# 例：重新載入還原（唔需要重用 profile，所以唔會被 Chrome 的 profile 鎖影響）
node tools/beacon-server.js 8791
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --headless=new --disable-gpu --no-sandbox --window-size=1440,900 `
  --user-data-dir="$env:TEMP\profA" `
  "http://127.0.0.1:8791/tools/_smoke.html?tag=restore&reload=1"
node tools/smoke-test.js parse restore
```

> **小提示**：每次測試都應該用**全新的 `--user-data-dir`**。重用同一個 profile 目錄時，
> 上一次被強制結束的 Chrome 可能留下鎖，新實例會把網址轉交給已經死掉的舊實例然後立即退出，
> 令測試靜靜地收不到結果（我們踩過這個坑）。

> **為甚麼不直接用 `--dump-dom --virtual-time-budget`？**
> 那樣 Chrome 會用「虛擬時間」加速計時器，父層的逾時 timer 可能跑得比 iframe 真正載入快，
> 出現時得時唔得的**假失敗**（我們實際踩過這個坑）。用真實時間 + HTTP + POST 結果就完全穩定。
>
> 附帶好處：`beacon-server.js` 也是個現成的本機預覽伺服器，
> 你可以用它開 `http://127.0.0.1:8791/` 來看網站（不過直接雙擊 `index.html` 一樣可以）。

> 注意：`tools/fix-wording.js` 是一次性的用語還原腳本（把「上邊／下邊／裏邊」還原成
> 「上面／下面／裏面」）。它已經跑過，保留只是方便你日後查紀錄，正常情況下不需要再執行。

---

## 九、設計取捨（方便你之後維護）

* **資料與畫面分離**：所有課程內容在 `data-*.js`，畫面由 `app.js` 產生，改內容不用碰 HTML。
* **一個引擎、三個科目**：三科共用同一套 `runner.js` / `quiz.js` / `app.js`，
  所以修好一個 bug 就三科一齊好；新科目只要加一個 data 檔。
* **沙箱隔離**：學員程式碼跑在沒有同源權限的 iframe，兼有逾時保護。
* **漸進增強**：即使讀不到 localStorage（隱私模式），網站仍可正常使用，只是不存進度；
  `runner.js` / `quiz.js` 未載入時亦會有友善提示，不會白畫面。
* **無障礙**：分頁用 `role="tab"` / `aria-selected`，學習點勾選用真正的 `<label>` + `<input>`，
  隱藏文字用 `.sr-only`，並尊重 `prefers-reduced-motion`。
* **手機優先考量**：900px 以下側欄變成抽屜、按鈕加高、程式碼框可橫向捲動、預覽框自動縮短。

---

## 十、已知限制

* 執行結果的 `[ 1, 2 ]` 這種陣列輸出格式會因瀏覽器而略有不同（示範文字以 Chrome 為準）。
* 沙箱內建立的 DOM 元素只存在於沙箱 iframe，**不會**出現在主網站頁面上（這是刻意設計，
  JS 科第 9 章的解說有提醒學員）。
* 進度不會跨裝置同步（純前端、無伺服器）。
* console 模式只收集**同步**輸出。學員用 `setTimeout` 之類寫的非同步輸出不會顯示，
  原因是跨來源沙箱 iframe 的 timer 會被瀏覽器節流（詳見第三節的「實作陷阱」）。
* console 模式的沙箱 iframe 是隱藏的（1×1、畫面外），這是為了不影響版面；
  副作用是它的 timer 會被節流，所以我們不用 timer 回報結果。
* 學習模組的預覽框是靜態的（不執行 console 收集），要試程式碼請去「🧪 練習」分頁。
* 語法高亮支援 `html` / `css` / `js` 三種；加新語言要在 `runner.js` 的 `renderCode()` 加一個分支。
* `data-*.js` 的 `puzzle.task` / `puzzle.hint` 是刻意允許 HTML 的（可以寫 `<code>`），
  其他欄位都會經過 escape 處理（只開放 `<code> <b> <strong> <em> <br>` 幾種標籤）。
  如果你把 `data-*.js` 改成由外部／使用者提供，就要自行消毒。

---

## 十一、本次交付的驗證狀況（實際跑過的）

> 這一節記錄交付時**真正執行過**的檢查與結果，方便你日後判斷哪些部分最有信心。

### 1. 靜態驗證（全部 exit 0）

| 檢查 | 指令 | 結果 |
| --- | --- | --- |
| 語法 | `node --check` × 6 個主檔案 | 全部通過 |
| 課程資料結構 | `node tools/validate-data.js` | ✅ 0 錯誤 0 警告（25 章、135 學習點、227 題） |
| 練習參考答案 | `node tools/check-solutions.js` | ✅ 25 個練習全部通過（JS 答案真的用 Node 跑過），並檢查每個 CSS 預覽的選擇器對得上預覽 HTML |
| JS 學習點輸出 | `node tools/check-solutions.js --points` | ✅ 50 個學習點的 `result` 與實際輸出逐字一致 |
| 選擇器契約 | `node tools/check-contract.js` | ✅ ALL PASS（無打錯的 id／class） |
| 沙箱單元測試 | `node tools/test-runner.js` | ✅ ALL PASS（51 項：格式、錯誤、高亮、srcdoc、runId） |

### 2. 真實瀏覽器端到端測試（headless Chrome，真實時間）

用 `tools/beacon-server.js` + `tools/smoke-test.js` 模擬一個學員完整走一次，分三個 pass：

| pass | 視窗 | 結果 |
| --- | --- | --- |
| 桌面版 | 1440×900 | `SMOKE RESULT: ALL PASS`（完整 suite） |
| 重新載入還原 | 1440×900 | `ALL PASS`（12 項）：重新載入後科目／分頁／章節／已學會／草稿／答案／主題全部還原，首頁卡片顯示「學習進度 3%」，之前答對的題目仍然顯示解釋 |
| 手機版 | ≤900px（實測 512px） | `ALL PASS`：完整 suite 在窄螢幕一樣通過，另加 9 項手機檢查 |

手機檢查實際輸出：

```
PASS  [手機] 側欄預設收埋喺畫面外        :: right=-6
PASS  [手機] 撳漢堡選單之後側欄滑出      :: left=0 width=320
PASS  [手機] 側欄打開時有遮罩
PASS  [手機] 撳遮罩之後側欄收返          :: right=-6
PASS  [手機] 版面變成單欄                :: 473px
PASS  [手機] 置頂工具列仍然固定
```

桌面版覆蓋範圍：

* 首頁三張科目卡、進入科目、返回首頁、`data-subject` 主題切換
* 學習模組：側欄章節數、學習點渲染、**5 個即時預覽 iframe**、語法高亮、勾選後進度環更新
* **教材內容**：CSS 第 5 章的 box-shadow 模糊對照預覽真的有渲染出來
* **顏色寫法**：課程用到的 40 種英文顏色名全部是有效 CSS（打錯名會靜靜地失效，所以要用 `style.color` 驗證）；全站色碼只剩 1 處刻意的教學例子
* 進度寫入 localStorage、換章節
* 練習模組：提示／顯示答案／還原範例、**執行後預覽真的更新**、狀態顯示「✅ 執行完成」
* 測驗模組：9 題渲染、答對變綠並顯示解釋、答錯變紅、「🔄 重做呢題」後回復、全科總分與進度條
* **答題體驗：在測驗或練習分頁揀另一章之後，畫面會立即跳返最頂（由第 1 題開始）**
* JS 科 console 模式：`console.log("測試" + (1 + 1))` → 輸出 `測試2`；
  寫錯語法 → 顯示 `❌ SyntaxError: Unexpected identifier 'is'`
* 深色／淺色模式切換
* **執行期間零 JS 錯誤**；沙箱訊息 `ready` 與回報數目完全配對

### 3. 這次開發中抓到並修正的**兩個真實缺陷**（會影響使用者的）

1. **沙箱用 `setTimeout` 回報結果 → 練習永遠停在「⏳ 執行中」**
   沙箱 iframe 是跨來源（`sandbox="allow-scripts"` 沒有 `allow-same-origin`）又被放在畫面外，
   Chrome 會節流它的 timer，實測那個 timer 可能永遠不觸發。
   已改成：console 模式**執行完立即回報**、preview 模式**等 `DOMContentLoaded`**，
   完全不用 timer；逾時保護交給主頁面（非跨來源）的 timer。
2. **不同 iframe 的訊息互相干擾 → 執行的程式碼遺失**
   舊版只靠固定的 `token` 認訊息，任何舊 iframe 晚到的 `ready` 都會令外層把程式碼
   送去「還未註冊監聽器」的新 iframe，那次執行就永遠沒有結果。
   已改成：每次執行產生唯一的 `runId`，外層只接受屬於本次 iframe 的訊息。

> 兩個問題都補了回歸測試（`tools/test-runner.js` 內的 `[回歸]` 與 `[runId]` 項目），
> 日後如果有人改回舊寫法，測試會立刻失敗。

### 4. 人工核對

* 逐行核對 `index.html` 與 `app.js` / `quiz.js` / `runner.js` 之間的 id 與 `data-*` 契約
  （已由 `tools/check-contract.js` 自動化）。
* 檢查 `styles.css` 的 `[hidden] { display: none !important; }`——因為作者樣式
  （`.tabs { display:flex }`、`.icon-btn { display:grid }`）會蓋過瀏覽器預設的 `[hidden]`，
  沒有這行就會出現「明明 `hidden` 但仲顯示」的問題。
* 用語一致性：全文用「章」（介面也是寫「第 N 章」），沒有簡體字。

**第一次開啟時，建議自己驗證一次**：首頁三張卡 → 入 HTML 科睇學習點（預覽框有沒有顯示）→
去練習撳「▶ 執行」（預覽有沒有更新）→ 去測驗答一題（有沒有變色同解釋）。
如有異常請打開 DevTools（F12）的 Console 看紅字。
