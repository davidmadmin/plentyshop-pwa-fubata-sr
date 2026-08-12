const OPERATIONAL_ROUTE_PREFIXES = [
  '/cart',
  '/checkout',
  '/readonly-checkout',
  '/confirmation',
  '/offer',
  '/guest',
  '/login',
  '/register',
  '/my-account',
  '/password-reset',
  '/reset-password',
  '/reset-password-success',
  '/set-new-password',
  '/cancellation-form',
  '/newsletter/unsubscribe',
];

const LOCALE_ROUTE_PREFIX = /^\/[a-z]{2}(?:-[a-z]{2})?(?=\/|$)/i;

/**
 * Keeps the visual theme on merchandising and content routes while purchase,
 * account and authentication surfaces retain the upstream accessible styling.
 */
export const isScrewrebelThemeRoute = (path: string): boolean => {
  const normalizedPath =
    `/${path.split('?')[0]?.replace(/^\/+|\/+$/g, '') ?? ''}`.replace(LOCALE_ROUTE_PREFIX, '') || '/';
  return !OPERATIONAL_ROUTE_PREFIXES.some(
    (prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`),
  );
};
