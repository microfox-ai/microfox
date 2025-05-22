### 🧠 AI Coding Agent

An intelligent TypeScript-powered agent that generates, executes, and **self-improves** code based on natural language prompts. Built to automate code creation and debugging using LLMs like Gemini or GPT.

---

### 🚀 Features

- ⚡ Convert natural language to executable TypeScript
- 🔄 Iterative improvement on failed execution
- 🧪 Safe, isolated execution using `tsx`
- 🧠 Uses LLMs (e.g., Gemini Flash) for generation and refinement
- 🛠️ Cleans out markdown and commentary—keeps only the code

---

### 📦 Installation

Prerequisites

- Node.js (v16 or later)
- TypeScript
- `tsx` (for running TypeScript directly)

Install required packages:
npm install ai @ai-sdk/google @ai-sdk/anthropic;

---

### 🌐 Environment Variables

- The agent requires a .env file for the Gemini API key. Create a .env file at the root of your project with the following content:
  Make sure to replace your_gemini_api_key_here with your actual API key.

---

### 📂 Project Structure

- scripts/
  └── src/
  └── agents/
  └── myCodingAgents/
  └── index.ts

---

### 🧪 Usage

- Run via CLI:
  npx tsx ./scripts/src/agents/myCodingAgents/index.ts "Create a function that adds two numbers"
- Example
  npx tsx ./scripts/src/agents/myCodingAgents/index.ts "Generate a function to compute the Fibonacci sequence"
- Output:
  Code generated at: ./agent_output/agent_generated-<timestamp>.ts

---

🧠 How It Works

1.Generate – Uses AI to write TypeScript from your prompt.
2.Execute – Runs the code using tsx (optionally via a worker process).
3.Improve – If it fails, the agent captures the error and prompts the AI to fix it.
4.Repeat – Continues until success or maximum attempts are reached.

---

### 📁 Output

- All generated files are saved in:
  ./agent_output/
- With filenames like:
  agent_generated-<timestamp>.ts

---

### 🧬 Programmatic Usage

- You can also use CodingAgent in your code:

  import { CodingAgent } from './scripts/src/agents/myCodingAgents/index';

  const agent = new CodingAgent({ maxAttempts: 5 });

  const filePath = await agent.generate("Create a function to validate an email address");
  console.log("Generated file at:", filePath);

---
