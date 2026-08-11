import { getPriceTypographyHead } from '../config/presets';

export default defineNuxtPlugin(() => {
  const { selectedPreset } = usePriceTypography();
  const { getSetting: getGlobalFont } = useSiteSettings('font');
  const globalFont = computed(() => {
    try {
      return getGlobalFont() || 'sans-serif';
    } catch {
      return 'sans-serif';
    }
  });

  const headConfig = computed(() => getPriceTypographyHead(selectedPreset.value, globalFont.value));

  useHead({
    htmlAttrs: {
      class: computed(() => headConfig.value.htmlClass),
    },
    link: computed(() => headConfig.value.links),
    style: computed(() => headConfig.value.styles),
  });
});
