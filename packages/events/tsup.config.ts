import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/client/index.ts'],
    outDir: 'dist/client',
    format: ['esm', 'cjs'],
    platform: 'browser',
    dts: true,
  },
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
  {
    entry: ['src/react/index.tsx'],
    outDir: 'dist/react',
    external: ['react', 'react-dom'],
    format: ['esm'],
    sourcemap: true,
    dts: true,
    bundle: false,
    target: 'esnext',
  },
])
