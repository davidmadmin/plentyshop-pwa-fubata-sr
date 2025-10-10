<template>
  <div
    v-if="hasWorkdays"
    data-testid="shipping-countdown-timer"
    class="flex items-start gap-3 text-neutral-600"
  >
    <div v-if="iconToUse" class="flex h-10 w-10 shrink-0 items-center justify-center">
      <img :src="iconToUse" alt="" class="h-full w-auto object-contain" loading="lazy" />
    </div>

    <div class="flex flex-col leading-snug">
      <p v-if="countdown.ready" class="font-medium">
        <span v-html="messageHtml" />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  ShippingCountdownTimerProps,
  ShippingCountdownTimerWorkdays,
} from './types';
import {
  DEFAULT_CUTOFF_TIME,
  DEFAULT_ICON_URL,
  DEFAULT_TIMEZONE,
  DEFAULT_WORKDAYS,
  TIMEZONE_OPTIONS,
} from './defaults';

const props = defineProps<ShippingCountdownTimerProps>();

const { t } = useI18n();

const DAY_TO_INDEX: Record<keyof ShippingCountdownTimerWorkdays, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const countdown = reactive({
  timeText: '',
  dateLabel: '',
  highlightColor: '#13a10e',
  ready: false,
});

const VALID_TIMEZONES = new Set(TIMEZONE_OPTIONS.map((option) => option.value));

const isValidTimezone = (zone: string) => {
  if (!zone) return false;
  if (VALID_TIMEZONES.has(zone)) return true;

  try {
    new Intl.DateTimeFormat('en-US', { timeZone: zone });
    return true;
  } catch {
    return false;
  }
};

const timezone = computed(() => {
  const configuredTimezone = props.content.timezone || DEFAULT_TIMEZONE;

  if (!isValidTimezone(configuredTimezone)) {
    return DEFAULT_TIMEZONE;
  }

  return configuredTimezone;
});

const resolvedWorkdays = computed<ShippingCountdownTimerWorkdays>(() => {
  const workdayOverrides = Object.fromEntries(
    Object.entries(props.content.workdays ?? {}).filter(([, value]) => value !== undefined),
  ) as Partial<ShippingCountdownTimerWorkdays>;

  return {
    ...DEFAULT_WORKDAYS,
    ...workdayOverrides,
  };
});

const activeWorkdayIndices = computed<number[]>(() =>
  (Object.entries(resolvedWorkdays.value) as [keyof ShippingCountdownTimerWorkdays, boolean][])
    .filter(([, enabled]) => enabled)
    .map(([day]) => DAY_TO_INDEX[day]),
);

const hasWorkdays = computed(() => activeWorkdayIndices.value.length > 0);

const iconToUse = computed(() => props.content.iconUrl || DEFAULT_ICON_URL);

const leadingText = computed(() => t('shippingCountdownTimer.leadingText'));
const midText = computed(() => t('shippingCountdownTimer.midText'));
const closingText = computed(() => t('shippingCountdownTimer.closingText'));
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
const messageHtml = computed(() => {
  const timeHtml = `<span class="font-semibold" style="color:${countdown.highlightColor}">${escapeHtml(countdown.timeText)}</span>`;
  const dateHtml = `<span class="font-semibold text-neutral-800">${escapeHtml(countdown.dateLabel)}</span>`;

  return `${escapeHtml(leadingText.value)}${timeHtml}${escapeHtml(midText.value)}${dateHtml}${escapeHtml(closingText.value)}`;
});

const cutoffTime = computed<{ hours: number; minutes: number }>(() =>
  parseCutoff(props.content.cutoffTime),
);

const holidayCache = new Map<number, Set<string>>();

const pad2 = (value: number) => value.toString().padStart(2, '0');

const formatDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const calculateEasterSunday = (year: number) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

const getHolidaySet = (year: number) => {
  if (holidayCache.has(year)) {
    return holidayCache.get(year)!;
  }

  const holidays = new Set<string>();

  const register = (date: Date) => {
    holidays.add(formatDateKey(date));
  };

  const FIXED_HOLIDAYS: Array<[number, number]> = [
    [0, 1],
    [4, 1],
    [9, 3],
    [11, 25],
    [11, 26],
  ];

  FIXED_HOLIDAYS.forEach(([month, day]) => register(new Date(year, month ?? 0, day ?? 1)));

  const easterSunday = calculateEasterSunday(year);

  const MOVABLE_HOLIDAY_OFFSETS = [-2, 1, 39, 50, 60] as const;

  MOVABLE_HOLIDAY_OFFSETS.forEach((offset) => register(addDays(easterSunday, offset)));

  register(new Date(year, 10, 1));

  holidayCache.set(year, holidays);

  return holidays;
};

const isHoliday = (date: Date) => getHolidaySet(date.getFullYear()).has(formatDateKey(date));

const isConfiguredWorkday = (date: Date, workdayIndices: number[]) => {
  if (!workdayIndices.length) return false;
  const day = date.getDay();
  if (!workdayIndices.includes(day)) return false;
  if (isHoliday(date)) return false;
  return true;
};

const getNextWorkday = (date: Date, workdayIndices: number[]) => {
  const candidate = new Date(date);

  do {
    candidate.setDate(candidate.getDate() + 1);
  } while (!isConfiguredWorkday(candidate, workdayIndices));

  return candidate;
};

