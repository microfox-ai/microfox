## CoinGecko Pro API (v3) TypeScript SDK Documentation

This document outlines the technical details of the CoinGecko Pro API (v3) for generating a TypeScript SDK.  This API requires a Pro API key, obtained through a paid CoinGecko subscription.  All requests should be made to `https://pro-api.coingecko.com/api/v3/`. On-chain DEX data (beta) endpoints are accessed via the `/onchain` path.

**Authentication:**

All Pro API endpoints require authentication using your Pro API key. The recommended approach is to include the key in the request header:

```typescript
const headers = {
  'x-cg-pro-api-key': 'YOUR_API_KEY',
};
```

Alternatively (less secure), you can use a query string parameter:

```
https://pro-api.coingecko.com/api/v3/ping?x_cg_pro_api_key=YOUR_API_KEY
```

**Rate Limiting:** Each API request consumes 1 credit.  Monthly credit limits are tied to your subscription plan.  Monitor usage via the developer dashboard.

**Endpoints:**

---

### **General**

#### Ping

* **Description:** Checks API server status.
* **Endpoint:** `/ping`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header)
* **Request Parameters:** None
* **Response:**
```typescript
interface PingResponse {
  gecko_says: string; // e.g., "(V3) To the Moon!"
}
```

#### Check API Key Usage

* **Description:** Checks your account's API usage.
* **Endpoint:** `/key`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header)
* **Request Parameters:** None
* **Response:**  _(Documentation lacks details. Inferring structure based on potential usage data)_
```typescript
interface KeyUsageResponse {
  usage: {
    current_month: number;
    limit: number;
  };
  // ... other potential usage details
}
```
**Edge Cases:**  The response structure for this endpoint is not explicitly defined in the documentation.  The SDK should handle potential variations in the response format.


#### Simple Price

* **Description:** Get the current price of one or more cryptocurrencies.
* **Endpoint:** `/simple/price`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header)
* **Request Parameters:**
```typescript
interface SimplePriceParams {
  vs_currencies: string; // Required. Comma-separated target currencies (e.g., "usd,eur,btc"). See /simple/supported_vs_currencies for options.
  ids?: string; // Coin IDs (comma-separated). See /coins/list.
  names?: string; // Coin names (comma-separated, URL-encoded spaces).
  symbols?: string; // Coin symbols (comma-separated).
  include_tokens?: 'all' | 'top'; // For symbol lookups. 'all' includes all matching tokens, 'top' (default) returns top-ranked. Max 50 symbols.
  include_market_cap?: boolean;
  include_24hr_vol?: boolean;
  include_24hr_change?: boolean;
  include_last_updated_at?: boolean;
  precision?: string; // Decimal places for price (e.g., "full", "2").
}
```
* **Response:**  A nested object where the keys are coin IDs and the values are objects containing price information in the requested `vs_currencies`.
```typescript
interface SimplePriceResponse {
  [coinId: string]: {
    [currency: string]: number; // Price in the specified currency
    [currency + "_market_cap"]?: number;
    [currency + "_24h_vol"]?: number;
    [currency + "_24h_change"]?: number;
    last_updated_at?: number; // UNIX timestamp
  };
}

```
**Edge Cases:**  Handle potential `null` values for `include_24hr_change` if the price is stale.  Priority order for lookup parameters: `ids` > `names` > `symbols`.  URL-encode spaces in coin names.  Limit of 50 symbols for `include_tokens=all`.


#### Simple Supported VS Currencies

* **Description:** List all supported fiat and cryptocurrencies that can be used in `vs_currency` parameter.
* **Endpoint:** `/simple/supported_vs_currencies`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header)
* **Request Parameters:** None
* **Response:**
```typescript
type SupportedVSCurrenciesResponse = string[]; // Array of currency codes (e.g., ["usd", "eur", "btc"])
```


#### Coins List (ID Map)

* **Description:**  List all supported coins with their IDs, names, and symbols.
* **Endpoint:** `/coins/list`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header)
* **Request Parameters:**
```typescript
interface CoinsListParams {
  include_platform?: boolean; // Include platform and contract addresses.
  status?: 'active' | 'inactive'; // Filter by coin status. Default: 'active'.
}

```
* **Response:**
```typescript
interface CoinListItem {
  id: string;
  symbol: string;
  name: string;
  platforms: { [platform: string]: string }; // Contract addresses per platform
}
type CoinsListResponse = CoinListItem[];
```
**Edge Cases:** No pagination needed.  Inactive coin IDs can be used with some historical data endpoints.



