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

export type Result<S, F extends FailureCase | Error> = Success<S> | Failure<F>
