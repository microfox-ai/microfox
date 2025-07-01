import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { PackageInfo } from '../types';
import { getWorkingDirectory } from '../utils/getProjectRoot';
import { checkPackageNameAndPrompt } from '../utils/npmChecker';

function createPackageJson(
  packageName: string,
  description: string,
): any {
  // Extract simple name from scoped package (e.g., @scope/name -> name)
  const simpleName = packageName.includes('/') ? packageName.split('/')[1] : packageName;
  
  return {
    name: packageName,
    version: "1.0.0",
    description,
    main: "./dist/index.js",
    module: "./dist/index.mjs",
    types: "./dist/index.d.ts",
    files: [
      "dist/**/*",
      "CHANGELOG.md"
    ],
    scripts: {
      build: "tsup",
      "build:watch": "tsup --watch",
      clean: "rm -rf dist",
      lint: "eslint \"./**/*.ts*\"",
      "prettier-check": "prettier --check \"./**/*.ts*\"",
      test: "vitest run",
      "test:watch": "vitest"
    },
    exports: {
      "./package.json": "./package.json",
      ".": {
        import: "./dist/index.mjs",
        require: "./dist/index.js"
      }
    },
    dependencies: {
      zod: "^3.24.3"
    },
    devDependencies: {
      "@types/node": "^18",
      eslint: "^8.57.0",
      "@typescript-eslint/eslint-plugin": "^6.0.0",
      "@typescript-eslint/parser": "^6.0.0",
      prettier: "^3.0.0",
      tsup: "^8",
      typescript: "^5.6.3",
      vitest: "^1.0.0"
    },
    publishConfig: {
      access: "public"
    },
    engines: {
      node: ">=18.0.0"
    },
    keywords: [
      simpleName,
      "typescript",
      "api",
      "sdk"
    ]
  };
}

function createPackageInfo(
  packageName: string,
  description: string,
): PackageInfo {
  const simpleName = packageName.includes('/') ? packageName.split('/')[1] : packageName;
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
    authType: 'none'
  };
}

