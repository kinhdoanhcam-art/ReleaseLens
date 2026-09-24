# ReleaseLens steward fix evidence

Date: 2026-09-24

## Implemented repair

1. `propose_change` hashes the exact cleaned active and proposed strings stored by the contract.
2. `activate_pending` recomputes the commitment from the exact stored active and pending strings.
3. `_fence_strip` is confined to `_classify_change`; it preserves legitimate `BREAKING` and `NON_BREAKING` prose while neutralizing document delimiters and the `"decision"` output-envelope key.
4. The validator prompt explicitly treats verdict words inside either document as untrusted document content rather than an instruction or verdict.

## Executable regression result

Command:

```text
python3 -m unittest discover -s supporting/tests -v
```

Result: `13 tests`, `OK`.

The suite covers independent cache identities for verdict-word variants and internal-whitespace variants, plus rejection when stored pending text no longer matches the committed exact-text hash.

## Prompt-safety call boundary

Command:

```text
rg -n "_fence_strip" contracts/ReleaseLens.py
```

Measured result:

```text
74:    def _fence_strip(
140:        safe_current = self._fence_strip(
144:        safe_proposed = self._fence_strip(
```

## Exact-text hash measurements

All four values below were computed by the repaired production implementation:

| Variant | SHA3-256 proposal hash |
|---|---|
| `NON_BREAKING` wording | `7c8bd0b2c9004058beb0429ab0af5c523e829a64a92be7f3d9e97f9f78ec7476` |
| `BREAKING` wording | `4e87e578368478d87fec07bb3994096ef685122dffaf7bede93041c6431b2b19` |
| Double internal spaces | `fa8725ed5762a3a28126e2870f92357a7266f28fb2a78b83bb0031486cb5184b` |
| Single internal spaces | `d6e4abcfe6b44d869679403a651fbef5d865cf7e9a1354ca4812de0f6b488261` |

Measured assertions: `all four unique = true`, `verdict-word hashes differ = true`, and `whitespace hashes differ = true`.

## Source identity

Candidate contract SHA-256:

```text
208bdf4fac0e4a18c953942db3a0248b4f091b0b6d98064babdee0a919e0c976
```

Fresh deployment and runtime proof: `PASS`.

- Contract: `0xe82f184fe005Cc57aAd775C55b38D33885e672C9`
- Deploy transaction: `0xf692863892d1c7e1f30c3263c4f6a6a3dded59f7564cdd06ef9b3280a8d554e6`
- Natural semantic outputs: `NON_BREAKING` and `BREAKING`
- Invalid transition rollback: `PASS`, pending state preserved
- Valid activations: `1.1` then `2.0`
- Final authoritative state: `2.0`, `BREAKING`, no pending proposal

Full hashes, exact proposal text and post-state are in `RUNTIME_EVIDENCE.md`. The separate limitation on independent RPC source rehashing is recorded in `SOURCE_SHA256.txt`.
