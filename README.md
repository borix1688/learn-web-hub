# 前端基礎學堂 · Frontend Foundations

> 一個純前端（**無框架、無伺服器、免安裝**）的互動學習網站，寫給完全零基礎、講粵語（香港用語）的初學者。
> 一個主程式，三個科目：**HTML · CSS · JavaScript**。
>
> A dependency-free, offline-first interactive learning site for absolute beginners.
> One entry page, three subjects: **HTML, CSS, JavaScript**. Zero build step — just open `index.html`.

---

## ✨ 特色 Features

| | |
| --- | --- |
| 📖 **學習 Learn** | 每章 4–6 個學習點：**生活化比喻 → 程式碼範例（語法高亮）→ 即時輸出 → 重點提示** |
| 🖥️ **即時預覽** | HTML／CSS 的示範與練習**真的渲染在 iframe 裡**（不是叫你自己想像結果） |
| 🧪 **練習 Practice** | 每章一個可編輯程式碼框：執行 / 提示 / 顯示答案 / 還原範例，輸出顯示在頁面上（**不用 alert**） |
| ⌨️ **手機友善** | 編輯框下面有**快速輸入符號列**（按語言不同），手機打 `{ } < > ;` 唔使切鍵盤 |
| 📝 **測驗 Quiz** | 每章 8–10 題選擇／判斷題：即時判分、顯示解釋、答錯可重做、全科總分與進度條 |
| 💾 **進度儲存** | 學習點勾選、練習草稿、測驗答案全部存在瀏覽器（localStorage），閂咗再開都仲喺度 |
| 📱 **響應式 + 深色模式** | 手機版側欄變抽屜、單欄版面；支援 `prefers-color-scheme` 同手動切換 |
| 🎨 **每科一個主題色** | 進入科目自動換色（HTML 暖橙 / CSS 藍紫 / JS 藍綠） |

---

## 🚀 快速開始 Quick start

```
git clone <this-repo>
cd learn-web-hub
```

然後**雙擊 `index.html`** 就得（`file://` 都開得，唔需要伺服器、唔需要 npm install）。

想用本機伺服器開（例如測試手機）：

```bash
node tools/beacon-server.js        # 開 http://127.0.0.1:8791/
```

---

## 📚 課程內容 Curriculum

| 科目 | 章節 | 學習點 | 測驗題 |
| --- | --- | --- | --- |
| **HTML** | 8 章：文件結構同 DOCTYPE／標題同段落／清單／表格／圖片同多媒體／連結、div 同 span、語意標籤／表單入門／Bootstrap 5 快速排版 | 40 | 72 |
| **CSS** | 8 章：CSS 係乜嘢？三種寫法（inline／internal／external ＋對照表）／選擇器同偽元素／盒模型／文字同顏色／背景同外觀／display 同版面流／定位 position／Flexbox 同響應式 | 45 | 74 |
| **JavaScript** | 9 章：入門與變數／資料類型／運算子／條件判斷／迴圈／函數／陣列／物件／DOM 操作 | 50 | 81 |
| **合計** | **25 章** | **135** | **227** |

> 全部內容離線可用：**不依賴任何外部圖片、CDN、字體或網絡**。

---

## 🗂 專案結構 Project structure

```
learn-web-hub/
├── index.html            頁面骨架（首頁揀科目 + 三大模組容器）
├── styles.css            全部樣式：配色、排版、響應式、深色模式、三科主題色
├── data-html.js   ★      HTML 課程資料（8 章）—— 改內容只需改這裡
├── data-css.js    ★      CSS 課程資料（8 章）
├── data-js.js     ★      JavaScript 課程資料（9 章）
├── runner.js             沙箱執行器（即時預覽 iframe + console 收集 + 語法高亮）
├── quiz.js               測驗模組（判分、解釋、重做、全科總分）
├── app.js                主程式（品牌設定、科目切換、分頁、側欄、進度）
├── _SPEC-課程資料格式.md   課程資料的完整欄位規格
├── README-如何擴展.md      使用與擴展說明（含實作陷阱與驗證紀錄）
└── tools/                開發工具（網站本身不需要，可整包刪掉）
```

**載入順序不可調換**：`data-*.js` → `runner.js` → `quiz.js` → `app.js`

---

## 🧩 怎樣加內容 How to extend

只需改 `data-*.js`（不用碰 HTML／JS）：

```js
{
  id: 'h9', title: '表單驗證入門', icon: '✅', summary: '一句話。',
  points: [{
    title: 'required 屬性',
    analogy: '好似茶餐廳落單一定要寫「幾多位」……',
    code: '<input type="text" required>', lang: 'html',
    preview: { html: '<input type="text" required placeholder="必填">' },
    tip: '重點提示'
  }],
  puzzle: { title: '練習 9', task: '…', hint: '…', starter: '…',
            solution: '<input type="text" required>', mode: 'preview',
            lang: 'html', expectCode: 'required' },
  quiz: [{ type: 'mc', q: '…', options: ['A','B','C','D'], answer: 0, explain: '…' }]
}
```

詳細欄位、寫作風格、常見陷阱見 **[README-如何擴展.md](README-如何擴展.md)** 與
**[_SPEC-課程資料格式.md](_SPEC-課程資料格式.md)**。

---

## 🛠 開發工具 Dev tools

改完課程內容，跑一次驗證（全部都是 Node 腳本，無額外依賴）：

```bash
node tools/validate-data.js        # 課程資料結構（0 錯誤 0 警告為目標）
node tools/check-solutions.js      # 練習的參考答案真係跑得、輸出對得上
node tools/check-contract.js       # app.js 查詢的 id/class 都存在
node tools/test-runner.js          # 沙箱單元測試（console 格式、錯誤處理、語法高亮）
```

另有真實瀏覽器端到端測試（headless Chrome，57 項檢查）：

```bash
node tools/beacon-server.js 8791
# 開 http://127.0.0.1:8791/tools/_smoke.html?tag=desktop（Chrome）
node tools/smoke-test.js parse desktop
```

---

## ✅ 已驗證 Verified

* 語法檢查 15 個 JS 檔 → 0 錯誤
* 課程資料 0 錯誤 0 警告；25 個練習的參考答案全部實測通過
* 選擇器契約 ALL PASS；沙箱單元測試 51 / 51
* 真實瀏覽器端到端（桌面 1440×900、手機 512px、重新載入還原）→ **ALL PASS**
* 全站零色碼（顏色統一用可讀的 CSS 顏色名）、零外部依賴

---

## 📄 授權 License

> 待定（TBD）。如未指定，預設保留所有權利；想開源可加 MIT／CC BY 4.0。

課程文字與程式碼由本專案作者編寫，供教學使用。歡迎按需要修改內容與配色。
