import {
  getPriceFontPreset,
  PRICE_FONT_DISABLED,
  PRICE_FONT_ROOT_CLASS,
  PRICE_FONT_SETTING_KEY,
  priceFontPresets,
} from '../config/presets';

const readSetting = (getter: () => string): string => {
  try {
    return getter();
  } catch {
    return '';
  }
};

/**
 * Exposes the independently configurable price-font preset.
 */
export const usePriceTypography = () => {
  const { getSetting, updateSetting } = useSiteSettings(PRICE_FONT_SETTING_KEY);
  const selectedPresetId = computed(() => readSetting(getSetting) || PRICE_FONT_DISABLED);

  const selectedPreset = computed(() => getPriceFontPreset(selectedPresetId.value));
  const isEnabled = computed(() => selectedPreset.value !== null);

  const setPreset = (presetId: string) => {
    updateSetting(getPriceFontPreset(presetId) ? presetId : PRICE_FONT_DISABLED);
  };

  return {
    isEnabled,
    priceFontPresets,
    rootClass: PRICE_FONT_ROOT_CLASS,
    selectedPreset,
    selectedPresetId,
    setPreset,
  };
};
