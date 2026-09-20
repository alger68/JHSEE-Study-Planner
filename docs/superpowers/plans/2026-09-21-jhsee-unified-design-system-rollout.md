# JHSEE Unified Design System Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Roll out JHSEE Unified Design System V1 across Study Planner, English Adventure, and All Subjects without coupling their releases or data stores.

**Architecture:** Treat each repository as an independently deployable product that consumes the same design contract. Study Planner establishes the canonical tokens/components first; English Adventure adopts the shell next; All Subjects adopts the light shell last and isolates its exam UI as dark Focus Mode. App Switcher links are explicit navigation only.

**Tech Stack:** Static HTML/CSS/JavaScript, Vitest where already installed, Node built-in checks where no test framework exists, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-17-jhsee-unified-design-system-v1-design.md`

## Global Constraints

- Keep all three repositories separate.
- Do not introduce hidden cross-project LocalStorage reads.
- Default shell is light Professional Academic SaaS.
- Study Planner primary: `#4F46E5`.
- All Subjects primary: `#0F766E`.
- English Adventure primary: `#D97706`.
- All Subjects dark theme is limited to formal mock-exam answering/check flow.
- Mobile bottom navigation has exactly four high-frequency entries.
- Minimum touch height is 44 px.
- Font stack is Inter + Noto Sans TC + system fallbacks.
- No new UI framework.
- No new backend/auth/shared runtime dependency.
- Respect `prefers-reduced-motion`.
- Each repository deploys and rolls back independently.

## Review Focus

1. Existing LocalStorage/state data must survive visual migration unchanged.
2. Mobile 375 px layouts must not hide the primary CTA behind bottom navigation.
3. Long Traditional Chinese labels must wrap without horizontal overflow.
4. App Switcher must navigate correctly without attempting cross-origin storage reads.
5. All Subjects must never leak dark Focus Mode onto normal browsing/results pages.

---

### Task 1: Study Planner establishes the canonical component contract

**Files:**
- Follow plan: `docs/superpowers/plans/2026-09-21-study-planner-unified-ui.md`

**Interfaces:**
- Produces: canonical token names, shared class contract, App Switcher destination map.
- Consumes: existing Study Planner V1.1 routes and storage namespace.

- [ ] Implement the Study Planner plan completely on an isolated feature branch.
- [ ] Run the full Study Planner Vitest suite.
- [ ] Manually verify 375 px, 768 px, and 1440 px.
- [ ] Merge/deploy Study Planner only after its own PR is approved.
- [ ] Record the canonical UI version as `JHSEE Design System v1.0`.

### Task 2: English Adventure adopts the shared shell

**Files:**
- Follow plan: `docs/superpowers/plans/2026-09-21-english-adventure-unified-ui.md`

**Interfaces:**
- Consumes: canonical token/class names from Task 1.
- Produces: English Adventure light-shell implementation with amber theme.

- [ ] Start only after Task 1 tokens/classes are stable.
- [ ] Implement on an isolated English Adventure branch.
- [ ] Preserve lesson data, EXP, streak, level, wrong-question, TTS, and exam logic.
- [ ] Verify the four-entry mobile navigation and desktop shell.
- [ ] Merge/deploy independently.

### Task 3: All Subjects adopts the shared light shell and explicit Focus Mode

**Files:**
- Follow plan: `docs/superpowers/plans/2026-09-21-all-subjects-unified-ui-focus-mode.md`

**Interfaces:**
- Consumes: canonical token/class names from Task 1.
- Produces: teal light shell + explicit dark `.focus-mode` exam state.

- [ ] Start after Task 1 contract is stable; may proceed in parallel with Task 2 only if token names no longer change.
- [ ] Preserve all question-generation, mock-exam, mastery, AI fallback, and storage logic.
- [ ] Verify Focus Mode is applied only to formal exam answering/check routes.
- [ ] Run `npm test` and `npm run build`.
- [ ] Merge/deploy independently.

### Task 4: Cross-suite App Switcher consistency audit

**Files:**
- Verify shared App Switcher definitions in all three repos.

**Interfaces:**
- Consumes: deployed/static URLs for the three GitHub Pages apps.
- Produces: same three product destinations and labels everywhere.

- [ ] Verify Study Planner links to Study Planner, All Subjects, and English Adventure using explicit URLs.
- [ ] Verify English Adventure contains the same three labels and destinations.
- [ ] Verify All Subjects contains the same three labels and destinations.
- [ ] Confirm no code reads another app's LocalStorage namespace.
- [ ] Confirm switcher is hidden during All Subjects Focus Mode.
- [ ] Commit any link-only corrections in each affected repo separately.

### Task 5: Final suite visual QA

**Files:** none unless defects are found.

**Interfaces:**
- Consumes: three independently verified builds.
- Produces: release readiness checklist.

- [ ] At 375 px, verify primary CTA, bottom nav, long labels, empty state, error state.
- [ ] At 768 px, verify responsive transition and no clipped navigation.
- [ ] At 1440 px, verify consistent max width, header rhythm, card geometry, and sidebar/topbar structure.
- [ ] Keyboard through primary navigation, forms, and exam controls.
- [ ] Verify status labels use: 優先加強 / 需要注意 / 穩定維持 / 已掌握 / 資料不足.
- [ ] Verify product identities remain distinguishable by accent color.
- [ ] Verify no repo was deployed together with another repo without its own passing checks.
