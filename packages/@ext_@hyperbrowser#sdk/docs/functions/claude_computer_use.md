## Function: `startAndWait`

Starts a Claude Computer Use task and waits for it to complete, returning the final result.

**Purpose:**
This function simplifies the process of running a Claude Computer Use task by handling the asynchronous task management and returning the result directly.

**Parameters:**

*   `options`: <object> *required*
    *   `task`: <string> *required* The task to be performed by Claude. This should be a clear and concise instruction.
    *   `sessionId`: <string> *optional* An existing session ID to reuse. If not provided, a new session will be created.
    *   `keepBrowserOpen`: <boolean> *optional* Whether to keep the browser session open after the task completes. Defaults to `false`.
    *   `sessionOptions`: <object> *optional* Configuration options for the session. Only applies when creating a new session (no `sessionId` provided).
        *   `acceptCookies`: <boolean> *optional* Whether to accept cookies. Defaults to `false`.


**Return Value:**

*   <object>
    *   `data`: <object> *optional*
        *   `finalResult`: <string> *optional* The final result of the task execution.

**Examples:**

```typescript
// Example 1: Minimal usage with only required arguments
import { Hyperbrowser } from "@hyperbrowser/sdk";

import * as dotenv from 'dotenv';
dotenv.config();

const hbClient = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});

const result1 = await hbClient.agents.claudeComputerUse.startAndWait({
  task: "what are the top 5 posts on Hacker News",
});

console.log(`Output:\n${result1.data?.finalResult}`);


// Example 2: Reusing a session and keeping it open
const session = await hbClient.sessions.create();

try {
  const result2 = await hbClient.agents.claudeComputerUse.startAndWait({
    task: "What is the title of the first post on Hacker News today?",
    sessionId: session.id,
    keepBrowserOpen: true,
  });

  console.log(`Output:\n${result2.data?.finalResult}`);

  const result3 = await hbClient.agents.claudeComputerUse.startAndWait({
    task: "Tell me how many upvotes the first post has.",
    sessionId: session.id,
  });

  console.log(`\nOutput:\n${result3.data?.finalResult}`);
} catch (err) {
  console.error(`Error: ${err}`);
} finally {
  await hbClient.sessions.stop(session.id);
}


// Example 3: Specifying session options
const result4 = await hbClient.agents.claudeComputerUse.startAndWait({
  task: "what are the top 5 posts on Hacker News",
  sessionOptions: {
    acceptCookies: true,
  }
});

console.log(`Output:\n${result4.data?.finalResult}`);

```


## Environment Variables

*   **HYPERBROWSER_API_KEY**: <string> *required*
    *   Description: The API key for authenticating with Hyperbrowser.
    *   Format: A valid API key string.


## Constructor: `Hyperbrowser`

Initializes a new instance of the Hyperbrowser SDK client.

**Purpose:**
Creates a client object for interacting with the Hyperbrowser API.

**Parameters:**

*   `options`: <object> *required*
    *   `apiKey`: <string> *required* The API key for authenticating with Hyperbrowser.

**Return Value:**

*   A new `Hyperbrowser` client instance.

**Examples:**

```typescript
import { Hyperbrowser } from "@hyperbrowser/sdk";

import * as dotenv from 'dotenv';
dotenv.config();

const hbClient = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});
```
