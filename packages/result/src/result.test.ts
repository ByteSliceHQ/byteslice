import { describe, expect, it } from 'bun:test'
import {
  type Result,
  expect as expectResult,
  unwrap,
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
