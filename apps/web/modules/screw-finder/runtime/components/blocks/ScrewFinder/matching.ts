import { productGetters, type Filter, type FilterGroup, type Product } from '@plentymarkets/shop-api';
import type {
  ScrewFinderAnswers,
  ScrewFinderApplication,
  ScrewFinderCriterion,
  ScrewFinderEnvironment,
  ScrewFinderFacetKey,
  ScrewFinderFacetMap,
  ScrewFinderMatch,
  ScrewFinderReasonKey,
} from './types';

const normalize = (value = '') =>
  value
    .toLocaleLowerCase()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .replaceAll(/[^a-z0-9]+/g, ' ')
    .trim();

const facetAliases: Record<ScrewFinderFacetKey, string[]> = {
  material: ['werkstoff', 'material'],
  head: ['kopfform', 'kopf', 'head type', 'head'],
  drive: ['antrieb', 'drive'],
  diameter: ['durchmesser', 'diameter'],
  length: ['gesamtlange', 'lange', 'total length', 'length'],
  package: ['menge', 'packungsinhalt', 'quantity', 'package'],
};

const applicationRules: Record<
  ScrewFinderApplication,
  { positive: string[]; negative: string[]; requiresOutdoorMaterial: boolean }
> = {
  interior: {
    positive: ['spanplatte', 'mobel', 'innenbereich', 'holzschraube', 'senkkopf'],
    negative: ['gipskarton', 'fensterrahmen', 'spengler'],
    requiresOutdoorMaterial: false,
  },
  structural: {
    positive: ['konstruktiver holzbau', 'tragende', 'eta', 'tellerkopf', 'pfosten', 'vollgewinde'],
    negative: ['gipskarton', 'spengler'],
    requiresOutdoorMaterial: false,
  },
  terrace: {
    positive: ['terrasse', 'terrassendiele', 'aussenanwendung', 'edelstahl', 'a2', 'a4'],
    negative: ['gipskarton', 'innenbereich'],
    requiresOutdoorMaterial: true,
  },
  drywall: {
    positive: ['gipskarton', 'trockenbau', 'gipsfaser', 'schnellbauschraube', 'trompetenkopf'],
    negative: ['terrasse', 'fensterrahmen', 'spengler'],
    requiresOutdoorMaterial: false,
  },
  window: {
    positive: ['fensterrahmen', 'fenstermontage', 'rahmenschraube', 'fenster'],
    negative: ['gipskarton', 'terrassendiele'],
    requiresOutdoorMaterial: false,
  },
  roofing: {
    positive: ['spengler', 'dach', 'fassade', 'epdm', 'blech'],
    negative: ['gipskarton', 'mobel'],
    requiresOutdoorMaterial: true,
  },
};

const getEffectiveBeginnerEnvironment = (answers: ScrewFinderAnswers): ScrewFinderEnvironment | undefined =>
  answers.environment ??
  (answers.application && applicationRules[answers.application].requiresOutdoorMaterial ? 'outdoor' : undefined);

export const resolveScrewFinderFacets = (facets: FilterGroup[]): ScrewFinderFacetMap => {
  const dynamicFacets = facets.filter((facet) => facet.type === 'dynamic');
  return Object.fromEntries(
    Object.entries(facetAliases).flatMap(([key, aliases]) => {
      const facet = dynamicFacets.find((candidate) => aliases.includes(normalize(candidate.name)));
      return facet ? [[key, facet]] : [];
    }),
  ) as ScrewFinderFacetMap;
};

export const getFilterName = (filter?: Filter) => filter?.name || filter?.names?.find((name) => name.name)?.name || '';

export const getFacetValue = (facet: FilterGroup | undefined, aliases: string[]) => {
  const normalizedAliases = aliases.map(normalize);
  return facet?.values?.find((value) =>
    normalizedAliases.some((alias) => normalize(getFilterName(value)).includes(alias)),
  );
};

export const getRequiredFacetFilters = (answers: ScrewFinderAnswers, facets: ScrewFinderFacetMap): Filter[] => {
  const filters: Filter[] = [];
  const add = (filter?: Filter) => {
    if (filter && !filters.some((candidate) => String(candidate.id) === String(filter.id))) filters.push(filter);
  };

  if (answers.path === 'professional') {
    add(answers.material);
    add(answers.head);
    add(answers.diameter);
    add(answers.length);
    add(answers.drive);
    add(answers.package);
  } else {
    const environment = getEffectiveBeginnerEnvironment(answers);
    if (environment === 'outdoor') {
      add(getFacetValue(facets.material, ['a2', 'a4']));
    }
    if (environment === 'corrosive') {
      add(getFacetValue(facets.material, ['a4']));
    }
    add(answers.diameter);
    add(answers.length);
  }

  return filters;
};

