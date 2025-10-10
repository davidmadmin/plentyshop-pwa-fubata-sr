import type { ShippingCountdownTimerWorkdays } from './types';

export const DEFAULT_CUTOFF_TIME = '13:00';
export const DEFAULT_TIMEZONE = 'Europe/Berlin';
export const DEFAULT_ICON_URL =
  'https://cdn02.plentymarkets.com/nteqnk1xxnkn/frontend/shipping_9288277.svg';

export const DEFAULT_WORKDAYS: ShippingCountdownTimerWorkdays = {
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false,
};
