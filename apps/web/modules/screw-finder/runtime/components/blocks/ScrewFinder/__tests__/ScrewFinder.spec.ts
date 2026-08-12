import { flushPromises, mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ScrewFinder from '../ScrewFinder.vue';

const { getFacet, localePath } = vi.hoisted(() => ({ getFacet: vi.fn(), localePath: vi.fn() }));

mockNuxtImport('useSdk', () => () => ({
  plentysystems: { getFacet },
}));

mockNuxtImport('usePriceFormatter', () => () => ({
  format: (value: number) => `${value.toFixed(2)} €`,
}));

mockNuxtImport('useLocalePath', () => () => localePath);

const props = {
  name: 'ScrewFinder',
  type: 'content',
  meta: { uuid: 'finder-test' },
  content: {
    sourceCategoryPath: '/schrauben',
    resultCount: 3,
  },
};

const facetResponse = (facets: unknown[], totals = 5) => ({
  data: {
    facets,
    products: [],
    pagination: { totals },
  },
});
const delayedFacetResponse = (facets: unknown[], totals = 5, delay = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(facetResponse(facets, totals)), delay));

const materialFacet = {
  id: 1,
  name: 'Werkstoff',
  type: 'dynamic',
  count: 2,
  values: [
    { id: 10, name: 'Edelstahl C2', count: 1 },
    { id: 11, name: 'Edelstahl A2', count: 4 },
    { id: 12, name: 'Edelstahl A4', count: 2 },
  ],
};
const headFacet = {
  id: 2,
  name: 'Kopfform',
  type: 'dynamic',
  count: 1,
  values: [{ id: 20, name: 'Senkkopf', count: 1 }],
};
const diameterFacet = {
  id: 3,
  name: 'Durchmesser',
  type: 'dynamic',
  count: 2,
  values: [
    { id: 30, name: '4 mm', count: 1 },
    { id: 32, name: '4,5 mm', count: 1 },
    { id: 31, name: '5 mm', count: 0 },
  ],
};
const lengthFacet = {
  id: 4,
  name: 'Gesamtlänge',
  type: 'dynamic',
  count: 2,
  values: [
    { id: 40, name: '40 mm', count: 1 },
    { id: 41, name: '50 mm', count: 1 },
  ],
};

const waitForTransition = async () => {
  await flushPromises();
  await new Promise((resolve) => setTimeout(resolve, 750));
};

