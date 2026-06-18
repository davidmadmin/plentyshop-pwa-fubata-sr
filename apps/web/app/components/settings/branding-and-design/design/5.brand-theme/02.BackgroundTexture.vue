<template>
  <BrandThemeSwitchSetting
    setting-key="brandBackgroundTextureEnabled"
    :label="getEditorTranslation('label')"
    :tooltip="getEditorTranslation('tooltip')"
  />
</template>

<script setup lang="ts"></script>

<i18n lang="json">
{
  "en": {
    "label": "Use background texture",
    "tooltip": "Shows the bundled dark texture behind shop pages while keeping content on readable surfaces."
  },
  "de": {
    "label": "Use background texture",
    "tooltip": "Shows the bundled dark texture behind shop pages while keeping content on readable surfaces."
  }
}
</i18n>
