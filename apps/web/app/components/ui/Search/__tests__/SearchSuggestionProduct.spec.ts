import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { ItemSearchAutocompleteItem } from '@plentymarkets/shop-api';
import { UiSearchSuggestionProduct } from '#components';

mockNuxtImport('usePriceFormatter', () => () => ({
  format: (value: number) => `${value.toFixed(2)} €`,
}));

describe('<SearchSuggestionProduct />', () => {
  it('should use the secondary color for the product price', () => {
    const wrapper = mount(UiSearchSuggestionProduct, {
      props: {
        item: {
          image: '',
          imageAlt: '',
          label: 'Test product',
          price: {
            price: { value: 10, formatted: '10.00 €' },
          },
          crossedPrice: null,
          beforeLabel: '',
          afterLabel: '',
          count: 1,
          url: '/test-product',
        } as ItemSearchAutocompleteItem,
      },
      global: {
        stubs: {
          NuxtImg: true,
          NuxtLink: {
            template: '<a><slot /></a>',
          },
        },
      },
    });

    expect(wrapper.get('[data-testid="search-suggestion-product-price"]').classes()).toContain('text-secondary-600');
  });
});
