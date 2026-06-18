# Dark brand theme

This project uses a removable dark brand layer for the storefront. It is intentionally isolated from most Vue components so upstream PlentyONE Shop updates stay easier to merge.

## Enable or remove it

The theme is loaded in `apps/web/nuxt.config.ts`:

```ts
css: ['~/assets/richtext.css', '~/assets/brand-theme.css']
```

To remove the visual layer from the project, remove `~/assets/brand-theme.css` from that array. To keep the code but disable it at runtime, set `brandThemeEnabled` to `false` in the shop editor or set:

```env
NUXT_PUBLIC_BRAND_THEME_ENABLED=false
```

## Background texture

The default texture is bundled at:

```text
apps/web/public/_nuxt-plenty/images/brand-bg.png
```

The stylesheet references it as:

```css
url('/_nuxt-plenty/images/brand-bg.png')
```

To replace the texture, keep the same filename and dimensions close to the original, or update the URL in `apps/web/app/assets/brand-theme.css`.

## Editable settings

The editor controls live under:

```text
Branding & Design -> Design -> Brand theme
```

The first implementation exposes the stable controls:

- enable or disable the dark brand theme
- enable or disable the bundled texture
- page, surface, raised surface, border, text, muted text, and price colours

Defaults are registered in `apps/web/app/configuration/settings.config.ts`. The runtime CSS variables are injected by `apps/web/app/plugins/06.brand-theme.ts`.

## Upstream-friendly rules

- Prefer changing `brand-theme.css` and the brand settings before editing Vue components.
- Keep colour changes semantic, for example page, surface, border, text, price.
- Use the existing Custom Code CSS area only as an escape hatch for temporary snippets.
- Do not move checkout, payment, cart, or product logic into the theme layer.
- If a component must be touched, keep the change small and use existing local component patterns.
