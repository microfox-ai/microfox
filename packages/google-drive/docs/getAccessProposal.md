## Function: `getAccessProposal`

Retrieves a specific access proposal for a file by its ID. Access proposals are requests made by users to gain access to a file they currently cannot view or edit.

**Purpose:**
To fetch the details of a single access proposal, allowing the application to understand the request, who made it, and what level of access is being requested.

**Parameters:**

-   `fileId` (string): Required. The ID of the file for which the access proposal was made.
-   `proposalId` (string): Required. The ID of the access proposal to retrieve.

**Return Value:**

-   Type: `Promise<AccessProposalResponse>`
-   Description: A promise that resolves to an `AccessProposalResponse` object containing the details of the specified access proposal.
-   Error cases: Throws an error if the API request fails (e.g., file not found, proposal not found, authentication issues, or insufficient permissions).

**Type Definitions:**

*   `AccessProposalResponse`:
    ```typescript
    type AccessProposalResponse = {
      fileId: string; // The ID of the file this proposal pertains to.
      proposalId: string; // The ID of this access proposal.
      requesterEmailAddress: string; // The email address of the user who made the access request.
      recipientEmailAddress: string; // The email address of the user to whom the access request was sent (usually the file owner or someone with sharing permissions).
      rolesAndViews: Array<RoleAndView>; // The roles and/or views requested in the proposal.
      requestMessage: string; // The message included by the requester with their proposal.
      createTime: string; // The time this access proposal was created, in RFC 3339 date-time format.
    };
    ```

*   `RoleAndView`:
    ```typescript
    type RoleAndView = {
      role: 'writer' | 'commenter' | 'reader'; // The role being requested (e.g., writer, commenter, reader).
      view?: string; // An optional specific view being requested (e.g., a specific named view in a Google Sheet). The exact meaning can depend on the application that created the file.
    };
    ```

**Examples:**

```typescript
// Assuming 'sdk' is an initialized instance of GoogleDriveSdk

// Example 1: Get an access proposal with valid fileId and proposalId
async function getSpecificAccessProposal() {
  const fileId = 'TARGET_FILE_ID';         // Replace with an actual file ID
  const proposalId = 'TARGET_PROPOSAL_ID'; // Replace with an actual proposal ID
  try {
    const proposal = await sdk.getAccessProposal(fileId, proposalId);
    console.log('Access Proposal Details:', proposal);
    console.log(`Requester: ${proposal.requesterEmailAddress}`);
    console.log(`Requested Roles/Views: ${JSON.stringify(proposal.rolesAndViews)}`);
  } catch (error) {
    console.error(`Error fetching access proposal ${proposalId} for file ${fileId}:`, error);
  }
}

// Example 2: Handle cases where the file or proposal does not exist
async function getNonExistentAccessProposal() {
  const fileId = 'NON_EXISTENT_FILE_ID';
  const proposalId = 'NON_EXISTENT_PROPOSAL_ID';
  try {
    const proposal = await sdk.getAccessProposal(fileId, proposalId);
    console.log('Access Proposal Details:', proposal); // This line is not expected to be reached
  } catch (error) {
    // Error handling for 404 Not Found or other API errors
    console.error(`Failed to fetch access proposal: ${error.message}`);
    // Example: Check for a specific status code if the error object includes it
    // if (error.status === 404) {
    //   console.log('File or proposal not found.');
    // }
  }
}
```
