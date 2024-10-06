import { describe, expect, it } from 'bun:test'
import { withResult } from './result'

describe('withResult', () => {
  describe('operations', () => {
    it('should wrap synchronous operation', async () => {
      const operation = () => true
      const result = await withResult(operation(), (err) => err)

      expect(result.failure).toBeUndefined()

      if (!result.failure) {
        expect(result.data).toBeTrue()
      }
    })

    it('should wrap asynchronous operation', async () => {
      const operation = async () => true
      const result = await withResult(operation(), (err) => err)

      expect(result.failure).toBeUndefined()

      if (!result.failure) {
        expect(result.data).toBeTrue()
      }
    })
  })

  describe('exceptions', () => {
    const error = new Error('uh-oh')

    it('should wrap exception from synchronous operation', async () => {
      const operation = () => {
        throw error
      }
      const result = await withResult(operation(), (err) => err)

      expect(result.failure).toEqual(error)
    })

    it('should wrap exception from asynchronous operation', async () => {
      const operation = async () => {
        throw error
      }
      const result = await withResult(operation(), (err) => err)

      expect(result.failure).toEqual(error)
    })
  })
})
