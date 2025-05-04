import { z } from 'zod';

export const pingResponseSchema = z.object({
  gecko_says: z.string().describe('API server status message'),
});

export const usageResponseSchema = z.object({
  // This schema needs to be updated based on actual API response
  status: z.string().describe('API usage status'),
  data: z.object({
    credits_used: z.number().describe('Number of credits used'),
    credits_remaining: z.number().describe('Number of credits remaining'),
  }),
});

export const simplePriceResponseSchema = z.record(
  z.string(),
  z.record(
    z.string(),
    z.union([z.number(), z.undefined()])
  )
).describe('Simple price response for one or more coins');

export const coinListEntrySchema = z.object({
  id: z.string().describe('Coin ID'),
  symbol: z.string().describe('Coin symbol'),
  name: z.string().describe('Coin name'),
  platforms: z.record(z.string(), z.string()).optional().describe('Contract addresses for various platforms'),
});

export const coinsMarketsResponseSchema = z.object({
  id: z.string().describe('Coin ID'),
  symbol: z.string().describe('Coin symbol'),
  name: z.string().describe('Coin name'),
  image: z.string().describe('Coin image URL'),
  current_price: z.number().describe('Current price of the coin'),
  market_cap: z.number().describe('Market capitalization of the coin'),
  market_cap_rank: z.number().describe('Market cap rank'),
  fully_diluted_valuation: z.number().nullable().describe('Fully diluted valuation'),
  total_volume: z.number().describe('Total volume'),
  high_24h: z.number().describe('Highest price in last 24 hours'),
  low_24h: z.number().describe('Lowest price in last 24 hours'),
  price_change_24h: z.number().describe('Price change in last 24 hours'),
  price_change_percentage_24h: z.number().describe('Price change percentage in last 24 hours'),
  market_cap_change_24h: z.number().describe('Market cap change in last 24 hours'),
  market_cap_change_percentage_24h: z.number().describe('Market cap change percentage in last 24 hours'),
  circulating_supply: z.number().describe('Circulating supply of the coin'),
  total_supply: z.number().nullable().describe('Total supply of the coin'),
  max_supply: z.number().nullable().describe('Maximum supply of the coin'),
  ath: z.number().describe('All-time high price'),
  ath_change_percentage: z.number().describe('All-time high change percentage'),
  ath_date: z.string().describe('All-time high date'),
  atl: z.number().describe('All-time low price'),
  atl_change_percentage: z.number().describe('All-time low change percentage'),
  atl_date: z.string().describe('All-time low date'),
  roi: z.object({
    times: z.number().describe('Return on investment multiplier'),
    currency: z.string().describe('Base currency of ROI'),
    percentage: z.number().describe('ROI percentage'),
  }).nullable().describe('Return on investment data'),
  last_updated: z.string().describe('Last updated timestamp'),
  sparkline_in_7d: z.object({
    price: z.array(z.number()).describe('Price data points for sparkline'),
  }).optional().describe('7-day sparkline data'),
  price_change_percentage_1h_in_currency: z.number().optional().describe('1-hour price change percentage'),
  price_change_percentage_24h_in_currency: z.number().optional().describe('24-hour price change percentage'),
  price_change_percentage_7d_in_currency: z.number().optional().describe('7-day price change percentage'),
});

export const sdkOptionsSchema = z.object({
  apiKey: z.string().describe('CoinGecko Pro API key'),
});

export const simplePriceParamsSchema = z.object({
  vs_currencies: z.string().describe('Comma-separated target currencies'),
  ids: z.string().optional().describe('Comma-separated coin IDs'),
  names: z.string().optional().describe('Comma-separated coin names'),
  symbols: z.string().optional().describe('Comma-separated coin symbols'),
  include_tokens: z.enum(['all', 'top']).optional().describe('Include all matching tokens or only top tokens'),
  include_market_cap: z.boolean().optional().describe('Include market cap'),
  include_24hr_vol: z.boolean().optional().describe('Include 24hr volume'),
  include_24hr_change: z.boolean().optional().describe('Include 24hr change'),
  include_last_updated_at: z.boolean().optional().describe('Include last updated time'),
  precision: z.union([z.literal('full'), z.string()]).optional().describe('Decimal places for price'),
});

export const coinsListParamsSchema = z.object({
  include_platform: z.boolean().optional().describe('Include platform and contract addresses'),
  status: z.enum(['active', 'inactive']).optional().describe('Filter by coin status'),
});

export const coinsMarketsParamsSchema = z.object({
  vs_currency: z.string().describe('Target currency'),
  ids: z.string().optional().describe('Comma-separated coin IDs'),
  category: z.string().optional().describe('Filter by category'),
  order: z.string().optional().describe('Sort order'),
  per_page: z.number().min(1).max(250).optional().describe('Results per page'),
  page: z.number().min(1).optional().describe('Page number'),
  sparkline: z.boolean().optional().describe('Include 7-day sparkline data'),
  price_change_percentage: z.string().optional().describe('Comma-separated price change percentage timeframes'),
  locale: z.string().optional().describe('Language'),
  precision: z.union([z.literal('full'), z.string()]).optional().describe('Decimal places for price'),
});
