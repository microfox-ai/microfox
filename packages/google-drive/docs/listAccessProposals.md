## Function: `listAccessProposals`

Lists the access proposals associated with a specific file. Access proposals are requests made by users to gain access to a file they currently cannot view or edit.

**Purpose:**
To retrieve a collection of access proposals for a given file, allowing an application to display or process these requests. This is useful for file owners or managers to review pending access requests.

**Parameters:**

-   `fileId` (string): Required. The ID of the file for which to list access proposals.
-   `pageToken` (string): Optional. The token for continuing a previous list request on the next page. This token is obtained from the `nextPageToken` field of a previous response.
-   `pageSize` (number): Optional. The maximum number of access proposals to return per page. The service may return fewer than this value. If unspecified, or set to 0, the server will pick an appropriate default.

**Return Value:**

-   Type: `Promise<AccessProposalsListResponse>`
-   Description: A promise that resolves to an `AccessProposalsListResponse` object containing a list of access proposals and a potential token for fetching the next page of results.
-   Error cases: Throws an error if the API request fails (e.g., file not found, authentication issues, insufficient permissions, or invalid parameters).

**Type Definitions:**

*   `AccessProposalsListResponse`:
    ```typescript
    type AccessProposalsListResponse = {
      accessProposals: Array<AccessProposalResponse>; // The list of access proposals.
      nextPageToken?: string; // The page token for the next page of access proposals. This will be absent if the end of the list has been reached.
    };
    ```

*   `AccessProposalResponse`:
    ```typescript
    type AccessProposalResponse = {
      fileId: string; // The ID of the file this proposal pertains to.
      proposalId: string; // The ID of this access proposal.
      requesterEmailAddress: string; // The email address of the user who made the access request.
      recipientEmailAddress: string; // The email address of the user to whom the access request was sent.
      rolesAndViews: Array<RoleAndView>; // The roles and/or views requested in the proposal.
      requestMessage: string; // The message included by the requester with their proposal.
      createTime: string; // The time this access proposal was created, in RFC 3339 date-time format.
    };
    ```

*   `RoleAndView`:
    ```typescript
    type RoleAndView = {
      role: 'writer' | 'commenter' | 'reader'; // The role being requested.
      view?: string; // An optional specific view being requested.
    };
    ```

**Examples:**

```typescript
// Assuming 'sdk' is an initialized instance of GoogleDriveSdk
const FILE_ID_WITH_PROPOSALS = 'YOUR_FILE_ID_HERE'; // Replace with an actual file ID that has access proposals

// Example 1: List first page of access proposals with default page size
async function listFirstPageProposals() {
  try {
    const response = await sdk.listAccessProposals(FILE_ID_WITH_PROPOSALS);
    console.log('Access Proposals (First Page):', response.accessProposals);
    if (response.nextPageToken) {
      console.log('Next Page Token:', response.nextPageToken);
    }
    response.accessProposals.forEach(proposal => {
      console.log(`- Proposal ID: ${proposal.proposalId}, Requester: ${proposal.requesterEmailAddress}`);
    });
  } catch (error) {
    console.error(`Error listing access proposals for file ${FILE_ID_WITH_PROPOSALS}:`, error);
  }
}

// Example 2: List access proposals with a specific page size
async function listProposalsWithPageSize() {
  const pageSize = 5;
  try {
    const response = await sdk.listAccessProposals(FILE_ID_WITH_PROPOSALS, undefined, pageSize);
    console.log(`Access Proposals (Page Size ${pageSize}):`, response.accessProposals);
    console.log(`Returned ${response.accessProposals.length} proposals.`);
    if (response.nextPageToken) {
      console.log('Next Page Token for further pagination:', response.nextPageToken);
    }
  } catch (error) {
    console.error('Error listing access proposals with page size:', error);
  }
}

// Example 3: Paginate through all access proposals
async function listAllProposalsPaginated() {
  let allProposals: AccessProposalResponse[] = [];
  let pageToken: string | undefined = undefined;
  const pageSize = 10;

  try {
    console.log('Fetching all access proposals with pagination...');
    do {
      const response = await sdk.listAccessProposals(FILE_ID_WITH_PROPOSALS, pageToken, pageSize);
      allProposals = allProposals.concat(response.accessProposals);
      pageToken = response.nextPageToken;
      console.log(`Fetched ${response.accessProposals.length} proposals. Total fetched: ${allProposals.length}`);
    } while (pageToken);

    console.log('All Access Proposals:', allProposals);
    allProposals.forEach(proposal => {
      console.log(`- Proposal ID: ${proposal.proposalId}, Message: ${proposal.requestMessage}`);
    });
  } catch (error) {
    console.error('Error paginating through access proposals:', error);
  }
}

// Example 4: Handle case for a file with no access proposals or invalid file ID
async function listProposalsForNonExistentFile() {
  const nonExistentFileId = 'NON_EXISTENT_FILE_ID';
  try {
    const response = await sdk.listAccessProposals(nonExistentFileId);
    if (response.accessProposals.length === 0) {
      console.log(`No access proposals found for file ${nonExistentFileId}.`);
    } else {
      // This part might not be reached if the file ID itself is invalid and causes an error
      console.log('Access Proposals:', response.accessProposals);
    }
  } catch (error) {
    console.error(`Error listing access proposals for ${nonExistentFileId}: ${error.message}`);
    // Example: Check for a specific status code if the error object includes it
    // if (error.status === 404) {
    //   console.log('File not found.');
    // }
  }
}
```
