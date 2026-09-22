# ReleaseLens

ReleaseLens is a Vercel-ready GenLayer DApp for semantic compatibility review and deterministic semantic-version enforcement.

The project name and contract source filename are both `ReleaseLens`. The deployed Python class remains `SemVerGuard` because the current Studionet deployment was created from those exact frozen source bytes; renaming the class would produce a different contract source and require another deployment.

## Current deployment

- Network: GenLayer Studionet
- Chain ID: `61999`
- RPC: `https://studio.genlayer.com/api`
- Contract: `0xd18756fa5bD6003c2a960DF1106a6599F0011064`
- Deploy transaction: `0x9661d03e732fbe10c27fb24c100a313af479a98f091e03efb99c5e14a8f89873`
- Maintainer: `0x3065E31B1D993d7C0D59E6786844cBa56780B2d3`
- Explorer: https://explorer-studio.genlayer.com/address/0xd18756fa5bD6003c2a960DF1106a6599F0011064

Live reads confirmed the deployment exposes `get_config`, `get_summary` and `get_pending`. The current finalized state is active version `1.1`, last classification `NON_BREAKING`, with no pending proposal.

## Product flow

1. `Overview` reads the latest finalized contract state.
2. `Compare` lets the immutable maintainer submit a behavioral specification through `propose_change`.
3. `Pending` displays the hash-bound proposal and validator classification.
4. `Activate` calls `activate_pending(new_major, new_minor)` and explains the deterministic SemVer rule.
5. `Proof` exposes the address, deploy transaction, maintainer and Explorer link.

The UI never treats `ACCEPTED` or `FINALIZED` alone as execution success. A write is shown as successful only when its receipt is finalized and its execution result is `FINISHED_WITH_RETURN`. Polling continues for up to 30 minutes; if that client-side window expires, the UI keeps the transaction in a submitted state, tells the operator not to resubmit, and links to Explorer for authoritative verification.

## Local development

Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Production validation:

```bash
npm run typecheck
npm run build
python3 -m unittest discover -s supporting/tests -v
python3 -m py_compile ReleaseLens.py supporting/tests/test_releaselens_v1_1.py
```

## Vercel deployment

Import the repository into Vercel. The included Vite configuration and `vercel.json` require no framework override.

Set these environment variables for Production, Preview and Development:

```text
VITE_CONTRACT_ADDRESS=0xd18756fa5bD6003c2a960DF1106a6599F0011064
VITE_DEPLOY_TX=0x9661d03e732fbe10c27fb24c100a313af479a98f091e03efb99c5e14a8f89873
```

Vercel settings if entered manually:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

## Contract files

- `ReleaseLens.py` — exact Intelligent Contract source used by the DApp.
- `TESTING.md` — contract/runtime test plan.
- `supporting/` — evidence, security notes, checksums and local unit tests.

The contract remains single-maintainer. Only the deployment wallet may propose or activate changes, and a classified pending proposal cannot be cancelled.
