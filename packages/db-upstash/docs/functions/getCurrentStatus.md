# getCurrentStatus

Retrieves the current status and progress of the indexing task from Redis.

## Signature

```typescript
getCurrentStatus(): Promise<IPaginationStatus<T> | null>
```

### Returns

- (`Promise<IPaginationStatus<T> | null>`): A promise that resolves to the current pagination status object, or `null` if the task has not been started.

### Example

```typescript
const status = await myScraperPaginator.getCurrentStatus();

if (status) {
  console.log(`Current status: ${status.status}`);
} else {
  console.log('No job found. Starting a new one.');
}
```
