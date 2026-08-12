import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { CategoryDataProps } from '~/components/blocks/CategoryData/types';
import { CategoryMock } from '../../../../../../../__tests__/__mocks__/category.mock';
import type { CategoryDetails } from '@plentymarkets/shop-api';
import CategoryData from '../CategoryData.vue';

vi.mock('@plentymarkets/shop-api', () => ({
  categoryGetters: {
    getCategoryName: (category: CategoryDetails) => category?.name ?? 'Category name',
    getCategoryDescription1: (category: CategoryDetails) => category?.description ?? '',
    getCategoryDescription2: (category: CategoryDetails) => category?.description2 ?? '',
    getCategoryShortDescription: (category: CategoryDetails) => category?.shortDescription ?? '',
    getCategoryDetails: (category: CategoryDetails) => category,
  },
}));

mockNuxtImport('useProducts', () => () => ({
  data: computed(() => ({ category: CategoryMock.details })),
}));

describe('SCREWREBEL CategoryData compatibility override', () => {
  it('should render saved blocks with missing nested content fields', () => {
    const props = {
      name: 'CategoryData',
      type: 'content',
      content: {
        layout: {},
        image: {},
      },
      meta: {
        uuid: 'legacy-category-data',
      },
      index: 0,
    } as CategoryDataProps;

    const wrapper = mount(CategoryData, { props });

    expect(wrapper.find('[data-testid="category-data"]').exists()).toBe(true);
  });
});
