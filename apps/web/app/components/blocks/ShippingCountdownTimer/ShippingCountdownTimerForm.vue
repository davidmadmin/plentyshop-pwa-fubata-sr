<template>
  <UiAccordionItem
    v-model="generalSettings"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('general-settings-label') }}</h2>
    </template>

    <div class="space-y-4 py-2">
      <div>
        <UiFormLabel for="shipping-countdown-cutoff">
          {{ getEditorTranslation('cutoff-time-label') }}
        </UiFormLabel>
        <SfInput
          id="shipping-countdown-cutoff"
          v-model="shippingBlock.cutoffTime"
          type="time"
          data-testid="shipping-countdown-cutoff"
        />
        <p class="mt-1 text-xs text-neutral-500">
          {{ getEditorTranslation('cutoff-time-description', { time: DEFAULT_CUTOFF_TIME }) }}
        </p>
      </div>

      <div>
        <UiFormLabel for="shipping-countdown-timezone">
          {{ getEditorTranslation('timezone-label') }}
        </UiFormLabel>
        <SfSelect
          id="shipping-countdown-timezone"
          v-model="shippingBlock.timezone"
          class="w-full"
          data-testid="shipping-countdown-timezone"
        >
          <option v-for="option in timezoneOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </SfSelect>
        <p class="mt-1 text-xs text-neutral-500">
          {{ getEditorTranslation('timezone-description') }}
        </p>
      </div>

      <div>
        <UiFormLabel for="shipping-countdown-icon">
          {{ getEditorTranslation('icon-url-label') }}
        </UiFormLabel>
        <SfInput
          id="shipping-countdown-icon"
          v-model="shippingBlock.iconUrl"
          type="text"
          :placeholder="DEFAULT_ICON_URL"
          data-testid="shipping-countdown-icon"
        />
        <p class="mt-1 text-xs text-neutral-500">
          {{ getEditorTranslation('icon-url-description') }}
        </p>
      </div>
    </div>
  </UiAccordionItem>

  <UiAccordionItem
    v-model="workdaysSettings"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('workdays-settings-label') }}</h2>
    </template>

    <div class="space-y-4 py-2">
      <p class="text-sm text-neutral-600">
        {{ getEditorTranslation('workdays-description') }}
      </p>
      <div class="grid grid-cols-2 gap-2">
        <label
          v-for="day in weekDays"
          :key="day.key"
          class="flex items-center gap-3 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm hover:bg-neutral-100"
        >
          <SfCheckbox v-model="shippingBlock.workdays[day.key]" data-testid="shipping-countdown-workday" />
          <span>{{ getEditorTranslation(day.translationKey) }}</span>
        </label>
      </div>
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import { SfCheckbox, SfInput, SfSelect } from '@storefront-ui/vue';
import type {
  ShippingCountdownTimerContent,
  ShippingCountdownTimerFormProps,
  ShippingCountdownTimerWorkdays,
} from './types';
import {
  DEFAULT_CUTOFF_TIME,
  DEFAULT_ICON_URL,
  DEFAULT_TIMEZONE,
  DEFAULT_WORKDAYS,
  TIMEZONE_OPTIONS,
} from './defaults';

const { data } = useCategoryTemplate();
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();
const { t: getEditorTranslation } = useI18n();

const props = defineProps<ShippingCountdownTimerFormProps>();

const generalSettings = ref(true);
const workdaysSettings = ref(true);

const weekDays = [
  { key: 'monday', translationKey: 'weekday-monday' },
  { key: 'tuesday', translationKey: 'weekday-tuesday' },
  { key: 'wednesday', translationKey: 'weekday-wednesday' },
  { key: 'thursday', translationKey: 'weekday-thursday' },
  { key: 'friday', translationKey: 'weekday-friday' },
  { key: 'saturday', translationKey: 'weekday-saturday' },
  { key: 'sunday', translationKey: 'weekday-sunday' },
] as const;

const shippingBlock = computed<
  ShippingCountdownTimerContent & { workdays: ShippingCountdownTimerWorkdays }
>(() => {
  const rawContent = (findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value)?.content || {}) as ShippingCountdownTimerContent;

  if (!rawContent.cutoffTime) {
    rawContent.cutoffTime = DEFAULT_CUTOFF_TIME;
  }

  if (!rawContent.timezone) {
    rawContent.timezone = DEFAULT_TIMEZONE;
  }

  rawContent.workdays = {
    ...DEFAULT_WORKDAYS,
    ...(rawContent.workdays || {}),
  } as ShippingCountdownTimerWorkdays;

  return rawContent as ShippingCountdownTimerContent & { workdays: ShippingCountdownTimerWorkdays };
});

const timezoneOptions = computed(() => {
  const options = [...TIMEZONE_OPTIONS];
  const currentTimezone = shippingBlock.value.timezone;

  if (currentTimezone && !options.some((option) => option.value === currentTimezone)) {
    options.push({ label: currentTimezone, value: currentTimezone });
  }

  return options;
});
</script>

<i18n lang="json">
{
  "en": {
    "general-settings-label": "General",
    "cutoff-time-label": "Cut-off time",
    "cutoff-time-description": "Orders placed before {time} on a shipping day leave the warehouse the same day.",
    "timezone-label": "Time zone",
    "timezone-description": "Choose the time zone used to calculate the countdown.",
    "icon-url-label": "Icon URL",
    "icon-url-description": "Leave empty to use the default icon URL.",
    "workdays-settings-label": "Shipping days",
    "workdays-description": "Select the weekdays that count as shipping days.",
    "weekday-monday": "Monday",
    "weekday-tuesday": "Tuesday",
    "weekday-wednesday": "Wednesday",
    "weekday-thursday": "Thursday",
    "weekday-friday": "Friday",
    "weekday-saturday": "Saturday",
    "weekday-sunday": "Sunday"
  },
  "de": {
    "general-settings-label": "Allgemein",
    "cutoff-time-label": "Bestellschluss",
    "cutoff-time-description": "Bestellungen vor {time} an einem Versandtag verlassen noch am selben Tag das Lager.",
    "timezone-label": "Zeitzone",
    "timezone-description": "Wählen Sie die Zeitzone, die für den Countdown verwendet wird.",
    "icon-url-label": "Icon-URL",
    "icon-url-description": "Leer lassen, um das Standard-Icon zu verwenden.",
    "workdays-settings-label": "Versandtage",
    "workdays-description": "Wählen Sie die Wochentage aus, die als Versandtage gelten.",
    "weekday-monday": "Montag",
    "weekday-tuesday": "Dienstag",
    "weekday-wednesday": "Mittwoch",
    "weekday-thursday": "Donnerstag",
    "weekday-friday": "Freitag",
    "weekday-saturday": "Samstag",
    "weekday-sunday": "Sonntag"
  }
}
</i18n>
