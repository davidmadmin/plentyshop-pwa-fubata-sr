# Project Navigator

Welcome to the **PlentyONE PWA migration workspace**. This codebase starts from the official `plentyshop-pwa` boilerplate and will evolve into a front end that reproduces the bespoke HTML/CSS/JS features from the [Hammer Shops customization repo](https://github.com/davidmadmin/Custom-CSS-JS-im-Frontend-Hammer-Shops). Use this guide as your entry point before touching any files.

## Repository focus

- **Target architecture:** Nuxt 4 + TypeScript + Storefront UI components with TailwindCSS utilities. The goal is to replace the legacy Ceres templates from plentyShop LTS with native Vue building blocks inside this PWA.
- **Reference implementation:** The LTS-era add-ons (header/footer rebuild, countdown timer, shipping icons, free-shipping progress bar, animated search placeholder, etc.) live in the Hammer Shops repo. Treat that repository as a design and behavior specification while rebuilding the features here in Vue and composables instead of inline DOM hacks.
- **Two-app turborepo:**
  - `apps/web/` – Nuxt storefront. Most feature work happens in `app/components`, `app/pages`, `app/assets/style.scss`, and domain-specific `app/composables`.
  - `apps/server/` – Middleware (TypeScript, tsup build). Extend it when a migrated feature needs server-side aggregation or proxy logic.

## How to map LTS snippets into the PWA

1. **Identify the target area** in the Hammer Shops repository (e.g., header Twig, footer layout, countdown JS).
2. **Translate structure:**
   - Twig/HTML blocks → Vue single-file components inside `apps/web/app/components/...` or page-specific sections in `app/pages`.
   - SCSS overrides → Tailwind utility classes first; fall back to scoped styles or add global tokens in `app/assets/style.scss`.
   - jQuery/vanilla scripts → Vue composables (`app/composables`) or Nuxt plugins (`app/plugins`) with reactivity instead of direct DOM mutations.
3. **Shared logic:** place reusable TypeScript in `apps/web/app/utils` or `app/composables`. Keep business logic pure and testable with Vitest when possible.
4. **Global configuration:** leverage `nuxt.config.ts`, middleware, and i18n files in `app/lang` to mirror language-dependent behaviors from LTS.
5. **Server touchpoints:** if a migrated feature depends on REST endpoints that were previously consumed via IO plugin scripts, expose them via the middleware in `apps/server/src` and call them through the SDK.

## Developer workflow

- Install dependencies at the repo root with `npm install`. Use `npm run dev` to start both middleware and the Nuxt storefront during development.
- Generate boilerplate with the PlentyONE CLI (`npx plentyshop generate ...`) to stay aligned with project conventions.
- Keep TypeScript strictness and ESLint/Prettier defaults intact; do not wrap imports in `try/catch`.
- Tests: prefer Vitest for unit coverage and Cypress for end-to-end behavior when migrating interactive components.

## Documentation & knowledge base

- Core docs live in `README.md` and `GUIDE.md` (technical overview). Feature-specific notes should go into `docs/` alongside screenshots or architectural decisions.
- When porting features, annotate the new Vue components or composables with references to the original Hammer Shops files (e.g., comments mentioning source filenames) to aid reviewers.
- Update this `AGENTS.md` if the migration strategy changes or new high-priority features from the LTS stack are introduced.

Happy migrating! This workspace exists to ensure every legacy customization finds a maintainable home in the PlentyONE PWA.
