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
- `get_summary`: PASS — `active_version=1.0`, expected initial specification, no pending proposal.
- `get_pending`: PASS — `has_pending=False`.

## DApp validation

- TypeScript check: PASS
- Vite production build: PASS
- Local deterministic contract suite: PASS — 11/11
- Maintainer write through the ReleaseLens browser UI: `NOT RUN`
- Fresh natural semantic consensus on this address: `NOT RUN`

The historical full runtime suite from the byte-identical earlier deployment is retained in `history/SemVerGuard_v1.1_RUNTIME_EVIDENCE.md`. It supports contract behavior review but is not presented as transaction evidence for the current address.
