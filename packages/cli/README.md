# @microfox/cli

Universal CLI tool for creating modern TypeScript packages with comprehensive SDK templates, npm availability checking, and professional tooling setup.

## Installation

### Via npx (Recommended)

```bash
npx @microfox/cli init my-awesome-package
# or for scoped packages
npx @microfox/cli init @myorg/my-awesome-package
```

### Global Installation

```bash
npm install -g @microfox/cli
microfox init my-awesome-package
```

## Usage

### Initialize a New Package

```bash
npx @microfox/cli init package-name
```

This command will:
- **Check npm availability** for the package name
- **Prompt for a new name** if the package already exists
- Create a complete package directory structure
- Set up modern TypeScript configuration
- Generate comprehensive documentation and examples
- Create a full test suite with Vitest
- Set up ESLint and Prettier for code quality
- Configure modern build system with tsup

### Package Name Format

Package names can be:
- Simple names: `my-awesome-package`
- Scoped packages: `@myorg/my-awesome-package`
- Any valid npm package name

### Features

✅ **NPM Availability Checking** - Automatically checks if your package name is available  
✅ **Interactive Name Selection** - Prompts for alternatives if name is taken  
✅ **Modern TypeScript Setup** - Full TypeScript configuration with strict mode  
✅ **Complete Test Suite** - Vitest configuration with example tests  
✅ **Code Quality Tools** - ESLint and Prettier pre-configured  
✅ **Professional Structure** - Based on popular open-source packages  
✅ **Comprehensive Documentation** - Auto-generated README with examples  
✅ **Modern Build System** - tsup for fast, modern bundling  
✅ **Git Ready** - Includes .gitignore and proper file structure

## Commands

- `init <packageName>` - Initialize a new TypeScript package with modern tooling

## What Gets Created

When you run the CLI, it creates a complete package with:

```
my-package/
├── src/
│   ├── index.ts              # Main exports
│   ├── myPackageSdk.ts       # Main SDK class
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   ├── schemas/
│   │   └── index.ts          # Zod validation schemas
│   └── __tests__/
│       └── myPackage.test.ts # Comprehensive tests
├── docs/                     # Documentation directory
├── package.json              # Modern package configuration
├── package-info.json         # Package metadata
├── tsconfig.json             # TypeScript configuration
├── tsup.config.ts            # Build configuration
├── vitest.config.ts          # Test configuration
├── .eslintrc.js              # Linting rules
├── .prettierrc               # Code formatting
├── .gitignore                # Git ignore rules
├── README.md                 # Comprehensive documentation
└── CHANGELOG.md              # Version history
```

## Example Usage

After creating a package:

```typescript
import { MyPackageSdk } from 'my-package';

const sdk = new MyPackageSdk({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.example.com'
});

// Built-in CRUD operations
const user = await sdk.getUser('user123');
const resource = await sdk.createResource({ name: 'Test' });
await sdk.deleteResource('id');

// Example hello method
const result = await sdk.hello('World');
console.log(result.data); // "Hello, World! This is my-package SDK."
```

## License

MIT 