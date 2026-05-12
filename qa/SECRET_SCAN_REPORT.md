# Secret Scan Report

Date: 2026-05-12

## Result

Status: PASS

## Evidence

- Workspace scanner: `python tools/release/scan_secrets.py --path=<public-release>` -> `reported findings: 0`
- Blocked filename scan -> `blocked_name_count=0`
- Dependency audit: `npm audit --audit-level=moderate` -> `found 0 vulnerabilities`

## Notes

- An earlier pass flagged mock MessageBus text as secret-like wording. The mock data was rewritten to avoid credential-like markers and the final scanner pass returned 0.
- No `.env`, `.pem`, `.key`, `id_rsa`, `id_ed25519`, `credentials.json`, `service-account.json`, `secrets.*`, `tokens.*` or `private.*` files are included.
- `node_modules/`, `dist/` and `.git/` are excluded from source publication.
