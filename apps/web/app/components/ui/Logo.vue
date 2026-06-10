<template>
  <picture>
    <template v-if="imageExtension === 'svg'">
      <NuxtImg
        ref="logo"
        :src="headerLogo"
        :alt="`${storeName} logo`"
        class="h-[40px] md:h-[48px] w-auto max-w-[220px] md:max-w-[260px] object-contain"
        width="335"
        height="150"
        preload
      />
    </template>
    <template v-else>
      <img
        id="logo"
        ref="logo"
        :src="headerLogo"
        :alt="`${storeName} logo`"
        :width="imgWidth"
        :height="imgHeight"
        class="h-[40px] md:h-[48px] w-auto max-w-[220px] md:max-w-[260px] object-contain"
        preload
      />
    </template>
  </picture>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const { getSetting: getHeaderLogo } = useSiteSettings('headerLogo');
const { getEffectiveHeaderLogo } = useBrandingAssetOverrides();

const headerLogo = computed(() => getEffectiveHeaderLogo(getHeaderLogo()));

const storeName = runtimeConfig.public.storename;

const imageExtension = computed(() => headerLogo.value.split('.').pop());
const logo = ref<HTMLImageElement | null>(null);
const imgWidth = ref<string>('');
const imgHeight = ref<string>('');
onMounted(() => {
  if (logo.value) {
    imgWidth.value = logo.value.clientWidth + '';
    imgHeight.value = logo.value.clientHeight + '';
  }
});
</script>
