import fs from 'fs';
import path from 'path';
import { getProjectRoot } from '../../utils/getProjectRoot';
import { PackageInfo } from '../../types';

function createInitialPackageJson(
  packageName: string,
  description: string,
): any {
  return {
    name: packageName,
    version: '1.0.0',
    description,
    main: './dist/index.js',
    module: './dist/index.mjs',
    types: './dist/index.d.ts',
    files: ['dist/**/*', 'CHANGELOG.md'],
    scripts: {
      build: 'tsup',
      'build:watch': 'tsup --watch',
      clean: 'rm -rf dist',
      lint: 'eslint "./**/*.ts*"',
      'prettier-check': 'prettier --check "./**/*.ts*"',
    },
    exports: {
      './package.json': './package.json',
      '.': {
        import: './dist/index.mjs',
        require: './dist/index.js',
      },
    },
    dependencies: {
      zod: '^3.24.2',
    },
    devDependencies: {
      '@microfox/tsconfig': '*',
      '@types/node': '^18',
      tsup: '^8',
      typescript: '5.6.3',
    },
    publishConfig: {
      access: 'public',
    },
    engines: {
      node: '>=20.0.0',
    },
    homepage: 'https://github.com/microfox-ai/microfox',
    repository: {
      type: 'git',
      url: 'git+https://github.com/microfox-ai/microfox.git',
    },
    bugs: {
      url: 'https://github.com/microfox-ai/microfox/issues',
    },
    keywords: ['microfox', 'sdk', 'typescript'],
  };
}

function createInitialPackageInfo(
  packageName: string,
  title: string,
  description: string,
): PackageInfo {
  const dirName = packageName.replace('@microfox/', '');
  return {
    name: packageName,
    title,
    description,
    platformType: 'tool',
    path: `packages/${dirName}`,
    dependencies: ['zod'],
    status: 'unstable',
    documentation: `https://www.npmjs.com/package/${packageName}`,
    icon: `https://raw.githubusercontent.com/microfox-ai/microfox/refs/heads/main/logos/${dirName}.svg`,
    constructors: [],
    extraInfo: [],
    authType: 'none',
  };
}

async function createFixedFiles(destDir: string): Promise<void> {
  const tsConfigContent = `{
  "extends": "@microfox/tsconfig/ts-library.json",
  "include": ["."],
  "exclude": ["*/dist", "dist", "build", "node_modules"]
}`;

  const tsupConfigContent = `import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
  },
]);`;

  const turboJsonContent = `{
  "extends": [
    "//"
  ],
  "tasks": {
    "build": {
      "outputs": [
        "**/dist/**"
      ]
    }
  }
}`;

  const filesToCreate: Record<string, string> = {
    'tsconfig.json': tsConfigContent,
    'tsup.config.ts': tsupConfigContent,
    'turbo.json': turboJsonContent,
  };

  for (const [file, content] of Object.entries(filesToCreate)) {
    const destPath = path.join(destDir, file);
    fs.writeFileSync(destPath, content);
    console.log(`✅ Created ${file}`);
  }
}

async function kickstartPackage(packageName: string) {
  if (!packageName || !packageName.startsWith('@microfox/')) {
    console.error(
      '❌ Error: Invalid package name. It must be in the format "@microfox/package-name".',
    );
    process.exit(1);
  }

  const dirName = packageName.replace('@microfox/', '');
  const title = dirName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const description = `A Microfox SDK for ${title}.`;

  const packageDir = path.join(getProjectRoot(), 'packages', dirName);
  const srcDir = path.join(packageDir, 'src');
  const docsDir = path.join(packageDir, 'docs');
  const typesDir = path.join(srcDir, 'types');
  const schemasDir = path.join(srcDir, 'schemas');

  if (fs.existsSync(packageDir)) {
    console.error(
      `❌ Error: Package directory already exists at ${packageDir}`,
    );
    process.exit(1);
  }

  console.log(`🚀 Creating package ${packageName} at ${packageDir}`);

  // Create directories
  fs.mkdirSync(packageDir, { recursive: true });
  fs.mkdirSync(srcDir, { recursive: true });
  fs.mkdirSync(docsDir, { recursive: true });
  fs.mkdirSync(typesDir, { recursive: true });
  fs.mkdirSync(schemasDir, { recursive: true });
  console.log('✅ Created directories');

  // Create package.json
  const packageJson = createInitialPackageJson(packageName, description);
  fs.writeFileSync(
    path.join(packageDir, 'package.json'),
    JSON.stringify(packageJson, null, 2),
  );
  console.log('✅ Created package.json');

  // Create package-info.json
  const packageInfo = createInitialPackageInfo(packageName, title, description);
  fs.writeFileSync(
    path.join(packageDir, 'package-info.json'),
    JSON.stringify(packageInfo, null, 2),
  );
  console.log('✅ Created package-info.json');

  // Create README.md placeholder
  fs.writeFileSync(
    path.join(packageDir, 'README.md'),
    `# ${title}\n\n${description}\n`,
  );
  console.log('✅ Created README.md');

  // Create CHANGELOG.md placeholder
  fs.writeFileSync(path.join(packageDir, 'CHANGELOG.md'), `# Changelog\n`);
  console.log('✅ Created CHANGELOG.md');

  // Create placeholder files in src
  fs.writeFileSync(path.join(srcDir, 'index.ts'), `// exports\n`);
  fs.writeFileSync(
    path.join(srcDir, 'sdk.ts'),
    `// Main SDK class/functions\n`,
  );
  fs.writeFileSync(path.join(typesDir, 'index.ts'), '// Type definitions\n');
  fs.writeFileSync(
    path.join(schemasDir, 'index.ts'),
    '// Validation schemas\n',
  );
  console.log('✅ Created placeholder source files');

  // Create fixed files with predefined content
  await createFixedFiles(packageDir);

  console.log(`\n🎉 Successfully kickstarted package ${packageName}!`);
  console.log(`📍 Located at ${packageDir}`);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const packageName = args[0];

  if (!packageName) {
    console.error('❌ Error: Package name argument is required.');
    console.log('Usage: npm run kickstart:pkg @microfox/your-package-name');
    process.exit(1);
  }

  kickstartPackage(packageName).catch(error => {
    console.error('❌ Fatal error during package kickstart:', error);
    process.exit(1);
  });
}
