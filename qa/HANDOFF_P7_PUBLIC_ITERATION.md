# Handoff P7 Public Iteration

Fingerprint: `MDV-PUBLISH-P7-READY-FROM-P6`

## Current Public State

- Canonical URL: `https://medioevo.space`
- Repo: `https://github.com/Lutren/medioevo-duat-public-release`
- Release: `v0.1.0-public`
- P6 objective: minimum public maintenance surface

## P6 Scope

P6 adds public maintenance templates, public security scope, public roadmap, changelog, maintenance guide, monitoring checklist, social publication manual and GitHub maintenance status.

## Recommended P7

- Public iteration planning.
- Review incoming GitHub issues.
- Improve public docs only when there is feedback or a small clear gap.
- Create public screenshots if authorized.
- Prepare a manual social post if the operator approves.
- Keep roadmap conservative and evidence-based.

## Do Not Do In P7 Without Separate Approval

- Do not publish private canon.
- Do not touch DNS.
- Do not change Cloudflare project configuration.
- Do not publish to social networks automatically.
- Do not upload internal ZIPs.
- Do not publish local logs, credentials, or source vaults.
- Do not make externally validated AGI, government-production, medical, financial, or scientific claims without evidence.

## Suggested First Check

```bash
git status
npm test
npm run build
npm audit --audit-level=moderate
```

Run the focused secret scan before any release, tag, deploy or public announcement.
