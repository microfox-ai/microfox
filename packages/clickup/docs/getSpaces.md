# getSpaces

Retrieves all spaces in a specific team from ClickUp.

## Parameters

- **teamId** (string): The ID of the team to retrieve spaces from.

## Return Type

`Promise<SpaceResponse>`

## Example

```typescript
const spaces = await clickUp.getSpaces('teamId');
console.log(spaces);
```

## Response Example

```typescript
{
  spaces: [
    {
      id: '123456',
      name: 'Space Name',
      color: '#ff0000',
      avatar: 'https://example.com/avatar.jpg',
      private: false,
      admin_can_manage: true,
      statuses: [
        {
          id: 'status_id',
          status: 'in progress',
          color: '#ff0000',
          orderindex: 1,
          type: 'open',
        },
      ],
      multiple_assignees: true,
      features: {
        due_dates: {
          enabled: true,
          start_date: true,
          remap_due_dates: true,
          remap_closed_due_date: false,
        },
        sprints: {
          enabled: true,
        },
        time_tracking: {
          enabled: true,
          harvest: false,
          rollup: true,
        },
        points: {
          enabled: true,
        },
        custom_items: {
          enabled: true,
        },
        dependencies: {
          enabled: true,
        },
        tags: {
          enabled: true,
        },
        time_estimates: {
          enabled: true,
        },
        checklists: {
          enabled: true,
        },
        zoom: {
          enabled: true,
        },
        milestones: {
          enabled: true,
        },
        custom_fields: {
          enabled: true,
        },
        remap_dependencies: {
          enabled: true,
        },
        dependency_warning: {
          enabled: true,
        },
        portfolios: {
          enabled: true,
        },
      },
      archived: false,
      members: [
        {
          user: {
            id: 123,
            username: 'John Doe',
            color: '#ff0000',
            email: 'john@example.com',
            profilePicture: 'https://example.com/profile.jpg',
          },
        },
      ],
    },
    // ... more spaces
  ];
}
```

## Error Handling

The function will throw an error if:

- The team ID is invalid
- The team doesn't exist
- The API key is invalid
- There are network issues

Example error handling:

```typescript
try {
  const spaces = await clickUp.getSpaces('teamId');
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('Team not found');
  } else {
    console.error('Failed to get spaces:', error.message);
  }
}
```

## Rate Limits

This endpoint is subject to ClickUp's rate limits. The exact limits depend on your ClickUp plan.

## Notes

- The team ID can be found in the URL when viewing a team in ClickUp
- The response includes all spaces in the team, including their full details
- Archived spaces are included in the response
- Spaces are returned in order of their creation date
