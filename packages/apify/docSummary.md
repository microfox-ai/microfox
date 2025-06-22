```markdown
# Apify API v2 TypeScript SDK Summary

This document summarizes the Apify API v2 for the generation of a TypeScript SDK. All endpoints are described with their HTTP methods, request parameters, response formats, and authentication requirements.

## General Information

* **Base URL:** `https://api.apify.com/v2`
* **Response Format:** JSON with UTF-8 encoding. Most successful responses follow the structure:
    ```json
    {
       "data": {
           ...
       }
    }
    ```
    Error responses:
    ```json
    {
       "error": {
           "type": "error-type",
           "message": "Error message"
       }
    }
    ```
* **Content-Type:** All requests with JSON payloads require the `Content-Type: application/json` header.
* **Method Override:** All endpoints support the `method` query parameter to override the HTTP method. This allows calling `POST` endpoints with `GET` requests, for example.
* **Pagination:** Endpoints returning lists of records use `offset` and `limit` query parameters for pagination, except `/key-value-stores/:storeId/keys` which uses `exclusiveStartKey` and `limit`.  A `desc` parameter controls sort order (ascending by default). Paginated responses include `total`, `offset`, `limit`, `count`, `desc`, and `items` fields in the `data` object.
* **Rate Limiting:**
    * Global: 250,000 requests per minute per user (authenticated) or IP address (unauthenticated).
    * Per-resource: 30 requests per second (default), 100 requests per second for key-value store record CRUD, and 200 requests per second for Actor runs, Dataset pushes, and Request Queue operations.
    * Rate limit exceeded responses return a 429 status code.
* **Authentication:**
    * **Bearer Token (Recommended):**  Include the API token in the `Authorization` header as `Bearer <token>`.
    * **API Key (Less Secure):** Include the token as the `token` query parameter.

## Endpoints

### Users

* **GET /users/me** - Get current user details.
    * **Authentication:** Bearer Token
    * **Response (200):** User object

### Actors

* **GET /acts** - Get list of Actors.
    * **Authentication:** Bearer Token
    * **Query Parameters:** `my` (boolean), `offset` (number), `limit` (number), `desc` (boolean), `sortBy` (string: 'createdAt' or 'lastRunStartedAt')
    * **Response (200):** Paginated list of Actor objects.
* **POST /acts** - Create Actor.
    * **Authentication:** Bearer Token
    * **Request Body:** Actor object (see documentation for details)
    * **Response (201):** Created Actor object.
* **GET /acts/:actorId** - Get Actor details.
    * **Authentication:** Bearer Token
    * **Path Parameters:** `actorId` (string)
    * **Response (200):** Actor object.
* **PUT /acts/:actorId** - Update Actor.
    * **Authentication:** Bearer Token
    * **Path Parameters:** `actorId` (string)
    * **Request Body:** Actor object (see documentation for details)
    * **Response (200):** Updated Actor object.
* **DELETE /acts/:actorId** - Delete Actor.
    * **Authentication:** Bearer Token
    * **Path Parameters:** `actorId` (string)
    * **Response (204):** No content.

### Actor Versions

* **GET /acts/:actorId/versions** - Get list of Actor versions.
    * **Authentication:** Bearer Token
    * **Path Parameters:** `actorId` (string)
    * **Response (200):** List of Version objects.
* **POST /acts/:actorId/versions** - Create Actor version.
    * **Authentication:** Bearer Token
    * **Path Parameters:** `actorId` (string)
    * **Request Body:** Version object (see documentation for details)
    * **Response (201):** Created Version object.
* **GET /acts/:actorId/versions/:versionNumber** - Get Actor version details.
    * **Authentication:** Bearer Token
    * **Path Parameters:** `actorId` (string), `versionNumber` (string)
    * **Response (200):** Version object.
* **PUT /acts/:actorId/versions/:versionNumber** - Update Actor version.
    * **Authentication:** Bearer Token
    * **Path Parameters:** `actorId` (string), `versionNumber` (string)
    * **Request Body:** Version object (see documentation for details)
    * **Response (200):** Updated Version object.
* **DELETE /acts/:actorId/versions/:versionNumber** - Delete Actor version.
    * **Authentication:** Bearer Token
    * **Path Parameters:** `actorId` (string), `versionNumber` (string)
    * **Response (204):** No content.

(... similarly for Actor Environment Variables, Actor Builds, Actor Runs, Datasets, Key-Value Stores, Request Queues, Webhooks, and User)


## Data Structures

The documentation lacks explicit data structures.  For SDK generation, you'll need to infer types from the examples and descriptions, or consult the OpenAPI schema directly.  Key data structures to define include:

* `Actor`
* `Version`
* `EnvVar`
* `Build`
* `Run`
* `Dataset`
* `KeyValueStore`
* `Record`
* `RequestQueue`
* `Webhook`
* `User`
* `Pagination` (for paginated responses)
* `Error` (for error responses)


## Edge Cases

* Handling different authentication methods.
* Robust error handling based on error types and messages.
* Implementing pagination logic.
* Handling rate limiting with exponential backoff.
* Parsing and utilizing the various response formats.
*  The documentation mentions that some endpoints have different rate limits. The SDK should be aware of these differences and adjust its retry logic accordingly.
*  The `actorId` parameter can be either a UUID or a username~actorName combination. The SDK should handle both cases.

##  Additional Notes for SDK Implementation

* The SDK should provide clear and concise methods for interacting with each endpoint.
*  Properly handle optional parameters and provide sensible defaults.
*  Include comprehensive documentation and type definitions for all methods and data structures.
*  Consider using a code generation tool to generate the SDK from the OpenAPI schema. This will ensure that the SDK is always up-to-date with the latest API changes.

```

This comprehensive summary provides a solid foundation for generating a robust and type-safe TypeScript SDK for the Apify API v2. Remember to consult the official Apify documentation and OpenAPI schema for the most up-to-date information and details.
