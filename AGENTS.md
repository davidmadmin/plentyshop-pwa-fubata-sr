# AGENTS.md

## Repository Purpose

This repository is an INTRA-TEC customer implementation of the PlentyONE Shop / PlentyPWA storefront. INTRA-TEC is the company behind the online retail stores `schrauben-hammer.de` and `fenster-hammer.de`, and behind the company's own brand `SCREWREBEL`. The upstream project is developed by Plentymarkets and provides the base Nuxt storefront, editor, middleware integration, settings system, component library usage, documentation, and update strategy.

The relevant GitHub repositories are:

- **Customer fork / working repository:** `davidmadmin/plentyshop-pwa-fubata-sr` at `https://github.com/davidmadmin/plentyshop-pwa-fubata-sr`
- **Original upstream repository:** `plentymarkets/plentyshop-pwa` at `https://github.com/plentymarkets/plentyshop-pwa`

The customer fork is based on the upstream Plentymarkets repository. Local branches in this fork contain INTRA-TEC customer customizations on top of the upstream PlentyPWA codebase, including SCREWREBEL-specific storefront styling and broader shop adjustments for INTRA-TEC's fastener and construction-supply retail business.

INTRA-TEC uses this repository to adapt the upstream PlentyPWA codebase for its own e-commerce storefront needs, including store-specific branding, styling, editor settings, assets, category/product presentation, and operational workflows for selling screws, locks, and other construction-industry supplies through Plenty-powered shops and external marketplaces.

Treat this repository as both:

- an upstream-tracking PlentyPWA codebase, where compatibility with future Plentymarkets changes matters; and
- a customer implementation, where INTRA-TEC additions must be preserved and evolved intentionally.

## INTRA-TEC Business Context

INTRA-TEC is the company behind the online retail stores `schrauben-hammer.de` and `fenster-hammer.de`, and behind the company's own brand `SCREWREBEL`.

The business sells fastener-related and construction-industry products, including screws, locks, and many other construction supplies. These products are sold through INTRA-TEC's own Plenty-powered shops and through external marketplaces.

When working on customer-specific behaviour, remember that the code is not only "a generic shop customization". It supports a real retail operation with:

- store-specific branding and visual identity, especially SCREWREBEL;
- category and product presentation for fasteners and construction supplies;
- Plenty-backed storefront/editor workflows;
- marketplace-adjacent product data and operational needs;
- a need to keep upstream PlentyPWA updates mergeable while preserving customer storefront behaviour.

Use this context when naming docs, settings, and abstractions. SCREWREBEL-specific wording is acceptable for current store-brand styling, but prefer broader naming when a feature is clearly reusable for `schrauben-hammer.de`, `fenster-hammer.de`, or future INTRA-TEC storefronts.

## Read This Before Making Changes

Before making any related code change, inspect the relevant local docs and existing code patterns first. Do not rely only on general Nuxt, Vue, Tailwind, or PlentyPWA knowledge when this repo already documents a local convention.

Start with:

- `README.md` for project setup, tooling, and the overall PlentyONE / Alokai storefront context.
- `docs/guide/themes/index.md` for the theme-level mental model.
- `docs/guide/themes/project-update-strategies.md` for upstream compatibility and update strategy.
- `docs/guide/themes/styling.md` for styling conventions.
- `docs/guide/editor/site-settings.md` and `docs/guide/editor/site-settings-architecture.md` before adding or changing editor settings.
- `docs/guide/themes/store-overwrite-settings.md` before changing the INTRA-TEC / SCREWREBEL theme overwrite work.
- Any nearby component, composable, block, module, or test files that show the established implementation pattern.

Use these docs as the first source of truth. Then use direct code inspection to understand how the relevant pieces actually interact. If the docs and code disagree, prefer the code for immediate implementation details, but update or flag stale docs when the mismatch matters.

## Engineering Priorities

When changing this repository:

1. Preserve upstream compatibility unless there is a clear reason not to.
2. Keep INTRA-TEC custom additions easy to identify, isolate, toggle, or later extract.
3. Prefer existing project patterns over new abstractions.
4. Avoid broad rewrites of upstream files when a narrower, composable, setting, module, or scoped override can solve the problem.
5. Keep changes reversible where the feature is an overwrite rather than a new baseline.
6. Add documentation when a customization affects multiple files, editor behaviour, deployment behaviour, or future upstream merge risk.
7. Run the most relevant validation available for the touched area, usually `vue-tsc --noEmit` for Vue/template changes and focused browser checks for rendered storefront changes.

