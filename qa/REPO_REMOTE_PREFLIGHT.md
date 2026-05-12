# Repo Remote Preflight

Date: 2026-05-12

## Current Git State

- Branch: `main`
- Initial P2 HEAD: `eced76c`
- Remote: none configured
- Working tree before P2 commit: contains only public release P2 changes.

## Candidate Repositories

1. `Lutren/medioevo-duat-public-release`
2. `Lutren/medioevo-space`
3. Another repository to confirm by operator

## Sensitive Staging Rule

Before any push:

```bash
git status --short
git diff --cached --stat
git diff --cached --name-only
```

Stop if staged files include `.env`, private keys, raw archives, `SOURCE_VAULT`, `SECURITY_REVIEW`, `PRIVATE`, `DO_NOT_PUBLISH`, `INTERNAL_ONLY`, raw prompt packs or private canon.

## Suggested Commands

Do not run until the operator confirms the final repository.

```bash
git remote add origin https://github.com/Lutren/medioevo-duat-public-release.git
git push -u origin main
```

Alternative if the operator chooses `medioevo-space`:

```bash
git remote add origin https://github.com/Lutren/medioevo-space.git
git push -u origin main
```

No remote was added and no push was executed.
