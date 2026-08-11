<template>
  <div v-if="themeEnabled" class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-dropdown">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <EditorColorPicker v-model="brandContentTextColor" class="w-full" :show-shop-colors="false">
      <template #trigger="{ color, toggle }">
        <label>
          <SfInput v-model="brandContentTextColor" type="text" data-testid="brand-content-text-color">
            <template #suffix>
              <button
                type="button"
                class="border border-neutral-400 rounded-lg cursor-pointer w-10 h-8"
                :style="{ backgroundColor: color }"
                @mousedown.stop
                @click.stop="toggle"
              />
            </template>
          </SfInput>
        </label>
      </template>
    </EditorColorPicker>
  </div>
</template>

<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('brandContentTextColor');
const { configured: themeEnabled } = useScrewrebelTheme();

const brandContentTextColor = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Standard content text colour",
    "tooltip": "Sets the readable fallback used when a standard text card still has the editor's default black text colour. Explicitly selected non-black widget colours remain unchanged."
  },
  "de": {
    "label": "Standard-Inhaltstextfarbe",
    "tooltip": "Legt die lesbare Ersatzfarbe fest, wenn eine Standard-Textkarte noch die schwarze Standardfarbe des Editors verwendet. Bewusst gewählte, nicht schwarze Widget-Farben bleiben unverändert."
  }
}
</i18n>
