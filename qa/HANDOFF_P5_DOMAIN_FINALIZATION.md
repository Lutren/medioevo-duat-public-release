# Handoff P5 Domain Finalization

Fingerprint: `MDV-PUBLISH-P5-READY-FROM-P4`

## Current State

- GitHub repo: `https://github.com/Lutren/medioevo-duat-public-release`
- Branch: `main`
- Source commit deployed: `269df962bcbdd1537cf27435ab29e9635155cf17`
- Cloudflare Pages project: `medioevo-site`
- Deployment id: `dcc1df2c-d49b-40cd-b258-37a378a501f8`
- Deployment URL: `https://dcc1df2c.medioevo-site.pages.dev`
- Production alias: `https://medioevo-site.pages.dev`
- Custom domain: `https://medioevo.space`
- WWW domain: `https://www.medioevo.space`

## P4 Evidence

- `npm install`: PASS.
- `npm test`: PASS, 15 tests.
- `npm run build`: PASS.
- `npm audit --audit-level=moderate`: PASS, 0 vulnerabilities.
- Secret scan: PASS, 0 findings.
- Blocked tracked filenames: 0.
- Deploy: PASS on Cloudflare Pages.
- Required routes: HTTP 200 on deployment URL, Pages alias, apex domain and WWW domain.
- DNS mutations: none.

## P5 Tasks

1. Verify current GitHub `main` HEAD and Cloudflare Pages latest deployment.
2. Verify SSL status for `medioevo.space` and `www.medioevo.space`.
3. Verify canonical route preference: apex, www redirect or both live.
4. Check OpenGraph/social card rendering from the live domain.
5. Create a release tag if approved.
6. Prepare public social copy for the DUAT/MEDIOEVO release.
7. Keep private canon, source vaults, credentials and unpublished research excluded.

## Blocks Remaining

- No destructive DNS change is authorized by P4.
- Release tag and social publication require explicit operator approval.
- Do not touch private canon.
