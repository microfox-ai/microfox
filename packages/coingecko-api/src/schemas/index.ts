import { z } from 'zod';

export const PingResponseSchema = z.object({
  gecko_says: z.string().describe('Response message from the CoinGecko API'),
});

export const KeyUsageResponseSchema = z.object({
  usage: z.object({
    current_month: z.number().describe('Current month API usage'),
    limit: z.number().describe('API usage limit'),
  }),
});

export const SimplePriceParamsSchema = z.object({
  vs_currencies: z.string().describe('Comma-separated target currencies'),
  ids: z.string().optional().describe('Comma-separated coin IDs'),
  names: z.string().optional().describe('Comma-separated coin names'),
  symbols: z.string().optional().describe('Comma-separated coin symbols'),
  include_tokens: z.enum(['all', 'top']).optional().describe('Include all tokens or only top-ranked'),
  include_market_cap: z.boolean().optional().describe('Include market cap data'),
  include_24hr_vol: z.boolean().optional().describe('Include 24-hour volume data'),
  include_24hr_change: z.boolean().optional().describe('Include 24-hour price change data'),
  include_last_updated_at: z.boolean().optional().describe('Include last updated timestamp'),
  precision: z.string().optional().describe('Decimal places for price'),
});

export const SimplePriceResponseSchema = z.record(z.record(z.number().or(z.string())));

export const SupportedVSCurrenciesResponseSchema = z.array(z.string());

export const CoinsListParamsSchema = z.object({
  include_platform: z.boolean().optional().describe('Include platform and contract addresses'),
  status: z.enum(['active', 'inactive']).optional().describe('Filter by coin status'),
});

export const CoinListItemSchema = z.object({
  id: z.string().describe('Coin ID'),
  symbol: z.string().describe('Coin symbol'),
  name: z.string().describe('Coin name'),
  platforms: z.record(z.string()).describe('Contract addresses per platform'),
});

export const CoinsListResponseSchema = z.array(CoinListItemSchema);

export const CoinsMarketsParamsSchema = z.object({
  vs_currency: z.string().describe('Target currency'),
  ids: z.string().optional().describe('Comma-separated coin IDs'),
  category: z.string().optional().describe('Filter by category'),
  order: z.enum(['market_cap_desc', 'market_cap_asc', 'volume_asc', 'volume_desc', 'id_asc', 'id_desc']).optional().describe('Sort order'),
  per_page: z.number().min(1).max(250).optional().describe('Number of results per page'),
  page: z.number().optional().describe('Page number'),
  sparkline: z.boolean().optional().describe('Include sparkline data'),
  price_change_percentage: z.string().optional().describe('Comma-separated price change timeframes'),
  locale: z.string().optional().describe('Localization language'),
  precision: z.string().optional().describe('Decimal places for price'),
});

export const CoinsMarketsItemSchema = z.object({
  id: z.string().describe('Coin ID'),
  symbol: z.string().describe('Coin symbol'),
  name: z.string().describe('Coin name'),
  image: z.string().describe('Coin image URL'),
  current_price: z.number().describe('Current price'),
  market_cap: z.number().describe('Market capitalization'),
}).catchall(z.unknown());

export const CoinsMarketsResponseSchema = z.array(CoinsMarketsItemSchema);

export const CoinDataParamsSchema = z.object({
  localization: z.boolean().optional().describe('Include localized languages'),
  tickers: z.boolean().optional().describe('Include tickers data'),
  market_data: z.boolean().optional().describe('Include market data'),
  community_data: z.boolean().optional().describe('Include community data'),
  developer_data: z.boolean().optional().describe('Include developer data'),
  sparkline: z.boolean().optional().describe('Include sparkline data'),
});

export const CoinDataResponseSchema = z.object({
  id: z.string().describe('Coin ID'),
  symbol: z.string().describe('Coin symbol'),
  name: z.string().describe('Coin name'),
  market_data: z.object({
    current_price: z.record(z.number()).describe('Current price in various currencies'),
  }).catchall(z.unknown()).describe('Market data'),
}).catchall(z.unknown());

export const AssetPlatformsParamsSchema = z.object({
  filter: z.enum(['nft']).optional().describe('Filter for NFT-supporting platforms'),
});

export const AssetPlatformItemSchema = z.object({
  id: z.string().describe('Platform ID'),
  chain_identifier: z.number().nullable().describe('Chain identifier'),
  name: z.string().describe('Platform name'),
  shortname: z.string().describe('Platform short name'),
  native_coin_id: z.string().describe('Native coin ID'),
  image: z.object({
    thumb: z.string().describe('Thumbnail image URL'),
    small: z.string().describe('Small image URL'),
    large: z.string().describe('Large image URL'),
  }).describe('Platform images'),
});

