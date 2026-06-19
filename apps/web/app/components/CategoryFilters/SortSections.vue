<template>
  <div v-if="shouldRenderFacet">
    <SfAccordionItem v-if="facet" v-model="open">
      <template #summary>
        <div
          :class="[
            'flex justify-between py-1 px-4 mb-2 select-none',
            darkBrandThemeEnabled ? 'bg-neutral-800 text-neutral-100' : 'bg-primary-50/50',
          ]"
        >
          <div class="py-1 rounded-none uppercase typography-headline-6 font-bold tracking-widest select-none">
            {{ facetGetters.getName(facet) }}
          </div>

          <SfIconChevronLeft :class="[darkBrandThemeEnabled ? 'text-neutral-300' : 'text-neutral-500', open ? 'rotate-90' : '-rotate-90']" />
        </div>
      </template>
      <div v-if="facetGetters.getType(facet) === 'feedback'">
        <SfListItem
          v-for="(filter, index) in sortedReviews(facet)"
          :key="index"
          tag="label"
          :class="['mb-3', darkBrandThemeEnabled ? 'text-neutral-200 hover:bg-neutral-800/80 active:bg-neutral-700' : '']"
          size="sm"
        >
          <div class="flex items-center space-x-2">
            <span class="pt-1 flex items-center">
              <SfCheckbox :id="filter.id" v-model="models[filter.id]" :value="filter" @change="facetChange" />
            </span>
            <span class="flex items-center pt-[2px]">
              <SfRating :value="feedbackNumber(filter)" :max="5" />
            </span>
            <span
              :class="[
                'ml-2 pt-1 min-w-[10px] text-base text-center flex items-center justify-center',
                { 'font-medium': feedbackNumber(filter) === 5 },
              ]"
            >
              {{ feedbackNumber(filter) }}
            </span>
            <span v-if="feedbackNumber(filter) != 5" class="ml-1 pt-1 flex items-center">
              <SfIconArrowUpward size="sm" />
            </span>
            <span>
              <SfCounter :class="['ml-1 pt-1 flex items-center text-base', { 'ml-3': feedbackNumber(filter) === 5 }]">
                {{ filter.count }}
              </SfCounter>
            </span>
          </div>
        </SfListItem>
      </div>

      <form v-else-if="facetGetters.getType(facet) === 'price'" class="mb-4 px-4" @submit.prevent="updatePriceFilter">
        <div class="mb-3">
          <label for="min">
            <UiFormLabel :class="['text-start', { 'text-neutral-200': darkBrandThemeEnabled }]">
              {{ t('common.labels.min') }}
            </UiFormLabel>
            <SfInput
              id="min"
              v-model="minPrice"
              :class="darkBrandThemeEnabled ? darkInputClass : ''"
              :wrapper-class="darkBrandThemeEnabled ? darkInputWrapperClass : ''"
              :placeholder="t('common.labels.min')"
            />
          </label>
        </div>
        <div class="mb-3">
          <label for="max">
            <UiFormLabel :class="['text-start', { 'text-neutral-200': darkBrandThemeEnabled }]">
              {{ t('common.labels.max') }}
            </UiFormLabel>
            <SfInput
              id="max"
              v-model="maxPrice"
              :class="darkBrandThemeEnabled ? darkInputClass : ''"
              :wrapper-class="darkBrandThemeEnabled ? darkInputWrapperClass : ''"
              :placeholder="t('common.labels.max')"
            />
          </label>
        </div>
        <div class="flex">
          <UiButton
            type="submit"
            :class="['w-full mr-3 h-10', darkBrandThemeEnabled ? darkApplyButtonClass : '']"
            :disabled="minPrice.length === 0 && maxPrice.length === 0"
            variant="secondary"
          >
            <template #prefix>
              <SfIconCheck />
            </template>
            {{ t('common.actions.apply') }}
          </UiButton>
          <UiButton
            type="reset"
            :class="['h-10', darkBrandThemeEnabled ? darkResetButtonClass : '']"
            variant="secondary"
            :aria-label="t('common.actions.clear')"
            @click="resetPriceFilter"
          >
            <SfIconClose />
          </UiButton>
        </div>
      </form>

      <div v-else class="mb-3">
        <SfListItem
          v-for="(filter, index) in facetGetters.getFilters(facet)"
          :key="index"
          tag="label"
          size="sm"
          :data-testid="'category-filter-' + index"
          :class="[
            'px-1.5',
            darkBrandThemeEnabled
              ? 'text-neutral-200 bg-transparent hover:bg-neutral-800/80 active:bg-neutral-700'
              : 'bg-transparent hover:bg-transparent',
          ]"
        >
          <template #prefix>
            <SfCheckbox
              :id="filter.id"
              v-model="models[filter.id]"
              :value="filter"
              class="flex items-center"
              @change="facetChange"
            />
          </template>
          <p class="select-none">
            <span class="mr-2 text-sm">{{ filter.name ?? '' }}</span>
            <SfCounter size="sm">{{ filter.count ?? 0 }}</SfCounter>
          </p>
        </SfListItem>
      </div>
    </SfAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { type Filter, type FilterGroup, facetGetters } from '@plentymarkets/shop-api';
