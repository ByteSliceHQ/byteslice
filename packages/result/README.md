# @byteslice/result

A lightweight TypeScript utility for wrapping operations in a structured `Result` type, mitigating the need for exception-handling boilerplate.

This package enables developers to clearly represent both _success_ and _failure_ states, ensuring a predictable and type-safe approach to managing operation results.

🍕 Built by the team at [ByteSlice](https://byteslice.co).

## Table of Contents

- [Motivation](#motivation)
- [Overview](#overview)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Motivation

To fully understand the purpose and application of this package, it's essential to provide some context.

### Errors vs. Exceptions

Exceptions are particularly useful in scenarios where a program must terminate quickly in response to serious problems or unforeseen circumstances. As the term suggests, they signify _exceptions_ that arise when standard operations are disrupted by the unexpected.

In TypeScript, any value can be "thrown" as an exception: errors, strings, numbers, you name it. This is why "caught" exceptions are type `unknown`.

Errors, on the other hand, are values that represent anticipated—albeit undesired—behavior. They denote an error state and typically contain a descriptive message that explains the nature of the problem.

### Function Signatures

TypeScript—while providing excellent type safety—lacks a built-in mechanism to indicate when a function might throw an exception.

Consider the following function. While the implementation indicates that an exception could be thrown, the type signature fails to convey this information.
```ts
function fetchUser(id: string): User {
  throw new Error('Oh no, Mr. Bill!')
}
```

This becomes especially problematic if the developer is not familiar with the underlying implementation. They may need to resort to defensive try/catch blocks or risk having exceptions propagate unexpectedly.

### Success and Failure States

Every operation can lead to one of two possible outcomes: success or failure. Establishing a standard pattern to represent both of these potential states is crucial.

The `@byteslice/result` package provides this pattern through a `Result` type that effectively captures these two distinct states.

Instead of an operation simply returning a value (indicating success) or throwing an exception (indicating failure), it can return a type-safe `Result` that represents either outcome.

## Overview

`@byteslice/result` provides the following exports:

1. **`Result`** – A discriminated union type representing either:
   - **Success**: `{ data: S }`
   - **Failure**: `{ failure: F }`

2. **`withResult`** – An asynchronous function wrapper that:
   - Executes a provided operation.
   - Catches any thrown exception.
   - Returns a **success** or **failure** object rather than throwing.

3. **`unwrap`** / **`expect`** – Escape hatches (inspired by Rust) that return the
   success `data` directly, or throw if the `Result` is a failure.

This pattern is particularly helpful when you want to **avoid using try/catch** directly in your code, or if you need a standardized way to capture failure details.

## Usage

### Basic Example

```ts
import { withResult } from '@byteslice/result'

// function signature does not indicate an exception may occur
async function fetchData(): Promise<string> {
  throw new Error('The dog refused to fetch')
}

async function main() {
  const result = await withResult(
    // operation
    () => fetchData(),
    // onError
    (error) => new Error('Could not fetch data', { cause: error })
  )

  // check for failure
  if (result.failure) {
    console.error(result.failure)
  } else {
    // result is a success
    // data property is now available
    console.log(result.data)
  }
}

main()
```

🔎&nbsp;&nbsp;Let's examine `withResult` further:
- The first parameter (`operation`) wraps a function to be executed when `withResult` is called.
  - If the provided function throws an exception, it is coerced to an error (as necessary).
- The second parameter (`onError`) receives this error as its sole argument and returns a `FailureOption`—either an `Error` or a `FailureCase` (an object with an `error` property).
- The `Result` returned from `withResult` depends on the result of the `operation`.
  - If _successful_, the returned `Result` will be type `Success` and contain the output of the executed function in its `data` property.
  - If _unsuccessful_, the returned `Result` will be type `Failure` and contain the `FailureOption` in its `failure` property.

To ensure failure states are handled, the `failure` property of the `Result` must be examined before the `data` property (and its strongly-typed contents) can be accessed.

> 💡 In the example above, `onError` returns a bespoke `Error` while **maintaining the stack trace** of the original error via [cause](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause). 

### Custom Failure

By default, the `Failure` type of `Result` contains a `failure` property of `Error`.

However, you can define your own custom `failure`—as long as it is an object with an `error` property of type `Error`. This ensures the error is available, while permitting the flexibility to add any other fields.

```ts
import { withResult, Result } from '@byteslice/result'

type CustomFailure = {
  // required property
  error: Error
  // custom property
  type: 'NETWORK_ERROR' | 'VALIDATION_ERROR'
}

type CustomSuccess = { name: string }

async function fetchUser(): Promise<Result<CustomSuccess, CustomFailure>> {
  return await withResult(
    async () => {
      // function call may throw an exception
      const name = await db.getName()

      return { name }
    },
    // onError returns custom failure
    (error) => ({ error, type: 'NETWORK_ERROR' })
  )
}

async function main() {
  const result = await fetchUser()

  if (result.failure) {
    console.warn('This type of error occurred:', result.failure.type)
  } else {
    console.log(result.data.name)
  }
}

main()
```

### Hook: `onException`

You can optionally provide an `onException` hook to transform the original exception into an error before it is passed to `onError`. This is a great spot for logging or returning custom errors based on the type of exception.

```ts
import { withResult } from '@byteslice/result'

async function main() {
  const result = await withResult(
    // operation may throw an exception
    () => riskyOperation(),
    // onError receives error returned from onException
    (err) => (err),
    {
      onException: (ex) => {
        // log thrown exception
        console.warn('Caught exception:', ex)

        // return known error
        if (err instanceof CustomError) {
          return err
        }

        // return default error
        return new Error('Something unexpected occurred')
      }
    }
  )

  if (result.failure) {
    console.error(result.failure)
  } else {
    console.log(result.data)
  }
}

main()
```

If no `onException` hook is provided, then any thrown exceptions are handled by an internal `ensureError` function. As the name implies, it ensures the `onError` hook receives a valid error.

### Unwrapping: `unwrap` and `expect`

Inspecting the `failure` property is the safe, type-driven way to consume a `Result`. Occasionally, however, you _know_ an operation should have succeeded and simply want the underlying `data`—treating any failure as an exceptional, program-halting event.

Borrowing from [Rust's `Result`](https://doc.rust-lang.org/std/result/enum.Result.html), `unwrap` and `expect` provide this escape hatch.

`unwrap` returns the success `data`, or re-throws the failure's underlying error.

```ts
import { unwrap, withResult } from '@byteslice/result'

const result = await withResult(
  () => fetchData(),
  (error) => error,
)

// returns the data on success, or throws the underlying error on failure
const data = unwrap(result)
```

`expect` behaves the same, but lets you describe _why_ a success was expected. On failure it throws an `Error` with your message, preserving the original error via [cause](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause).

```ts
import { expect, withResult } from '@byteslice/result'

const result = await withResult(
  () => loadConfig(),
  (error) => error,
)

// throws `Error('config should be present', { cause: <original error> })` on failure
const config = expect(result, 'config should be present')
```

> ⚠️ Like their Rust counterparts, `unwrap` and `expect` trade type safety for convenience. Reach for them only when a failure genuinely represents an unrecoverable state.

## Contributing

Please see [CONTRIBUTING.md](https://github.com/ByteSliceHQ/byteslice/blob/main/CONTRIBUTE.md) for details.

## License

[MIT](https://github.com/ByteSliceHQ/byteslice/blob/main/LICENSE) © [ByteSlice](https://byteslice.co)
See the [LICENSE](https://github.com/ByteSliceHQ/byteslice/blob/main/LICENSE) file for more details.
