import { SCREWREBEL_THEME_ROOT_CLASS, SCREWREBEL_THEME_STYLE_KEY } from '../config/theme';

export default defineNuxtPlugin(() => {
  const {
    backgroundColor,
    contentTextColor,
    enabled,
    textureEnabled,
    textureImage,
    texturePosition,
    textureRepeat,
    textureSize,
  } = useScrewrebelTheme();

  const variables = computed(
    () => `:root {
  --screwrebel-theme-background-color: ${backgroundColor.value};
  --screwrebel-theme-content-text-color: ${contentTextColor.value};
  --screwrebel-theme-background-image: ${textureEnabled.value ? `url("${textureImage.value}")` : 'none'};
  --screwrebel-theme-background-position: ${texturePosition.value};
  --screwrebel-theme-background-repeat: ${textureRepeat.value};
  --screwrebel-theme-background-size: ${textureSize.value};
}`,
  );

  useHead({
    bodyAttrs: {
      class: computed(() => (enabled.value ? SCREWREBEL_THEME_ROOT_CLASS : undefined)),
    },
    style: computed(() =>
      enabled.value
        ? [
            {
              key: SCREWREBEL_THEME_STYLE_KEY,
              textContent: variables.value,
            },
          ]
        : [],
    ),
  });
});
