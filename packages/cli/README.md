# @microfox/cli

Universal CLI tool for creating modern TypeScript packages with comprehensive SDK templates, npm availability checking, and professional tooling setup.

## Installation

### Via npx (Recommended)

```bash
npx @microfox/cli kickstart
```

### Global Installation

```bash
npm install -g @microfox/cli
microfox kickstart
```

## Usage

### Kickstart a New Package

```bash
npx @microfox/cli kickstart
```

This command will:
- **Ask for a package name** interactively
- **Check npm availability** for the package name  
- **Prompt for a new name** if the package already exists
- Create a complete package directory structure
- Set up modern TypeScript configuration
- Generate minimal code templates with examples
- Create a basic test suite with Vitest
- Set up ESLint and Prettier for code quality
- Configure modern build system with tsup

### Package Name Format

The CLI accepts any valid npm package name:
- Simple names: `my-awesome-package`
- Scoped packages: `@myorg/my-awesome-package`

### Features

✅ **Interactive Package Creation** - Asks for package name during setup  
✅ **NPM Availability Checking** - Automatically checks if your package name is available  
✅ **Interactive Name Selection** - Prompts for alternatives if name is taken  
✅ **Modern TypeScript Setup** - Full TypeScript configuration with strict mode  
✅ **Minimal Code Templates** - Simple SDK structure with commented examples  
✅ **Basic Test Suite** - Vitest configuration with example tests  
✅ **Code Quality Tools** - ESLint and Prettier pre-configured  
✅ **Professional Structure** - Based on popular open-source packages  
✅ **Simple Documentation** - Auto-generated README with minimal examples  
✅ **Modern Build System** - tsup for fast, modern bundling  
✅ **Git Ready** - Includes .gitignore and proper file structure

## Commands

- `kickstart` - Kickstart a new TypeScript SDK package with modern tooling

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

// Example hello method (replace with your own methods)
const result = await sdk.hello('World');
console.log(result.data); // "Hello, World! Welcome to my-package SDK."

// TODO: Add your own SDK methods
// const data = await sdk.getData('123');
// const created = await sdk.createItem({ name: 'Example' });
```

## License

MIT 