export interface UseCancellationFormState {
  loading: boolean;
}

export type CancellationFormParams = {
  email: string;
  name: string;
  orderId: string;
  reason?: string;
  'cf-turnstile-response'?: string;
};

export type SubmitCancellation = (params: CancellationFormParams) => Promise<string | null>;
