# Study Planner Unified UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Study Planner the canonical JHSEE Professional Academic SaaS shell while preserving V1.1 planning behavior and making Lazy Mode visually dominant.

**Architecture:** Add a dedicated token file and shared component classes without rewriting planning algorithms. Keep route/render functions intact, migrate navigation/header/cards to the canonical shell, and simplify onboarding to a fast-entry experience while leaving advanced fields in Settings.

**Tech Stack:** Static ES modules, HTML, CSS, Vitest + jsdom, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-17-jhsee-unified-design-system-v1-design.md`

## Global Constraints

- Storage keys remain `jhseePlanner.v1.*`.
- No hidden reads from English Adventure or All Subjects.
- Product accent: `#4F46E5`; strong `#4338CA`; soft `#EEF2FF`.
- Exactly four mobile nav entries: 今日 / 進度 / 錯題 / 更多.
- 44 px minimum controls.
- Lazy Mode is the default path.
- Existing plan/prioritization/mastery/review algorithms are unchanged.
- No new UI framework.

## Review Focus

1. Existing V1/V1.1 users with stored tasks must not be forced through onboarding.
2. A new user can start with five grades + daily minutes only.
3. Today page must remain usable with zero tasks or incomplete diagnostics.
4. Fixed mobile bottom nav must not cover the last task/action.
5. App Switcher must not alter storage or current route before navigation.

---

### Task 1: Canonical design tokens and shared component primitives

**Files:**
- Create: `css/design-tokens.css`
- Modify: `index.html`
- Modify: `css/base.css`
- Modify: `css/components.css`
- Test: `tests/ui-design-contract.test.js`

**Interfaces:**
- Produces: CSS variables `--jh-bg`, `--jh-surface`, `--jh-text`, `--jh-muted`, `--jh-border`, `--jh-primary`, `--jh-primary-strong`, `--jh-primary-soft`, `--jh-radius-card`, `--jh-radius-control`, spacing tokens.
- Consumes: current static stylesheet loading order.

- [ ] **Step 1: Write the failing design-contract test**

```js
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('JHSEE design contract', () => {
  const tokens = readFileSync('css/design-tokens.css', 'utf8');
  const html = readFileSync('index.html', 'utf8');

  it('loads canonical tokens before product styles', () => {
    expect(html.indexOf('design-tokens.css')).toBeGreaterThan(-1);
    expect(html.indexOf('design-tokens.css')).toBeLessThan(html.indexOf('base.css'));
  });

  it('defines Study Planner product tokens', () => {
    expect(tokens).toContain('--jh-primary: #4F46E5');
    expect(tokens).toContain('--jh-radius-card: 18px');
    expect(tokens).toContain('--jh-space-4: 16px');
  });
});
```

- [ ] **Step 2: Run test and verify RED**

Run: `npm test -- tests/ui-design-contract.test.js`  
Expected: FAIL because `css/design-tokens.css` does not exist.

- [ ] **Step 3: Add the canonical token stylesheet**

Create `css/design-tokens.css` with the exact token families from the spec and comment `/* JHSEE Design System v1.0 */`. Use Study Planner's indigo values for the product variables.

- [ ] **Step 4: Load tokens before existing styles and remap legacy variables**

In `index.html`, load `design-tokens.css` before `base.css`. In `base.css`, map existing `--bg`, `--surface`, `--text`, `--border`, `--accent` aliases to canonical variables so existing views continue to render during migration.

- [ ] **Step 5: Run design contract and full suite**

Run: `npm test -- tests/ui-design-contract.test.js`  
Expected: PASS.  
Run: `npm test`  
Expected: all existing tests + contract tests PASS.

- [ ] **Step 6: Commit**

```bash
git add index.html css/design-tokens.css css/base.css css/components.css tests/ui-design-contract.test.js
git commit -m "style: add JHSEE design system tokens"
```

### Task 2: Shared application shell and App Switcher

**Files:**
- Create: `js/ui/app-shell.js`
- Modify: `js/app.js`
- Modify: `css/components.css`
- Test: `tests/app-shell.test.js`

**Interfaces:**
- Produces: `renderAppShell({ product, page, navItems, switcherItems }) -> HTMLElement`.
- Consumes: existing rendered route page element.

- [ ] **Step 1: Write failing shell tests**

Test that the shell exposes product name `Study Planner`, four nav links, and exactly three App Switcher destinations; ensure no switcher callback references storage.

- [ ] **Step 2: Run test and verify RED**

Run: `npm test -- tests/app-shell.test.js`  
Expected: FAIL because `app-shell.js` does not exist.

- [ ] **Step 3: Implement shell**

Use explicit switcher destinations:
- Study Planner: `https://alger68.github.io/JHSEE-Study-Planner/`
- All Subjects: `https://alger68.github.io/JHSEE-All-Subjects/`
- English Adventure: `https://alger68.github.io/JHSEE-English-Adventure/`

