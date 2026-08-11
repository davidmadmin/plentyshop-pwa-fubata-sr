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

/**
 * Keeps the visual theme on merchandising and content routes while purchase,
 * account and authentication surfaces retain the upstream accessible styling.
 */
export const isScrewrebelThemeRoute = (path: string): boolean => {
  const normalizedPath = `/${path.split('?')[0]?.replace(/^\/+|\/+$/g, '') ?? ''}`;
  return !OPERATIONAL_ROUTE_PREFIXES.some(
    (prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`),
  );
};
