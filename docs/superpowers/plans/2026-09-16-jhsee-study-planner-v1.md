# JHSEE Study Planner V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立一個可直接部署到 GitHub Pages 的獨立會考讀書規劃系統，將模考診斷、每日讀書任務、錯題間隔複習、每週 Mini Check 與趨勢分析串成完整學習閉環。

**Architecture:** 採純前端 HTML/CSS/ES Modules，核心規則拆成 diagnostics、mastery、priority、spaced-review、study-planner、analytics 與 storage 等獨立模組。所有持久化資料只能使用 `jhseePlanner.v1.*`，與 `JHSEE-All-Subjects`、`JHSEE-English-Adventure` 完全隔離；跨專案資料交換只允許明確 JSON 匯入/匯出。

**Tech Stack:** HTML5、CSS3、JavaScript ES Modules、JSON、Vitest、jsdom、GitHub Actions、GitHub Pages

**Spec:** `docs/superpowers/specs/2026-09-16-jhsee-study-planner-v1-design.md`

## Global Constraints

- 本專案不得共用其他 JHSEE 專案的 router、UI shell、題庫或 exam session。
- 所有 LocalStorage keys 必須以 `jhseePlanner.v1.` 開頭。
- 不得讀寫 `jhsee.v1.*` 或其他專案既有 key。
- V1 不做隱性跨專案同步，只提供明確 JSON 匯入/匯出。
- V1 不做完整模擬考引擎，不做高中落點預測，不把平台指標宣稱成正式會考等級。
- V1 不需要登入、後端、雲端資料庫或 AI API。
- 預設每日讀書時間 75 分鐘，可設定 20～180 分鐘。
- topic 樣本數少於 5 題時不得標記為正式弱點。
- 錯題複習採 Day 0、+1、+3、+7、+14、+30 維持節點。
- 手機優先，同時支援桌面瀏覽器。

---

## File Map

```text
index.html                              SPA shell
package.json                            測試指令與 dev dependencies
vitest.config.js                        jsdom 測試環境
css/base.css                            色彩、字體、mobile-first layout
css/components.css                      cards、buttons、badges、forms
css/dashboard.css                       今日任務、趨勢、錯題頁
js/app.js                               app bootstrap
js/router.js                            hash router
js/config/subjects.js                   五科與英文子領域常數
js/core/storage.js                      jhseePlanner.v1.* persistence
js/core/diagnostics.js                  模考輸入與 baseline weakness
js/core/mastery.js                      topic/subject 練習統計與弱點狀態
js/core/priority.js                     priority score 與最低維持規則
js/core/spaced-review.js                錯題 stage 與 nextReviewAt
js/core/study-planner.js                每日任務時間分配
js/core/analytics.js                    週趨勢與改善/惡化分析
js/core/import-export.js                明確 JSON interchange contract
js/ui/home.js                           首頁 Dashboard
js/ui/diagnostics-page.js               模考輸入
js/ui/today-page.js                     今日任務
js/ui/review-page.js                    到期錯題
js/ui/progress-page.js                  週趨勢
js/ui/settings-page.js                  時間、學校進度、下一次考試
js/ui/import-export-page.js              JSON 匯入/匯出
js/ui/english-path.js                   英文 Diagnose→Maintain 視圖
.github/workflows/pages.yml              test + GitHub Pages deploy
tests/router.test.js
tests/storage.test.js
tests/diagnostics.test.js
tests/mastery.test.js
tests/priority.test.js
tests/spaced-review.test.js
tests/study-planner.test.js
tests/analytics.test.js
tests/import-export.test.js
```

---

### Task 1: 建立獨立 SPA 骨架與測試環境

**Files:**
- Create: `package.json`
- Create: `vitest.config.js`
- Create: `index.html`
- Create: `js/app.js`
- Create: `js/router.js`
- Create: `js/config/subjects.js`
- Create: `css/base.css`
- Create: `css/components.css`
- Create: `css/dashboard.css`
- Create: `tests/router.test.js`

**Interfaces:**
- Produces: `createRouter(routes)`
- Produces: `startRouter(router, render)`
- Produces: `SUBJECTS`, `ENGLISH_TOPICS`

- [ ] **Step 1: 寫 router failing test**