#### Coins Markets

* **Description:** List coins with market data (price, market cap, volume, etc.).
* **Endpoint:** `/coins/markets`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header)
* **Request Parameters:**  _(See documentation for full list and descriptions)_
```typescript
interface CoinsMarketsParams {
  vs_currency: string; // Required. Target currency.
  ids?: string; // Coin IDs (comma-separated).
  category?: string; // Filter by category. See /coins/categories/list.
  order?: 'market_cap_desc' | 'market_cap_asc' | 'volume_asc' | 'volume_desc' | 'id_asc' | 'id_desc';
  per_page?: number; // 1...250
  page?: number;
  sparkline?: boolean;
  price_change_percentage?: string; // Comma-separated timeframes (e.g., "1h,24h,7d").
  locale?: string; // e.g., "en", "es"
  precision?: string; // e.g., "full", "2"
  // ... other parameters
}
```
* **Response:**  _(See documentation for full list of fields)_
```typescript
interface CoinsMarketsItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  // ... many other fields
}
type CoinsMarketsResponse = CoinsMarketsItem[];

```
**Edge Cases:** Priority order for lookups: `category` > `ids` > `names` > `symbols`. URL-encode spaces in names. Limit of 50 symbols when `include_tokens=all`.



#### Coin Data by ID

* **Description:** Get detailed metadata and market data for a specific coin.
* **Endpoint:** `/coins/{id}`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header)
* **Path Parameters:**
```typescript
  id: string; // Coin ID. See /coins/list.
```
* **Request Parameters:** _(See documentation for full list and descriptions)_
```typescript
interface CoinDataParams {
  localization?: boolean; // Include localized languages. Default: true.
  tickers?: boolean; // Include tickers data. Default: true.
  market_data?: boolean; // Include market data. Default: true.
  community_data?: boolean; // Include community data. Default: true.
  developer_data?: boolean; // Include developer data. Default: true.
  sparkline?: boolean; // Include sparkline data. Default: false.
}

```
* **Response:** _(See documentation for the extensive list of fields and nested objects.  Create TypeScript interfaces to match.)_
```typescript
// Example partial interface:
interface CoinDataResponse {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: { [currency: string]: number };
    // ... other market data fields
  };
  // ... many other fields
}
```
**Edge Cases:**  Handle newline characters (`\r`) in descriptions.  Tickers are limited to 100; use `/coins/{id}/tickers` for more.  `twitter_followers` will be deprecated in May 2025.


#### Asset Platforms List (ID Map)

* **Description:** List all asset platforms (blockchain networks).
* **Endpoint:** `/asset_platforms`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header)
* **Request Parameters:**
```typescript
interface AssetPlatformsParams {
  filter?: 'nft'; // Filter for NFT-supporting platforms.
}
```
* **Response:**
```typescript
interface AssetPlatformItem {
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

type AssetPlatformsResponse = AssetPlatformItem[];

```


#### Coins Categories List (ID Map)

* **Description:** List all coin categories.
* **Endpoint:** `/coins/categories/list`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header)
* **Request Parameters:** None
* **Response:**
```typescript
interface CoinCategoryItem {
  category_id: string;
  name: string;
}
type CoinCategoriesListResponse = CoinCategoryItem[];
```
**Edge Cases:** CoinGecko categories are distinct from GeckoTerminal categories.


#### Exchanges List (ID Map)

* **Description:** List all exchanges with ID and name.
* **Endpoint:** `/exchanges/list`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header)
* **Request Parameters:**
```typescript
interface ExchangesListParams {
  status?: 'active' | 'inactive'; // Filter by exchange status. Default: 'active'.
}
```
* **Response:**
```typescript
interface ExchangeListItem {
  id: string;
  name: string;
}
type ExchangesListResponse = ExchangeListItem[];
```


#### NFTs List (ID Map)

* **Description:** List all supported NFTs with ID, contract address, name, platform ID, and symbol.
* **Endpoint:** `/nfts/list`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header)
* **Request Parameters:**  _(See documentation for descriptions)_
```typescript
interface NftsListParams {
  order?: 'h24_volume_usd_asc' | 'h24_volume_usd_desc' | /* ... other order options */;
  per_page?: number; // Total results per page.  1...250
  page?: number;
}
```
* **Response:**
```typescript
interface NftListItem {
  id: string;
  contract_address: string;
  name: string;
  asset_platform_id: string;
  symbol: string;
}
type NftsListResponse = NftListItem[];
```


