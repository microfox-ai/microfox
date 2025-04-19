# getAuditLogs

Retrieves audit logs for a workspace.

## Parameters

- **workspaceId** (string): The ID of the workspace.
- **filter** (AuditLogFilter): An object to filter the audit logs.
  - **applicability** (string): Type of logs to retrieve. Can be 'auth-and-security' or 'user-activity'.
  - **pagination** (object, optional): Pagination parameters.

## Return Type

Promise<AuditLogResponse>

## Usage Example

```typescript
const auditLogs = await clickUp.getAuditLogs('YOUR_WORKSPACE_ID', { applicability: 'user-activity' });
console.log(auditLogs);
```