# SCREWREBEL theme module

This local Nuxt module owns the configurable INTRA-TEC/SCREWREBEL shop presentation. It intentionally remains separate from the Screw Finder so either feature can later be extracted into an installable PlentyONE module package.

## Capabilities

- Master `Enable theme` switch in `Branding & Design > Design > Brand Theme`.
- Configurable page background colour.
- Configurable fallback text colour for standard text cards on the dark background.
- Optional configurable background texture, size, repeat and position.
- Dark merchandising styles for category navigation, product cards, breadcrumbs, the product buybox and reviews.
- Independently configurable Adobe price-font preset.
- Secondary shop colour for product-listing prices.
- Automatic route safety: checkout, cart, account and authentication routes retain upstream styling.

The historical persisted setting keys are preserved:

- `enableDarkBrandTheme`
- `useBrandBackgroundTexture`
- `brandPageBackgroundColor`
- `brandBackgroundTextureImage`
- `brandBackgroundTextureSize`
- `brandBackgroundTextureRepeat`
- `brandBackgroundTexturePosition`
- `priceFontPreset`

The module additionally stores the standard Text Card fallback under `brandContentTextColor`. This key is new and
does not replace any historical widget-level text-colour setting.

Keeping the keys unchanged allows existing PlentyONE site-setting values to continue working after the refactor.

## Ownership boundary

The module registers its own runtime defaults, composables, plugins, styles, public texture asset and editor setting components. Core `app.vue`, category components, product cards, purchase cards and review components are not modified for theme presentation.

The only explicit core-block override is `runtime/components/blocks/CategoryData/CategoryData.vue`. It preserves rendering of older saved category blocks whose nested `fields`, `fieldsOrder`, `text` or `displayCategoryImage` values are incomplete. Review this override whenever upstream changes the core CategoryData block.

The root class is `screwrebel-theme`. All theme CSS must remain scoped below this class and `#app-container`. Do not introduce always-on dark storefront styles.

The master setting has two related states:

- `configured`: the merchant enabled the theme. Editor controls use this to show dependent settings.
- `enabled`: the theme is configured and the current route is safe to theme.

Operational routes are excluded in `runtime/utils/theme-routes.ts`. When expanding the theme to checkout, authentication or account pages, first implement and verify every form, table, validation and error state rather than removing the exclusion alone.

## Validation contract

For changes to this module, verify:

1. Theme off restores the upstream presentation.
2. Theme on applies the configured background and merchandising styles.
3. Texture off removes the image while retaining the colour.
4. Editor settings remain usable and persist under the historical keys.
5. Cart, checkout, account and authentication routes do not receive `screwrebel-theme`.
6. Desktop and mobile product/category surfaces retain readable contrast.
7. The selected price-font preset affects prices and totals, not general body text.

## Future packaging

The directory is structured as a Nuxt module and should be the extraction root for a future npm or plentyMarketplace package. Store-specific defaults may later become module options, but persisted key aliases must be retained during that migration.
