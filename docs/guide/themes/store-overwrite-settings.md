# Styling for SCREWREBEL Store Overwrite Settings

## Purpose

The styling overwrite settings provide a single editor-controlled switch for applying the custom SCREWREBEL storefront theme. Internally this can be described as "Styling for SCREWREBEL Store Overwrite settings".

SCREWREBEL is INTRA-TEC's own brand. INTRA-TEC is the company behind the online retail stores `schrauben-hammer.de` and `fenster-hammer.de`; it sells fastener-related and construction-industry products such as screws, locks, and other construction supplies through its own Plenty-powered shops and through external marketplaces.

The current implementation is intentionally local to this INTRA-TEC customer theme. It is not an official PlentyONE plugin, because upstream Plenty development does not yet provide a stable plugin capability for this exact kind of storefront-wide styling package.

If upstream support later makes this practical, these changes should be reviewed and refactored into a standalone plugin or module when that provides a cleaner maintenance boundary. At that point the name should also be broadened so it can describe a reusable INTRA-TEC storefront overwrite package, or a more generic brand-theme overwrite package, instead of being tied only to SCREWREBEL.

## What it achieves

The feature adds a merchant-facing theme switch under:

`Branding & design > Design > Brand Theme`

The primary setting is `Enable theme`. When enabled, it applies the custom storefront theme to selected shop surfaces for the SCREWREBEL/INTRA-TEC storefront presentation. When disabled, the shop falls back to the default configured styling and rules.

The enabled theme currently covers:

- Page background colour and optional texture image.
- Texture behaviour controls for size, repeat, and position.
- Category page filters, sidebar, sorting controls, item counts, and product cards.
- Product card wishlist button visibility and active wishlist colour.
- Breadcrumb readability on dark backgrounds.
- Product detail page buybox styling.
- Customer review wrapper, review statistics, and review cards.
- Product detail text areas that are not yet configurable on a block level, such as technical data and EU responsible information.

## Why it is gated by one toggle

All custom storefront styling should be controlled by the single `Enable theme` setting. This is important because the theme is implemented as an overwrite layer, not as the default shop design.

When `Enable theme` is off:

- Additional Brand Theme settings are hidden in the editor.
- `#app-container` does not receive the `dark-brand-theme` class.
- Component-level dark classes are not applied.
- Global CSS overrides scoped under `.dark-brand-theme` do not match.
- The editor interface keeps its default styling.

When `Enable theme` is on:

- The dependent settings become visible.
- The storefront receives the `dark-brand-theme` class.
- Components apply their conditional dark theme classes.
- Scoped global overwrites become active for shop content.

This keeps the feature reversible and prevents theme-specific styling from leaking into the default shop or into the editor UI.

## Settings

The settings are registered in `apps/web/app/configuration/settings.config.ts`.

Current keys:

- `enableDarkBrandTheme`
- `useBrandBackgroundTexture`
- `brandPageBackgroundColor`
- `brandBackgroundTextureImage`
- `brandBackgroundTextureSize`
- `brandBackgroundTextureRepeat`
- `brandBackgroundTexturePosition`

The setting components live in:

`apps/web/app/components/settings/branding-and-design/design/5.brand-theme/`

The setting names still use the historical `DarkBrandTheme` naming in code where renaming would create unnecessary churn. The editor-facing label is intentionally broader: `Enable theme`.

## Runtime control

Theme state is exposed through:

`apps/web/app/composables/useDarkBrandTheme/useDarkBrandTheme.ts`

Components should use this composable instead of reading `enableDarkBrandTheme` directly. That keeps the logic consistent and makes a future plugin or module extraction easier.

Typical usage:

```ts
const { enabled: darkBrandThemeEnabled } = useDarkBrandTheme();
```

Template classes should then be conditional:

```vue
<div :class="darkBrandThemeEnabled ? 'bg-neutral-900 text-neutral-100' : ''">
  ...
</div>
```

If a default class was replaced by a theme class, both paths should be explicit:

```vue
<div :class="darkBrandThemeEnabled ? 'border-neutral-700' : 'border-neutral-200'">
  ...
</div>
```

## Background handling

The page background is handled in `apps/web/app/app.vue`.

