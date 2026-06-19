# Styling for SCREWREBEL Store Overwrite Settings

## Purpose

The styling overwrite settings provide a single editor-controlled switch for applying the custom SCREWREBEL storefront theme. Internally this can be described as "Styling for SCREWREBEL Store Overwrite settings".

The current implementation is intentionally local to this theme. It is not an official PlentyONE plugin, because upstream Plenty development does not yet provide a stable plugin capability for this exact kind of storefront-wide styling package.

If upstream support later makes this practical, these changes should be reviewed and refactored into a standalone plugin or module when that provides a cleaner maintenance boundary. At that point the name should also be broadened so it is not tied only to one store.

## What it achieves

The feature adds a merchant-facing theme switch under:

`Branding & design > Design > Brand Theme`

The primary setting is `Enable theme`. When enabled, it applies the custom storefront theme to selected shop surfaces. When disabled, the shop falls back to the default configured styling and rules.

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

## Current limitation

Some changes, especially font-related changes, may only become fully visible after the shop is redeployed. This follows the current upstream Plenty behaviour for settings that affect generated or deployed styling.

If a setting has this limitation, document it in the setting tooltip or nearby helper text so merchants understand why a live preview may not update immediately.

## Future extraction

If PlentyONE exposes an upstream-supported plugin or module mechanism for this kind of styling package, consider extracting this into a broader theme overwrite plugin.

Before extraction, review:

- Whether settings can be registered by a module without touching the base theme.
- Whether component overrides can be injected rather than edited in place.
- Whether global CSS can be reduced or replaced by block-level controls.
- Whether store-specific names such as SCREWREBEL should become generic.
- Whether existing setting keys need aliases or migration support.

Until then, treat this as a local theme feature with a clean toggle boundary.
