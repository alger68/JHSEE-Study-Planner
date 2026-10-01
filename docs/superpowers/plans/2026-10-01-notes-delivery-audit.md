# Knowledge Station 2.0.1 implementation

Base: 3c623011eae7a813e76a60bf60c6926456807eed. Authorized autonomous implementation and publication. Root owns delivery, workflow and integration. A bounded parallel agent owns confirmed correctness fixes and focused regressions; shared source template edits are restricted to display labels.

1. Reproduce confirmed correctness failures and add focused regressions. Repair practice persistence/scope and source disclosure without changing storage versions or existing question IDs.
2. Add compact catalog / content bundle builder and asynchronous loader. Test byte budgets, hydration identity, missing/invalid chunk, retry, saved-state preparation and route races. Preserve standalone build.
3. Integrate web artifact into Pages after the existing standalone native acceptance suite. Add HTTP Chromium delivery acceptance for fresh home, lazy navigation, search, reload state, failure/retry, mobile and initial payload.
4. Run local Node/planner regression suites, inspect changes independently, publish the tested tree, wait for CI/deploy, and verify the public URL with native browser and actual bytes.

Review focus: compact data must not be accepted as full lesson data; asynchronous startup must never overwrite valid progress; invalid chunk must not partially hydrate; a late response must not steal navigation; old/new content filenames must not mix; storage-disabled users must retain reading access. All disclosures must survive print and source filtering. Network timing claims must distinguish TLS delay from transfer and runtime.

Validation ledger will be recorded in docs/study-notes-v2/validation-v201.json and release notes. No future scheduling requested: repeated checking is bounded release verification.
