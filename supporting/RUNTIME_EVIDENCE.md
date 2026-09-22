# ReleaseLens — Current Runtime Evidence

## Deployment

- Network: Studionet 61999
- Contract: `0xd18756fa5bD6003c2a960DF1106a6599F0011064`
- Deploy transaction: `0x9661d03e732fbe10c27fb24c100a313af479a98f091e03efb99c5e14a8f89873`
- Maintainer: `0x3065E31B1D993d7C0D59E6786844cBa56780B2d3`
- Consensus status: `FINALIZED`
- GenVM result shown by Studio/Explorer: `SUCCESS`
- Source SHA-256: `bcb38cc46512ead09f762368070f7c2389c1f80aa8dfb4b74549f3a9e56996ad`

## Finalized read smoke test after proposal, before activation

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
- Full transaction hash: `0x85d4b13c0ea984d52e73963785d569bd545d7df8741204ee920b17fe45ed1a0b`
- Consensus result: `Accepted`
- Result code: `Return`
- Proposal evidence status: `PASS`

## Current-address activation

- Method: `activate_pending(1, 1)`
- Full transaction hash: `0x5d727efcfef7ad3ad839bec1f05e1e84ec4b4a922b9ae769a85ef70e769ac749`
- Explorer lifecycle: `FINALIZED`
- Consensus result: `Accepted`
- GenVM execution result: `SUCCESS`
- Result code: `Return`
- Finalized post-state: version `1.1`, `has_pending=False`, `last_classification=NON_BREAKING`, and the proposal text is now active.
- Evidence status: `PASS`

## DApp validation

- TypeScript check: PASS
- Vite production build: PASS
- Local deterministic contract suite: PASS — 11/11
- Maintainer write through the ReleaseLens browser UI: `PASS` — full hash, successful leader execution and finalized postcondition verified.
- Fresh natural semantic consensus on this address: `PASS` — `NON_BREAKING`, with full transaction evidence.
- Deterministic NON_BREAKING activation on this address: `PASS` — full hash, successful leader execution and finalized postcondition verified.
- Long-finalization UI handling: `PASS` — production build now preserves a submitted state instead of reporting a false transaction failure after a polling timeout.

The historical full runtime suite from the byte-identical earlier deployment is retained in `history/SemVerGuard_v1.1_RUNTIME_EVIDENCE.md`. It supports contract behavior review but is not presented as transaction evidence for the current address.
