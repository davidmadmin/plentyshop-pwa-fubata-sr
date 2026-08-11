<template>
  <section
    class="screw-finder relative isolate min-h-[calc(100svh-8rem)] overflow-clip text-white @md:min-h-0"
    :class="activeStage === 'results' ? 'h-auto @md:h-[760px]' : 'h-[calc(100svh-8rem)] min-h-[720px] @md:h-[720px]'"
    :style="finderStyle"
    data-testid="screw-finder"
  >
    <div class="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
      <div class="absolute inset-0 finder-grid" />
      <div class="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
      <div class="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full border border-white/5" />
    </div>

    <div
      class="relative mx-auto flex w-full max-w-[1440px] flex-col px-5 py-5 @md:px-10 @md:py-8 @xl:px-16"
      :class="activeStage === 'results' ? '' : 'h-full'"
    >
      <header class="flex min-h-11 items-center justify-between gap-4">
        <button
          v-if="canGoBack"
          type="button"
          class="finder-utility-button"
          :aria-label="t('back')"
          data-testid="screw-finder-back"
          @click="goBack"
        >
          <SfIconChevronLeft size="sm" />
          <span>{{ t('back') }}</span>
        </button>
        <div v-if="activeStage !== 'intro'" class="flex items-center gap-4">
          <span class="hidden text-xs font-medium text-white/50 @sm:block">
            {{ t('step', { current: currentStepNumber, total: totalSteps }) }}
          </span>
          <button
            type="button"
            class="finder-utility-button"
            :aria-label="t('restart')"
            data-testid="screw-finder-restart"
            @click="restart"
          >
            <svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
              <path
                d="M20 11a8 8 0 1 0-2.34 5.66M20 5v6h-6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>{{ t('restart') }}</span>
          </button>
        </div>
      </header>

      <div v-if="activeStage !== 'intro'" class="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          class="h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none"
          :style="{ width: `${progress}%`, backgroundColor: resolvedContent.appearance.accentColor }"
        />
      </div>

      <nav
        v-if="answerSummaries.length"
        class="finder-scrollbar-hidden mt-3 flex shrink-0 gap-2 overflow-x-auto pb-1 @md:flex-wrap @md:overflow-visible"
        :aria-label="t('selectionOverview')"
        data-testid="screw-finder-answer-summary"
      >
        <button
          v-for="summary in answerSummaries"
          :key="String(summary.key)"
          type="button"
          class="inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-left text-[11px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          :class="
            summary.stage === activeStage
              ? 'border-[var(--finder-accent)] bg-white/10 text-white'
              : 'border-white/15 bg-white/[0.045] text-white/65 hover:border-white/30 hover:text-white'
          "
          :disabled="preparingNextStage"
          @click="openAnswerSummary(summary)"
        >
          <span class="font-semibold text-white/45">{{ summary.label }}</span>
          <span class="max-w-40 truncate font-bold">{{ summary.value }}</span>
        </button>
      </nav>

      <div class="relative min-h-0 flex-1">
        <Transition :name="transitionName" mode="out-in">
          <div
            :key="activeStage"
            ref="stageElement"
            class="flex h-full min-h-0 flex-col outline-none"
            tabindex="-1"
            @keydown.esc="restart"
          >
            <template v-if="activeStage === 'intro'">
              <div class="grid h-full items-center gap-7 @lg:grid-cols-[minmax(0,1.15fr)_minmax(310px,.85fr)]">
                <div class="max-w-3xl">
                  <p class="mb-4 text-sm font-semibold uppercase tracking-[0.24em]" :style="{ color: accentColor }">
                    {{ resolvedContent.text.eyebrow }}
                  </p>
                  <h2 class="max-w-2xl text-4xl font-black leading-[1.02] tracking-[-0.035em] @md:text-6xl">
                    {{ resolvedContent.text.title }}
                  </h2>
                  <p class="mt-5 max-w-2xl text-base leading-7 text-white/68 @md:text-lg">
                    {{ resolvedContent.text.introduction }}
                  </p>

                  <div class="mt-8 grid max-w-2xl gap-3 @sm:grid-cols-2">
                    <button
                      v-if="resolvedContent.paths.beginner"
                      type="button"
                      class="finder-path-button"
                      data-testid="screw-finder-beginner"
                      @click="start('beginner')"
                    >
                      <span>
                        <strong>{{ resolvedContent.text.beginnerCta }}</strong>
                        <small>{{ t('beginnerHint') }}</small>
                      </span>
                      <SfIconChevronRight />
                    </button>
                    <button
                      v-if="resolvedContent.paths.professional"
                      type="button"
                      class="finder-path-button"
                      data-testid="screw-finder-professional"
                      @click="start('professional')"
                    >
                      <span>
                        <strong>{{ resolvedContent.text.professionalCta }}</strong>
                        <small>{{ t('professionalHint') }}</small>
                      </span>
                      <SfIconChevronRight />
                    </button>
                  </div>
                  <p v-if="facetError" class="mt-4 text-sm text-red-200" role="alert">{{ facetError }}</p>
                </div>
                <div class="mx-auto hidden h-[390px] w-[390px] max-w-full @lg:block">
                  <ScrewIllustration :accent-color="accentColor" />
                </div>
              </div>
            </template>

            <template v-else-if="activeStage === 'application'">
              <FinderQuestion :title="t('applicationTitle')" :description="t('applicationText')">
                <div
                  class="mx-auto flex flex-wrap justify-center gap-3"
                  :class="optionGroupWidthClass(applicationOptions.length)"
                  data-testid="screw-finder-application-options"
                >
                  <FinderOption
                    v-for="option in applicationOptions"
                    :key="option.value"
                    class="w-[calc(50%_-_0.375rem)] @md:w-[260px]"
                    :selected="answers.application === option.value"
                    :label="option.label"
                    :description="option.description"
                    :icon="option.icon"
                    :disabled="preparingNextStage"
                    @select="chooseApplication(option.value)"
                  />
                </div>
              </FinderQuestion>
            </template>

            <template v-else-if="activeStage === 'environment'">
              <FinderQuestion :title="t('environmentTitle')" :description="t('environmentText')">
                <div
                  class="mx-auto flex flex-wrap justify-center gap-3"
                  :class="optionGroupWidthClass(environmentOptions.length)"
                >
                  <FinderOption
                    v-for="option in environmentOptions"
                    :key="option.value"
                    class="w-[calc(50%_-_0.375rem)] @md:w-[260px]"
                    :selected="answers.environment === option.value"
                    :label="option.label"
                    :description="option.description"
                    :icon="option.icon"
                    :disabled="preparingNextStage"
                    @select="chooseAndAdvance('environment', option.value)"
                  />
                </div>
              </FinderQuestion>
            </template>

            <template v-else-if="activeStage === 'head-preference'">
              <FinderQuestion :title="t('headPreferenceTitle')" :description="t('headPreferenceText')">
                <div
                  class="mx-auto flex flex-wrap justify-center gap-3"
                  :class="optionGroupWidthClass(headPreferenceOptions.length)"
                >
                  <FinderOption
                    v-for="option in headPreferenceOptions"
                    :key="option.value"
                    class="w-[calc(50%_-_0.375rem)] @md:w-[260px]"
                    :selected="answers.headPreference === option.value"
                    :label="option.label"
                    :description="option.description"
                    :icon="option.icon"
                    :disabled="preparingNextStage"
                    @select="chooseAndAdvance('headPreference', option.value)"
                  />
                </div>
              </FinderQuestion>
            </template>

            <template v-else-if="activeStage === 'demand'">
              <FinderQuestion :title="t('demandTitle')" :description="t('demandText')">
                <div class="flex flex-wrap justify-center gap-3">
                  <FinderOption
                    v-for="option in demandOptions"
                    :key="option.value"
                    class="w-[calc(50%_-_0.375rem)] @md:w-[300px]"
                    :selected="answers.demand === option.value"
                    :label="option.label"
                    :description="option.description"
                    :icon="option.icon"
                    :disabled="preparingNextStage"
                    @select="chooseAndAdvance('demand', option.value)"
                  />
                </div>
              </FinderQuestion>
            </template>

            <template v-else-if="activeStage === 'beginner-size'">
              <FinderQuestion :title="t('sizeTitle')" :description="t('sizeText')">
                <div class="mx-auto grid w-full max-w-3xl gap-4 @sm:grid-cols-2">
                  <FinderSelect
                    v-if="usableBeginnerDiameterOptions.length"
                    :label="t('diameter')"
                    :options="usableBeginnerDiameterOptions"
                    :model-value="answers.diameter"
                    :disabled="loadingBeginnerFacets"
                    @update:model-value="updateBeginnerSize('diameter', $event)"
                  />
                  <FinderSelect
                    v-if="usableBeginnerLengthOptions.length"
                    :label="t('length')"
                    :options="usableBeginnerLengthOptions"
                    :model-value="answers.length"
                    :disabled="loadingBeginnerFacets"
                    @update:model-value="updateBeginnerSize('length', $event)"
                  />
                </div>
                <p v-if="loadingBeginnerFacets" class="mt-4 text-center text-sm text-white/60" role="status">
                  {{ t('updatingOptions') }}
                </p>
                <div class="mt-7 flex justify-center gap-3">
                  <button
                    type="button"
                    class="finder-secondary-button"
                    :disabled="loadingBeginnerFacets"
                    @click="requestResults"
                  >
                    {{ t('skipSize') }}
                  </button>
                  <button
                    type="button"
                    class="finder-primary-button"
                    :disabled="loadingBeginnerFacets"
                    @click="requestResults"
                  >
                    {{ t('showMatches') }}
                  </button>
                </div>
              </FinderQuestion>
            </template>

            <template v-else-if="isProfessionalFacetStage">
              <FinderQuestion :title="professionalStageTitle" :description="professionalStageDescription">
                <div
                  v-if="loadingProfessionalFacets && !preparingNextStage"
                  class="flex min-h-40 items-center justify-center"
                  role="status"
                >
                  <SfLoaderCircular size="xl" :style="{ color: accentColor }" />
                  <span class="sr-only">{{ t('updatingOptions') }}</span>
                </div>
                <div
                  v-else-if="professionalStageOptions.length"
                  class="mx-auto flex flex-wrap justify-center gap-3"
                  :class="optionGroupWidthClass(professionalStageOptions.length)"
                  data-testid="screw-finder-professional-options"
                >
                  <FinderOption
                    v-for="option in professionalStageOptions"
                    :key="String(option.id)"
                    class="w-[calc(50%_-_0.375rem)] @md:w-[260px]"
                    :selected="String(professionalStageValue?.id) === String(option.id)"
                    :label="getFilterName(option)"
                    :description="availableProductsLabel(option.count ?? 0)"
                    icon="◇"
                    :disabled="preparingNextStage"
                    @select="chooseProfessional(option)"
                  />
                </div>
                <div v-else class="mx-auto max-w-xl rounded border border-white/15 bg-white/5 p-6 text-center">
                  <p class="text-white/70">{{ t('facetUnavailable') }}</p>
                  <button type="button" class="finder-secondary-button mt-4" @click="advance()">
                    {{ t('continue') }}
                  </button>
                </div>
              </FinderQuestion>
            </template>

            <template v-else-if="activeStage === 'results'">
              <div class="flex h-full min-h-0 flex-col pb-3 pt-4 @md:pb-0 @md:pt-5">
                <div class="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.2em]" :style="{ color: accentColor }">
                      {{ matches.length ? t('resultEyebrow') : t('noExactMatch') }}
                    </p>
                    <h3 class="mt-1 text-2xl font-black tracking-tight @md:text-4xl">
                      {{ matches.length ? resolvedContent.text.resultsTitle : resolvedContent.text.emptyTitle }}
                    </h3>
                    <p class="mt-1 max-w-2xl text-sm text-white/60">
                      {{ resultSummary }}
                    </p>
                  </div>
                  <NuxtLink
                    v-if="allMatchesUrl"
                    :to="allMatchesUrl"
                    class="finder-secondary-button !hidden @md:!inline-flex"
                    data-testid="screw-finder-all-matches"
                  >
                    {{ t('allMatches') }}
                    <SfIconChevronRight size="sm" />
                  </NuxtLink>
                </div>

                <div
                  v-if="loadingResults"
                  class="flex flex-1 items-center justify-center"
                  role="status"
                  aria-live="polite"
                >
                  <SfLoaderCircular size="2xl" :style="{ color: accentColor }" />
                  <span class="sr-only">{{ t('loading') }}</span>
                </div>

                <div
                  v-else-if="visibleMatches.length"
                  class="finder-scrollbar-hidden mt-2 grid auto-cols-[min(78vw,320px)] grid-flow-col items-start gap-3 overflow-x-auto overscroll-x-contain pb-2 snap-x snap-mandatory @sm:auto-cols-[min(64vw,320px)] @md:mt-3 @lg:mx-auto @lg:w-full @lg:max-w-[1008px] @lg:grid-flow-row @lg:grid-cols-[repeat(auto-fit,minmax(280px,320px))] @lg:justify-center @lg:overflow-visible"
                  data-testid="screw-finder-results"
                >
                  <article
                    v-for="match in visibleMatches"
                    :key="productGetters.getVariationId(match.product)"
                    class="grid h-fit snap-center grid-rows-[164px_auto] overflow-hidden border border-white/12 bg-white/[0.055] @md:grid-rows-[170px_auto]"
                    data-testid="screw-finder-result-card"
                  >
                    <div class="relative flex items-center justify-center bg-white p-3">
                      <img
                        :src="productGetters.getCoverImage(match.product)"
                        :alt="productGetters.getName(match.product)"
                        class="aspect-square h-full max-w-full object-contain"
                      />
                      <span
                        class="absolute left-3 top-3 rounded-sm px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-950"
                        :style="{ backgroundColor: match.exact ? accentColor : '#f3c66d' }"
                      >
                        {{ match.exact ? t('exactMatch') : t('nearbyMatch') }}
                      </span>
                    </div>
                    <div class="flex min-h-0 flex-col p-3">
                      <h4
                        class="finder-product-title shrink-0 text-sm font-bold @md:text-base"
                        :title="productGetters.getName(match.product)"
                      >
                        {{ productGetters.getName(match.product) }}
                      </h4>
                      <p class="mt-1 text-lg font-black" :style="{ color: accentColor }">
                        {{ format(productGetters.getPrice(match.product) ?? 0) }}
                      </p>
                      <div class="mt-1 flex items-center gap-2 text-xs text-white/55">
                        <SfRating size="xs" :value="productGetters.getAverageRating(match.product, 'half')" :max="5" />
                        <span>{{ productGetters.getTotalReviews(match.product) }}</span>
                      </div>
                      <p class="mt-1 line-clamp-1 text-xs leading-5 text-white/64">
                        {{ match.reasons.join(' · ') }}
                      </p>
                      <ul
                        v-if="match.criteria.length"
                        class="mt-1 space-y-0.5 text-[11px] leading-4"
                        :aria-label="t('criteriaLabel')"
                      >
                        <li
                          v-for="criterion in match.criteria"
                          :key="`${criterion.label}-${criterion.selectedValue}`"
                          class="flex items-start gap-1.5"
                          :class="criterionStatusClass(criterion.status)"
                        >
                          <span
                            class="mt-px inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-black"
                            aria-hidden="true"
                          >
                            {{ criterionStatusIcon(criterion.status) }}
                          </span>
                          <span>
                            <strong>{{ criterion.label }}:</strong>
                            <span v-if="criterion.status === 'available'" class="ml-1">
                              {{ t('availableIn', { values: formatAvailableValues(criterion.availableValues ?? []) }) }}
                            </span>
                            <span v-else class="ml-1">{{ criterion.actualValue ?? criterion.selectedValue }}</span>
                            <span v-if="criterion.status === 'mismatch'" class="ml-1">
                              ({{ t('selectedInstead', { value: criterion.selectedValue }) }})
                            </span>
                            <span v-else-if="criterion.status === 'unknown'" class="ml-1">
                              ({{ t('notVerifiable') }})
                            </span>
                          </span>
                        </li>
                      </ul>
                      <NuxtLink
                        :to="productPath(match.product)"
                        class="mt-auto inline-flex items-center gap-1 pt-2.5 text-sm font-bold"
                        :style="{ color: accentColor }"
                      >
                        {{ t('productDetails') }}
                        <SfIconChevronRight size="sm" />
                      </NuxtLink>
                    </div>
                  </article>
                </div>

                <div v-else class="flex flex-1 items-center justify-center text-center" role="status">
                  <div class="max-w-xl">
                    <p class="text-white/65">{{ resolvedContent.text.emptyText }}</p>
                    <button type="button" class="finder-primary-button mt-6" @click="goBack">
                      {{ t('adjustAnswers') }}
                    </button>
                  </div>
                </div>

                <NuxtLink
                  v-if="allMatchesUrl"
                  :to="allMatchesUrl"
                  class="finder-secondary-button mt-1.5 justify-center @md:!hidden"
                >
                  {{ t('allMatches') }}
                </NuxtLink>
              </div>
            </template>
          </div>
        </Transition>
        <div
          v-if="showPreparationIndicator && activeStage !== 'results'"
          class="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-neutral-950/90 px-3 py-2 text-xs text-white/65"
          role="status"
        >
          <SfLoaderCircular size="sm" :style="{ color: accentColor }" />
          {{ t('preparingNextQuestion') }}
        </div>
      </div>
      <p class="sr-only" aria-live="polite">{{ liveMessage }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { productGetters, type Facet, type Filter, type FilterGroup, type Product } from '@plentymarkets/shop-api';
import { SfIconChevronLeft, SfIconChevronRight, SfLoaderCircular, SfRating } from '@storefront-ui/vue';
import type {
  ScrewFinderAnswerSummary,
  ScrewFinderAnswers,
  ScrewFinderApplication,
  ScrewFinderCriterionStatus,
  ScrewFinderDemand,
  ScrewFinderFacetKey,
  ScrewFinderHeadPreference,
  ScrewFinderMatch,
  ScrewFinderProps,
} from './types';
import { resolveScrewFinderContent } from './defaults';
import { getBeginnerGuidance } from './beginner-guidance';
import {
  buildScrewFinderProductPath,
  buildNearbyMatches,
  getFilterName,
  getRequiredFacetFilters,
  getSafetyCriticalFilters,
  rankScrewFinderProducts,
  resolveScrewFinderFacets,
  serializeFacetFilters,
} from './matching';
import FinderOption from './FinderOption.vue';
import FinderQuestion from './FinderQuestion.vue';
import FinderSelect from './FinderSelect.vue';
import ScrewIllustration from './ScrewIllustration.vue';

const props = defineProps<ScrewFinderProps>();
const { t, locale } = useI18n();
const localePath = useLocalePath();
const { format } = usePriceFormatter();
const sdk = useSdk();

const resolvedContent = computed(() => resolveScrewFinderContent(props.content));
const accentColor = computed(() => resolvedContent.value.appearance.accentColor);
const finderStyle = computed(() => ({
  backgroundColor: resolvedContent.value.appearance.backgroundColor,
  '--finder-accent': accentColor.value,
}));

const activeStage = ref('intro');
const stageHistory = ref<string[]>([]);
const transitionDirection = ref<'forward' | 'back'>('forward');
const stageElement = ref<HTMLElement>();
const answers = reactive<ScrewFinderAnswers>({});
const facetCatalog = ref<Facet>();
const beginnerFacetCatalog = ref<Facet>();
const beginnerLengthFacetCatalog = ref<Facet>();
const professionalFacetCatalog = ref<Facet>();
const facetError = ref('');
const loadingResults = ref(false);
const loadingProfessionalFacets = ref(false);
const loadingBeginnerFacets = ref(false);
const preparingNextStage = ref(false);
const showPreparationIndicator = ref(false);
const matches = ref<ScrewFinderMatch[]>([]);
const nearbyMatches = ref<ScrewFinderMatch[]>([]);
const liveMessage = ref('');
const automaticProfessionalKeys = ref<Set<ScrewFinderFacetKey>>(new Set());
let professionalRequestId = 0;
let beginnerRequestId = 0;

const facetMap = computed(() => resolveScrewFinderFacets(facetCatalog.value?.facets ?? []));
const beginnerFacetMap = computed(() =>
  resolveScrewFinderFacets(beginnerFacetCatalog.value?.facets ?? facetCatalog.value?.facets ?? []),
);
const beginnerLengthFacetMap = computed(() =>
  resolveScrewFinderFacets(beginnerLengthFacetCatalog.value?.facets ?? beginnerFacetCatalog.value?.facets ?? []),
);
const professionalFacetMap = computed(() =>
  resolveScrewFinderFacets(professionalFacetCatalog.value?.facets ?? facetCatalog.value?.facets ?? []),
);
const requiredFilters = computed(() => getRequiredFacetFilters(answers, facetMap.value));
const safetyCriticalFilters = computed(() => getSafetyCriticalFilters(answers, facetMap.value));
const allMatchesUrl = computed(() => {
  const facets = serializeFacetFilters(requiredFilters.value);
  const path = resolvedContent.value.sourceCategoryPath;
  return facets ? `${path}?facets=${encodeURIComponent(facets)}` : path;
});
const visibleMatches = computed(() =>
  [...matches.value, ...nearbyMatches.value].slice(0, resolvedContent.value.resultCount),
);
const resultSummary = computed(() =>
  matches.value.length
    ? nearbyMatches.value.length
      ? t(
          matches.value.length === 1
            ? nearbyMatches.value.length === 1
              ? 'mixedResultSummarySingleSingle'
              : 'mixedResultSummarySingleMultiple'
            : nearbyMatches.value.length === 1
              ? 'mixedResultSummaryMultipleSingle'
              : 'mixedResultSummaryMultipleMultiple',
          { exact: matches.value.length, alternatives: nearbyMatches.value.length },
        )
      : matches.value.length === 1
        ? t('resultSummarySingle')
        : t('resultSummary', { count: matches.value.length })
    : nearbyMatches.value.length
      ? t('nearbySummary')
      : resolvedContent.value.text.emptyText,
);

const beginnerRule = computed(() => getBeginnerGuidance(answers.application));
const usableBeginnerDiameterOptions = computed(
  () => beginnerFacetMap.value.diameter?.values?.filter((option) => (option.count ?? 0) > 0) ?? [],
);
const usableBeginnerLengthOptions = computed(
  () => beginnerLengthFacetMap.value.length?.values?.filter((option) => (option.count ?? 0) > 0) ?? [],
);
const hasUsableBeginnerDimensions = computed(
  () => usableBeginnerDiameterOptions.value.length > 0 || usableBeginnerLengthOptions.value.length > 0,
);
const beginnerStages = computed(() => [
  'application',
  'environment',
  ...(resolvedContent.value.stages.beginnerHead && beginnerRule.value.headPreferences.length > 1
    ? ['head-preference']
    : []),
  ...(resolvedContent.value.stages.beginnerDemand && beginnerRule.value.demands.length > 1 ? ['demand'] : []),
  ...(resolvedContent.value.stages.beginnerExactSize && hasUsableBeginnerDimensions.value ? ['beginner-size'] : []),
  'results',
]);
const professionalStages = computed(() => [
  'professional-material',
  'professional-head',
  'professional-diameter',
  'professional-length',
  ...(resolvedContent.value.stages.professionalDrive ? ['professional-drive'] : []),
  ...(resolvedContent.value.stages.professionalPackage ? ['professional-package'] : []),
  'results',
]);
const stages = computed(() => (answers.path === 'professional' ? professionalStages.value : beginnerStages.value));
const currentStepIndex = computed(() => stages.value.indexOf(activeStage.value));
const currentStepNumber = computed(() => Math.max(1, currentStepIndex.value + 1));
const totalSteps = computed(() => stages.value.length);
const progress = computed(() => (currentStepNumber.value / totalSteps.value) * 100);
const canGoBack = computed(() => activeStage.value !== 'intro');
const transitionName = computed(() => (transitionDirection.value === 'back' ? 'finder-back' : 'finder-forward'));

const beginnerAnswerValues = computed(() => ({
  application: Object.fromEntries(applicationOptions.value.map((option) => [option.value, option.label])),
  environment: Object.fromEntries(environmentOptions.value.map((option) => [option.value, option.label])),
  headPreference: Object.fromEntries(headPreferenceOptions.value.map((option) => [option.value, option.label])),
  demand: Object.fromEntries(demandOptions.value.map((option) => [option.value, option.label])),
}));
const answerSummaries = computed<ScrewFinderAnswerSummary[]>(() => {
  const definitions: {
    key: keyof ScrewFinderAnswers;
    stage: string;
    label: string;
    value?: string;
  }[] =
    answers.path === 'professional'
      ? [
          { key: 'material', stage: 'professional-material', label: t('summary.material') },
          { key: 'head', stage: 'professional-head', label: t('summary.head') },
          { key: 'diameter', stage: 'professional-diameter', label: t('summary.diameter') },
          { key: 'length', stage: 'professional-length', label: t('summary.length') },
          { key: 'drive', stage: 'professional-drive', label: t('summary.drive') },
          { key: 'package', stage: 'professional-package', label: t('summary.package') },
        ]
      : [
          {
            key: 'application',
            stage: 'application',
            label: t('summary.application'),
            value: answers.application ? beginnerAnswerValues.value.application[answers.application] : undefined,
          },
          {
            key: 'environment',
            stage: 'environment',
            label: t('summary.environment'),
            value: answers.environment ? beginnerAnswerValues.value.environment[answers.environment] : undefined,
          },
          {
            key: 'headPreference',
            stage: 'head-preference',
            label: t('summary.headPreference'),
            value: answers.headPreference
              ? beginnerAnswerValues.value.headPreference[answers.headPreference]
              : undefined,
          },
          {
            key: 'demand',
            stage: 'demand',
            label: t('summary.demand'),
            value: answers.demand ? beginnerAnswerValues.value.demand[answers.demand] : undefined,
          },
          { key: 'diameter', stage: 'beginner-size', label: t('summary.diameter') },
          { key: 'length', stage: 'beginner-size', label: t('summary.length') },
        ];

  return definitions.flatMap((definition) => {
    if (answers.path === 'professional' && automaticProfessionalKeys.value.has(definition.key as ScrewFinderFacetKey)) {
      return [];
    }
    const answer = answers[definition.key];
    const value = definition.value ?? (typeof answer === 'object' ? getFilterName(answer as Filter) : '');
    return answer && value ? [{ ...definition, value }] : [];
  });
});

const professionalFacetStageMap: Record<string, ScrewFinderFacetKey> = {
  'professional-material': 'material',
  'professional-head': 'head',
  'professional-diameter': 'diameter',
  'professional-length': 'length',
  'professional-drive': 'drive',
  'professional-package': 'package',
};
const professionalFacetKey = computed(() => professionalFacetStageMap[activeStage.value]);
const isProfessionalFacetStage = computed(() => Boolean(professionalFacetKey.value));
const professionalStageOptions = computed(() =>
  professionalFacetKey.value
    ? (professionalFacetMap.value[professionalFacetKey.value]?.values ?? []).filter((option) => (option.count ?? 0) > 0)
    : [],
);
const professionalStageValue = computed(() =>
  professionalFacetKey.value ? (answers[professionalFacetKey.value] as Filter | undefined) : undefined,
);
const professionalStageTitle = computed(() =>
  professionalFacetKey.value ? t(`professional.${professionalFacetKey.value}.title`) : '',
);
const professionalStageDescription = computed(() =>
  professionalFacetKey.value ? t(`professional.${professionalFacetKey.value}.description`) : '',
);

const applicationOptions = computed(
  () =>
    [
      { value: 'interior', label: t('applications.interior'), description: t('applications.interiorHint'), icon: '⌂' },
      {
        value: 'structural',
        label: t('applications.structural'),
        description: t('applications.structuralHint'),
        icon: '▰',
      },
      { value: 'terrace', label: t('applications.terrace'), description: t('applications.terraceHint'), icon: '☀' },
      { value: 'drywall', label: t('applications.drywall'), description: t('applications.drywallHint'), icon: '▥' },
      { value: 'window', label: t('applications.window'), description: t('applications.windowHint'), icon: '□' },
      { value: 'roofing', label: t('applications.roofing'), description: t('applications.roofingHint'), icon: '⌃' },
    ] as const,
);
const environmentOptions = computed(
  () =>
    [
      { value: 'indoor', label: t('environments.indoor'), description: t('environments.indoorHint'), icon: '⌂' },
      {
        value: 'protected',
        label: t('environments.protected'),
        description: t('environments.protectedHint'),
        icon: '◒',
      },
      { value: 'outdoor', label: t('environments.outdoor'), description: t('environments.outdoorHint'), icon: '☂' },
      {
        value: 'corrosive',
        label: t('environments.corrosive'),
        description: t('environments.corrosiveHint'),
        icon: '≈',
      },
    ] as const,
);
const headPreferenceOptions = computed(() =>
  [
    { value: 'flush', label: t('heads.flush'), description: t('heads.flushHint'), icon: '▽' },
    { value: 'low-profile', label: t('heads.lowProfile'), description: t('heads.lowProfileHint'), icon: '⌒' },
    { value: 'clamping', label: t('heads.clamping'), description: t('heads.clampingHint'), icon: '━' },
    { value: 'concealed', label: t('heads.concealed'), description: t('heads.concealedHint'), icon: '│' },
    { value: 'any', label: t('heads.any'), description: t('heads.anyHint'), icon: '○' },
  ].filter((option) => beginnerRule.value.headPreferences.includes(option.value as ScrewFinderHeadPreference)),
);
const demandOptions = computed(() =>
  [
    { value: 'light', label: t('demands.light'), description: t('demands.lightHint'), icon: 'Ⅰ' },
    { value: 'general', label: t('demands.general'), description: t('demands.generalHint'), icon: 'Ⅱ' },
    { value: 'heavy', label: t('demands.heavy'), description: t('demands.heavyHint'), icon: 'Ⅲ' },
  ].filter((option) => beginnerRule.value.demands.includes(option.value as ScrewFinderDemand)),
);
const optionGroupWidthClass = (count: number) =>
  count === 5 || count === 6 ? 'w-full @md:max-w-[804px]' : 'w-full @md:max-w-[1076px]';

const focusStage = () => nextTick(() => stageElement.value?.focus({ preventScroll: true }));
const wait = (milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
const runPreparedTransition = async (work: (acknowledged: Promise<void>) => Promise<void>) => {
  if (preparingNextStage.value) return;
  preparingNextStage.value = true;
  showPreparationIndicator.value = false;
  const indicatorTimer = setTimeout(() => {
    showPreparationIndicator.value = true;
  }, 700);
  try {
    await work(wait(600));
  } finally {
    clearTimeout(indicatorTimer);
    showPreparationIndicator.value = false;
    preparingNextStage.value = false;
  }
};
const navigateToStage = (stage: string, remember = true) => {
  transitionDirection.value = 'forward';
  if (remember) stageHistory.value.push(activeStage.value);
  activeStage.value = stage;
  liveMessage.value = t('stageChanged');
  focusStage();
};
const advance = async (acknowledged: Promise<void> = Promise.resolve()) => {
  const nextStage = stages.value[currentStepIndex.value + 1];
  if (nextStage === 'results') await showResults(acknowledged);
  else if (nextStage) {
    await acknowledged;
    navigateToStage(nextStage);
  }
};
const start = (path: 'beginner' | 'professional') => {
  answers.path = path;
  if (path === 'beginner') {
    navigateToStage(beginnerStages.value[0]!);
    return;
  }
  professionalFacetCatalog.value = facetCatalog.value;
  void runPreparedTransition((acknowledged) => openNextProfessionalStage(-1, acknowledged));
};
const chooseApplication = (value: ScrewFinderApplication) => {
  const changed = answers.application !== value;
  answers.application = value;
  if (changed) reconcileBeginnerAnswers();
  void runPreparedTransition((acknowledged) => advance(acknowledged));
};
const chooseAndAdvance = (key: 'environment' | 'headPreference' | 'demand', value: string) => {
  const changed = answers[key] !== value;
  Object.assign(answers, { [key]: value });
  if (changed) {
    matches.value = [];
    nearbyMatches.value = [];
  }
  if (key === 'environment') {
    void runPreparedTransition(async (acknowledged) => {
      await loadBeginnerDimensionCatalog();
      await advance(acknowledged);
    });
    return;
  }
  void runPreparedTransition((acknowledged) => advance(acknowledged));
};
const chooseProfessional = (filter: Filter) => {
  if (!professionalFacetKey.value) return;
  automaticProfessionalKeys.value.delete(professionalFacetKey.value);
  const changed = String((answers[professionalFacetKey.value] as Filter | undefined)?.id) !== String(filter.id);
  Object.assign(answers, { [professionalFacetKey.value]: filter });
  if (changed) clearAnswersAfterStage(activeStage.value);
  void runPreparedTransition((acknowledged) => openNextProfessionalStage(currentStepIndex.value, acknowledged));
};
const goBack = () => {
  let previous = stageHistory.value.pop();
  if (!previous) return restart();
  if (answers.path === 'professional') {
    if (previous === 'intro') return restart();
    transitionDirection.value = 'back';
    activeStage.value = previous;
    void restoreProfessionalFacetState(previous);
    focusStage();
    return;
  }
  while (previous !== 'intro' && !stages.value.includes(previous)) {
    previous = stageHistory.value.pop();
    if (!previous) return restart();
  }
  if (previous === 'intro') return restart();
  transitionDirection.value = 'back';
  activeStage.value = previous;
  focusStage();
};
const restart = () => {
  transitionDirection.value = 'back';
  activeStage.value = 'intro';
  stageHistory.value = [];
  matches.value = [];
  nearbyMatches.value = [];
  automaticProfessionalKeys.value = new Set();
  professionalFacetCatalog.value = facetCatalog.value;
  loadingProfessionalFacets.value = false;
  loadingBeginnerFacets.value = false;
  professionalRequestId += 1;
  beginnerRequestId += 1;
  beginnerFacetCatalog.value = facetCatalog.value;
  beginnerLengthFacetCatalog.value = facetCatalog.value;
  preparingNextStage.value = false;
  showPreparationIndicator.value = false;
  Object.assign(answers, {
    path: undefined,
    application: undefined,
    environment: undefined,
    headPreference: undefined,
    demand: undefined,
    material: undefined,
    head: undefined,
    drive: undefined,
    diameter: undefined,
    length: undefined,
    package: undefined,
  });
  focusStage();
};
const availableProductsLabel = (count: number) =>
  count === 1 ? t('availableProduct') : t('availableProducts', { count });
const formatAvailableValues = (values: string[]) =>
  values.length <= 5
    ? new Intl.ListFormat(locale.value, { style: 'long', type: 'conjunction' }).format(values)
    : t('availableValuesPreview', {
        values: values.slice(0, 4).join(', '),
        count: values.length - 4,
      });
const updateBeginnerSize = (key: 'diameter' | 'length', filter?: Filter) => {
  const changed = String(answers[key]?.id ?? '') !== String(filter?.id ?? '');
  answers[key] = filter;
  if (changed) {
    matches.value = [];
    nearbyMatches.value = [];
  }
  if (key === 'diameter' && changed) void loadBeginnerLengthCatalog();
};
const requestResults = () => {
  void runPreparedTransition((acknowledged) => showResults(acknowledged));
};
const criterionStatusIcon = (status: ScrewFinderCriterionStatus) =>
  status === 'match' ? '✓' : status === 'mismatch' ? '×' : status === 'available' ? '!' : '?';
const criterionStatusClass = (status: ScrewFinderCriterionStatus) =>
  status === 'match'
    ? 'text-white/68 [&>span:first-child]:bg-emerald-500/20 [&>span:first-child]:text-emerald-300'
    : status === 'mismatch'
      ? 'text-red-300 [&>span:first-child]:bg-red-500/20 [&>span:first-child]:text-red-300'
      : status === 'available'
        ? 'text-amber-100/80 [&>span:first-child]:bg-amber-400/20 [&>span:first-child]:text-amber-300'
        : 'text-white/50 [&>span:first-child]:bg-white/10 [&>span:first-child]:text-white/60';

const fetchCatalogPage = async (page: number, facets = '', itemsPerPage = 50) => {
  const response = await sdk.plentysystems.getFacet({
    categoryUrlPath: resolvedContent.value.sourceCategoryPath,
    page,
    itemsPerPage,
    sort: 'default.recommended_sorting',
    facets: facets || undefined,
  });
  if (!response.data) throw new Error('Screw Finder facet response is empty');
  return response.data;
};

const mergeFacetCatalogs = (catalogs: Facet[]): Facet | undefined => {
  const first = catalogs[0];
  if (!first) return undefined;

  const groups = new Map<string, FilterGroup>();
  for (const catalog of catalogs) {
    for (const group of catalog.facets ?? []) {
      const groupKey = String(group.id);
      const existing = groups.get(groupKey);
      if (!existing) {
        groups.set(groupKey, {
          ...group,
          values: group.values?.map((value) => ({ ...value })),
        });
        continue;
      }

      const values = new Map((existing.values ?? []).map((value) => [String(value.id), value]));
      for (const value of group.values ?? []) {
        const current = values.get(String(value.id));
        values.set(
          String(value.id),
          current ? { ...current, count: Number(current.count ?? 0) + Number(value.count ?? 0) } : { ...value },
        );
      }
      existing.values = [...values.values()];
      existing.count = existing.values.reduce((total, value) => total + Number(value.count ?? 0), 0);
    }
  }

  return {
    ...first,
    facets: [...groups.values()],
    products: catalogs.flatMap((catalog) => catalog.products ?? []),
    pagination: {
      ...first.pagination,
      totals: catalogs.reduce((total, catalog) => total + Number(catalog.pagination?.totals ?? 0), 0),
    },
  };
};

const fetchBeginnerFacetCatalog = async (extraFilters: Filter[] = []) => {
  const safetyFilters = getSafetyCriticalFilters(answers, facetMap.value);
  const branches =
    safetyFilters.length > 1
      ? safetyFilters.map((filter) => [filter, ...extraFilters])
      : [[...safetyFilters, ...extraFilters]];
  const catalogs = await Promise.all(branches.map((filters) => fetchCatalogPage(1, serializeFacetFilters(filters), 1)));
  return mergeFacetCatalogs(catalogs);
};

const keepValidBeginnerDimensions = () => {
  if (
    answers.diameter &&
    !usableBeginnerDiameterOptions.value.some((option) => String(option.id) === String(answers.diameter?.id))
  ) {
    answers.diameter = undefined;
  }
  if (
    answers.length &&
    !usableBeginnerLengthOptions.value.some((option) => String(option.id) === String(answers.length?.id))
  ) {
    answers.length = undefined;
  }
};

const loadBeginnerLengthCatalog = async () => {
  const requestId = ++beginnerRequestId;
  loadingBeginnerFacets.value = true;
  try {
    const catalog = await fetchBeginnerFacetCatalog(answers.diameter ? [answers.diameter] : []);
    if (requestId !== beginnerRequestId || !catalog) return;
    beginnerLengthFacetCatalog.value = catalog;
    keepValidBeginnerDimensions();
  } catch {
    if (requestId === beginnerRequestId) facetError.value = t('loadError');
  } finally {
    if (requestId === beginnerRequestId) loadingBeginnerFacets.value = false;
  }
};

const loadBeginnerDimensionCatalog = async () => {
  const requestId = ++beginnerRequestId;
  loadingBeginnerFacets.value = true;
  try {
    const catalog = await fetchBeginnerFacetCatalog();
    if (requestId !== beginnerRequestId || !catalog) return;
    beginnerFacetCatalog.value = catalog;
    beginnerLengthFacetCatalog.value = catalog;
    keepValidBeginnerDimensions();

    if (answers.diameter) {
      const lengthCatalog = await fetchBeginnerFacetCatalog([answers.diameter]);
      if (requestId !== beginnerRequestId || !lengthCatalog) return;
      beginnerLengthFacetCatalog.value = lengthCatalog;
      keepValidBeginnerDimensions();
    }
  } catch {
    if (requestId === beginnerRequestId) facetError.value = t('loadError');
  } finally {
    if (requestId === beginnerRequestId) loadingBeginnerFacets.value = false;
  }
};

const fetchAllCandidates = async (facets: string) => {
  const firstPage = await fetchCatalogPage(1, facets);
  const products = [...(firstPage.products ?? [])];
  const totals = Number(firstPage.pagination?.totals ?? products.length);
  const totalPages = Math.ceil(totals / 50);
  for (let page = 2; page <= totalPages; page += 1) {
    const nextPage = await fetchCatalogPage(page, facets);
    products.push(...(nextPage.products ?? []));
  }
  return products;
};
const uniqueProductsByItem = (products: Product[]) => [
  ...new Map(products.map((product) => [String(productGetters.getItemId(product)), product])).values(),
];
const enrichAlternativeProducts = async (products: Product[]) =>
  Promise.all(
    products.map(async (product) => {
      try {
        const response = await sdk.plentysystems.getProduct({
          id: productGetters.getItemId(product),
          variationId: productGetters.getVariationId(product),
        });
        return response.data ?? product;
      } catch {
        return product;
      }
    }),
  );

const professionalFilterKeys: ScrewFinderFacetKey[] = ['material', 'head', 'diameter', 'length', 'drive', 'package'];
const professionalFiltersBeforeStage = (stage: string) => {
  const stageKey = professionalFacetStageMap[stage];
  const end = stageKey ? professionalFilterKeys.indexOf(stageKey) : professionalFilterKeys.length;
  return professionalFilterKeys
    .slice(0, end)
    .map((key) => answers[key] as Filter | undefined)
    .filter((filter): filter is Filter => Boolean(filter));
};

const clearProfessionalAnswersAfter = (stage: string) => {
  const stageKey = professionalFacetStageMap[stage];
  if (!stageKey) return;
  const stageIndex = professionalFilterKeys.indexOf(stageKey);
  for (const key of professionalFilterKeys.slice(stageIndex + 1)) {
    Object.assign(answers, { [key]: undefined });
    automaticProfessionalKeys.value.delete(key);
  }
};

const clearAnswersAfterStage = (stage: string) => {
  matches.value = [];
  nearbyMatches.value = [];
  if (answers.path === 'professional') {
    clearProfessionalAnswersAfter(stage);
    return;
  }
  reconcileBeginnerAnswers();
};

const reconcileBeginnerAnswers = () => {
  matches.value = [];
  nearbyMatches.value = [];
  if (answers.headPreference && !beginnerRule.value.headPreferences.includes(answers.headPreference)) {
    answers.headPreference = undefined;
  }
  if (answers.demand && !beginnerRule.value.demands.includes(answers.demand)) {
    answers.demand = undefined;
  }
  stageHistory.value = stageHistory.value.filter((stage) => stage === 'intro' || beginnerStages.value.includes(stage));
};

const loadProfessionalFacetCatalog = async (filters: Filter[], commit = true) => {
  const requestId = ++professionalRequestId;
  loadingProfessionalFacets.value = true;
  try {
    const catalog = await fetchCatalogPage(1, serializeFacetFilters(filters), 1);
    if (requestId !== professionalRequestId) return;
    if (commit) professionalFacetCatalog.value = catalog;
    return catalog;
  } catch {
    if (requestId === professionalRequestId) facetError.value = t('loadError');
  } finally {
    if (requestId === professionalRequestId) loadingProfessionalFacets.value = false;
  }
};

const restoreProfessionalFacetState = async (stage: string) => {
  await loadProfessionalFacetCatalog(professionalFiltersBeforeStage(stage));
};

const openNextProfessionalStage = async (fromIndex: number, acknowledged: Promise<void> = Promise.resolve()) => {
  let nextIndex = fromIndex + 1;
  while (nextIndex < professionalStages.value.length) {
    const nextStage = professionalStages.value[nextIndex];
    if (!nextStage || nextStage === 'results') {
      await showResults(acknowledged);
      return;
    }

    const catalog = await loadProfessionalFacetCatalog(
      professionalFilterKeys
        .map((key) => answers[key] as Filter | undefined)
        .filter((filter): filter is Filter => Boolean(filter)),
      false,
    );
    if (!catalog) return;
    if (Number(catalog.pagination?.totals ?? catalog.products?.length ?? 0) === 0) {
      await showResults(acknowledged);
      return;
    }

    const key = professionalFacetStageMap[nextStage];
    const options = key
      ? (resolveScrewFinderFacets(catalog.facets ?? [])[key]?.values ?? []).filter((option) => (option.count ?? 0) > 0)
      : [];
    if (!key || options.length === 0) {
      nextIndex += 1;
      continue;
    }
    if (options.length === 1) {
      Object.assign(answers, { [key]: options[0] });
      automaticProfessionalKeys.value.add(key);
      liveMessage.value = t('optionAutomaticallySelected', { value: getFilterName(options[0]) });
      nextIndex += 1;
      continue;
    }

    await acknowledged;
    professionalFacetCatalog.value = catalog;
    navigateToStage(nextStage);
    return;
  }
};

const showResults = async (acknowledged: Promise<void> = Promise.resolve()) => {
  professionalRequestId += 1;
  loadingProfessionalFacets.value = false;
  loadingResults.value = true;
  matches.value = [];
  nearbyMatches.value = [];
  try {
    const exactProducts = await fetchAllCandidates(serializeFacetFilters(requiredFilters.value));
    matches.value = rankScrewFinderProducts(exactProducts, answers, resolvedContent.value.resultCount, facetMap.value);
    const remainingSlots = resolvedContent.value.resultCount - matches.value.length;
    if (remainingSlots > 0) {
      const alternativeProducts = await fetchAllCandidates(serializeFacetFilters(safetyCriticalFilters.value));
      const exactVariationIds = new Set(exactProducts.map((product) => String(productGetters.getVariationId(product))));
      const exactItemIds = new Set(exactProducts.map((product) => String(productGetters.getItemId(product))));
      const uniqueAlternatives = uniqueProductsByItem(
        alternativeProducts.filter(
          (product) =>
            !exactVariationIds.has(String(productGetters.getVariationId(product))) &&
            !exactItemIds.has(String(productGetters.getItemId(product))),
        ),
      );
      const initialAlternatives = buildNearbyMatches(uniqueAlternatives, answers, Math.max(remainingSlots * 4, 6), {
        facets: facetMap.value,
        confirmedFilters: safetyCriticalFilters.value,
      });
      const enrichedAlternatives = await enrichAlternativeProducts(initialAlternatives.map((match) => match.product));
      nearbyMatches.value = buildNearbyMatches(enrichedAlternatives, answers, remainingSlots, {
        facets: facetMap.value,
        confirmedFilters: safetyCriticalFilters.value,
      });
    }
    await acknowledged;
    navigateToStage('results');
    liveMessage.value = visibleMatches.value.length
      ? t('resultsLoaded', { count: visibleMatches.value.length })
      : t('noResultsLoaded');
  } catch {
    facetError.value = t('loadError');
    await acknowledged;
    navigateToStage('results');
  } finally {
    loadingResults.value = false;
  }
};

const openAnswerSummary = (summary: ScrewFinderAnswerSummary) => {
  if (answers.path === 'professional' && automaticProfessionalKeys.value.has(summary.key as ScrewFinderFacetKey)) {
    return;
  }
  if (summary.stage === activeStage.value) return;
  void runPreparedTransition(async (acknowledged) => {
    if (answers.path === 'professional') {
      await loadProfessionalFacetCatalog(professionalFiltersBeforeStage(summary.stage));
    }
    await acknowledged;
    navigateToStage(summary.stage);
  });
};

const productPath = (product: Product) => {
  return localePath(buildScrewFinderProductPath(product));
};

const loadFacets = async () => {
  try {
    facetCatalog.value = await fetchCatalogPage(1, '', 1);
    beginnerFacetCatalog.value = facetCatalog.value;
    beginnerLengthFacetCatalog.value = facetCatalog.value;
    professionalFacetCatalog.value = facetCatalog.value;
  } catch {
    facetError.value = t('loadError');
  }
};

void loadFacets();
</script>

<style scoped>
.finder-grid {
  background-image:
    linear-gradient(rgb(255 255 255 / 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / 0.035) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, black, transparent 90%);
}

.finder-scrollbar-hidden {
  scrollbar-width: none;
}

.finder-scrollbar-hidden::-webkit-scrollbar {
  display: none;
}

.finder-product-title {
  display: -webkit-box;
  height: 2.875rem;
  padding-bottom: 0.125rem;
  overflow: hidden;
  line-height: 1.375rem;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.finder-utility-button {
  @apply inline-flex items-center gap-1.5 rounded-sm px-2 py-2 text-xs font-bold text-white/65 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2;
  outline-color: var(--finder-accent);
}

.finder-path-button {
  @apply flex min-h-[92px] items-center justify-between gap-4 border border-white/15 bg-white/[0.055] px-5 py-4 text-left transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transform-none;
  outline-color: var(--finder-accent);
}

.finder-path-button strong,
.finder-path-button small {
  @apply block;
}

.finder-path-button strong {
  @apply text-base font-black;
}

.finder-path-button small {
  @apply mt-1 text-xs leading-5 text-white/55;
}

.finder-primary-button,
.finder-secondary-button {
  @apply inline-flex min-h-11 items-center gap-2 rounded-sm px-5 py-2.5 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2;
  outline-color: var(--finder-accent);
}

.finder-primary-button {
  background: var(--finder-accent);
  color: #171717;
}

.finder-primary-button:hover {
  filter: brightness(1.08);
}

.finder-secondary-button {
  @apply border border-white/15 bg-white/[0.055] text-white hover:border-white/30 hover:bg-white/10;
}

.finder-forward-enter-active,
.finder-forward-leave-active,
.finder-back-enter-active,
.finder-back-leave-active {
  transition:
    opacity 380ms ease,
    transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.finder-forward-enter-from,
.finder-back-leave-to {
  opacity: 0;
  transform: translateX(28px);
}

.finder-forward-leave-to,
.finder-back-enter-from {
  opacity: 0;
  transform: translateX(-28px);
}

@media (prefers-reduced-motion: reduce) {
  .finder-forward-enter-active,
  .finder-forward-leave-active,
  .finder-back-enter-active,
  .finder-back-leave-active {
    transition: none;
  }
}
</style>

<i18n lang="json">
{
  "de": {
    "back": "Zurück",
    "restart": "Neu starten",
    "step": "Schritt {current} von {total}",
    "selectionOverview": "Ihre bisherige Auswahl",
    "preparingNextQuestion": "Nächste Auswahl wird vorbereitet",
    "beginnerHint": "Geführte Auswahl ohne Fachwissen",
    "professionalHint": "Technische Werte direkt festlegen",
    "applicationTitle": "Was möchten Sie befestigen?",
    "applicationText": "Wählen Sie den Einsatzbereich. Wir übersetzen ihn in technische Anforderungen.",
    "environmentTitle": "Wo wird die Schraube eingesetzt?",
    "environmentText": "Die Umgebung bestimmt vor allem den erforderlichen Korrosionsschutz.",
    "headPreferenceTitle": "Wie soll der Schraubenkopf wirken?",
    "headPreferenceText": "Damit bestimmen Sie Optik, Auflagefläche und Klemmwirkung.",
    "demandTitle": "Wie stark wird die Verbindung belastet?",
    "demandText": "Eine grobe Einschätzung reicht. Exakte Maße können Sie im nächsten Schritt ergänzen.",
    "sizeTitle": "Kennen Sie bereits die Abmessungen?",
    "sizeText": "Optional: Wählen Sie Durchmesser und Gesamtlänge aus den aktuell verfügbaren Shop-Filtern.",
    "diameter": "Durchmesser",
    "length": "Gesamtlänge",
    "skipSize": "Ohne exakte Maße",
    "showMatches": "Treffer anzeigen",
    "availableProducts": "{count} Produkte",
    "availableProduct": "1 Produkt",
    "updatingOptions": "Verfügbare Optionen werden aktualisiert.",
    "optionAutomaticallySelected": "{value} wurde automatisch gewählt, da nur diese Option verfügbar ist.",
    "facetUnavailable": "Dieser technische Filter ist in der gewählten Kategorie derzeit nicht verfügbar.",
    "continue": "Weiter",
    "resultEyebrow": "Live aus dem Sortiment",
    "noExactMatch": "Keine exakte Übereinstimmung",
    "resultSummary": "{count} Produkte wurden anhand Ihrer Angaben priorisiert.",
    "resultSummarySingle": "1 Produkt wurde anhand Ihrer Angaben priorisiert.",
    "mixedResultSummarySingleSingle": "1 exakter Treffer und 1 nächstbeste Alternative.",
    "mixedResultSummarySingleMultiple": "1 exakter Treffer und {alternatives} nächstbeste Alternativen.",
    "mixedResultSummaryMultipleSingle": "{exact} exakte Treffer und 1 nächstbeste Alternative.",
    "mixedResultSummaryMultipleMultiple": "{exact} exakte Treffer und {alternatives} nächstbeste Alternativen.",
    "nearbySummary": "Diese Alternativen weichen technisch ab. Bitte prüfen Sie die gekennzeichneten Unterschiede.",
    "allMatches": "Alle technisch passenden Schrauben",
    "exactMatch": "Passender Treffer",
    "nearbyMatch": "Alternative prüfen",
    "criteriaLabel": "Abgleich Ihrer Auswahl",
    "selectedInstead": "gewählt: {value}",
    "availableIn": "Verfügbar in {values}",
    "availableValuesPreview": "{values} und {count} weitere",
    "notVerifiable": "nicht verifizierbar",
    "productDetails": "Produkt ansehen",
    "adjustAnswers": "Auswahl anpassen",
    "loading": "Passende Produkte werden geladen.",
    "stageChanged": "Nächster Schritt geöffnet.",
    "resultsLoaded": "{count} passende Produkte geladen.",
    "noResultsLoaded": "Keine exakten Produkte gefunden.",
    "loadError": "Die aktuellen Produktdaten konnten nicht geladen werden. Bitte versuchen Sie es erneut.",
    "applications": {
      "interior": "Möbel & Innenausbau",
      "interiorHint": "Holz, Platten und Beschläge",
      "structural": "Konstruktiver Holzbau",
      "structuralHint": "Balken, Pfosten und tragende Verbindungen",
      "terrace": "Terrasse & Außenbereich",
      "terraceHint": "Dielen und wetterbelastetes Holz",
      "drywall": "Trockenbau",
      "drywallHint": "Gipskarton und Unterkonstruktionen",
      "window": "Fenster & Rahmen",
      "windowHint": "Rahmen- und Fenstermontage",
      "roofing": "Dach & Blech",
      "roofingHint": "Fassade, Spenglerarbeiten und EPDM"
    },
    "environments": {
      "indoor": "Trockener Innenraum",
      "indoorHint": "Keine direkte Feuchtigkeit",
      "protected": "Feucht, aber geschützt",
      "protectedHint": "Keller, Bad oder überdachter Bereich",
      "outdoor": "Direkt bewittert",
      "outdoorHint": "Regen und wechselnde Feuchtigkeit",
      "corrosive": "Stark korrosiv",
      "corrosiveHint": "Küste, Pool oder aggressive Umgebung"
    },
    "heads": {
      "flush": "Bündig",
      "flushHint": "Kopf soll im Material verschwinden",
      "lowProfile": "Flach aufliegend",
      "lowProfileHint": "Niedrige, sichtbare Kopfform",
      "clamping": "Stark klemmend",
      "clampingHint": "Große Auflagefläche",
      "concealed": "Nahezu unsichtbar",
      "concealedHint": "Kleiner oder kopfloser Abschluss",
      "any": "Keine Präferenz",
      "anyHint": "Technische Eignung entscheidet"
    },
    "demands": {
      "light": "Leicht",
      "lightHint": "Leisten, kleine Beschläge und Verkleidungen",
      "general": "Allgemein",
      "generalHint": "Typische Holz- und Montagearbeiten",
      "heavy": "Hoch",
      "heavyHint": "Konstruktive oder stark belastete Verbindung"
    },
    "professional": {
      "material": {
        "title": "Werkstoff wählen",
        "description": "Der Werkstoff ist eine feste technische Vorgabe und wird nicht automatisch gelockert."
      },
      "head": {
        "title": "Kopfform wählen",
        "description": "Wählen Sie die benötigte Auflage- und Abschlussform."
      },
      "diameter": {
        "title": "Durchmesser wählen",
        "description": "Die Auswahl wird exakt auf den aktuellen Shop-Filter angewendet."
      },
      "length": {
        "title": "Gesamtlänge wählen",
        "description": "Die Auswahl wird exakt auf den aktuellen Shop-Filter angewendet."
      },
      "drive": {
        "title": "Antrieb wählen",
        "description": "Optionaler technischer Filter für das passende Werkzeug."
      },
      "package": {
        "title": "Packungsmenge wählen",
        "description": "Optionaler Filter für die gewünschte Gebindegröße."
      }
    },
    "summary": {
      "application": "Einsatz",
      "environment": "Umgebung",
      "headPreference": "Kopfwirkung",
      "demand": "Belastung",
      "material": "Werkstoff",
      "head": "Kopfform",
      "diameter": "Durchmesser",
      "length": "Länge",
      "drive": "Antrieb",
      "package": "Menge"
    }
  },
  "en": {
    "back": "Back",
    "restart": "Restart",
    "step": "Step {current} of {total}",
    "selectionOverview": "Your current selection",
    "preparingNextQuestion": "Preparing the next selection",
    "beginnerHint": "Guided selection without technical knowledge",
    "professionalHint": "Set technical values directly",
    "applicationTitle": "What are you fastening?",
    "applicationText": "Choose the application and we will translate it into technical requirements.",
    "environmentTitle": "Where will the screw be used?",
    "environmentText": "The environment primarily determines the required corrosion resistance.",
    "headPreferenceTitle": "How should the screw head finish?",
    "headPreferenceText": "This determines appearance, bearing surface and clamping effect.",
    "demandTitle": "How heavily loaded is the connection?",
    "demandText": "A rough estimate is enough. Exact dimensions can be added next.",
    "sizeTitle": "Do you know the dimensions?",
    "sizeText": "Optional: select diameter and total length from the currently available shop facets.",
    "diameter": "Diameter",
    "length": "Total length",
    "skipSize": "Without exact dimensions",
    "showMatches": "Show matches",
    "availableProducts": "{count} products",
    "availableProduct": "1 product",
    "updatingOptions": "Updating available options.",
    "optionAutomaticallySelected": "{value} was selected automatically because it is the only available option.",
    "facetUnavailable": "This technical facet is not currently available in the selected category.",
    "continue": "Continue",
    "resultEyebrow": "Live from the catalog",
    "noExactMatch": "No exact match",
    "resultSummary": "{count} products were prioritized from your answers.",
    "resultSummarySingle": "1 product was prioritized from your answers.",
    "mixedResultSummarySingleSingle": "1 exact match and 1 next-best alternative.",
    "mixedResultSummarySingleMultiple": "1 exact match and {alternatives} next-best alternatives.",
    "mixedResultSummaryMultipleSingle": "{exact} exact matches and 1 next-best alternative.",
    "mixedResultSummaryMultipleMultiple": "{exact} exact matches and {alternatives} next-best alternatives.",
    "nearbySummary": "These alternatives differ technically. Check the highlighted differences.",
    "allMatches": "All technically matching screws",
    "exactMatch": "Matching result",
    "nearbyMatch": "Check alternative",
    "criteriaLabel": "Your selection compared",
    "selectedInstead": "selected: {value}",
    "availableIn": "Available in {values}",
    "availableValuesPreview": "{values} and {count} more",
    "notVerifiable": "not verifiable",
    "productDetails": "View product",
    "adjustAnswers": "Adjust selection",
    "loading": "Loading matching products.",
    "stageChanged": "Next step opened.",
    "resultsLoaded": "{count} matching products loaded.",
    "noResultsLoaded": "No exact products found.",
    "loadError": "Current product data could not be loaded. Please try again.",
    "applications": {
      "interior": "Furniture & interior",
      "interiorHint": "Wood, boards and fittings",
      "structural": "Structural timber",
      "structuralHint": "Beams, posts and structural joints",
      "terrace": "Decking & outdoors",
      "terraceHint": "Deck boards and weather-exposed timber",
      "drywall": "Drywall",
      "drywallHint": "Plasterboard and substructures",
      "window": "Windows & frames",
      "windowHint": "Frame and window installation",
      "roofing": "Roofing & sheet metal",
      "roofingHint": "Facades, roofing and EPDM"
    },
    "environments": {
      "indoor": "Dry indoors",
      "indoorHint": "No direct moisture",
      "protected": "Damp but protected",
      "protectedHint": "Basement, bathroom or covered area",
      "outdoor": "Weather exposed",
      "outdoorHint": "Rain and changing moisture",
      "corrosive": "Highly corrosive",
      "corrosiveHint": "Coast, pool or aggressive environment"
    },
    "heads": {
      "flush": "Flush",
      "flushHint": "Head should sit in the material",
      "lowProfile": "Low profile",
      "lowProfileHint": "Low, visible head",
      "clamping": "Strong clamping",
      "clampingHint": "Large bearing surface",
      "concealed": "Nearly concealed",
      "concealedHint": "Small or headless finish",
      "any": "No preference",
      "anyHint": "Technical suitability decides"
    },
    "demands": {
      "light": "Light",
      "lightHint": "Trim, small fittings and cladding",
      "general": "General",
      "generalHint": "Typical timber and assembly work",
      "heavy": "Heavy",
      "heavyHint": "Structural or heavily loaded connection"
    },
    "professional": {
      "material": {
        "title": "Choose material",
        "description": "Material is an exact specification and is never relaxed."
      },
      "head": { "title": "Choose head type", "description": "Select the required bearing and finish shape." },
      "diameter": { "title": "Choose diameter", "description": "Applied exactly using the current shop facet." },
      "length": { "title": "Choose total length", "description": "Applied exactly using the current shop facet." },
      "drive": { "title": "Choose drive", "description": "Optional technical facet for the matching tool." },
      "package": { "title": "Choose package quantity", "description": "Optional facet for the desired pack size." }
    },
    "summary": {
      "application": "Application",
      "environment": "Environment",
      "headPreference": "Head finish",
      "demand": "Load",
      "material": "Material",
      "head": "Head",
      "diameter": "Diameter",
      "length": "Length",
      "drive": "Drive",
      "package": "Quantity"
    }
  }
}
</i18n>
