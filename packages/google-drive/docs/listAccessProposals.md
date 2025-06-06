## Function: `listAccessProposals`

Lists all pending access proposals for a specific file. This allows applications to retrieve multiple access requests that are awaiting review.

**Purpose:**
To retrieve a list of access proposals associated with a file, enabling the application to display or process these requests, for example, in an administrative interface.

**Parameters:**
- `fileId`: `string` (required) - The ID of the file for which to list access proposals.
- `pageToken`: `string` (optional) - The token for continuing a previous list request on the next page. This token is obtained from the `nextPageToken` field of a previous response.
- `pageSize`: `number` (optional) - The maximum number of access proposals to return per page. The default and maximum values are server-dependent.

**Return Value:**
- Type: `Promise<AccessProposalsListResponse>` (object)
- Description: A promise that resolves to an `AccessProposalsListResponse` object containing a list of access proposals and a potential token for the next page.
  - `AccessProposalsListResponse`: An object with the following properties:
    - `kind`: `string` - Identifies the resource type, `drive#accessProposalList`.
    - `accessProposals`: `array<AccessProposalResponse>` - A list of access proposals. Each element is an `AccessProposalResponse` object (see `getAccessProposal` for its structure).
    - `nextPageToken`: `string` (optional) - The page token for the next page of results. This will be absent if the end of the list has been reached.

**Examples:**
```typescript
// Example 1: List all access proposals for a file
async function exampleListAccessProposals() {
  const fileId = 'your-file-id'; // Replace with an actual file ID
  try {
    const response = await sdk.listAccessProposals(fileId);
    console.log('Access Proposals:', response.accessProposals);
    if (response.nextPageToken) {
      console.log('Next page token:', response.nextPageToken);
    }
  } catch (error) {
    console.error('Error listing access proposals:', error);
  }
}

// Example 2: List access proposals with pagination
async function exampleListAccessProposalsWithPagination() {
  const fileId = 'your-file-id'; // Replace with an actual file ID
  const pageSize = 10;
  let nextPageToken: string | undefined = undefined;

  try {
    do {
      const response = await sdk.listAccessProposals(fileId, nextPageToken, pageSize);
      console.log('Fetched Proposals:', response.accessProposals);
      response.accessProposals.forEach(proposal => {
        console.log(`- Proposal ID: ${proposal.id}, Status: ${proposal.status}`);
      });
      nextPageToken = response.nextPageToken;
    } while (nextPageToken);
    console.log('All access proposals fetched.');
  } catch (error) {
    console.error('Error listing access proposals with pagination:', error);
  }
}
```
