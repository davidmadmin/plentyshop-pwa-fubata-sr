<template>
  <BrandThemeColorSetting
    setting-key="brandPageColor"
    :label="getEditorTranslation('label')"
    :tooltip="getEditorTranslation('tooltip')"
  />
</template>

<script setup lang="ts"></script>

<i18n lang="json">
{
  "en": {
    "label": "Page background colour",
    "tooltip": "Base colour behind all dark theme pages."
  },
  "de": {
    "label": "Page background colour",
    "tooltip": "Base colour behind all dark theme pages."
  }
}
</i18n>