```js
import { describe, expect, it } from 'vitest';
import { createRouter } from '../js/router.js';

describe('router', () => {
  it('resolves known route', () => {
    const r = createRouter({ '#/': () => 'home', '#/today': () => 'today' });
    expect(r.resolve('#/today')()).toBe('today');
  });

  it('falls back to home', () => {
    const r = createRouter({ '#/': () => 'home' });
    expect(r.resolve('#/missing')()).toBe('home');
  });
});
```

- [ ] **Step 2: 建立測試環境並確認失敗**

```json
{
  "name": "jhsee-study-planner",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "jsdom": "^26.0.0",
    "vitest": "^3.2.0"
  }
}
```

```js
// vitest.config.js
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'jsdom' } });
```

Run: `npm install && npm test`
Expected: FAIL，因 `js/router.js` 尚不存在。

- [ ] **Step 3: 實作最小 router**

```js
export function createRouter(routes) {
  return { resolve(hash) { return routes[hash] ?? routes['#/']; } };
}

export function startRouter(router, render) {
  const run = () => render(router.resolve(location.hash || '#/')());
  window.addEventListener('hashchange', run);
  run();
}
```

- [ ] **Step 4: 建立 SPA shell 與科目常數**

`index.html` 必須包含 `<main id="app"></main>` 與 `<script type="module" src="./js/app.js"></script>`。`subjects.js` 固定輸出：

```js
export const SUBJECTS = ['chinese', 'english', 'math', 'social', 'science'];
export const ENGLISH_TOPICS = ['vocabulary', 'grammar', 'cloze', 'reading', 'listening'];
```

- [ ] **Step 5: 建立 mobile-first 基礎樣式並跑測試**

Run: `npm test`
Expected: PASS。

- [ ] **Step 6: Commit**

```bash
git add package.json vitest.config.js index.html js/app.js js/router.js js/config/subjects.js css tests/router.test.js
git commit -m "feat: bootstrap independent study planner app"
```

---

### Task 2: 建立獨立 LocalStorage 層與 namespace 防護

**Files:**
- Create: `js/core/storage.js`
- Create: `tests/storage.test.js`

**Interfaces:**
- Produces: `createStorage(storage = window.localStorage)`
- Produces methods: `get(key, fallback)`, `set(key, value)`, `remove(key)`, `keys()`
- Namespace: `jhseePlanner.v1.` only

- [ ] **Step 1: 寫 failing tests**

```js
import { expect, it } from 'vitest';
import { createStorage } from '../js/core/storage.js';

it('writes only planner-prefixed keys', () => {
  const map = new Map();
  const fake = {
    getItem: k => map.get(k) ?? null,
    setItem: (k, v) => map.set(k, v),
    removeItem: k => map.delete(k)
  };
  const store = createStorage(fake);
  store.set('settings', { dailyMinutes: 75 });
  expect([...map.keys()]).toEqual(['jhseePlanner.v1.settings']);
});

it('rejects raw foreign keys', () => {
  const store = createStorage({ getItem(){}, setItem(){}, removeItem(){} });
  expect(() => store.set('jhsee.v1.settings', {})).toThrow('foreign storage key');
});
```

- [ ] **Step 2: Run failing test**

Run: `npx vitest run tests/storage.test.js`
Expected: FAIL。

- [ ] **Step 3: 實作 storage wrapper**

```js
const PREFIX = 'jhseePlanner.v1.';

export function createStorage(storage = window.localStorage) {
  const fullKey = key => {
    if (key.includes('.') && !key.startsWith(PREFIX)) throw new Error('foreign storage key');
    return key.startsWith(PREFIX) ? key : `${PREFIX}${key}`;
  };
  return {
    get(key, fallback = null) {
      try {
        const raw = storage.getItem(fullKey(key));
        return raw == null ? fallback : JSON.parse(raw);
      } catch { return fallback; }
    },
    set(key, value) {
      try { storage.setItem(fullKey(key), JSON.stringify(value)); return { ok: true }; }
      catch (error) { return { ok: false, error }; }
    },
    remove(key) { storage.removeItem(fullKey(key)); },
    keys() { return [
      'profile','diagnostics','settings','dailyTasks','practiceLogs',
      'reviewSchedule','miniChecks','mastery','ui'
    ].map(fullKey); }
  };
}
```

