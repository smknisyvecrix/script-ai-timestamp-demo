# GitHub + Cloudflare Pages Deployment

This project is a React + Vite single page app. The deployment target is Cloudflare Pages connected to a GitHub repository.

## Build Settings

- Framework preset: `Vite`
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm build`
- Build output directory: `dist`
- Node version: `22.12.0` or newer

Cloudflare Pages will copy `public/_redirects` into `dist/_redirects`, which makes deep links such as `/platform` and `/app/scripts` serve `index.html`.

## Environment Variables

The app can run without Supabase. In that mode, trial accounts are stored in the current browser localStorage and are useful for product demos.

Set these only if you want shared cloud trial-account data:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_USE_LOCAL_TRIAL_ACCOUNTS=false`

If you do not configure Supabase, set `VITE_USE_LOCAL_TRIAL_ACCOUNTS=true` in Cloudflare Pages to make the intended demo mode explicit.

## Optional Supabase Setup

1. Create a Supabase project.
2. Run the SQL files in `migrations/` in filename order.
3. Add the project URL and anon key to Cloudflare Pages environment variables.

The included policies allow anonymous CRUD for the `trial_accounts` demo table. Use only non-sensitive demo accounts, or replace the policy model before using real customer data.

## GitHub Repository Setup

1. Create an empty GitHub repository.
2. From this folder, run:

```bash
git init
git add .
git commit -m "Prepare Meoo demo for Cloudflare Pages"
git branch -M main
git remote add origin https://github.com/<OWNER>/<REPO>.git
git push -u origin main
```

## Cloudflare Pages Setup

1. Open Cloudflare dashboard.
2. Go to Workers & Pages, then create a Pages project.
3. Connect the GitHub repository.
4. Use the build settings above.
5. Add the environment variables you need.
6. Deploy.

## FreeDomain Binding

1. In Cloudflare Pages, open the deployed project.
2. Add your FreeDomain hostname as a custom domain.
3. Follow the DNS target Cloudflare shows.
4. In FreeDomain DNS, add the required CNAME record for a subdomain.
5. Wait for DNS and certificate provisioning to complete.

For an apex/root domain, follow Cloudflare's exact DNS guidance shown during custom domain setup. Many free-domain providers only support reliable CNAME setup for subdomains.
