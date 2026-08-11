<template>
  <SfListItem
    v-if="name.length > 0"
    size="lg"
    :class="[
      '@md:py-1.5',
      darkBrandThemeEnabled ? 'text-neutral-200 hover:bg-neutral-800/80 active:bg-neutral-700' : '',
      {
        [darkBrandThemeEnabled
          ? 'bg-neutral-800 hover:bg-neutral-800 active:bg-neutral-800 text-white font-medium'
          : 'bg-primary-100 hover:bg-primary-100 active:bg-primary-100 font-medium']: selected,
      },
    ]"
    data-testid="category-tree-item"
  >
    <NuxtLink :to="localePath(href)" class="text-inherit no-underline">
      <span class="flex gap-2 items-center">
        <span class="text-base @md:text-sm capitalize flex items-center" data-testid="list-item-menu-label">
          <slot />
          {{ name }}
        </span>
        <SfCounter v-if="Number(count) > -1" class="@md:text-sm font-normal">{{ count }}</SfCounter>
      </span>
      <SfIconCheck v-if="selected" size="sm" :class="darkBrandThemeEnabled ? 'text-neutral-100' : 'text-primary-500'" />
    </NuxtLink>
  </SfListItem>
</template>

<script setup lang="ts">
import { SfCounter, SfIconCheck, SfListItem } from '@storefront-ui/vue';
import type { CategoryTreeItemType } from '~/components/CategoryTree/types';

const localePath = useLocalePath();
const { enabled: darkBrandThemeEnabled } = useDarkBrandTheme();

defineProps<CategoryTreeItemType>();
</script>
