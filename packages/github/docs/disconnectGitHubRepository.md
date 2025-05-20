## Function: `disconnectGitHubRepository`

Disconnects a GitHub repository from a GitBook space.

**Purpose:**
Removes the integration between a GitHub repository and a GitBook space.

**Parameters:**

* `params`: `DisconnectGitHubRepositoryParams`, **required**.
    * `integrationId`: `string`, **required**. The ID of the integration to disconnect.

**Return Value:**

* `Promise<void>`: A promise that resolves when the repository is disconnected.

**Examples:**

```typescript
// Example: Disconnecting a repository
async function disconnectRepo() {
  await sdk.disconnectGitHubRepository({
    integrationId: "integration_id",
  });
  console.log("Repository disconnected");
}

disconnectRepo();
```