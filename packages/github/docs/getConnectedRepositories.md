## Function: `getConnectedRepositories`

Gets the connected GitHub repositories for a GitBook space.

**Purpose:**
Retrieves a list of GitHub repositories connected to a specific GitBook space.

**Parameters:**

* `params`: `GetConnectedRepositoriesParams`, **required**.
    * `spaceId`: `string`, **required**. The ID of the GitBook space.

**Return Value:**

* `Promise<IntegrationDetails[]>`: A promise that resolves to an array of integration details.
    * `id`: `string`. The unique identifier of the integration.
    * `spaceId`: `string`. The ID of the GitBook space.
    * `repo`: `string`. The full name of the GitHub repository.
    * `branch`: `string`. The connected branch.
    * `webhookEvents`: `array<string>`. List of subscribed webhook events.
    * `createdAt`: `string`. The creation date of the integration.
    * `updatedAt`: `string`. The last update date of the integration.

**Examples:**

```typescript
// Example: Getting connected repositories
async function getConnectedRepos() {
  const integrations = await sdk.getConnectedRepositories({
    spaceId: "space_id",
  });
  console.log(integrations);
}

getConnectedRepos();
```