- [ ] **Step 4: 加入 corrupt JSON 與 quota exception 測試**

確認 corrupt JSON 回 fallback；`setItem` throw 時回 `{ ok:false, error }`，不讓 UI crash。

- [ ] **Step 5: Run tests**

Run: `npx vitest run tests/storage.test.js`
Expected: PASS。

- [ ] **Step 6: Commit**

```bash
git add js/core/storage.js tests/storage.test.js
git commit -m "feat: isolate planner local storage namespace"
```

---

### Task 3: 模考診斷輸入與 weakness baseline

**Files:**
- Create: `js/core/diagnostics.js`
- Create: `tests/diagnostics.test.js`

**Interfaces:**
- Produces: `GRADE_BASELINE`
- Produces: `validateDiagnostic(record)`
- Produces: `baselineFromDiagnostic(record): Record<string, number>`

- [ ] **Step 1: 寫 failing tests**

```js
import { expect, it } from 'vitest';
import { baselineFromDiagnostic, validateDiagnostic } from '../js/core/diagnostics.js';

const diagnostic = {
  id: 'mock-1', date: '2026-09-16', label: '第一次模擬考', scope: '第一次模考範圍',
  subjects: {
    chinese: { grade: 'A' }, english: { grade: 'B' }, math: { grade: 'A' },
    social: { grade: 'A' }, science: { grade: 'A' }
  }, writingLevel: null
};

it('maps grades to weakness baselines', () => {
  expect(baselineFromDiagnostic(diagnostic).english).toBe(0.70);
  expect(baselineFromDiagnostic(diagnostic).math).toBe(0.28);
});

it('rejects unknown grade', () => {
  const bad = structuredClone(diagnostic);
  bad.subjects.english.grade = 'D';
  expect(validateDiagnostic(bad).ok).toBe(false);
});
```

- [ ] **Step 2: Run failing test**

Run: `npx vitest run tests/diagnostics.test.js`
Expected: FAIL。

- [ ] **Step 3: 實作等級基線**

```js
export const GRADE_BASELINE = {
  'A++': 0.10, 'A+': 0.18, 'A': 0.28,
  'B++': 0.45, 'B+': 0.58, 'B': 0.70, 'C': 0.90
};
```

Validator 必須要求五科都有合法 grade；作文只接受 `null` 或 1～6 整數。

- [ ] **Step 4: 實作多次診斷選擇規則**

新增 `latestBaseline(records)`：按 date 取最新合法紀錄；若沒有紀錄回五科 `0.50` 中性值。

- [ ] **Step 5: Run tests**

Run: `npx vitest run tests/diagnostics.test.js`
Expected: PASS。

- [ ] **Step 6: Commit**

```bash
git add js/core/diagnostics.js tests/diagnostics.test.js
git commit -m "feat: add mock exam diagnostic baseline"
```

---

### Task 4: 練習紀錄、topic mastery 與弱點狀態

**Files:**
- Create: `js/core/mastery.js`
- Create: `tests/mastery.test.js`

**Interfaces:**
- Produces: `summarizeTopic(logs, subject, topic)`
- Produces: `classifyMastery({ sampleSize, accuracy })`
- Produces states: `insufficient`, `weak`, `needs-work`, `stable`, `maintain`

- [ ] **Step 1: 寫 failing tests**

```js
import { expect, it } from 'vitest';
import { classifyMastery } from '../js/core/mastery.js';

it('does not label weakness below five samples', () => {
  expect(classifyMastery({ sampleSize: 4, accuracy: 25 })).toBe('insufficient');
});

it('classifies five-sample weakness', () => {
  expect(classifyMastery({ sampleSize: 5, accuracy: 40 })).toBe('weak');
  expect(classifyMastery({ sampleSize: 10, accuracy: 70 })).toBe('needs-work');
  expect(classifyMastery({ sampleSize: 10, accuracy: 80 })).toBe('stable');
  expect(classifyMastery({ sampleSize: 10, accuracy: 90 })).toBe('maintain');
});
```

- [ ] **Step 2: Run failing test**

