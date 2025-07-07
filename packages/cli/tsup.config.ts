import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/cli.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    publicDir: 'src/templates',
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]); 