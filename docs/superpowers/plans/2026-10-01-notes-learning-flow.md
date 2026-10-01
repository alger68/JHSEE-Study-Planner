# Knowledge Station V2.0.2 Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this bounded change inline; conduct one independent whole-branch review.

**Goal:** Connect existing learning records to readable review actions and visible chapter progress, with fewer unnecessary downloads.

**Architecture:** Pass validated legacy progress into the catalog renderer; retain concept titles in the thin delivery catalog; limit review hydration to starred units. Keep all existing storage and content schemas.

**Tech Stack:** Existing JavaScript builders, Node test runner, JSDOM, GitHub Pages CI.

**Spec:** `docs/superpowers/specs/2026-10-01-notes-learning-flow-design.md`

## Global Constraints

- No storage migration or curriculum count change.
- Catalog navigation downloads zero lesson bundles; initial HTML <2 MB and gzip <350 KB.
- Preserve source/full-text limitations and original-vs-publisher content labels.
- Work in this task-owned checkout on `fix/notes-v202-learning-flow`; publication is already authorized.

## Review Focus

- Resolved old mistakes may leave statistics in a lesson that is not yet hydrated: its concept title and link still work.
- Selected subcourses and shared guides must not inflate chapter progress totals.
- Invalid fixed-answer option IDs must not count as completed questions.
- Existing answers without any bookmark must not trigger a review download.
- Long concept names and progress labels must remain usable at a 320 px viewport.

### Task 1: Learning flow and delivery

**Files:** `modules/academy-ui.js`, `modules/curriculum-browser.js`, `modules/curriculum-browser.css`, `modules/content-loader.cjs`, `build-complete.cjs`, `build-web.cjs`, and `tests/web-delivery.test.cjs`, under `assets/study-notes/v120/`.

**Interfaces:** `CurriculumBrowser.render(D, params, progress={})` consumes existing validated legacy state. Compact concept metadata gains `title`. All route and storage interfaces remain unchanged.

- [x] Add regression cases proving readable weakness links without loading unrelated content; correct per-lesson and selected-course progress; and review requests restricted to starred scope.
- [x] Run `node --test assets/study-notes/v120/tests/web-delivery.test.cjs`; expect the new cases to fail for missing UI or unnecessary requests.
- [x] Implement the three bounded behaviors; keep scores, ordering and subject selection unchanged.
- [x] Run the focused tests, then the full Node suite and `npm test`; expect zero failures and payload within budget.
- [x] Extend existing native CI acceptance for catalog progress, weakness link navigation and narrow-screen layout. Update web release and deployment version checks to 2.0.2.
- [x] Review and commit verified changes with a short release record.

### Task 2: Publish and verify

**Files:** `.github/workflows/pages.yml`, `docs/study-notes-v2/README.md`, `docs/study-notes-v2/validation-v202.json`.

**Interfaces:** Publish the tested git tree using GitHub's existing authorized APIs, wait for all CI gates and Pages deployment, compare live HTML digest to the local tested artifact.

- [x] Request an independent whole-branch review; fix consequential defects with a failing regression first.
- [x] Publish, inspect all test/deploy results, and visit the live homepage plus catalog and review flow through CUA.
- [x] Record exact version, tree, run ID, payload, test counts and remaining content limitations; leave the verified homepage open.

## Execution evidence

Task 1: baseline 10/10; four new user-flow regressions failed for missing labels and extra downloads, then passed 14/14. Full Node 142/142 and Planner 74/74 pass. Local artifact is 1,780,763 bytes and gzip 297,781 bytes. Native acceptance is extended by six checks and will run in CI. No storage or curriculum migration.

Final review: no Critical, Important, or Minor findings. The reviewer independently passed 14 delivery tests and probed all 106 course scopes, invalid answer options and duplicate units. Native visuals and the public artifact remain the publication gates.

Task 2: published commit `14762e8a7ab6440aacfdf63623cbe91011759095`, tested tree `6018f40f4707deac3aea620e9becccd037b965b0`. Actions run `36877900005` built and deployed successfully; 29 final native web checks passed with zero runtime errors. Live HTML SHA-256 `8f71a59603f690d286cffd0f1fa36eff0c291ecd283bc3dbc43486b7e5284ca3` matches the tested artifact byte-for-byte. CUA confirmed the V2.0.2 homepage, catalog progress and review, then left the homepage open.