When the theme is enabled, `body` receives:

- `backgroundColor` from `brandPageBackgroundColor`
- optional `backgroundImage` from `brandBackgroundTextureImage`
- `backgroundSize` from `brandBackgroundTextureSize`
- `backgroundRepeat` from `brandBackgroundTextureRepeat`
- `backgroundPosition` from `brandBackgroundTexturePosition`

When the theme is disabled, those values are removed so the normal shop background can take over.

The default texture settings are designed to avoid accidental tiling:

- Size: `cover`
- Repeat: `no-repeat`
- Position: `center center`

Repeat should only be used for images that are intentionally seamless patterns.

## Component overwrite pattern

Most theme styling is implemented in Vue templates as conditional Tailwind classes. This keeps the default upstream component behaviour visible in the same file and avoids a large global stylesheet that is hard to reason about.

Use this pattern for component changes:

1. Import the theme state through `useDarkBrandTheme()`.
2. Preserve the original/default class path.
3. Add the custom theme class path only when the toggle is enabled.
4. Do not apply editor styling changes through this feature.
5. Keep global CSS scoped under `.dark-brand-theme` when a block-level setting is not available yet.

Global overwrites should be a fallback, not the default approach. They are useful only where the rendered markup cannot yet be controlled through block settings or component props.

## Touched styling surfaces

This table tracks the files touched by the theme overwrite work. Keep it current when a theme overwrite is added, removed, renamed, or made configurable. It is intentionally detailed so future upstream merges can quickly distinguish default PlentyPWA behaviour from INTRA-TEC styling overrides for its Plenty-powered shops and SCREWREBEL brand presentation.

No checkout or basket styling surfaces are currently changed by this theme work.

