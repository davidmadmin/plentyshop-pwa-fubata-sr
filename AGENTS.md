# Agent Guidelines for PlentyONE PWA Migration

## Project Vision
- This repository hosts the PlentyONE integration built on Alokai/Nuxt 3 with a Turborepo setup. It contains the `web` Nuxt application and the `server` middleware for connecting PlentyONE services.
- Our long-term objective is to reproduce and modernize the bespoke storefront behaviour previously implemented on PlentyShop LTS (Ceres) by reusing and adapting production-proven HTML/CSS/JS snippets from the `Custom-CSS-JS-im-Frontend-Hammer-Shops` repository.

## Migration Strategy
1. **Audit existing features**: Before building anything new, review the legacy snippets to understand their purpose (e.g., header/footer rebuilds, countdown timers, free-shipping progress bars). Identify the PlentyONE/Nuxt counterparts where these behaviours should live.
2. **Prefer native PWA patterns**: Translate inline scripts or Twig-only structures from LTS into Vue components, composables, or middleware routes that follow the conventions documented in `GUIDE.md` (component folders with `types.ts`, composables under `apps/web/app/composables`, etc.).
3. **Progressive migration**: Implement legacy functionality incrementally, validating that each port works with PlentyONE APIs before moving to the next feature. Retire temporary CSS/JS as soon as equivalent Vue/Tailwind solutions exist.

## Working Agreements
- Keep documentation aligned: whenever you port a legacy feature, update README/feature docs so PlentyONE and PlentyShop LTS teams can trace what has already been migrated.
- Respect the monorepo tooling: use `npm run dev` during development and rely on the PlentyONE Shop CLI generators for new components/composables when possible.
- Surface gaps: if a legacy feature relies on plugins or APIs that do not exist in PlentyONE yet, open an issue noting the dependency and suggested Nuxt implementation plan.

## Pull Request Notes
- Describe which legacy snippet you migrated and where it now lives in the PWA codebase.
- Document manual or automated checks needed to verify parity with the LTS behaviour (e.g., countdown timing, header responsive layout).
