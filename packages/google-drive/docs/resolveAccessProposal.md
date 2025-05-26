## Function: `resolveAccessProposal`

Resolves an access proposal for a file by either approving or rejecting the requested access. This action typically grants or denies the user the specified level of access to the file.

**Purpose:**
To allow an application (or a user through an application) to act upon a pending access proposal. This is a key function for managing file access requests.

**Parameters:**
- `fileId`: `string` (required) - The ID of the file to which the access proposal pertains.
- `proposalId`: `string` (required) - The ID of the access proposal to resolve.
- `request`: `ResolveAccessProposalRequest` (object, required) - An object containing the resolution details.
    - `ResolveAccessProposalRequest`:
        - `action`: `string` (required) - The action to take on the proposal. Valid values are `'approve'` or `'reject'`.
        - `role`: `string` (optional, required if action is `'approve'`) - The role to grant the user if the proposal is approved. Common values include `'reader'`, `'commenter'`, `'writer'`. This should match or be compatible with the `accessLevel` in the proposal.
        - `message`: `string` (optional) - A message to include with the resolution, which may be sent to the user who made the proposal.

**Return Value:**
- Type: `Promise<void>`
- Description: A promise that resolves when the access proposal has been successfully resolved. It does not return any specific data on success.
- Error cases: Throws an error if the resolution fails (e.g., invalid `fileId`, `proposalId`, or `action`, or if the user does not have permission to resolve the proposal).

**Examples:**
```typescript
// Example 1: Approve an access proposal
async function exampleApproveAccessProposal() {
  const fileId = 'your-file-id';       // Replace with an actual file ID
  const proposalId = 'your-proposal-id'; // Replace with an actual proposal ID
  const resolutionRequest: ResolveAccessProposalRequest = {
    action: 'approve',
    role: 'reader', // Grant reader access
    message: 'Your request for read access has been approved.'
  };

  try {
    await sdk.resolveAccessProposal(fileId, proposalId, resolutionRequest);
    console.log(`Access proposal ${proposalId} for file ${fileId} approved.`);
  } catch (error) {
    console.error('Error approving access proposal:', error);
  }
}

// Example 2: Reject an access proposal
async function exampleRejectAccessProposal() {
  const fileId = 'your-file-id';       // Replace with an actual file ID
  const proposalId = 'your-proposal-id'; // Replace with an actual proposal ID
  const resolutionRequest: ResolveAccessProposalRequest = {
    action: 'reject',
    message: 'Your request for access has been denied at this time.'
  };

  try {
    await sdk.resolveAccessProposal(fileId, proposalId, resolutionRequest);
    console.log(`Access proposal ${proposalId} for file ${fileId} rejected.`);
  } catch (error) {
    console.error('Error rejecting access proposal:', error);
  }
}
```
