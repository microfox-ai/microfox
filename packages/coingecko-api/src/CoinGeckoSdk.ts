import { z } from 'zod';
import {
  PingResponse,
  KeyUsageResponse,
  SimplePriceParams,
  SimplePriceResponse,
  CoinsListParams,
  CoinsListResponse,
  CoinsMarketsParams,
  CoinsMarketsResponse,
} from './types';
import {
  simplePriceParamsSchema,
  coinsListParamsSchema,
  coinsMarketsParamsSchema,
} from './schemas';

export class CoinGeckoSdk {
  private apiKey: string;
  private baseUrl: string = 'https://pro-api.coingecko.com/api/v3/';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'x-cg-pro-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async ping(): Promise<PingResponse> {
    return this.request<PingResponse>('ping');
  }

  async checkApiKeyUsage(): Promise<KeyUsageResponse> {
    return this.request<KeyUsageResponse>('key');
  }

  async simplePrice(params: SimplePriceParams): Promise<SimplePriceResponse> {
    const validatedParams = simplePriceParamsSchema.parse(params);
    return this.request<SimplePriceResponse>('simple/price', validatedParams);
  }

  async coinsList(params?: CoinsListParams): Promise<CoinsListResponse> {
    const validatedParams = coinsListParamsSchema.parse(params || {});
    return this.request<CoinsListResponse>('coins/list', validatedParams);
  }

  async coinsMarkets(params: CoinsMarketsParams): Promise<CoinsMarketsResponse> {
    const validatedParams = coinsMarketsParamsSchema.parse(params);
    return this.request<CoinsMarketsResponse>('coins/markets', validatedParams);
  }

  // Add other methods for remaining endpoints here
}

export function createCoinGeckoSDK(apiKey: string): CoinGeckoSdk {
  return new CoinGeckoSdk(apiKey);
}
