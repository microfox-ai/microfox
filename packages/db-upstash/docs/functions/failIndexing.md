# failIndexing

Marks an indexing task as 'failed' and stores an error message. This is useful for formally recording a failure state.

## Signature

```typescript
failIndexing(error: Record<string, any> | string): Promise<IPaginationStatus<T>>
```

### Parameters

- `error` (`Record<string, any> | string`): The error to be stored. Can be a simple string or a more detailed object.

### Returns

- (`Promise<IPaginationStatus<T>>`): A promise that resolves to the final pagination status object with a `status` of `'failed'`.

### Example

```typescript
try {
  // some failing operation
  throw new Error('API rate limit exceeded');
} catch (e: any) {
  await myScraperPaginator.failIndexing({ message: e.message, code: 500 });
  console.log('Scraper job failed.');
}
```
