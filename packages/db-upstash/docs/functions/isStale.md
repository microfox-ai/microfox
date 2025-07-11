# isStale

Checks if an indexing task is stale by comparing its `lastUpdatedAt` timestamp with a given timeout. This is useful for detecting and restarting stuck or dead worker processes.

## Signature

```typescript
isStale(timeoutSeconds: number): Promise<boolean>
```

### Parameters

- `timeoutSeconds` (`number`): The timeout in seconds. If the task has not been updated within this period, it is considered stale.

### Returns

- (`Promise<boolean>`): A promise that resolves to `true` if the task is stale, otherwise `false`.

### Example

```typescript
// Check if the scraper has been silent for more than 5 minutes
const isStuck = await myScraperPaginator.isStale(300);

if (isStuck) {
  console.log('Warning: Scraper job appears to be stale!');
}
```
