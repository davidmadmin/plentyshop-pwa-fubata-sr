<template>
  <BrandThemeSwitchSetting
    setting-key="brandThemeEnabled"
    :label="getEditorTranslation('label')"
    :tooltip="getEditorTranslation('tooltip')"
  />
</template>

<script setup lang="ts"></script>

<i18n lang="json">
{
  "en": {
    "label": "Enable dark brand theme",
    "tooltip": "Turns the removable dark brand theme layer on or off."
  },
  "de": {
    "label": "Enable dark brand theme",
    "tooltip": "Turns the removable dark brand theme layer on or off."
  }
}
</i18n>