describe('ScrewFinder', () => {
  beforeEach(() => {
    getFacet.mockReset();
    getFacet.mockResolvedValue(facetResponse([materialFacet, headFacet, diameterFacet]));
    localePath.mockReset();
    localePath.mockImplementation((path: string) => path);
  });

  it('should render both entry paths by default', () => {
    const wrapper = mount(ScrewFinder, { props });

    expect(wrapper.find('[data-testid="screw-finder-beginner"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="screw-finder-professional"]').exists()).toBe(true);
    expect(wrapper.get('[data-testid="screw-finder-beginner"]').classes()).not.toContain('finder-path-button-primary');
    expect(wrapper.text().match(/Schrauben Finder/g)).toHaveLength(1);
  });

  it('should enter the beginner flow and reset all answers when returning to the introduction', async () => {
    const wrapper = mount(ScrewFinder, { props });

    await wrapper.get('[data-testid="screw-finder-beginner"]').trigger('click');
    await waitForTransition();
    expect(wrapper.find('[data-testid="screw-finder-back"]').exists()).toBe(true);

    await wrapper
      .findAll('button')
      .find((button) => button.text().includes('Furniture & interior'))
      ?.trigger('click');
    await waitForTransition();
    expect(wrapper.find('[data-testid="screw-finder-answer-summary"]').exists()).toBe(true);

    await wrapper.get('[data-testid="screw-finder-back"]').trigger('click');
    await waitForTransition();
    await wrapper.get('[data-testid="screw-finder-back"]').trigger('click');
    await waitForTransition();

    expect(wrapper.find('[data-testid="screw-finder-beginner"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="screw-finder-answer-summary"]').exists()).toBe(false);
  });

  it('should skip the beginner environment question when it is disabled in persisted content', async () => {
    const wrapper = mount(ScrewFinder, {
      props: {
        ...props,
        content: {
          ...props.content,
          stages: {
            beginnerEnvironment: false,
            beginnerHead: false,
            beginnerDemand: false,
            beginnerExactSize: false,
          },
        },
      },
    });
    await flushPromises();

    await wrapper.get('[data-testid="screw-finder-beginner"]').trigger('click');
    await waitForTransition();
    await wrapper
      .findAll('button')
      .find((button) => button.text().includes('Furniture & interior'))
      ?.trigger('click');
    await waitForTransition();
    await flushPromises();

    expect(wrapper.text()).not.toContain('What are you fastening?');
    expect(wrapper.text()).not.toContain('Where will the screw be used?');
  });

  it('should keep navigation state independent between block instances', async () => {
    const first = mount(ScrewFinder, { props: { ...props, meta: { uuid: 'finder-a' } } });
    const second = mount(ScrewFinder, { props: { ...props, meta: { uuid: 'finder-b' } } });

    await first.get('[data-testid="screw-finder-beginner"]').trigger('click');
    expect(first.find('[data-testid="screw-finder-back"]').exists()).toBe(true);
    expect(second.find('[data-testid="screw-finder-back"]').exists()).toBe(false);
  });

  it('should use a balanced three-column desktop width for six application options', async () => {
    const wrapper = mount(ScrewFinder, { props });

    await wrapper.get('[data-testid="screw-finder-beginner"]').trigger('click');
    await waitForTransition();

    expect(wrapper.get('[data-testid="screw-finder-application-options"]').classes()).toContain('@md:max-w-[804px]');
  });

  it('should acknowledge a beginner answer before advancing and allow direct summary editing', async () => {
    const wrapper = mount(ScrewFinder, { props });
    await wrapper.get('[data-testid="screw-finder-beginner"]').trigger('click');
    await waitForTransition();

    const application = wrapper.findAll('button').find((button) => button.text().includes('Furniture & interior'));
    expect(application).toBeDefined();
    await application!.trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('What are you fastening?');
    expect(wrapper.get('[data-testid="screw-finder-answer-summary"]').text()).toContain('Furniture & interior');

    await waitForTransition();
    expect(wrapper.text()).toContain('Where will the screw be used?');

    await wrapper
      .get('[data-testid="screw-finder-answer-summary"]')
      .findAll('button')
      .find((button) => button.text().includes('Furniture & interior'))
      ?.trigger('click');
    await waitForTransition();

    expect(wrapper.text()).toContain('What are you fastening?');
    expect(
      wrapper
        .findAll('button')
        .find(
          (button) => button.text().includes('Furniture & interior') && button.attributes('aria-pressed') !== undefined,
        )
        ?.attributes('aria-pressed'),
    ).toBe('true');
  });

  it('should narrow professional facets and automatically skip a single available option', async () => {
    getFacet.mockImplementation(({ facets }: { facets?: string }) => {
      if (facets === '10') return Promise.resolve(facetResponse([materialFacet, headFacet, diameterFacet], 1));
      if (facets === '10,20') return Promise.resolve(facetResponse([materialFacet, headFacet, diameterFacet], 1));
      return Promise.resolve(facetResponse([materialFacet, headFacet, diameterFacet]));
    });
    const wrapper = mount(ScrewFinder, { props });
    await flushPromises();

    await wrapper.get('[data-testid="screw-finder-professional"]').trigger('click');
    await waitForTransition();
    const c2 = wrapper
      .get('[data-testid="screw-finder-professional-options"]')
      .findAll('button')
      .find((button) => button.text().includes('Edelstahl C2'));
    await c2?.trigger('click');
    await waitForTransition();

    expect(getFacet).toHaveBeenCalledWith(expect.objectContaining({ facets: '10' }));
    expect(getFacet).toHaveBeenCalledWith(expect.objectContaining({ facets: '10,20' }));
    expect(wrapper.text()).toContain('Choose diameter');
    expect(wrapper.text()).toContain('4 mm');
    expect(wrapper.get('[data-testid="screw-finder-answer-summary"]').text()).toContain('Edelstahl C2');
    expect(wrapper.get('[data-testid="screw-finder-answer-summary"]').text()).not.toContain('Senkkopf');
    expect(
      wrapper
        .get('[data-testid="screw-finder-professional-options"]')
        .findAll('button')
        .some((button) => button.text().includes('◇5 mm')),
    ).toBe(false);
  });

  it('should keep the current filtered options stable while preparing the next professional stage', async () => {
    const broadDiameterFacet = {
      ...diameterFacet,
      values: [...diameterFacet.values, { id: 33, name: '6 mm', count: 4 }],
    };
    getFacet.mockImplementation(({ facets }: { facets?: string }) => {
      if (facets === '10') return Promise.resolve(facetResponse([materialFacet, headFacet, diameterFacet], 1));
      if (facets === '10,20') return Promise.resolve(facetResponse([materialFacet, headFacet, diameterFacet], 1));
      if (facets === '10,20,30') {
        return delayedFacetResponse([materialFacet, headFacet, diameterFacet, lengthFacet], 1);
      }
      return Promise.resolve(facetResponse([materialFacet, headFacet, broadDiameterFacet]));
    });
    const wrapper = mount(ScrewFinder, { props });
    await flushPromises();

    await wrapper.get('[data-testid="screw-finder-professional"]').trigger('click');
    await waitForTransition();
    await wrapper
      .get('[data-testid="screw-finder-professional-options"]')
      .findAll('button')
      .find((button) => button.text().includes('Edelstahl C2'))
      ?.trigger('click');
    await waitForTransition();
    expect(wrapper.text()).toContain('Choose diameter');

    await wrapper
      .get('[data-testid="screw-finder-professional-options"]')
      .findAll('button')
      .find((button) => button.text().includes('◇4 mm'))
      ?.trigger('click');
    await flushPromises();

    const visibleOptions = wrapper
      .get('[data-testid="screw-finder-professional-options"]')
      .findAll('button')
      .map((button) => button.text());
    expect(visibleOptions.some((option) => option.includes('4 mm'))).toBe(true);
    expect(visibleOptions.some((option) => option.includes('6 mm'))).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 350));
    const optionsAfterResponse = wrapper
      .get('[data-testid="screw-finder-professional-options"]')
      .findAll('button')
      .map((button) => button.text());
    expect(optionsAfterResponse).toEqual(visibleOptions);

    await waitForTransition();
    expect(wrapper.text()).toContain('Choose total length');
  });

  it('should restore the prior dependent facet state when navigating back', async () => {
    getFacet.mockImplementation(({ facets }: { facets?: string }) => {
      if (facets === '10,20,30') {
        return Promise.resolve(facetResponse([materialFacet, headFacet, diameterFacet, lengthFacet], 1));
      }
      return Promise.resolve(facetResponse([materialFacet, headFacet, diameterFacet], 1));
    });
    const wrapper = mount(ScrewFinder, { props });
    await flushPromises();

    await wrapper.get('[data-testid="screw-finder-professional"]').trigger('click');
    await waitForTransition();
    await wrapper
      .get('[data-testid="screw-finder-professional-options"]')
      .findAll('button')
      .find((button) => button.text().includes('Edelstahl C2'))
      ?.trigger('click');
    await waitForTransition();
    await wrapper
      .get('[data-testid="screw-finder-professional-options"]')
      .findAll('button')
      .find((button) => button.text().includes('◇4 mm'))
      ?.trigger('click');
    await waitForTransition();

    expect(wrapper.text()).toContain('Choose total length');
    await wrapper.get('[data-testid="screw-finder-back"]').trigger('click');
    await waitForTransition();

    expect(wrapper.text()).toContain('Choose diameter');
    expect(getFacet).toHaveBeenLastCalledWith(expect.objectContaining({ facets: '10,20' }));
  });

  it('should include manual and automatically selected filters in the localized final category link', async () => {
    const singleDiameterFacet = {
      ...diameterFacet,
      values: [{ id: 30, name: '4 mm', count: 1 }],
    };
    getFacet.mockImplementation(({ facets, itemsPerPage }: { facets?: string; itemsPerPage?: number }) => {
      if (itemsPerPage === 50) return Promise.resolve(facetResponse([], 0));
      return Promise.resolve(facetResponse([materialFacet, headFacet, singleDiameterFacet], facets ? 1 : 5));
    });
    localePath.mockImplementation((path: string) => `/de${path}`);
    const wrapper = mount(ScrewFinder, { props });
    await flushPromises();

    await wrapper.get('[data-testid="screw-finder-professional"]').trigger('click');
    await waitForTransition();
    await wrapper
      .get('[data-testid="screw-finder-professional-options"]')
      .findAll('button')
      .find((button) => button.text().includes('Edelstahl C2'))
      ?.trigger('click');
    await waitForTransition();

    expect(wrapper.get('[data-testid="screw-finder-all-matches"]').attributes('to')).toBe(
      '/de/schrauben?facets=10%2C20%2C30',
    );
    expect(localePath).toHaveBeenCalledWith('/schrauben');
    expect(wrapper.get('[data-testid="screw-finder-answer-summary"]').text()).toContain('Edelstahl C2');
    expect(wrapper.get('[data-testid="screw-finder-answer-summary"]').text()).not.toContain('Senkkopf');
    expect(wrapper.get('[data-testid="screw-finder-answer-summary"]').text()).not.toContain('4 mm');
  });

  it('should ignore an in-flight result response after restarting', async () => {
    getFacet.mockImplementation(({ itemsPerPage }: { itemsPerPage?: number }) => {
      if (itemsPerPage === 50) {
        return delayedFacetResponse([], 0, 150);
      }
      return Promise.resolve(facetResponse([materialFacet, headFacet, diameterFacet], 5));
    });
    const wrapper = mount(ScrewFinder, { props });
    await flushPromises();

    await wrapper.get('[data-testid="screw-finder-professional"]').trigger('click');
    await waitForTransition();
    await wrapper
      .get('[data-testid="screw-finder-professional-options"]')
      .findAll('button')
      .find((button) => button.text().includes('Edelstahl C2'))
      ?.trigger('click');
    await waitForTransition();
    await wrapper
      .get('[data-testid="screw-finder-professional-options"]')
      .findAll('button')
      .find((button) => button.text().includes('◇4 mm'))
      ?.trigger('click');
    await flushPromises();

    expect(getFacet).toHaveBeenCalledWith(expect.objectContaining({ itemsPerPage: 50 }));
    await wrapper.get('[data-testid="screw-finder-restart"]').trigger('click');
    await new Promise((resolve) => setTimeout(resolve, 800));
    await flushPromises();

    expect(wrapper.find('[data-testid="screw-finder-beginner"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="screw-finder-results"]').exists()).toBe(false);
  });

  it('should cancel an in-flight result transition when navigating back', async () => {
    getFacet.mockImplementation(({ itemsPerPage }: { itemsPerPage?: number }) => {
      if (itemsPerPage === 50) {
        return delayedFacetResponse([], 0, 150);
      }
      return Promise.resolve(facetResponse([materialFacet, headFacet, diameterFacet], 5));
    });
    const wrapper = mount(ScrewFinder, { props });
    await flushPromises();

    await wrapper.get('[data-testid="screw-finder-professional"]').trigger('click');
    await waitForTransition();
    await wrapper
      .get('[data-testid="screw-finder-professional-options"]')
      .findAll('button')
      .find((button) => button.text().includes('Edelstahl C2'))
      ?.trigger('click');
    await waitForTransition();
    await wrapper
      .get('[data-testid="screw-finder-professional-options"]')
      .findAll('button')
      .find((button) => button.text().includes('◇4 mm'))
      ?.trigger('click');
    await flushPromises();

    expect(getFacet).toHaveBeenCalledWith(expect.objectContaining({ itemsPerPage: 50 }));
    await wrapper.get('[data-testid="screw-finder-back"]').trigger('click');
    await new Promise((resolve) => setTimeout(resolve, 800));
    await flushPromises();

    expect(wrapper.text()).toContain('Choose material');
    expect(wrapper.find('[data-testid="screw-finder-results"]').exists()).toBe(false);
  });

  it('should query A2 and A4 as separate product branches for outdoor use', async () => {
    getFacet.mockResolvedValue(facetResponse([materialFacet], 0));
    const wrapper = mount(ScrewFinder, {
      props: {
        ...props,
        content: {
          ...props.content,
          stages: {
            beginnerHead: false,
            beginnerDemand: false,
            beginnerExactSize: false,
          },
        },
      },
    });
    await flushPromises();

    await wrapper.get('[data-testid="screw-finder-beginner"]').trigger('click');
    await waitForTransition();
    await wrapper
      .findAll('button')
      .find((button) => button.text().includes('Decking & outdoors'))
      ?.trigger('click');
    await waitForTransition();
    await wrapper
      .findAll('button')
      .find((button) => button.text().includes('Weather exposed'))
      ?.trigger('click');
    await waitForTransition();

    const productFacets = getFacet.mock.calls
      .map(([request]) => request as { facets?: string; itemsPerPage?: number })
      .filter((request) => request.itemsPerPage === 50)
      .map((request) => request.facets);
    expect(productFacets).toEqual(expect.arrayContaining(['11', '12']));
    expect(productFacets).not.toContain('11,12');
    expect(wrapper.get('[data-testid="screw-finder-all-matches"]').attributes('to')).toBe('/schrauben?facets=11%2C12');
  });

  it('should not request products when a corrosive selection cannot enforce A4', async () => {
    getFacet.mockResolvedValue(facetResponse([headFacet], 5));
    const wrapper = mount(ScrewFinder, {
      props: {
        ...props,
        content: {
          ...props.content,
          stages: {
            beginnerHead: false,
            beginnerDemand: false,
            beginnerExactSize: false,
          },
        },
      },
    });
    await flushPromises();

    await wrapper.get('[data-testid="screw-finder-beginner"]').trigger('click');
    await waitForTransition();
    await wrapper
      .findAll('button')
      .find((button) => button.text().includes('Decking & outdoors'))
      ?.trigger('click');
    await waitForTransition();
    await wrapper
      .findAll('button')
      .find((button) => button.text().includes('Highly corrosive'))
      ?.trigger('click');
    await waitForTransition();

    expect(wrapper.text()).toContain('No product recommendations are shown for safety reasons.');
    expect(getFacet).not.toHaveBeenCalledWith(expect.objectContaining({ itemsPerPage: 50 }));
    expect(wrapper.find('[data-testid="screw-finder-all-matches"]').exists()).toBe(false);
  });
});
