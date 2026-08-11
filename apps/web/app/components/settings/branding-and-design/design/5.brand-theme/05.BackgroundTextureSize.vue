<template>
  <div v-if="themeEnabled" class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <SfSelect v-model="brandBackgroundTextureSize" data-testid="brand-background-texture-size" class="w-full">
      <option v-for="option in sizeOptions" :key="option" :value="option">
        {{ getEditorTranslation(`option-${option}`) }}
      </option>
    </SfSelect>
    <p class="typography-text-xs text-neutral-700 mt-2">{{ getEditorTranslation('description') }}</p>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('brandBackgroundTextureSize');
const { enabled: themeEnabled } = useDarkBrandTheme();

const sizeOptions = ['cover', 'contain', 'auto'];

const brandBackgroundTextureSize = computed({
  get: () => getSetting() || 'cover',
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Background texture size",
    "description": "Cover is recommended for photographic or large texture images. Auto is useful for small seamless patterns.",
    "option-cover": "Cover",
    "option-contain": "Contain",
    "option-auto": "Original size"
  },
  "de": {
    "label": "Background texture size",
    "description": "Cover is recommended for photographic or large texture images. Auto is useful for small seamless patterns.",
    "option-cover": "Cover",
    "option-contain": "Contain",
    "option-auto": "Original size"
  }
}
</i18n>
