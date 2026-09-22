# Supporting files

The submission root is kept intentionally small. These files provide audit, runtime and maintenance evidence:

- `RUNTIME_EVIDENCE.md` — current Studionet deployment, live reads and validation status.
- `SOURCE_SHA256.txt` and `FINAL_CHECKSUMS.txt` — source parity and package integrity.
- `LOCKED_SPEC.md` and `BLIND_RUNTIME_PROTOCOL.md` — frozen requirements and execution protocol.
- `SECURITY.md` and `CHANGELOG.md` — security notes and release history.
- `SUBMISSION_NOTE.md` — concise release metadata.
- `tests/` — local deterministic unit suite.
- `snapshots/` — optional runtime screenshots, if a submission portal requires them.
- `history/` — evidence from the byte-identical earlier deployment, kept separate from the current address.

None of these files changes the deployed contract logic in `../ReleaseLens.py`.
