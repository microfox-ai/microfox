# Todo for CrudStore Expiration Feature

This document outlines the plan for implementing an application-level expiration system in the `CrudStore` class. This is necessary because `CrudStore` uses multiple Redis keys (a hash for data and multiple sets for indexes) for a single item, so a simple Redis `EXPIRE` command is insufficient and would lead to corrupted indexes.

## Proposed Implementation Plan

### 1. New Constructor Option: `expirationField`

- Introduce a new optional configuration property in the `CrudStore` constructor: `expirationField: StoreField`.
- This field will define which property on an item stores its expiration timestamp (as a Unix timestamp in seconds).
- To make this work, the specified `expirationField` **must** also be included in the `sortFields` array to ensure it's indexed in a sorted set, allowing for efficient querying of expired items.
- The constructor should throw a configuration error if `expirationField` is provided but not found in `sortFields`.

### 2. Add `ttl` Option to `set` and `update` Methods

- Add a new optional parameter to the `set` and `update` methods: `options?: { ttl?: number }`.
- If the `ttl` (time-to-live in seconds) is provided, the methods will calculate the expiration timestamp (`Date.now() / 1000 + ttl`) and automatically set or update the `expirationField` on the item.

### 3. Automatic Filtering of Expired Items

- All public read methods (`get`, `list`, `queryByScore`, `queryByField`, `queryByFieldIn`, etc.) must be updated.
- Before returning results, these methods should check if an item is expired by comparing the value of its `expirationField` with the current time.
- For `get`, if the item is expired, it should return `null`.
- For list/query methods, expired items should be filtered out from the results before being returned to the user. This ensures that expired data is never visible, even before it's been purged.

### 4. Implement `purgeExpired()` Method for Cleanup

- Create a new public method: `async purgeExpired(): Promise<{ purgedCount: number }>`.
- This method will use the `expirationField`'s sorted set index to efficiently find all items whose expiration timestamp is in the past.
- It will then iterate through the IDs of the expired items and call the `del()` method for each one to ensure that the item's hash and all of its associated index entries are cleanly and atomically removed.
- The method will return the number of items that were successfully purged.
- This method is intended to be run periodically (e.g., via a cron job) to reclaim memory used by expired items.

### 5. Update `experimental_reIndex`

- The `experimental_reIndex` method should be aware of the `expirationField`. When rebuilding indexes, it should correctly re-index the expiration timestamp for each item.
