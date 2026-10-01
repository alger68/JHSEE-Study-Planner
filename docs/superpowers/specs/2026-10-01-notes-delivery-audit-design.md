# Knowledge Station 2.0.1 delivery and correctness

The user authorized repeated inspection, completion, performance repairs and publication. Preserve the established homepage, all 759 units / 2,824 questions, source limitations, existing links and local progress formats.

Measured 2.0.0 ships 7,918,872 uncompressed bytes (about 1.34 MB transferred with gzip) on every cold homepage visit. Most observed wall time in this execution environment was TLS connection establishment, not content transfer. Reducing delivered bytes is measurable; a universal seconds-saved claim is not justified.

The web build will prerender the existing homepage and retain a compact catalog and the existing runtime in its HTML, avoiding extra render-blocking round trips. Full lesson bodies and questions become immutable content-addressed JSON bundles by grade, subject and semester. A full pack supports global text search. Only requested content loads; HTTP and in-page caching reuse bundles. The existing self-contained build remains available to existing regressions.

Hydrate unit objects in place so captured catalog references remain valid. Validate complete build data and every fetched bundle before publishing it into runtime state. Retain concept/question/option identifiers in the compact catalog for legacy progress validation. Load the units referenced by existing practice mistakes and unfinished sessions before their existing validators run. Network failures must show retry controls, preserve raw progress and never appear as corrupt backups. Route changes while fetching must not replace the newer route. Import must load referenced units before validating the backup.

Also fix genuine concept-key validation and obsolete tracking limits, inconsistent direct exam scope, missing source labels in practice/search/print, and silent invalid-course fallback. Content/source limitations remain visible: original reading guides are not verified publisher lesson text.

Acceptance: homepage contains useful prerendered content, loads no full lesson bundles on a clean visit, and is below 30% of the former gzip payload. Direct lesson/practice/exam/search/review flows work under asynchronous delivery; saved mistakes and unfinished sessions survive reload; network failure/retry and navigation races preserve state; native mobile layouts and original regressions pass before deployment.
