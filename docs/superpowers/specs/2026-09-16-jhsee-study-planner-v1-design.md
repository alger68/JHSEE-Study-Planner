# JHSEE Study Planner V1 設計規格

日期：2026-09-16  
專案：`JHSEE-Study-Planner`  
目標使用者：準備 116 年（2027）國中教育會考的學生  
部署目標：GitHub Pages

## 1. 專案定位

`JHSEE-Study-Planner` 是一個**獨立的會考讀書規劃與弱點追蹤系統**。它不負責完整模擬考引擎，也不負責遊戲化英文闖關；它的任務是把「模考結果、每日可用時間、近期學校進度、錯題、練習成果」轉換成可執行的每日讀書計畫。

核心閉環：

```text
模考診斷
  → 科目優先級
  → 今日任務
  → 完成紀錄
  → 錯題間隔複習
  → 每週 Mini Check
  → 趨勢分析
  → 下一週重新排程
```

本專案與下列專案保持分離：
- `JHSEE-English-Adventure`：英文遊戲化闖關。
- `JHSEE-All-Subjects`：全科模擬考與正式作答流程。

## 2. 隔離原則

為避免不同專案互相干擾，V1 必須遵守：

1. 不共用 router、UI shell、題庫檔案或考試 session。
2. 不直接讀寫其他專案的 LocalStorage keys。
3. 本專案所有 LocalStorage key 統一使用 `jhseePlanner.v1.*`。
4. 未來若要交換成績，只使用明確的 JSON 匯入/匯出格式；V1 不做隱性同步。
5. 不把 Study Planner 做成模擬考程式的子頁面或 iframe。
6. 不使用其他專案的 Service Worker cache 名稱。

由於三個 GitHub Pages 專案可能位於相同 origin、不同 path，LocalStorage 仍可能在瀏覽器層級共用，因此 namespace 隔離是硬性要求。

## 3. V1 核心目標

V1 要解決五件事：

1. 輸入一次或多次模考成績，建立起始診斷。
2. 每天根據可用時間，自動排出具體讀書任務。
3. 弱科多分配時間，但強科不能長期完全不碰。
4. 錯題使用間隔複習，不只是收藏。
5. 每週顯示趨勢，讓學生知道「正在改善哪裡、哪裡仍卡住」。

V1 不追求大量題庫，也不直接預測正式會考 A/B 或高中錄取結果。

## 4. 起始診斷

### 4.1 模考輸入

支援手動輸入五科模考結果與作文級分（作文可選）。

```json
{
  "id": "mock-2026-09-first",
  "date": "2026-09-16",
  "label": "第一次模擬考",
  "scope": "第一次模考範圍",
  "subjects": {
    "chinese": { "grade": "A" },
    "english": { "grade": "B" },
    "math": { "grade": "A" },
    "social": { "grade": "A" },
    "science": { "grade": "A" }
  },
  "writingLevel": null
}
```

第一版接受：`A++`、`A+`、`A`、`B++`、`B+`、`B`、`C`。

### 4.2 診斷限制

只有科目等級時，系統只能判定「哪科優先」，不能宣稱知道該科內部的文法、閱讀、代數、地理等細部弱點。

子領域弱點必須由後續練習紀錄累積後才能建立。

## 5. 科目優先級模型

### 5.1 模考基線分數

以會考等級建立初始 weakness baseline：

```text
A++ = 0.10
A+  = 0.18
A   = 0.28
B++ = 0.45
B+  = 0.58
B   = 0.70
C   = 0.90
```

這些值只用於「讀書時間分配」，不是官方成績換算。

### 5.2 動態 priority

有實際學習資料後，每科：

```text
priority =
  0.40 × weakness
+ 0.25 × overdue
+ 0.20 × negativeTrend
+ 0.15 × upcomingExamWeight
```

全部因子正規化至 0～1。

- `weakness`：近 30 天練習正確率反向值；資料不足時使用模考 baseline。
- `overdue`：到期錯題與久未複習內容比例。
- `negativeTrend`：近四次練習是否下降。
- `upcomingExamWeight`：下一次校內考或模考範圍加權。

## 6. 每日時間配置

預設每日讀書時間：75 分鐘，可設定 20～180 分鐘。

### 6.1 一般日 75 分鐘模板

```text
15 分：到期錯題
25～30 分：最高優先科
15 分：輪替維持科
15～20 分：目前學校進度
```

### 6.2 最低維持規則

- 最弱科：預設可占每日 35～45%。
- 次弱科：20～30%。
- 其他科：長期平均不得低於 8～12%。
- 任一科連續 7 天完全未接觸，隔日強制排入維持任務。
- 任一科連續 14 天無有效學習紀錄，priority 至少提升一級。

### 6.3 短時間模式

若當天只有 20～30 分鐘：

1. 先做已到期錯題。
2. 再做最高優先科。
3. 其他任務不累積成龐大 backlog，只重新排入未來。

## 7. 今日任務模型

任務資料：

