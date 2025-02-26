# @byteslice/result

A lightweight TypeScript utility for wrapping operations in a structured result type, eliminating the need for extensive try/catch or error-handling boilerplate. This package allows you to represent both **success** and **failure** outcomes in a predictable, type-safe manner.

## Installation

```bash
npm install @byteslice/result
# or
yarn add @byteslice/result
# or
pnpm add @byteslice/result
# or
bun add @byteslice/result
```

## Overview

`@byteslice/result` provides two key exports:

1. **`Result<S, F = Error>`** – A discriminated union type representing either:
   - **Success**: `{ data: S }`
   - **Failure**: `{ failure: F }`

2. **`withResult`** – An asynchronous function wrapper that:
   - Executes a provided operation.
   - Catches any thrown exception.
   - Returns a **success** or **failure** object rather than throwing.

This pattern is particularly helpful when you want to **avoid** using try/catch directly in your code, or if you need a standardized way to capture failure details.

## Usage

### Basic Example

```ts
import { withResult } from '@byteslice/result';

async function fetchData(): Promise<string> {
  // Imagine this might fail
  return "Data fetched successfully!";
}

async function main() {
  const result = await withResult(
    () => fetchData(),
    (error) => error // Pass the error through as-is (default)
  );

  if (!result.failure) {
    console.log('Success:', result.data);
  } else {
    console.error('Failure:', result.failure);
  }
}

main();
```

In this example:
- The `fetchData` function may throw.
- `withResult` catches any thrown exceptions and calls `onError`, returning a `failure` object if something goes wrong.
- The caller only needs to check if `result` contains a `data` or a `failure` property.

### Custom Failure Types

By default, the failure type (`F`) is `Error`, but you can define your own custom failure structure:

```ts
import { withResult, Result } from '@byteslice/result';

interface MyCustomFailure {
  type: 'NETWORK_ERROR' | 'VALIDATION_ERROR';
  message: string;
}

async function fetchUser(): Promise<Result<{ name: string }, MyCustomFailure>> {
  return withResult(
    async () => {
      // Potentially throwing code
      return { name: 'Alice' };
    },
    (error) => ({
      type: 'NETWORK_ERROR',
      message: error.message
    })
  );
}

async function main() {
  const result = await fetchUser();

  if (!result.failure) {
    console.log('User:', result.data.name);
  } else {
    console.log('Failed with:', result.failure);
  }
}
```

### Using `onException` Hook

You can optionally provide an `onException` hook to transform or log the original exception before `onError` is called:

```ts
import { withResult } from '@byteslice/result';

async function riskyOperation() {
  throw new Error("Something unexpected occurred!");
}

async function main() {
  const result = await withResult(
    () => riskyOperation(),
    (err) => ({ type: 'CUSTOM_FAILURE', message: err.message }),
    {
      onException: (ex) => {
        // Log, transform, or capture `ex` before it's passed to onError
        console.error('Caught exception:', ex);
        return new Error('Wrapped exception details');
      }
    }
  );

  if (!result.failure) {
    console.log('Operation succeeded:', result.data);
  } else {
    console.warn('Operation failed:', result.failure);
  }
}

main();
```

In this scenario:
- `onException` is called first, receiving the thrown value (`ex`), and returns an `Error`.
- That `Error` is then passed to your `onError` function.

## Contributing

Please see [CONTRIBUTING.md](https://github.com/ByteSliceHQ/byteslice/blob/main/CONTRIBUTE.md) for details.

## License

[MIT](https://github.com/ByteSliceHQ/byteslice/blob/main/LICENSE) © [ByteSlice](https://byteslice.co)
See the [LICENSE](https://github.com/ByteSliceHQ/byteslice/blob/main/LICENSE) file for more details.
