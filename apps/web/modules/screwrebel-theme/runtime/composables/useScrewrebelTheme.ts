import { SCREWREBEL_THEME_SETTING_KEYS } from '../config/theme';
import { isScrewrebelThemeRoute } from '../utils/theme-routes';
import {
  normalizeThemeColor,
  normalizeThemeTexturePosition,
  normalizeThemeTextureRepeat,
  normalizeThemeTextureSize,
  normalizeThemeTextureUrl,
} from '../utils/theme-values';

const readSetting = <T>(getter: () => T, fallback: T): T => {
  try {
    return getter();
  } catch {
    return fallback;
  }
};

/**
 * Exposes the persisted SCREWREBEL theme state and normalized presentation values.
 */
export const useScrewrebelTheme = () => {
  const route = useRoute();
  const { getBooleanSetting: getEnabled } = useSiteSettings(SCREWREBEL_THEME_SETTING_KEYS.enabled);
  const { getBooleanSetting: getTextureEnabled } = useSiteSettings(SCREWREBEL_THEME_SETTING_KEYS.textureEnabled);
  const { getSetting: getBackgroundColor } = useSiteSettings(SCREWREBEL_THEME_SETTING_KEYS.backgroundColor);
  const { getSetting: getTextureImage } = useSiteSettings(SCREWREBEL_THEME_SETTING_KEYS.textureImage);
  const { getSetting: getTextureSize } = useSiteSettings(SCREWREBEL_THEME_SETTING_KEYS.textureSize);
  const { getSetting: getTextureRepeat } = useSiteSettings(SCREWREBEL_THEME_SETTING_KEYS.textureRepeat);
  const { getSetting: getTexturePosition } = useSiteSettings(SCREWREBEL_THEME_SETTING_KEYS.texturePosition);

  const configured = computed(() => readSetting(getEnabled, false));
  const enabled = computed(() => configured.value && isScrewrebelThemeRoute(route?.path || '/'));
  const textureEnabled = computed(() => enabled.value && readSetting(getTextureEnabled, false));
  const backgroundColor = computed(() => normalizeThemeColor(readSetting(getBackgroundColor, '')));
  const textureImage = computed(() => normalizeThemeTextureUrl(readSetting(getTextureImage, '')));
  const textureSize = computed(() => normalizeThemeTextureSize(readSetting(getTextureSize, '')));
  const textureRepeat = computed(() => normalizeThemeTextureRepeat(readSetting(getTextureRepeat, '')));
  const texturePosition = computed(() => normalizeThemeTexturePosition(readSetting(getTexturePosition, '')));

  return {
    backgroundColor,
    configured,
    enabled,
    textureEnabled,
    textureImage,
    texturePosition,
    textureRepeat,
    textureSize,
  };
};
