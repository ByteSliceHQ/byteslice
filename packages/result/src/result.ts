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

function ensureError(ex: unknown): Error {
  return ex instanceof Error ? ex : new Error('Something went wrong')
}

// Wraps operation with structured result (success and failure states).
export async function withResult<S, F extends FailureOption>(
  operation: S | Promise<S>,
  onError: (error: Error) => F,
): Promise<Result<S, F>> {
  try {
    return { result: await operation }
  } catch (ex) {
    return { failure: onError(ensureError(ex)) }
  }
}