Run: `npx vitest run tests/mastery.test.js`
Expected: FAIL。

- [ ] **Step 3: 實作 mastery 規則**

```js
export function classifyMastery({ sampleSize, accuracy }) {
  if (sampleSize < 5) return 'insufficient';
  if (accuracy < 60) return 'weak';
  if (accuracy < 75) return 'needs-work';
  if (accuracy < 85) return 'stable';
  return 'maintain';
}
```

`summarizeTopic` 只計入含 `correct: boolean` 的有效紀錄，回 `{ sampleSize, correct, accuracy, state }`。

- [ ] **Step 4: 加入 30 天視窗測試**

新增 `summarizeSubjectRecent(logs, subject, now, days = 30)`，只統計視窗內紀錄。

- [ ] **Step 5: Run tests**

Run: `npx vitest run tests/mastery.test.js`
Expected: PASS。

- [ ] **Step 6: Commit**

```bash
git add js/core/mastery.js tests/mastery.test.js
git commit -m "feat: calculate topic mastery from practice logs"
```

---

### Task 5: 錯題間隔複習排程

**Files:**
- Create: `js/core/spaced-review.js`
- Create: `tests/spaced-review.test.js`

**Interfaces:**
- Produces: `createReviewItem(input, date)`
- Produces: `recordReviewResult(item, correct, date)`
- Produces: `getDueReviews(items, date)`
- Stage delays: `[1, 3, 7, 14, 30]`

- [ ] **Step 1: 寫 failing tests**

```js
import { expect, it } from 'vitest';
import { createReviewItem, recordReviewResult } from '../js/core/spaced-review.js';

it('schedules first redo for next day', () => {
  const item = createReviewItem({ itemId:'q1', subject:'english', topic:'grammar' }, '2026-09-16');
  expect(item.nextReviewAt).toBe('2026-09-17');
  expect(item.stage).toBe(0);
});

it('advances on correct and resets on wrong', () => {
  const item = createReviewItem({ itemId:'q1', subject:'english', topic:'grammar' }, '2026-09-16');
  const advanced = recordReviewResult(item, true, '2026-09-17');
  expect(advanced.nextReviewAt).toBe('2026-09-20');
  const reset = recordReviewResult(advanced, false, '2026-09-20');
  expect(reset.stage).toBe(0);
  expect(reset.lapseCount).toBe(1);
  expect(reset.nextReviewAt).toBe('2026-09-21');
});
```

- [ ] **Step 2: Run failing test**

Run: `npx vitest run tests/spaced-review.test.js`
Expected: FAIL。

- [ ] **Step 3: 實作 stage transition**

完成 +14 階段後設 `mastered = true`，下一次維持日期為 +30；答錯永遠回 stage 0 並 `lapseCount += 1`。

- [ ] **Step 4: 實作 due query**

`getDueReviews(items, date)` 回傳 `nextReviewAt <= date` 且未刪除的項目，依 `nextReviewAt`、`lapseCount` 排序。

- [ ] **Step 5: Run tests**

Run: `npx vitest run tests/spaced-review.test.js`
Expected: PASS。

- [ ] **Step 6: Commit**

```bash
git add js/core/spaced-review.js tests/spaced-review.test.js
git commit -m "feat: add spaced review schedule"
```

---

### Task 6: Priority engine 與最低維持規則

**Files:**
- Create: `js/core/priority.js`
- Create: `tests/priority.test.js`

**Interfaces:**
- Produces: `calculatePriority(input)`
- Produces: `rankSubjects(subjectInputs)`
- Produces: `applyMaintenanceBoost(priorities, lastTouchedBySubject, today)`

- [ ] **Step 1: 寫 failing test**

```js
import { expect, it } from 'vitest';
import { calculatePriority } from '../js/core/priority.js';

it('uses the documented weights', () => {
  const score = calculatePriority({ weakness:0.7, overdue:0.4, negativeTrend:0.2, upcomingExamWeight:0.6 });
  expect(score).toBeCloseTo(0.51, 5);
});
```

- [ ] **Step 2: Run failing test**

Run: `npx vitest run tests/priority.test.js`
Expected: FAIL。

- [ ] **Step 3: 實作 priority**

