# SemVerGuard v1.1 — Locked Specification

The following invariants are load-bearing and must not be weakened silently.

1. `BREAKING` permits activation only when `new_major > current_major` and `new_minor == 0`.
2. `NON_BREAKING` permits activation only when `new_major == current_major` and `new_minor > current_minor`.
3. The model never receives or selects the proposed version number.
4. `activate_pending(new_major, new_minor)` accepts no specification parameter and activates the stored `pending_spec` only.
5. The proposal hash uses length prefixes for the exact cleaned active and proposed strings before hashing.
6. Prompt-safety filtering is used only inside semantic classification. It never changes cache identity or the pending commitment.
7. Legitimate `BREAKING` and `NON_BREAKING` words remain in the specification shown to validators; delimiter and output-envelope defenses do not rewrite that vocabulary.
8. Malformed, non-object or out-of-schema semantic output raises `Invalid semantic output` before cache or pending-state writes.
9. `pending_hash` is recomputed from the exact stored active/pending strings and verified before activation writes.
10. A pending proposal cannot be cancelled, withdrawn, replaced or timed out. A valid activation is the only path that clears it.
11. The previous rule is the anti-grinding mechanism; do not add cancellation without a separately reviewed bound on real model evaluations.
12. Only the immutable deployment maintainer can call write methods.
13. `MIN_SPEC_LENGTH = 20` and `MAX_SPEC_LENGTH = 4000` remain enforced.
14. Infrastructure failures from `exec_prompt` propagate; do not convert them into a semantic verdict.
15. Any production contract byte change requires a new version, SHA, deployment, runtime proof and source-parity proof.
