import { UsageSchema } from '@microfox/usage-tracker';
import { z } from 'zod';

export const UsageWithPricingSchema = z
  .object({
    priceUSD: z.number(),
    originalPriceUSD: z.number().optional(),
  })
  .and(UsageSchema);

export type UsageWithPricing = z.infer<typeof UsageWithPricingSchema>;

export interface AIPricingConfig {
  provider: string;
  models: {
    [modelName: string]: {
      contextLength: number;
      maxOutput: number;
      pricing: {
        standard: {
          inputCacheHit: number;
          inputCacheMiss: number;
          output: number;
        };
        discount: {
          inputCacheHit: number;
          inputCacheMiss: number;
          output: number;
        };
        discountHours: {
          start: string;
          end: string;
        };
      };
      features: {
        jsonOutput: boolean;
        functionCalling: boolean;
        chatPrefixCompletion: boolean;
        fimCompletion: boolean;
      };
    };
  };
}
