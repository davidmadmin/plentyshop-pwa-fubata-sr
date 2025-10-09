# PlentyONE PWA Migration Notes

This repository contains the PlentyONE Nuxt-based PWA that will gradually replace the existing plentyShop LTS (Ceres) storefront that powers the Hammer shops. When you touch code inside this monorepo, keep the following in mind:

## Migration Context
- We are migrating proven UI/UX patterns from the legacy **plentyShop LTS 5.0.76** implementation. That legacy code lives in [`davidmadmin/Custom-CSS-JS-im-Frontend-Hammer-Shops`](https://github.com/davidmadmin/Custom-CSS-JS-im-Frontend-Hammer-Shops).
- The legacy repository bundles custom HTML snippets, CSS overrides and JavaScript helpers that augment or replace Ceres header/footer layouts, provide shipping widgets (cut-off countdown, free-shipping progress, carrier icons) and various cart/search UX tweaks.
- When recreating features in the PWA:
  - Reuse the functional ideas, UI behaviour, and data requirements from the LTS snippets, but translate them into idiomatic Nuxt 3 + Vue 3 + Tailwind + Storefront UI code.
  - Verify whether the PlentyONE APIs or middleware already expose equivalent data before re-implementing bespoke REST calls.
  - Preserve business logic such as holiday-aware shipping cut-off calculation, carrier icon mapping, and cart call-to-actions.

## Working Guidelines
- Favour componentised Vue/TypeScript implementations over ad-hoc inline scripts. Legacy jQuery patterns should be reimagined with composables, compositional API, or Pinia stores.
- Document how a migrated feature maps back to the LTS reference (file name or selector) in PR descriptions whenever you port one of the legacy snippets.
- Keep accessibility and responsive behaviour in mind: the legacy code targets Bootstrap 4 grids, so double-check Tailwind breakpoints when translating layouts.
- When touching header/footer or checkout experiences, provide screenshots or recordings for both desktop and mobile viewports.
- Align styling with Tailwind tokens before adding custom CSS. If additional styles are necessary, colocate them within the relevant component using scoped styles or Tailwind layers.

## Testing & Verification
- Run the appropriate `npm run lint`, `npm run test`, and `npm run dev` spot checks that cover the area you touched. Include the executed commands in the PR.
- For features derived from legacy countdowns or shipping logic, add unit tests or at minimum document manual testing steps to ensure the business rules match the LTS behaviour.

Keeping these points in mind will help us carry the established Hammer shop experience from LTS to PlentyONE PWA without losing critical functionality.
