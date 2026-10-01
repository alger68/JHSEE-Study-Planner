# Knowledge Station V2.0.2 learning flow

The user has authorized continued autonomous improvements and publication. This bounded release makes existing learning records useful without changing curriculum content, storage schemas, or the established design.

- Weakness rows show the actual concept name, grade, semester, subject and unit title, with a link to the matching concept. Explain that this is the six highest-priority tracked weaknesses across all subjects; preserve existing scores and adaptive scope behavior.
- The course catalog shows explicitly self-marked reading status and fixed self-check answered/correct counts for each available lesson, including shared guides. A selected-course summary counts unique available unit IDs only. These records are local; reading and question counts do not establish mastery or textbook coverage.
- The review page loads bookmarked concepts only. Previously answered units that have no bookmark must not trigger lesson downloads.
- Keep catalog navigation free of lesson downloads. Retain concept titles in the compact catalog for weaknesses whose old mistake snapshots have already been cleared. Initial HTML remains below 2 MB and gzip below 350 KB, with no dependency added.
- Preserve all existing local progress, validation, backup, retry and race protections. Continue disclosing 74 reading guides with unverified full source texts, 40 source exam PDFs without full transcription, and the difference between original exercises and publisher coverage.

Verification uses real built artifacts in Node/JSDOM plus the existing native Chromium CI acceptance. Deploy the exact tested tree and verify the published homepage and changed interactions.
