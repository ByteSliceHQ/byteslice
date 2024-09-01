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

export async function withResult<S, F extends FailureOption>(
  operation: S | Promise<S>,
  onException: (ex: unknown) => F,
): Promise<Result<S, F>> {
  try {
    return { result: await operation }
  } catch (ex) {
    return { failure: onException(ex) }
  }
}
