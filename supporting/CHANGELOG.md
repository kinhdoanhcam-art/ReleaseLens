# Changelog

## ReleaseLens DApp

- Added a responsive React/Vite interface for Vercel.
- Renamed the packaged contract source file to `ReleaseLens.py` and placed it in `contracts/` while preserving the deployed `SemVerGuard` class bytes.
- Bound the UI to Studionet contract `0xd18756fa5bD6003c2a960DF1106a6599F0011064`.
- Added finalized reads, maintainer-only writes, transaction lifecycle tracking and explicit execution-success validation.
- Added current deployment evidence and separated historical transaction evidence.

## 1.1 — 2026-09-22

- Fail closed on malformed or out-of-schema semantic output.
- Canonicalize fence removal to a fixed point and align cache hashing with model input.
- Verify the stored pending hash before activation.
- Safely unwrap `run_nondet_unsafe` return values.
- Add `get_config()` with explicit single-maintainer and no-cancellation disclosure.
- Replace stale runtime claims with a fresh N1–N5 protocol covering two natural `NON_BREAKING` forms and outsider authorization.
- Add locked specification, blind runtime protocol, evidence template, source hash and security documentation.