| Appears on | Area | Affected file | Default/off state | Theme-on override | Brand Theme configurability |
| --- | --- | --- | --- | --- | --- |
| Editor settings | Brand Theme defaults | `apps/web/app/configuration/settings.config.ts` | Without saved settings or matching environment variables, the custom theme is off by default because `enableDarkBrandTheme` only becomes `true` when `NUXT_PUBLIC_ENABLE_DARK_BRAND_THEME === 'true'`. | Provides the default values consumed by the Brand Theme settings and storefront runtime: texture enabled unless `NUXT_PUBLIC_USE_BRAND_BACKGROUND_TEXTURE === 'false'`, background colour `#050505`, texture image `/_nuxt-plenty/images/brand-theme/dark-texture.avif`, size `cover`, repeat `no-repeat`, and position `center center`. | Configurable through environment variables and persisted site settings. Expected values: booleans as string-like setting values for toggles; hex colour string for `brandPageBackgroundColor`; image URL/path string for `brandBackgroundTextureImage`; one of `cover`, `contain`, `auto` for size; one of `no-repeat`, `repeat`, `repeat-x`, `repeat-y` for repeat; one of the documented CSS position strings for position. |
| Editor settings | Shared theme enabled state | `apps/web/app/composables/useDarkBrandTheme/useDarkBrandTheme.ts` and `apps/web/app/composables/useDarkBrandTheme/index.ts` | No default visual styling by itself. Consumers would otherwise need to read `enableDarkBrandTheme` directly. | Exposes `enabled`, computed from `String(getSetting()) === 'true'`, so components can consistently gate theme overrides. | Configurable only indirectly through `Enable theme` (`enableDarkBrandTheme`, boolean). This composable has no independent user input. |
| Editor settings | Master theme toggle | `apps/web/app/components/settings/branding-and-design/design/5.brand-theme/01.EnableDarkBrandTheme.vue` | Setting is shown as `Enable theme`; the switch is off unless the saved/runtime value is true. With the switch off, the storefront should use default styling and dependent Brand Theme settings should remain hidden. | Switch on stages `enableDarkBrandTheme = true`, which enables the storefront overwrite layer, applies `dark-brand-theme`, and reveals dependent settings. The tooltip warns that many shop styles are overwritten while the editor keeps default styling. | Directly configurable. Input is an `SfSwitch` boolean. Stored under `enableDarkBrandTheme`; environment default is `NUXT_PUBLIC_ENABLE_DARK_BRAND_THEME === 'true'`. |
| Editor settings | Background texture toggle | `apps/web/app/components/settings/branding-and-design/design/5.brand-theme/02.UseBackgroundTexture.vue` | Hidden unless `Enable theme` is on. When visible, the switch reads `useBrandBackgroundTexture`; runtime default is true unless `NUXT_PUBLIC_USE_BRAND_BACKGROUND_TEXTURE === 'false'`. | When enabled together with `Enable theme`, `app.vue` applies the configured texture image to the storefront background. When disabled, only the configured background colour remains. | Directly configurable when the master theme is enabled. Input is an `SfSwitch` boolean stored under `useBrandBackgroundTexture`. |
| Editor settings | Page background colour input | `apps/web/app/components/settings/branding-and-design/design/5.brand-theme/03.PageBackgroundColour.vue` | Hidden unless `Enable theme` is on. Default/prefilled value is `#050505` from `brandPageBackgroundColor` unless overridden by saved settings or `NUXT_PUBLIC_BRAND_PAGE_BACKGROUND_COLOR`. | Sets the storefront container background colour while the theme is enabled. | Directly configurable when the master theme is enabled. Input is a colour picker/text input; expected value is a valid CSS colour string, normally a hex colour such as `#050505`. |
| Editor settings | Background texture image input | `apps/web/app/components/settings/branding-and-design/design/5.brand-theme/04.BackgroundTextureImage.vue` | Hidden unless `Enable theme` is on. Default placeholder/reset value is `/_nuxt-plenty/images/brand-theme/dark-texture.avif`. | Supplies the image URL used for `backgroundImage` when both `Enable theme` and `Use background texture` are enabled. | Directly configurable when the master theme is enabled. Input comes from `UiImagePicker`; expected value is an image URL/path. The setting description recommends a dark texture image of 1600 x 1600 px or larger. |
| Editor settings | Background texture size select | `apps/web/app/components/settings/branding-and-design/design/5.brand-theme/05.BackgroundTextureSize.vue` | Hidden unless `Enable theme` is on. Default/prefilled value is `cover`. | Controls `background-size` for the configured texture while the texture is enabled. | Directly configurable when the master theme is enabled. Input is a select with `cover`, `contain`, or `auto`; use `cover` for image-like backgrounds and `auto` for small seamless patterns. |
| Editor settings | Background texture repeat select | `apps/web/app/components/settings/branding-and-design/design/5.brand-theme/06.BackgroundTextureRepeat.vue` | Hidden unless `Enable theme` is on. Default/prefilled value is `no-repeat`. | Controls `background-repeat` for the configured texture while the texture is enabled. | Directly configurable when the master theme is enabled. Input is a select with `no-repeat`, `repeat`, `repeat-x`, or `repeat-y`; use repeat values only for seamless patterns. |
| Editor settings | Background texture position select | `apps/web/app/components/settings/branding-and-design/design/5.brand-theme/07.BackgroundTexturePosition.vue` | Hidden unless `Enable theme` is on. Default/prefilled value is `center center`. | Controls `background-position` for the configured texture while the texture is enabled. | Directly configurable when the master theme is enabled. Input is a select mapping to `center center`, `center top`, `center bottom`, `left center`, or `right center`. |
| Global storefront; Category; PDP; Content pages | App container theme gate and page background | `apps/web/app/app.vue` | `#app-container` has no `dark-brand-theme` class. Inline background styling from Brand Theme is not applied, so the normal configured shop/editor background rules take over. | Adds `dark-brand-theme` to `#app-container`; applies `backgroundColor`, `minHeight`, and, when texture is enabled, `backgroundImage`, `backgroundRepeat`, `backgroundSize`, and `backgroundPosition`. Also scopes global text overrides for `.block-wrapper` headings, rich text/no-preflight content, accordion-like bold paragraphs, and links. | Mixed. The theme class is controlled by `Enable theme` (`boolean`). Background colour/image/size/repeat/position are configurable through Brand Theme settings. The `.dark-brand-theme .block-wrapper` text colours are static (`#f2f2f2` and `#ffffff`) and not individually configurable. |
| Category; Search; Listing blocks | Category filter accordion styling | `apps/web/app/components/CategoryFilters/Filter.vue` | Filter headers use `bg-primary-50/50`; chevrons use `text-neutral-500`; normal filter rows use transparent/default Storefront UI list item styling; price inputs and apply/reset buttons use their default component styling. | Filter headers switch to `bg-neutral-800 text-neutral-100`; chevrons switch to `text-neutral-300`; filter rows use light text with dark hover/active states; price inputs use `bg-neutral-900`, `text-neutral-100`, neutral rings, and darker placeholders; apply/reset buttons use dark neutral backgrounds, light text, neutral rings, and explicit hover/active/disabled states. | Static theme values. Controlled only by `Enable theme` (`boolean`). Individual greys, text colours, rings, and button states are not configurable through Brand Theme settings yet. |
| Category; Search; Listing blocks | Category filter sorting sections | `apps/web/app/components/CategoryFilters/SortSections.vue` | Uses the same default visual pattern as `Filter.vue`: light `bg-primary-50/50` headers, neutral chevrons, default list item rows, default price inputs, and default apply/reset buttons. | Uses the same theme-on visual pattern as `Filter.vue`: dark neutral headers, light text, darker row hover/active states, dark price inputs, and dark apply/reset buttons. | Static theme values. Controlled only by `Enable theme` (`boolean`). This mirrors `Filter.vue`; individual colours and states are not configurable through Brand Theme settings. |
| Category; Search | Category items-per-page control | `apps/web/app/components/CategoryItemsPerPage/CategoryItemsPerPage.vue` | Section header uses `bg-primary-50/50`; select uses default `SfSelect` styling and inherits normal shop colours. | Header switches to `bg-neutral-800 text-neutral-100`; select receives `bg-neutral-900`, `text-neutral-100`, `ring-neutral-700`, and dark hover/active/focus rings. | Static theme values. Controlled only by `Enable theme` (`boolean`). The option values themselves still come from `defaults.PER_PAGE_STEPS`; colours are not configurable. |
| Category; Search | Category sorting control | `apps/web/app/components/CategorySorting/CategorySorting.vue` | Section header uses `bg-primary-50/50`; select uses default `SfSelect` styling. Sorting options and defaults come from existing site settings such as `availableSortingOptions`, `defaultSortingSearch`, and `defaultSortingOption`. | Header switches to `bg-neutral-800 text-neutral-100`; select receives `bg-neutral-900`, `text-neutral-100`, `ring-neutral-700`, and dark hover/active/focus rings. | Styling is static and controlled only by `Enable theme` (`boolean`). Sorting option content remains configurable through existing sorting settings, not through Brand Theme styling inputs. |
| Category; Search | Category sidebar drawer styling | `apps/web/app/components/CategorySidebar/CategorySidebar.vue` | Drawer surface uses `bg-white`; text inherits the default shop colour; the mobile close icon uses `text-neutral-500`; the mobile footer divider uses `border-t-neutral-200`. | Drawer surface switches to `bg-neutral-950/90 text-neutral-100`; the mobile close button gets `text-neutral-200` with a dark hover background; the close icon switches to `text-neutral-300`; the footer divider switches to `border-t-neutral-700`. | Static theme values. Controlled only by `Enable theme` (`boolean`). Sidebar background opacity, text colour, close icon colour, and divider colour are not exposed as Brand Theme inputs. |
| Category; Search | Category tree heading and parent icon | `apps/web/app/components/CategoryTree/CategoryTree.vue` | Category heading uses `bg-primary-50/50 text-neutral-900`; parent/back icon uses `text-neutral-500`. | Category heading switches to `bg-neutral-800 text-neutral-100`; parent/back icon switches to `text-neutral-300`. | Static theme values. Controlled only by `Enable theme` (`boolean`). Category content and URLs still come from category/breadcrumb data; colours are not configurable. |
| Category; Search | Category tree item rows | `apps/web/app/components/CategoryTree/CategoryTreeItem.vue` | Default list item styling is used; selected items use `bg-primary-100` with primary check icon `text-primary-500`. | Rows use `text-neutral-200` with dark hover/active backgrounds; selected rows use `bg-neutral-800 text-white font-medium`; selected check icon switches to `text-neutral-100`. | Static theme values. Controlled only by `Enable theme` (`boolean`). Category names, counts, and selected state are data-driven; colours are not configurable. |
| Category; Search | Category page item count and footer legal text | `apps/web/app/components/CategoryPageContent/CategoryPageContent.vue` | Item count and tax/shipping footer text do not receive theme-specific colour classes, so they inherit the default page/shop text styling. | Item count gets `text-neutral-100`; tax/shipping footer text gets `text-neutral-300`, keeping both readable on the dark category background. | Static theme values. Controlled only by `Enable theme` (`boolean`). Actual item count, tax mode, and shipping link content still come from existing shop data/settings; text colours are not configurable. |
| Category; Search; Listing blocks | Item grid count and footer legal text | `apps/web/app/components/blocks/ItemGrid/ItemGrid.vue` | Item count and tax/shipping footer text inherit default text styling. Grid spacing and columns are controlled by the block content configuration. | Item count gets `text-neutral-100`; tax/shipping footer text gets `text-neutral-300`. Product cards rendered inside the grid receive their own `UiProductCard` theme overrides. | Static theme text colours controlled only by `Enable theme` (`boolean`). Grid layout remains configurable through existing ItemGrid block content, not Brand Theme. |
| Category; Search; Listing blocks; Wishlist/product listings | Category product card styling | `apps/web/app/components/ui/ProductCard/ProductCard.vue` | Card shell has no forced background/text colour; card border is `border-neutral-200` when `configuration.cardBorders` is enabled; image skeleton uses `bg-neutral-100`; content divider uses `border-neutral-200`; manufacturer text is `text-neutral-500`; preview text is `text-neutral-700`; price text is `text-secondary-600`; wishlist button uses a white surface with `ring-neutral-200`; add/show-options buttons use their normal configured button variant. | Card shell switches to `bg-neutral-900/80 text-neutral-100`; enabled card border switches to `border-neutral-700`; image skeleton uses `bg-neutral-800`; content divider uses `border-neutral-700`; product title uses light neutral link states; manufacturer text uses `text-neutral-400`; preview text uses `text-neutral-300`; price text uses `text-neutral-50`; wishlist button uses a dark neutral surface/ring; add/show-options buttons use dark neutral backgrounds and light text. | Partly existing component configuration, but not Brand Theme colour configuration. Product-card structure still follows normal props such as `cardBorders`, `contentAlignment`, visible fields, wishlist visibility, and add-to-cart style. Dark colour values are static and controlled only by `Enable theme` (`boolean`). |
| Category; PDP; Search; Wishlist/product listings | Wishlist icon styling | `apps/web/app/components/WishlistButton/WishlistButton.vue` | Filled wishlist icon receives no theme-specific colour class, so it uses the component/default inherited icon colour. | Filled wishlist icon receives `text-[#f20000]` when the product is already on the wishlist and the theme is enabled. Empty wishlist icon styling is unchanged by this file. | Static theme value. Controlled by `Enable theme` (`boolean`) plus wishlist state. There is no Brand Theme colour input for the active wishlist red; expected value is hard-coded as `#f20000`. |
| Category; PDP; Content pages with breadcrumbs | Breadcrumb readability | `apps/web/app/components/ui/Breadcrumbs/Breadcrumbs.vue` | Breadcrumbs use default neutral/primary link states: mobile item `text-neutral-500`, desktop items `text-neutral-500` with current item `text-neutral-900`, transparent dropdown trigger states, white dropdown background, and inherited link colour. | Breadcrumbs switch to light neutral text: wrapper `text-neutral-300`, desktop trail `text-neutral-400` with current item `text-neutral-100`, dark dropdown trigger hover/active backgrounds, dark dropdown `bg-neutral-900 text-neutral-200 border-neutral-700`, and light link hover/active states. | Static theme values. Controlled only by `Enable theme` (`boolean`). Breadcrumb item content and routes remain route/data-driven; colours are not configurable. |
| PDP | Buybox/purchase card surface and controls | `apps/web/app/components/ui/PurchaseCard/PurchaseCard.vue` | Card keeps default `@md:rounded-md`; optional shadow/border follow existing block configuration with default border `@md:border-neutral-100`; title, labels, links, selects, inputs, table cells, add-to-cart button, wishlist button, review link, and tax/shipping text use default component styling. | Card border switches to `@md:border-neutral-700`; the card receives `bg-neutral-950/85 text-neutral-100`; descendant links, labels, selects, inputs, table text, headers, and cells receive light/dark neutral overrides; product title uses `text-neutral-50`; review counter/link use light neutral text; wishlist and add-to-cart buttons use dark neutral variants; tax/shipping text uses `text-neutral-300` and the shipping link uses light hover states. | Mixed. Existing PriceCard/PurchaseCard block configuration still controls fields, order, wishlist size, drop shadow, borders, border colour, and padding. Theme colours are static and controlled only by `Enable theme` (`boolean`), not by Brand Theme colour inputs. |
| PDP | Customer reviews block wrapper and accordion summary | `apps/web/app/components/blocks/CustomerReview/CustomerReview.vue` | Review area has no forced theme text colour. Collapsible summary uses default `@md:rounded-md w-full hover:bg-neutral-100 py-2 flex justify-between items-center select-none`; headings and no-review text use default colours. | Review area gets `text-[#f2f2f2]`; collapsible summary switches to `bg-[#262626]`, `hover:bg-[#303030]`, `px-4`, `text-[#f2f2f2]`, and `border-[#444444]`; headings use `text-[#f7f7f7]`; no-review text uses `text-[#e5e5e5]`. | Static theme values. Controlled only by `Enable theme` (`boolean`). Existing review block layout/padding/collapsible settings still control structure and spacing; colours are not configurable. |
| PDP | Review statistics summary | `apps/web/app/components/ui/ReviewStatistics/ReviewStatistics.vue` | Average-rating labels, total review count, add-review button, and rating distribution rows use default colours and button styling. | Labels and distribution rows use `text-[#d4d4d4]`; average value uses `text-[#f7f7f7]`; add-review button uses `bg-[#262626]`, hover `#303030`, active `#3a3a3a`, and `text-[#f7f7f7]`. | Static theme values. Controlled only by `Enable theme` (`boolean`). Review values and counts remain API/data-driven; colours are not configurable. |
| PDP | Individual review and reply cards | `apps/web/app/components/ui/Review/Review.vue` | Review cards use default `w-full p-4 mb-4 border rounded-md`; author metadata uses `text-neutral-400`/`text-neutral-700`; verified purchase uses `text-green-800`; edit/delete icons use `fill-primary-700`; date uses `text-neutral-500`; message uses `text-neutral-900`; reply toggle uses black/primary border/link states; reply metadata inherits defaults. | Review card switches to `border-[#3f3f3f] bg-[#171717] text-[#f2f2f2]`; metadata uses greys `#b8b8b8`, `#e5e5e5`, and `#d4d4d4`; verified purchase uses `text-emerald-400`; edit/delete icons use `fill-[#d4d4d4] hover:fill-white`; messages use `text-[#e5e5e5]`; reply toggle uses `border-[#7a7a7a] text-[#e5e5e5] hover:text-white hover:border-white`; add-reply button gets light text states. | Static theme values. Controlled only by `Enable theme` (`boolean`). Review content, visibility/editability, replies, and dates remain data-driven; colours are not configurable. |

## Current limitation

Some changes, especially font-related changes, may only become fully visible after the shop is redeployed. This follows the current upstream Plenty behaviour for settings that affect generated or deployed styling.

If a setting has this limitation, document it in the setting tooltip or nearby helper text so merchants understand why a live preview may not update immediately.

## Future extraction

If PlentyONE exposes an upstream-supported plugin or module mechanism for this kind of styling package, consider extracting this into a broader theme overwrite plugin or module.

Before extraction, review:

- Whether settings can be registered by a module without touching the base theme.
- Whether component overrides can be injected rather than edited in place.
- Whether global CSS can be reduced or replaced by block-level controls.
- Whether store-specific names such as SCREWREBEL should become broader INTRA-TEC naming or fully generic brand-theme naming.
- Whether existing setting keys need aliases or migration support.

Until then, treat this as a local theme feature with a clean toggle boundary.
