# ReleaseLens — Current Runtime Evidence

Date: 2026-09-24

## Deployment

- Network: GenLayer Studionet (`61999`)
- Contract: `0xe82f184fe005Cc57aAd775C55b38D33885e672C9`
- Deploy transaction: `0xf692863892d1c7e1f30c3263c4f6a6a3dded59f7564cdd06ef9b3280a8d554e6`
- Maintainer/deployer: `0x3065E31B1D993d7C0D59E6786844cBa56780B2d3`
- Explorer: https://explorer-studio.genlayer.com/address/0xe82f184fe005Cc57aAd775C55b38D33885e672C9
- Frozen packaged source SHA-256: `208bdf4fac0e4a18c953942db3a0248b4f091b0b6d98064babdee0a919e0c976`
- Explorer lifecycle: `FINALIZED`
- GenVM execution: `SUCCESS`

The deployment was created from the frozen repaired file in this package. Explorer shows the deployment input source and resulting contract address. A separate RPC download-and-rehash of the deployed source was not performed; `SOURCE_SHA256.txt` records that limitation explicitly.

## Runtime sequence

### N1 — legitimate verdict word remains proposal identity

- Method: `propose_change`
- Exact parameter:

```text
The API returns invoice totals as integer cents. It accepts a valid invoice identifier and returns an error for unknown identifiers. The team labels this NON_BREAKING because this sentence only clarifies that integer cents contain no currency symbol.
```

- Full transaction: `0x45549c574e44f799b249dfa1083fa33c9038d46c8a547e33dbc02efb0f669d29`
- Explorer: https://explorer-studio.genlayer.com/tx/0x45549c574e44f799b249dfa1083fa33c9038d46c8a547e33dbc02efb0f669d29
- Equivalence output: `NON_BREAKING`
- Consensus/execution: `Accepted` / `SUCCESS`
- Post-state: version `1.0`; exact proposal pending as `NON_BREAKING`
- Status: `PASS`

### N2 — invalid NON_BREAKING major bump rolls back

- Method: `activate_pending(2, 0)`
- Full transaction: `0x3efb902dce45603f64c00afdd8736775a901276ec89b2573a294034134955d4b`
- Explorer: https://explorer-studio.genlayer.com/tx/0x3efb902dce45603f64c00afdd8736775a901276ec89b2573a294034134955d4b
- Execution result: `ERROR` / rollback `Non-breaking change must keep major version`
- Post-state: version `1.0`; the exact N1 proposal remained pending and unchanged
- Status: `PASS`

### N3 — valid NON_BREAKING activation

- Method: `activate_pending(1, 1)`
- Full transaction: `0x52f649833bcf0ece32e7f52b0a910c9a929726ac26023712d5e1eebe5c86db5a`
- Explorer: https://explorer-studio.genlayer.com/tx/0x52f649833bcf0ece32e7f52b0a910c9a929726ac26023712d5e1eebe5c86db5a
- Consensus/execution: `Accepted` / `SUCCESS`
- Lifecycle: `FINALIZED`
- Post-state: version `1.1`; N1 text active; no pending proposal
- Status: `PASS`

### B1 — BREAKING word remains proposal identity

- Method: `propose_change`
- Exact parameter:

```text
The API returns invoice totals as decimal currency units instead of integer cents. Existing consumers must update their parsing and arithmetic. The team labels this a BREAKING migration.
```

- Full transaction: `0xa9803c0fd7695f12ada807b021283fd56d67d5835f2d7e6fb2bc629ee315e34d`
- Explorer: https://explorer-studio.genlayer.com/tx/0xa9803c0fd7695f12ada807b021283fd56d67d5835f2d7e6fb2bc629ee315e34d
- Equivalence output: `BREAKING`
- Explorer lifecycle: `FINALIZED`
- GenVM execution/result code: `SUCCESS` / `Return`
- Post-state: exact proposal pending as `BREAKING`
- Status: `PASS`

### B2 — valid BREAKING activation

- Method: `activate_pending(2, 0)`
- Full transaction: `0xb1362860a3deb6ff5f515335e6d1e62ea4397b99493a3c48f90ffd50f5192063`
- Explorer: https://explorer-studio.genlayer.com/tx/0xb1362860a3deb6ff5f515335e6d1e62ea4397b99493a3c48f90ffd50f5192063
- Consensus/execution: `Accepted` / `SUCCESS`
- Lifecycle: `FINALIZED`
- Final authoritative read: `active_version=2.0`, `last_classification=BREAKING`, `has_pending=NO`, empty pending classification, and the exact B1 text is active
- Status: `PASS`

## Validation summary

- Fresh deploy and Explorer address: `PASS`
- Natural `NON_BREAKING` consensus: `PASS`
- Invalid version transition rollback with unchanged pending state: `PASS`
- Valid `NON_BREAKING` activation: `PASS`
- Natural `BREAKING` consensus: `PASS`
- Valid `BREAKING` activation and finalized `2.0` post-state: `PASS`
- Local deterministic suite: `13/13 PASS`
- TypeScript check and Vite production build: `PASS`

Selected Studio and Explorer screenshots are indexed in `snapshots/README.md`. Older deployment evidence remains under `history/` and is not used to claim current-address execution.
