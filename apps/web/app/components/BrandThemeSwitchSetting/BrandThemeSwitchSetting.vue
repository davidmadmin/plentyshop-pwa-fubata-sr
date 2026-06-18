<template>
  <div class="py-2">
    <div class="flex justify-between gap-4 mb-2">
      <UiFormLabel class="mb-1">
        {{ label }}
        <SfTooltip v-if="tooltip" :label="tooltip" placement="top" :show-arrow="true" class="ml-2 z-dropdown">
          <SfIconInfo size="sm" />
        </SfTooltip>
      </UiFormLabel>
      <SfSwitch
        v-model="settingValue"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconInfo, SfSwitch, SfTooltip } from '@storefront-ui/vue';

const props = defineProps<{
  label: string;
  settingKey: string;
  tooltip?: string;
}>();

const { updateSetting, getSetting } = useSiteSettings(props.settingKey);

const settingValue = computed({
  get: () => ['1', 'true', 'yes', 'on'].includes(String(getSetting()).toLowerCase()),
  set: (value) => updateSetting(String(value)),
});
</script>
