type Success<T> = {
  failure?: never
  result: T
}

type Failure<T> = {
  failure: T
}

type FailureCase = {
  type: string
}

type FailureOption = FailureCase | Error

export type Result<S, F extends FailureOption> = Success<S> | Failure<F>

function ensureError(
  ex: unknown,
  fallback: Error = new Error('Something went wrong'),
): Error {
  return ex instanceof Error ? ex : fallback
}

type WithResultOptions = {
  fallback?: Error
}

// Wraps operation with structured result (success and failure states).
export async function withResult<S, F extends FailureOption>(
  operation: S | Promise<S>,
  onError: (error: Error) => F,
  options?: WithResultOptions,
): Promise<Result<S, F>> {
  try {
    return { result: await operation }
  } catch (ex) {
    return { failure: onError(ensureError(ex, options?.fallback)) }
  }
}
