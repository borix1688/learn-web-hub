#!/usr/bin/env node
/* ============================================================================
   測試用迷你伺服器（開發工具，網站本身「不需要」這個檔案）
   ----------------------------------------------------------------------------
   為甚麼需要它？
     用 `chrome --headless --dump-dom --virtual-time-budget=N` 做端到端測試時，
     Chrome 會用「虛擬時間」加速計時器，於是「父層的逾時 timer」可能跑得比
     「iframe 真正載入」快，令測試出現假失敗（同一份程式碼時得時唔得）。

     所以這裡改用真實時間測試：
       1. 這個伺服器同時扮演「靜態檔案伺服器」＋「測試結果收集器」。
       2. 測試頁跑完之後，用 fetch POST 把結果送到 /beacon。
       3. 伺服器把結果寫入 tools/_smoke-result.txt，外面的腳本再讀出來。

   用法：
       node tools/beacon-server.js            # 預設 port 8791
       node tools/beacon-server.js 9000
       然後開 http://127.0.0.1:8791/tools/_smoke.html

   收了結果之後會自動結束；另外有 120 秒保險，避免一直掛住。
   ========================================================================== */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.argv[2] || 8791);
const OUT = path.join(__dirname, '_smoke-result.txt');
const TIMEOUT_MS = 120000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

let done = false;

const server = http.createServer(function (req, res) {
  const u = url.parse(req.url, true);

  /* 測試結果收集。
     可以用 ?tag=desktop / mobile / restore 分開收集（寫入不同檔案），
     方便一次執行跑幾個 pass（桌面、手機、重新開啟還原）。 */
  if (u.pathname === '/beacon' && req.method === 'POST') {
    const tag = String(u.query.tag || '').replace(/[^\w-]/g, '');
    const out = tag ? path.join(__dirname, '_smoke-result-' + tag + '.txt') : OUT;
    let body = '';
    req.on('data', function (c) { body += c; });
    req.on('end', function () {
      fs.writeFileSync(out, body, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('ok');
      done = true;
      console.log('已收到測試結果' + (tag ? '（' + tag + '）' : '') + '：' + body.length + ' 字 → ' + path.basename(out));
    });
    return;
  }

  /* ---- 靜態檔案 ---- */
  let p = decodeURIComponent(u.pathname);
  if (p === '/') p = '/index.html';
  const file = path.join(ROOT, p.replace(/^\/+/, ''));

  if (file.indexOf(ROOT) !== 0 || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 ' + p);
    return;
  }

  res.writeHead(200, {
    'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store'
  });
  res.end(fs.readFileSync(file));
});

server.listen(PORT, '127.0.0.1', function () {
  console.log('測試伺服器已啟動：http://127.0.0.1:' + PORT + '/tools/_smoke.html');
});

setTimeout(function () {
  if (!done) {
    console.log('⚠️ ' + (TIMEOUT_MS / 1000) + ' 秒內未收到測試結果，結束。');
    server.close(function () { process.exit(2); });
  }
}, TIMEOUT_MS);
