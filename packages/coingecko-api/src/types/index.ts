import { z } from 'zod';

export interface PingResponse {
  gecko_says: string;
}

export interface KeyUsageResponse {
  usage: {
    current_month: number;
    limit: number;
  };
}

export interface SimplePriceParams {
  vs_currencies: string;
  ids?: string;
  names?: string;
  symbols?: string;
  include_tokens?: 'all' | 'top';
  include_market_cap?: boolean;
  include_24hr_vol?: boolean;
  include_24hr_change?: boolean;
  include_last_updated_at?: boolean;
  precision?: string;
}

export interface SimplePriceResponse {
  [coinId: string]: {
    [currency: string]: number;
    [key: `${string}_market_cap`]: number;
    [key: `${string}_24h_vol`]: number;
    [key: `${string}_24h_change`]: number;
    last_updated_at?: number;
  };
}

export type SupportedVSCurrenciesResponse = string[];

export interface CoinsListParams {
  include_platform?: boolean;
  status?: 'active' | 'inactive';
}

export interface CoinListItem {
  id: string;
  symbol: string;
  name: string;
  platforms: { [platform: string]: string };
}

export type CoinsListResponse = CoinListItem[];

export interface CoinsMarketsParams {
  vs_currency: string;
  ids?: string;
  category?: string;
  order?: 'market_cap_desc' | 'market_cap_asc' | 'volume_asc' | 'volume_desc' | 'id_asc' | 'id_desc';
  per_page?: number;
  page?: number;
  sparkline?: boolean;
  price_change_percentage?: string;
  locale?: string;
  precision?: string;
}

export interface CoinsMarketsItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  [key: string]: any;
}

export type CoinsMarketsResponse = CoinsMarketsItem[];

export interface CoinDataParams {
  localization?: boolean;
  tickers?: boolean;
  market_data?: boolean;
  community_data?: boolean;
  developer_data?: boolean;
  sparkline?: boolean;
}

export interface CoinDataResponse {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: { [currency: string]: number };
    [key: string]: any;
  };
  [key: string]: any;
}

export interface AssetPlatformsParams {
  filter?: 'nft';
}

export interface AssetPlatformItem {
  id: string;
  chain_identifier: number | null;
  name: string;
  shortname: string;
  native_coin_id: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
}

export type AssetPlatformsResponse = AssetPlatformItem[];

export interface CoinCategoryItem {
  category_id: string;
  name: string;
}

export type CoinCategoriesListResponse = CoinCategoryItem[];

export interface ExchangesListParams {
  status?: 'active' | 'inactive';
}

export interface ExchangeListItem {
  id: string;
  name: string;
}

export type ExchangesListResponse = ExchangeListItem[];

export interface NftsListParams {
  order?: 'h24_volume_usd_asc' | 'h24_volume_usd_desc' | string;
  per_page?: number;
  page?: number;
}

export interface NftListItem {
  id: string;
  contract_address: string;
  name: string;
  asset_platform_id: string;
  symbol: string;
}

export type NftsListResponse = NftListItem[];

export interface ExchangeRateItem {
  name: string;
  unit: string;
  value: number;
  type: 'crypto' | 'fiat';
}

export interface ExchangeRatesResponse {
  rates: { [currencyCode: string]: ExchangeRateItem };
}

export interface SearchParams {
  query: string;
}

export interface SearchResponse {
  coins: any[];
  exchanges: any[];
  icos: string[];
  categories: any[];
  nfts: any[];
}

export interface GlobalDefiData {
  defi_market_cap: string;
  eth_market_cap: string;
  defi_to_eth_ratio: string;
  trading_volume_24h: string;
  defi_dominance: string;
  top_coin_name: string;
  top_coin_defi_dominance: number;
}

export interface GlobalDefiResponse {
  data: GlobalDefiData;
}

export interface CompanyHolding {
  name: string;
  symbol: string;
  country: string;
  total_holdings: number;
  total_entry_value_usd: number;
  total_current_value_usd: number;
  percentage_of_total_supply: number;
}

export interface PublicCompaniesHoldingsResponse {
  total_holdings: number;
  total_value_usd: number;
  market_cap_dominance: number;
  companies: CompanyHolding[];
}

export interface NetworksListParams {
  page?: number;
}

export interface NetworkAttributes {
  name: string;
  coingecko_asset_platform_id: string;
}

export interface NetworkItem {
  id: string;
  type: string;
  attributes: NetworkAttributes;
}

export interface NetworksListResponse {
  data: NetworkItem[];
}

export interface DexesListParams {
  page?: number;
}

export interface DexAttributes {
  name: string;
}

export interface DexItem {
  id: string;
  type: string;
  attributes: DexAttributes;
}

export interface DexesListResponse {
  data: DexItem[];
}
