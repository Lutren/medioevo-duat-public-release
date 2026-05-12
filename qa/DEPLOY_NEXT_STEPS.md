# Deploy Next Steps

Date: 2026-05-12

## Deploy Status

No deploy was executed in P3.

## Candidate Platforms

- Cloudflare Pages
- GitHub Pages
- Vercel
- Netlify
- Replit Deployments

## Recommendation

If the operator confirms that `medioevo.space` should continue through the historical Cloudflare Pages lane, prefer Cloudflare Pages for P4.

If that binding is not confirmed, keep the deploy neutral and connect the static Vite build through the platform selected by the operator.

## Static Build

- Build command: `npm run build`
- Output directory: `dist`
- Runtime environment variables: none required for the current static public release.

## Domain

- Domain: `medioevo.space`
- Status: pending authorization and DNS/platform verification.

## Suggested Commands

Cloudflare Pages candidate, only after P4 authorization:

```bash
npm run build
npx wrangler pages deploy dist --project-name medioevo-site --branch main
```

GitHub Pages candidate:

```bash
npm run build
```

Then configure Pages from the confirmed repository workflow.

Vercel candidate:

```bash
npm run build
vercel --prod
```

Netlify candidate:

```bash
npm run build
netlify deploy --prod --dir=dist
```

No command above was executed in P3.
