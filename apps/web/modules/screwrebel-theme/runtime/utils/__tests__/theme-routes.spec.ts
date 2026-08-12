import { isScrewrebelThemeRoute } from '../theme-routes';

describe('isScrewrebelThemeRoute', () => {
  it.each(['/', '/schrauben', '/product/example', '/search', '/wishlist', '/privacy-policy'])(
    'should enable the theme for merchandising route %s',
    (path) => {
      expect(isScrewrebelThemeRoute(path)).toBe(true);
    },
  );

  it.each([
    '/cart',
    '/de/cart',
    '/checkout',
    '/en/checkout',
    '/readonly-checkout',
    '/guest/login',
    '/de-DE/guest/login',
    '/login',
    '/register',
    '/my-account',
    '/my-account/my-orders',
    '/password-reset/1/hash',
    '/confirmation/1/access-key',
  ])('should keep the upstream theme for operational route %s', (path) => {
    expect(isScrewrebelThemeRoute(path)).toBe(false);
  });

  it.each(['/de/schrauben', '/en/product/example'])('should theme localized merchandising route %s', (path) => {
    expect(isScrewrebelThemeRoute(path)).toBe(true);
  });
});
