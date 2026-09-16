# JHSEE Study Planner V1.1 Daily Learning UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將既有 V1 Study Planner 改造成 Today-first 的每日學習體驗，加入三步 onboarding、任務理由、開始/完成/略過流程、簡化手機導覽與本週摘要，同時完整保留 V1 資料與演算法相容性。

**Architecture:** 保留現有 Vanilla JS SPA、hash router、`jhseePlanner.v1.*` LocalStorage 與 priority/mastery/review 核心。V1.1 新增小型純函式模組負責 onboarding 判定、任務狀態摘要與 explainability；UI 以 `#/today` 為主要入口，新增 `#/onboarding` 與 `#/more`，舊 routes 保留。所有行為先用 Vitest/jsdom 鎖定，再改 UI。

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript ES modules, LocalStorage, Vitest 3.x, jsdom, GitHub Actions, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-17-jhsee-study-planner-v1-1-daily-learning-ux-design.md`

## Global Constraints

- 保留 `jhseePlanner.v1.*` LocalStorage namespace；不得直接讀寫其他 JHSEE 專案 namespace。
- 不改 V1 priority 公式、+1/+3/+7/+14/+30 review schedule、topic 至少 5 題才判弱點等核心規則。
- 真正新使用者才強制 onboarding；已有任何 V1 有效資料的舊使用者不得被阻斷。
- onboarding 完成時若今天已有任務，不覆寫或重複產生。
- `#/`、`#/today`、所有 V1 routes 必須繼續可用；不得造成 hash redirect loop。
- V1.1 不加入倒數 timer；remaining minutes = pending + active 任務的 plannedMinutes。
- 同一時間最多一個 active task。
- 任務理由只能來自既有可驗證資料；sample < 5 不得宣稱細部 topic 弱點百分比。
- 平台狀態不得描述成正式會考 A/B/C 或高中錄取預測。
- 手機主要導覽固定為：今日、進度、錯題、更多。
- V1.1 不新增後端、帳號或跨裝置同步。

---

## File Map

### New files
- `js/core/onboarding.js` — 新/舊使用者判定、onboarding settings merge。
- `js/core/task-status.js` — remaining minutes、完成統計、單一 active task、skip 狀態純函式。
- `js/core/task-explainer.js` — 由 diagnostics/priority/mastery/review/scope 產生任務理由。
- `js/ui/onboarding-page.js` — 三步首次設定精靈。
- `js/ui/more-page.js` — 低頻入口集合。
- `tests/onboarding.test.js`
- `tests/task-status.test.js`
- `tests/task-explainer.test.js`
- `tests/v1-1-navigation.test.js`
- `tests/v1-1-acceptance.test.js`

### Modified files
- `js/app.js` — 新 routes、Today-first routing、context actions、navigation。
- `js/ui/today-page.js` — 今日 Hero、start/complete/skip、reason 展開。
- `js/ui/home.js` — 降低分析密度，轉為相容入口/Today-first 摘要。
- `js/ui/progress-page.js` — 保留詳細 priority 並加註讀書排序指標。
- `js/ui/settings-page.js` — 顯示/編輯 V1.1 onboarding 相關設定但不破壞舊值。
- `css/base.css` — mobile bottom-nav safe area 與頁面底部空間。
- `css/components.css` — onboarding、task action、reason disclosure、more menu 元件。
- `css/dashboard.css` — Today-first Hero、subject status、本週摘要。
- `README.md` — V1.1 操作流程與資料相容說明。

---

### Task 1: Onboarding eligibility and settings merge

**Files:**
- Create: `js/core/onboarding.js`
- Create: `tests/onboarding.test.js`

**Interfaces:**
- Consumes: V1 storage values `settings`, `diagnostics`, `dailyTasks`, `practiceLogs`, `miniChecks`.
- Produces: `isBrandNewUser(snapshot): boolean`, `needsV11Nudge(snapshot): boolean`, `completeOnboarding(settings, patch): object`.

- [ ] **Step 1: Write failing tests**

