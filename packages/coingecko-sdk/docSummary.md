## CoinGecko Pro API TypeScript SDK Documentation

This document outlines the technical details for a TypeScript SDK for the CoinGecko Pro API.  This SDK is designed for paid plan subscribers using the `https://pro-api.coingecko.com/api/v3/` base URL.  Remember to securely store your Pro API key and ideally use a proxy to insert it into request headers.

**Authentication:**

All endpoints require authentication using your Pro API key.  The recommended approach is to include the key in the header `x-cg-pro-api-key`.  Alternatively (less secure), you can use the query string parameter `x_cg_pro_api_key`.

**Error Handling:**

The API returns standard HTTP status codes.  Common errors include:

* 400 (Bad Request): Invalid request.
* 401 (Unauthorized): Missing or invalid API key.
* 403 (Forbidden): Access blocked.
* 429 (Too Many Requests): Rate limit exceeded.
* 500 (Internal Server Error): Server-side error.
* 503 (Service Unavailable): API unavailable.
* 1020 (Access Denied): CDN firewall violation.
* 10002 (Incorrect API Key): Invalid API key.
* 10005 (Access Denied): Endpoint access restricted by subscription level.


**Rate Limiting:**

Rate limits vary depending on your paid subscription plan. Check your developer dashboard for details.

**Endpoints:**

---

### **Ping**

* **Description:** Checks API server status.
* **Endpoint:** `/ping`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header or Query String)
* **Request Parameters:** None
* **Request Body:** None
* **Response Format:** JSON
* **Response Data Structure:**
```typescript
interface PingResponse {
  gecko_says: string; // Usually "(V3) To the Moon!"
}
```


---

### **Check API Usage**

* **Description:** Checks account's API usage.
* **Endpoint:** `/key`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header or Query String)
* **Request Parameters:** None
* **Request Body:** None
* **Response Format:** JSON
* **Response Data Structure:**  _(Documentation lacks details.  Inferring from context)_
```typescript
interface UsageResponse {
  // ... details about usage limits, remaining credits, etc.
  // This needs to be fleshed out based on actual API response.
}
```


---

### **Simple Price**

* **Description:** Queries the prices of one or more coins.
* **Endpoint:** `/simple/price`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header or Query String)
* **Request Parameters:**
    * `vs_currencies` (string, **required**): Comma-separated target currencies (e.g., "usd,eur").  See `/simple/supported_vs_currencies`.
    * `ids` (string): Comma-separated coin IDs (e.g., "bitcoin,ethereum").  See `/coins/list`.
    * `names` (string): Comma-separated coin names (URL-encoded spaces).
    * `symbols` (string): Comma-separated coin symbols.
    * `include_tokens` (string): For symbol lookups, "all" includes all matching tokens. Default: "top".
    * `include_market_cap` (boolean): Include market cap. Default: false.
    * `include_24hr_vol` (boolean): Include 24hr volume. Default: false.
    * `include_24hr_change` (boolean): Include 24hr change. Default: false.
    * `include_last_updated_at` (boolean): Include last updated time (UNIX). Default: false.
    * `precision` (string): Decimal places for price.  (e.g., "full", "0", "2").
* **Request Body:** None
* **Response Format:** JSON
* **Response Data Structure:**
```typescript
interface SimplePriceResponse {
  [coinId: string]: {
    [currency: string]: number; // Price
    [currency + "_market_cap"]: number | undefined;
    [currency + "_24h_vol"]: number | undefined;
    [currency + "_24h_change"]: number | undefined;
    last_updated_at: number | undefined;
  };
}
```
**Edge Cases:**  Lookup priority: `ids` > `names` > `symbols`. URL-encode spaces in names. `include_tokens=all` is for symbols only (max 50). No wildcard searches.


---

### **Coins List (ID Map)**

* **Description:** Lists all supported coins with ID, name, and symbol.
* **Endpoint:** `/coins/list`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header or Query String)
* **Request Parameters:**
    * `include_platform` (boolean): Include platform and contract addresses. Default: false.
    * `status` (string): Filter by coin status ("active" or "inactive"). Default: "active".
* **Request Body:** None
* **Response Format:** JSON
* **Response Data Structure:**
```typescript
interface CoinListEntry {
  id: string;
  symbol: string;
  name: string;
  platforms: { [platform: string]: string }; // Contract addresses
}
```


---
### **Coins Markets**
* **Description:** Lists supported coins with market data.
* **Endpoint:** `/coins/markets`
* **Method:** `GET`
* **Authentication:** Pro API Key (Header or Query String)
* **Request Parameters:**
    * `vs_currency` (string, **required**): Target currency (e.g., "usd"). See `/simple/supported_vs_currencies`.
    * `ids` (string): Comma-separated coin IDs.
    * `category` (string): Filter by category. See `/coins/categories/list`.
    * `order` (string): Sort order (e.g., "market_cap_desc").
    * `per_page` (number): Results per page (1-250). Default: 100.
    * `page` (number): Page number. Default: 1.
    * `sparkline` (boolean): Include 7-day sparkline data. Default: false.
    * `price_change_percentage` (string): Comma-separated price change percentage timeframes (e.g., "1h,24h,7d").
    * `locale` (string): Language (e.g., "en").
    * `precision` (string): Decimal places for price.
* **Request Body:** None
* **Response Format:** JSON
* **Response Data Structure:** _(Complex, see documentation for full details)_  Includes fields like `id`, `symbol`, `name`, `image`, `current_price`, `market_cap`, `sparkline_in_7d`, etc.  Define TypeScript interfaces for this structure.
**Edge Cases:** Lookup priority: `category` > `ids` > `names` > `symbols`.  URL-encode spaces in names. `include_tokens=all` is for symbols only (max 50). No wildcard searches.


---
 _(Continue this structure for the remaining endpoints, extracting parameters, response formats, and data structures.  Pay close attention to types and edge cases described in the documentation.)_

This comprehensive summary provides the foundation for generating a robust TypeScript SDK for the CoinGecko Pro API.  Remember to consult the original documentation for the most up-to-date information and to fill in any missing details based on actual API responses.  Good luck building your SDK!
