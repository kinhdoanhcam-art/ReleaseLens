# Changelog

## Steward identity fix — 2026-09-24

- Separated proposal identity from prompt-safety filtering: cache keys and pending commitments now hash the exact `_clean_spec(...)` strings stored by the contract.
- Preserved legitimate `BREAKING` and `NON_BREAKING` vocabulary during semantic classification while continuing to neutralize prompt delimiters and the JSON output-envelope key.
- Added regression coverage proving verdict-word and internal-whitespace variants cannot reuse a cached verdict, and a changed pending specification cannot satisfy the original commitment.
- Replaced the earlier test that incorrectly treated a delimiter-modified proposal as cache-equivalent.
- Freshly deployed the repaired source and recorded finalized NON_BREAKING, rollback, BREAKING and activation evidence.

## ReleaseLens DApp

- Added a responsive React/Vite interface for Vercel.
- Renamed the packaged contract source file to `ReleaseLens.py` and placed it in `contracts/` while preserving the deployed `SemVerGuard` class bytes.
- Bound the UI to Studionet contract `0xe82f184fe005Cc57aAd775C55b38D33885e672C9`.
- Added finalized reads, maintainer-only writes, transaction lifecycle tracking and explicit execution-success validation.
- Added current deployment evidence and separated historical transaction evidence.

## 1.1 — 2026-09-22

- Fail closed on malformed or out-of-schema semantic output.
- Canonicalize fence removal to a fixed point. This older model-input/cache coupling was superseded by the 2026-09-24 steward identity fix above.
- Verify the stored pending hash before activation.
- Safely unwrap `run_nondet_unsafe` return values.
- Add `get_config()` with explicit single-maintainer and no-cancellation disclosure.
- Replace stale runtime claims with a fresh N1–N5 protocol covering two natural `NON_BREAKING` forms and outsider authorization.
- Add locked specification, blind runtime protocol, evidence template, source hash and security documentation.
