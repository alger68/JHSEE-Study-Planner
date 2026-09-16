# JHSEE Study Planner V1.1 Daily Learning UX Design

日期：2026-09-17  
專案：`JHSEE-Study-Planner`  
版本：V1.1「每日學習版」  
部署：GitHub Pages

## 1. 版本目標

V1.1 不重做 V1 的演算法，而是重做使用體驗。核心目標是讓學生：

1. 第一次進站時，不需要理解整個系統就能完成設定。
2. 每天打開網站後，5 秒內知道「今天要做什麼、還要多久、為什麼這樣排」。
3. 首頁優先顯示可執行任務，不先展示大量分析數字。
4. 手機使用時，只保留高頻入口，其餘功能收進「更多」。
5. 所有任務都能解釋排程原因，避免 Study Planner 成為黑箱。

V1.1 保留 V1 核心規則與資料隔離：

- `jhseePlanner.v1.*` LocalStorage namespace 不變。
- 不直接讀取 `JHSEE-All-Subjects` 或 `JHSEE-English-Adventure` 的 LocalStorage。
- 錯題複習仍採 +1 / +3 / +7 / +14 / +30。
- topic 樣本少於 5 題仍顯示「資料不足」。
- priority 仍由 weakness、overdue、negativeTrend、upcomingExamWeight 組成。
- 不宣稱任何平台狀態等同正式會考 A/B/C 或高中錄取結果。

---

## 2. 核心使用流程

### 2.1 新使用者判定

只有在以下條件全部成立時，視為真正的新使用者並強制進 onboarding：

- `settings.onboardingCompleted !== true`
- `diagnostics` 為空
- `dailyTasks` 為空
- `practiceLogs` 為空
- `miniChecks` 為空
- `settings.dailyMinutes` 不存在

流程：

```text
Step 1 最近一次模考
  ↓
Step 2 每日可用時間
  ↓
Step 3 下一次考試與目前進度
  ↓
建立第一份今日計畫
  ↓
進入 Today-first 首頁
```

### 2.2 舊使用者

只要已存在任何 V1 有效資料，即視為舊使用者，不得強制阻斷既有流程。

舊使用者若沒有 `onboardingCompleted`：

- 不刪除、不重置任何既有 LocalStorage。
- 首頁顯示一次非阻斷式導引卡：`完成 V1.1 快速設定`。
- 使用者可以稍後處理。
- 完成快速設定後寫入 `settings.onboardingCompleted = true` 與 `settings.onboardingVersion = "1.1"`。

### 2.3 每日使用

每天主要路徑固定為：

```text
首頁 / 今日
  → 看今天任務與剩餘分鐘
  → 點「開始」
  → 完成或略過
  → 輸入實際分鐘
  → 首頁即時更新
```

---

## 3. 首次設定精靈

### 3.1 Step 1：最近一次模考

顯示五科大按鈕式等級選擇：

- 國文
- 英語
- 數學
- 社會
- 自然

每科可選：

`A++ / A+ / A / B++ / B+ / B / C`

作文：optional 1～6。

欄位：

```json
{
  "label": "第一次模擬考",
  "date": "2026-09-16",
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

儲存前沿用 V1 `validateDiagnostic()`。

如果完成後某科 priority 明顯高於其他科，下一步可用自然語言提示，例如：

> 目前英文會獲得較多讀書時間。

不得顯示：

> 英文一定是正式會考 B。

### 3.2 Step 2：每天可以讀多久

提供快速選擇：

- 30 分
- 45 分
- 60 分
- 75 分（預設推薦）
- 90 分
- 自訂 20～180 分

寫入：

```json
{
  "dailyMinutes": 75
}
```

### 3.3 Step 3：下一次考試與目前學校進度

輸入：

- 下一次考試名稱 optional
- 下一次考試日期 optional
- 五科目前進度 optional

未填可直接略過，不阻止完成 onboarding。

完成時：

1. `settings.onboardingCompleted = true`
2. `settings.onboardingVersion = "1.1"`
3. 儲存 settings
4. 若今天尚無任何 `dailyTasks`，呼叫現有 `generateTodayPlan()` 並寫入今日任務
5. 若今天已有任務，不覆寫、不重建，避免 onboarding 造成重複任務
6. 導向 `#/today`

