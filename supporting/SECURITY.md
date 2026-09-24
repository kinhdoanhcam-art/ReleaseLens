# Security Notes

## Trust boundary

SemVerGuard governs declared behavioral text. It does not authenticate source repositories, deployments, organizations or real-world implementation conformance.

## Authorization

Each deployment has one immutable maintainer: its deployer. Contract checks, not UI state, enforce this role.

## Semantic failure policy

Only `BREAKING` and `NON_BREAKING` are valid outputs. Infrastructure errors and malformed outputs abort. They never become cached verdicts.

## Identity and prompt-safety separation

Cache keys and pending commitments bind the exact cleaned strings stored by the contract. Prompt-safety filtering is applied only when constructing the validator prompt. It neutralizes document delimiters and the output-envelope key, but preserves legitimate `BREAKING` and `NON_BREAKING` text as document content.

## Anti-grinding policy

Only one proposal may be pending. It cannot be cancelled or replaced; valid activation is required before another semantic evaluation can be requested.

## Reporting

Before public submission, add the actual repository security-contact process. Do not include private keys, wallet secrets or unpublished vulnerability details in public issues.
