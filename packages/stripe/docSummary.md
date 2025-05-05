```markdown
# Stripe TypeScript SDK API Summary

This document summarizes the Stripe API for the purpose of generating a TypeScript SDK.  The base URL for all endpoints is `https://api.stripe.com`.

## Authentication

All API requests must be made over HTTPS using API keys for authentication.  Test mode secret keys have the prefix `sk_test_` and live mode secret keys have the prefix `sk_live_`. Restricted API keys can be used for granular permissions.  Authentication is done via the `Authorization` header with a value of `Bearer <API_KEY>`.

**Example (cURL):**

```bash
curl https://api.stripe.com/v1/charges \
-H "Authorization: Bearer sk_test_YOUR_SECRET_KEY"
```

## Connected Accounts

Requests can be made on behalf of connected accounts using the `Stripe-Account` header.  This header should contain the connected account ID (starting with `acct_`).

**Example (cURL):**

```bash
curl https://api.stripe.com/v1/charges/ch_12345 \
-H "Authorization: Bearer sk_test_YOUR_SECRET_KEY" \
-H "Stripe-Account: acct_CONNECTED_ACCOUNT_ID" \
-G
```

## Errors

Stripe uses standard HTTP response codes.  2xx indicates success, 4xx indicates client errors, and 5xx indicates server errors.  4xx errors often include an error object in the response body.

```typescript
interface StripeError {
  code?: string;
  decline_code?: string;
  message?: string;
  param?: string;
  payment_intent?: object; // Type definition needed for PaymentIntent
  setup_intent?: object; // Type definition needed for SetupIntent
  source?: object; // Type definition needed for Source (deprecated)
  payment_method?: object; // Type definition needed for PaymentMethod
  payment_method_type?: string;
  type: 'api_error' | 'card_error' | 'idempotency_error' | 'invalid_request_error';
  doc_url?: string;
  request_log_url?: string;
  charge?: string;
  advice_code?: string;
  network_advice_code?: string;
  network_decline_code?: string;
}
```

## Expanding Responses

Responses can be expanded using the `expand` parameter, which accepts an array of strings.  This allows retrieving related objects inline.  Expansions have a maximum depth of four levels.

**Example:**  `expand[]=customer&expand[]=payment_intent.customer`

## Idempotent Requests

Idempotency is supported for POST requests using the `Idempotency-Key` header. This header should contain a unique string (e.g., a UUID).

## Metadata

Many objects have a `metadata` parameter for attaching key-value data. Up to 50 keys are allowed, with key names up to 40 characters and values up to 500 characters. Square brackets (`[` and `]`) are not allowed in keys.

## Pagination

List endpoints support cursor-based pagination using `limit`, `starting_after`, and `ending_before` parameters.

## Request IDs

Each request has a `Request-Id` header, useful for debugging.

## Versioning

Specify the API version using the `Stripe-Version` header (e.g., `Stripe-Version: 2025-04-30.basil`).

## Endpoints

The Stripe API has numerous endpoints.  A comprehensive SDK should include all.  For brevity, only a few examples are shown here.  **It is crucial to consult the full Stripe API documentation to include all endpoints and their parameters.**  The Stripe API documentation can be found at: https://stripe.com/docs/api

**General Structure (TypeScript):**

```typescript
// Example for a GET request
async function getBalance(params?: { [key: string]: any }, options?: { stripeAccount?: string, stripeVersion?: string }): Promise<any> { // Replace 'any' with actual type
  // ... implementation using fetch or similar ...
}

// Example for a POST request
async function createCustomer(params: { [key: string]: any }, options?: { idempotencyKey?: string, stripeAccount?: string, stripeVersion?: string }): Promise<any> { // Replace 'any' with actual type
  // ... implementation using fetch or similar ...
}
```

**Endpoint Examples:**

* **GET /v1/balance:** Retrieve balance information.
    * *Description:* Retrieves the current balance of your Stripe account.
    * *Authentication:* `Bearer <API_KEY>`
    * *Parameters:* None explicitly mentioned, but pagination parameters are likely supported.
    * *Response:*  Balance object (type definition needed).
* **POST /v1/customers:** Create a new customer.
    * *Description:* Creates a new customer object.
    * *Authentication:* `Bearer <API_KEY>`
    * *Parameters:* Customer creation parameters (type definition needed).
    * *Request Body:*  Customer creation parameters.
    * *Response:* Customer object (type definition needed).
* **GET /v1/charges/:id:** Retrieve a charge.
    * *Description:* Retrieves a specific charge object.
    * *Authentication:* `Bearer <API_KEY>`
    * *Parameters:* `id` (string).  Also supports `expand`.
    * *Response:* Charge object (type definition needed).
* **POST /v1/charges/:id/capture:** Capture a charge.
    * *Description:* Captures a previously authorized charge.
    * *Authentication:* `Bearer <API_KEY>`
    * *Parameters:* `id` (string).  Likely supports `expand` and idempotency.
    * *Request Body:*  Capture parameters (if any).
    * *Response:* Charge object (type definition needed).


... (All other endpoints need to be added here with similar details) ...


## Edge Cases

* **Type Definitions:**  It's absolutely crucial to define TypeScript types for all request parameters and response objects.  This will significantly improve the usability and type safety of the SDK.
* **Error Handling:**  The SDK should provide robust error handling, returning typed `StripeError` objects.
* **Auto-Pagination:** Implement auto-pagination for list endpoints to simplify iterating through large datasets.
* **Asynchronous Operations:** All API calls should be asynchronous, returning Promises.

This detailed summary provides a solid foundation for building a comprehensive Stripe TypeScript SDK. Remember to consult the official Stripe API documentation for complete and up-to-date information on all endpoints, parameters, and response objects.  Thorough type definitions are essential for a high-quality SDK.
```

This improved summary addresses the user's query and provides a more structured approach for SDK generation, emphasizing type definitions, error handling, and other crucial aspects.  It also stresses the importance of using the official Stripe documentation for complete details.  The examples provided offer a clearer template for generating TypeScript function signatures. Remember this is still not exhaustive, and you must refer to the official Stripe API reference for each endpoint's specific parameters and responses.  Building the SDK will require fetching the OpenAPI specification and using a tool like `openapi-generator` to create the initial SDK structure, which you can then refine and improve.