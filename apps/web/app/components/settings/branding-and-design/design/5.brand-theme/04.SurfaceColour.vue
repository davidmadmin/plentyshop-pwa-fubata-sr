<template>
  <BrandThemeColorSetting
    setting-key="brandSurfaceColor"
    :label="getEditorTranslation('label')"
    :tooltip="getEditorTranslation('tooltip')"
  />
</template>

<script setup lang="ts"></script>

<i18n lang="json">
{
  "en": {
    "label": "Surface colour",
    "tooltip": "Default dark colour for panels, filters, and product cards."
  },
  "de": {
    "label": "Surface colour",
    "tooltip": "Default dark colour for panels, filters, and product cards."
  }
}
</i18n>