const createDateTimeFormatter = (zone: string) => {
  try {
    return new Intl.DateTimeFormat('de-DE', {
      timeZone: zone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return new Intl.DateTimeFormat('de-DE', {
      timeZone: DEFAULT_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }
};

const getCurrentDate = (zone: string) => {
  const now = new Date();
  const formatter = createDateTimeFormatter(zone);

  const parts = formatter.formatToParts(now).reduce<Record<string, string>>((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  return new Date(
    `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`,
  );
};

const getTargetDates = (now: Date, workdayIndices: number[], cutoff: { hours: number; minutes: number }) => {
  const cutoffToday = new Date(now);
  cutoffToday.setHours(cutoff.hours, cutoff.minutes, 0, 0);

  if (isConfiguredWorkday(now, workdayIndices) && now.getTime() < cutoffToday.getTime()) {
    return { target: cutoffToday, shippingDate: now } as const;
  }

  const nextWorkday = getNextWorkday(now, workdayIndices);
  const nextCutoff = new Date(nextWorkday);
  nextCutoff.setHours(cutoff.hours, cutoff.minutes, 0, 0);

  return { target: nextCutoff, shippingDate: nextWorkday } as const;
};

const startOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const formatDateLabel = (shippingDate: Date, now: Date) => {
  const diffDays = Math.round((startOfDay(shippingDate).getTime() - startOfDay(now).getTime()) / MS_PER_DAY);
  const weekdayKey = Object.keys(DAY_TO_INDEX).find(
    (key) => DAY_TO_INDEX[key as keyof ShippingCountdownTimerWorkdays] === shippingDate.getDay(),
  ) as keyof ShippingCountdownTimerWorkdays;
  const weekday = t(`shippingCountdownTimer.weekdays.${weekdayKey}`);
  const dateString = `${pad2(shippingDate.getDate())}.${pad2(shippingDate.getMonth() + 1)}.`;

  if (diffDays === 0) {
    return t('shippingCountdownTimer.today');
  }
  if (diffDays === 1) {
    return t('shippingCountdownTimer.tomorrow', { weekday, date: dateString });
  }
  if (diffDays === 2) {
    return t('shippingCountdownTimer.dayAfterTomorrow', { weekday, date: dateString });
  }
  if (diffDays > 2 && shippingDate.getDay() === 1) {
    return t('shippingCountdownTimer.nextWeekday', { weekday, date: dateString });
  }

  return t('shippingCountdownTimer.weekdayOnDate', { weekday, date: dateString });
};

const formatTime = (ms: number, showSeconds: boolean) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  if (totalHours >= 24) {
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const parts = [t('shippingCountdownTimer.time.days', days)];

    if (hours > 0) {
      parts.push(t('shippingCountdownTimer.time.hours', hours));
    } else if (minutes > 0) {
      parts.push(t('shippingCountdownTimer.time.minutes', minutes));
    }

    return parts.join(' ');
  }

  const parts = [] as string[];

  if (totalHours > 0) {
    parts.push(t('shippingCountdownTimer.time.hours', totalHours));
  }

  parts.push(t('shippingCountdownTimer.time.minutes', minutes));

  if (showSeconds) {
    parts.push(t('shippingCountdownTimer.time.seconds', seconds));
  }

  return parts.join(' ');
};

const getHighlightColor = (hoursLeft: number) => {
  if (hoursLeft < 1) return '#dc2626';
  if (hoursLeft < 3) return '#eab308';
  return '#13a10e';
};

const updateCountdown = () => {
  if (!hasWorkdays.value) {
    countdown.ready = false;
    return;
  }

  const now = getCurrentDate(timezone.value);
  const { target, shippingDate } = getTargetDates(now, activeWorkdayIndices.value, cutoffTime.value);
  const diffMs = Math.max(target.getTime() - now.getTime(), 0);
  const hoursLeft = diffMs / (60 * 60 * 1000);
  const showSeconds = hoursLeft < 1;

  countdown.timeText = formatTime(diffMs, showSeconds);
  countdown.highlightColor = getHighlightColor(hoursLeft);
  countdown.dateLabel = formatDateLabel(shippingDate, now);
  countdown.ready = true;
};

let interval: number | null = null;

watch(
  [cutoffTime, activeWorkdayIndices, timezone],
  () => {
    updateCountdown();
  },
  { immediate: true },
);

onMounted(() => {
  updateCountdown();
  if (import.meta.client) {
    interval = window.setInterval(updateCountdown, 1000);
  }
});

onBeforeUnmount(() => {
  if (interval !== null) {
    window.clearInterval(interval);
  }
});

function parseCutoff(time?: string): { hours: number; minutes: number } {
  const [fallbackHoursRaw, fallbackMinutesRaw] = DEFAULT_CUTOFF_TIME.split(':');
  const parsedFallbackHours = Number.parseInt(fallbackHoursRaw ?? '', 10);
  const parsedFallbackMinutes = Number.parseInt(fallbackMinutesRaw ?? '', 10);
  const fallback: { hours: number; minutes: number } = {
    hours: Number.isNaN(parsedFallbackHours) ? 16 : parsedFallbackHours,
    minutes: Number.isNaN(parsedFallbackMinutes) ? 0 : parsedFallbackMinutes,
  };
  if (!time) return fallback;

  const match = time.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (!match) return fallback;

  const [, hoursMatch, minutesMatch] = match;
  const hours = Number.parseInt(hoursMatch ?? '', 10);
  const minutes = Number.parseInt(minutesMatch ?? '', 10);

  return {
    hours: Number.isNaN(hours) ? fallback.hours : hours,
    minutes: Number.isNaN(minutes) ? fallback.minutes : minutes,
  };
}
</script>