export const AssetPlatformsResponseSchema = z.array(AssetPlatformItemSchema);

export const CoinCategoryItemSchema = z.object({
  category_id: z.string().describe('Category ID'),
  name: z.string().describe('Category name'),
});

export const CoinCategoriesListResponseSchema = z.array(CoinCategoryItemSchema);

export const ExchangesListParamsSchema = z.object({
  status: z.enum(['active', 'inactive']).optional().describe('Filter by exchange status'),
});

export const ExchangeListItemSchema = z.object({
  id: z.string().describe('Exchange ID'),
  name: z.string().describe('Exchange name'),
});

export const ExchangesListResponseSchema = z.array(ExchangeListItemSchema);

export const NftsListParamsSchema = z.object({
  order: z.string().optional().describe('Sort order'),
  per_page: z.number().min(1).max(250).optional().describe('Number of results per page'),
  page: z.number().optional().describe('Page number'),
});

export const NftListItemSchema = z.object({
  id: z.string().describe('NFT ID'),
  contract_address: z.string().describe('NFT contract address'),
  name: z.string().describe('NFT name'),
  asset_platform_id: z.string().describe('Asset platform ID'),
  symbol: z.string().describe('NFT symbol'),
});

export const NftsListResponseSchema = z.array(NftListItemSchema);

export const ExchangeRateItemSchema = z.object({
  name: z.string().describe('Currency name'),
  unit: z.string().describe('Currency unit'),
  value: z.number().describe('Exchange rate value'),
  type: z.enum(['crypto', 'fiat']).describe('Currency type'),
});

export const ExchangeRatesResponseSchema = z.object({
  rates: z.record(ExchangeRateItemSchema).describe('Exchange rates'),
});

export const SearchParamsSchema = z.object({
  query: z.string().describe('Search query'),
});

export const SearchResponseSchema = z.object({
  coins: z.array(z.unknown()).describe('Matching coins'),
  exchanges: z.array(z.unknown()).describe('Matching exchanges'),
  icos: z.array(z.string()).describe('Matching ICO IDs'),
  categories: z.array(z.unknown()).describe('Matching categories'),
  nfts: z.array(z.unknown()).describe('Matching NFTs'),
});

export const GlobalDefiDataSchema = z.object({
  defi_market_cap: z.string().describe('DeFi market capitalization'),
  eth_market_cap: z.string().describe('Ethereum market capitalization'),
  defi_to_eth_ratio: z.string().describe('DeFi to Ethereum ratio'),
  trading_volume_24h: z.string().describe('24-hour trading volume'),
  defi_dominance: z.string().describe('DeFi dominance'),
  top_coin_name: z.string().describe('Top DeFi coin name'),
  top_coin_defi_dominance: z.number().describe('Top DeFi coin dominance'),
});

export const GlobalDefiResponseSchema = z.object({
  data: GlobalDefiDataSchema.describe('Global DeFi data'),
});

export const CompanyHoldingSchema = z.object({
  name: z.string().describe('Company name'),
  symbol: z.string().describe('Company symbol'),
  country: z.string().describe('Company country'),
  total_holdings: z.number().describe('Total holdings'),
  total_entry_value_usd: z.number().describe('Total entry value in USD'),
  total_current_value_usd: z.number().describe('Total current value in USD'),
  percentage_of_total_supply: z.number().describe('Percentage of total supply'),
});

export const PublicCompaniesHoldingsResponseSchema = z.object({
  total_holdings: z.number().describe('Total holdings'),
  total_value_usd: z.number().describe('Total value in USD'),
  market_cap_dominance: z.number().describe('Market cap dominance'),
  companies: z.array(CompanyHoldingSchema).describe('List of companies'),
});

export const NetworksListParamsSchema = z.object({
  page: z.number().optional().describe('Page number'),
});

export const NetworkAttributesSchema = z.object({
  name: z.string().describe('Network name'),
  coingecko_asset_platform_id: z.string().describe('CoinGecko asset platform ID'),
});

export const NetworkItemSchema = z.object({
  id: z.string().describe('Network ID'),
  type: z.string().describe('Item type'),
  attributes: NetworkAttributesSchema.describe('Network attributes'),
});

export const NetworksListResponseSchema = z.object({
  data: z.array(NetworkItemSchema).describe('List of networks'),
});

export const DexesListParamsSchema = z.object({
  page: z.number().optional().describe('Page number'),
});

export const DexAttributesSchema = z.object({
  name: z.string().describe('DEX name'),
});

export const DexItemSchema = z.object({
  id: z.string().describe('DEX ID'),
  type: z.string().describe('Item type'),
  attributes: DexAttributesSchema.describe('DEX attributes'),
});

export const DexesListResponseSchema = z.object({
  data: z.array(DexItemSchema).describe('List of DEXes'),
});
