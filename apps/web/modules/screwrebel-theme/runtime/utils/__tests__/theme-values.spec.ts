import { SCREWREBEL_THEME_DEFAULTS, SCREWREBEL_THEME_DEFAULT_TEXTURE } from '../../config/theme';
import {
  normalizeThemeColor,
  normalizeThemeTexturePosition,
  normalizeThemeTextureRepeat,
  normalizeThemeTextureSize,
  normalizeThemeTextureUrl,
} from '../theme-values';

describe('SCREWREBEL theme value normalization', () => {
  it('should preserve supported CSS colours', () => {
    expect(normalizeThemeColor('#15181b')).toBe('#15181b');
    expect(normalizeThemeColor('rgb(var(--colors-2-secondary-500))')).toBe(
      SCREWREBEL_THEME_DEFAULTS.brandPageBackgroundColor,
    );
    expect(normalizeThemeColor('var(--shop-background)')).toBe('var(--shop-background)');
  });

  it('should reject unsafe colour input', () => {
    expect(normalizeThemeColor('red; background-image: url(test)')).toBe(
      SCREWREBEL_THEME_DEFAULTS.brandPageBackgroundColor,
    );
  });

  it('should use the supplied fallback for invalid optional colours', () => {
    expect(normalizeThemeColor('', SCREWREBEL_THEME_DEFAULTS.brandContentTextColor)).toBe(
      SCREWREBEL_THEME_DEFAULTS.brandContentTextColor,
    );
  });

  it('should preserve supported texture URLs and reject script URLs', () => {
    expect(normalizeThemeTextureUrl('/images/custom.avif')).toBe('/images/custom.avif');
    expect(normalizeThemeTextureUrl('https://cdn.example.com/texture.avif')).toBe(
      'https://cdn.example.com/texture.avif',
    );
    expect(normalizeThemeTextureUrl('javascript:alert(1)')).toBe(SCREWREBEL_THEME_DEFAULT_TEXTURE);
  });

  it('should restrict texture presentation values to editor options', () => {
    expect(normalizeThemeTextureSize('contain')).toBe('contain');
    expect(normalizeThemeTextureSize('100vw')).toBe(SCREWREBEL_THEME_DEFAULTS.brandBackgroundTextureSize);
    expect(normalizeThemeTextureRepeat('repeat-x')).toBe('repeat-x');
    expect(normalizeThemeTextureRepeat('space')).toBe(SCREWREBEL_THEME_DEFAULTS.brandBackgroundTextureRepeat);
    expect(normalizeThemeTexturePosition('center top')).toBe('center top');
    expect(normalizeThemeTexturePosition('0 0')).toBe(SCREWREBEL_THEME_DEFAULTS.brandBackgroundTexturePosition);
  });
});
