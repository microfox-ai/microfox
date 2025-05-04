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

export type SimplePriceResponse = Record<string, Record<string, number | null>>;

export interface CoinsListParams {
  include_platform?: boolean;
  status?: 'active' | 'inactive';
}

export interface CoinListItem {
  id: string;
  symbol: string;
  name: string;
  platforms: Record<string, string>;
}

export type CoinsListResponse = CoinListItem[];

export interface CoinsMarketsParams {
  vs_currency: string;
  ids?: string;
  category?: string;
  order?: string;
  per_page?: number;
  page?: number;
  sparkline?: boolean;
  price_change_percentage?: string;
}

export interface CoinsMarketsItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
}

export type CoinsMarketsResponse = CoinsMarketsItem[];