```json
{
  "id": "task-2026-09-17-001",
  "date": "2026-09-17",
  "subject": "english",
  "type": "weakness-drill",
  "topic": "grammar",
  "plannedMinutes": 15,
  "status": "pending",
  "source": "planner",
  "note": "完成 10 題並記錄錯因"
}
```

V1 任務類型：

- `review-due`：到期錯題。
- `weakness-drill`：弱點專項。
- `maintenance`：強科維持。
- `current-school`：目前學校進度。
- `reading`：閱讀任務。
- `listening`：聽力任務。
- `mini-check`：每週小測或自我檢核。
- `manual`：使用者自行新增。

## 8. 英文 B 的專項路線

對「英文為弱科」的情況，V1 提供可選的英文專項模板，但不把任何學生資料硬編碼。

英文子領域：

- vocabulary
- grammar
- cloze
- reading
- listening

階段：

1. `Diagnose`：各子領域至少完成一組基準練習。
2. `Stabilize`：弱項近 20 題正確率 ≥ 75%。
3. `Mixed`：混合題近 30 題正確率 ≥ 80%。
4. `Timed`：限時混合題近 30 題正確率 ≥ 80%。
5. `Maintain`：連續三週維持目標後轉維持模式。

這些值是平台控制門檻，不標示為「已達會考 A」。

## 9. 弱點判定

一個 topic 至少累積 5 題有效作答，才可正式標記為弱點。

狀態：

```text
sample < 5              → 資料不足
accuracy < 60%          → 明顯弱點
60% ≤ accuracy < 75%    → 需要加強
75% ≤ accuracy < 85%    → 穩定中
accuracy ≥ 85%          → 維持
```

若樣本數少於 5，不顯示紅色弱點警示。

## 10. 錯題間隔複習

### 10.1 排程

首次答錯：

```text
Day 0  看解析＋記錄錯因
Day +1 第一次重做
Day +3 第二次重做
Day +7 第三次重做
Day +14 第四次重做
Day +30 抽樣維持
```

### 10.2 狀態轉移

- 答對：進入下一階段。
- 答錯：回到 `+1 天` 階段，`lapseCount += 1`。
- 完成 +14 階段：標記 `mastered = true`。
- mastered 題仍可在 30 天後抽樣維持。

資料：

```json
{
  "itemId": "eng-grammar-001",
  "subject": "english",
  "topic": "grammar",
  "firstWrongAt": "2026-09-16",
  "stage": 2,
  "nextReviewAt": "2026-09-19",
  "lapseCount": 1,
  "lastResult": "correct",
  "mastered": false
}
```

V1 的錯題可以由使用者手動輸入或從未來的成績匯入檔建立；不直接讀取其他專案內部資料。

## 11. 每週 Mini Check

Study Planner 的 Mini Check 不做成完整會考引擎，只作為學習追蹤。

方式：

- 使用者可以輸入本週五科簡短測驗結果。
- 或記錄從其他練習工具得到的正確率。
- 建議每週六一次。

預設輸入欄位：

```json
{
  "week": "2026-W38",
  "subjects": {
    "chinese": { "accuracy": 82 },
    "english": { "accuracy": 68 },
    "math": { "accuracy": 88 },
    "social": { "accuracy": 84 },
    "science": { "accuracy": 86 }
  }
}
```

## 12. Dashboard

首頁/進度頁顯示：

- 今日預計分鐘數。
- 今日完成率。
- 到期錯題數。
- 目前最高優先 1～3 科。
- 五科近 4 週趨勢。
- 最弱 3 個 topic。
- 改善最快 3 個 topic。
- 最近 7 天實際完成分鐘。
- 距離下一次模考天數。

只有至少 2 個可比較資料點才顯示趨勢箭頭；否則顯示「資料不足」。

## 13. 學校進度與下一次考試

使用者可設定：

```json
{
  "term": "grade9-semester1",
  "nextExamDate": "2026-12-15",
  "nextExamLabel": "第二次模擬考",
  "currentScopes": {
    "chinese": "目前學校進度",
    "english": "目前學校進度",
    "math": "目前學校進度",
    "social": "目前學校進度",
    "science": "目前學校進度"
  }
}
```

近期考試只提高 priority，不得把長期弱點複習全部擠掉。

## 14. 獨立 LocalStorage Schema

本專案使用：

```text
jhseePlanner.v1.profile
jhseePlanner.v1.diagnostics
jhseePlanner.v1.settings
jhseePlanner.v1.dailyTasks
jhseePlanner.v1.practiceLogs
jhseePlanner.v1.reviewSchedule
jhseePlanner.v1.miniChecks
jhseePlanner.v1.mastery
jhseePlanner.v1.ui
```

禁止讀寫：

```text
jhsee.v1.*
JHSEE-English-Adventure 使用的任何既有 key
其他專案未明確授權的 key
```

## 15. 與其他小程式的整合方式

V1 僅定義資料交換格式，不做自動跨專案讀取。

### 15.1 匯入格式

```json
{
  "schema": "jhsee-result-export-v1",
  "sourceApp": "JHSEE-All-Subjects",
  "exportedAt": "2026-09-20T10:00:00+08:00",
  "result": {
    "date": "2026-09-20",
    "subject": "english",
    "accuracy": 72,
    "topics": {
      "grammar": { "answered": 10, "correct": 6 },
      "reading": { "answered": 10, "correct": 8 }
    }
  }
}
```

