import { getPriceTypographyHead } from '../config/presets';

export default defineNuxtPlugin(() => {
  const { selectedPreset } = usePriceTypography();
  const { getSetting: getGlobalFont } = useSiteSettings('font');

  const headConfig = computed(() => getPriceTypographyHead(selectedPreset.value, getGlobalFont() || 'sans-serif'));

  useHead({
    htmlAttrs: {
      class: computed(() => headConfig.value.htmlClass),
    },
    link: computed(() => headConfig.value.links),
    style: computed(() => headConfig.value.styles),
  });
});
