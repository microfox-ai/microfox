Gets a label by ID.

**Parameters:**

- `id`: The ID of the label to retrieve.

**Return Type:**

- `Promise<Label>`: A promise that resolves to the Label object.

**Usage Example:**

```typescript
const label = await gmailSdk.getLabel('LABEL_ID');
console.log(label);
```

**Code Example:**

```typescript
async function getLabelById() {
  const label = await gmailSdk.getLabel('LABEL_ID');
  console.log(label);
}

getLabelById();
```
