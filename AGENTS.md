# Project Navigator

Welcome to the **PlentyONE PWA migration workspace**. This codebase starts from the official `plentyshop-pwa` boilerplate and will evolve into a front end that reproduces the bespoke HTML/CSS/JS features from the [Hammer Shops customization repo](https://github.com/davidmadmin/Custom-CSS-JS-im-Frontend-Hammer-Shops). Use this guide as your entry point before touching any files.

## Repository focus

- **Target architecture:** Nuxt 4 + TypeScript + Storefront UI components with TailwindCSS utilities. The goal is to replace the legacy Ceres templates from plentyShop LTS with native Vue building blocks inside this PWA.
- **Reference implementation:** The LTS-era add-ons (header/footer rebuild, countdown timer, shipping icons, free-shipping progress bar, animated search placeholder, etc.) live in the Hammer Shops repo. Treat that repository as a design and behavior specification while rebuilding the features here in Vue and composables instead of inline DOM hacks.
- **Two-app turborepo:**
  - `apps/web/` – Nuxt storefront. Most feature work happens in `app/components`, `app/pages`, `app/assets/style.scss`, and domain-specific `app/composables`.
  - `apps/server/` – Middleware (TypeScript, tsup build). Extend it when a migrated feature needs server-side aggregation or proxy logic.

### TurboRepo layout refresher

- The monorepo uses TurboRepo to orchestrate builds. App-level commands (`npm run dev`, `npm run build`) fan out through Turbo pipelines, so prefer running tasks from the repository root unless a guide explicitly says otherwise.
- `apps/server` is an Express-based Alokai Middleware skeleton. Key files:
  - `src/index.ts` – server entry point bridging SDK calls to upstream services.
  - `middleware.config.ts` – toggle and configure middleware connectors.
  - `nodemon.json`, `jest.config.ts`, and `tsconfig.json` live alongside to support local development and tests.
- `apps/web` follows the Nuxt 3 directory scheme (`app/components`, `app/pages`, `app/composables`, etc.). When mapping legacy Twig or SCSS, mirror Nuxt's structure to keep discoverability high.

## How to map LTS snippets into the PWA

1. **Identify the target area** in the Hammer Shops repository (e.g., header Twig, footer layout, countdown JS).
2. **Translate structure:**
   - Twig/HTML blocks → Vue single-file components inside `apps/web/app/components/...` or page-specific sections in `app/pages`.
   - SCSS overrides → Tailwind utility classes first; fall back to scoped styles or add global tokens in `app/assets/style.scss`.
   - jQuery/vanilla scripts → Vue composables (`app/composables`) or Nuxt plugins (`app/plugins`) with reactivity instead of direct DOM mutations.
3. **Shared logic:** place reusable TypeScript in `apps/web/app/utils` or `app/composables`. Keep business logic pure and testable with Vitest when possible.
4. **Global configuration:** leverage `nuxt.config.ts`, middleware, and i18n files in `app/lang` to mirror language-dependent behaviors from LTS.
5. **Server touchpoints:** if a migrated feature depends on REST endpoints that were previously consumed via IO plugin scripts, expose them via the middleware in `apps/server/src` and call them through the SDK.

### Naming & module conventions

- Functions live in their own folder with `Function.ts`, `index.ts`, optional `types.ts`, and colocated tests under `__tests__/`.
- Composables go in `apps/web/app/composables/` and must be prefixed with `use`, camel-cased (`useProductReviews`), and bundle state updates internally via Nuxt's `useState` helpers.
- Vue components follow PascalCase naming. Co-locate prop types as `{Component}Props` in a sibling `types.ts`, and export via `index.ts`. Storefront UI block components in `components/ui` reuse the same structure.

### Data fetching & localization

- Leverage the Alokai (VSF) SDK in tandem with Nuxt's `useAsyncData` and `useState` for remote data. Prefer composables that wrap SDK calls instead of ad-hoc fetches.
- Mocked data from `@vue-storefront/integration-boilerplate-sdk` powers local development; wire up real connectors by adjusting `apps/server/middleware.config.ts` when targeting production services.
- Localization uses Nuxt i18n with feature-scoped JSON files (e.g., `locale/{feature}.json`). Import only what a given page or component needs to keep bundles light.

## Developer workflow

- **Upstream-friendly changes:** This repository is a fork that regularly pulls
  updates from the upstream `plentyshop-pwa` project. Structure new features
  and modifications in a way that keeps diffs minimal and avoids unnecessary
  conflicts when upstream changes are merged.

- Install dependencies at the repo root with `npm install`. Use `npm run dev` to start both middleware and the Nuxt storefront during development.
- Generate boilerplate with the PlentyONE CLI (`npx plentyshop generate ...`) to stay aligned with project conventions.
- Keep TypeScript strictness and ESLint/Prettier defaults intact; do not wrap imports in `try/catch`.
- Tests: prefer Vitest for unit coverage and Cypress for end-to-end behavior when migrating interactive components.
- Vitest config lives in `apps/web/vitest.config.mjs`; component tests rely on Vue Test Utils helpers in `vue-test-utils.extend.ts`. Keep `it('should …')` style descriptions to match lint rules.
- Performance budgets are guarded by Lighthouse CI scripts (`npm run lhci:mobile`, configs in `/lighthouserc*.json`). Run `npm run build` beforehand if the production bundle is missing.
- Use `npx nuxi analyze` (or run it inside `apps/web`) to inspect bundle size regressions before shipping heavy dependencies.

## Commit conventions

- Write commit messages that follow the [Conventional Commits 1.0.0 specification](https://www.conventionalcommits.org/en/v1.0.0/).
- Format commit subjects as `<type>(optional scope): <short summary>` using lowercase `type` keywords such as `feat`, `fix`, `docs`, `refactor`, `test`, or `chore`.
- Keep the summary imperative, limit it to 72 characters, and include scopes only when they add clarity (e.g., `feat(header): add countdown timer`).
- Provide additional context in the body when necessary, separating it from the subject with a blank line and wrapping text at roughly 72 characters.

## Documentation & knowledge base

- Core docs live in `README.md` and `GUIDE.md` (technical overview). Feature-specific notes should go into `docs/` alongside screenshots or architectural decisions.
- When porting features, annotate the new Vue components or composables with references to the original Hammer Shops files (e.g., comments mentioning source filenames) to aid reviewers.
- Update this `AGENTS.md` if the migration strategy changes or new high-priority features from the LTS stack are introduced.

Happy migrating! This workspace exists to ensure every legacy customization finds a maintainable home in the PlentyONE PWA.