#### BTC-to-Currency Exchange Rates

* **Description:** Get BTC exchange rates against other currencies.
* **Endpoint:** `/exchange_rates`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header)
* **Request Parameters:** None
* **Response:**
```typescript
interface ExchangeRateItem {
  name: string;
  unit: string;
  value: number;
  type: 'crypto' | 'fiat'; // inferred type
}
interface ExchangeRatesResponse {
  rates: { [currencyCode: string]: ExchangeRateItem };
}
```


#### Search Queries

* **Description:** Search for coins, categories, markets, and NFTs.
* **Endpoint:** `/search`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header)
* **Request Parameters:**
```typescript
interface SearchParams {
  query: string; // Required. Search query.
}
```
* **Response:** _(See documentation for full structure.  Create TypeScript interfaces for each type (coins, exchanges, categories, nfts).)_
```typescript
interface SearchResponse {
  coins: { /* ... */ }[];
  exchanges: { /* ... */ }[];
  icos: string[]; // ICO IDs
  categories: { /* ... */ }[];
  nfts: { /* ... */ }[];
}
```



#### Global DeFi Market Data

* **Description:** Get global decentralized finance (DeFi) market data.
* **Endpoint:** `/global/decentralized_finance_defi`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header)
* **Request Parameters:** None
* **Response:**
```typescript

interface GlobalDefiData {
  defi_market_cap: string; // represented as string in example
  eth_market_cap: string; // represented as string in example
  defi_to_eth_ratio: string; // represented as string in example
  trading_volume_24h: string; // represented as string in example
  defi_dominance: string; // represented as string in example
  top_coin_name: string;
  top_coin_defi_dominance: number;
}

interface GlobalDefiResponse {
  data: GlobalDefiData;
}
```
**Edge Cases:** Values in the response are represented as strings, even for numerical data. The SDK should handle appropriate type conversions if needed.



#### Public Companies Holdings

* **Description:** Get public companies' Bitcoin or Ethereum holdings.
* **Endpoint:** `/companies/public_treasury/{coin_id}`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header)
* **Path Parameters:**
```typescript
  coin_id: 'bitcoin' | 'ethereum';
```
* **Request Parameters:** None
* **Response:**
```typescript
interface CompanyHolding {
  name: string;
  symbol: string;
  country: string;
  total_holdings: number;
  total_entry_value_usd: number;
  total_current_value_usd: number;
  percentage_of_total_supply: number;
}

interface PublicCompaniesHoldingsResponse {
  total_holdings: number;
  total_value_usd: number;
  market_cap_dominance: number;
  companies: CompanyHolding[];
}
```


### **On-chain DEX (GeckoTerminal) - Beta**

_These endpoints are prefixed with `/onchain` and are part of the GeckoTerminal integration._

#### Supported Networks List (ID Map)

* **Description:** List supported networks on GeckoTerminal.
* **Endpoint:** `/onchain/networks`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header)
* **Request Parameters:**
```typescript
interface NetworksListParams {
  page?: number; // Page through results. Default: 1.
}
```
* **Response:**
```typescript
interface NetworkAttributes {
  name: string;
  coingecko_asset_platform_id: string;
}

interface NetworkItem {
  id: string;
  type: string;
  attributes: NetworkAttributes;
}

interface NetworksListResponse {
  data: NetworkItem[];
}
```



#### Supported Dexes List by Network (ID Map)

* **Description:** List supported DEXs on a specific network.
* **Endpoint:** `/onchain/networks/{network}/dexes`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header)
* **Path Parameters:**
```typescript
  network: string; // Network ID. See /onchain/networks.
```
* **Request Parameters:**
```typescript
interface DexesListParams {
  page?: number; // Page through results. Default: 1.
}
```
* **Response:**
```typescript
interface DexAttributes {
  name: string;
}
interface DexItem {
  id: string;
  type: string;
  attributes: DexAttributes;
}

interface DexesListResponse {
  data: DexItem[];
}
```


---


_(The remaining on-chain DEX endpoints and other endpoints not explicitly requested by the user have been omitted for brevity.  Follow the same structure as above to document them for the SDK. Pay close attention to request parameters, response structures, and any notes or tips in the original documentation.)_




This comprehensive summary provides a strong foundation for building a robust TypeScript SDK for the CoinGecko Pro API.  Remember to handle edge cases, data type conversions, and potential changes in the API as indicated in the original documentation and changelogs.  Thorough testing is essential to ensure the reliability and accuracy of the SDK.
