# Deploy Preflight

Date: 2026-05-12

## Current Release Evidence

- Framework: Vite / React.
- Build command: `npm run build`.
- Build output: `dist/`.
- Local build: PASS.
- Local route smoke: PASS.

## Config Files Detected In Release Tree

- `package.json`
- `vite.config.ts`

Not detected in this release tree:

- `wrangler.toml`
- `wrangler.json`
- `wrangler.jsonc`
- `vercel.json`
- `netlify.toml`

## Candidate Platforms

### Cloudflare Pages / Wrangler

Evidence: historical MEDIOEVO site operations have used Cloudflare Pages, but this release tree has no Wrangler config.

Suggested command only after operator confirmation and authenticated session verification:

```bash
npm run build
npx wrangler pages deploy dist --project-name medioevo-site --branch main
```

### GitHub Pages

Evidence: compatible with static Vite `dist/`, but repository target is not confirmed.

Suggested path:

```bash
npm run build
```

Then configure GitHub Pages to publish the static build from the confirmed repository workflow.

### Vercel

Evidence: no `vercel.json`; Vite defaults are compatible.

Suggested command only after session/token confirmation:

```bash
npm run build
vercel --prod
```

### Netlify

Evidence: no `netlify.toml`; Vite `dist/` is compatible.

Suggested command only after session/token confirmation:

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Replit Deployments

Evidence: no Replit deploy config in this release tree.

Suggested action: use only an existing configured Replit deployment after verifying no secrets are copied.

## Recommendation

Use Cloudflare Pages only if the operator confirms that `medioevo.space` is still bound to the Cloudflare Pages project for this release. Otherwise, use GitHub Pages or another confirmed platform with `dist/` as the deploy output.

No deploy was executed.
