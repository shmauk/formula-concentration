# Formula concentration

A static website that helps clinicians work out how to make up a bottle of powdered infant formula at a prescribed energy concentration, using the labels of formulas sold in Australia and New Zealand. See `CONTEXT.md` for the domain vocabulary.

Built with Astro (static output), a Svelte island for the calculator, TypeScript (strict), plain CSS and Vitest.

## Development

You need the Node version in `.nvmrc` (the current LTS) and pnpm. The pnpm version is pinned in `package.json` under `packageManager`; run `corepack enable` to use it, or install pnpm yourself.

```sh
nvm use          # switch to the Node version in .nvmrc
pnpm install     # install dependencies
pnpm dev         # start the dev server at http://localhost:4321
pnpm check       # type-check with astro check
pnpm test        # run the Vitest tests once
pnpm build       # build the static site into dist/
pnpm preview     # serve the built site locally
```

Tests live next to the code they test, as `*.test.ts`.

CI (`.github/workflows/ci.yml`) runs `pnpm check`, `pnpm test` and `pnpm build` on every pull request and every push to `main`.

## Deployment

The site is hosted on Cloudflare Pages. After check, test and build pass, the `deploy` job in CI uploads the tested `dist/` with Direct Upload:

- pushes to `main` deploy to production;
- pull requests deploy a preview at `pr-<number>.<project>.pages.dev`, and the URL is in the deploy job's summary;
- pull requests from forks get no secrets, so they skip the deploy.

The job reads the secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` and the repo variable `CLOUDFLARE_PAGES_PROJECT`. It's skipped until the variable is set. To set everything up (Cloudflare account, Pages project, API token and GitHub secrets), run the setup wizard. You need `gh` signed in and Node:

```sh
./scripts/setup-cloudflare.sh
```

See [`scripts/setup-cloudflare.sh`](scripts/setup-cloudflare.sh).
