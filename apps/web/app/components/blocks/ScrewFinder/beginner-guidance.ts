import type {
  ScrewFinderApplication,
  ScrewFinderBeginnerGuidance,
  ScrewFinderDemand,
  ScrewFinderHeadPreference,
} from './types';

const allHeadPreferences: ScrewFinderHeadPreference[] = ['flush', 'low-profile', 'clamping', 'concealed', 'any'];
const allDemands: ScrewFinderDemand[] = ['light', 'general', 'heavy'];

export const beginnerGuidance: Record<ScrewFinderApplication, ScrewFinderBeginnerGuidance> = {
  interior: {
    headPreferences: allHeadPreferences,
    demands: ['light', 'general'],
  },
  structural: {
    headPreferences: ['flush', 'clamping', 'any'],
    demands: ['general', 'heavy'],
  },
  terrace: {
    headPreferences: ['flush', 'concealed', 'any'],
    demands: allDemands,
  },
  drywall: {
    headPreferences: [],
    demands: [],
  },
  window: {
    headPreferences: ['flush', 'low-profile', 'any'],
    demands: allDemands,
  },
  roofing: {
    headPreferences: [],
    demands: allDemands,
  },
};

export const getBeginnerGuidance = (application?: ScrewFinderApplication): ScrewFinderBeginnerGuidance =>
  application
    ? beginnerGuidance[application]
    : {
        headPreferences: allHeadPreferences,
        demands: allDemands,
      };
