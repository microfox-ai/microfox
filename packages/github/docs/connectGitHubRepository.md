## Function: `connectGitHubRepository`

Connects a GitHub repository to a GitBook space.

**Purpose:**
Integrates a GitHub repository with a GitBook space.

**Parameters:**

* `params`: `ConnectGitHubRepositoryParams`, **required**.
    * `spaceId`: `string`, **required**. The ID of the GitBook space.
    * `repo`: `string`, **required**. The full name of the GitHub repository (e.g., "owner/repo").
    * `branch`: `string`, optional. The branch to connect (default: "main").
    * `webhookEvents`: `array<string>`, optional. List of webhook events to subscribe to.

**Return Value:**

* `Promise<IntegrationDetails>`: A promise that resolves to the integration details.
    * `id`: `string`. The unique identifier of the integration.
    * `spaceId`: `string`. The ID of the GitBook space.
    * `repo`: `string`. The full name of the GitHub repository.
    * `branch`: `string`. The connected branch.
    * `webhookEvents`: `array<string>`. List of subscribed webhook events.
    * `createdAt`: `string`. The creation date of the integration.
    * `updatedAt`: `string`. The last update date of the integration.

**Examples:**

```typescript
// Example: Connecting a repository
async function connectRepo() {
  const integration = await sdk.connectGitHubRepository({
    spaceId: "space_id",
    repo: "owner/repo",
    branch: "develop",
    webhookEvents: ["push", "pull_request"],
  });
  console.log(integration);
}

connectRepo();
```