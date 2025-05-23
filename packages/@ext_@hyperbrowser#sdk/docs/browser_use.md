## Function: `startAndWait`

Starts a Browser Use task and waits for its completion, returning the final result. This function simplifies the process of interacting with web pages through an AI agent by handling the asynchronous task management and returning the data once the task is finished.

**Purpose:**
To execute a Browser Use task and retrieve its results without manually managing the asynchronous task lifecycle.

**Parameters:**

* `options`: <object> *required*
    * `task`: <string> *required* The task to be performed by the AI agent. This should be a clear and concise instruction for the agent to follow.
    * `sessionId`: <string> *optional* An existing session ID to reuse for the task. If provided, the task will be executed within the context of the specified session.
    * `keepBrowserOpen`: <boolean> *optional* Whether to keep the browser session open after the task completes. Defaults to `false`. If `true` and a `sessionId` is provided, the session will remain open after task completion.
    * `sessionOptions`: <object> *optional* Configuration options for the session. These options are only applied if a new session is created (i.e., no `sessionId` is provided).
        * `acceptCookies`: <boolean> *optional* Whether to accept cookies during the session. Defaults to `false`.
        * Additional session options may be available. Refer to the Session API Reference for a complete list.
    * `maxSteps`: <number> *optional* The maximum number of steps the agent can take to complete the task. If the task is not completed within this limit, the function may return an incomplete result.  Defaults to 50.
    * `timeoutMinutes`: <number> *optional* The maximum time (in minutes) the session can remain active. This overrides the team's default session timeout.


**Return Value:**

* <object> An object containing the results of the Browser Use task.
    * `data`: <object> *optional* Contains the results of the task.
        * `finalResult`: <string> *optional* The final result of the task execution. This is the output generated by the AI agent after completing the task.

**Examples:**

```typescript
// Example 1: Minimal usage with required arguments
import { Hyperbrowser } from "@hyperbrowser/sdk";

const hbClient = new Hyperbrowser({ apiKey: process.env.HYPERBROWSER_API_KEY });

const result1 = await hbClient.agents.browserUse.startAndWait({
  task: "What is the title of the first post on Hacker News today?",
});

console.log(`Output:\n${result1.data?.finalResult}`);


// Example 2: Reusing a session and keeping it open
const session = await hbClient.sessions.create();

try {
  const result2 = await hbClient.agents.browserUse.startAndWait({
    task: "What is the title of the first post on Hacker News today?",
    sessionId: session.id,
    keepBrowserOpen: true,
  });

  console.log(`Output:\n${result2.data?.finalResult}`);

  const result3 = await hbClient.agents.browserUse.startAndWait({
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
const result4 = await hbClient.agents.browserUse.startAndWait({
  task: "go to Hacker News and summarize the top 5 posts of the day",
  sessionOptions: {
    acceptCookies: true,
  },
  maxSteps: 100,
  timeoutMinutes: 5
});

console.log(`Output:\n${result4.data?.finalResult}`);


// Example 4: Handling errors
try {
  const result5 = await hbClient.agents.browserUse.startAndWait({
    task: "This is an intentionally invalid task.",
  });
  console.log(`Output:\n${result5.data?.finalResult}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
}

```


## Environment Variables

* **`HYPERBROWSER_API_KEY`**
    * **Display Name:** Hyperbrowser API Key
    * **Description:** Your Hyperbrowser API key. This is required to authenticate with the Hyperbrowser service.
    * **Required:** Yes
    * **Format:** String


