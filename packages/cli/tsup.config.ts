import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts', 'src/index.ts'],
  format: ['cjs', 'esm'],
  publicDir: 'src/templates',
  dts: true,
  sourcemap: true,
  clean: true,
});
