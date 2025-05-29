import { UsageSchema } from '@microfox/usage-tracker';
import { z } from 'zod';

export const UsageWithPricingSchema = z
  .object({
    priceUSD: z.number(),
    originalPriceUSD: z.number().optional(),
  })
  .and(UsageSchema);

export type UsageWithPricing = z.infer<typeof UsageWithPricingSchema>;
