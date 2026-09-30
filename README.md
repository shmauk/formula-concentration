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
