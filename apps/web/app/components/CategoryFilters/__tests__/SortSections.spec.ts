import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { CategoryFiltersSortSections } from '#components';
import type { FilterGroup } from '@plentymarkets/shop-api';
import type { SortFilterContent } from '~/components/blocks/SortFilter/types';

const { routeQuery, getFacetsFromURL } = vi.hoisted(() => {
  const routeQuery = { value: {} as Record<string, string> };
  return {
    routeQuery,
    getFacetsFromURL: vi.fn(() => ({ facets: routeQuery.value.facets })),
  };
});

mockNuxtImport('useCategoryFilter', () => () => ({
  getFacetsFromURL,
  updateFilters: vi.fn(),
  updatePrices: vi.fn(),
}));

mockNuxtImport('useRouter', () => () => ({
  currentRoute: { value: { query: routeQuery.value } },
}));

const createFacet = (type = 'dynamic', valueCount = 5): FilterGroup =>
  ({
    id: `facet-${type}`,
    name: 'Test facet',
    type,
    values: Array.from({ length: valueCount }, (_, index) => ({
      id: index + 1,
      name: `Option ${index + 1}`,
      count: valueCount - index,
    })),
  }) as FilterGroup;

const createConfiguration = (overrides: Partial<SortFilterContent> = {}): SortFilterContent => ({
  fields: {
    category: true,
    sortBy: true,
    perPage: true,
    itemRating: true,
    manufacturer: true,
    price: true,
    availability: true,
    customizedFilters: true,
  },
  filtersOrder: ['customizedFilters'],
  filtersDisabled: [],
  showAllFiltersImmediately: true,
  numberOfFiltersToShowInitially: 0,
  collapseLongFilterLists: true,
  initiallyVisibleFilterOptions: 3,
  layout: {},
  ...overrides,
});

const mountFacet = (facet = createFacet(), configuration = createConfiguration(), renderKey = 'customizedFilters') =>
  mount(CategoryFiltersSortSections, {
    props: { facet, configuration, renderKey },
  });

describe('<SortSections /> collapsible values', () => {
  beforeEach(() => {
    routeQuery.value = {};
    getFacetsFromURL.mockClear();
  });

  it('renders all options when the feature is disabled', () => {
    const wrapper = mountFacet(createFacet(), createConfiguration({ collapseLongFilterLists: false }));

    expect(wrapper.findAll('[data-testid^="category-filter-"]')).toHaveLength(5);
    expect(wrapper.find('[data-testid="filter-options-toggle"]').exists()).toBe(false);
  });

  it('does not collapse when only one option would be hidden', () => {
    const wrapper = mountFacet(createFacet('dynamic', 4));

    expect(wrapper.findAll('[data-testid^="category-filter-"]')).toHaveLength(4);
    expect(wrapper.find('[data-testid="filter-options-toggle"]').exists()).toBe(false);
  });

  it('expands and collapses a long dynamic option list', async () => {
    const wrapper = mountFacet();
    const toggle = wrapper.get('[data-testid="filter-options-toggle"]');

    expect(wrapper.findAll('[data-testid^="category-filter-"]')).toHaveLength(3);
    expect(toggle.text()).toContain('2');
    expect(toggle.attributes('aria-expanded')).toBe('false');

    await toggle.trigger('click');

    expect(wrapper.findAll('[data-testid^="category-filter-"]')).toHaveLength(5);
    expect(toggle.attributes('aria-expanded')).toBe('true');

    await toggle.trigger('click');

    expect(wrapper.findAll('[data-testid^="category-filter-"]')).toHaveLength(3);
  });

  it('keeps selected options visible and reduces the hidden count', () => {
    routeQuery.value = { facets: '5' };
    const wrapper = mountFacet();

    expect(wrapper.findAll('[data-testid^="category-filter-"]')).toHaveLength(4);
    expect(wrapper.text()).toContain('Option 5');
    expect(wrapper.get('[data-testid="filter-options-toggle"]').text()).toContain('1');
  });

  it('keeps expansion state when facet counts update', async () => {
    const facet = createFacet();
    const wrapper = mountFacet(facet);
    await wrapper.get('[data-testid="filter-options-toggle"]').trigger('click');

    const updatedFacet = {
      ...facet,
      values: facet.values?.map((value) => ({ ...value, count: Number(value.count) + 1 })),
    };
    await wrapper.setProps({ facet: updatedFacet });

    expect(wrapper.findAll('[data-testid^="category-filter-"]')).toHaveLength(5);
    expect(wrapper.get('[data-testid="filter-options-toggle"]').attributes('aria-expanded')).toBe('true');
  });

  it('keeps expansion state independent across facets', async () => {
    const first = mountFacet(createFacet());
    const second = mountFacet({ ...createFacet(), id: 'second-facet', name: 'Second facet' } as FilterGroup);

    await first.get('[data-testid="filter-options-toggle"]').trigger('click');

    expect(first.findAll('[data-testid^="category-filter-"]')).toHaveLength(5);
    expect(second.findAll('[data-testid^="category-filter-"]')).toHaveLength(3);
  });

  it('does not collapse non-dynamic facets', () => {
    const wrapper = mountFacet(createFacet('availability'), createConfiguration(), 'availability');

    expect(wrapper.findAll('[data-testid^="category-filter-"]')).toHaveLength(5);
    expect(wrapper.find('[data-testid="filter-options-toggle"]').exists()).toBe(false);
  });

  it('falls back to three initially visible options for invalid configuration', () => {
    const wrapper = mountFacet(createFacet(), createConfiguration({ initiallyVisibleFilterOptions: 0 }));

    expect(wrapper.findAll('[data-testid^="category-filter-"]')).toHaveLength(3);
    expect(wrapper.get('[data-testid="filter-options-toggle"]').text()).toContain('2');
  });
});
