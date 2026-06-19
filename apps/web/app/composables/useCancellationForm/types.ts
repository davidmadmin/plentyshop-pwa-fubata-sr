export interface UseCancellationFormState {
  loading: boolean;
}

type SubmitCancellationParams = Parameters<ReturnType<typeof useSdk>['plentysystems']['doSubmitCancellation']>[0];

export type SubmitCancellation = (params: SubmitCancellationParams) => Promise<string | null>;