```js
export function calculatePriority({ weakness, overdue, negativeTrend, upcomingExamWeight }) {
  const clamp = n => Math.max(0, Math.min(1, n));
  return 0.40 * clamp(weakness)
       + 0.25 * clamp(overdue)
       + 0.20 * clamp(negativeTrend)
       + 0.15 * clamp(upcomingExamWeight);
}
```

- [ ] **Step 4: 實作 7/14 天維持提升**

7 天未接觸：priority 至少提高 `+0.10`；14 天未接觸：再提高至至少該科原 score `+0.20`，最後 clamp 到 1。

- [ ] **Step 5: Run tests**

Run: `npx vitest run tests/priority.test.js`
Expected: PASS。

- [ ] **Step 6: Commit**

```bash
git add js/core/priority.js tests/priority.test.js
git commit -m "feat: calculate adaptive subject priorities"
```

---

### Task 7: 每日 Study Planner 時間分配器

**Files:**
- Create: `js/core/study-planner.js`
- Create: `tests/study-planner.test.js`

**Interfaces:**
- Produces: `planDay(input)`
- Input: `{ date, dailyMinutes, priorities, dueReviews, currentScopes, recentTouches }`
- Output: `{ totalMinutes, tasks[] }`

- [ ] **Step 1: 寫 75 分鐘 failing test**

```js
import { expect, it } from 'vitest';
import { planDay } from '../js/core/study-planner.js';

it('keeps a 75-minute plan within budget and prioritizes weakest subject', () => {
  const result = planDay({
    date:'2026-09-17', dailyMinutes:75,
    priorities:{ chinese:0.3, english:0.8, math:0.35, social:0.3, science:0.32 },
    dueReviews:[{ itemId:'e1', subject:'english', topic:'grammar' }],
    currentScopes:{ math:'二次方根' }, recentTouches:{}
  });
  expect(result.totalMinutes).toBeLessThanOrEqual(75);
  expect(result.tasks.some(t => t.subject === 'english' && t.type === 'weakness-drill')).toBe(true);
  expect(result.tasks.some(t => t.type === 'review-due')).toBe(true);
});
```

- [ ] **Step 2: 寫 20 分鐘短模式 failing test**

```js
it('uses only due review plus top priority in short mode', () => {
  const result = planDay({
    date:'2026-09-17', dailyMinutes:20,
    priorities:{ chinese:0.3, english:0.8, math:0.35, social:0.3, science:0.32 },
    dueReviews:[{ itemId:'e1', subject:'english', topic:'grammar' }],
    currentScopes:{}, recentTouches:{}
  });
  expect(result.totalMinutes).toBeLessThanOrEqual(20);
  expect(result.tasks.every(t => ['review-due','weakness-drill'].includes(t.type))).toBe(true);
});
```

- [ ] **Step 3: Run failing tests**

Run: `npx vitest run tests/study-planner.test.js`
Expected: FAIL。

- [ ] **Step 4: 實作一般日模板**

75 分鐘預設配置：最多 15 分鐘 due reviews、25～30 分鐘最高 priority、15 分鐘維持科、剩餘 15～20 分鐘 current-school。所有分鐘數最後必須重新壓到 `dailyMinutes` 內。

- [ ] **Step 5: 實作長期最低維持分配**

最近 7 天未接觸科目必須產生 `maintenance`；若時間不足，下一日重新排程，不建立永久 backlog。

- [ ] **Step 6: Run tests**

Run: `npx vitest run tests/study-planner.test.js tests/priority.test.js`
Expected: PASS。

- [ ] **Step 7: Commit**

```bash
git add js/core/study-planner.js tests/study-planner.test.js
git commit -m "feat: generate daily study plans"
```

---

### Task 8: 每週 Mini Check 與趨勢分析

**Files:**
- Create: `js/core/analytics.js`
- Create: `tests/analytics.test.js`

**Interfaces:**
- Produces: `subjectTrend(miniChecks, subject)`
- Produces: `topWeakTopics(masteries, limit = 3)`
- Produces: `fastestImprovingTopics(topicSeries, limit = 3)`

- [ ] **Step 1: 寫 failing tests**

