import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
  },
  {
    entry: ['src/cli.ts'],
    format: ['cjs'],
    outDir: 'dist',
    banner: {
      js: '#!/usr/bin/env node',
    },
    outExtension: () => ({ js: '.js' }),
    clean: false,
  },
]); 