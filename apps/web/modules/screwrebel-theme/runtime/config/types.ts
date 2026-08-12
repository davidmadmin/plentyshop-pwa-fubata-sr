export type PriceFontPreset = {
  id: string;
  label: string;
  provider: 'adobe';
  stylesheetUrl: string;
  family: string;
  weight: number;
  style: 'normal' | 'italic';
};

export type PriceFontPresetId = 'industry-demi';
