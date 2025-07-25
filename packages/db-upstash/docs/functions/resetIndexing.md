# resetIndexing

Deletes all data associated with the indexing task from Redis. This is a destructive operation and should be used with care.

## Signature

```typescript
resetIndexing(): Promise<void>
```

### Returns

- (`Promise<void>`): A promise that resolves when the data has been deleted.

### Example

```typescript
// Clean up the task state after it's no longer needed
await myScraperPaginator.resetIndexing();
console.log('Paginator state has been reset.');
```
