## Function: `getAccountInformation`

Retrieves the account information associated with the API key currently in use. This includes user details and API usage statistics.

**Purpose:**
To programmatically check account details, monitor API usage, and track remaining credits.

**Parameters:**
This function does not take any parameters.

**Return Value:**

- **`Promise<AccountInformation>`**: A promise that resolves to an `AccountInformation` object.
  - **`AccountInformation`** (object):
    - **`id`** (string): The unique identifier for the account.
    - **`name`** (string): The name of the account holder.
    - **`email`** (string): The email address associated with the account.
    - **`createdAt`** (string): The ISO 8601 timestamp of when the account was created.
    - **`apiUsage`** (object): An object containing API usage data.
      - **`totalRequests`** (number): The total number of API requests made.
      - **`remainingCredits`** (number): The number of credits remaining in the account.

**Examples:**

```typescript
// Example: Fetching account information
try {
  const accountInfo = await klingai.getAccountInformation();
  console.log('Account Name:', accountInfo.name);
  console.log('Remaining Credits:', accountInfo.apiUsage.remainingCredits);
} catch (error) {
  console.error('Failed to get account information:', error);
}
```