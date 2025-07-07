import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import readlineSync from 'readline-sync';
import inquirer from 'inquirer';
import { PackageInfo } from '../types';
import { getWorkingDirectory } from '../utils/getProjectRoot';
import { checkPackageNameAndPrompt } from '../utils/npmChecker';

function createPackageJson(packageName: string, description: string): any {
  // Extract simple name from scoped package (e.g., @scope/name -> name)
  const simpleName = packageName.includes('/')
    ? packageName.split('/')[1]
    : packageName;

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
      test: 'vitest run',
      'test:watch': 'vitest',
    },
    exports: {
      './package.json': './package.json',
      '.': {
        import: './dist/index.mjs',
        require: './dist/index.js',
      },
    },
    dependencies: {
      zod: '^3.24.3',
    },
    devDependencies: {
      '@types/node': '^18',
      eslint: '^8.57.0',
      '@typescript-eslint/eslint-plugin': '^6.0.0',
      '@typescript-eslint/parser': '^6.0.0',
      prettier: '^3.0.0',
      tsup: '^8',
      typescript: '^5.6.3',
      vitest: '^1.0.0',
    },
    publishConfig: {
      access: 'public',
    },
    engines: {
      node: '>=18.0.0',
    },
    keywords: [simpleName, 'typescript', 'api', 'sdk'],
  };
}

function createPackageInfo(
  packageName: string,
  description: string,
): PackageInfo {
  const simpleName = packageName.includes('/')
    ? packageName.split('/')[1]
    : packageName;
  const titleName = simpleName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    name: packageName,
    title: `${titleName} TypeScript SDK`,
    description,
    platformType: 'tool',
    path: '.',
    dependencies: ['zod'],
    status: 'unstable',
    documentation: `https://www.npmjs.com/package/${packageName}`,
    icon: `https://via.placeholder.com/64x64.png?text=${simpleName.charAt(0).toUpperCase()}`,
    constructors: [],
    extraInfo: [],
    authType: 'none',
  };
}

async function createConfigFiles(
  destDir: string,
  packageName: string,
): Promise<void> {
  const simpleName = packageName.includes('/')
    ? packageName.split('/')[1]
    : packageName;

  const tsConfigContent = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}`;

  const tsupConfigContent = `import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
});`;

  const eslintConfigContent = `module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'error',
  },
};`;

  const prettierConfigContent = `{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}`;

  const vitestConfigContent = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
  },
});`;

  const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Coverage
coverage/
.nyc_output

# Runtime
.cache/
`;

  const filesToCreate: Record<string, string> = {
    'tsconfig.json': tsConfigContent,
    'tsup.config.ts': tsupConfigContent,
    '.eslintrc.js': eslintConfigContent,
    '.prettierrc': prettierConfigContent,
    'vitest.config.ts': vitestConfigContent,
    '.gitignore': gitignoreContent,
  };

  for (const [file, content] of Object.entries(filesToCreate)) {
    const destPath = path.join(destDir, file);
    fs.writeFileSync(destPath, content);
    console.log(chalk.green(`✅ Created ${file}`));
  }
}

async function createSourceFiles(
  srcDir: string,
  packageName: string,
): Promise<void> {
  const simpleName = packageName.includes('/')
    ? packageName.split('/')[1]
    : packageName;
  const className =
    simpleName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('') + 'Sdk';

  // Main index.ts
  const indexContent = `// Main exports for ${simpleName}
export { ${className} } from './${simpleName}Sdk';
export * from './types';
export * from './schemas';

// Example usage:
// import { ${className} } from '${packageName}';
// const sdk = new ${className}({ apiKey: 'your-key' });
`;

  // Main SDK file
  const sdkContent = `import { ${className}Config, ${className}Response } from './types';
import { ${className}ConfigSchema } from './schemas';

/**
 * ${className} - A TypeScript SDK template
 * 
 * @example
 * \`\`\`typescript
 * import { \${className} } from '${packageName}';
 * 
 * const sdk = new \${className}({
 *   apiKey: 'your-api-key',
 *   baseUrl: 'https://api.example.com'
 * });
 * 
 * const result = await sdk.hello('World');
 * console.log(result.data);
 * \`\`\`
 */
export class ${className} {
  private config: ${className}Config;

  /**
   * Create a new ${className} instance
   * 
   * @param config - Configuration for the SDK
   */
  constructor(config: ${className}Config) {
    // Validate configuration using Zod schema
    this.config = ${className}ConfigSchema.parse(config);
  }

  /**
   * Get current configuration
   * 
   * @returns Copy of the current config
   */
  getConfig(): ${className}Config {
    return { ...this.config };
  }

