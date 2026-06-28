type Success<T> = {
  failure?: never
  data: T
}

type Failure<T> = {
  failure: T
}

type FailureOption = Error | { error: Error }

export type Result<S, F extends FailureOption = Error> = Success<S> | Failure<F>

function ensureError(ex: unknown): Error {
  return ex instanceof Error ? ex : new Error('Something went wrong')
}

/** Extracts the underlying error from a failure option. */
function getError(failure: FailureOption): Error {
  return failure instanceof Error ? failure : failure.error
}

/** Narrows a result to its success state. */
function isSuccess<S, F extends FailureOption>(
  result: Result<S, F>,
): result is Success<S> {
  return result.failure === undefined
}

/**
 * Returns the success data of a result, or throws its underlying error.
 *
 * Inspired by Rust's `Result::unwrap`, this is an escape hatch for when a
 * failure is not expected and should surface as an exception.
 */
export function unwrap<S, F extends FailureOption = Error>(
  result: Result<S, F>,
): S {
  if (isSuccess(result)) {
    return result.data
  }

  throw getError(result.failure)
}

/**
 * Returns the success data of a result, or throws an error with the provided
 * message (preserving the original error via `cause`).
 *
 * Inspired by Rust's `Result::expect`, this is an escape hatch that lets the
 * caller describe why a success was expected.
 */
export function expect<S, F extends FailureOption = Error>(
  result: Result<S, F>,
  message: string,
): S {
  if (isSuccess(result)) {
    return result.data
  }

  throw new Error(message, { cause: getError(result.failure) })
}

/**
 * Returns the success data of a result, or a fallback value if it is a failure.
 *
 * Inspired by Rust's `Result::unwrap_or`, this never throws.
 */
export function unwrapOr<S, F extends FailureOption = Error>(
  result: Result<S, F>,
  fallback: S,
): S {
  if (isSuccess(result)) {
    return result.data
  }

  return fallback
}

/**
 * Returns the success data of a result, or computes a fallback from the failure.
 *
 * Inspired by Rust's `Result::unwrap_or_else`, this never throws and only
 * invokes `fn` when the result is a failure.
 */
export function unwrapOrElse<S, F extends FailureOption = Error>(
  result: Result<S, F>,
  fn: (failure: F) => S,
): S {
  if (isSuccess(result)) {
    return result.data
  }

  return fn(result.failure)
}

/**
 * Transforms the success data of a result, leaving a failure untouched.
 *
 * Inspired by Rust's `Result::map`. The mapping function is assumed to be
 * infallible; if it can fail, reach for `withResult` instead.
 */
export function map<S, U, F extends FailureOption = Error>(
  result: Result<S, F>,
  fn: (data: S) => U,
): Result<U, F> {
  if (isSuccess(result)) {
    return { data: fn(result.data) }
  }

  return result
}

/**
 * Transforms the failure of a result, leaving success data untouched.
 *
 * Inspired by Rust's `Result::map_err`. The mapped failure must itself be a
 * valid `FailureOption` (an `Error` or an object with an `error` property).
 */
export function mapFailure<S, F extends FailureOption, G extends FailureOption>(
  result: Result<S, F>,
  fn: (failure: F) => G,
): Result<S, G> {
  if (isSuccess(result)) {
    return result
  }

  return { failure: fn(result.failure) }
}

/** Wraps operation with structured result (success and failure states). */
export async function withResult<S, F extends FailureOption = Error>(
  operation: () => S | Promise<S>,
  onError: (error: Error) => F,
  options?: {
    onException?: (ex: unknown) => Error
  },
): Promise<Result<S, F>> {
  try {
    return { data: await operation() }
  } catch (ex) {
    const error = options?.onException?.(ex) ?? ensureError(ex)
    return { failure: onError(error) }
  }
}
