export const useBrandingAssetOverrides = () => {
  const runtimeConfig = useRuntimeConfig().public;

  const getEffectiveFavicon = (fallback: string) => runtimeConfig.favicon || fallback;
  const getEffectiveHeaderLogo = (fallback: string) => runtimeConfig.headerLogo || fallback;

  return {
    getEffectiveFavicon,
    getEffectiveHeaderLogo,
  };
};