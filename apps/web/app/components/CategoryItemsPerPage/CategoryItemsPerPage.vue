<template>
  <div class="w-full" data-testid="category-items-per-page">
    <div
      v-if="!selectionModeCompact"
      :class="[
        'mb-4 px-4 py-2 rounded-none uppercase typography-headline-6 font-bold tracking-widest select-none',
        darkBrandThemeEnabled ? 'bg-neutral-800 text-neutral-100' : 'bg-primary-50/50',
      ]"
    >
      {{ t('common.labels.perPage') }}
    </div>
    <div class="px-4">
      <SfSelect
        id="perPage"
        v-model="selected"
        :class="
          darkBrandThemeEnabled
            ? '!bg-neutral-900 !text-neutral-100 !ring-neutral-700 hover:!ring-neutral-500 active:!ring-neutral-400 focus:!ring-neutral-400'
            : ''
        "
        :aria-label="t('common.labels.perPage')"
        @change="updateItemsPerPage(Number(selected))"
      >
        <option v-if="selectionModeCompact" value="" disabled hidden>
          {{ t('common.labels.perPage') }}
        </option>
        <option v-for="{ value, label, disabled } in options" :key="value" :value="value" :disabled="disabled">
          {{ label }}
        </option>
      </SfSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
import type { CategoryItemsPerPageProps, Option } from '~/components/CategoryItemsPerPage/types';
import { defaults } from '~/composables';

const props = defineProps<CategoryItemsPerPageProps & { selectionModeCompact?: boolean }>();
const { enabled: darkBrandThemeEnabled } = useDarkBrandTheme();

const { updateItemsPerPage: updateItemsPerPageFromComposable, getFacetsFromURL } = useCategoryFilter();
const selectionModeCompact = computed(() => props.selectionModeCompact ?? false);

const options = ref(
  defaults.PER_PAGE_STEPS.map((o: number) => ({ label: o.toString(), value: o.toString(), disabled: false })),
);

let firstHigherValueOptionFound = false;

options.value = options.value.map((option) => {
  if (Number(option.value) < props.totalProducts || !firstHigherValueOptionFound) {
    if (Number(option.value) > props.totalProducts) {
      firstHigherValueOptionFound = true;
    }
    return { ...option, disabled: false };
  } else {
    return { ...option, disabled: true };
  }
});

const lastDisabledValue =
  options.value.findLast((op: Option) => !op.disabled)?.value || defaults.DEFAULT_ITEMS_PER_PAGE.toString();

const facetsFromURL = getFacetsFromURL();
const selectedValue =
  facetsFromURL.itemsPerPage && facetsFromURL.itemsPerPage > Number(lastDisabledValue)
    ? lastDisabledValue
    : facetsFromURL.itemsPerPage?.toString() || lastDisabledValue;

const selected = ref(selectedValue);
watch(
  selectionModeCompact,
  (on) => {
    if (on) {
      selected.value = '';
    } else {
      if (!selected.value) {
        selected.value = lastDisabledValue;
      }
    }
  },
  { immediate: true },
);

const updateItemsPerPage = (itemsPerPage: number): void => {
  if (!itemsPerPage) return;
  updateItemsPerPageFromComposable(itemsPerPage);
};
</script>
