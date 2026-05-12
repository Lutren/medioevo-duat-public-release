# Handoff P6 Public Maintenance

Fingerprint: `MDV-PUBLISH-P6-READY-FROM-P5`

## Current Public State

- Canonical URL: `https://medioevo.space`
- Secondary URL: `https://www.medioevo.space`
- GitHub repo: `https://github.com/Lutren/medioevo-duat-public-release`
- Cloudflare Pages project: `medioevo-site`
- Latest P5 deploy URL: `https://de922a65.medioevo-site.pages.dev`
- Latest deployed source commit: `cc5df25f073ed83bd9db4eaa5c46d3bb5839ecd4`
- Planned release tag: `v0.1.0-public`

## Verified In P5

- HTTPS works on apex, `www`, Pages alias and deployment URL.
- Required routes return HTTP 200 on direct reload.
- Apex and `www` both serve the site; no redirect rule was changed.
- Public metadata and social preview tags are present.
- Tests, build, audit and secret scan passed.
- No DNS records were changed.
- No social network was posted to automatically.

## Recommended P6

1. Monitor uptime and route status lightly.
2. Decide whether `www` should redirect to apex.
3. Verify OpenGraph rendering in target social platforms.
4. Add issue templates for public bug reports and docs requests.
5. Add a minimal public roadmap.
6. Keep future changes behind the same public/private boundary.

## Do Not Do In P6 Without Separate Approval

- Do not publish private canon.
- Do not include source vaults, internal ZIPs, logs or credentials.
- Do not change DNS destructively.
- Do not publish to social channels automatically.
- Do not make strong AGI, scientific, medical, financial, electoral or government-production claims.
