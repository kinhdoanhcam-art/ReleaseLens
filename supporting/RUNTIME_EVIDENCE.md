# ReleaseLens — Current Runtime Evidence

## Deployment

- Network: Studionet 61999
- Contract: `0xd18756fa5bD6003c2a960DF1106a6599F0011064`
- Deploy transaction: `0x9661d03e732fbe10c27fb24c100a313af479a98f091e03efb99c5e14a8f89873`
- Maintainer: `0x3065E31B1D993d7C0D59E6786844cBa56780B2d3`
- Consensus status: `FINALIZED`
- GenVM result shown by Studio/Explorer: `SUCCESS`
- Source SHA-256: `bcb38cc46512ead09f762368070f7c2389c1f80aa8dfb4b74549f3a9e56996ad`

## Finalized read smoke test

Checked through `genlayer-js@1.1.8` against the current address:

- `get_config`: PASS — contract v1.1, immutable maintainer, no pending cancellation.
- `get_summary`: PASS — `active_version=1.0`, expected initial specification, `last_classification=NON_BREAKING`, and a pending proposal.
- `get_pending`: PASS — `has_pending=True`, `classification=NON_BREAKING`, with the exact wording-only proposal shown below.

## Current-address maintainer proposal

- Method: `propose_change`
- Exact parameter:

```text
A task identifier together with a valid ISO 8601 UTC timestamp is accepted by the scheduler. Every valid task is queued to execute once, no earlier than that timestamp. The scheduler rejects an invalid timestamp with an error.
```

- Explorer lifecycle: `FINALIZED`
- GenVM execution result: `SUCCESS`
- Equivalence output: `NON_BREAKING`
- Finalized post-state: version `1.0`, `has_pending=True`, `pending_classification=NON_BREAKING`
- Full transaction hash: `EVIDENCE INCOMPLETE — copy the full hash from Explorer before final submission`
- Evidence status: `INCOMPLETE` — execution and postcondition are verified, but the full hash has not yet been recorded.

## DApp validation

- TypeScript check: PASS
- Vite production build: PASS
- Local deterministic contract suite: PASS — 11/11
- Maintainer write through the ReleaseLens browser UI: `INCOMPLETE` — execution and postcondition verified; full-hash evidence remains incomplete.
- Fresh natural semantic consensus on this address: `INCOMPLETE` — `NON_BREAKING` verified; full-hash evidence remains incomplete.
- Long-finalization UI handling: `PASS` — production build now preserves a submitted state instead of reporting a false transaction failure after a polling timeout.

The historical full runtime suite from the byte-identical earlier deployment is retained in `history/SemVerGuard_v1.1_RUNTIME_EVIDENCE.md`. It supports contract behavior review but is not presented as transaction evidence for the current address.
