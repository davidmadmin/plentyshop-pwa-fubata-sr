export const SCREWREBEL_THEME_ROOT_CLASS = 'screwrebel-theme';
export const SCREWREBEL_THEME_STYLE_KEY = 'screwrebel-theme-variables';
export const SCREWREBEL_THEME_DEFAULT_TEXTURE = '/images/screwrebel-theme/dark-texture.avif';

export const SCREWREBEL_THEME_DEFAULTS = {
  priceFontPreset: process.env.NUXT_PUBLIC_PRICE_FONT_PRESET || 'disabled',
  enableDarkBrandTheme: process.env.NUXT_PUBLIC_ENABLE_DARK_BRAND_THEME === 'true',
  useBrandBackgroundTexture: process.env.NUXT_PUBLIC_USE_BRAND_BACKGROUND_TEXTURE !== 'false',
  brandPageBackgroundColor: process.env.NUXT_PUBLIC_BRAND_PAGE_BACKGROUND_COLOR || '#050505',
  brandContentTextColor: process.env.NUXT_PUBLIC_BRAND_CONTENT_TEXT_COLOR || '#d4d4d4',
  brandBackgroundTextureImage:
    process.env.NUXT_PUBLIC_BRAND_BACKGROUND_TEXTURE_IMAGE || SCREWREBEL_THEME_DEFAULT_TEXTURE,
  brandBackgroundTextureSize: process.env.NUXT_PUBLIC_BRAND_BACKGROUND_TEXTURE_SIZE || 'cover',
  brandBackgroundTextureRepeat: process.env.NUXT_PUBLIC_BRAND_BACKGROUND_TEXTURE_REPEAT || 'no-repeat',
  brandBackgroundTexturePosition: process.env.NUXT_PUBLIC_BRAND_BACKGROUND_TEXTURE_POSITION || 'center center',
} as const;

export const SCREWREBEL_THEME_SETTING_KEYS = {
  enabled: 'enableDarkBrandTheme',
  textureEnabled: 'useBrandBackgroundTexture',
  backgroundColor: 'brandPageBackgroundColor',
  contentTextColor: 'brandContentTextColor',
  textureImage: 'brandBackgroundTextureImage',
  textureSize: 'brandBackgroundTextureSize',
  textureRepeat: 'brandBackgroundTextureRepeat',
  texturePosition: 'brandBackgroundTexturePosition',
} as const;
