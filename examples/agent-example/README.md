# 🧠 AI Code Generation Agent

This is an example of a minimal AI-powered coding agent that takes a natural language instruction and generates executable code using an OpenAI-compatible API. It saves the output to a file and maintains a history of generations.

---

## ✨ Features

- 🤖 Accepts tasks like “write code in TypeScript to add two numbers”
- 🧠 Uses OpenAI API to generate code
- 💾 Saves the generated code to `api.ts`
- 🕘 Logs each generation in `history.json` (this is like the small memory, you can give next prompt related to the last one u gave it will understand create code accordingly.)

---

## 🛠️ Setup

### 1. Clone and Install

```bash
git clone https://github.com/<your-username>/microfox.git
cd microfox/examples/agent
npm install
```

> Make sure you have [Node.js](https://nodejs.org/) ≥ 18 and [pnpm](https://pnpm.io) installed.

---

### 2. Add Environment Variable

Create a `.env` file in `examples/agent` with your GitHub PAT key:
I am using the OpenAI api key from the Github marketplace models

```env
GITHUB_TOKEN=sk-...
```

---

### 3. Run the Agent

```bash
npx ts-node src/index.ts
```

It will ask:

```
💬 Enter the task you want the agent to generate code for:
```

Example:

```
💬 Enter the task you want the agent to generate code for:
> write code in typescript to add two numbers
```

This will:

- Create `api.ts` containing the result
- Append the task + output to `history.json`

---


