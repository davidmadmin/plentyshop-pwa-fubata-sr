import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { ProductMock } from '../../../../__tests__/__mocks__/product.mock';
import { useLastSeen } from '../useLastSeen';

const { doAddLastSeen, getBooleanSetting } = vi.hoisted(() => ({
  doAddLastSeen: vi.fn(),
  getBooleanSetting: vi.fn(),
}));

mockNuxtImport('useSdk', () => () => ({
  plentysystems: { doAddLastSeen },
}));

mockNuxtImport('useSiteSettings', () => () => ({ getBooleanSetting }));

describe('useLastSeen', () => {
  beforeEach(() => {
    doAddLastSeen.mockReset();
    getBooleanSetting.mockReset();
    getBooleanSetting.mockReturnValue(true);
  });

  it('should silently handle asynchronous tracking failures', async () => {
    doAddLastSeen.mockRejectedValue(new Error('offline'));

    const { addLastSeen } = useLastSeen();
    addLastSeen(ProductMock);
    await Promise.resolve();

    expect(doAddLastSeen).toHaveBeenCalledOnce();
  });
});
