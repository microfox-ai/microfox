import { z } from 'zod';

export const simplePriceParamsSchema = z.object({
  vs_currencies: z.string().describe('Required comma-separated currency codes (e.g., "usd,eur")'),
  ids: z.string().optional().describe('Comma-separated coin IDs'),
  names: z.string().optional().describe('Comma-separated coin names (URL-encoded spaces)'),
  symbols: z.string().optional().describe('Comma-separated coin symbols'),
  include_tokens: z.enum(['all', 'top']).optional().describe('For symbol lookup, defaults to "top"'),
  include_market_cap: z.boolean().optional().describe('Include market cap data'),
  include_24hr_vol: z.boolean().optional().describe('Include 24-hour volume data'),
  include_24hr_change: z.boolean().optional().describe('Include 24-hour price change data'),
  include_last_updated_at: z.boolean().optional().describe('Include last updated timestamp'),
  precision: z.union([z.literal('full'), z.number().int().min(0).max(18)]).optional().describe('"full" or number of decimal places (0-18)'),
});

export const coinsListParamsSchema = z.object({
  include_platform: z.boolean().optional().describe('Include platform contract addresses'),
  status: z.enum(['active', 'inactive']).optional().describe('Filter by coin status, defaults to "active"'),
});

export const coinsMarketsParamsSchema = z.object({
  vs_currency: z.string().describe('Required target currency of market data (usd, eur, jpy, etc.)'),
  ids: z.string().optional().describe('Comma-separated coin IDs'),
  category: z.string().optional().describe('Filter by coin category'),
  order: z.string().optional().describe('Sort results by field (market_cap_desc, gecko_desc, gecko_asc, market_cap_asc, market_cap_desc, volume_asc, volume_desc, id_asc, id_desc)'),
  per_page: z.number().int().min(1).max(250).optional().describe('Total results per page'),
  page: z.number().int().min(1).optional().describe('Page through results'),
  sparkline: z.boolean().optional().describe('Include sparkline 7 days data'),
  price_change_percentage: z.string().optional().describe('Include price change percentage in 1h, 24h, 7d, 14d, 30d, 200d, 1y (eg. "1h,24h,7d" to include 1h, 24h, 7d price change)'),
});
