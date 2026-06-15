import type { Filter, FilterGroup, Product } from '@plentymarkets/shop-api';

export type ScrewFinderPath = 'beginner' | 'professional';
export type ScrewFinderApplication = 'interior' | 'structural' | 'terrace' | 'drywall' | 'window' | 'roofing';
export type ScrewFinderEnvironment = 'indoor' | 'protected' | 'outdoor' | 'corrosive';
export type ScrewFinderHeadPreference = 'flush' | 'low-profile' | 'clamping' | 'concealed' | 'any';
export type ScrewFinderDemand = 'light' | 'general' | 'heavy';
export type ScrewFinderFacetKey = 'material' | 'head' | 'drive' | 'diameter' | 'length' | 'package';
export type ScrewFinderBeginnerGuidance = {
  headPreferences: ScrewFinderHeadPreference[];
  demands: ScrewFinderDemand[];
};

export type ScrewFinderContent = {
  sourceCategoryPath?: string;
  text?: {
    eyebrow?: string;
    title?: string;
    introduction?: string;
    beginnerCta?: string;
    professionalCta?: string;
    resultsTitle?: string;
    emptyTitle?: string;
    emptyText?: string;
  };
  paths?: {
    beginner?: boolean;
    professional?: boolean;
  };
  stages?: {
    beginnerEnvironment?: boolean;
    beginnerHead?: boolean;
    beginnerDemand?: boolean;
    beginnerExactSize?: boolean;
    professionalDrive?: boolean;
    professionalPackage?: boolean;
  };
  resultCount?: number;
  appearance?: {
    backgroundColor?: string;
    accentColor?: string;
  };
  layout?: {
    fullWidth?: boolean;
  };
};

export type ScrewFinderProps = {
  name: string;
  type: string;
  content: ScrewFinderContent;
  meta: {
    uuid: string;
  };
  index?: number;
};

export type ScrewFinderFormProps = {
  uuid?: string;
};

export type ScrewFinderAnswers = {
  path?: ScrewFinderPath;
  application?: ScrewFinderApplication;
  environment?: ScrewFinderEnvironment;
  headPreference?: ScrewFinderHeadPreference;
  demand?: ScrewFinderDemand;
  material?: Filter;
  head?: Filter;
  drive?: Filter;
  diameter?: Filter;
  length?: Filter;
  package?: Filter;
};

export type ScrewFinderFacetMap = Partial<Record<ScrewFinderFacetKey, FilterGroup>>;

export type ScrewFinderMatch = {
  product: Product;
  score: number;
  exact: boolean;
  reasons: string[];
  differences: string[];
  criteria: ScrewFinderCriterion[];
};

export type ScrewFinderAnswerSummary = {
  key: keyof ScrewFinderAnswers;
  stage: string;
  label: string;
  value: string;
};

export type ScrewFinderCriterionStatus = 'match' | 'mismatch' | 'available' | 'unknown';

export type ScrewFinderCriterion = {
  label: string;
  selectedValue: string;
  actualValue?: string;
  availableValues?: string[];
  status: ScrewFinderCriterionStatus;
};

export type ScrewFinderStage = {
  id: string;
  title: string;
  description?: string;
};
