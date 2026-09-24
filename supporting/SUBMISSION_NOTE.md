# ReleaseLens — Submission Note

## Title

**ReleaseLens — See Compatibility Before You Version It**

## Resubmission note

ReleaseLens now separates prompt-safety handling from proposal identity. Cache keys and pending commitments hash the exact cleaned active/proposed specifications stored by the contract; internal whitespace and legitimate `BREAKING`/`NON_BREAKING` vocabulary remain identity-significant. Prompt delimiters and the JSON output-envelope key are filtered only at the validator-call boundary. Regression tests prove verdict-word and whitespace variants cannot share cached verdicts or satisfy another proposal's commitment.

The repaired source was freshly deployed and exercised end to end. Studionet finalized both semantic branches, rejected an invalid NON_BREAKING major bump without changing pending state, accepted valid `1.1` and `2.0` activations, and finished at version `2.0`, `last_classification=BREAKING`, with no pending proposal.

## Release fields

- Contract: `0xe82f184fe005Cc57aAd775C55b38D33885e672C9`
- Deploy tx: `0xf692863892d1c7e1f30c3263c4f6a6a3dded59f7564cdd06ef9b3280a8d554e6`
- Maintainer: `0x3065E31B1D993d7C0D59E6786844cBa56780B2d3`
- Live DApp: https://release-lens.vercel.app
- Explorer: https://explorer-studio.genlayer.com/address/0xe82f184fe005Cc57aAd775C55b38D33885e672C9
- Contract source SHA-256: `208bdf4fac0e4a18c953942db3a0248b4f091b0b6d98064babdee0a919e0c976`
- Runtime evidence: `RUNTIME_EVIDENCE.md`

Gas probes, outsider-wallet transactions, Direct Mode and a separate GenVM/static-lint run are not claimed.
