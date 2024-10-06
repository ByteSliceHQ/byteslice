import { describe, expect, it } from 'bun:test'
import { withResult } from './result'

describe('withResult', () => {
  describe.each([
    {
      label: 'should wrap synchronous operation',
      operation: () => true,
    },
    {
      label: 'should wrap asynchronous operation',
      operation: async () => true,
    },
  ])('operations', ({ label, operation }) => {
    it(label, async () => {
      const result = await withResult(operation, (err) => err)

      expect(result.failure).toBeUndefined()

      if (!result.failure) {
        expect(result.data).toBeTrue()
      }
    })
  })

  const error = new Error('uh-oh')

  describe.each([
    {
      label: 'should wrap exception from synchronous operation',
      operation: () => {
        throw error
      },
    },
    {
      label: 'should wrap exception from asynchronous operation',
      operation: async () => {
        throw error
      },
    },
  ])('exceptions', ({ label, operation }) => {
    it(label, async () => {
      const result = await withResult(operation, (err) => err)

      expect(result.failure).toEqual(error)
    })
  })
})
