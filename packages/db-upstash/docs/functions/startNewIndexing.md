# startNewIndexing

Initializes a new indexing or pagination task. This method sets the initial state in Redis, marks the status as 'running', and records the start time.

## Signature

```typescript
startNewIndexing(initialProgress: T): Promise<IPaginationStatus<T>>
```

### Parameters

- `initialProgress` (`T`): An object representing the starting progress of the task. The shape of this object must match the generic type `T` provided to the `Paginator` constructor.

### Returns

- (`Promise<IPaginationStatus<T>>`): A promise that resolves to the newly created pagination status object.

### Example

```typescript
const initialProgress = {
  page: 1,
  lastId: null,
  itemsProcessed: 0,
};

const status = await myScraperPaginator.startNewIndexing(initialProgress);
console.log(status);
// {
//   status: 'running',
//   progress: { page: 1, lastId: null, itemsProcessed: 0 },
//   startedAt: 1678886400000,
//   lastUpdatedAt: 1678886400000
// }
```
