type Success<T, K extends string> = {
  failure?: never
} & {
  [ResultKey in K]: T
}

type Failure<T> = {
  failure: T
}

type FailureCase = {
  type: string
}

type FailureOption = FailureCase | Error

export type Result<S, F extends FailureOption, K extends string = 'result'> =
  | Success<S, K>
  | Failure<F>

function ensureError(
  ex: unknown,
  fallback: Error = new Error('Something went wrong'),
): Error {
  return ex instanceof Error ? ex : fallback
}

export async function withResult<S, F extends FailureOption>(
  operation: S | Promise<S>,
  onError: (error: Error) => F,
  fallback?: Error,
): Promise<Result<S, F>> {
  try {
    return { result: await operation }
  } catch (ex) {
    return { failure: onError(ensureError(ex, fallback)) }
  }
}
