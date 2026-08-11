<template>
  <div v-if="themeEnabled" class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <SfSelect v-model="brandBackgroundTexturePosition" data-testid="brand-background-texture-position" class="w-full">
      <option v-for="option in positionOptions" :key="option.value" :value="option.value">
        {{ getEditorTranslation(`option-${option.key}`) }}
      </option>
    </SfSelect>
    <p class="typography-text-xs text-neutral-700 mt-2">{{ getEditorTranslation('description') }}</p>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('brandBackgroundTexturePosition');
const { enabled: themeEnabled } = useDarkBrandTheme();

const positionOptions = [
  { key: 'center', value: 'center center' },
  { key: 'top', value: 'center top' },
  { key: 'bottom', value: 'center bottom' },
  { key: 'left', value: 'left center' },
  { key: 'right', value: 'right center' },
];

const brandBackgroundTexturePosition = computed({
  get: () => getSetting() || 'center center',
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Background texture position",
    "description": "Controls which part of a covered background image remains visually centered.",
    "option-center": "Center",
    "option-top": "Top",
    "option-bottom": "Bottom",
    "option-left": "Left",
    "option-right": "Right"
  },
  "de": {
    "label": "Background texture position",
    "description": "Controls which part of a covered background image remains visually centered.",
    "option-center": "Center",
    "option-top": "Top",
    "option-bottom": "Bottom",
    "option-left": "Left",
    "option-right": "Right"
  }
}
</i18n>
