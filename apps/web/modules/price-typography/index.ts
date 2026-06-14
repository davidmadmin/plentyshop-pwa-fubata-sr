import { addImportsDir, addPlugin, createResolver, defineNuxtModule } from 'nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'price-typography',
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url);

    nuxt.options.runtimeConfig.public.priceFontPreset = process.env.NUXT_PUBLIC_PRICE_FONT_PRESET || 'disabled';

    addImportsDir(resolver.resolve('./runtime/composables'));
    addPlugin(resolver.resolve('./runtime/plugins/priceTypography'));
    nuxt.options.css.push(resolver.resolve('./runtime/assets/price-typography.css'));
  },
});
