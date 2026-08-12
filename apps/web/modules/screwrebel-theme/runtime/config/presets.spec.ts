import { describe, expect, it } from 'vitest';
import {
  getPriceFontPreset,
  getPriceTypographyHead,
  PRICE_FONT_DISABLED,
  PRICE_FONT_ROOT_CLASS,
  PRICE_FONT_SETTING_KEY,
  priceFontPresets,
} from './presets';

describe('price typography presets', () => {
  it('defines the approved Industry Demi Adobe preset', () => {
    expect(priceFontPresets['industry-demi']).toEqual({
      id: 'industry-demi',
      label: 'Industry Demi',
      provider: 'adobe',
      stylesheetUrl: 'https://use.typekit.net/jue4aze.css',
      family: 'industry',
      weight: 600,
      style: 'normal',
    });
  });

  it('returns null for disabled and unknown presets', () => {
    expect(getPriceFontPreset(PRICE_FONT_DISABLED)).toBeNull();
    expect(getPriceFontPreset('unknown')).toBeNull();
  });

  it('keeps the persistence and activation contracts stable', () => {
    expect(PRICE_FONT_SETTING_KEY).toBe('priceFontPreset');
    expect(PRICE_FONT_ROOT_CLASS).toBe('price-font-preset-active');
  });

  it('builds one Adobe request and price-only variables when enabled', () => {
    const head = getPriceTypographyHead(priceFontPresets['industry-demi'], 'Red Hat Text');

    expect(head.htmlClass).toBe(PRICE_FONT_ROOT_CLASS);
    expect(head.links).toEqual([
      {
        key: 'price-typography-font',
        rel: 'stylesheet',
        href: 'https://use.typekit.net/jue4aze.css',
      },
    ]);
    expect(head.styles[0]?.textContent).toContain('--price-font-family: "industry", "Red Hat Text", sans-serif');
    expect(head.styles[0]?.textContent).toContain('--price-font-weight: 600');
  });

  it('emits no Adobe resources when disabled', () => {
    expect(getPriceTypographyHead(null, 'Red Hat Text')).toEqual({
      htmlClass: undefined,
      links: [],
      styles: [],
    });
  });
});
