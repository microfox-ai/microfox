import { UsageSchema } from '@microfox/usage-tracker';
import { z } from 'zod';

export const UsageWithPricingSchema = z
  .object({
    priceUSD: z.number(),
    timestamp: z.string(),
  })
  .and(UsageSchema);

export type UsageWithPricing = z.infer<typeof UsageWithPricingSchema>;
