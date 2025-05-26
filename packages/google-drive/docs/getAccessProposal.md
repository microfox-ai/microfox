## Function: `getAccessProposal`

Retrieves a specific access proposal for a file by its ID. Access proposals are requests for access to a file, typically generated when a user tries to access a file they don't have permission for.

**Purpose:**
To fetch the details of a single access proposal, allowing an application to understand the context of an access request (e.g., who requested access, their proposed role, and any comments).

**Parameters:**
- `fileId`: `string` (required) - The ID of the file for which the access proposal was made.
- `proposalId`: `string` (required) - The ID of the access proposal to retrieve.

**Return Value:**
- Type: `Promise<AccessProposalResponse>` (object)
- Description: A promise that resolves to an `AccessProposalResponse` object containing the details of the access proposal.
  - `AccessProposalResponse`: An object representing the access proposal, which may include:
    - `kind`: `string` - Identifies the resource type, `drive#accessProposal`.
    - `id`: `string` - The ID of the access proposal.
    - `accessLevel`: `string` - The access level requested (e.g., `'commenter'`, `'reader'`, `'writer'`).
    - `creationTime`: `string` (date-time) - The time the access proposal was created.
    - `comment`: `string` (optional) - The comment provided by the user when creating the proposal.
    - `proposedBy`: `object` - Information about the user who made the proposal.
      - `displayName`: `string` - The display name of the user.
      - `emailAddress`: `string` - The email address of the user.
      - `photoLink`: `string` - A link to the user's profile photo.
    - `file`: `object` - Information about the file for which access is proposed.
      - `id`: `string` - The ID of the file.
      - `name`: `string` - The name of the file.
      - `mimeType`: `string` - The MIME type of the file.
    - `status`: `string` - The current status of the proposal (e.g., `'pending'`, `'approved'`, `'rejected'`).

**Examples:**
```typescript
// Example 1: Get an access proposal
async function exampleGetAccessProposal() {
  const fileId = 'your-file-id'; // Replace with an actual file ID
  const proposalId = 'your-proposal-id'; // Replace with an actual proposal ID
  try {
    const proposal = await sdk.getAccessProposal(fileId, proposalId);
    console.log('Access Proposal:', proposal);
    if (proposal.status === 'pending') {
      console.log(`Proposal from ${proposal.proposedBy.emailAddress} for ${proposal.accessLevel} access.`);
    }
  } catch (error) {
    console.error('Error getting access proposal:', error);
  }
}
```
