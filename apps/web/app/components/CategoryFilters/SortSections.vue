<template>
  <div v-if="shouldRenderFacet">
    <SfAccordionItem v-if="facet" v-model="open">
      <template #summary>
        <div class="flex justify-between py-1 px-4 mb-2 select-none bg-primary-50/50">
          <div class="py-1 rounded-none uppercase typography-headline-6 font-bold tracking-widest select-none">
            {{ facetGetters.getName(facet) }}
          </div>

          <SfIconChevronLeft :class="['text-neutral-500', open ? 'rotate-90' : '-rotate-90']" />
        </div>
      </template>
      <div v-if="facetGetters.getType(facet) === 'feedback'">
        <SfListItem v-for="(filter, index) in sortedReviews(facet)" :key="index" tag="label" class="mb-3" size="sm">
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
            <UiFormLabel class="text-start">{{ t('common.labels.min') }}</UiFormLabel>
            <SfInput id="min" v-model="minPrice" :placeholder="t('common.labels.min')" />
          </label>
        </div>
        <div class="mb-3">
          <label for="max">
            <UiFormLabel class="text-start">{{ t('common.labels.max') }}</UiFormLabel>
            <SfInput id="max" v-model="maxPrice" :placeholder="t('common.labels.max')" />
          </label>
        </div>
        <div class="flex">
          <UiButton
            type="submit"
            class="w-full mr-3 h-10"
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
            class="h-10"
            variant="secondary"
            :aria-label="t('common.actions.clear')"
            @click="resetPriceFilter"
          >
            <SfIconClose />
          </UiButton>
        </div>
      </form>

      <div v-else class="mb-3">
        <div :id="filterListId">
          <SfListItem
            v-for="(filter, index) in visibleFilters"
            :key="filter.id"
            tag="label"
            size="sm"
            :data-testid="'category-filter-' + index"
            class="px-1.5 bg-transparent hover:bg-transparent"
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

        <button
          v-if="showFilterListToggle"
          type="button"
          class="mx-4 mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-800"
          :aria-expanded="filterListExpanded"
          :aria-controls="filterListId"
          :aria-label="filterListToggleAriaLabel"
          data-testid="filter-options-toggle"
          @click="filterListExpanded = !filterListExpanded"
        >
          <SfIconExpandLess v-if="filterListExpanded" class="w-4 h-4" />
          <SfIconExpandMore v-else class="w-4 h-4" />
          {{ filterListToggleText }}
        </button>
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
  SfIconExpandLess,
  SfIconExpandMore,
} from '@storefront-ui/vue';
import type { FilterProps } from '~/components/CategoryFilters/types';
import type { Filters } from '~/composables';
import type { SortFilterContent } from '~/components/blocks/SortFilter/types';
const { getFacetsFromURL, updateFilters, updatePrices } = useCategoryFilter();
const { t } = useI18n();

const open = ref(true);
const props = defineProps<FilterProps>();
const models = ref({} as Filters);
const configuration = computed(() => props.configuration || ({} as SortFilterContent));
const filterListExpanded = ref(false);
const filterListId = `facet-options-${props.facet?.id ?? 'unknown'}`;

const filters = computed(() => facetGetters.getFilters(props.facet ?? ({} as FilterGroup)) as Filter[]);

const initiallyVisibleFilterOptions = computed(() => {
  const configuredValue = Number(configuration.value.initiallyVisibleFilterOptions);
  return Number.isInteger(configuredValue) && configuredValue >= 1 ? configuredValue : 3;
});

const shouldCollapseFilterList = computed(
  () =>
    facetGetters.getType(props.facet ?? ({} as FilterGroup)) === 'dynamic' &&
    (configuration.value.collapseLongFilterLists ?? false) &&
    filters.value.length > initiallyVisibleFilterOptions.value + 1,
);

const selectedFilterIds = computed(() => {
  const selectedIds = new Set(getFacetsFromURL().facets?.split(',') ?? []);
  return selectedIds;
});

const collapsedFilters = computed(() => {
  const initiallyVisible = filters.value.slice(0, initiallyVisibleFilterOptions.value);
  const initiallyVisibleIds = new Set(initiallyVisible.map((filter) => filter.id.toString()));
  const selectedOutsideInitialRange = filters.value.filter(
    (filter) => selectedFilterIds.value.has(filter.id.toString()) && !initiallyVisibleIds.has(filter.id.toString()),
  );

  return [...initiallyVisible, ...selectedOutsideInitialRange];
});

const visibleFilters = computed(() => {
  if (!shouldCollapseFilterList.value || filterListExpanded.value) return filters.value;
  return collapsedFilters.value;
});

const hiddenFilterCount = computed(() => filters.value.length - collapsedFilters.value.length);
const showFilterListToggle = computed(() => shouldCollapseFilterList.value && hiddenFilterCount.value > 0);
const filterListToggleText = computed(() =>
  filterListExpanded.value ? t('show-fewer-options') : t('show-more-options', { count: hiddenFilterCount.value }),
);
const filterListToggleAriaLabel = computed(() => {
  const facetName = props.facet ? facetGetters.getName(props.facet) : '';
  return filterListExpanded.value
    ? t('show-fewer-options-for', { facet: facetName })
    : t('show-more-options-for', { count: hiddenFilterCount.value, facet: facetName });
});

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
  for (const filter of filters.value) {
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

<i18n lang="json">
{
  "en": {
    "show-more-options": "Show {count} more options",
    "show-fewer-options": "Show fewer options",
    "show-more-options-for": "Show {count} more options for {facet}",
    "show-fewer-options-for": "Show fewer options for {facet}"
  },
  "de": {
    "show-more-options": "{count} weitere Optionen anzeigen",
    "show-fewer-options": "Weniger Optionen anzeigen",
    "show-more-options-for": "{count} weitere Optionen für {facet} anzeigen",
    "show-fewer-options-for": "Weniger Optionen für {facet} anzeigen"
  }
}
</i18n>
