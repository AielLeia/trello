import { useCallback, useState } from 'react';

import {
  ActionState,
  FieldErrors,
  Optional,
  ReturnTypeEnum,
} from '@/lib/create-safe-action';

type Action<TInput, TOutput> = (
  data: TInput
) => Promise<ActionState<TInput, TOutput>>;

type UseActionOptions<TOutput> = {
  onSuccess?: (data: TOutput) => void;
  onError?: (error: string) => void;
  onCompleted?: () => void;
};

export const useAction = <TInput, TOutput>(
  action: Action<TInput, TOutput>,
  options: UseActionOptions<TOutput> = {}
) => {
  const [fieldErrors, setFieldErrors] =
    useState<Optional<FieldErrors<TInput>>>(undefined);
  const [error, setError] = useState<Optional<string>>(undefined);
  const [data, setData] = useState<Optional<TOutput>>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const execute = useCallback(
    async (input: TInput) => {
      setIsLoading(true);
      try {
        const result = await action(input);
        if (!result) {
          return;
        }

        if (result.type === ReturnTypeEnum.FIELD_ERRORS) {
          setFieldErrors(result.fieldErrors);
        }

        if (result.type === ReturnTypeEnum.GENERALE_ERROR) {
          setError(result.error);
          options.onError?.(result.error);
        }

        if (result.type === ReturnTypeEnum.RESULT && result.data) {
          setData(result.data);
          options.onSuccess?.(result.data);
        }
      } finally {
        setIsLoading(false);
        options.onCompleted?.();
      }
    },
    [action, options]
  );

  return {
    execute,
    fieldErrors,
    error,
    data,
    isLoading,
  };
};
