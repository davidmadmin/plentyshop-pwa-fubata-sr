<template>
  <div v-if="themeEnabled" class="py-2">
    <UiImagePicker
      :label="getEditorTranslation('label')"
      :image="brandBackgroundTextureImage"
      :placeholder="defaultTextureImage"
      :dimensions="getEditorTranslation('description')"
      :tooltip="getEditorTranslation('tooltip')"
      :selected-image-type="'BrandBackgroundTexture'"
      @add="handleImageAdd"
      @delete="deleteTextureImage"
    />
  </div>
</template>

<script setup lang="ts">
const defaultTextureImage = '/_nuxt-plenty/images/brand-theme/dark-texture.avif';

const { updateSetting, getSetting } = useSiteSettings('brandBackgroundTextureImage');
const { enabled: themeEnabled } = useDarkBrandTheme();

const deleteTextureImage = () => {
  updateSetting(defaultTextureImage);
};

const brandBackgroundTextureImage = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const { handleImageAdd } = useImageAdd(brandBackgroundTextureImage);
</script>

<i18n lang="json">
{
  "en": {
    "label": "Background texture image",
    "tooltip": "Select the texture image used by the storefront dark brand theme.",
    "description": "Recommended: dark texture image, 1600 x 1600 px or larger. Use cover/no-repeat for image-like backgrounds and repeat only for seamless patterns."
  },
  "de": {
    "label": "Background texture image",
    "tooltip": "Select the texture image used by the storefront dark brand theme.",
    "description": "Recommended: dark texture image, 1600 x 1600 px or larger. Use cover/no-repeat for image-like backgrounds and repeat only for seamless patterns."
  }
}
</i18n>
