<template>
  <BrandThemeColorSetting
    setting-key="brandPriceColor"
    :label="getEditorTranslation('label')"
    :tooltip="getEditorTranslation('tooltip')"
  />
</template>

<script setup lang="ts"></script>

<i18n lang="json">
{
  "en": {
    "label": "Price colour",
    "tooltip": "High-priority colour for product prices on dark surfaces."
  },
  "de": {
    "label": "Price colour",
    "tooltip": "High-priority colour for product prices on dark surfaces."
  }
}
</i18n>
