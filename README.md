# ReleaseLens

![ReleaseLens logo](assets/ReleaseLens_Logo.png)

ReleaseLens is a Vercel-ready GenLayer DApp for semantic compatibility review and deterministic semantic-version enforcement. The packaged contract source is `contracts/ReleaseLens.py`; its deployed Python class is `SemVerGuard`.

## Current deployment

- Network: GenLayer Studionet (`61999`)
- RPC: `https://studio.genlayer.com/api`
- Contract: `0xe82f184fe005Cc57aAd775C55b38D33885e672C9`
- Deploy transaction: `0xf692863892d1c7e1f30c3263c4f6a6a3dded59f7564cdd06ef9b3280a8d554e6`
- Maintainer: `0x3065E31B1D993d7C0D59E6786844cBa56780B2d3`
- Contract source SHA-256: `208bdf4fac0e4a18c953942db3a0248b4f091b0b6d98064babdee0a919e0c976`
- Live DApp: https://release-lens.vercel.app
- Explorer: https://explorer-studio.genlayer.com/address/0xe82f184fe005Cc57aAd775C55b38D33885e672C9

The finalized runtime path covered both semantic branches and a rejected version transition. The final authoritative read is active version `2.0`, last classification `BREAKING`, with no pending proposal.

## Security and identity model

Proposal identity is derived from the exact cleaned active and proposed strings stored by the contract. Internal whitespace and legitimate words such as `BREAKING` and `NON_BREAKING` therefore remain identity-significant and cannot share a cached verdict. Prompt-safety filtering is applied only at the model-call boundary; it strips prompt delimiters and the JSON output-envelope key without changing stored proposal identity.

## Product flow

1. `Overview` reads the latest finalized contract state.
2. `Compare` lets the immutable maintainer submit a behavioral specification through `propose_change`.
3. `Pending` displays the exact hash-bound proposal and validator classification.
4. `Activate` calls `activate_pending(new_major, new_minor)` and enforces the deterministic SemVer rule.
5. `Proof` exposes the address, deploy transaction, maintainer and Explorer link.

The UI reports success only after a finalized receipt with a successful transaction or authoritative leader execution result. If the client polling window expires, it preserves the submitted transaction and directs the operator to Explorer instead of encouraging a duplicate write.

## Local development

Requirements: Node.js 20+, npm and Python 3.

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
python3 -m py_compile contracts/ReleaseLens.py supporting/tests/test_releaselens_v1_1.py
```

## Vercel deployment

Import the repository into Vercel. The included Vite configuration and `vercel.json` require no framework override.

Set these variables for Production, Preview and Development:

```text
VITE_CONTRACT_ADDRESS=0xe82f184fe005Cc57aAd775C55b38D33885e672C9
VITE_DEPLOY_TX=0xf692863892d1c7e1f30c3263c4f6a6a3dded59f7564cdd06ef9b3280a8d554e6
```

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

## Evidence files

- `TESTING.md` — exact current-deployment test matrix and reviewer path.
- `supporting/RUNTIME_EVIDENCE.md` — finalized transaction hashes, parameters and post-state.
- `supporting/STEWARD_FIX_EVIDENCE.md` — exact-text identity regression proof.
- `supporting/SOURCE_SHA256.txt` and `supporting/FINAL_CHECKSUMS.txt` — source and package integrity.

The contract remains single-maintainer. Only the deployment wallet may propose or activate changes, and a classified pending proposal cannot be cancelled.
