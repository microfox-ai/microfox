# 🧠 Grok AI — Autonomous Coding Agent

# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start

# Make sure Groq API key is in .env and your browser talks to http://localhost:5000.




A smart coding agent that accepts natural language tasks, generates and executes working code, and iteratively improves itself — built as part of the [Microfox AI](https://github.com/microfox-ai/microfox) challenge.

## 🚀 Features

- ✅ Accepts **natural language prompts**
- ⚙️ Uses **Groq API + Mixtral LLM** for code generation
- 💾 Saves generated code dynamically to files
- 🧪 Executes and displays results in real-time
- 🔁 Can take feedback and **iteratively improve** or extend its own capabilities

---

## 🛠️ Tech Stack

- Node.js (for server execution)
- Express.js (API endpoints)
- Groq API (LLM backend)
- Mixtral model (text/code generation)
- JavaScript (agent logic)

---


---

## 🧑‍💻 How It Works

1. **Input Prompt**  
   User provides a task like:  
   _"Create a Node.js API that returns the current date."_

2. **Code Generation**  
   Grok AI uses the Mixtral model via Groq API to generate valid code.

3. **Code Execution**  
   The agent saves the code to a file and runs it automatically.

4. **Iterative Feedback (optional)**  
   You can prompt:  
   _"Now add error handling"_ or _"Add support for timezones"_ — and it modifies the existing code.

---

## 🧪 Usage

### 1. Install Dependencies

```bash
npm install



2. Set Environment Variables
Create a .env file with your Groq API key:

GROQ_API_KEY=your_groq_api_key_here


🧠 Why Grok AI?
Grok AI is designed to bridge human intent and machine code — automating tedious development tasks and accelerating rapid prototyping.

📄 License
MIT — free to use, modify, and share.


🙌 Author
Built with 💡 by Virendra Yadav