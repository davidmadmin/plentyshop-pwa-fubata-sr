<template>
  <svg
    viewBox="0 0 320 320"
    role="img"
    :aria-label="label"
    class="h-full w-full overflow-visible"
    data-testid="screw-finder-illustration"
  >
    <defs>
      <linearGradient id="finder-metal" x1="0" x2="1">
        <stop offset="0" stop-color="#f6e3b4" />
        <stop offset="0.45" :stop-color="accentColor" />
        <stop offset="1" stop-color="#8b6428" />
      </linearGradient>
      <filter id="finder-shadow">
        <feDropShadow dx="0" dy="12" stdDeviation="10" flood-opacity=".28" />
      </filter>
    </defs>
    <g transform="rotate(-18 160 160)" filter="url(#finder-shadow)">
      <path d="M122 52h76l18 30-18 30h-76l-18-30z" fill="url(#finder-metal)" />
      <path d="M130 82h60M160 57v50" stroke="#2b2418" stroke-width="8" stroke-linecap="round" />
      <path d="M145 108h30v142l-15 30-15-30z" fill="url(#finder-metal)" />
      <g stroke="#5f451f" stroke-width="5">
        <path v-for="y in threadLines" :key="y" :d="`M143 ${y}l35 12`" />
      </g>
    </g>
    <circle cx="160" cy="160" r="142" fill="none" :stroke="accentColor" stroke-opacity=".18" />
    <circle cx="160" cy="160" r="112" fill="none" stroke="white" stroke-opacity=".06" stroke-dasharray="5 12" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ accentColor?: string; label?: string }>(), {
  accentColor: 'rgb(var(--colors-2-secondary-500))',
  label: 'Technische Schraubenillustration',
});

const threadLines = [130, 151, 172, 193, 214, 235];
</script>