import {
  SfInput,
  SfIconCheck,
  SfIconClose,
  SfAccordionItem,
  SfIconChevronLeft,
  SfListItem,
  SfRating,
  SfCheckbox,
  SfCounter,
  SfIconArrowUpward,
} from '@storefront-ui/vue';
import type { FilterProps } from '~/components/CategoryFilters/types';
import type { Filters } from '~/composables';
import type { SortFilterContent } from '~/components/blocks/SortFilter/types';
const { getFacetsFromURL, updateFilters, updatePrices } = useCategoryFilter();

const open = ref(true);
const props = defineProps<FilterProps>();
const filters = facetGetters.getFilters(props.facet ?? ({} as FilterGroup)) as Filter[];
const models = ref({} as Filters);
const configuration = computed(() => props.configuration || ({} as SortFilterContent));
const { enabled: darkBrandThemeEnabled } = useDarkBrandTheme();

const darkInputClass =
  '!bg-neutral-900 !text-neutral-100 !ring-neutral-700 placeholder:!text-neutral-500 hover:!ring-neutral-500 active:!ring-neutral-400 focus-within:!ring-neutral-400';
const darkInputWrapperClass =
  '!bg-neutral-900 !text-neutral-100 !ring-neutral-700 hover:!ring-neutral-500 active:!ring-neutral-400 focus-within:!ring-neutral-400 !shadow-none';
const darkApplyButtonClass =
  '!bg-neutral-800 !text-neutral-100 !ring-neutral-700 hover:!bg-neutral-700 hover:!ring-neutral-500 active:!bg-neutral-600 disabled:!bg-neutral-800/50 disabled:!text-neutral-500 disabled:!ring-neutral-700 disabled:!shadow-none';
const darkResetButtonClass =
  '!bg-neutral-900 !text-neutral-300 !ring-neutral-700 hover:!bg-neutral-800 hover:!text-neutral-100 hover:!ring-neutral-500 active:!bg-neutral-700';

const minPrice = ref(getFacetsFromURL().priceMin ?? '');
const maxPrice = ref(getFacetsFromURL().priceMax ?? '');

const updatePriceFilter = () => {
  const min = minPrice.value.length > 0 ? Number(minPrice.value) : Number.NaN;
  const max = maxPrice.value.length > 0 ? Number(maxPrice.value) : Number.NaN;
  const minValue = Number.isNaN(min) ? '' : min.toString();
  const maxValue = Number.isNaN(max) ? '' : max.toString();

  updatePrices(minValue, maxValue);
};

const resetPriceFilter = () => {
  updatePrices('', '');
};

const updateFilter = () => {
  const currentFacets = getFacetsFromURL().facets?.split(',') ?? [];
  for (const filter of filters) {
    const filterId = typeof filter.id === 'string' ? filter.id : filter.id.toString();

    models.value[filterId] = currentFacets.includes(filterId);
  }
};

const facetChange = () => updateFilters(models.value);

updateFilter();

watch(
  () => useRouter().currentRoute.value.query,
  async () => {
    updateFilter();

    minPrice.value = getFacetsFromURL().priceMin ?? '';
    maxPrice.value = getFacetsFromURL().priceMax ?? '';
  },
);
const feedbackNumber = (filter: Filter) => {
  return Number(filter.id.toString().replace('feedback-', ''));
};
const sortedReviews = (facet: FilterGroup): Filter[] =>
  facetGetters.getFilters(facet).sort((a, b) => feedbackNumber(b) - feedbackNumber(a));

const shouldRenderFacet = computed(() => {
  if (!props.facet) return false;
  const type = facetGetters.getType(props.facet);
  return (
    (type === 'feedback' && configuration?.value.fields.itemRating && props.renderKey === 'itemRating') ||
    (type === 'price' && configuration?.value.fields.price && props.renderKey === 'price') ||
    (type === 'availability' && configuration?.value.fields.availability && props.renderKey === 'availability') ||
    (type === 'producer' && configuration?.value.fields.manufacturer && props.renderKey === 'manufacturer') ||
    (type === 'dynamic' && configuration?.value.fields.customizedFilters && props.renderKey === 'customizedFilters')
  );
});
</script>
