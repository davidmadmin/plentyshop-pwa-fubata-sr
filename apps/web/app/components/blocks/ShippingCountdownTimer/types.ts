export type ShippingCountdownTimerWorkdays = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

export type ShippingCountdownTimerContent = {
  cutoffTime?: string;
  timezone?: string;
  iconUrl?: string;
  workdays?: Partial<ShippingCountdownTimerWorkdays>;
};

export type ShippingCountdownTimerProps = {
  name: string;
  type: string;
  content: ShippingCountdownTimerContent;
  configuration?: object;
  index?: number;
  meta: {
    uuid: string;
  };
};

export type ShippingCountdownTimerFormProps = {
  uuid?: string;
};
