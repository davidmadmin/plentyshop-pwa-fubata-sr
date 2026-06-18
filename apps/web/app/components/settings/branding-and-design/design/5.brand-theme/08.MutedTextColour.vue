<template>
  <BrandThemeColorSetting
    setting-key="brandMutedTextColor"
    :label="getEditorTranslation('label')"
    :tooltip="getEditorTranslation('tooltip')"
  />
</template>

<script setup lang="ts"></script>

<i18n lang="json">
{
  "en": {
    "label": "Muted text colour",
    "tooltip": "Secondary text colour for hints, breadcrumbs, and supporting details."
  },
  "de": {
    "label": "Muted text colour",
    "tooltip": "Secondary text colour for hints, breadcrumbs, and supporting details."
  }
}
</i18n>
