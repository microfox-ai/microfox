import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts', 'src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  publicDir: 'src/templates',
  banner: {
    js: '#!/usr/bin/env node',
  },
  bundle: true,
  noExternal: [/.*/],
});
