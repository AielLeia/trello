import { z } from 'zod';

export type Optional<T> = T | undefined;

export type FieldErrors<T> = {
  [K in keyof T]?: string[];
};

export enum ReturnTypeEnum {
  FIELD_ERRORS,
  GENERALE_ERROR,
  RESULT,
}

export type ActionState<TInput, TOutput> =
  | {
      type: ReturnTypeEnum.FIELD_ERRORS;
      fieldErrors: FieldErrors<TInput>;
    }
  | {
      type: ReturnTypeEnum.GENERALE_ERROR;
      error: string;
    }
  | {
      type: ReturnTypeEnum.RESULT;
      data?: TOutput;
    };

export const createSafeAction = <TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
  return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
    const validatedResult = schema.safeParse(data);
    if (!validatedResult.success) {
      return {
        type: ReturnTypeEnum.FIELD_ERRORS,
        fieldErrors: validatedResult.error.flatten()
          .fieldErrors as FieldErrors<TInput>,
      };
    }

    return handler(validatedResult.data);
  };
};
