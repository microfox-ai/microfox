## 🛠️ Development

### Commands

- `npm run build` - Build all packages
- `npm run build -- --filter=@microfox/whatsapp-business` - Build only 1 packages
- `npm run test` - Run tests across all packages
- `npm run lint` - Run ESLint across all packages
- `npm run clean` - Clean all build outputs
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
microfox/
├── packages/           # Core packages
├── examples/          # Example projects
├── scripts/            # All coding agents live here
└── package.json      # Root package.json
```

Each package in the `packages` directory:

- Is published under the `@microfox` scope
- Has its own documentation
- Follows our standard development practices
