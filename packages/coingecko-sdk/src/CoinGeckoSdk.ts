import { z } from 'zod';
import {
  PingResponse,
  UsageResponse,
  SimplePriceResponse,
  CoinListEntry,
  CoinsMarketsResponse,
  CoinGeckoSDKOptions,
  SimplePriceParams,
  CoinsListParams,
  CoinsMarketsParams,
} from './types';
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
} from './schemas';

const BASE_URL = 'https://pro-api.coingecko.com/api/v3';

export class CoinGeckoSDK {
  private apiKey: string;

  constructor(options: CoinGeckoSDKOptions) {
    const validatedOptions = sdkOptionsSchema.parse(options);
    this.apiKey = validatedOptions.apiKey;
  }

  private async request<T>(
    endpoint: string,
    params: Record<string, string | number | boolean> = {},
    schema: z.ZodType<T>
  ): Promise<T> {
    const url = new URL(`${BASE_URL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        'x-cg-pro-api-key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return schema.parse(data);
  }

  async ping(): Promise<PingResponse> {
    return this.request<PingResponse>('/ping', {}, pingResponseSchema);
  }

  async checkApiUsage(): Promise<UsageResponse> {
    return this.request<UsageResponse>('/key', {}, usageResponseSchema);
  }

  async getSimplePrice(params: SimplePriceParams): Promise<SimplePriceResponse> {
    const validatedParams = simplePriceParamsSchema.parse(params);
    return this.request<SimplePriceResponse>('/simple/price', validatedParams, simplePriceResponseSchema);
  }

  async getCoinsList(params?: CoinsListParams): Promise<CoinListEntry[]> {
    const validatedParams = coinsListParamsSchema.parse(params || {});
    return this.request<CoinListEntry[]>('/coins/list', validatedParams, z.array(coinListEntrySchema));
  }

  async getCoinsMarkets(params: CoinsMarketsParams): Promise<CoinsMarketsResponse[]> {
    const validatedParams = coinsMarketsParamsSchema.parse(params);
    return this.request<CoinsMarketsResponse[]>('/coins/markets', validatedParams, z.array(coinsMarketsResponseSchema));
  }
}

export function createCoinGeckoSDK(options: CoinGeckoSDKOptions): CoinGeckoSDK {
  return new CoinGeckoSDK(options);
}
