## Function: `startAndWait`

Starts a HyperAgent task and waits for its completion, returning the final result.

**Purpose:**
This function simplifies the process of running a HyperAgent task by automatically managing the task lifecycle, including starting the task and monitoring its status until completion. It returns the final result of the task, eliminating the need for manual status checks.

**Parameters:**

* `options`: <object> *required* - An object containing the task parameters and optional configurations.
    * `task`: <string> *required* - The task to be executed by the HyperAgent. This should be a clear and concise description of the desired action.
    * `sessionId`: <string> *optional* - An existing session ID to reuse for the task. If provided, the task will be executed within the specified session.
    * `keepBrowserOpen`: <boolean> *optional* - If `true` and a `sessionId` is provided, the browser session will remain open after the task completes. Defaults to `false`.
    * `sessionOptions`: <object> *optional* - Configuration options for the session. These options are only applied if a new session is created (i.e., no `sessionId` is provided).  See the Session API Reference for a full list of options. Example options include:
        * `acceptCookies`: <boolean> *optional* - Whether to accept cookies in the session.
    * `maxSteps`: <number> *optional* - The maximum number of steps the agent can take to complete the task. If the task is not completed within this limit, the function may return an incomplete result.  Increase this value for more complex tasks.


**Return Value:**

* <object> An object containing the task result and metadata.
    * `data`: <object> *optional* - Contains the result of the task.
        * `finalResult`: <string> *optional* - The final output of the HyperAgent task. This is the main result of the task execution.

**Examples:**

```typescript
// Example 1: Minimal usage with only required arguments
import { Hyperbrowser } from "@hyperbrowser/sdk";
import { config } from "dotenv";

config();

const hbClient = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});

const result1 = await hbClient.agents.hyperAgent.startAndWait({
  task: "What is the title of the first post on Hacker News today?",
});

console.log(`Output:\n${result1.data?.finalResult}`);


// Example 2: Reusing a session and keeping it open
const session = await hbClient.sessions.create();

try {
  const result2 = await hbClient.agents.hyperAgent.startAndWait({
    task: "What is the title of the first post on Hacker News today?",
    sessionId: session.id,
    keepBrowserOpen: true,
  });

  console.log(`Output:\n${result2.data?.finalResult}`);

  const result3 = await hbClient.agents.hyperAgent.startAndWait({
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
const result4 = await hbClient.agents.hyperAgent.startAndWait({
  task: "What is the title of the top post on HackerNews today?",
  sessionOptions: {
    acceptCookies: true,
  },
  maxSteps: 50, // Example: Limiting the number of steps
});

console.log(`Output:\n${result4.data?.finalResult}`);


// Example 4: Handling potential errors
try {
  const result5 = await hbClient.agents.hyperAgent.startAndWait({
    task: "This is a potentially complex task that might fail.",
    maxSteps: 10, // Example: Low step limit to potentially trigger an incomplete result
  });
  if (result5.data?.finalResult) {
    console.log(`Output:\n${result5.data.finalResult}`);
  } else {
    console.log("Task did not complete within the specified steps.");
  }
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


