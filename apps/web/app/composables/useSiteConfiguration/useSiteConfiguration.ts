import type {
  UseSiteConfigurationReturn,
  UseSiteConfigurationState,
  LoadFont,
  DrawerView,
  SettingsType,
  SetActiveSetting,
} from '~/composables/useSiteConfiguration/types';
import type { Block, CategoryTreeItem } from '@plentymarkets/shop-api';

const INDUSTRY_FONT_NAME = 'industry';
const INDUSTRY_STYLESHEET_URL = 'https://use.typekit.net/jej3tln.css';

const createFontStyle = (fontName?: string) => {
  const normalizedFontName = fontName?.trim();

  if (!normalizedFontName) {
    return '';
  }

  const isIndustryFont = normalizedFontName.toLowerCase() === INDUSTRY_FONT_NAME;
  const resolvedFontName = isIndustryFont ? INDUSTRY_FONT_NAME : normalizedFontName;

  return `font-family: '${resolvedFontName}', sans-serif`;
};

const ensureStylesheetAppended = (href: string) => {
  if (!import.meta.client || !href) {
    return;
  }

  const existingLink = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).find(
    (link) => link.href === href,
  );

  if (existingLink) {
    return;
  }

  const link = document.createElement('link');
  link.href = href;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

/**
 * @description Composable for managing site configuration.
 * @returns UseSiteConfigurationReturn
 * @example
 * ``` ts
 * const { data, drawerOpen, loading, currentFont, drawerView, settingsIsDirty, saveSettings } = UseSiteConfiguration();
 * ```
 */
export const useSiteConfiguration: UseSiteConfigurationReturn = () => {
  const runtimeFont = useRuntimeConfig().public.font as string | undefined;
  const state = useState<UseSiteConfigurationState>('siteConfiguration', () => ({
    data: [],
    drawerOpen: false,
    pageModalOpen: false,
    settingsCategory: null,
    settingsType: null,
    loading: false,
    placement: 'left',
    newBlockPosition: 0,
    currentFont: createFontStyle(runtimeFont),
    drawerView: null,
    activeSetting: '',
    activeSubCategory: '',
    blockType: '',
    blockUuid: '',
  }));

  if (import.meta.client && runtimeFont?.toLowerCase() === INDUSTRY_FONT_NAME) {
    ensureStylesheetAppended(INDUSTRY_STYLESHEET_URL);
  }

  /**
   * @description Function for loading a font in the editor preview.
   * @return LoadFont
   * @example
   * ``` ts
   * loadFont('Jersey 10');
   * ```
   */
  const loadFont: LoadFont = (fontName: string) => {
    if (!fontName) {
      return;
    }

    const normalizedFontName = fontName.trim();

    if (!normalizedFontName) {
      return;
    }

    const isIndustryFont = normalizedFontName.toLowerCase() === INDUSTRY_FONT_NAME;

    const stylesheetHref = isIndustryFont
      ? INDUSTRY_STYLESHEET_URL
      : `https://fonts.googleapis.com/css2?family=${encodeURIComponent(normalizedFontName)}:wght@400;700&display=swap`;

    ensureStylesheetAppended(stylesheetHref);

    state.value.currentFont = isIndustryFont
      ? `font-family: '${INDUSTRY_FONT_NAME}', sans-serif`
      : createFontStyle(normalizedFontName);
  };

  const openDrawerWithView = (view: DrawerView, block?: Block) => {
    if (block) {
      state.value.blockType = block.name;
      state.value.blockUuid = block.meta.uuid;
    }

    state.value.drawerView = view;
    state.value.drawerOpen = true;
    state.value.activeSetting = '';

    state.value.placement = view === 'blocksSettings' ? 'right' : 'left';
  };

  const closeDrawer = () => {
    state.value.drawerOpen = false;
    state.value.drawerView = null;
    state.value.activeSetting = '';
  };

  const updateNewBlockPosition = (position: number) => {
    state.value.newBlockPosition = position;
  };

  const togglePageModal = (value: boolean) => {
    state.value.pageModalOpen = value;
  };

  const setSettingsCategory = (category: CategoryTreeItem | null, settingsType?: SettingsType) => {
    state.value.settingsType = settingsType || null;
    state.value.settingsCategory = category;
  };

  const setActiveSubCategory = (subCategory: string) => {
    state.value.activeSubCategory = subCategory;
  };

  const setActiveSetting: SetActiveSetting = (setting: string) => {
    state.value.activeSubCategory = '';
    state.value.activeSetting = setting;
    state.value.drawerOpen = true;
    state.value.placement = 'left';
    state.value.drawerView = null;
  };

  return {
    ...toRefs(state.value),
    updateNewBlockPosition,
    loadFont,
    openDrawerWithView,
    closeDrawer,
    togglePageModal,
    setSettingsCategory,
    setActiveSubCategory,
    setActiveSetting,
  };
};