  /**
   * Example hello method - replace with your own methods
   * 
   * @param name - Name to greet
   * @returns Promise with greeting response
   */
  async hello(name: string): Promise<${className}Response<string>> {
    return {
      data: \`Hello, \${name}! Welcome to \${this.config.name || '${simpleName}'} SDK.\`,
      success: true,
      status: 200,
      message: 'Success'
    };
  }

  // TODO: Add your SDK methods here
  // Example:
  // async getData(id: string): Promise<${className}Response<any>> {
  //   // Your implementation
  // }
  
  // async createItem(data: any): Promise<${className}Response<any>> {
  //   // Your implementation  
  // }
}


`;

  // Types index.ts
  const typesIndexContent = `// Type definitions for ${simpleName} SDK

/**
 * Configuration options for the ${className}
 */
export interface ${className}Config {
  /** API key for authentication */
  apiKey: string;
  /** Base URL for the API (optional) */
  baseUrl?: string;
  /** SDK name identifier (optional) */
  name?: string;
  /** API version to use (optional) */
  version?: string;
}

/**
 * Standard response format for all SDK methods
 */
export interface ${className}Response<T = any> {
  /** The response data */
  data: T;
  /** Whether the request was successful */
  success: boolean;
  /** HTTP status code */
  status: number;
  /** Response message */
  message: string;
  /** Error object if the request failed */
  error?: Error;
}

// TODO: Define your own types here
// Example:
// export interface User {
//   id: string;
//   name: string;
//   email: string;
// }

// export interface ApiResponse<T> {
//   data: T;
//   pagination?: {
//     total: number;
//     page: number;
//     limit: number;
//   };
// }
`;

  // Schemas index.ts
  const schemasIndexContent = `import { z } from 'zod';

// Zod schemas for ${simpleName} SDK validation

/**
 * Schema for ${className} configuration validation
 */
export const ${className}ConfigSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  baseUrl: z.string().url().optional(),
  name: z.string().optional(),
  version: z.string().optional(),
});

/**
 * Schema for API response validation
 */
export const ${className}ResponseSchema = z.object({
  data: z.any(),
  success: z.boolean(),
  status: z.number(),
  message: z.string(),
  error: z.instanceof(Error).optional(),
});

// TODO: Add your validation schemas here
// Example:
// export const UserSchema = z.object({
//   id: z.string(),
//   name: z.string().min(1, 'Name is required'),
//   email: z.string().email('Invalid email format')
// });

// export const CreateUserSchema = z.object({
//   name: z.string().min(1, 'Name is required'),
//   email: z.string().email('Invalid email format')
// });
`;

  // Test file
  const testContent = `import { describe, it, expect, beforeEach } from 'vitest';
import { ${className} } from '../${simpleName}Sdk';
import type { ${className}Config } from '../types';

describe('${className}', () => {
  let config: ${className}Config;

  beforeEach(() => {
    config = {
      apiKey: 'test-api-key',
      baseUrl: 'https://api.test.com',
      name: '${simpleName}',
      version: '1.0.0',
    };
  });

  describe('Constructor', () => {
    it('should create an instance with valid config', () => {
      const sdk = new ${className}(config);
      expect(sdk).toBeInstanceOf(${className});
    });

    it('should throw error with invalid config', () => {
      const invalidConfig = { ...config, apiKey: '' };
      expect(() => new ${className}(invalidConfig)).toThrow();
    });
  });

  describe('Hello Method', () => {
    it('should return a successful greeting response', async () => {
      const sdk = new ${className}(config);
      const result = await sdk.hello('World');
      
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toContain('Hello, World!');
      expect(result.message).toBe('Success');
    });
  });

  // TODO: Add your own tests here
  // Example:
  // describe('Your API Method', () => {
  //   it('should do something', async () => {
  //     const sdk = new ${className}(config);
  //     // Your test implementation
  //   });
  // });
});
`;

  const filesToCreate: Record<string, string> = {
    'index.ts': indexContent,
    [`${simpleName}Sdk.ts`]: sdkContent,
    'types/index.ts': typesIndexContent,
    'schemas/index.ts': schemasIndexContent,
    [`__tests__/${simpleName}.test.ts`]: testContent,
  };

  for (const [file, content] of Object.entries(filesToCreate)) {
    const destPath = path.join(srcDir, file);
    const dir = path.dirname(destPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(destPath, content);
    console.log(chalk.green(`✅ Created src/${file}`));
  }
}

async function createAgentProject(agentName: string): Promise<void> {
  const workingDir = getWorkingDirectory();
  const agentDir = path.join(workingDir, agentName);

  if (fs.existsSync(agentDir)) {
    throw new Error(`Directory already exists at ${agentDir}`);
  }

  console.log(
    chalk.blue(
      `🚀 Creating agent ${chalk.bold(agentName)} at ${agentDir}\n`,
    ),
  );

  fs.mkdirSync(agentDir, { recursive: true });

  const templatePath = path.resolve(__dirname, 'agent-template.txt');
  const templateContent = fs.readFileSync(templatePath, 'utf-8');

  const fileSections = templateContent.split('--- filename: ').slice(1);

  for (const section of fileSections) {
    const lines = section.split('\n');
    const filePath = lines.shift()!.trim();
    const content = lines.join('\n').replace(/<%= agentName %>/g, agentName);
    
    const destPath = path.join(agentDir, filePath);
    const destDir = path.dirname(destPath);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.writeFileSync(destPath, content);
    console.log(chalk.green(`✅ Created ${filePath}`));
  }
}

async function createPackageProject(packageName: string): Promise<void> {
    const simpleName = packageName.includes('/')
    ? packageName.split('/')[1]
    : packageName;
    const titleName = simpleName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    const description = `A TypeScript SDK for ${titleName}.`;
    const className = simpleName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('') + 'Sdk';

    const workingDir = getWorkingDirectory();
    const packageDir = path.join(workingDir, simpleName);

    if (fs.existsSync(packageDir)) {
        throw new Error(`Directory already exists at ${packageDir}`);
    }

    console.log(
        chalk.blue(
        `🚀 Creating package ${chalk.bold(packageName)} at ${packageDir}\n`,
        ),
    );
    
    fs.mkdirSync(packageDir, { recursive: true });

    const templatePath = path.resolve(__dirname, 'package-template.txt');
    const templateContent = fs.readFileSync(templatePath, 'utf-8');

    const fileSections = templateContent.split('--- filename: ').slice(1);

    for (const section of fileSections) {
        const lines = section.split('\n');
        const filePath = lines.shift()!.trim().replace(/<%= simpleName %>/g, simpleName);
        let content = lines.join('\n');

        content = content.replace(/<%= packageName %>/g, packageName);
        content = content.replace(/<%= simpleName %>/g, simpleName);
        content = content.replace(/<%= titleName %>/g, titleName);
        content = content.replace(/<%= description %>/g, description);
        content = content.replace(/<%= className %>/g, className);

        const destPath = path.join(packageDir, filePath);
        const destDir = path.dirname(destPath);

        if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        }

        fs.writeFileSync(destPath, content);
        console.log(chalk.green(`✅ Created ${filePath}`));
    }

    const docsDir = path.join(packageDir, 'docs');
    const docsConstructors = path.join(docsDir, 'constructors');
    const docsFunctions = path.join(docsDir, 'functions');

    fs.mkdirSync(docsDir, { recursive: true });
    fs.mkdirSync(docsConstructors, { recursive: true });
    fs.mkdirSync(docsFunctions, { recursive: true });
}

export async function kickstartCommand(): Promise<void> {
  console.log(chalk.cyan("🚀 Let's kickstart your new project!\n"));

  const { boilerplateType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'boilerplateType',
      message: 'Select boilerplate type:',
      choices: ['package', 'agent'],
    },
  ]);

