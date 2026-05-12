# Security Policy

This repository is the public MEDIOEVO / DUAT release surface. It is curated from a larger private workspace and must stay limited to public website, public docs, and public static assets.

## In Scope

- Public website: `https://medioevo.space`
- Public repository: `https://github.com/Lutren/medioevo-duat-public-release`
- Public documentation and public static assets included in this repo

## Out of Scope

- Private canon and unpublished research vaults
- Local operator environment, local logs, local configs, and local paths
- Internal ZIPs, archives, backups, or source vaults
- Paid-source material, private game or TCG material, and private operational runtime
- Material marked `PRIVATE_CANON`, `INTERNAL_ONLY`, `99_SOURCE_VAULT`, `SECURITY_REVIEW`, `PRIVATE`, or `DO_NOT_PUBLISH`

## Never Publish

- `.env` or `.env.*`
- API keys, tokens, credentials, private keys, cookies, or service accounts
- GitHub tokens, cloud provider tokens, model provider API keys, or payment provider credentials
- Internal archives, private canon, unpublished research, or local runtime logs

## Reporting

Use GitHub issues only for non-sensitive public problems such as broken routes, documentation errors, or public asset issues.

Do not post secrets, exploit details with sensitive data, private canon, credentials, logs, local paths, or unpublished research in public issues.

For sensitive security concerns, contact the maintainer privately through an already verified channel before public disclosure. No public email address is asserted by this policy.

## Release Gate

Before any future public release:

- `npm test` must pass.
- `npm run build` must pass.
- `npm audit --audit-level=moderate` must pass.
- A focused secret scan must return 0 real findings.
- Any changed public route must be smoke-tested.
- Release notes must avoid unsupported claims and private material.