async function createConfigFiles(destDir: string, packageName: string): Promise<void> {
  const simpleName = packageName.includes('/') ? packageName.split('/')[1] : packageName;
  
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

async function createSourceFiles(srcDir: string, packageName: string): Promise<void> {
  const simpleName = packageName.includes('/') ? packageName.split('/')[1] : packageName;
  const className = simpleName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('') + 'Sdk';

  // Main index.ts
  const indexContent = `export { ${className} } from './${simpleName}Sdk';
export * from './types';
export * from './schemas';
`;

  // Main SDK file
  const sdkContent = `import { ${className}Config, ${className}Response, ApiOptions } from './types';
import { ${className}ConfigSchema } from './schemas';

/**
 * ${className} SDK - A comprehensive TypeScript SDK
 * 
 * @example
 * \`\`\`typescript
 * import { \${className} } from '${packageName}';
 * 
 * const sdk = new \${className}({
 *   apiKey: 'your-api-key',
 *   baseUrl: 'https://api.example.com',
 *   timeout: 5000
 * });
 * 
 * // Get user information
 * const user = await sdk.getUser('user123');
 * 
 * // Create a new resource
 * const result = await sdk.createResource({
 *   name: 'My Resource',
 *   description: 'A sample resource'
 * });
 * \`\`\`
 */
export class ${className} {
  private config: ${className}Config;
  private baseUrl: string;

  /**
   * Creates a new ${className} instance
   * 
   * @param config - Configuration options for the SDK
   * @throws {Error} If the configuration is invalid
   */
  constructor(config: ${className}Config) {
    const validatedConfig = ${className}ConfigSchema.parse(config);
    this.config = validatedConfig;
    this.baseUrl = config.baseUrl || 'https://api.example.com';
  }

  /**
   * Get the current SDK configuration
   * 
   * @returns A copy of the current configuration
   */
  getConfig(): ${className}Config {
    return { ...this.config };
  }

  /**
   * Make a generic API request
   * 
   * @param endpoint - The API endpoint to call
   * @param options - Request options
   * @returns Promise with the API response
   * 
   * @example
   * \`\`\`typescript
   * const response = await sdk.request('/users/123', {
   *   method: 'GET',
   *   headers: { 'X-Custom-Header': 'value' }
   * });
   * \`\`\`
   */
  async request<T = any>(
    endpoint: string, 
    options: ApiOptions = {}
  ): Promise<${className}Response<T>> {
    const { method = 'GET', headers = {}, body, timeout = this.config.timeout } = options;
    
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const controller = new AbortController();
    const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : null;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${this.config.apiKey}\`,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(\`API Error: \${response.status} - \${data.message || 'Unknown error'}\`);
      }

      return {
        data,
        success: true,
        status: response.status,
        message: 'Request successful'
      };
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      
      return {
        data: null,
        success: false,
        status: 0,
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error instanceof Error ? error : new Error('Unknown error')
      };
    }
  }

  /**
   * Get user information by ID
   * 
   * @param userId - The user ID to retrieve
   * @returns Promise with user data
   * 
   * @example
   * \`\`\`typescript
   * const user = await sdk.getUser('user123');
   * if (user.success) {
   *   console.log('User name:', user.data.name);
   * }
   * \`\`\`
   */
  async getUser(userId: string): Promise<${className}Response<any>> {
    return this.request(\`/users/\${userId}\`);
  }

  /**
   * Create a new resource
   * 
   * @param data - The resource data to create
   * @returns Promise with creation result
   * 
   * @example
   * \`\`\`typescript
   * const result = await sdk.createResource({
   *   name: 'My Resource',
   *   description: 'A sample resource'
   * });
   * \`\`\`
   */
  async createResource(data: Record<string, any>): Promise<${className}Response<any>> {
    return this.request('/resources', {
      method: 'POST',
      body: data
    });
  }

  /**
   * Update an existing resource
   * 
   * @param resourceId - The resource ID to update
   * @param data - The updated resource data
   * @returns Promise with update result
   */
  async updateResource(
    resourceId: string, 
    data: Record<string, any>
  ): Promise<${className}Response<any>> {
    return this.request(\`/resources/\${resourceId}\`, {
      method: 'PUT',
      body: data
    });
  }

  /**
   * Delete a resource
   * 
   * @param resourceId - The resource ID to delete
   * @returns Promise with deletion result
   */
  async deleteResource(resourceId: string): Promise<${className}Response<any>> {
    return this.request(\`/resources/\${resourceId}\`, {
      method: 'DELETE'
    });
  }

  /**
   * List resources with optional filtering
   * 
   * @param filters - Optional filters for the resource list
   * @returns Promise with list of resources
   * 
   * @example
   * \`\`\`typescript
   * const resources = await sdk.listResources({
   *   limit: 10,
   *   offset: 0,
   *   search: 'example'
   * });
   * \`\`\`
   */
  async listResources(filters: Record<string, any> = {}): Promise<${className}Response<any[]>> {
    const query = new URLSearchParams(filters).toString();
    const endpoint = query ? \`/resources?\${query}\` : '/resources';
    return this.request(endpoint);
  }

  /**
   * Hello world example method
   * 
   * @param name - Name to greet
   * @returns Promise with greeting message
   * 
   * @example
   * \`\`\`typescript
   * const greeting = await sdk.hello('World');
   * console.log(greeting.data); // "Hello, World! This is my-package SDK."
   * \`\`\`
   */
  async hello(name: string): Promise<${className}Response<string>> {
    return {
      data: \`Hello, \${name}! This is \${this.config.name || '${simpleName}'} SDK.\`,
      success: true,
      status: 200,
      message: 'Greeting generated successfully'
    };
  }
}


`;

  // Types index.ts
  const typesIndexContent = `/**
 * Configuration options for the ${className}
 */
export interface ${className}Config {
  /** API key for authentication */
  apiKey: string;
  /** Base URL for the API (optional, defaults to https://api.example.com) */
  baseUrl?: string;
  /** Request timeout in milliseconds (optional, defaults to 5000) */
  timeout?: number;
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

/**
 * Options for API requests
 */
export interface ApiOptions {
  /** HTTP method (default: GET) */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** Additional headers to include */
  headers?: Record<string, string>;
  /** Request body data */
  body?: any;
  /** Request timeout in milliseconds */
  timeout?: number;
}

/**
 * User data structure
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Resource data structure
 */
export interface Resource {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

/**
 * List response with pagination
 */
export interface ListResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// Add your other types here
`;

  // Schemas index.ts
  const schemasIndexContent = `import { z } from 'zod';

/**
 * Schema for ${className} configuration validation
 */
export const ${className}ConfigSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  baseUrl: z.string().url().optional(),
  timeout: z.number().positive().optional(),
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

/**
 * Schema for API request options
 */
export const ApiOptionsSchema = z.object({
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).optional(),
  headers: z.record(z.string()).optional(),
  body: z.any().optional(),
  timeout: z.number().positive().optional(),
});

/**
 * Schema for User data validation
 */
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * Schema for Resource data validation
 */
export const ResourceSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Resource name is required'),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  ownerId: z.string(),
});

/**
 * Schema for list response validation
 */
export const ListResponseSchema = <T>(itemSchema: z.ZodSchema<T>) => z.object({
  items: z.array(itemSchema),
  total: z.number().nonnegative(),
  limit: z.number().positive(),
  offset: z.number().nonnegative(),
  hasMore: z.boolean(),
});

// Add your other Zod schemas here
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
      timeout: 5000,
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

    it('should use default baseUrl when not provided', () => {
      const configWithoutUrl = { ...config };
      delete configWithoutUrl.baseUrl;
      const sdk = new ${className}(configWithoutUrl);
      expect(sdk).toBeInstanceOf(${className});
    });
  });

      describe('Configuration', () => {
    it('should return config', () => {
      const sdk = new ${className}(config);
      const returnedConfig = sdk.getConfig();
      expect(returnedConfig).toEqual(config);
      expect(returnedConfig).not.toBe(config); // Should be a copy
    });
  });

      describe('Hello Method', () => {
    it('should return a successful greeting response', async () => {
      const sdk = new ${className}(config);
      const result = await sdk.hello('World');
      
      expect(result.success).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toBe('Hello, World! This is ${simpleName} SDK.');
      expect(result.message).toBe('Greeting generated successfully');
    });

    it('should use config name in greeting', async () => {
      const sdk = new ${className}(config);
      const result = await sdk.hello('Test');
      expect(result.data).toContain(config.name);
    });

    it('should fallback to package name when config.name is not provided', async () => {
      const configWithoutName = { ...config };
      delete configWithoutName.name;
      const sdk = new ${className}(configWithoutName);
      const result = await sdk.hello('Test');
      expect(result.data).toContain('${simpleName}');
    });
  });

  describe('API Methods', () => {
    let sdk: ${className};

    beforeEach(() => {
      sdk = new ${className}(config);
    });

    // Note: These tests would require mocking fetch in a real implementation
    it('should have getUser method', () => {
      expect(typeof sdk.getUser).toBe('function');
    });

    it('should have createResource method', () => {
      expect(typeof sdk.createResource).toBe('function');
    });

    it('should have updateResource method', () => {
      expect(typeof sdk.updateResource).toBe('function');
    });

    it('should have deleteResource method', () => {
      expect(typeof sdk.deleteResource).toBe('function');
    });

    it('should have listResources method', () => {
      expect(typeof sdk.listResources).toBe('function');
    });

    it('should have request method', () => {
      expect(typeof sdk.request).toBe('function');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing required fields', () => {
      expect(() => new ${className}({} as ${className}Config)).toThrow();
    });

    it('should validate API key requirement', () => {
      const invalidConfig = { ...config, apiKey: '' };
      expect(() => new ${className}(invalidConfig)).toThrow('API key is required');
    });
  });
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

export async function initCommand(packageName: string): Promise<void> {
  // Check npm availability and get final package name
  const finalPackageName = await checkPackageNameAndPrompt(packageName);
  
  const simpleName = finalPackageName.includes('/') ? finalPackageName.split('/')[1] : finalPackageName;
  const titleName = simpleName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const description = `A TypeScript SDK for ${titleName}.`;

  const workingDir = getWorkingDirectory();
  const packageDir = path.join(workingDir, simpleName);
  const srcDir = path.join(packageDir, 'src');
  const docsDir = path.join(packageDir, 'docs');

  if (fs.existsSync(packageDir)) {
    throw new Error(
      `Directory already exists at ${packageDir}`
    );
  }

  console.log(chalk.blue(`🚀 Creating package ${chalk.bold(finalPackageName)} at ${packageDir}\n`));

  // Create directories
  fs.mkdirSync(packageDir, { recursive: true });
  fs.mkdirSync(srcDir, { recursive: true });
  fs.mkdirSync(docsDir, { recursive: true });
  console.log(chalk.green('✅ Created directories'));

  // Create package.json
  const packageJson = createPackageJson(finalPackageName, description);
  fs.writeFileSync(
    path.join(packageDir, 'package.json'),
    JSON.stringify(packageJson, null, 2),
  );
  console.log(chalk.green('✅ Created package.json'));

  // Create package-info.json
  const packageInfo = createPackageInfo(finalPackageName, description);
  fs.writeFileSync(
    path.join(packageDir, 'package-info.json'),
    JSON.stringify(packageInfo, null, 2),
  );
  console.log(chalk.green('✅ Created package-info.json'));

  // Create README.md
  const readmeContent = `# ${titleName}

${description}

## Installation

\`\`\`bash
npm install ${finalPackageName}
\`\`\`

## Quick Start

\`\`\`typescript
import { \${className} } from '${packageName}';

// Initialize the SDK
const sdk = new \${className}({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.example.com', // optional
  timeout: 5000, // optional, default 5000ms
});

// Example: Get user information
const user = await sdk.getUser('user123');
if (user.success) {
  console.log('User:', user.data);
} else {
  console.error('Error:', user.message);
}

// Example: Create a resource
const newResource = await sdk.createResource({
  name: 'My Resource',
  description: 'A sample resource'
});
\`\`\`

## Configuration

The SDK requires a configuration object with the following properties:

### Required

- \`apiKey\` (string): Your API key for authentication

### Optional

- \`baseUrl\` (string): Base URL for the API (default: 'https://api.example.com')
- \`timeout\` (number): Request timeout in milliseconds (default: 5000)
- \`name\` (string): SDK name identifier
- \`version\` (string): API version to use

## API Reference

### Core Methods

#### \`request<T>(endpoint: string, options?: ApiOptions): Promise<\${className}Response<T>>\`

Make a generic API request to any endpoint.

\`\`\`typescript
const response = await sdk.request('/custom-endpoint', {
  method: 'POST',
  body: { key: 'value' },
  headers: { 'X-Custom-Header': 'value' }
});
\`\`\`

### User Management

#### \`getUser(userId: string): Promise<\${className}Response<User>>\`

Retrieve user information by ID.

\`\`\`typescript
const user = await sdk.getUser('user123');
\`\`\`

### Resource Management

#### \`createResource(data: Record<string, any>): Promise<\${className}Response<Resource>>\`

Create a new resource.

\`\`\`typescript
const resource = await sdk.createResource({
  name: 'My Resource',
  description: 'Resource description'
});
\`\`\`

#### \`updateResource(resourceId: string, data: Record<string, any>): Promise<\${className}Response<Resource>>\`

Update an existing resource.

\`\`\`typescript
const updated = await sdk.updateResource('resource123', {
  name: 'Updated Name'
});
\`\`\`

#### \`deleteResource(resourceId: string): Promise<\${className}Response<any>>\`

Delete a resource by ID.

\`\`\`typescript
const result = await sdk.deleteResource('resource123');
\`\`\`

#### \`listResources(filters?: Record<string, any>): Promise<\${className}Response<Resource[]>>\`

List resources with optional filtering.

\`\`\`typescript
const resources = await sdk.listResources({
  limit: 10,
  offset: 0,
  search: 'example'
});
\`\`\`

### Utility Methods

#### \`hello(name: string): Promise<\${className}Response<string>>\`

Example greeting method for testing.

\`\`\`typescript
const greeting = await sdk.hello('World');
console.log(greeting.data); // "Hello, World! This is ${simpleName} SDK."
\`\`\`

#### \`getConfig(): \${className}Config\`

Get the current SDK configuration.

\`\`\`typescript
const config = sdk.getConfig();
\`\`\`

## Response Format

All SDK methods return a standardized response format:

\`\`\`typescript
interface \${className}Response<T> {
  data: T;           // The actual response data
  success: boolean;  // Whether the request was successful
  status: number;    // HTTP status code
  message: string;   // Response message
  error?: Error;     // Error object (only present on failure)
}
\`\`\`

## Error Handling

The SDK provides comprehensive error handling:

\`\`\`typescript
const result = await sdk.getUser('invalid-id');

if (!result.success) {
  console.error('Request failed:', result.message);
  if (result.error) {
    console.error('Error details:', result.error);
  }
}
\`\`\`

## TypeScript Support

This SDK is written in TypeScript and provides full type definitions:

\`\`\`typescript
import type { \${className}Config, \${className}Response, User, Resource } from '${packageName}';
\`\`\`

## Alternative Import

You can import the SDK class directly:

\`\`\`typescript
import { \${className} } from '${packageName}';

const sdk = new \${className}({
  apiKey: 'your-api-key'
});
\`\`\`

## Development

\`\`\`bash
# Install dependencies
npm install

# Build the package
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Check code formatting
npm run prettier-check

# Build and test together
npm run build && npm test
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

MIT

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed history of changes.
`;

  fs.writeFileSync(path.join(packageDir, 'README.md'), readmeContent);
  console.log(chalk.green('✅ Created README.md'));

  // Create CHANGELOG.md
  const changelogContent = `# Changelog

## [1.0.0] - ${new Date().toISOString().split('T')[0]}

### Added
- Initial release of ${titleName}
- Basic SDK structure and configuration
- Example hello method
- TypeScript support with full type definitions
- Comprehensive test suite
- Modern build system with tsup
- ESLint and Prettier configuration
`;

  fs.writeFileSync(path.join(packageDir, 'CHANGELOG.md'), changelogContent);
  console.log(chalk.green('✅ Created CHANGELOG.md'));

  // Create source files
  await createSourceFiles(srcDir, finalPackageName);

  // Create configuration files
  await createConfigFiles(packageDir, finalPackageName);

  console.log(chalk.green(`\n🎉 Successfully created package ${chalk.bold(finalPackageName)}!`));
  console.log(chalk.gray(`📍 Located at ${packageDir}`));
  console.log(chalk.yellow('\n💡 Next steps:'));
  console.log(chalk.yellow(`   1. cd ${simpleName}`));
  console.log(chalk.yellow('   2. npm install'));
  console.log(chalk.yellow('   3. npm run build'));
  console.log(chalk.yellow('   4. npm test'));
  console.log(chalk.yellow('   5. Start developing your SDK!'));
  console.log(chalk.gray(`\n📚 Your package is ready to be published to npm as "${finalPackageName}"`));
} 