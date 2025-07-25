# updateIndexingStatus

Updates the progress of an ongoing indexing task. This is the most common method to call during a scraping loop to save the latest state.

## Signature

```typescript
updateIndexingStatus(newProgress: Partial<T>): Promise<IPaginationStatus<T>>
```

### Parameters

- `newProgress` (`Partial<T>`): An object containing the progress fields to update. It will be merged with the existing progress state.

### Returns

- (`Promise<IPaginationStatus<T>>`): A promise that resolves to the updated pagination status object.

### Example

```typescript
const status = await myScraperPaginator.updateIndexingStatus({
  page: 2,
  itemsProcessed: 100,
});

console.log('Progress updated:', status.progress);
// Progress updated: { page: 2, lastId: 'some-last-id', itemsProcessed: 100 }
```
