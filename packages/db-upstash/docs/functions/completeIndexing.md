# completeIndexing

Marks an indexing task as 'completed'. This is the final state for a successful task.

## Signature

```typescript
completeIndexing(): Promise<IPaginationStatus<T>>
```

### Returns

- (`Promise<IPaginationStatus<T>>`): A promise that resolves to the final pagination status object with a `status` of `'completed'`.

### Example

```typescript
await myScraperPaginator.completeIndexing();
console.log('Scraping job completed!');
```
