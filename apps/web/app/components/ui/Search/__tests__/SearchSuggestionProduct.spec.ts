import { mount } from '@vue/test-utils';
import type { ItemSearchAutocompleteItem, ItemSearchAutocompletePrice } from '@plentymarkets/shop-api';
import { UiSearchSuggestionProduct } from '#components';

const makePrice = (value: number): ItemSearchAutocompletePrice => ({
  price: { value, formatted: `${value}` },
  unitPrice: { value, formatted: `${value}` },
  basePrice: '',
  baseLot: null,
  baseUnit: null,
  baseSinglePrice: null,
  minimumOrderQuantity: 1,
  contactClassDiscount: { percent: 0, amount: 0 },
  categoryDiscount: { percent: 0, amount: 0 },
  currency: 'EUR',
  lowestPrice: { value, formatted: `${value}` },
  vat: { id: 0, value: 0 },
  isNet: false,
});

describe('<SearchSuggestionProduct />', () => {
  it('should use the secondary color for the product price', () => {
    const wrapper = mount(UiSearchSuggestionProduct, {
      props: {
        item: {
          image: '',
          imageAlt: '',
          label: 'Test product',
          price: makePrice(10),
          crossedPrice: null,
          beforeLabel: '',
          afterLabel: '',
          count: 0,
          url: '/test-product',
        } satisfies ItemSearchAutocompleteItem,
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
