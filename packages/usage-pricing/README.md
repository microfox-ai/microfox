# @microfox/usage-pricing

This package contains pricing configurations for various AI providers and services used in the Microfox platform.

## Usage

```typescript
import { OpenAIPricingConfig } from '@microfox/usage-pricing';

// Access pricing configurations
const openAIPricing = OpenAIPricingConfig['ai-provider-openai'];
```

## Structure

The package is organized by provider, with each provider having its own pricing configuration file in the `src/pricing` directory.

## Adding New Pricing Configurations

To add a new pricing configuration:

1. Create a new file in `src/pricing` for the provider
2. Export the configuration from the file
3. Add the export to `src/index.ts`
