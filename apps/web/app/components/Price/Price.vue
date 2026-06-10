<template>
  <div class="text-sm py-1">
    <span class="price-display mr-2 font-bold text-2xl" data-testid="price">
      <span>{{ format(price) }}</span>
      <span>{{ t('common.labels.asterisk') }} </span>
    </span>
    <span v-if="crossedPrice && differentPrices" class="price-display-muted text-base font-normal line-through">
      {{ format(crossedPrice) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { PriceProps } from '~/components/Price/types';

const props = defineProps<PriceProps>();

const { format } = usePriceFormatter();

const differentPrices = computed(() => {
  return props.crossedPrice
    ? Math.round(props.price * 100) / 100 !== Math.round(props.crossedPrice * 100) / 100
    : false;
});
</script>
