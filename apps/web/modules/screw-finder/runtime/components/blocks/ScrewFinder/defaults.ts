import type { Block } from '@plentymarkets/shop-api';
import type { BlocksList } from '~/composables/useBlocksList/types';
import type { ScrewFinderContent } from './types';

export const screwFinderDefaults: Required<ScrewFinderContent> = {
  sourceCategoryPath: '/schrauben',
  text: {
    eyebrow: 'Schrauben Finder',
    title: 'Welche Schraube passt zu Ihrem Projekt?',
    introduction:
      'In wenigen Schritten zur passenden Schraube. Geführt für Einsteiger, direkt und technisch für Profis.',
    beginnerCta: 'Beratung starten',
    professionalCta: 'Direkt auswählen',
    resultsTitle: 'Ihre besten Treffer',
    emptyTitle: 'Keine exakte Schraube gefunden',
    emptyText: 'Passen Sie eine Auswahl an oder prüfen Sie die klar gekennzeichneten Alternativen.',
  },
  paths: {
    beginner: true,
    professional: true,
  },
  stages: {
    beginnerEnvironment: true,
    beginnerHead: true,
    beginnerDemand: true,
    beginnerExactSize: true,
    professionalDrive: true,
    professionalPackage: true,
  },
  resultCount: 3,
  appearance: {
    backgroundColor: '#15181b',
    accentColor: 'rgb(var(--colors-2-secondary-500))',
  },
  layout: {
    fullWidth: true,
  },
};

export const screwFinderEnglishDefaults: Required<ScrewFinderContent> = {
  ...screwFinderDefaults,
  text: {
    eyebrow: 'Screw Finder',
    title: 'Which screw fits your project?',
    introduction: 'Find the right screw in a few steps. Guided for beginners, direct and technical for professionals.',
    beginnerCta: 'Guide me',
    professionalCta: 'Choose directly',
    resultsTitle: 'Your best matches',
    emptyTitle: 'No exact screw found',
    emptyText: 'Adjust a selection or review the clearly marked alternatives.',
  },
};

const blocksList = {
  'screw-finder': {
    category: 'screw-finder',
    accessControl: ['content'],
    title: 'Screw Finder',
    blockName: 'ScrewFinder',
    variations: [
      {
        title: 'Screw Finder',
        image: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/product_galleries.png',
        template: {
          en: {
            name: 'ScrewFinder',
            type: 'content',
            meta: {
              uuid: '83dbca12-647d-4f91-87a2-11ab6c7779f0',
            },
            content: screwFinderEnglishDefaults,
          },
          de: {
            name: 'ScrewFinder',
            type: 'content',
            meta: {
              uuid: '5a3ea564-25d2-41be-b567-717d2e28fcaf',
            },
            content: screwFinderDefaults,
          },
        },
      },
    ],
  },
};

/**
 * Registers the Screw Finder in the editor block catalogue.
 */
export const getBlocksList = (): BlocksList => blocksList as unknown as BlocksList;

/**
 * Creates a fresh German Screw Finder block for programmatic insertion.
 */
export const createDefault = (): Block => ({
  name: 'ScrewFinder',
  type: 'content',
  meta: {
    uuid: crypto.randomUUID(),
  },
  content: resolveScrewFinderContent(),
});

/**
 * Applies backward-compatible defaults to persisted Screw Finder content.
 */
export const resolveScrewFinderContent = (content?: ScrewFinderContent): Required<ScrewFinderContent> => ({
  sourceCategoryPath: content?.sourceCategoryPath || screwFinderDefaults.sourceCategoryPath,
  text: { ...screwFinderDefaults.text, ...content?.text },
  paths: { ...screwFinderDefaults.paths, ...content?.paths },
  stages: { ...screwFinderDefaults.stages, ...content?.stages },
  resultCount:
    Number.isInteger(content?.resultCount) && Number(content?.resultCount) >= 1 && Number(content?.resultCount) <= 3
      ? Number(content?.resultCount)
      : screwFinderDefaults.resultCount,
  appearance: { ...screwFinderDefaults.appearance, ...content?.appearance },
  layout: { ...screwFinderDefaults.layout, ...content?.layout },
});
