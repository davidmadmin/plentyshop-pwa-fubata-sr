<template>
  <div>
    <ScrewFinder
      v-if="showScrewFinderPreview"
      name="ScrewFinder"
      type="content"
      :content="screwFinderDefaults"
      :meta="{ uuid: 'local-screw-finder-preview' }"
    />
    <EditableBlocks :identifier="'index'" :type="'immutable'" />
  </div>
</template>

<script lang="ts" setup>
import type { Locale } from '#i18n';
import { screwFinderDefaults } from '~/components/blocks/ScrewFinder/defaults';
import ScrewFinder from '~/components/blocks/ScrewFinder/ScrewFinder.vue';

const route = useRoute();
const showScrewFinderPreview = computed(() => import.meta.dev && route.query.previewScrewFinder?.toString() === '1');

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

definePageMeta({
  pageType: 'static',
  isBlockified: true,
  type: 'immutable',
  identifier: 'index',
  middleware: ['newsletter-confirmation-client', 'notifyme-interactions-client'],
  cacheControl: getCacheControl(),
});

const { setPageMeta } = usePageMeta();

const icon = 'home';
setPageMeta(t('homepage.title'), icon);

const { getRobots, setRobotForStaticPage } = useRobots();
getRobots();
setRobotForStaticPage('Homepage');

const { setBlocksListContext } = useBlocksList();
setBlocksListContext('content');
</script>
