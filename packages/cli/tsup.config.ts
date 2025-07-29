import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: [
      'src/index.ts',
      'src/cli.ts',
      'src/commands/push.ts',
      'src/commands/kickstart.ts',
      'src/commands/status.ts',
      'src/commands/add.ts',
      'src/commands/code.ts',
      'src/commands/install.ts',
      'src/commands/update.ts',
      'src/commands/track.ts',
      'src/commands/track-ci.ts',
      'src/commands/openapi.ts'
    ],
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