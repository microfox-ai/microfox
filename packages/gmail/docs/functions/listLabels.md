Lists all labels for the authenticated user.

**Return Type:**

- `Promise<ListLabelsResponse>`: A promise that resolves to a ListLabelsResponse object containing an array of labels.

**Usage Example:**

```typescript
const labels = await gmailSdk.listLabels();
console.log(labels);
```

**Code Example:**

```typescript
async function getLabels() {
  const labels = await gmailSdk.listLabels();
  console.log(labels);
}

getLabels();
```
