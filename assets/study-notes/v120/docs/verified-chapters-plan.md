# 115-1 verified chapter upgrade — approved continuation
Goal: Continue existing knowledge station with source-verifiable school chapter navigation and substantive missing lessons. Keep Planner root and existing progress IDs unchanged.
Baseline: remote 86dc84e358748ddfb4f7186be0eb6fe6fde35f16, restored from GitHub verification artifact; 41 local Node tests pass.

- [x] Transcribe 6 official first-semester course plans, 105 numbered sections; record PDF pages and source discrepancies. No claim second-semester plan confirmed.
- [x] Add 8 chapter-aligned notes with 3 concepts and 3 original quizzes each. Original 64 guides unchanged.
- [x] Integrate #/chapters route into existing render/navigation, no second router/polling. Chapters without aligned content show an explicit gap, no empty quiz.
- [x] Add structural, content and browser regression checks. Preserve practice engine schema/version 1.3.1 for saved snapshots; display website version 1.4.0 separately.
- [ ] Run remote native browser CI; deploy through existing Pages pipeline and verify published build. Status is recorded by the workflow rather than pre-claimed here.

Local evidence: 50 Node checks, 33 new chapter DOM/browser checks, 14 exam/session checks passed. The local browser uses an isolated DOM and memory-storage fixture because this environment blocks loopback HTTP navigation. Remote CI runs real HTTP and native localStorage; do not conflate these modes.
Review focus: distinguish verified headings from original explanations; source-internal aliases; no incorrect semester mapping; preserve old answer IDs; do not present common-core guides as chapter-complete.
