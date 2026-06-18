const BRAND_DEFAULTS = {
  page: '#050505',
  surface: '#111315',
  raisedSurface: '#181b1f',
  border: '#343a40',
  text: '#f4f4f5',
  mutedText: '#b9c0c8',
  price: '#ff5a4f',
};

const normalizeBooleanSetting = (value: unknown, fallback = false) => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return fallback;

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

const sanitizeCssValue = (value: unknown, fallback: string) => {
  const raw = String(value || fallback).trim();

  if (!raw || /[;{}<>]/.test(raw)) return fallback;

  return raw;
};

export default defineNuxtPlugin({
  name: 'brand-theme',
  setup() {
    const { $isPreview } = useNuxtApp();
    const {
      public: { isPreview: isPreviewConfig },
    } = useRuntimeConfig();
    const { getSetting: getThemeEnabled } = useSiteSettings('brandThemeEnabled');
    const { getSetting: getTextureEnabled } = useSiteSettings('brandBackgroundTextureEnabled');
    const { getSetting: getPageColor } = useSiteSettings('brandPageColor');
    const { getSetting: getSurfaceColor } = useSiteSettings('brandSurfaceColor');
    const { getSetting: getRaisedSurfaceColor } = useSiteSettings('brandRaisedSurfaceColor');
    const { getSetting: getBorderColor } = useSiteSettings('brandBorderColor');
    const { getSetting: getTextColor } = useSiteSettings('brandTextColor');
    const { getSetting: getMutedTextColor } = useSiteSettings('brandMutedTextColor');
    const { getSetting: getPriceColor } = useSiteSettings('brandPriceColor');

    const isEditorMode = computed(() => Boolean(isPreviewConfig) || Boolean($isPreview));
    const themeConfigured = computed(() => normalizeBooleanSetting(getThemeEnabled(), true));
    const brandThemeEnabled = computed(() => themeConfigured.value && !isEditorMode.value);
    const brandThemeEditorPreviewEnabled = computed(() => themeConfigured.value && isEditorMode.value);
    const textureEnabled = computed(() => normalizeBooleanSetting(getTextureEnabled(), true));

    const brandVariables = computed(() => {
      const page = sanitizeCssValue(getPageColor(), BRAND_DEFAULTS.page);
      const surface = sanitizeCssValue(getSurfaceColor(), BRAND_DEFAULTS.surface);
      const raisedSurface = sanitizeCssValue(getRaisedSurfaceColor(), BRAND_DEFAULTS.raisedSurface);
      const border = sanitizeCssValue(getBorderColor(), BRAND_DEFAULTS.border);
      const text = sanitizeCssValue(getTextColor(), BRAND_DEFAULTS.text);
      const mutedText = sanitizeCssValue(getMutedTextColor(), BRAND_DEFAULTS.mutedText);
      const price = sanitizeCssValue(getPriceColor(), BRAND_DEFAULTS.price);

      return [
        `--brand-page: ${page}`,
        `--brand-surface: ${surface}`,
        `--brand-surface-raised: ${raisedSurface}`,
        `--brand-surface-soft: color-mix(in srgb, ${raisedSurface} 76%, white 24%)`,
        `--brand-border: ${border}`,
        `--brand-text: ${text}`,
        `--brand-text-muted: ${mutedText}`,
        `--brand-text-subtle: color-mix(in srgb, ${mutedText} 70%, ${page} 30%)`,
        `--brand-price: ${price}`,
        `--brand-success-bg: #102418`,
        `--brand-success: #8de8a3`,
        `--brand-cta: #f4f4f5`,
        `--brand-cta-hover: #dfe3e7`,
        `--brand-cta-text: #050505`,
      ].join(';');
    });

    useHead({
      htmlAttrs: {
        class: computed(() =>
          [
            brandThemeEnabled.value ? 'brand-theme-enabled' : 'brand-theme-disabled',
            brandThemeEditorPreviewEnabled.value ? 'brand-theme-editor-preview' : '',
            (brandThemeEnabled.value || brandThemeEditorPreviewEnabled.value) && textureEnabled.value
              ? 'brand-theme-texture'
              : '',
          ]
            .filter(Boolean)
            .join(' '),
        ),
      },
      style: [
        {
          id: 'brand-theme-vars',
          innerHTML: computed(() => `:root { ${brandVariables.value}; }`),
        },
      ],
    });
  },
});
