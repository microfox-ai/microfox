import { z } from 'zod';
import {
  PingResponse,
  KeyUsageResponse,
  SimplePriceParams,
  SimplePriceResponse,
  SupportedVSCurrenciesResponse,
  CoinsListParams,
  CoinsListResponse,
  CoinsMarketsParams,
  CoinsMarketsResponse,
  CoinDataParams,
  CoinDataResponse,
  AssetPlatformsParams,
  AssetPlatformsResponse,
  CoinCategoriesListResponse,
  ExchangesListParams,
  ExchangesListResponse,
  NftsListParams,
  NftsListResponse,
  ExchangeRatesResponse,
  SearchParams,
  SearchResponse,
  GlobalDefiResponse,
  PublicCompaniesHoldingsResponse,
  NetworksListParams,
  NetworksListResponse,
  DexesListParams,
  DexesListResponse,
} from './types';

const BASE_URL = 'https://pro-api.coingecko.com/api/v3';

export interface CoinGeckoSDKOptions {
  apiKey?: string;
}

export class CoinGeckoSDK {
  private apiKey: string;

  constructor(options: CoinGeckoSDKOptions = {}) {
    this.apiKey = options.apiKey || process.env.COINGECKO_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('CoinGecko API key is required. Please provide it in the constructor or set the COINGECKO_API_KEY environment variable.');
    }
  }

  private async request<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        'x-cg-pro-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async ping(): Promise<PingResponse> {
    return this.request<PingResponse>('/ping');
  }

  async checkApiKeyUsage(): Promise<KeyUsageResponse> {
    return this.request<KeyUsageResponse>('/key');
  }

  async getSimplePrice(params: SimplePriceParams): Promise<SimplePriceResponse> {
    return this.request<SimplePriceResponse>('/simple/price', params);
  }

  async getSupportedVsCurrencies(): Promise<SupportedVSCurrenciesResponse> {
    return this.request<SupportedVSCurrenciesResponse>('/simple/supported_vs_currencies');
  }

  async getCoinsList(params?: CoinsListParams): Promise<CoinsListResponse> {
    return this.request<CoinsListResponse>('/coins/list', params);
  }

  async getCoinsMarkets(params: CoinsMarketsParams): Promise<CoinsMarketsResponse> {
    return this.request<CoinsMarketsResponse>('/coins/markets', params);
  }

  async getCoinData(id: string, params?: CoinDataParams): Promise<CoinDataResponse> {
    return this.request<CoinDataResponse>(`/coins/${id}`, params);
  }

  async getAssetPlatforms(params?: AssetPlatformsParams): Promise<AssetPlatformsResponse> {
    return this.request<AssetPlatformsResponse>('/asset_platforms', params);
  }

  async getCoinCategoriesList(): Promise<CoinCategoriesListResponse> {
    return this.request<CoinCategoriesListResponse>('/coins/categories/list');
  }

  async getExchangesList(params?: ExchangesListParams): Promise<ExchangesListResponse> {
    return this.request<ExchangesListResponse>('/exchanges/list', params);
  }

  async getNftsList(params?: NftsListParams): Promise<NftsListResponse> {
    return this.request<NftsListResponse>('/nfts/list', params);
  }

  async getExchangeRates(): Promise<ExchangeRatesResponse> {
    return this.request<ExchangeRatesResponse>('/exchange_rates');
  }

  async search(params: SearchParams): Promise<SearchResponse> {
    return this.request<SearchResponse>('/search', params);
  }

  async getGlobalDefiData(): Promise<GlobalDefiResponse> {
    return this.request<GlobalDefiResponse>('/global/decentralized_finance_defi');
  }

  async getPublicCompaniesHoldings(coinId: 'bitcoin' | 'ethereum'): Promise<PublicCompaniesHoldingsResponse> {
    return this.request<PublicCompaniesHoldingsResponse>(`/companies/public_treasury/${coinId}`);
  }

  async getNetworksList(params?: NetworksListParams): Promise<NetworksListResponse> {
    return this.request<NetworksListResponse>('/onchain/networks', params);
  }

  async getDexesList(network: string, params?: DexesListParams): Promise<DexesListResponse> {
    return this.request<DexesListResponse>(`/onchain/networks/${network}/dexes`, params);
  }
}

export function createCoinGeckoSDK(options?: CoinGeckoSDKOptions): CoinGeckoSDK {
  return new CoinGeckoSDK(options);
}
