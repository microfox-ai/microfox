# resumeIndexing

Resumes a paused indexing task by setting its status back to `'running'`.

## Signature

```typescript
resumeIndexing(): Promise<IPaginationStatus<T>>
```

### Returns

- (`Promise<IPaginationStatus<T>>`): A promise that resolves to the updated pagination status object with a `status` of `'running'`.

### Example

```typescript
const status = await myScraperPaginator.resumeIndexing();
console.log(`Resumed at page: ${status.progress.page}`);
```
