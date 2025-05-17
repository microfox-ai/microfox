# Coding Agent (JavaScript)

This agent generates and executes code from natural language prompts.

## Features
- Accepts task via CLI or `prompts/example_task.txt`
- Uses OpenAI GPT-4 to generate code
- Handles both single and multi-file outputs
- Saves generated files in `output/`
- Automatically runs the generated code
- Tries to fix failed code up to 5 times using error context

## Usage

### 1. Install dependencies:
```bash
npm install
```

### 2. Set your OpenAI API key:
```bash
echo "OPENAI_API_KEY=your_key_here" > .env
```

### 3. Run with a CLI prompt:
```bash
node run_agent.js "Build a simple to-do app using React"
```

Or edit the prompt in `prompts/example_task.txt` and run:
```bash
node run_agent.js
```

Output is saved in the `output/` folder and also the code is printed in the console.