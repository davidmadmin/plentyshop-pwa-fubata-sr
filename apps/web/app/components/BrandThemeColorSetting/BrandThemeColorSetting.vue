<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ label }}</UiFormLabel>
      <SfTooltip v-if="tooltip" :label="tooltip" placement="top" :show-arrow="true" class="ml-2 z-dropdown">
        <SfIconInfo size="sm" />
      </SfTooltip>
    </div>

    <EditorColorPicker v-model="settingValue" class="w-full" :show-shop-colors="false">
      <template #trigger="{ color, toggle }">
        <label>
          <SfInput v-model="settingValue" type="text" :data-testid="`${settingKey}-select`">
            <template #suffix>
              <button
                type="button"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                :style="{ backgroundColor: color }"
                @mousedown.stop
                @click.stop="toggle"
              />
            </template>
          </SfInput>
        </label>
      </template>
    </EditorColorPicker>
  </div>
</template>

<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const props = defineProps<{
  label: string;
  settingKey: string;
  tooltip?: string;
}>();

const { updateSetting, getSetting } = useSiteSettings(props.settingKey);

const settingValue = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>