```js
import { expect, it } from 'vitest';
import { subjectTrend } from '../js/core/analytics.js';

it('returns insufficient with one data point', () => {
  expect(subjectTrend([{ week:'2026-W38', subjects:{ english:{ accuracy:68 } } }], 'english').status)
    .toBe('insufficient');
});

it('returns delta with two data points', () => {
  const trend = subjectTrend([
    { week:'2026-W38', subjects:{ english:{ accuracy:68 } } },
    { week:'2026-W39', subjects:{ english:{ accuracy:74 } } }
  ], 'english');
  expect(trend.delta).toBe(6);
  expect(trend.direction).toBe('up');
});
```

- [ ] **Step 2: Run failing test**

Run: `npx vitest run tests/analytics.test.js`
Expected: FAIL。

- [ ] **Step 3: 實作 trend rules**

少於 2 點回 `{ status:'insufficient' }`；2 點以上回 `{ status:'ready', delta, direction }`，direction 為 `up/down/flat`。

- [ ] **Step 4: 實作 topic 排序**

`topWeakTopics` 必須忽略 `insufficient`；改善最快依至少 2 個時間點的 accuracy 差值排序。

- [ ] **Step 5: Run tests**

Run: `npx vitest run tests/analytics.test.js`
Expected: PASS。

- [ ] **Step 6: Commit**

```bash
git add js/core/analytics.js tests/analytics.test.js
git commit -m "feat: add weekly learning trend analytics"
```

---

### Task 9: 明確 JSON 匯入/匯出契約

**Files:**
- Create: `js/core/import-export.js`
- Create: `tests/import-export.test.js`

**Interfaces:**
- Produces: `EXPORT_SCHEMA = 'jhsee-study-planner/v1'`
- Produces: `exportPlannerData(data)`
- Produces: `parsePlannerImport(text)`
- Produces: `parseExternalPracticeImport(text)`

- [ ] **Step 1: 寫 failing tests**

```js
import { expect, it } from 'vitest';
import { exportPlannerData, parsePlannerImport } from '../js/core/import-export.js';

it('round-trips planner export', () => {
  const json = exportPlannerData({ diagnostics:[], miniChecks:[] });
  const parsed = parsePlannerImport(json);
  expect(parsed.schema).toBe('jhsee-study-planner/v1');
});

it('rejects unknown schema', () => {
  expect(() => parsePlannerImport('{"schema":"jhsee-all-subjects/v1"}')).toThrow('unsupported schema');
});
```

- [ ] **Step 2: Run failing test**

Run: `npx vitest run tests/import-export.test.js`
Expected: FAIL。

- [ ] **Step 3: 實作 planner export contract**

輸出只包含 planner 自己的資料欄位，不包含其他專案 LocalStorage dump。

- [ ] **Step 4: 實作 external practice import**

只接受明確格式：

```json
{
  "schema": "jhsee-practice-summary/v1",
  "records": [
    { "date":"2026-09-17", "subject":"english", "topic":"grammar", "correct":7, "total":10 }
  ]
}
```

轉成 practice logs；未知欄位忽略，非法 correct/total 拒絕。

- [ ] **Step 5: Run tests**

Run: `npx vitest run tests/import-export.test.js`
Expected: PASS。

- [ ] **Step 6: Commit**

```bash
git add js/core/import-export.js tests/import-export.test.js
git commit -m "feat: add explicit planner data interchange"
```

---

### Task 10: 英文弱科進階路線

**Files:**
- Create: `js/ui/english-path.js`
- Add tests in: `tests/mastery.test.js`

**Interfaces:**
- Produces: `getEnglishStage(topicSummaries, timedSummary, weeklyEnglish)`
- Stages: `Diagnose`, `Stabilize`, `Mixed`, `Timed`, `Maintain`

- [ ] **Step 1: 寫 failing stage tests**

```js
it('keeps English in Diagnose until every topic has baseline samples', () => {
  expect(getEnglishStage({ grammar:{sampleSize:5}, reading:{sampleSize:2} }, null, [])).toBe('Diagnose');
});
```

再加入：弱項近 20 題 ≥75% → `Mixed`；mixed 近 30 題 ≥80% → `Timed`；timed 近 30 題 ≥80% 且連續三週達目標 → `Maintain`。

- [ ] **Step 2: Run failing tests**

