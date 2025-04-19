# updateSpace

Updates an existing space.

## Parameters

- **teamId** (string): The ID of the team.
- **spaceId** (string): The ID of the space to update.
- **params** (UpdateSpaceParams): An object containing the updated space details.
  - **name** (string, optional): The new name of the space.

## Return Type

Promise<SpaceResponse>

## Usage Example

```typescript
const updatedSpace = await clickUp.updateSpace('YOUR_TEAM_ID', 'YOUR_SPACE_ID', { name: 'Updated Space Name' });
console.log(updatedSpace);
```