---

## 4. Today-first 首頁

V1.1 首頁的第一優先不是分析，而是執行。

### 4.1 Hero

首屏只回答三件事：

- 今天總共要讀多久？
- 完成多少？
- 下一個要做什麼？

示意：

```text
今天 75 分鐘
2 / 4 任務完成
還剩 35 分鐘

下一個：英文弱點加強 20 分
[ 繼續今天的學習 ]
```

若尚未產生今日任務：

```text
今天還沒有計畫
[ 產生今天的學習計畫 ]
```

### 4.2 剩餘分鐘定義

V1.1 不做即時計時，因此「剩餘分鐘」採預估值，而不是用實際經過時間扣除。

定義：

```text
remainingMinutes =
  所有 status = pending 或 active 的任務 plannedMinutes 總和
```

- `completed` 任務不再計入剩餘分鐘，不論 actualMinutes 大於或小於 plannedMinutes。
- `skipped` 任務不計入當天剩餘分鐘。
- actualMinutes 只用於歷史統計與近 7 天 / 本週完成分鐘。

### 4.3 今日三大區塊

首頁主體最多先顯示：

1. 今日任務
2. 目前學習狀態
3. 本週摘要

詳細 analytics 放到「進度」。

### 4.4 今日任務卡

每張任務卡至少顯示：

- 科目
- 任務類型
- 預計分鐘
- 狀態
- 一句主要原因

例如：

```text
英語｜弱點加強｜25 分
原因：目前為最高優先科
[開始]
```

若有更多原因，可按「為什麼安排這個？」展開。

---

## 5. 任務理由 Explainability

### 5.1 目的

讓使用者看得懂排程邏輯，不需要理解 0～1 priority score。

### 5.2 理由來源

任務理由只能由既有可驗證資料產生：

- 最近一次模考 grade
- 當前 subject priority 排名
- topic mastery / accuracy
- 到期錯題數
- 7 / 14 天未接觸
- 下一次考試 currentScopes
- 今日剩餘時間

### 5.3 Canonical 行為

理由以純函式即時計算為主，不把 `reason[]` 當成權威資料來源：

```text
explainTask(task, context) -> string[]
```

Task 可以保留 optional `reason[]` 作為產生當下的 snapshot，但 UI 顯示時優先呼叫 `explainTask()`。這樣當錯題到期數、mastery 或 priority 改變時，理由不會過期。

### 5.4 `reason[]` optional 欄位

```json
{
  "reason": [
    "最近一次模考英語為 B",
    "英語目前為最高優先科",
    "grammar 最近正確率 68%",
    "今天有 3 題錯題到期"
  ]
}
```

`reason` 為衍生資訊，不作為 priority 計算輸入；即使沒有 `reason`，舊任務仍可正常顯示。

### 5.5 顯示規則

- 任務卡預設只顯示第一個 reason。
- 展開後最多顯示 4 個 reason。
- 沒有細部 topic 資料時，不虛構細部弱點。
- sample < 5 時只能寫「此主題資料不足」，不能寫成弱點百分比結論。

---

## 6. 今日學習頁

### 6.1 大進度

頁首：

```text
今天完成 2 / 4
剩餘 35 分鐘
```

可使用圓形或條狀進度視覺，但數字必須同時顯示，不能只靠顏色。

### 6.2 任務狀態

每個任務：

```text
pending → active → completed
              ↘ skipped
```

主要操作：

- 開始
- 完成
- 略過

### 6.3 開始

按開始後：

- 將 status 改為 `active`
- 記錄 `startedAt`
- 頁面將此任務置頂或高亮
- 同一時間最多只能有一個 `active` 任務；開始另一項時，原 active 任務回到 pending
- 不做倒數計時器（V1.1 不做 timer）

### 6.4 完成

完成時要求輸入：

- actualMinutes，預設 plannedMinutes，可修改

