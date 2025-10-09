<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
      v-model="font"
      data-testid="font-select"
      :options="fonts"
      :placeholder="getEditorTranslation('placeholder')"
      label="value"
      track-by="caption"
      :allow-empty="false"
      class="cursor-pointer"
      select-label=""
      :deselect-label="getEditorTranslation('deselect-label')"
    />
  </div>
</template>

<script setup lang="ts">
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import type { FontSetting } from './types';

const INDUSTRY_FONT_OPTION: FontSetting = {
  caption: 'Industry',
  value: 'Industry',
};

const normalizeFonts = (fontOptions: FontSetting[] = []) => {
  const withoutIndustry = fontOptions.filter(
    (option) => option?.value?.toLowerCase() !== INDUSTRY_FONT_OPTION.value.toLowerCase(),
  );

  return [INDUSTRY_FONT_OPTION, ...withoutIndustry];
};

const fonts = ref<FontSetting[]>(normalizeFonts());

onMounted(async () => {
  try {
    const response = await fetch('/_nuxt-plenty/editor/fonts.json');
    if (response.ok) {
      const fontOptions: FontSetting[] = await response.json();
      fonts.value = normalizeFonts(fontOptions);
    }
  } catch {
    fonts.value = normalizeFonts();
  }

  const storedFont = getSetting();
  const initialFont = storedFont || INDUSTRY_FONT_OPTION.value;

  if (!storedFont) {
    updateSetting(initialFont);
  }

  loadFont(initialFont);
});

const { updateSetting, getSetting } = useSiteSettings('font');
const { loadFont } = useSiteConfiguration();

const font = computed({
  get: () => {
    return fonts.value.find((f: FontSetting) => f.value === getSetting()) ?? INDUSTRY_FONT_OPTION;
  },
  set: (value: FontSetting) => {
    if (!value?.value) {
      return;
    }

    updateSetting(value.value);
    loadFont(value.value);
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Global fonts",
    "description": "⚠️ This setting will require a shop redeploy to take effect.",
    "tooltip": "Choose one Google Font for all texts. Fonts are served locally to ensure privacy compliance, with no live requests to Google.",
    "placeholder": "Select a font",
    "deselect-label": "Selected"
  },
  "de": {
    "label": "Global fonts",
    "description": "⚠️ This setting will require a shop redeploy to take effect.",
    "tooltip": "Choose one Google Font for all texts. Fonts are served locally to ensure privacy compliance, with no live requests to Google.",
    "placeholder": "Select a font",
    "deselect-label": "Selected"
  }
}
</i18n>
