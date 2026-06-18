<template>
  <BrandThemeColorSetting
    setting-key="brandRaisedSurfaceColor"
    :label="getEditorTranslation('label')"
    :tooltip="getEditorTranslation('tooltip')"
  />
</template>

<script setup lang="ts"></script>

<i18n lang="json">
{
  "en": {
    "label": "Raised surface colour",
    "tooltip": "Slightly brighter colour for active controls, inputs, and prominent cards."
  },
  "de": {
    "label": "Raised surface colour",
    "tooltip": "Slightly brighter colour for active controls, inputs, and prominent cards."
  }
}
</i18n>
