# createSpace

Creates a new space.

## Parameters

- **teamId** (string): The ID of the team to create the space in.
- **params** (CreateSpaceParams): An object containing the space details.
  - **name** (string): The name of the space.

## Return Type

Promise<SpaceResponse>

## Usage Example

```typescript
const newSpace = await clickUp.createSpace('YOUR_TEAM_ID', { name: 'My New Space' });
console.log(newSpace);
```