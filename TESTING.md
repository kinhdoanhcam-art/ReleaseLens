# ReleaseLens — Testing

## Truth standard

`SUBMITTED ≠ ACCEPTED ≠ FINALIZED ≠ EXECUTION SUCCESS ≠ POSTCONDITION PASS`

A runtime case is marked `PASS` only when its full transaction hash, execution outcome and authoritative post-state are recorded in `supporting/RUNTIME_EVIDENCE.md`.

## Local deterministic tests

```text
python3 -m unittest discover -s supporting/tests -v
python3 -m py_compile contracts/ReleaseLens.py supporting/tests/test_releaselens_v1_1.py
npm run typecheck
npm run build
```

The Python suite uses a local GenLayer stub and covers 13 state and identity regressions. It complements, but does not replace, Studionet execution evidence.

## Fresh deployment

- Network: Studionet (`61999`)
- Contract: `0xe82f184fe005Cc57aAd775C55b38D33885e672C9`
- Deploy transaction: `0xf692863892d1c7e1f30c3263c4f6a6a3dded59f7564cdd06ef9b3280a8d554e6`
- Maintainer: `0x3065E31B1D993d7C0D59E6786844cBa56780B2d3`
- Frozen source SHA-256: `208bdf4fac0e4a18c953942db3a0248b4f091b0b6d98064babdee0a919e0c976`
- Initial version: `1.0`
- Initial specification: `The API returns invoice totals as integer cents. It accepts a valid invoice identifier and returns an error for unknown identifiers.`

## Current deployment runtime matrix

| Case | Call | Full transaction hash | Observed result | Authoritative post-state | Status |
|---|---|---|---|---|---|
| Deploy | constructor | `0xf692863892d1c7e1f30c3263c4f6a6a3dded59f7564cdd06ef9b3280a8d554e6` | `SUCCESS`, `FINALIZED` | version `1.0`, no pending proposal | `PASS` |
| N1 | `propose_change(NON_BREAKING text)` | `0x45549c574e44f799b249dfa1083fa33c9038d46c8a547e33dbc02efb0f669d29` | semantic output `NON_BREAKING`, `SUCCESS` | pending proposal locked | `PASS` |
| N2 | `activate_pending(2, 0)` | `0x3efb902dce45603f64c00afdd8736775a901276ec89b2573a294034134955d4b` | rollback: `Non-breaking change must keep major version` | version and pending proposal unchanged | `PASS` |
| N3 | `activate_pending(1, 1)` | `0x52f649833bcf0ece32e7f52b0a910c9a929726ac26023712d5e1eebe5c86db5a` | `SUCCESS`, `FINALIZED` | version `1.1`, no pending proposal | `PASS` |
| B1 | `propose_change(BREAKING text)` | `0xa9803c0fd7695f12ada807b021283fd56d67d5835f2d7e6fb2bc629ee315e34d` | semantic output `BREAKING`, `SUCCESS`, `FINALIZED` | breaking proposal pending | `PASS` |
| B2 | `activate_pending(2, 0)` | `0xb1362860a3deb6ff5f515335e6d1e62ea4397b99493a3c48f90ffd50f5192063` | `SUCCESS`, `FINALIZED` | version `2.0`, `BREAKING`, no pending proposal | `PASS` |

Exact proposal text and Explorer URLs are recorded in `supporting/RUNTIME_EVIDENCE.md`.

## Reviewer path

1. Open the contract Explorer link and confirm address, deployer and finalized deploy transaction.
2. Call `get_config`, `get_summary` and `get_pending` at finalized state.
3. Confirm `get_summary` reports version `2.0`, `last_classification=BREAKING` and `has_pending=NO`.
4. Open N1 and B1 in Explorer; confirm equivalence outputs `NON_BREAKING` and `BREAKING` respectively.
5. Open N2; confirm the invalid major bump rolled back and the proposal remained pending.
6. Open N3 and B2; confirm both valid activations finalized successfully.

## Remaining non-claims

Gas probes, outsider-wallet authorization transactions, Direct Mode and a separate GenVM/static-lint run were not performed on this fresh address and are not claimed. The current runtime path does prove exact proposal storage, both semantic verdicts, deterministic rejection, deterministic activation and final state.
