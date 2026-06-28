import { describe, expect, it } from 'bun:test'
import {
  type Result,
  expect as expectResult,
  map,
  mapFailure,
  unwrap,
  unwrapOr,
  unwrapOrElse,
  withResult,
} from './result'

const message = 'uh-oh'
const error = new Error(message)
const fallback = new Error('Something went wrong')

describe('withResult', () => {
  describe.each([
    {
      label: 'should wrap synchronous operation',
      operation: () => true,
    },
    {
      label: 'should wrap asynchronous operation',
      operation: async () => {
        return await Promise.resolve(true)
      },
    },
  ])('success', ({ label, operation }) => {
    it(label, async () => {
      const result = await withResult(operation, (err) => err)

      expect(result.failure).toBeUndefined()

      if (result.failure === undefined) {
        expect(result.data).toBeTrue()
      }
    })
  })

  describe.each([
    {
      label: 'should wrap synchronous operation',
      operation: () => {
        throw error
      },
    },
    {
      label: 'should wrap asynchronous operation',
      operation: async () => {
        await Promise.reject(error)
      },
    },
  ])('failure', ({ label, operation }) => {
    it(label, async () => {
      const result = await withResult(operation, (err) => err)

      expect(result.failure).toEqual(error)
      expect('data' in result).toBe(false)
    })
  })

  describe('ensureError', () => {
    it('should wrap non-error exception', async () => {
      const result = await withResult(
        () => {
          throw message
        },
        (err) => err,
      )

      expect(result.failure).toEqual(fallback)
      expect('data' in result).toBe(false)
    })
  })

  describe('onException', () => {
    it('should wrap non-error exception', async () => {
      const result = await withResult(
        () => {
          throw message
        },
        (err) => err,
        {
          onException: (ex) => {
            expect(ex).toBe(message)
            return error
          },
        },
      )

      expect(result.failure).toEqual(error)
      expect('data' in result).toBe(false)
    })
  })

  describe('FailureOption', () => {
    it('should permit custom failure', async () => {
      const result = await withResult(
        () => {
          throw error
        },
        (err) => ({ error: err, custom: true }),
      )

      expect(result.failure).toEqual({ error: error, custom: true })
      expect('data' in result).toBe(false)
    })
  })
})

describe('unwrap', () => {
  it('should return data for a success', () => {
    const result: Result<boolean> = { data: true }

    expect(unwrap(result)).toBeTrue()
  })

  it('should throw the underlying error for a failure', () => {
    const result: Result<boolean> = { failure: error }

    expect(() => unwrap(result)).toThrow(error)
  })

  it('should throw the underlying error of a custom failure', () => {
    const result: Result<boolean, { error: Error; custom: boolean }> = {
      failure: { error, custom: true },
    }

    expect(() => unwrap(result)).toThrow(error)
  })
})

describe('expect', () => {
  it('should return data for a success', () => {
    const result: Result<boolean> = { data: true }

    expect(expectResult(result, message)).toBeTrue()
  })

  it('should throw an error with the provided message for a failure', () => {
    const result: Result<boolean> = { failure: error }

    expect(() => expectResult(result, message)).toThrow(message)
  })

  it('should preserve the underlying error as the cause', () => {
    const result: Result<boolean> = { failure: error }

    try {
      expectResult(result, message)
      expect.unreachable()
    } catch (ex) {
      expect(ex).toBeInstanceOf(Error)
      expect((ex as Error).cause).toBe(error)
    }
  })
})

describe('unwrapOr', () => {
  it('should return data for a success', () => {
    const result: Result<number> = { data: 1 }

    expect(unwrapOr(result, 2)).toBe(1)
  })

  it('should return the fallback for a failure', () => {
    const result: Result<number> = { failure: error }

    expect(unwrapOr(result, 2)).toBe(2)
  })

  it('should return falsy data rather than the fallback', () => {
    const result: Result<number> = { data: 0 }

    expect(unwrapOr(result, 2)).toBe(0)
  })
})

describe('unwrapOrElse', () => {
  it('should return data for a success', () => {
    const result: Result<number> = { data: 1 }

    expect(unwrapOrElse(result, () => 2)).toBe(1)
  })

  it('should compute the fallback from the failure', () => {
    const result: Result<number> = { failure: error }

    expect(unwrapOrElse(result, (failure) => failure.message.length)).toBe(
      message.length,
    )
  })

  it('should not invoke the callback for a success', () => {
    const result: Result<number> = { data: 1 }
    let called = false

    unwrapOrElse(result, () => {
      called = true
      return 2
    })

    expect(called).toBeFalse()
  })

  it('should receive a custom failure', () => {
    const result: Result<number, { error: Error; custom: boolean }> = {
      failure: { error, custom: true },
    }

    expect(unwrapOrElse(result, (failure) => (failure.custom ? 1 : 2))).toBe(1)
  })
})

describe('map', () => {
  it('should transform the data of a success', () => {
    const result: Result<number> = { data: 2 }
    const mapped = map(result, (data) => data * 2)

    expect(unwrap(mapped)).toBe(4)
  })

  it('should leave a failure untouched', () => {
    const result: Result<number> = { failure: error }
    const mapped = map(result, (data) => data * 2)

    expect(mapped.failure).toBe(error)
  })

  it('should not invoke the callback for a failure', () => {
    const result: Result<number> = { failure: error }
    let called = false

    map(result, (data) => {
      called = true
      return data
    })

    expect(called).toBeFalse()
  })
})

describe('mapFailure', () => {
  it('should transform the failure of a failure', () => {
    const result: Result<number> = { failure: error }
    const mapped = mapFailure(result, () => fallback)

    expect(mapped.failure).toBe(fallback)
  })

  it('should support mapping to a custom failure', () => {
    const result: Result<number> = { failure: error }
    const mapped = mapFailure(result, (failure) => ({
      error: failure,
      custom: true,
    }))

    expect(mapped.failure).toEqual({ error, custom: true })
  })

  it('should leave a success untouched', () => {
    const result: Result<number> = { data: 1 }
    const mapped = mapFailure(result, () => fallback)

    expect(unwrap(mapped)).toBe(1)
  })

  it('should not invoke the callback for a success', () => {
    const result: Result<number> = { data: 1 }
    let called = false

    mapFailure(result, () => {
      called = true
      return fallback
    })

    expect(called).toBeFalse()
  })
})
