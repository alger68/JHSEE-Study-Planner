# English Adventure Unified UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move English Adventure into the JHSEE Professional Academic SaaS family while preserving its 250-day course, adaptive practice, streak, EXP, TTS, mistakes, and exam flows.

**Architecture:** Keep the existing single-page JavaScript behavior and DOM IDs stable. Introduce canonical design tokens, replace the dark navy sidebar shell with the shared light shell + amber accent, add the four-entry mobile nav, and preserve gamification as secondary information rather than the visual framework.

**Tech Stack:** Static HTML/CSS/JavaScript, Node built-in `node:test` contract checks, GitHub Pages.

**Spec:** `JHSEE-Study-Planner/docs/superpowers/specs/2026-09-17-jhsee-unified-design-system-v1-design.md`

## Global Constraints

- Do not change content/question data as part of the UI migration.
- Do not rename DOM IDs consumed by `app.js`, `core.js`, adaptive/exam/TTS scripts.
- Primary accent: `#D97706`; strong `#B45309`; soft `#FFF7ED`.
- Four mobile nav entries: 今日 / 闖關 / 錯題 / 更多.
- Preserve streak, EXP, level, speech, wrong-question, exam and transfer behavior.
- No new UI framework or runtime dependency.
- 44 px touch targets; reduced-motion support.

## Review Focus

1. Existing script selectors must continue to find every required DOM ID.
2. Lesson/question content must stay above mobile bottom nav.
3. Large streak/EXP values must not break header layout.
4. Old browser/local data must remain readable.
5. Visual celebration must not overpower reading content.

---

### Task 1: Add no-dependency UI contract test harness

**Files:**
- Create: `tests/ui-contract.test.mjs`

**Interfaces:**
- Produces: Node built-in static contract tests runnable via `node --test tests/ui-contract.test.mjs`.

- [ ] Write tests that load `index.html` and `style.css` and assert current required DOM IDs remain present.
- [ ] Include IDs: `nav`, `streak`, `xp`, `level`, `main`, `toast`, `storageWarning`, `contentUpdate`.
- [ ] Run: `node --test tests/ui-contract.test.mjs`.
- [ ] Expected baseline: PASS before visual migration.
- [ ] Commit: `test: add English Adventure UI contract checks`.

### Task 2: Add canonical tokens and amber product theme

**Files:**
- Create: `design-tokens.css`
- Modify: `index.html`
- Modify: `style.css`
- Modify: `tests/ui-contract.test.mjs`

**Interfaces:**
- Produces canonical JHSEE variables and legacy aliases.

- [ ] Add a failing test for `design-tokens.css` and `--jh-primary: #D97706`.
- [ ] Run RED.
- [ ] Create `design-tokens.css` with `/* JHSEE Design System v1.0 */`.
- [ ] Load it before `style.css`.
- [ ] Alias legacy purple/navy variables only where needed during migration.
- [ ] Run Node contract test.
- [ ] Commit: `style: add JHSEE design tokens to English Adventure`.

### Task 3: Replace shell while keeping DOM IDs stable

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `tests/ui-contract.test.mjs`

**Interfaces:**
- Consumes existing DOM IDs.
- Produces shared light desktop shell, top header, four-entry mobile navigation, App Switcher.

- [ ] Add failing assertions for family brand, product name, four mobile nav labels, and three switcher destinations.
- [ ] Run RED.
- [ ] Convert sidebar/topbar styling to light shared shell; keep `#nav` and existing links available for current routing.
- [ ] On mobile present exactly: 今日 / 闖關 / 錯題 / 更多. Map 更多 to a compact panel containing 單字、歷屆試題、學習紀錄、App Switcher.
- [ ] Preserve desktop access to all existing views.
- [ ] Add explicit product URLs; no cross-app storage reads.
- [ ] Run contract tests.
- [ ] Commit: `feat: add unified English Adventure shell`.

### Task 4: Professionalize home/lesson cards without removing motivation

**Files:**
- Modify: `style.css`
- Modify: `app.js` only where class names/markup emitted by render functions require stable shared classes.
- Create/modify: `tests/ui-render-contract.test.mjs` only if render output can be exercised without browser dependencies; otherwise extend static contract checks around class strings.

**Interfaces:**
- Produces shared hero/card/progress/status visual classes.
- Consumes current lesson render data.

- [ ] Add contract checks for canonical card and CTA classes used in rendered strings.
- [ ] Keep Day/Streak/EXP but reduce them to secondary KPI presentation.
- [ ] Remove decorative serif dependency from core UI headings; keep story text readable.
- [ ] Limit large illustration/mission decoration so primary learning CTA stays above fold at 375 px.
- [ ] Preserve correct/wrong option semantics and explanations.
- [ ] Run contract checks.
- [ ] Commit: `style: align English Adventure learning surfaces`.

### Task 5: Responsive/accessibility/motion pass

**Files:**
- Modify: `style.css`
- Test: `tests/ui-contract.test.mjs`

**Interfaces:** none new.

- [ ] Add checks for 44 px minimum nav/control rules and `prefers-reduced-motion`.
- [ ] Ensure fixed bottom nav reserves body/workspace padding.
- [ ] Ensure player stats wrap or collapse safely on narrow widths.
- [ ] Manual QA 375/768/1440 px.
- [ ] Keyboard QA navigation, lesson answers, TTS controls, mistake review.
- [ ] Run Node tests.
- [ ] Commit: `fix: harden English Adventure unified UI`.

### Task 6: Production regression checklist

**Files:** none unless defects are found.

- [ ] Open each existing route/view: home, words, mistakes, exams, dashboard.
- [ ] Complete one lesson and confirm EXP/streak update.
- [ ] Trigger TTS and speech-rate control.
- [ ] Review a wrong question.
- [ ] Confirm local progress survives reload.
- [ ] Confirm App Switcher works and no data is modified by switching.
