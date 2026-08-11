<template>
  <button
    type="button"
    class="group flex min-h-[112px] flex-col items-start border p-4 text-left transition hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transform-none @md:min-h-[132px]"
    :class="selected ? 'border-[var(--finder-accent)] bg-white/10' : 'border-white/12 bg-white/[0.045]'"
    :aria-pressed="selected"
    :disabled="disabled"
    @click="$emit('select')"
  >
    <span class="text-2xl font-light leading-none text-[var(--finder-accent)]" aria-hidden="true">{{ icon }}</span>
    <strong class="mt-auto block text-sm font-black leading-5 @md:text-base">{{ label }}</strong>
    <small class="mt-1 block text-xs leading-4 text-white/52">{{ description }}</small>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{ label: string; description?: string; icon?: string; selected?: boolean; disabled?: boolean }>(),
  {
    description: '',
    icon: '○',
    selected: false,
    disabled: false,
  },
);
defineEmits<{ select: [] }>();
</script>