沿用 V1 `completeTask()`；完成後：

- 即時更新剩餘分鐘
- 即時更新首頁完成率
- actualMinutes 納入歷史統計
- 不自動建立成績正確率，除非該任務本身有練習結果資料

### 6.5 略過

按略過：

- `status = skipped`
- 可選原因 optional：沒時間 / 已在學校完成 / 今天不適合 / 其他
- maintenance / current-school 不形成永久 backlog
- review-due / 高 priority weakness-drill 仍依 V1 規則可重新排程

---

## 7. 首頁第二層：目前學習狀態

不以 priority 百分比作為第一層語言。

每科顯示狀態：

- `優先加強`
- `需要注意`
- `穩定維持`
- `資料不足`

建議映射：

```text
priority >= 0.60 → 優先加強
0.40–0.59        → 需要注意
< 0.40           → 穩定維持
```

若沒有任何有效診斷與練習資料，顯示 `資料不足`。

詳細 priority score 保留在進度頁，可用百分比顯示，並加註「讀書排序指標，不是會考成績」。

---

## 8. 首頁第三層：本週摘要

顯示四個以內的高價值資訊：

- 本週實際完成分鐘
- 本週完成任務數 / 完成率
- 五科中最大正向變化
- mastered 錯題數
- 下一次考試倒數（若有）

例如：

```text
本週完成 285 分鐘
英語 +6%
已掌握錯題 12 題
下一次模考剩 86 天
```

若沒有至少 2 個可比較資料點，不顯示 `+6%` 類趨勢，只顯示資料不足。

---

## 9. 手機導覽與路由

### 9.1 高頻四入口

手機底部 navigation：

```text
今日 | 進度 | 錯題 | 更多
```

對應：

- 今日 → `#/today`
- 進度 → `#/progress`
- 錯題 → `#/review`
- 更多 → `#/more`

### 9.2 更多頁

收納：

- 模考診斷
- 設定
- 資料匯入/匯出
- 關於 Study Planner

Desktop 可保留較完整 top navigation，但仍優先突出「今日」。

### 9.3 路由相容

V1 舊 routes 必須保留可直接開啟：

- `#/`
- `#/diagnostics`
- `#/today`
- `#/review`
- `#/progress`
- `#/settings`
- `#/data`

V1.1 新增：

- `#/onboarding`
- `#/more`

V1.1 將路由行為定死如下：

- `#/today`：主要 Today-first 頁面。
- `#/`：若為真正新使用者，render onboarding；否則 render 與 `#/today` 相同的 Today-first 頁面。
- `#/onboarding`：永遠可手動進入 onboarding / 快速設定。
- 不使用 `#/` → `#/today` 的自動 hash redirect，因此不存在 redirect loop。

---

## 10. 資料模型變更

### 10.1 Settings 新增欄位

```json
{
  "dailyMinutes": 75,
  "onboardingCompleted": true,
  "onboardingVersion": "1.1",
  "nextExamDate": "2026-12-15",
  "nextExamLabel": "第二次模擬考",
  "currentScopes": {}
}
```

### 10.2 Task 新增 optional 欄位

```json
{
  "status": "pending",
  "startedAt": null,
  "skipReason": null,
  "reason": []
}
```

所有新欄位 optional，避免破壞 V1 既有任務。

### 10.3 Migration 原則

不做一次性 destructive migration。

讀取舊資料時：

- 缺 `onboardingCompleted`，依 2.1 / 2.2 的新舊使用者規則判斷。
- 缺 `reason`，UI 即時呼叫 `explainTask()`。
- 缺 `startedAt` / `skipReason`，視為 null。
- 任何既有 diagnostics、tasks、practiceLogs、reviewSchedule、miniChecks 不得因升級被清空。

---

## 11. Explain Function 邊界

新增純函式：

```text
explainTask(task, context) -> string[]
```

輸入只讀：

- diagnostics
- priorities
- practiceLogs/mastery
- dueReviews
- settings/currentScopes
- recentTouches

輸出：0～4 條繁中理由。

