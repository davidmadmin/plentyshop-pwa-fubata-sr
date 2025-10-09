# Agent Guide for PlentyONE PWA Migration Tasks

This repository contains the PlentyONE PWA reference implementation based on Nuxt 3, Tailwind CSS, Storefront UI components, and the PlentyONE middleware SDK. The goal for upcoming work is to reuse and progressively migrate the tailor-made storefront customisations that currently live in the [`Custom-CSS-JS-im-Frontend-Hammer-Shops`](https://github.com/davidmadmin/Custom-CSS-JS-im-Frontend-Hammer-Shops) project (built on plentyShop LTS »Ceres«) into this PWA codebase.

## Repository map
- **apps/web/** — Nuxt 3 storefront, the main target for porting layouts and interactive features. Core areas:
  - `app/components/` and `app/layouts/` for new Vue components, slots, and structural markup.
  - `app/assets/` and Tailwind configuration for global styling tokens.
  - `app/plugins/`, `app/composables/`, and middleware for logic that replaces ad-hoc JavaScript snippets from the LTS implementation.
- **apps/server/** — Middleware service that communicates with the PlentyONE APIs. Extend it when LTS snippets relied on IO endpoints or REST calls.
- **packages/** — Shared utilities, UI primitives, and SDK wrappers that may host cross-application code when ported features should be reusable.

## Migration principles
1. **Source of truth:** Treat the LTS repo as documentation for desired behaviour, markup, and styling only. Rebuild the features as idiomatic Vue/Tailwind modules in this PWA instead of copying inline Twig/JS.
2. **Structure-first porting:** Start by mapping each LTS feature (header/footer rebuild, countdowns, progress bars, etc.) to Nuxt layouts or components. Preserve semantics and accessibility while aligning with Storefront UI patterns.
3. **Styling strategy:** Replace raw SCSS or inline CSS overrides with Tailwind utility classes or component-scoped styles. Introduce design tokens in `tailwind.config.ts` or `app/assets` if you need shared colours, spacing, or typography values.
4. **JavaScript behaviour:** Convert jQuery/vanilla scripts into composables (`app/composables`) or Vue component logic. If a feature depends on timers, event listeners, or DOM measurements, encapsulate it behind Vue lifecycle hooks and, when necessary, server-safe fallbacks.
5. **API considerations:** When LTS snippets referenced IO controllers or REST endpoints, rebuild the integration through the PlentyONE middleware (`apps/server`) or Alokai SDK. Document any new endpoints in pull requests.
6. **Testing & verification:** Cover migrated logic with unit tests in the corresponding `__tests__` directories and document manual QA steps, especially for checkout-critical UI like shipping progress or countdown banners.
7. **Documentation:** Update README sections, in-repo docs, or feature-specific markdown files to note where former LTS customisations now live in the PWA, easing future maintenance.

## Additional references
- PlentyONE PWA setup, tooling, and coding standards are described in [README.md](README.md) and [GUIDE.md](GUIDE.md).
- The legacy behaviour catalogue (header/footer rebuilds, countdowns, icons, etc.) resides in the external repository's README. Review it before implementing or refactoring features here.

Follow these guidelines whenever you modify files within this repository to ensure a consistent, maintainable migration from the LTS storefront to the PlentyONE PWA.
