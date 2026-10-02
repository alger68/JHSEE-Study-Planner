# V2.1.2 execution plan

Spec: `docs/superpowers/specs/2026-10-02-exam-solutions-v212.md`.

Global constraints: no original full-paper republication, no fabricated certainty, no progress storage writes, no editing old paper objects, no larger homepage budget. Work in the isolated `work/notes-exam-solutions-v212` worktree. User continuation and publication authorization is already established.

1. [x] Download and fingerprint ten PDFs; parallel independent subject audits produce ten validated JSON files and five audit records. Cross-check section/item inventories and representative disputed/numeric answers.
2. [x] Add a failing lazy-coverage-note regression, move notes into paper bundles only, and verify direct load/retry/standalone behavior. Update the version and release/native coverage gates to fifteen papers after independent inventories establish totals. Run all notes and Planner tests.
3. [ ] Fresh independent review of the entire branch; resolve important findings with regression coverage. Publish with a non-force GitHub ref update, pass native CI and public hash checks, inspect visible browser behavior, open the homepage, and record evidence.

Review focus: omissions or double-counted subparts; physical PDF page references; official-key transcription; missing-audio claims; unchanged first-round files; long coverage notes still visible after lazy loading; immutable old progress; homepage budget; all fifteen native paper routes.

Baseline: e86debfecd8c6af72c43435e07134ad9f7b2d854. Existing exam data/release tests: 16 passed before edits. All ten source SHA256 values and physical page counts match atlas metadata.
