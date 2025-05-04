import { z } from 'zod';
import {
  pingResponseSchema,
  usageResponseSchema,
  simplePriceResponseSchema,
  coinListEntrySchema,
  coinsMarketsResponseSchema,
  sdkOptionsSchema,
  simplePriceParamsSchema,
  coinsListParamsSchema,
  coinsMarketsParamsSchema,
} from '../schemas';

export type PingResponse = z.infer<typeof pingResponseSchema>;

export type UsageResponse = z.infer<typeof usageResponseSchema>;

export type SimplePriceResponse = z.infer<typeof simplePriceResponseSchema>;

export type CoinListEntry = z.infer<typeof coinListEntrySchema>;

export type CoinsMarketsResponse = z.infer<typeof coinsMarketsResponseSchema>;

export type CoinGeckoSDKOptions = z.infer<typeof sdkOptionsSchema>;

export type SimplePriceParams = z.infer<typeof simplePriceParamsSchema>;

export type CoinsListParams = z.infer<typeof coinsListParamsSchema>;

export type CoinsMarketsParams = z.infer<typeof coinsMarketsParamsSchema>;
