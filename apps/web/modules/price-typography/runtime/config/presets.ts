export type PriceFontPreset = {
  id: string;
  label: string;
  provider: 'adobe';
  stylesheetUrl: string;
  family: string;
  weight: number;
  style: 'normal' | 'italic';
};

export const PRICE_FONT_SETTING_KEY = 'priceFontPreset';
export const PRICE_FONT_DISABLED = 'disabled';
export const PRICE_FONT_ROOT_CLASS = 'price-font-preset-active';

export const priceFontPresets = {
  'industry-demi': {
    id: 'industry-demi',
    label: 'Industry Demi',
    provider: 'adobe',
    stylesheetUrl: 'https://use.typekit.net/jue4aze.css',
    family: 'industry',
    weight: 600,
    style: 'normal',
  },
} as const satisfies Record<string, PriceFontPreset>;

export type PriceFontPresetId = keyof typeof priceFontPresets;

export const getPriceFontPreset = (presetId: string): PriceFontPreset | null =>
  priceFontPresets[presetId as PriceFontPresetId] ?? null;

export const getPriceTypographyHead = (preset: PriceFontPreset | null, globalFontFamily: string) => ({
  htmlClass: preset ? PRICE_FONT_ROOT_CLASS : undefined,
  links: preset
    ? [
        {
          key: 'price-typography-font',
          rel: 'stylesheet',
          href: preset.stylesheetUrl,
        },
      ]
    : [],
  styles: preset
    ? [
        {
          key: 'price-typography-variables',
          textContent: `:root {
  --price-font-family: "${preset.family}", "${globalFontFamily.replaceAll('"', '\\"')}", sans-serif;
  --price-font-weight: ${preset.weight};
  --price-font-style: ${preset.style};
}`,
        },
      ]
    : [],
});
