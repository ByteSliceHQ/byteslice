import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/server/index.ts'],
    outDir: 'dist/server',
    format: ['esm', 'cjs'],
    platform: 'node',
    dts: true,
  },
  {
    entry: ['src/index.ts'],
    outDir: 'dist',
    format: ['esm', 'cjs'],
    dts: true,
  },
])
