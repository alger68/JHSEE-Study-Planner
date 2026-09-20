# All Subjects Unified UI + Focus Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace All Subjects' default neon/dark RPG shell with the shared professional light shell while preserving a deliberate dark Focus Mode for formal mock exams.

**Architecture:** Add canonical tokens and a teal product theme, migrate normal views to the shared light shell, and scope all dark exam styling under an explicit `.focus-mode` root/class. Routing/state algorithms remain unchanged; only view markup/class contracts and CSS shell behavior change.

**Tech Stack:** ES modules, CSS, Vitest + jsdom, Vite, GitHub Pages.

**Spec:** `JHSEE-Study-Planner/docs/superpowers/specs/2026-09-17-jhsee-unified-design-system-v1-design.md`

## Global Constraints

- Product accent: `#0F766E`; strong `#115E59`; soft `#ECFDF5`.
- Normal browsing/practice/results/review use light shell.
- Formal mock answering/check uses dark Focus Mode only.
- Preserve AI fallback, question diversity, personalization, mastery, official paper, TTS, battle, quest, exam-session, and storage behavior.
- Four mobile nav entries: 練習 / 模考 / 錯題 / 更多.
- Hide App Switcher in Focus Mode.
- Node engine remains 22.x.
- Run both `npm test` and `npm run build`.

## Review Focus

1. Focus Mode must not remain active after submit/route change.
2. Exam answer selections and timer must survive visual refactor.
3. Official paper reader wide content must remain scrollable/readable.
4. Existing state/local data must remain compatible.
5. AI question/loading/error states must remain visible in the light shell.

---

### Task 1: Canonical tokens and theme isolation

**Files:**
- Create: `css/design-tokens.css`
- Modify: `index.html`
- Modify: `css/app.css`
- Create: `tests/ui-theme-contract.test.js`

**Interfaces:**
- Produces canonical JHSEE variables and All Subjects teal theme.
- Consumes current `css/app.css` selectors.

- [ ] Write failing test reading tokens/index and checking load order + teal values.
- [ ] Run: `npm test -- tests/ui-theme-contract.test.js`; expect RED.
- [ ] Create token file with `JHSEE Design System v1.0`.
- [ ] Load before `app.css`.
- [ ] Convert root/default background to light shell; retain legacy variables as aliases temporarily.
- [ ] Run full `npm test`.
- [ ] Commit: `style: add All Subjects design tokens`.

### Task 2: Explicit Focus Mode state/class

**Files:**
- Modify: `js/app.js`
- Modify: `js/ui/exam-views.js`
- Modify: `js/ui/exam-check.js`
- Modify: `css/app.css`
- Test: `tests/focus-mode.test.js`

**Interfaces:**
- Produces: `isFocusRoute(routeOrView) -> boolean` or equivalent centralized predicate; root class `.focus-mode`.
- Consumes: existing router/view state.

- [ ] Write failing tests proving formal exam session/check routes return true while lobby, practice, results, revenge, profile return false.
- [ ] Run RED.
- [ ] Implement one centralized focus predicate; do not scatter route-name checks across CSS/JS.
- [ ] Toggle `.focus-mode` on the app/body only when predicate is true.
- [ ] Move dark background/grid/exam-specific colors under `.focus-mode`.
- [ ] Hide App Switcher and unrelated navigation in focus mode.
- [ ] Verify route exit removes the class.
- [ ] Run full tests.
- [ ] Commit: `feat: isolate mock exam Focus Mode`.

### Task 3: Shared light application shell

**Files:**
- Create: `js/ui/app-shell.js`
- Modify: `js/app.js`
- Modify: `css/app.css`
- Test: `tests/app-shell.test.js`

**Interfaces:**
- Produces: shared brand/header/nav/switcher wrapper for non-focus views.
- Consumes: current rendered view output.

- [ ] Write failing tests for product name, four mobile nav labels, three App Switcher links.
- [ ] Run RED.
- [ ] Implement light shell with teal active states.
- [ ] Keep existing route functions intact; wrap normal views rather than rewriting algorithms.
- [ ] Map More to secondary routes/features that do not fit the four-entry bottom nav.
- [ ] Ensure Focus Mode bypasses normal shell navigation.
- [ ] Run tests.
- [ ] Commit: `feat: add unified All Subjects shell`.

### Task 4: Migrate normal cards and dashboards away from neon RPG chrome

**Files:**
- Modify: `css/app.css`
- Modify: `js/ui/views.js` only where markup needs canonical class hooks.
- Modify: relevant tests or create `tests/light-shell-ui.test.js`.

**Interfaces:**
- Produces canonical hero/task/metric/status card classes.
- Consumes current lobby/world/profile/analysis/revenge view data.

- [ ] Add failing assertions that non-focus views use light-shell class hooks and do not require dark root colors.
- [ ] Run RED.
- [ ] Replace grid/neon default shell, heavy glow, and oversized RPG chrome with restrained cards/borders.
- [ ] Retain motivation mechanics as information: streak/quests/rewards may remain but not dominate page hierarchy.
- [ ] Use canonical status language where learner-state semantics apply.
- [ ] Run tests.
- [ ] Commit: `style: professionalize All Subjects dashboards`.

### Task 5: Focus Mode exam visual contract

**Files:**
- Modify: `css/app.css`
- Modify: `js/ui/exam-views.js`
- Modify: `js/ui/exam-check.js`
- Test: `tests/focus-mode.test.js`

**Interfaces:**
- Consumes `.focus-mode`.
- Produces focused exam layout with timer/question/answer sheet/navigation/submit.

- [ ] Add tests asserting focus markup retains timer, question number, answer options, mark/bookmark, previous/next, submit.
- [ ] Ensure Focus Mode does not render app switcher or unrelated dashboard navigation.
- [ ] Restyle to deep navy background + high-contrast paper surfaces without pure white-on-black glare.
- [ ] Keep answer sheet accessible at mobile widths; allow explicit scroll where needed.
- [ ] Run tests.
- [ ] Commit: `style: refine All Subjects Focus Mode`.

### Task 6: Official reader, error/loading, responsive and accessibility regression

**Files:**
- Modify: `css/app.css`
- Test: `tests/ui-theme-contract.test.js`
- Test: existing official-reader/exam tests.

**Interfaces:** none new.

- [ ] Add coverage ensuring official reader retains horizontal scroll for wide material.
- [ ] Verify loading/error/AI fallback messages meet contrast requirements.
- [ ] Add reduced-motion rule and visible focus outlines.
- [ ] Manual QA 375/768/1440 px across lobby, practice, official reader, results, revenge, Focus Mode.
- [ ] Run: `npm test`.
- [ ] Run: `npm run build`.
- [ ] Commit fixes as `fix: harden All Subjects unified UI`.

### Task 7: Production regression checklist

**Files:** none unless defects are found.

- [ ] Start a practice set and answer questions.
- [ ] Start a formal mock; verify dark Focus Mode.
- [ ] Mark a question, navigate previous/next, confirm timer continues.
- [ ] Submit and confirm light shell returns.
- [ ] Review results/wrong questions.
- [ ] Exercise AI fallback path when service is unavailable/limited.
- [ ] Reload and confirm stored progress/history remains available.
- [ ] Confirm App Switcher is visible outside Focus Mode only.