Render a compact brand/header, desktop utility switcher, and four-entry navigation contract.

- [ ] **Step 4: Wire `renderPage(page)` through the shell**

Keep route resolution unchanged. Do not read/write storage in the shell.

- [ ] **Step 5: Verify tests**

Run: `npm test`  
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add js/ui/app-shell.js js/app.js css/components.css tests/app-shell.test.js
git commit -m "feat: add unified Study Planner shell"
```

### Task 3: Lazy Mode quick start

**Files:**
- Modify: `js/ui/onboarding-page.js`
- Modify: `js/core/onboarding.js`
- Modify: `css/components.css`
- Test: `tests/onboarding.test.js`
- Test: `tests/quick-start.test.js`

**Interfaces:**
- Produces: `parseQuickGrades(input: string) -> { ok:boolean, grades?:Record<string,string>, error?:string }`.
- Consumes: existing `completeOnboarding(settings, patch)`, diagnostic validation.

- [ ] **Step 1: Write failing parser tests**

Cover:
- `A B A A A`
- `A,B,A,A,A`
- `A+ B++ A A+ B`
- fewer/more than five values
- invalid grade token

Expected order: 國文, 英語, 數學, 社會, 自然.

- [ ] **Step 2: Run test and verify RED**

Run: `npm test -- tests/quick-start.test.js`.

- [ ] **Step 3: Implement `parseQuickGrades`**

Accept whitespace or comma separators; normalize uppercase; allow only A++, A+, A, B++, B+, B, C.

- [ ] **Step 4: Replace three-step blocking onboarding with quick start**

Primary view:
1. one-line grade input + optional one-tap grade chips,
2. daily-minute chips 30/45/60/75/90 + custom,
3. CTA `開始今天的學習`.

Move writing level, exam date/label, and current scopes to Settings/Advanced; do not require them to start.

- [ ] **Step 5: Preserve old-user behavior**

Existing diagnostics/tasks/settings must continue to skip forced onboarding. Existing optional V1.1 nudge remains non-blocking.

- [ ] **Step 6: Verify tests**

Run: `npm test`  
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add js/ui/onboarding-page.js js/core/onboarding.js css/components.css tests/onboarding.test.js tests/quick-start.test.js
git commit -m "feat: add lazy quick start"
```

### Task 4: Professional Today-first hierarchy

**Files:**
- Modify: `js/ui/today-page.js`
- Modify: `css/components.css`
- Modify: `css/dashboard.css`
- Test: `tests/today-ui-contract.test.js`

**Interfaces:**
- Consumes: `summarizeDay(tasks)`, `explainTask(task, context)`.
- Produces: semantic card classes `.jh-hero`, `.jh-task-card`, `.jh-status-badge`, `.jh-metric-card`.

- [ ] Write a failing contract test asserting one primary CTA, canonical status labels, and no emoji-dependent navigation semantics.
- [ ] Run RED.
- [ ] Refactor Today Hero to show date/context, planned minutes, top priority, remaining tasks, one CTA.
- [ ] Standardize task cards and status badges without changing task actions.
- [ ] Ensure last card has sufficient bottom padding above fixed mobile nav.
- [ ] Run `npm test`.
- [ ] Commit with `git commit -m "style: polish Today-first dashboard"`.

### Task 5: Progress, Review, More, Settings visual migration

**Files:**
- Modify: `js/ui/progress-page.js`
- Modify: `js/ui/review-page.js`
- Modify: `js/ui/more-page.js`
- Modify: `js/ui/settings-page.js`
- Modify: `css/dashboard.css`
- Test: `tests/secondary-pages-ui.test.js`

**Interfaces:**
- Consumes: shared shell/card/status classes.
- Produces: consistent secondary-page structure.

- [ ] Add a failing test that each page returns a page header plus canonical card classes.
- [ ] Run RED.
- [ ] Apply shared page-heading, metric-card, task/list-card, empty-state, and form classes.
- [ ] Keep all existing calculations/storage handlers unchanged.
- [ ] Run `npm test`.
- [ ] Commit with `git commit -m "style: unify Study Planner secondary pages"`.

### Task 6: Responsive/accessibility regression

**Files:**
- Modify only if defects are found.
- Test: `tests/ui-safety.test.js`

**Interfaces:** none new.

- [ ] Extend UI safety tests for four nav entries, labels, and switcher.
- [ ] Run full suite.
- [ ] Manual QA at 375, 768, 1440 px.
- [ ] Keyboard test: nav, quick start, start/complete/skip, Settings.
- [ ] Verify `prefers-reduced-motion` disables non-essential motion.
- [ ] Confirm no horizontal overflow with long Traditional Chinese labels.
- [ ] Commit any fixes as `fix: harden unified Study Planner UI`.