export const getSafetyCriticalFilters = (answers: ScrewFinderAnswers, facets: ScrewFinderFacetMap): Filter[] => {
  if (answers.path === 'professional') return answers.material ? [answers.material] : [];
  const environment = getEffectiveBeginnerEnvironment(answers);
  if (environment === 'outdoor') {
    return ['a2', 'a4']
      .map((material) => getFacetValue(facets.material, [material]))
      .filter((filter): filter is Filter => Boolean(filter));
  }
  if (environment === 'corrosive') {
    const material = getFacetValue(facets.material, ['a4']);
    return material ? [material] : [];
  }
  return [];
};

/**
 * Returns separately queryable exact-filter branches when multiple material values are valid.
 */
export const getRequiredFacetFilterBranches = (
  answers: ScrewFinderAnswers,
  facets: ScrewFinderFacetMap,
): Filter[][] => {
  const requiredFilters = getRequiredFacetFilters(answers, facets);
  if (answers.path !== 'beginner' || getEffectiveBeginnerEnvironment(answers) !== 'outdoor') {
    return [requiredFilters];
  }

  const materialFilters = getSafetyCriticalFilters(answers, facets);
  const materialFilterIds = new Set(materialFilters.map((filter) => String(filter.id)));
  const sharedFilters = requiredFilters.filter((filter) => !materialFilterIds.has(String(filter.id)));
  return materialFilters.map((material) => [material, ...sharedFilters]);
};

/**
 * Returns separately queryable safety-filter branches for alternative matching.
 */
export const getSafetyCriticalFilterBranches = (
  answers: ScrewFinderAnswers,
  facets: ScrewFinderFacetMap,
): Filter[][] => {
  const safetyFilters = getSafetyCriticalFilters(answers, facets);
  return answers.path === 'beginner' && getEffectiveBeginnerEnvironment(answers) === 'outdoor'
    ? safetyFilters.map((filter) => [filter])
    : [safetyFilters];
};

/**
 * Confirms that beginner environment requirements can be enforced by the live material facets.
 */
export const hasRequiredSafetyFilters = (answers: ScrewFinderAnswers, facets: ScrewFinderFacetMap): boolean => {
  if (answers.path !== 'beginner') {
    return true;
  }
  const environment = getEffectiveBeginnerEnvironment(answers);
  if (environment === 'outdoor') {
    return Boolean(getFacetValue(facets.material, ['a2', 'a4']));
  }
  if (environment === 'corrosive') {
    return Boolean(getFacetValue(facets.material, ['a4']));
  }
  return true;
};

export const serializeFacetFilters = (filters: Filter[]) => filters.map((filter) => String(filter.id)).join(',');

export const buildScrewFinderProductPath = (product: Product) => {
  const basePath = `/${productGetters.getUrlPath(product)}_${productGetters.getItemId(product)}`;
  const variationId = productGetters.getVariationId(product);
  return variationId ? `${basePath}_${variationId}` : basePath;
};

const productSearchText = (product: Product) =>
  normalize(
    [
      productGetters.getName(product),
      productGetters.getShortDescription(product),
      productGetters.getDescription(product),
      productGetters.getTechnicalData(product),
      productGetters.getUrlPath(product),
    ].join(' '),
  );

const preferenceSignals = (answers: ScrewFinderAnswers) => {
  const signals: { terms: string[]; reason: ScrewFinderReasonKey; weight: number }[] = [];
  const headSignals = {
    flush: ['senkkopf'],
    'low-profile': ['linsenkopf', 'flachkopf'],
    clamping: ['tellerkopf'],
    concealed: ['ohne kopf', 'kopflose'],
    any: [],
  };
  const demandSignals = {
    light: ['klein', 'leicht'],
    general: ['universalschraube', 'spanplatte'],
    heavy: ['tellerkopf', 'vollgewinde', 'eta', 'tragende'],
  };

  if (answers.headPreference && answers.headPreference !== 'any') {
    signals.push({
      terms: headSignals[answers.headPreference],
      reason: 'headPreference',
      weight: 3,
    });
  }
  if (answers.demand) {
    signals.push({ terms: demandSignals[answers.demand], reason: 'demand', weight: 2 });
  }

  return signals;
};

