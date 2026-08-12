import { createResolver, defineNuxtModule } from 'nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'screw-finder',
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url);

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
