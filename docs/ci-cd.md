# Continuous integration and delivery

## GitHub Actions

`.github/workflows/ci.yml` runs on pushes to `main`, `develop`, `feature/*`, `release/*` and `hotfix/*`, pull requests targeting `main` or `develop`, and manual dispatch. Newer runs cancel older runs for the same branch or pull request.

- **Quality** installs the lockfile with `npm ci`, runs ESLint and Nuxt type checking, then the existing unit tests.
- **Build and smoke** runs only after Quality succeeds, builds production output and executes Playwright Chromium tests for desktop and an emulated Pixel 7 viewport.
- The HTML report and failure screenshots/traces are available as the `smoke-report` artifact for seven days. Smoke tests use synthetic browser-local data, never real accounts.

Actions are pinned to commit SHAs; workflow permissions are limited to `contents: read`, and checkout does not persist credentials. Node.js is selected from `.nvmrc`. No repository secrets, Vercel token or Supabase credentials are needed for CI.

Rebost smoke tests create a product with initial stock, consume one unit, reload and verify the remaining stock, then switch language and verify the saved preference. Each browser context has an isolated IndexedDB database.

## Local checks

```sh
npm ci
npm run lint
npm run check
npm test
npm run build
npx playwright install chromium
npm run test:smoke
```

Run `npm test` for the existing unit tests. Build before running smoke tests; the tests start their own local server and reject an already occupied test port. Static sites serve `.output/public`; Lang School starts the built Nitro server. The original development server can remain open on its usual port. Mobile coverage is Chromium emulation, not a physical-device test.

## Delivery through Vercel

Keep the existing Vercel Git integration: feature branches provide Preview deployments and `main` is the production branch. This avoids adding a second deployment mechanism or storing a Vercel administrative token in Actions. A project must actually be connected in Vercel for automatic deployment to happen.

GitHub CI and Vercel deployments run independently. Adding this workflow alone does **not** prevent Vercel from deploying a failing commit. For a controlled release, first wait for **Quality** and **Build and smoke** to succeed on the feature/integration commit, then publish the release to `main` through the agreed Git Flow. If automatic enforcement is wanted, configure appropriate branch rules and/or Vercel deployment checks separately, subject to the account plan. Those service settings are not changed by this feature.

This pipeline does not run database migrations, provision services, rotate credentials or change repository protections. Confirm a successful Vercel deployment separately from a successful Actions run.