const professionalCriterionKeys: ScrewFinderFacetKey[] = ['material', 'head', 'diameter', 'length', 'drive', 'package'];

const selectedProfessionalFilters = (answers: ScrewFinderAnswers) =>
  professionalCriterionKeys
    .map((key) => ({ key, filter: answers[key] as Filter | undefined }))
    .filter((entry): entry is { key: ScrewFinderFacetKey; filter: Filter } => Boolean(entry.filter));

const formatMeasurement = (value: string) => {
  const number = Number(value.replace(',', '.'));
  return Number.isFinite(number) ? new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(number) : value;
};

const uniqueNaturalValues = (values: string[]) =>
  [...new Set(values)].sort((left, right) => left.localeCompare(right, 'de', { numeric: true, sensitivity: 'base' }));

const productVariationTexts = (product: Product) =>
  product.variationAttributeMap?.attributes.flatMap((attribute) => attribute.values.map((value) => value.name)) ?? [];

const productDetailText = (product: Product) =>
  [
    productSearchText(product),
    productVariationTexts(product).join(' '),
    product.groupedAttributes?.map((attribute) => `${attribute.name} ${attribute.value}`).join(' '),
    JSON.stringify(product.images),
  ].join(' ');

const availableDimensionValues = (product: Product, key: 'diameter' | 'length') => {
  const values = productVariationTexts(product).flatMap((value) => {
    const match = value.match(/(\d+(?:[.,]\d+)?)\s*(?:x|×)\s*(\d+(?:[.,]\d+)?)\s*mm/i);
    if (!match) return [];
    return [`${formatMeasurement(key === 'diameter' ? match[1]! : match[2]!)} mm`];
  });
  return uniqueNaturalValues(values);
};

const availableAttributeValues = (product: Product, key: ScrewFinderFacetKey) => {
  if (key === 'diameter' || key === 'length') return availableDimensionValues(product, key);
  if (key === 'package') {
    const values = [
      ...productDetailText(product).matchAll(/(\d{1,3}(?:[.\s]\d{3})+|\d+)\s*(?:stück|stueck|stuck|pcs?)/gi),
    ].map((match) => match[1]!.replaceAll(/[.\s]/g, ''));
    return uniqueNaturalValues(values);
  }

  const aliases = facetAliases[key];
  const attribute = product.variationAttributeMap?.attributes.find((candidate) =>
    aliases.some((alias) => normalize(candidate.name).includes(alias)),
  );
  return uniqueNaturalValues(attribute?.values.map((value) => value.name).filter(Boolean) ?? []);
};

const criterionForFilter = (
  product: Product,
  key: ScrewFinderFacetKey,
  selected: Filter,
  context: { exact: boolean; facets: ScrewFinderFacetMap },
): ScrewFinderCriterion => {
  const text = productSearchText(product);
  const selectedValue = getFilterName(selected);
  if (context.exact || text.includes(normalize(selectedValue))) {
    return { key, selectedValue, status: 'match' };
  }

  const availableValues = availableAttributeValues(product, key);
  if (availableValues.some((value) => normalize(value) === normalize(selectedValue))) {
    return { key, selectedValue, status: 'match' };
  }
  if (availableValues.length) {
    return {
      key,
      selectedValue,
      availableValues,
      status: 'available',
    };
  }

  const actualValue = context.facets[key]?.values
    ?.filter((value) => String(value.id) !== String(selected.id))
    .map(getFilterName)
    .find((value) => value && text.includes(normalize(value)));

  return actualValue
    ? { key, selectedValue, actualValue, status: 'mismatch' }
    : { key, selectedValue, status: 'unknown' };
};

