<template>
  <BrandThemeColorSetting
    setting-key="brandBorderColor"
    :label="getEditorTranslation('label')"
    :tooltip="getEditorTranslation('tooltip')"
  />
</template>

<script setup lang="ts"></script>

<i18n lang="json">
{
  "en": {
    "label": "Border colour",
    "tooltip": "Subtle border colour for dark cards, inputs, dividers, and checkout panels."
  },
  "de": {
    "label": "Border colour",
    "tooltip": "Subtle border colour for dark cards, inputs, dividers, and checkout panels."
  }
}
</i18n>
