import { SCREWREBEL_THEME_DEFAULTS, SCREWREBEL_THEME_DEFAULT_TEXTURE } from '../config/theme';

const CSS_COLOR_PATTERN = /^(#[\da-f]{3,8}|rgba?\([\d\s.,%+-]+\)|hsla?\([\d\s.,%+-]+\)|var\(--[\w-]+\))$/i;
const TEXTURE_SIZE_VALUES = new Set(['cover', 'contain', 'auto']);
const TEXTURE_REPEAT_VALUES = new Set(['no-repeat', 'repeat', 'repeat-x', 'repeat-y']);
const TEXTURE_POSITION_VALUES = new Set([
  'center center',
  'center top',
  'center bottom',
  'left center',
  'right center',
]);

/**
 * Returns a safe CSS colour or the configured module default.
 */
export const normalizeThemeColor = (value: string): string =>
  CSS_COLOR_PATTERN.test(value.trim()) ? value.trim() : SCREWREBEL_THEME_DEFAULTS.brandPageBackgroundColor;

/**
 * Returns a safe local, remote or image data URL for use inside CSS url().
 */
export const normalizeThemeTextureUrl = (value: string): string => {
  const trimmedValue = value.trim();
  if (!/^(\/|https?:\/\/|data:image\/)/i.test(trimmedValue)) {
    return SCREWREBEL_THEME_DEFAULT_TEXTURE;
  }
  return trimmedValue.replace(/["\\\n\r]/g, (character) => `\\${character}`);
};

/**
 * Restricts background-size to values exposed by the editor setting.
 */
export const normalizeThemeTextureSize = (value: string): string =>
  TEXTURE_SIZE_VALUES.has(value) ? value : SCREWREBEL_THEME_DEFAULTS.brandBackgroundTextureSize;

/**
 * Restricts background-repeat to values exposed by the editor setting.
 */
export const normalizeThemeTextureRepeat = (value: string): string =>
  TEXTURE_REPEAT_VALUES.has(value) ? value : SCREWREBEL_THEME_DEFAULTS.brandBackgroundTextureRepeat;

/**
 * Restricts background-position to values exposed by the editor setting.
 */
export const normalizeThemeTexturePosition = (value: string): string =>
  TEXTURE_POSITION_VALUES.has(value) ? value : SCREWREBEL_THEME_DEFAULTS.brandBackgroundTexturePosition;
