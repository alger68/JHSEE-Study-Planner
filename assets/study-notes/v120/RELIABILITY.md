# V1.3.1 測驗與保存修正版

本次保留 V1.3.1 的教材與題目來源版本識別，避免既有錯題快照因版本字串改變而失效。不是重新發布舊版 V1.1，也沒有覆蓋根目錄 Study Planner。

## 已實作

- 段考可勾選同年級、學期、科目的多個講義／章節，10／20／30／40 題整卷作答、計分與解析。
- 改變年級、學期、科目時立即更新可勾選清單，不沿用其他範圍的舊勾選。
- 數值模板可提供 40 道不重複題幹；純固定題範圍不足時顯示實際题數，不用重複題填滿。
- 組卷按單元輪流選題，讓各勾選單元在題數足夠時都能出現，再依弱點排序。
- 變化練習從較大的候選池挑選弱項，不只是把同一份試卷重新排序；候選弱題足夠時優先取約六成（依整數題數上取整），其餘保留一般題。
- 未交卷的最後一份題組、數字、選項、已選答案，以及已交卷／錯題重練狀態，在同一瀏覽器自動保存，回到同一份試卷可續答。
- 段考與一般試卷列印都寫入專用列印區，可選是否附答案與解析。
- 40 題測驗結果可重新載入及 JSON 備份，不再被 20 題的驗證上限誤判為損壞。
- 換一份保留整份段考範圍與題數；重複點交卷不會重複累計；答案紀錄最多保留最近 10,000 筆。

## 明確限制

本次教材仍為 62 份自編學期核心／語言學習指南，加原有 2 份生物專題，合計 64 份、382 道固定檢測。這不是各出版社所有課本逐課、逐頁整理完成；課文目錄、章節順序、教師指定範圍仍需逐項對應。115 學年度各年級出版社沿用已按校方原圖核對的 31 個欄位，不推定未來學年度也相同。

題目變化使用有邊界的程式模板與固定題抽選，不是線上 AI 無限即時命題。相同種子、範圍及相同弱點統計可重現相同試卷；更換種子不保證跨次永不重複。

進度不是雲端同步。未交卷快照與已交卷進度分開保存：變化題 JSON 匯出包含已交卷錯題與歷史，不包含未交卷快照；原本的筆記收藏另有備份入口。關閉無痕視窗、清除網站資料或儲存被封鎖，都可能失去本機資料。多分頁同時作答共用最後一份快照，不提供多人協同或跨分頁鎖定。

## 可重跑驗證

在儲存庫根目錄：

```sh
node --test assets/study-notes/v120/tests/*.test.cjs assets/study-notes/v120/tests/resumption-acceptance.cjs
node assets/study-notes/v120/build.cjs assets/study-notes/index.html out/index.html
python -m pip install playwright==1.57.0
python -m playwright install chromium
python assets/study-notes/v120/tests/browser-resume.py out/index.html evidence/base
python assets/study-notes/v120/tests/reliability-browser.py out/index.html evidence/reliability
```

新增 15 項 Node 回歸測試，以及 14 項整卷與保存瀏覽器檢查。瀏覽器腳本預設走 HTTP 和真實 localStorage；`--isolated` 僅供受限環境的 DOM／儲存替身測試，不能代替原生測試。GitHub Pages workflow 使用原生模式，通過才會發布；正式網址發布後再檢查新功能標記、教材總數，以及 Study Planner 入口。

實際是否通過以該 commit 的 Actions 結果與 notes-verification artifact 為準。本次不聲稱經實體 iPhone Safari、所有印表機或教師全面審題。


<!-- source-bundle verification trigger: 2026-09-24 -->
