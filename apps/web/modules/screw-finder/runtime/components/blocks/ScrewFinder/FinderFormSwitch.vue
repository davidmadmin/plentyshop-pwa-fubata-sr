<template>
  <div class="flex items-center justify-between gap-3">
    <UiFormLabel class="m-0">{{ label }}</UiFormLabel>
    <SfSwitch :model-value="modelValue" @update:model-value="updateValue" />
  </div>
</template>

<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';

defineProps<{ modelValue: boolean; label: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();

const updateValue = (value: boolean | 'true' | 'false' | unknown[] | Set<unknown> | undefined) => {
  emit('update:modelValue', value === true || value === 'true');
};
</script>
