## Function: `getMemberSnapshotData`

Retrieves member snapshot data.

**Purpose:**

Fetches snapshot data for the authenticated member.

**Parameters:**

- `domain` (string, optional): The domain of the snapshot data.

**Return Value:**

- `Promise<MemberSnapshotSchema[]>`: An array of member snapshot data.
  - `MemberSnapshotSchema` (object):
    - `snapshotDomain` (string, required): Domain of the snapshot.
    - `snapshotData` (record<unknown>, required): Snapshot data.

**Examples:**

```typescript
// Example: Get member snapshot data
try {
  const snapshotData = await sdk.getMemberSnapshotData();
  console.log(snapshotData);

  const snapshotDataForDomain = await sdk.getMemberSnapshotData('<domain>');
  console.log(snapshotDataForDomain);
} catch (error) {
  console.error('Failed to get snapshot data:', error);
}
```
