## Function: `startAndWait`

Starts a Computer-Using Agent (CUA) task and waits for its completion, returning the final result. This function simplifies the process of managing asynchronous CUA tasks by handling the monitoring and returning the data once the task is finished.

**Purpose:**
To execute a CUA task and retrieve its result without manually managing the asynchronous task lifecycle.

**Parameters:**

*   `options`: <object> *required*
    *   `task`: <string> *required* The task to be performed by the CUA. This should be a clear and concise instruction for the agent.
    *   `sessionId`: <string> *optional* An existing session ID to reuse for the task. If not provided, a new session will be created.
    *   `keepBrowserOpen`: <boolean> *optional* Whether to keep the browser session open after the task completes. Defaults to `false`.
    *   `sessionOptions`: <object> *optional* Configuration options for the session. Only applicable when creating a new session (no `sessionId` provided).  See the Session API Reference for a full list of options. Example:
        *   `acceptCookies`: <boolean> *optional* Whether to accept cookies.

**Return Value:**

*   <object> An object containing the result of the CUA task.
    *   `data`: <object> *optional*
        *   `finalResult`: <string> *optional* The final result of the CUA task.

**Examples:**

```typescript
// Example 1: Minimal usage with required arguments
import { Hyperbrowser } from "@hyperbrowser/sdk";

import { config } from "dotenv";

config();

const hbClient = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});

const main = async () => {
  const result = await hbClient.agents.cua.startAndWait({
    task: "what are the top 5 posts on Hacker News",
  });

  console.log(`Output:\n${result.data?.finalResult}`);
};

main().catch((err) => {
  console.error(`Error: ${err.message}`);
});

// Example 2: Reusing a session and keeping it open
const main2 = async () => {
  const session = await hbClient.sessions.create();

  try {
    const result = await hbClient.agents.cua.startAndWait({
      task: "What is the title of the first post on Hacker News today?",
      sessionId: session.id,
      keepBrowserOpen: true,
    });

    console.log(`Output:\n${result.data?.finalResult}`);

    const result2 = await hbClient.agents.cua.startAndWait({
      task: "Tell me how many upvotes the first post has.",
      sessionId: session.id,
    });

    console.log(`\nOutput:\n${result2.data?.finalResult}`);
  } catch (err) {
    console.error(`Error: ${err}`);
  } finally {
    await hbClient.sessions.stop(session.id);
  }
};

main2().catch((err) => {
  console.error(`Error: ${err.message}`);
});


// Example 3: Specifying session options
const main3 = async () => {
  const result = await hbClient.agents.cua.startAndWait({
    task: "what are the top 5 posts on Hacker News",
    sessionOptions: {
      acceptCookies: true,
    }
  });

  console.log(`Output:\n${result.data?.finalResult}`);
};

main3().catch((err) => {
  console.error(`Error: ${err.message}`);
});

```


## Environment Variables

*   **HYPERBROWSER_API_KEY**: <string> *required*
    *   Description: The API key for authenticating with the Hyperbrowser service.
    *   Format: A valid API key string.


