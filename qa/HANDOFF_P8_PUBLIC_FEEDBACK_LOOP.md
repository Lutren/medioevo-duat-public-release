# Handoff P8 Public Feedback Loop

Fingerprint: `MDV-PUBLISH-P8-READY-FROM-P7`

## Current Public State

- Repo: `https://github.com/Lutren/medioevo-duat-public-release`
- URL: `https://medioevo.space`
- Release: `v0.1.0-public`
- P6 commit: `c9d80fe`
- P7 scope: public iteration review, route health, screenshots, social queue, docs review and untracked content audit.
- P7 status at handoff: blocked from commit/push by `npm test` timeout in the benchmark test. Final focused secret scan passed after concurrent Agent 3 cleanup.

## Recommended P8

- Wait for real public feedback.
- Review new GitHub issues.
- Respond manually only when the operator approves public wording.
- Integrate Agent 3 work only after its `src/content/*.ts`, route changes and docs are approved.
- Re-run the timed-out benchmark test before treating QA as green.
- Publish social manually only if the operator copies or approves a prepared post.
- Keep issue templates and maintenance docs aligned with any approved new route.

## Do Not Do Without Separate Approval

- Do not publish private canon.
- Do not delete untracked Agent 3 files.
- Do not activate Discussions or Wiki.
- Do not change DNS, redirects or Cloudflare settings.
- Do not create a new release tag.
- Do not publish social automatically.
- Do not add analytics or external services.

## First Commands

```bash
git status --short
gh issue list --repo Lutren/medioevo-duat-public-release --limit 50
npm test
npm run build
npm audit --audit-level=moderate
```

Run the focused secret scan before any future commit, deploy, release tag or public announcement.