Run: `npx vitest run tests/mastery.test.js`
Expected: FAIL。

- [ ] **Step 3: 實作純函式 stage evaluator**

將 evaluator 放在 `js/core/mastery.js`，UI 只負責顯示五階段與目前位置。

- [ ] **Step 4: Run tests**

Run: `npx vitest run tests/mastery.test.js`
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add js/core/mastery.js js/ui/english-path.js tests/mastery.test.js
git commit -m "feat: add English improvement pathway"
```

---

### Task 11: 建立六個主要 UI 頁面

**Files:**
- Create: `js/ui/home.js`
- Create: `js/ui/diagnostics-page.js`
- Create: `js/ui/today-page.js`
- Create: `js/ui/review-page.js`
- Create: `js/ui/progress-page.js`
- Create: `js/ui/settings-page.js`
- Create: `js/ui/import-export-page.js`
- Modify: `js/app.js`
- Modify: `css/components.css`
- Modify: `css/dashboard.css`

**Interfaces:**
- Each page exports `renderXxxPage(context): HTMLElement`
- `context` receives storage/core functions; pages do not directly access foreign LocalStorage keys.

- [ ] **Step 1: 將 app routes 固定為**

```text
#/                  Dashboard
#/diagnostics       模考診斷
#/today             今日任務
#/review            到期錯題
#/progress          趨勢
#/settings          設定
#/data              匯入/匯出
```

- [ ] **Step 2: 實作 Dashboard 首頁**

首頁顯示：今日預計分鐘、完成率、到期錯題數、最高 priority 1～3 科、近四週五科趨勢、最弱 3 topics、改善最快 3 topics、最近七天完成分鐘與下一次考試倒數。資料不足時顯示「資料不足」，不得顯示虛構趨勢。

- [ ] **Step 3: 實作 diagnostics form**

五科 select 支援 `A++/A+/A/B++/B+/B/C`，作文 optional 1～6；儲存前呼叫 `validateDiagnostic`。

- [ ] **Step 4: 實作 today/review/progress/settings/data 頁**

`today` 可完成/略過任務；`review` 顯示 due items 並記錄 correct/wrong；`progress` 顯示 mini checks 與 topic 狀態；`settings` 限制 dailyMinutes 20～180；`data` 提供 textarea/file 匯入與 JSON 下載文字產生。

- [ ] **Step 5: 手機版人工驗證**

使用 360px、390px、768px、1280px 寬度檢查：無橫向捲動、主要按鈕最小 44px 高、form label 可讀、卡片不截字。

- [ ] **Step 6: Run all tests**

Run: `npm test`
Expected: PASS。

- [ ] **Step 7: Commit**

```bash
git add js/ui js/app.js css
 git commit -m "feat: add planner dashboard and workflow pages"
```

---

### Task 12: 任務完成紀錄、Mini Check 輸入與重新排程整合

**Files:**
- Modify: `js/ui/today-page.js`
- Modify: `js/ui/progress-page.js`
- Modify: `js/core/study-planner.js`
- Modify: `js/core/storage.js`
- Test: `tests/study-planner.test.js`

**Interfaces:**
- Produces: `completeTask(task, actualMinutes, completedAt)`
- Produces: `rescheduleUnfinished(tasks, nextDate)`

- [ ] **Step 1: 寫 failing reschedule test**

未完成的 `review-due` 與高 priority `weakness-drill` 可重新產生；普通 maintenance/current-school 不建立無限 backlog。

- [ ] **Step 2: Run failing test**

Run: `npx vitest run tests/study-planner.test.js`
Expected: FAIL。

- [ ] **Step 3: 實作 task completion record**

完成紀錄至少保存 `plannedMinutes`, `actualMinutes`, `completedAt`, `status`；實際分鐘納入最近七天統計。

- [ ] **Step 4: 實作 Mini Check 手動輸入**

五科 accuracy 只能 0～100；每週紀錄格式符合 spec。輸入後立即重算 trend，但不自動宣稱 A/B。

- [ ] **Step 5: Run all related tests**

Run: `npx vitest run tests/study-planner.test.js tests/analytics.test.js tests/storage.test.js`
Expected: PASS。

- [ ] **Step 6: Commit**

```bash
git add js tests/study-planner.test.js
git commit -m "feat: track completed study tasks and weekly checks"
```

---

### Task 13: GitHub Pages CI/CD 與獨立部署驗證

**Files:**
- Create: `.github/workflows/pages.yml`
- Modify: `README.md`

**Interfaces:**
- GitHub Actions runs tests before deploy.
- Deployment artifact contains static app only, excludes `node_modules` and test-only files when possible.

- [ ] **Step 1: 建立 workflow**

Workflow：checkout → setup-node 20 → `npm ci` → `npm test` → upload Pages artifact → deploy Pages。Artifact root 為 repository root，但用 shell 建立 `.pages` 目錄只複製 `index.html`, `css`, `js` 及必要靜態 assets。

- [ ] **Step 2: README 加入專案邊界與資料隔離說明**

README 必須列出：本專案只做 Study Planner；LocalStorage namespace 為 `jhseePlanner.v1.*`；與其他 JHSEE 專案只透過 JSON interchange。

- [ ] **Step 3: 本機驗證**

Run:

```bash
npm ci
npm test
python3 -m http.server 8000
```

手動開啟 `http://localhost:8000/`，驗證所有 hash routes 可運作。

