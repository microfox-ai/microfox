# pauseIndexing

Pauses a running indexing task. This sets the status to `'paused'`.

## Signature

```typescript
pauseIndexing(): Promise<IPaginationStatus<T>>
```

### Returns

- (`Promise<IPaginationStatus<T>>`): A promise that resolves to the updated pagination status object with a `status` of `'paused'`.

### Example

```typescript
await myScraperPaginator.pauseIndexing();
console.log('Scraper has been paused.');
```