## Upstream Plentymarkets Code vs. INTRA-TEC Additions

Most of the repository originates from Plentymarkets' PlentyPWA project. Do not casually rename, restructure, or restyle upstream components just to make local code look cleaner. Those changes make upstream merges harder.

INTRA-TEC additions are custom code, settings, assets, and docs added for the customer storefronts operated by INTRA-TEC and for the SCREWREBEL brand experience. These should be preserved unless the user explicitly asks to remove or replace them.

Think of these additions as business-specific overlays on top of upstream PlentyPWA: they support INTRA-TEC's own Plenty shops (`schrauben-hammer.de` and `fenster-hammer.de`), the SCREWREBEL brand presentation, and product-selling workflows for fastener and construction-supply assortments. They are not upstream Plentymarkets defaults.

When editing an upstream-derived file that contains INTRA-TEC customizations:

- Identify the upstream/default behaviour first.
- Identify the INTRA-TEC override path separately.
- Keep default behaviour intact when the customization is disabled.
- Keep the customization gated by an explicit setting when it is optional.
- Avoid mixing editor UI styling with storefront styling unless the task explicitly requires editor changes.
- Prefer small conditional class additions, local composables, settings, or clearly scoped CSS over global selectors.
- If a customization may become reusable, document the extraction path instead of prematurely building a complex plugin architecture.

## INTRA-TEC Custom Additions

### Storefront Theme Overwrite Settings

The main current INTRA-TEC customization is the SCREWREBEL storefront styling overwrite system documented in:

`docs/guide/themes/store-overwrite-settings.md`

Internally, this is described as:

`Styling for SCREWREBEL Store Overwrite settings`

This is not an official Plentymarkets plugin yet. Upstream PlentyPWA does not currently provide a stable official plugin mechanism for every part of this storefront-wide styling package. The implementation therefore lives inside the INTRA-TEC customer theme for now.

Future agents should treat this as a local INTRA-TEC feature that may later be refactored into a broader plugin, Nuxt module, or customer package if upstream support makes that useful. Do not call it an official Plenty plugin in user-facing documentation. If the feature becomes useful beyond SCREWREBEL, consider naming it around INTRA-TEC storefront overwrite settings or generic brand-theme overwrite settings rather than one store brand, because INTRA-TEC also operates `schrauben-hammer.de` and `fenster-hammer.de`.

Core implementation pieces include:

- `apps/web/app/composables/useDarkBrandTheme/`
- `apps/web/app/components/settings/branding-and-design/design/5.brand-theme/`
- `apps/web/app/configuration/settings.config.ts`
- `apps/web/app/app.vue`
- category page components, product card components, wishlist components, PDP buybox/review components, and scoped `.dark-brand-theme` overrides documented in the store overwrite guide.

### Toggle Boundary

All SCREWREBEL theme overwrite styling must be gated behind the single editor setting:

`Branding & design > Design > Brand Theme > Enable theme`

When this setting is off:

- default PlentyPWA / configured shop styling should apply;
- extra Brand Theme settings should be hidden;
- `#app-container` should not have `dark-brand-theme`;
- component-level dark theme classes should not apply;
- scoped `.dark-brand-theme` CSS should not match.

When this setting is on:

- Brand Theme dependent settings may be shown;
- theme-specific component classes may apply;
- storefront-only global overwrites may apply through `.dark-brand-theme`.

Do not introduce new always-on dark styling for this feature. If a future change needs to style another shop surface, wire it through `useDarkBrandTheme()` or another clearly documented setting path.

### Brand Theme Settings

Current Brand Theme keys include:

- `enableDarkBrandTheme`
- `useBrandBackgroundTexture`
- `brandPageBackgroundColor`
- `brandBackgroundTextureImage`
- `brandBackgroundTextureSize`
- `brandBackgroundTextureRepeat`
- `brandBackgroundTexturePosition`

The code still uses some historical `DarkBrandTheme` naming. Avoid renaming these keys casually because they may map to stored settings, environment variables, or merchant configuration. If a rename is required, plan migration/alias handling first.

Setting inputs should be documented with:

- expected type;
- default/prefilled value;
- whether live preview is expected;
- whether redeploy is required for the setting to fully apply.

### Styling Defaults and Documentation

For every INTRA-TEC theme overwrite that touches a component, update `docs/guide/themes/store-overwrite-settings.md` when the surface or behaviour changes.

