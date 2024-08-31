import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/result.ts'],
  format: ['cjs', 'esm'],
  dts: true,
})
