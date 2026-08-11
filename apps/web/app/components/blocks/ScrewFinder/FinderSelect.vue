<template>
  <label class="block">
    <span class="mb-2 block text-sm font-bold">{{ label }}</span>
    <select
      class="h-12 w-full border border-white/15 bg-neutral-900 px-4 text-sm text-white outline-none focus:border-[var(--finder-accent)]"
      :value="modelValue?.id ?? ''"
      :disabled="disabled"
      @change="onChange"
    >
      <option value="">Keine Angabe</option>
      <option v-for="option in options" :key="String(option.id)" :value="option.id">
        {{ getFilterName(option) }} ({{ option.count ?? 0 }})
      </option>
    </select>
  </label>
</template>

<script setup lang="ts">
import type { Filter } from '@plentymarkets/shop-api';
import { getFilterName } from './matching';

const props = defineProps<{ label: string; options: Filter[]; modelValue?: Filter; disabled?: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: Filter | undefined] }>();

const onChange = (event: Event) => {
  const id = (event.target as HTMLSelectElement).value;
  emit(
    'update:modelValue',
    props.options.find((option) => String(option.id) === id),
  );
};
</script>
