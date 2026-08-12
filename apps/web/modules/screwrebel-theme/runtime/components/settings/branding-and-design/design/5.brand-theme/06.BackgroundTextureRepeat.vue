<template>
  <div v-if="themeEnabled" class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <SfSelect v-model="brandBackgroundTextureRepeat" data-testid="brand-background-texture-repeat" class="w-full">
      <option v-for="option in repeatOptions" :key="option" :value="option">
        {{ getEditorTranslation(`option-${option}`) }}
      </option>
    </SfSelect>
    <p class="typography-text-xs text-neutral-700 mt-2">{{ getEditorTranslation('description') }}</p>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('brandBackgroundTextureRepeat');
const { configured: themeEnabled } = useScrewrebelTheme();

const repeatOptions = ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'];

const brandBackgroundTextureRepeat = computed({
  get: () => getSetting() || 'no-repeat',
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Background texture repeat",
    "description": "No repeat avoids visible tiling. Use repeat only for truly seamless pattern images.",
    "option-no-repeat": "No repeat",
    "option-repeat": "Repeat",
    "option-repeat-x": "Repeat horizontally",
    "option-repeat-y": "Repeat vertically"
  },
  "de": {
    "label": "Hintergrundtextur wiederholen",
    "description": "Keine Wiederholung vermeidet sichtbare Kacheln. Wiederholung nur für wirklich nahtlose Muster verwenden.",
    "option-no-repeat": "Nicht wiederholen",
    "option-repeat": "Wiederholen",
    "option-repeat-x": "Horizontal wiederholen",
    "option-repeat-y": "Vertikal wiederholen"
  }
}
</i18n>
