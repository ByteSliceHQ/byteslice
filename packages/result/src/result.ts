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