  if (!boilerplateType) {
    console.log(chalk.yellow('Operation cancelled.'));
    return;
  }

  if (boilerplateType === 'agent') {
    const agentName = readlineSync.question(
      chalk.yellow('📦 Enter agent name: '),
    );

    if (!agentName.trim()) {
      throw new Error('Agent name cannot be empty');
    }
    await createAgentProject(agentName.trim());

    console.log(
        chalk.green(
          `\n🎉 Successfully created agent ${chalk.bold(agentName)}!`,
        ),
      );
      console.log(chalk.gray(`📍 Located at ${path.join(getWorkingDirectory(), agentName)}`));
      console.log(chalk.yellow('\n💡 Next steps:'));
      console.log(chalk.yellow(`   1. cd ${agentName}`));
      console.log(chalk.yellow('   2. npm install'));
      console.log(chalk.yellow('   3. Configure your env.json'));
      console.log(chalk.yellow('   4. npm run dev'));
      console.log(chalk.yellow('   5. Start developing your agent!'));

  } else if (boilerplateType === 'package') {
    // Ask for package name interactively
    const packageName = readlineSync.question(
      chalk.yellow('📦 Enter package name: '),
    );

    if (!packageName.trim()) {
      throw new Error('Package name cannot be empty');
    }

    // Check npm availability and get final package name
    const finalPackageName = await checkPackageNameAndPrompt(packageName.trim());
    await createPackageProject(finalPackageName);

    const simpleName = finalPackageName.includes('/')
    ? finalPackageName.split('/')[1]
    : finalPackageName;

    console.log(
      chalk.green(
        `\n🎉 Successfully created package ${chalk.bold(finalPackageName)}!`,
      ),
    );
    console.log(chalk.gray(`📍 Located at ${path.join(getWorkingDirectory(), simpleName)}`));
    console.log(chalk.yellow('\n💡 Next steps:'));
    console.log(chalk.yellow(`   1. cd ${simpleName}`));
    console.log(chalk.yellow('   2. npm install'));
    console.log(chalk.yellow('   3. npm run build'));
    console.log(chalk.yellow('   4. npm test'));
    console.log(chalk.yellow('   5. Start developing your SDK!'));
    console.log(
      chalk.gray(
        `\n📚 Your package is ready to be published to npm as "${finalPackageName}"`,
      ),
    );
  } else {
    console.log(chalk.red('Invalid boilerplate type selected. Please choose "package" or "agent".'));
  }
}
