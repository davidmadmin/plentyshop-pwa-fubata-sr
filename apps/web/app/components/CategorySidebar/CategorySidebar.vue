<template>
  <transition
    enter-active-class="transition duration-500 ease-in-out"
    leave-active-class="transition duration-500 ease-in-out"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <SfDrawer
      v-show="isOpen"
      :model-value="true"
      :disable-click-away="true"
      :disable-esc="true"
      :class="[
        'w-full rounded shadow-none @md:translate-x-0 z-editor-toolbar @md:z-base @md:static @md:!block -translate-x-full shrink-0 overflow-y-auto',
        darkBrandThemeEnabled ? 'bg-neutral-950/90 text-neutral-100' : 'bg-white',
      ]"
      data-testid="category-sidebar"
    >
      <div class="grid grid-rows-category-sidebar @md:h-full @md:block">
        <div class="p-4 flex justify-between items-center @md:hidden">
          <span class="font-bold text-lg">{{ t('common.labels.listSettings') }}</span>
          <UiButton
            variant="tertiary"
            :class="darkBrandThemeEnabled ? 'text-neutral-200 hover:bg-neutral-800' : ''"
            :aria-label="t('common.navigation.closeListSettings')"
            @click="$emit('close')"
          >
            <template #prefix>
              <SfIconClose :class="darkBrandThemeEnabled ? 'text-neutral-300' : 'text-neutral-500'" />
            </template>
          </UiButton>
        </div>
        <slot class="overflow-y-auto @md:overflow-y-visible py-4 @md:p-0" />
        <div
          :class="[
            'p-4 @md:mt-2 flex flex-wrap justify-between border-t @md:border-0 gap-3',
            darkBrandThemeEnabled ? 'border-t-neutral-700' : 'border-t-neutral-200',
          ]"
        >
          <UiButton class="@md:hidden whitespace-nowrap flex flex-1" variant="primary" @click="$emit('close')">
            {{ t('common.actions.showProducts') }}
          </UiButton>
        </div>
      </div>
    </SfDrawer>
  </transition>
</template>

<script setup lang="ts">
import { SfDrawer, SfIconClose } from '@storefront-ui/vue';
import type { CategorySidebarEmits, CategorySidebarProps } from '~/components/CategorySidebar/types';

defineProps<CategorySidebarProps>();
defineEmits<CategorySidebarEmits>();
const { enabled: darkBrandThemeEnabled } = useDarkBrandTheme();
</script>
