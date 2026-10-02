# Historical exam solution reader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Publish five fully accounted-for grade 7 historical exam solution guides without slowing the homepage or changing learning progress.

**Architecture:** A source-validated data module enriches a new final build wrapper. A focused reader renders lists and per-paper explanations; the compact delivery build splits full paper bodies into validated hash-addressed JSON fetched only on a detail route. Independent subject audits write content files; the root implements and verifies the shared interfaces.

**Tech Stack:** CommonJS build scripts, vanilla JS, existing hash router, node:test, JSDOM, native Chromium CI.

**Spec:** docs/superpowers/specs/2026-10-02-exam-solutions.md

## Global Constraints
- Retain the 114-2 source identities and physical PDF page numbers.
- Preserve 763 units / 4,578 fixed questions and all existing storage keys.
- Homepage <2,000,000 raw bytes and <350,000 gzip bytes; no initial paper or lesson request.
- No dependencies, no full original paper transcription, traditional Chinese original solutions.

## Review Focus
- Source answer/figure conflicts must remain visible and never be silently resolved by trusting the key.
- English listening is limited to available evidence, not claimed audio validation.
- Failed or corrupt lazy payloads cannot replace an active page or modify saved progress.
- Direct unknown IDs and invalid grade filters do not silently substitute another scope.
- Existing stored quiz/session snapshots remain identical after visiting solutions.

### Task 1: Source-checked original guides
**Files:** Create `modules/exam-solutions/*.json`, `modules/exam-solutions.cjs`, `tests/exam-solutions.test.cjs` under `assets/study-notes/v120`; subject review notes under `docs/study-notes-v2/content-review/v211`.
**Interfaces:** Consumes source-atlas metadata. Produces `enrich(D, papers?)` with `D.examSolutions={schema:1,papers:[metadata+items],...counts}` and unchanged D.units.
- [x] Add failing validator tests for wrong identity/page/duplicate IDs, missing sections and invalid statuses.
- [x] Run node:test and confirm assertions fail because module behavior is absent.
- [x] Independently inspect five PDFs, write original explanations, record coverage and discrepancies; implement strict schema checks and derived counts.
- [x] Run targeted tests, inspect each subject audit, commit.

### Task 2: Reader and lazy delivery
**Files:** Create `build-exam-solutions.cjs`, `modules/exam-solutions-ui.cjs`, `modules/exam-solutions.css`, `tests/exam-solutions-release.test.cjs`; modify `build-web.cjs`.
**Interfaces:** Wrapper calls build-all-subjects then enrich; `ExamSolutionsUI.render(D,params)` returns HTML; `ExamSolutionsUI.load(D,params,main)` handles detail loading; manifest paper metadata uses `{file,sha256}`.
- [x] Add failing real JSDOM tests for list/detail disclosure, no initial payload request, direct links, invalid filters, retry, wrong hash/source, navigation races, no progress writes, and legacy question identity.
- [x] Run tests, observe expected missing feature failures.
- [x] Implement source-backed reader, homepage/atlas links, safe asynchronous loading and full-build support; compact solution payloads in build-web.
- [x] Run targeted tests and full Node suites; verify budgets, commit.

### Task 3: Published verification
**Files:** Update `.github/workflows/pages.yml`, add `tests/exam-solutions-browser.py`, and `docs/study-notes-v2/EXAM-SOLUTIONS-V211.md`.
**Interfaces:** CI builds final wrapper then compact delivery, checks native browser flows and published paper hashes.
- [ ] Add native acceptance for lazy load, disclosure, five paper IDs/counts, error retry, mobile overflow and old progress continuity.
- [ ] Run full local required suites and fresh whole-branch review; fix substantive findings with reproducing tests.
- [ ] Publish using fresh remote head and non-force update; observe all required CI checks.
- [ ] Verify public response/hashes and CUA visible flows, capture screenshot, document results and remaining content gaps, commit verification record.