限制：

- 不改變 task priority。
- 不呼叫 AI API。
- 不產生不存在的 topic。
- 不把 platform priority 翻譯成官方 A/B/C。
- 同一輸入必須得到穩定輸出，方便測試。

---

## 12. UI / Accessibility

### Mobile-first

支援至少：

- 360 px
- 390 px
- 768 px
- 1280 px

要求：

- 不橫向捲動。
- 主要按鈕高度至少 44 px。
- bottom nav 不遮住內容。
- active / completed / skipped 不能只用顏色區分。
- 表單都有可見 label。
- 等級選擇按鈕需要 keyboard focus 狀態。
- 進度資訊同時有文字數值。
- bottom nav 必須標示目前所在頁。

---

## 13. V1.1 不做

為避免 scope 膨脹，V1.1 不加入：

- AI 自動聊天教練
- Pomodoro / countdown timer
- 完整題庫
- 完整模擬考
- 雲端同步 / 帳號登入
- Push notification
- Calendar sync
- 自動讀取其他 JHSEE 專案 LocalStorage
- 正式會考等級預測
- 高中落點推薦
- 成就徽章 / 遊戲化 EXP

---

## 14. 測試要求

至少新增以下情境：

1. 全新使用者進 `#/` → 顯示 onboarding。
2. 已有任何 V1 有效資料、但沒有 onboarding flag → 不阻斷，顯示快速設定提示。
3. onboarding Step 1 未填完整五科 → 不可下一步。
4. dailyMinutes quick choice 75 → settings=75。
5. Step 3 可完全略過。
6. onboarding 完成 → `onboardingCompleted=true`、`onboardingVersion=1.1`。
7. onboarding 完成且今天無 tasks → 產生今日計畫。
8. onboarding 完成且今天已有 tasks → 不重複產生、不覆寫。
9. 舊使用者資料不被清空。
10. V1 舊 task 沒有 `reason` 仍可 render。
11. `explainTask` 不會把 sample<5 topic 說成正式弱點。
12. 4A1B 診斷時，英文任務理由可包含「目前為最高優先科」。
13. due review 任務理由可包含到期題數。
14. 7 天未碰科目可產生維持原因。
15. pending → active → completed 正確記錄 startedAt / actualMinutes。
16. 同一時間最多一個 active task。
17. skipped 任務不計入 completed，也不計入 remainingMinutes。
18. 20 分鐘短模式仍只保留核心任務。
19. remainingMinutes = pending + active 的 plannedMinutes 總和。
20. actualMinutes 不影響當天 remainingMinutes，只影響歷史統計。
21. 本週趨勢少於 2 點 → 資料不足。
22. `#/more` 可進 diagnostics/settings/data。
23. `#/` 與 `#/today` 在非新使用者時 render 同一 Today-first 體驗，且無 redirect loop。
24. LocalStorage 仍只使用 `jhseePlanner.v1.*`。

---

## 15. 驗收標準

V1.1 完成需同時滿足：

1. 新使用者可在 3 步內完成首次設定。
2. 設定完成後可直接得到第一份今日計畫；已有今日計畫時不重複建立。
3. 每天首頁首屏能看見：總分鐘、完成進度、剩餘分鐘、下一任務。
4. 每個主要任務能顯示至少一個可驗證理由；資料不足時不得虛構。
5. 手機導覽縮成 今日 / 進度 / 錯題 / 更多。
6. 模考、設定、資料匯入/匯出仍可從更多頁進入。
7. V1 既有資料可以無破壞升級。
8. V1 核心 priority / spaced review / mastery 行為不變。
9. 360px 手機無橫向捲動，主要操作按鈕可單手點擊。
10. 所有自動測試通過，且 GitHub Pages 部署成功。

---

## 16. 成功定義

V1.1 的成功不是「功能更多」，而是學生每天願意打開。

成功體驗應該是：

> 打開網站 → 看到今天還剩多少 → 知道下一個任務 → 知道為什麼做 → 完成 → 關掉。

進度分析與設定存在，但不阻擋這條主路徑。
