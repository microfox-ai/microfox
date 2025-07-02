Updates an existing label.

**Parameters:**

- `id`: The ID of the label to update.
- `label`: Partial<Label> object with the properties to update.

**Return Type:**

- `Promise<Label>`: A promise that resolves to the updated Label object.

**Usage Example:**

```typescript
const updatedLabel = await gmailSdk.updateLabel('LABEL_ID', {
  name: 'New Label Name',
});
console.log(updatedLabel);
```

**Code Example:**

```typescript
async function updateLabelById() {
  const updatedLabel = await gmailSdk.updateLabel('LABEL_ID', {
    name: 'New Label Name',
  });
  console.log(updatedLabel);
}

updateLabelById();
```
