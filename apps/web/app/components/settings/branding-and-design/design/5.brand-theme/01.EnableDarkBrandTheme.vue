<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel class="mb-1">
        {{ getEditorTranslation('label') }}
        <SfTooltip
          :label="getEditorTranslation('tooltip')"
          :placement="'top'"
          :show-arrow="true"
          class="ml-2 z-dropdown"
        >
          <SfIconInfo :size="'sm'" />
        </SfTooltip>
      </UiFormLabel>
      <SfSwitch
        v-model="enableDarkBrandTheme"
        data-testid="enable-dark-brand-theme"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconInfo, SfSwitch, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('enableDarkBrandTheme');

const enableDarkBrandTheme = computed({
  get: () => String(getSetting()) === 'true',
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Enable dark brand theme",
    "tooltip": "Turns on the dark brand theme for the storefront. The editor interface keeps its default styling."
  },
  "de": {
    "label": "Enable dark brand theme",
    "tooltip": "Turns on the dark brand theme for the storefront. The editor interface keeps its default styling."
  }
}
</i18n>
