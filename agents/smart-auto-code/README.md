# Smart Auto Code Agent

A smart Code agent that generates, runs, and iteratively improves code for your tasks using Google Gemini, with automatic language detection and memory logging.

## Features

- **Natural Language to Code:** Describe what you want to build, and the agent generates code using Gemini.
- **Automatic Language Detection:** Supports Python, JavaScript, TypeScript, Java, C++, Go, Rust, Bash, Ruby, PHP, C#, Swift, and Kotlin.
- **Iterative Error Fixing:** Automatically attempts to fix errors up to 3 times.
- **Memory Logging:** Saves successful prompts and code to a memory file for future reference.

## Installation

1. Install dependencies:

    ```bash
    npm install
    ```

2. Set up your Gemini API key:

    - Create a `.env` file in this directory with the following content:

      ```
      GEMINI_API_KEY=your_gemini_api_key_here
      ```

3. Set up the environment in system before running command for any language like c++, java, python

## Usage

Run the agent from the terminal:

```bash
node main.js
```

You will be prompted:

```
💡 What do you want to build today?
> 
```

Type your task (e.g., `a Python script that prints Fibonacci numbers`), and the agent will generate, run, and improve the code as needed.

## How It Works

1. **Prompt:** You describe your coding task.
2. **Code Generation:** The agent uses Gemini to generate code in the detected language.
3. **Execution:** The code is executed. If errors occur, the agent asks Gemini to fix them (up to 3 attempts).
4. **Memory:** Successful prompts and code are saved to `./memory/logs.json`.

## Example

```
💡 What do you want to build today?
> a Python script that prints Hello, World!

Attempt: 1

Generated Code:
print("Hello, World!")

Success: true
Prompt and code saved to memory.
```

## Project Structure

- `main.js` — CLI entry point.
- `agent.js` — Handles code generation, execution, and improvement.
- `memory_manager.js` — Manages saving successful prompts and code.
- `data.js` — Language detection and execution rules.
- `memory/logs.json` — Stores successful prompts and code.

## Supported Languages

- Python
- JavaScript
- TypeScript
- Java
- C++
- Go
- Rust
- Bash
- Ruby
- PHP
- C#
- Swift
- Kotlin

## Environment Variables

- `GEMINI_API_KEY` (required): Your Google Gemini API key.

## Dependencies

- axios
- dotenv
- fs-extra
- readline
- child_process
- util

## License

MIT