Deletes a label.

**Parameters:**

- `id`: The ID of the label to delete.

**Return Type:**

- `Promise<void>`: A promise that resolves when the label is deleted.

**Usage Example:**

```typescript
await gmailSdk.deleteLabel('LABEL_ID');
```

**Code Example:**

```typescript
async function deleteLabelById() {
  await gmailSdk.deleteLabel('LABEL_ID');
}

deleteLabelById();
```
