## Function: `listProductions`

Lists all productions associated with your Riverside.fm account.

**Purpose:**
Retrieves a list of all productions accessible with your API key.

**Parameters:**
None

**Return Value:**

- `Promise<array<Production>>` - A promise that resolves to an array of `Production` objects.
  - `Production`: object
    - `id`: string - The unique identifier of the production.
    - `name`: string - The name of the production.
    - `created_date`: string - The creation date of the production.
    - `studios`: array<Studio> - An array of studios associated with the production.
      - `Studio`: object
        - `id`: string - The unique identifier of the studio.
        - `name`: string - The name of the studio.
        - `created_date`: string - The creation date of the studio.
        - `projects`: array<Project> - An array of projects associated with the studio.
          - `Project`: object
            - `id`: string - The unique identifier of the project.
            - `name`: string - The name of the project.
            - `created_date`: string - The creation date of the project.
            - `num_recordings`: number - The number of recordings in the project.
        - `num_recordings`: number - The number of recordings in the studio.
    - `num_recordings`: number - The number of recordings in the production.

**Examples:**

```typescript
// Example: Listing all productions
const productions = await riversideSDK.listProductions();
console.log(productions);
```