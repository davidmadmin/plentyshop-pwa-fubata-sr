import type { ShippingCountdownTimerWorkdays } from './types';

export const DEFAULT_CUTOFF_TIME = '13:00';
export const DEFAULT_TIMEZONE = 'Europe/Berlin';
export const DEFAULT_ICON_URL =
  'https://cdn02.plentymarkets.com/nteqnk1xxnkn/frontend/shipping_9288277.svg';

export const TIMEZONE_OPTIONS = [
  { label: 'UTC', value: 'UTC' },
  { label: 'Europe/Lisbon (UTC+00:00)', value: 'Europe/Lisbon' },
  { label: 'Europe/London (UTC+00:00)', value: 'Europe/London' },
  { label: 'Europe/Dublin (UTC+00:00)', value: 'Europe/Dublin' },
  { label: 'Europe/Amsterdam (UTC+01:00)', value: 'Europe/Amsterdam' },
  { label: 'Europe/Brussels (UTC+01:00)', value: 'Europe/Brussels' },
  { label: 'Europe/Berlin (UTC+01:00)', value: 'Europe/Berlin' },
  { label: 'Europe/Copenhagen (UTC+01:00)', value: 'Europe/Copenhagen' },
  { label: 'Europe/Madrid (UTC+01:00)', value: 'Europe/Madrid' },
  { label: 'Europe/Paris (UTC+01:00)', value: 'Europe/Paris' },
  { label: 'Europe/Rome (UTC+01:00)', value: 'Europe/Rome' },
  { label: 'Europe/Stockholm (UTC+01:00)', value: 'Europe/Stockholm' },
  { label: 'Europe/Vienna (UTC+01:00)', value: 'Europe/Vienna' },
  { label: 'Europe/Warsaw (UTC+01:00)', value: 'Europe/Warsaw' },
  { label: 'Europe/Zurich (UTC+01:00)', value: 'Europe/Zurich' },
  { label: 'Europe/Athens (UTC+02:00)', value: 'Europe/Athens' },
  { label: 'Europe/Bucharest (UTC+02:00)', value: 'Europe/Bucharest' },
  { label: 'Europe/Helsinki (UTC+02:00)', value: 'Europe/Helsinki' },
  { label: 'Europe/Riga (UTC+02:00)', value: 'Europe/Riga' },
  { label: 'Europe/Sofia (UTC+02:00)', value: 'Europe/Sofia' },
  { label: 'Europe/Tallinn (UTC+02:00)', value: 'Europe/Tallinn' },
  { label: 'Europe/Vilnius (UTC+02:00)', value: 'Europe/Vilnius' },
  { label: 'Europe/Istanbul (UTC+03:00)', value: 'Europe/Istanbul' },
  { label: 'Europe/Moscow (UTC+03:00)', value: 'Europe/Moscow' },
  { label: 'America/New_York (UTC-05:00)', value: 'America/New_York' },
  { label: 'America/Chicago (UTC-06:00)', value: 'America/Chicago' },
  { label: 'America/Denver (UTC-07:00)', value: 'America/Denver' },
  { label: 'America/Los_Angeles (UTC-08:00)', value: 'America/Los_Angeles' },
  { label: 'America/Anchorage (UTC-09:00)', value: 'America/Anchorage' },
  { label: 'America/Honolulu (UTC-10:00)', value: 'America/Honolulu' },
  { label: 'Asia/Dubai (UTC+04:00)', value: 'Asia/Dubai' },
  { label: 'Asia/Kolkata (UTC+05:30)', value: 'Asia/Kolkata' },
  { label: 'Asia/Singapore (UTC+08:00)', value: 'Asia/Singapore' },
  { label: 'Asia/Tokyo (UTC+09:00)', value: 'Asia/Tokyo' },
  { label: 'Australia/Sydney (UTC+10:00)', value: 'Australia/Sydney' },
];

export const DEFAULT_WORKDAYS: ShippingCountdownTimerWorkdays = {
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false,
};
