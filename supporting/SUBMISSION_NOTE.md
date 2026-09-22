# ReleaseLens — Submission Note

## Title

**ReleaseLens — See Compatibility Before You Version It**

## Submission note

ReleaseLens is a Vercel-ready interface for a single-maintainer GenLayer Intelligent Contract that classifies behavioral specification changes as `BREAKING` or `NON_BREAKING`, then deterministically restricts the valid version transition. A breaking proposal requires a higher major version starting at minor 0; a non-breaking proposal must retain the major version and increase the minor version. Validators see only the canonical active/proposed specification pair, never the proposed version. The original pending text is stored, its canonical pair hash is verified again during activation, and malformed semantic output aborts without creating or caching a verdict.

## Release fields

- Contract: `0xd18756fa5bD6003c2a960DF1106a6599F0011064`
- Deploy tx: `0x9661d03e732fbe10c27fb24c100a313af479a98f091e03efb99c5e14a8f89873`
- Explorer: https://explorer-studio.genlayer.com/address/0xd18756fa5bD6003c2a960DF1106a6599F0011064
- GitHub: `PENDING — create/import the ReleaseLens repository before Vercel deployment`
- Normalized source SHA-256: see `SOURCE_SHA256.txt`
- Runtime evidence: deployment/read/build checks `PASS`; DApp maintainer write smoke test `NOT RUN`; see `RUNTIME_EVIDENCE.md`

Gas probes, real Direct Mode and GenVM/static lint remain explicitly `NOT RUN` and are not claimed.
