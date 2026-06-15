<template>
  <div class="flex h-full min-h-0 flex-col justify-center py-4 @md:py-8">
    <div class="mx-auto mb-5 max-w-3xl text-center @md:mb-7">
      <h3 class="text-2xl font-black tracking-tight @md:text-4xl">{{ title }}</h3>
      <p v-if="description" class="mt-2 text-sm leading-6 text-white/60 @md:text-base">{{ description }}</p>
    </div>
    <div class="mx-auto max-h-[480px] w-full max-w-6xl overflow-y-auto px-1 py-1">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; description?: string }>();
</script>
