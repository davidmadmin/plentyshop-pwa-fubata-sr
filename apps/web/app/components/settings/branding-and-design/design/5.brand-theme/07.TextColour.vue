<template>
  <BrandThemeColorSetting
    setting-key="brandTextColor"
    :label="getEditorTranslation('label')"
    :tooltip="getEditorTranslation('tooltip')"
  />
</template>

<script setup lang="ts"></script>

<i18n lang="json">
{
  "en": {
    "label": "Text colour",
    "tooltip": "Primary text colour used on dark surfaces."
  },
  "de": {
    "label": "Text colour",
    "tooltip": "Primary text colour used on dark surfaces."
  }
}
</i18n>
