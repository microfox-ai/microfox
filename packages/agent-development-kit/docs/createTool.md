## Function: `createTool`

Creates a tool.

**Purpose:**
Creates a new tool instance.

**Parameters:**
- `config`: Omit<Tool, 'run'>, required. The tool configuration without the `run` function.
  - `name`: string. Name of the tool.
  - `description`: string. Description of the tool.

**Return Value:**
- `Tool`: The created tool.
  - Includes all properties from the input `config`.
  - `run`: function(input: any, context: ToolContext): Promise<any>. Function to execute the tool.
    - `input`: any. Input for the tool.
    - `context`: ToolContext. Context for the tool execution.
      - `session`: Session. The current session.
        - `id`: string. Unique identifier for the session.
        - `state`: Record<string, unknown>. Current state of the session.
        - `events`: array<Event>. List of events in the session.
          - `id`: string. Unique identifier for the event.
          - `timestamp`: Date. Timestamp of when the event occurred.
          - `author`: string. Author of the event.
          - `actions`: array<unknown>. Actions associated with the event.
      - `getAuthResponse`: function(): AuthResponse | null. Returns the authentication response.
        - `accessToken`: string. Access token for authentication.
        - `refreshToken`: string, optional. Refresh token for authentication.
        - `expiresAt`: number, optional. Expiration timestamp for the access token.
      - `requestCredential`: function(authConfig: AuthConfig): Promise<void>. Requests a credential.
        - `authConfig`: AuthConfig. Authentication configuration.
          - `type`: "api_key" | "oauth2". Type of authentication.

**Examples:**
```typescript
const tool = adk.createTool({
  name: "myTool",
  description: "My custom tool",
});

const result = await tool.run({ data: "someData" }, { session: session });
console.log(result);
```