- [ ] **Step 4: GitHub Pages 子路徑驗證**

確認所有 CSS/JS 使用 `./` 相對路徑，不硬編碼 `/css/...` 或 `/js/...`，避免 `/JHSEE-Study-Planner/` 部署 404。

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/pages.yml README.md
git commit -m "ci: test and deploy study planner to pages"
```

---

### Task 14: V1 回歸測試與驗收

**Files:**
- Modify tests as defects are found; no new feature scope.

**Interfaces:**
- No new public interfaces.

- [ ] **Step 1: 完整自動測試**

Run: `npm test`
Expected: 全部 PASS，0 failed。

- [ ] **Step 2: 隔離檢查**

Repository search 必須確認正式程式碼不存在：

```text
localStorage.getItem('jhsee.v1.
localStorage.setItem('jhsee.v1.
JHSEE-English-Adventure localStorage key
iframe src 指向其他兩個專案
```

- [ ] **Step 3: 核心情境人工驗收**

依序測：
1. 新使用者無資料 → 平均基線啟動。
2. 輸入 4A1B 類型診斷 → B 科 priority 高於 A 科。
3. dailyMinutes=75 → 任務總分鐘 ≤75。
4. dailyMinutes=20 → 只保留 due review + top priority。
5. 建立錯題 → +1 日到期。
6. 答對推進 +3/+7/+14；答錯回 +1。
7. topic 只有 4 題 → 資料不足；第 5 題後才可弱點分類。
8. Mini Check 只有一週 → 無趨勢箭頭；第二週後才出 delta。
9. 匯出 → 清空本專案資料 → 匯入 → planner 資料恢復。
10. 其他專案 LocalStorage key 不被修改。

- [ ] **Step 4: 手機與桌面驗收**

Safari/Chrome 各至少一種桌面與手機 viewport；確認表單、卡片、導航、今日任務操作與錯題按鈕可用。

- [ ] **Step 5: 最終 commit**

```bash
git add .
git commit -m "test: complete V1 study planner acceptance"
```

---

## Definition of Done

V1 完成時必須同時滿足：

1. 可輸入五科模考等級與作文 optional 級分。
2. 能依最新診斷與練習資料算出五科 priority。
3. 每日計畫不超過設定時間，且弱科優先、強科有最低維持。
4. 20～30 分鐘短模式可合理降級。
5. topic 未滿 5 題不會被誤標成弱點。
6. 錯題可依 +1/+3/+7/+14/+30 排程並依答題結果前進或回退。
7. 能輸入 Mini Check 並在至少 2 點後顯示趨勢。
8. Dashboard 能呈現今日任務、到期錯題、priority、topic 與週趨勢。
9. LocalStorage 僅使用 `jhseePlanner.v1.*`。
10. JSON 匯入/匯出有明確 schema，未知 schema 會拒絕。
11. `npm test` 全部通過。
12. GitHub Pages 在專案子路徑可正常開啟，手機與桌面無阻斷性錯誤。
