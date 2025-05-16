## 🧠 AI Code Generation Agent

This agent takes a prompt (like "Build a counter app in JavaScript") and:

1. Uses OpenAI to generate the code
2. Saves it to `generated/index.js`
3. Automatically runs it
4. If there's an error, it asks the LLM to fix it and retries (up to 3 times)

### 🛠 How to Run

```bash
npm install
OPENAI_API_KEY=your-key-here
tsc -b && node dist/index.js
