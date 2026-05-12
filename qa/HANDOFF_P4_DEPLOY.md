# Handoff P4 Deploy

Fingerprint: `MDV-PUBLISH-P4-READY-FROM-P3`

## Repo

- GitHub repo: `https://github.com/Lutren/medioevo-duat-public-release`
- Remote: `https://github.com/Lutren/medioevo-duat-public-release.git`
- Branch: `main`
- Published commit verified during P3: `a2611594455b2857d219485a31afc3bf28a49edb`.
- Start P4 by verifying the current `main` HEAD again, because this P3 report update may be followed by a final report-only commit.

## QA State From P3

- `npm test`: PASS, 15 passed.
- `npm run build`: PASS.
- `npm audit --audit-level=moderate`: PASS, 0 vulnerabilities.
- Secret scan: PASS, 0 findings.
- Required routes: HTTP 200 locally.
- Large files: no files over 25 MB.

## Recommended Platform

Cloudflare Pages if the operator confirms it is still the intended `medioevo.space` deployment lane.

Otherwise keep platform neutral and deploy the static Vite `dist/` output to the selected host.

## Remaining Blocks

- Domain/DNS not verified in P3.
- Deploy platform not authorized in P3.
- No external deploy should run until P4 gate passes.

## Next Action

Run P4 Deploy Gate:

1. Verify GitHub `main` HEAD.
2. Confirm deploy platform.
3. Confirm `medioevo.space` DNS/platform target.
4. Re-run secret scan, audit and build.
5. Deploy `dist/` only after explicit operator authorization.
