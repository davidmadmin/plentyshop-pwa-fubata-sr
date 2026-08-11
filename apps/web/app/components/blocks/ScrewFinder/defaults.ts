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