```js
import { describe, expect, it } from 'vitest';
import { isBrandNewUser, needsV11Nudge, completeOnboarding } from '../js/core/onboarding.js';

describe('V1.1 onboarding', () => {
  it('forces onboarding only for an empty planner', () => {
    expect(isBrandNewUser({ settings:{}, diagnostics:[], dailyTasks:[], practiceLogs:[], miniChecks:[] })).toBe(true);
  });

  it('does not block a V1 user with existing diagnostics', () => {
    expect(isBrandNewUser({ settings:{}, diagnostics:[{ id:'d1' }], dailyTasks:[], practiceLogs:[], miniChecks:[] })).toBe(false);
    expect(needsV11Nudge({ settings:{}, diagnostics:[{ id:'d1' }], dailyTasks:[], practiceLogs:[], miniChecks:[] })).toBe(true);
  });

  it('preserves existing settings while marking V1.1 complete', () => {
    expect(completeOnboarding({ dailyMinutes:60, currentScopes:{ math:'第三冊' } }, { nextExamLabel:'二模' })).toEqual({
      dailyMinutes:60,
      currentScopes:{ math:'第三冊' },
      nextExamLabel:'二模',
      onboardingCompleted:true,
      onboardingVersion:'1.1'
    });
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- tests/onboarding.test.js`
Expected: FAIL because `js/core/onboarding.js` does not exist.

- [ ] **Step 3: Implement the pure functions**

```js
const EMPTY_KEYS = ['diagnostics','dailyTasks','practiceLogs','miniChecks'];

export function isBrandNewUser(snapshot) {
  const settings = snapshot.settings ?? {};
  return settings.onboardingCompleted !== true
    && settings.dailyMinutes == null
    && EMPTY_KEYS.every(key => !Array.isArray(snapshot[key]) || snapshot[key].length === 0);
}

export function needsV11Nudge(snapshot) {
  return !isBrandNewUser(snapshot) && snapshot.settings?.onboardingCompleted !== true;
}

export function completeOnboarding(settings = {}, patch = {}) {
  return { ...settings, ...patch, onboardingCompleted:true, onboardingVersion:'1.1' };
}
```

- [ ] **Step 4: Run focused and full tests**

Run: `npm test -- tests/onboarding.test.js && npm test`
Expected: onboarding tests PASS and all existing V1 tests remain PASS.

- [ ] **Step 5: Commit**

```bash
git add js/core/onboarding.js tests/onboarding.test.js
git commit -m "feat: add V1.1 onboarding eligibility"
```

---

### Task 2: Daily task status helpers

**Files:**
- Create: `js/core/task-status.js`
- Create: `tests/task-status.test.js`

**Interfaces:**
- Produces: `summarizeDay(tasks): {total, completed, skipped, remainingMinutes, completionRate, nextTask}`, `startTask(tasks, id, now): array`, `skipTask(tasks, id, reason): array`.

- [ ] **Step 1: Write failing tests**

```js
import { describe, expect, it } from 'vitest';
import { summarizeDay, startTask, skipTask } from '../js/core/task-status.js';

const tasks = [
  { id:'a', status:'completed', plannedMinutes:20 },
  { id:'b', status:'active', plannedMinutes:25 },
  { id:'c', status:'pending', plannedMinutes:15 },
  { id:'d', status:'skipped', plannedMinutes:10 }
];

describe('daily task status', () => {
  it('counts only pending and active minutes as remaining', () => {
    expect(summarizeDay(tasks)).toMatchObject({ total:4, completed:1, skipped:1, remainingMinutes:40, completionRate:25 });
  });

  it('keeps only one active task', () => {
    const result = startTask(tasks, 'c', '2026-09-17T06:00:00Z');
    expect(result.find(t => t.id === 'b').status).toBe('pending');
    expect(result.find(t => t.id === 'c')).toMatchObject({ status:'active', startedAt:'2026-09-17T06:00:00Z' });
  });

  it('marks a task skipped and stores an optional reason', () => {
    expect(skipTask(tasks, 'c', '沒時間').find(t => t.id === 'c')).toMatchObject({ status:'skipped', skipReason:'沒時間' });
  });
});
```

- [ ] **Step 2: Run and verify RED**

Run: `npm test -- tests/task-status.test.js`
Expected: FAIL because module is missing.

- [ ] **Step 3: Implement minimal helpers**

```js
export function summarizeDay(tasks = []) {
  const completed = tasks.filter(t => t.status === 'completed').length;
  const skipped = tasks.filter(t => t.status === 'skipped').length;
  const remainingMinutes = tasks.filter(t => ['pending','active'].includes(t.status)).reduce((n,t) => n + (Number(t.plannedMinutes) || 0), 0);
  const nextTask = tasks.find(t => t.status === 'active') ?? tasks.find(t => t.status === 'pending') ?? null;
  return { total:tasks.length, completed, skipped, remainingMinutes, completionRate:tasks.length ? Math.round(completed/tasks.length*100) : 0, nextTask };
}

export function startTask(tasks, id, now) {
  return tasks.map(task => task.id === id
    ? { ...task, status:'active', startedAt:now }
    : task.status === 'active' ? { ...task, status:'pending' } : task);
}

export function skipTask(tasks, id, reason = '') {
  return tasks.map(task => task.id === id ? { ...task, status:'skipped', ...(reason ? { skipReason:reason } : {}) } : task);
}
```

