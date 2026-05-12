# Public GitHub Status

Date: 2026-05-12

## Final Repository

- Repo: `Lutren/medioevo-duat-public-release`
- Remote URL: `https://github.com/Lutren/medioevo-duat-public-release.git`
- GitHub URL: `https://github.com/Lutren/medioevo-duat-public-release`
- Branch: `main`
- Base commit before P3 report commit: `42cbb21`

The exact commit published by the final P3 push is the repository `main` HEAD after this report commit. The operator final response records the short hash verified after push.

## Pre-Push QA

- `npm test`: PASS, 2 files, 15 tests.
- `npm run build`: PASS, Vite 8.0.12, output in `dist/`.
- `npm audit --audit-level=moderate`: PASS, 0 vulnerabilities.
- `python tools/release/scan_secrets.py --path=<public-release>`: PASS, 0 findings.
- Blocked filename scan: PASS, 0 blocked names.
- Publishable tree size: 9.08 MB.
- Files larger than 25 MB: 0.
- Files larger than 100 MB: 0.

## Public Routes

Verified over local Vite server:

- `/` -> HTTP 200
- `/duat` -> HTTP 200
- `/telecom` -> HTTP 200
- `/handoff-hub` -> HTTP 200
- `/duat-devday` -> HTTP 200
- `/docs` -> HTTP 200

## Secret / Privacy Scan

No real findings.

Checked:

- no `.env`
- no private key files
- no raw archives
- no private canon markers
- no internal-only markers outside policy text
- no source vault directory
- no provider-token marker hits outside policy text

## Push Result

Status: PUBLISHED_TO_GITHUB after final P3 push command succeeds.

No deploy was executed.