export const buildMatchCriteria = (
  product: Product,
  answers: ScrewFinderAnswers,
  exact: boolean,
  context: { facets?: ScrewFinderFacetMap; confirmedFilterIds?: string[] } = {},
): ScrewFinderCriterion[] => {
  const text = productSearchText(product);
  const facets = context.facets ?? {};
  const confirmedFilterIds = context.confirmedFilterIds ?? [];

  if (answers.path === 'professional') {
    return selectedProfessionalFilters(answers).map(({ key, filter }) => {
      const confirmed = confirmedFilterIds.includes(String(filter.id));
      return criterionForFilter(product, key, filter, { exact: exact || confirmed, facets });
    });
  }

  const criteria: ScrewFinderCriterion[] = [];
  if (answers.application) {
    const rule = applicationRules[answers.application];
    const positive = rule.positive.some((term) => text.includes(normalize(term)));
    const negative = rule.negative.some((term) => text.includes(normalize(term)));
    criteria.push({
      key: 'application',
      selectedValue: answers.application,
      status: positive ? 'match' : negative ? 'mismatch' : 'unknown',
    });
  }
  if (answers.environment) {
    criteria.push({
      key: 'environment',
      selectedValue: answers.environment,
      status: exact && (answers.environment === 'outdoor' || answers.environment === 'corrosive') ? 'match' : 'unknown',
    });
  }
  if (answers.headPreference && answers.headPreference !== 'any') {
    const signal = preferenceSignals(answers)[0];
    criteria.push({
      key: 'headPreference',
      selectedValue: answers.headPreference,
      status: signal?.terms.some((term) => text.includes(normalize(term))) ? 'match' : 'unknown',
    });
  }
  if (answers.demand) {
    const signal = preferenceSignals({ ...answers, headPreference: undefined }).find(
      (preference) => preference.reason === 'demand',
    );
    criteria.push({
      key: 'demand',
      selectedValue: answers.demand,
      status: signal?.terms.some((term) => text.includes(normalize(term))) ? 'match' : 'unknown',
    });
  }
  for (const key of ['diameter', 'length'] as const) {
    const filter = answers[key];
    if (filter) criteria.push(criterionForFilter(product, key, filter, { exact, facets }));
  }

  return criteria;
};

export const rankScrewFinderProducts = (
  products: Product[],
  answers: ScrewFinderAnswers,
  limit = 3,
  facets: ScrewFinderFacetMap = {},
): ScrewFinderMatch[] => {
  const application = answers.application ? applicationRules[answers.application] : undefined;
  const preferences = preferenceSignals(answers);

  return products
    .flatMap((product, index) => {
      const text = productSearchText(product);
      const reasons: ScrewFinderReasonKey[] = [];
      let score = Math.max(0, 100 - index) / 100;

      if (application) {
        const positiveHits = application.positive.filter((term) => text.includes(normalize(term))).length;
        const negativeHits = application.negative.filter((term) => text.includes(normalize(term))).length;
        if (positiveHits === 0 && negativeHits > 0) {
          return [];
        }
        score += positiveHits * 5 - negativeHits * 7;
        if (positiveHits) reasons.push('applicationSuitable');
      }

      for (const preference of preferences) {
        if (preference.terms.some((term) => text.includes(normalize(term)))) {
          score += preference.weight;
          reasons.push(preference.reason);
        }
      }

      const environment = getEffectiveBeginnerEnvironment(answers);
      if (environment === 'outdoor' || environment === 'corrosive') {
        reasons.push('corrosionResistant');
      }
      if (answers.diameter || answers.length) reasons.push('selectedSize');
      if (answers.path === 'professional') reasons.push('technicalFilters');

      return [
        {
          product,
          score,
          exact: true,
          reasons: [...new Set(reasons)].slice(0, 3),
          differences: [],
          criteria: buildMatchCriteria(product, answers, true, { facets }),
        },
      ];
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
};

export const buildNearbyMatches = (
  products: Product[],
  answers: ScrewFinderAnswers,
  limit = 3,
  context: { facets?: ScrewFinderFacetMap; confirmedFilters?: Filter[] } = {},
): ScrewFinderMatch[] =>
  products
    .map<ScrewFinderMatch>((product, index) => {
      const facets = context.facets ?? {};
      const confirmedFilters = context.confirmedFilters ?? [];
      const criteria = buildMatchCriteria(product, answers, false, {
        facets,
        confirmedFilterIds: confirmedFilters.map((filter) => String(filter.id)),
      });
      const differences = criteria
        .filter((criterion) => criterion.status === 'mismatch')
        .map(
          (criterion) => `${criterion.key}: ${criterion.actualValue ?? 'abweichend'} statt ${criterion.selectedValue}.`,
        );
      const criterionWeights: Record<ScrewFinderCriterion['key'], number> = {
        material: 1000,
        diameter: 18,
        length: 18,
        head: 8,
        drive: 4,
        package: 2,
        application: 8,
        environment: 1000,
        headPreference: 5,
        demand: 4,
      };
      const distance = criteria.reduce((total, criterion) => {
        const weight = criterionWeights[criterion.key];
        if (criterion.status === 'mismatch') return total + weight;
        if (criterion.status === 'available') return total + weight;
        if (criterion.status === 'unknown') return total + weight / 3;
        return total;
      }, 0);

      return {
        product,
        score: -distance - index / 1000,
        exact: false,
        reasons: ['nearby'],
        differences,
        criteria,
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
