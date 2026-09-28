# V1.6.0 教學與測驗地圖

## 對使用者的交付
維持原首頁、資料及作答紀錄；新增 `#/atlas`。按照年級 → 分科 → 明確學年度／學期 → 正式課／節／主題，連接來源、歷屆範圍、明確題號及教材狀態。

來源共143份（103份課程計畫、40份題本），全部原檔已開啟並核對前次清單的SHA-256。50份為115-1，53份為114-2；題本全部為114-2。沒有115-2來源，不假冒當期。

本版81份課程計畫已有定位項目，共560個課／節／主題；其餘22份保留原始連結及「待轉錄」，不以0章計算。不保證所有活動與補充教材已被逐項轉錄。不同學科的課／節／主題層級不可混算為全課本小節數。

40份題本建立56筆分科範圍紀錄，其中範圍不明、過廣、或矛盾者保留註記而不強行連章。八下數學另有21個逐題定位的章節標籤；「列入範圍」不等於「有實際題號」，也不代表已逐題驗算原答案。

保留來源衝突：七下社會三段歷史第3頁／第7頁章節不同；八下社會二段歷史題本／答案冊別不同；九下英語二段封面Book6／答案Unit3–Review2不同。七下地理L3架構「第一級農業」／授課欄「第一級產業」保留異名。

## 真正新增的教學內容
新寫七上生物17節，每節3個重點與6道自編固定題（共102題）。原有5節不改ID，22個編號小節都有精選重點，合計121道章節固定題。全站89份講義、508道固定題。不是三年全科已完成、也不是每節完整課文與全部題型。

新講義為原創教學解說，來源計畫提供範圍及組織方式。酵素溫度等需補充的內容，另列翰林、OpenStax、教育大市集資料，不能把原文件中的單一數值當成所有情況通則。

## 實作與維護
- `modules/atlas-sources.json`：逐列保存143個來源，columns說明欄位順序。SHA、原始檔名、Drive ID均保存；不在GitHub轉載整份PDF及教師個人資料。
- `modules/atlas-outlines.txt`：本版逐項定位的補充章名及PDF頁碼。
- `modules/atlas-exams.json`：原題本範圍、差異與逐題標籤。不可用range代替question。
- `modules/source-atlas.cjs`：日期隔離、章節連結、動態教材狀態；只有真實存在的講義才能取得unitId。
- `modules/atlas-biology.txt`、`atlas-lessons.cjs`：17份新增教材及與實際考點一致的concept對應。
- `modules/atlas-ui.js`、`atlas.css`：使用既有路由，不另設輪詢、外部模型或資料庫。
- `build-atlas.cjs`：在既有V1.5建置結果上加入資料與路由，保留原建置器作回歸測試。

建置：`node assets/study-notes/v120/build-atlas.cjs assets/study-notes/index.html output/index.html`

進度鍵與題目引擎版本1.3.1不變；現有題目快照保持可還原。新增資料沒有重編舊ID。新生物固定題可洗牌與重作，未宣稱為無限生成題；數值變化題繼續由原引擎處理。

## 驗收
Node先失敗再實作，另針對錯題觀念配對補回歸測試。測試：`node --test assets/study-notes/v120/tests/*.test.cjs assets/study-notes/v120/tests/resumption-acceptance.cjs`。

本機Chromium禁止loopback導航，故本機以`--isolated`測DOM／記憶體儲存並明確標示。GitHub Actions上以真實HTTP／原生localStorage跑既有與新增瀏覽器檢查，發布後再從公開網址驗證實際版本、143來源、22節生物及原Planner入口。實體iPhone Safari與原生列印未做實機驗收。
