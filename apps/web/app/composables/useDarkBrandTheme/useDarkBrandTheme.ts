export const useDarkBrandTheme = () => {
  const { getSetting } = useSiteSettings('enableDarkBrandTheme');

  const enabled = computed(() => String(getSetting()) === 'true');

  return { enabled };
};