- [ ] **Step 4: Verify GREEN and regression**

Run: `npm test -- tests/task-status.test.js && npm test`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add js/core/task-status.js tests/task-status.test.js
git commit -m "feat: add daily task state helpers"
```

---

### Task 3: Explainable task reasons

**Files:**
- Create: `js/core/task-explainer.js`
- Create: `tests/task-explainer.test.js`

**Interfaces:**
- Consumes: task, latest diagnostic grades, priorities, mastery summaries, due review counts, current scopes, recent touches.
- Produces: `explainTask(task, context): string[]` with maximum 4 reasons.

- [ ] **Step 1: Write failing tests**

```js
import { describe, expect, it } from 'vitest';
import { explainTask } from '../js/core/task-explainer.js';

it('explains a 4A1B English weakness task without claiming an official result', () => {
  const reasons = explainTask({ subject:'english', type:'weakness-drill' }, {
    latestGrades:{ chinese:'A', english:'B', math:'A', social:'A', science:'A' },
    priorities:{ english:0.72, math:0.30 },
    mastery:{ grammar:{ sampleSize:8, accuracy:68 } },
    dueCounts:{ english:3 }, currentScopes:{}, staleDays:{}
  });
  expect(reasons).toContain('最近一次模考英語為 B');
  expect(reasons).toContain('英語目前為最高優先科');
  expect(reasons.some(r => r.includes('正式會考'))).toBe(false);
  expect(reasons.length).toBeLessThanOrEqual(4);
});

it('does not call a topic weak before five samples', () => {
  const reasons = explainTask({ subject:'english', type:'weakness-drill' }, {
    latestGrades:{ english:'B' }, priorities:{ english:0.7 }, mastery:{ grammar:{ sampleSize:4, accuracy:25 } }, dueCounts:{}, currentScopes:{}, staleDays:{}
  });
  expect(reasons.some(r => r.includes('25%'))).toBe(false);
});
```

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/task-explainer.test.js`
Expected: missing module failure.

- [ ] **Step 3: Implement deterministic explanation rules**

Implementation must use a subject label map, sort priorities to identify top subject, add a grade reason when present, add topic accuracy only for `sampleSize >= 5`, add due-count/scope/staleness reasons when applicable, de-duplicate strings, and return `.slice(0,4)`.

- [ ] **Step 4: Verify tests**

Run: `npm test -- tests/task-explainer.test.js && npm test`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add js/core/task-explainer.js tests/task-explainer.test.js
git commit -m "feat: explain daily study tasks"
```

---

### Task 4: Three-step onboarding UI

**Files:**
- Create: `js/ui/onboarding-page.js`
- Modify: `js/app.js`
- Modify: `css/components.css`
- Test: `tests/onboarding.test.js`

**Interfaces:**
- UI calls `context.finishOnboarding({ diagnostic, settingsPatch })`.
- `finishOnboarding` validates diagnostic, appends it once, merges settings, creates today's plan only if none exists, then navigates to `#/today`.

- [ ] **Step 1: Add jsdom tests for the three steps and preservation rule**

Test must render step 1 with five subject grade controls, advance to a daily-minute choice, then to optional exam/scope fields; completion must not duplicate an existing same-day task list.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- tests/onboarding.test.js`
Expected: FAIL because page/context action is absent.

- [ ] **Step 3: Implement `renderOnboardingPage(context)`**

Use DOM APIs and `textContent`/`.value` for user-provided values. Do not insert imported/stored user values into HTML strings. Grade controls must include exactly `A++`, `A+`, `A`, `B++`, `B+`, `B`, `C`; daily minute quick choices must include 30/45/60/75/90 and a custom 20–180 input.

- [ ] **Step 4: Add `#/onboarding` route and `finishOnboarding` action in `app.js`**

Snapshot V1 keys, call `isBrandNewUser()` at initial route resolution, and only render onboarding automatically for a truly empty planner. Old V1 users continue to Today-first UI.

- [ ] **Step 5: Run focused/full tests**

Run: `npm test -- tests/onboarding.test.js && npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add js/ui/onboarding-page.js js/app.js css/components.css tests/onboarding.test.js
git commit -m "feat: add three-step Study Planner onboarding"
```

---

### Task 5: Today-first task execution UI

**Files:**
- Modify: `js/ui/today-page.js`
- Modify