# Public GitHub Status

Date: 2026-05-12

## Final Repository

- Repo: `Lutren/medioevo-duat-public-release`
- Remote URL: `https://github.com/Lutren/medioevo-duat-public-release.git`
- GitHub URL: `https://github.com/Lutren/medioevo-duat-public-release`
- Branch: `main`
- Base commit before P3 report commit: `42cbb21`
- P3 publication commit verified on remote `main`: `a2611594455b2857d219485a31afc3bf28a49edb`

This file is the post-push status artifact. If committed after the first publication push, the operator final response records the final repository `main` HEAD verified after the report update.

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

- Command executed: `git push -u origin main`
- Result: PASS.
- Remote branch: `origin/main`.
- Verified remote HEAD after first P3 publication push: `a2611594455b2857d219485a31afc3bf28a49edb`.
- GitHub repo visibility: PUBLIC.
- GitHub default branch: `main`.
- Status: PUBLISHED_TO_GITHUB.

No deploy was executed.
