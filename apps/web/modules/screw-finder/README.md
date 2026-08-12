# Screw Finder module

This local Nuxt module owns the configurable Screw Finder editor block. The block preserves the historical guided beginner flow, direct professional flow, live PlentyONE facet loading, safety-critical material rules, exact-result ranking and clearly marked alternatives.

## Module contract

The block is discovered from:

`runtime/components/blocks/ScrewFinder/`

The folder contains the render component, editor form, catalogue defaults, icon, matching logic, guidance rules, types and unit tests. It must not be re-registered in the removed `blocksLists.json` file or in core block registries.

Persisted block content remains backward-compatible through `resolveScrewFinderContent()`. Existing content keys and block name `ScrewFinder` must not be renamed without an explicit data migration.

Outdoor and corrosive beginner recommendations fail closed when the live category facets do not expose A2/A4.
The finder shows an unavailable message instead of querying or labelling products without the required material
constraint. Outdoor product matching queries A2 and A4 as separate valid branches, pending transitions are cancelled
when navigating back or restarting, application conflicts are shown only as alternatives, and all result-card guidance
uses the active storefront language.

## Validation contract

For changes to this module, verify:

1. The editor catalogue discovers the block and its icon.
2. Existing saved `ScrewFinder` blocks still render.
3. The editor form updates copy, source category, enabled paths, stages, result count, colours and full-width layout.
4. Beginner and professional flows both reach results.
5. Outdoor/corrosive selections retain the A2/A4 safety constraints.
6. Exact and alternative result links resolve to live shop routes.
7. Keyboard navigation, live announcements and reduced-motion behavior remain intact.

## Future packaging

This directory is the extraction root for a future npm or plentyMarketplace module. Keep shop-specific defaults configurable and keep product matching independent from theme-module code.
