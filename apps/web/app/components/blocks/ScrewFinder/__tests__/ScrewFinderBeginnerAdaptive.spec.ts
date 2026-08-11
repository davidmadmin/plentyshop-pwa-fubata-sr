import { flushPromises, mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ScrewFinder from '../ScrewFinder.vue';

const { getFacet } = vi.hoisted(() => ({ getFacet: vi.fn() }));

mockNuxtImport('useSdk', () => () => ({
  plentysystems: { getFacet },
}));
mockNuxtImport('usePriceFormatter', () => () => ({ format: (value: number) => `${value.toFixed(2)} €` }));
mockNuxtImport('useLocalePath', () => () => (path: string) => path);

const props = {
  name: 'ScrewFinder',
  type: 'content',
  meta: { uuid: 'adaptive-finder-test' },
  content: { sourceCategoryPath: '/schrauben', resultCount: 3 },
};
const facetResponse = (facets: unknown[], totals = 5) => ({
  data: { facets, products: [], pagination: { totals } },
});
const delayedFacetResponse = (facets: unknown[], totals = 5, delay = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(facetResponse(facets, totals)), delay));
const materialFacet = {
  id: 1,
  name: 'Werkstoff',
  type: 'dynamic',
  count: 3,
  values: [
    { id: 10, name: 'Edelstahl C2', count: 1 },
    { id: 11, name: 'Edelstahl A2', count: 4 },
    { id: 12, name: 'Edelstahl A4', count: 2 },
  ],
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
const choose = async (wrapper: ReturnType<typeof mount>, label: string) => {
  await wrapper
    .findAll('button')
    .find((button) => button.text().includes(label))
    ?.trigger('click');
  await waitForTransition();
};
const openDrywallSize = async (wrapper: ReturnType<typeof mount>) => {
  await wrapper.get('[data-testid="screw-finder-beginner"]').trigger('click');
  await waitForTransition();
  await choose(wrapper, 'Drywall');
  await choose(wrapper, 'Dry indoor');
};

describe('ScrewFinder adaptive beginner flow', () => {
  beforeEach(() => {
    getFacet.mockReset();
    getFacet.mockResolvedValue(facetResponse([materialFacet, diameterFacet, lengthFacet]));
  });

  it('should skip head and demand questions for drywall and keep Back navigation relevant', async () => {
    const wrapper = mount(ScrewFinder, { props });
    await flushPromises();
    await openDrywallSize(wrapper);

    expect(wrapper.text()).toContain('Do you know the dimensions?');
    expect(wrapper.text()).not.toContain('How should the screw head look?');
    expect(wrapper.get('[data-testid="screw-finder-answer-summary"]').text()).not.toContain('Head effect');
    expect(wrapper.get('[data-testid="screw-finder-answer-summary"]').text()).not.toContain('Load');

    await wrapper.get('[data-testid="screw-finder-back"]').trigger('click');
    await waitForTransition();
    expect(wrapper.text()).toContain('Where will the screw be used?');
  });

  it('should skip only the head question for roofing', async () => {
    const wrapper = mount(ScrewFinder, { props });
    await flushPromises();
    await wrapper.get('[data-testid="screw-finder-beginner"]').trigger('click');
    await waitForTransition();
    await choose(wrapper, 'Roofing & sheet metal');
    await choose(wrapper, 'Dry indoor');

    expect(wrapper.text()).toContain('How heavily loaded is the connection?');
    expect(wrapper.text()).not.toContain('How should the screw head look?');
  });

  it('should clear only beginner answers that become invalid after changing the application', async () => {
    const wrapper = mount(ScrewFinder, { props });
    await flushPromises();
    await wrapper.get('[data-testid="screw-finder-beginner"]').trigger('click');
    await waitForTransition();
    await choose(wrapper, 'Furniture & interior');
    await choose(wrapper, 'Dry indoor');
    await choose(wrapper, 'Low profile');
    await choose(wrapper, 'Light');

    await wrapper
      .get('[data-testid="screw-finder-answer-summary"]')
      .findAll('button')
      .find((button) => button.text().includes('Furniture & interior'))
      ?.trigger('click');
    await waitForTransition();
    await choose(wrapper, 'Structural timber');

    const summary = wrapper.get('[data-testid="screw-finder-answer-summary"]').text();
    expect(summary).toContain('Structural timber');
    expect(summary).toContain('Dry indoors');
    expect(summary).not.toContain('Low profile');
    expect(summary).not.toContain('Light');
  });

  it('should merge outdoor A2 and A4 dimension facets and remove zero-result values', async () => {
    const a2Diameter = {
      ...diameterFacet,
      values: [
        { id: 30, name: '4 mm', count: 2 },
        { id: 31, name: '5 mm', count: 0 },
      ],
    };
    const a4Diameter = {
      ...diameterFacet,
      values: [
        { id: 30, name: '4 mm', count: 1 },
        { id: 33, name: '6 mm', count: 1 },
      ],
    };
    getFacet.mockImplementation(({ facets }: { facets?: string }) => {
      if (facets === '11') return Promise.resolve(facetResponse([materialFacet, a2Diameter, lengthFacet], 4));
      if (facets === '12') return Promise.resolve(facetResponse([materialFacet, a4Diameter, lengthFacet], 2));
      return Promise.resolve(facetResponse([materialFacet, diameterFacet, lengthFacet]));
    });
    const wrapper = mount(ScrewFinder, { props });
    await flushPromises();
    await wrapper.get('[data-testid="screw-finder-beginner"]').trigger('click');
    await waitForTransition();
    await choose(wrapper, 'Decking & outdoors');
    await choose(wrapper, 'Weather exposed');

    expect(getFacet).toHaveBeenCalledWith(expect.objectContaining({ facets: '11' }));
    expect(getFacet).toHaveBeenCalledWith(expect.objectContaining({ facets: '12' }));

    await choose(wrapper, 'No preference');
    await choose(wrapper, 'General');

    const diameterOptions = wrapper
      .findAll('select')[0]!
      .findAll('option')
      .map((option) => option.text());
    expect(diameterOptions.some((option) => option.includes('4 mm (3)'))).toBe(true);
    expect(diameterOptions.some((option) => option.includes('6 mm (1)'))).toBe(true);
    expect(diameterOptions.some((option) => option.includes('5 mm'))).toBe(false);
  });

  it('should narrow lengths after an explicit diameter without inferring a size', async () => {
    const narrowedLengthFacet = { ...lengthFacet, values: [{ id: 41, name: '50 mm', count: 1 }] };
    getFacet.mockImplementation(({ facets }: { facets?: string }) =>
      Promise.resolve(
        facets === '30'
          ? facetResponse([materialFacet, diameterFacet, narrowedLengthFacet], 1)
          : facetResponse([materialFacet, diameterFacet, lengthFacet]),
      ),
    );
    const wrapper = mount(ScrewFinder, { props });
    await flushPromises();
    await openDrywallSize(wrapper);

    expect(wrapper.get('[data-testid="screw-finder-answer-summary"]').text()).not.toContain('Diameter');
    await wrapper.findAll('select')[0]!.setValue('30');
    await flushPromises();

    const lengthOptions = wrapper
      .findAll('select')[1]!
      .findAll('option')
      .map((option) => option.text());
    expect(getFacet).toHaveBeenCalledWith(expect.objectContaining({ facets: '30' }));
    expect(lengthOptions.some((option) => option.includes('50 mm'))).toBe(true);
    expect(lengthOptions.some((option) => option.includes('40 mm'))).toBe(false);
    expect(wrapper.get('[data-testid="screw-finder-answer-summary"]').text()).toContain('4 mm');
    expect(wrapper.get('[data-testid="screw-finder-answer-summary"]').text()).not.toContain('50 mm');
  });

  it('should ignore a stale beginner length response after the diameter changes again', async () => {
    const fourMillimeterLengths = { ...lengthFacet, values: [{ id: 40, name: '40 mm', count: 1 }] };
    const fourPointFiveMillimeterLengths = { ...lengthFacet, values: [{ id: 41, name: '50 mm', count: 1 }] };
    getFacet.mockImplementation(({ facets }: { facets?: string }) => {
      if (facets === '30') {
        return delayedFacetResponse([materialFacet, diameterFacet, fourMillimeterLengths], 1, 300);
      }
      if (facets === '32') {
        return Promise.resolve(facetResponse([materialFacet, diameterFacet, fourPointFiveMillimeterLengths], 1));
      }
      return Promise.resolve(facetResponse([materialFacet, diameterFacet, lengthFacet]));
    });
    const wrapper = mount(ScrewFinder, { props });
    await flushPromises();
    await openDrywallSize(wrapper);

    await wrapper.findAll('select')[0]!.setValue('30');
    const updatedDiameterSelect = wrapper.findAll('select')[0]!;
    (updatedDiameterSelect.element as HTMLSelectElement).disabled = false;
    await updatedDiameterSelect.setValue('32');
    await new Promise((resolve) => setTimeout(resolve, 350));
    await flushPromises();

    const lengthOptions = wrapper
      .findAll('select')[1]!
      .findAll('option')
      .map((option) => option.text());
    expect(lengthOptions.some((option) => option.includes('50 mm'))).toBe(true);
    expect(lengthOptions.some((option) => option.includes('40 mm'))).toBe(false);
  });
});