The `Touched styling surfaces` table in that guide is a required maintenance artifact. Every change to a themed surface, Brand Theme setting, theme composable, app-level background rule, or static/global override must update that table when necessary. Keep it exhaustive, sorted by `Appears on` and `Area`, and detailed enough to help later agents resolve upstream merge conflicts or decide whether a customization should be extracted into a future plugin/module.

The documentation should state:

- affected file;
- default/off styling;
- theme-on styling;
- whether the styling is static or configurable;
- if configurable, which Brand Theme setting controls it and what input is expected.

This makes future upstream merges, bug fixes, and possible plugin extraction easier.

## Site Settings Guidance

The editor settings system is file-convention driven. Before adding or moving settings, read:

- `docs/guide/editor/site-settings.md`
- `docs/guide/editor/site-settings-architecture.md`

Prefer the existing folder convention:

`apps/web/app/components/settings/<mainCategory>/<subCategory>/<group>/<Setting>.vue`

Register default values in:

`apps/web/app/configuration/settings.config.ts`

Use `useSiteSettings('<key>')` for individual setting values and keep setting components small. If the setting has a visible live-preview effect, make that side effect explicit and scoped.

Be aware that newly added settings discovered through `import.meta.glob` may require restarting the local Nuxt dev server before the editor shows them.

## Styling Guidance

The storefront primarily uses:

- Vue Single File Components;
- Nuxt;
- Tailwind utility classes;
- Storefront UI components;
- scoped Vue styles only where appropriate.

For styling changes:

- Prefer conditional Tailwind classes near the affected markup.
- Preserve default class paths explicitly when adding a theme-on path.
- Use scoped CSS only when the markup cannot be controlled directly.
- Avoid broad global CSS selectors.
- Keep editor UI styling separate from storefront styling.
- Do not create a new design system unless the user explicitly asks for one.

For the INTRA-TEC theme overwrite, neutral greys and static class values are currently used in many component-level overrides to support the SCREWREBEL dark storefront direction. Only make them configurable if the user asks or if there is a clear maintenance benefit.

## Upstream Compatibility Rules

This repository should remain reasonably mergeable with Plentymarkets upstream work.

When possible:

- avoid formatting-only changes in upstream-derived files;
- avoid renaming public settings, routes, components, or composables without migration;
- avoid moving files just to improve local aesthetics;
- isolate INTRA-TEC customer-specific logic behind composables, settings, modules, or documented scoped overrides;
- keep patches small and reviewable;
- document why a direct upstream file edit was necessary.

When upstream-compatible isolation is not possible or would add too much complexity, make the direct change, but:

- keep it minimal;
- gate it if it is optional;
- document it as an INTRA-TEC addition;
- include verification steps in the final response or PR notes.

## Testing and Verification

Choose validation based on risk and touched area.

Common checks:

- `vue-tsc --noEmit` for Vue, composable, and template type safety.
- `git diff --check` before committing.
- Browser/editor verification for rendered storefront or editor behaviour.
- Focused unit tests if logic changes existing tested behaviour.

For theme overwrite work, verify both states:

1. `Enable theme` off: default shop styling returns and dependent settings are hidden.
2. `Enable theme` on: theme styling applies and dependent settings are visible.

If the Nuxt dev server hits local watcher limits such as `EMFILE: too many open files, watch`, report it clearly. Do not hide that validation caveat.

## Git and Change Management

The main working branch for the current theme overwrite work is:

`feature/dark-brand-theme-settings`

Before staging or committing:

- run `git status --short --branch`;
- inspect the changed files;
- do not stage unrelated user work;
- keep commits focused and named plainly.

When pushing, make sure the remote branch matches the intended target repository:

`https://github.com/davidmadmin/plentyshop-pwa-fubata-sr`

## Communication Expectations for Agents

When reporting work:

- distinguish what came from local docs, direct code inspection, browser verification, or general knowledge;
- mention validation commands run and any failures or caveats;
- call out when a change affects upstream compatibility;
- call out when a change modifies an INTRA-TEC customization, especially anything tied to `schrauben-hammer.de`, `fenster-hammer.de`, SCREWREBEL branding, or fastener/construction-supply product presentation;
- keep explanations beginner-friendly but technically precise.

The user is a solo developer improving an e-commerce storefront. Provide enough context to make the tradeoffs understandable, but keep the work practical and momentum-oriented.