Study Planner 必須驗證 schema 後才匯入。

### 15.2 匯出格式

可匯出讀書摘要：

```json
{
  "schema": "jhsee-study-summary-v1",
  "period": "2026-W38",
  "subjectPriorities": {
    "english": 0.74,
    "math": 0.28
  },
  "weakTopics": ["english:grammar"]
}
```

其他專案是否使用此資料由各自決定；不得建立雙向隱性同步。

## 16. 前端架構

V1 採純 HTML/CSS/JavaScript ES Modules。

建議結構：

```text
index.html
css/
  base.css
  components.css
  dashboard.css
js/
  app.js
  router.js
  config.js
  core/
    diagnostics.js
    priorities.js
    study-planner.js
    spaced-review.js
    mastery.js
    storage.js
    import-export.js
  ui/
    dashboard.js
    today.js
    diagnostics-form.js
    study-settings.js
    review.js
    progress.js
    import-export.js
tests/
  diagnostics.test.js
  priorities.test.js
  study-planner.test.js
  spaced-review.test.js
  mastery.test.js
  storage.test.js
  import-export.test.js
.github/workflows/pages.yml
```

## 17. UI 導航

V1 主導航：

1. 今日
2. 計畫
3. 錯題複習
4. 模考紀錄
5. 進度
6. 設定

首頁第一畫面應回答三個問題：

- 今天要讀什麼？
- 要花多久？
- 為什麼排這些？

每個自動任務顯示「排程原因」，例如：

> 英文文法：近 20 題正確率 62%，且昨天有 3 題到期錯題。

## 18. 錯誤與邊界條件

- 沒有模考資料：以平均五科分配啟動。
- 沒有 topic 資料：只做科目級排程。
- 每日時間 < 20 分鐘：只排到期錯題與最高優先科。
- 一天未完成：不直接把所有任務複製到明天。
- 多天未使用：重新計算，而不是堆積 backlog。
- LocalStorage JSON 損壞：單 key 回退安全預設，不清除其他可用資料。
- 匯入檔 schema 錯誤：拒絕匯入並指出錯誤欄位。
- 未知科目或 topic：保留原始資料到 diagnostics，不納入自動排程。

## 19. 測試要求

至少覆蓋：

1. A++～C 轉換成 baseline weakness。
2. priority 公式計算與 0～1 clamp。
3. 最弱科時間上限與強科最低維持規則。
4. 75 分鐘任務總時數不得超過 75。
5. 20 分鐘模式只產生必要任務。
6. 連續 7 天未碰科目會強制維持。
7. topic 樣本 < 5 時顯示資料不足。
8. +1/+3/+7/+14/+30 間隔排程。
9. 答錯時 stage 回退且 lapseCount 增加。
10. mastered 狀態轉移。
11. LocalStorage namespace 僅使用 `jhseePlanner.v1.*`。
12. 匯入 `jhsee-result-export-v1` 成功與錯誤 schema 拒絕。
13. 不讀取 `jhsee.v1.*` 或其他專案 key。
14. 兩筆以上才產生趨勢方向。

## 20. V1 驗收條件

V1 完成時：

1. GitHub Pages 可正常開啟手機版與桌面版。
2. 可輸入至少一筆五科模考診斷。
3. 可設定每日可用時間與下一次考試日期。
4. 可生成當日讀書計畫，且顯示排程原因。
5. 可手動完成/略過任務並記錄分鐘數。
6. 可新增錯題並依間隔日期出現在今日任務。
7. 可輸入每週 Mini Check 並看到近四週趨勢。
8. 可查看科目及 topic 熟練度。
9. 可匯入/匯出定義好的 JSON。
10. 本專案 LocalStorage 與另外兩個小程式互不衝突。
11. 核心測試全部通過。

## 21. V1 不納入範圍

- 完整會考題庫。
- 全真模擬考引擎。
- 英文遊戲化闖關。
- 自動抓取其他專案 LocalStorage。
- 帳號與雲端同步。
- OpenAI API 自動出題。
- AI 作文評分。
- 官方會考等級機率預測。
- 自動高中落點推薦。

## 22. 後續版本

### V1.5
- PWA/離線模式。
- 行事曆週視圖。
- 更完整的讀書時間統計。
- 一鍵匯入 `JHSEE-All-Subjects` 匯出檔。

### V2
- 經使用者明確啟用的跨程式資料 bridge。
- 自適應題量與疲勞度調整。
- 更多科目 topic taxonomy。

### V3
- 雲端同步。
- 家長/學生雙視圖。
- 多裝置學習紀錄。

## 23. 成功定義

成功不是「排出很多任務」，而是每天打開網站後，學生能立刻知道：

1. 今天最重要的是什麼。
2. 為什麼要做它。
3. 要花多少時間。
4. 做完後下一步是什麼。

同時，Study Planner 必須保持獨立，不因任何模擬考或遊戲專案更新而失效。