# chris-ahrens.com

## glorp

Personal site built with [Astro](https://astro.build) and deployed to [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) (static assets + server routes).

Pages are prerendered to static HTML at build time. Anything that needs a server (APIs, logins, downloads) opts in with `export const prerender = false`.

## Layout

| Path | What it is |
| --- | --- |
| `src/pages/` | Routes. `index.astro` is the home page; `api/` holds server endpoints. |
| `src/components/` | The header and each Dimension "article" (Intro, Work, About, ...). |
| `src/layouts/Base.astro` | Shared `<head>`, background and template scripts. |
| `src/sass/` | Template SCSS sources (reference only; `public/assets/css/main.css` is the compiled output). |
| `public/` | Served as-is: template CSS/JS/fonts and images. |
| `migrations/` | D1 (SQLite) schema migrations. |
| `wrangler.jsonc` | Cloudflare config: bindings, custom domain. |

## Local development

Requires Node 22.22+.

```sh
npm install
npm run db:migrate:local   # create the local D1 database
npm run dev                # http://localhost:4321
```

`npm run dev` runs in Cloudflare's `workerd` runtime, so D1 and other bindings work locally.

## Deploying

### One-time setup

1. Sign in to the Cloudflare dashboard. Go to **Workers & Pages → Create → Import a repository** and pick this GitHub repo.
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
2. Pushes to the production branch now build and deploy automatically. Other branches get preview URLs.
3. The D1 database (and the `SESSION` KV namespace Astro uses for sessions) are created automatically on the first deploy. Then apply the schema:
   ```sh
   npx wrangler login
   npm run db:migrate:remote
   ```
4. The `routes` entry in `wrangler.jsonc` attaches `chris-ahrens.com` as a custom domain. The domain's DNS must be on Cloudflare. If it's still pointed at GitHub Pages, move the nameservers to Cloudflare first, then turn off GitHub Pages in the repo settings.

### Reading contact messages

```sh
npx wrangler d1 execute DB --remote --command "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 20"
```
