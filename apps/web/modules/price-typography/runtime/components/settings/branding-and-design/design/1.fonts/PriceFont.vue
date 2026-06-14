<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel for="price-font-preset">{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" placement="top" :show-arrow="true" class="ml-2 z-dropdown">
        <SfIconInfo size="sm" />
      </SfTooltip>
    </div>

    <select
      id="price-font-preset"
      v-model="priceFontPreset"
      data-testid="price-font-preset"
      class="w-full rounded-md border border-neutral-300 bg-white px-3 py-2"
    >
      <option :value="PRICE_FONT_DISABLED">{{ getEditorTranslation('disabled') }}</option>
      <option v-for="preset in priceFontPresets" :key="preset.id" :value="preset.id">
        {{ preset.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import { PRICE_FONT_DISABLED } from '../../../../../config/presets';

const { priceFontPresets, selectedPresetId, setPreset } = usePriceTypography();

const priceFontPreset = computed({
  get: () => selectedPresetId.value,
  set: (value: string) => setPreset(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Price font",
    "tooltip": "Apply an approved Adobe font preset only to storefront prices and totals.",
    "disabled": "Disabled"
  },
  "de": {
    "label": "Preisschrift",
    "tooltip": "Wendet eine freigegebene Adobe-Schrift ausschließlich auf Preise und Summen im Shop an.",
    "disabled": "Deaktiviert"
  }
}
</i18n>
