## Function: `triggerMemberDataProcessing`

Triggers member data processing.

**Purpose:**

Initiates the process of member data processing.

**Parameters:**

- None

**Return Value:**

- `Promise<{ success: boolean }>`: An object indicating whether the trigger was successful.

**Examples:**

```typescript
// Example: Trigger member data processing
try {
  const result = await sdk.triggerMemberDataProcessing();
  console.log('Trigger result:', result);
} catch (error) {
  console.error('Failed to trigger data processing:', error);
}
```
