type Success<T, K extends string = 'result'> = {
  failure?: never
} & {
  [Result in K]: T
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
  return ex instanceof Error ? ex : Error('Something went wrong')
}

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
