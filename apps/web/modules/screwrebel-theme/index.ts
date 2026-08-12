import { addImportsDir, addPlugin, createResolver, defineNuxtModule } from 'nuxt/kit';
import { SCREWREBEL_THEME_DEFAULTS } from './runtime/config/theme';

export default defineNuxtModule({
  meta: {
    name: 'screwrebel-theme',
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url);

    Object.entries(SCREWREBEL_THEME_DEFAULTS).forEach(([key, value]) => {
      nuxt.options.runtimeConfig.public[key] ??= value;
    });

    addImportsDir(resolver.resolve('./runtime/composables'));
    addPlugin(resolver.resolve('./runtime/plugins/priceTypography'));
    addPlugin(resolver.resolve('./runtime/plugins/screwrebelTheme'));
    nuxt.options.css.push(resolver.resolve('./runtime/assets/price-typography.css'));
    nuxt.options.css.push(resolver.resolve('./runtime/assets/screwrebel-theme.css'));

    nuxt.options.nitro.publicAssets ??= [];
    nuxt.options.nitro.publicAssets.push({
      dir: resolver.resolve('./runtime/public'),
      baseURL: '/',
      maxAge: 3600,
    });

    nuxt.hook('tailwindcss:config', (config) => {
      const moduleSources = [
        resolver.resolve('./runtime/components/**/*.{vue,mjs,ts}'),
        resolver.resolve('./runtime/*.{mjs,js,ts}'),
      ];
      if (Array.isArray(config.content)) {
        config.content.push(...moduleSources);
      } else if (config.content && Array.isArray(config.content.files)) {
        config.content.files.push(...moduleSources);
      }
    });
  },
});
