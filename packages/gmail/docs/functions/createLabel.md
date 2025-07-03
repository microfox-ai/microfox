Creates a new label.

**Parameters:**

- `label`: Omit<Label, 'id'> object with the following properties:
  - `name`: The display name of the label.
  - `messageListVisibility` (optional): The visibility of the label in the message list.
  - `labelListVisibility` (optional): The visibility of the label in the label list.
  - `type`: The type of the label.

**Return Type:**

- `Promise<Label>`: A promise that resolves to the created Label object.

**Usage Example:**

```typescript
const newLabel = await gmailSdk.createLabel({ name: 'My Label', type: 'user' });
console.log(newLabel);
```

**Code Example:**

```typescript
async function createNewLabel() {
  const newLabel = await gmailSdk.createLabel({
    name: 'My Label',
    type: 'user',
  });
  console.log(newLabel);
}

createNewLabel();
```
