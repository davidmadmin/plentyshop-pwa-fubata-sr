<template>
  <div v-if="themeEnabled" class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-dropdown">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <EditorColorPicker v-model="brandPageBackgroundColor" class="w-full" :show-shop-colors="false">
      <template #trigger="{ color, toggle }">
        <label>
          <SfInput v-model="brandPageBackgroundColor" type="text" data-testid="brand-page-background-color">
            <template #suffix>
              <button
                type="button"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
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

const { updateSetting, getSetting } = useSiteSettings('brandPageBackgroundColor');
const { enabled: themeEnabled } = useDarkBrandTheme();

const brandPageBackgroundColor = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Page background colour",
    "tooltip": "Sets the storefront page background colour used by the dark brand theme."
  },
  "de": {
    "label": "Page background colour",
    "tooltip": "Sets the storefront page background colour used by the dark brand theme."
  }
}
</i18n>
