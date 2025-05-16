require("dotenv").config();
import OpenAI from "openai";
import 'dotenv/config';
import fs from "fs";
import { spawn } from "child_process";
import readline from "readline";
import path from "path";


const token = process.env["OPENAI_API_KEY"];
const endpoint = "https://models.inference.ai.azure.com";
const model = "gpt-4.1-mini"; 

// Setup CLI prompt
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define where to save the generated code
const OUTPUT_DIR = path.join(process.cwd(), "generated");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "index.js");

// =======================================
// MAIN FUNCTION
// =======================================
// Accepts user prompt, generates code using LLM,
// saves to file, runs it, and improves it if it fails.

const systemPrompt = `
You are a senior AI coding agent.

Your job is to:
- Accept natural language tasks or prompts from users.
- Generate fully working, production-ready code in response.
- If the solution requires multiple files or folders, structure them clearly with file names and contents.
- Ensure the code is directly executable without additional explanation or wrapping in markdown (no \`\`\` code blocks).
- After generating code, analyze the output or feedback, and improve or extend the solution if necessary.
- Use clear, modular, and efficient code practices.
- When iteratively improving, use previous code and errors/output logs to refine the solution, fix bugs, or add functionality intelligently.

Your output should always be complete, runnable, and reflect best software engineering practices.
`;


async function main(prompt: string, iteration = 1, maxIterations = 3) {
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  console.log("\n\nGenerated Code:\n");
  let output = "";

  // Request OpenAI to generate code with streaming enabled
  const stream = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      { role: "user", content: prompt }
    ],
    model: model,
    temperature: 0.4,
    max_tokens: 8000,
    top_p: 1,
    stream: true
  });

  // Stream the code output
  for await (const chunk of stream) {
    const content = chunk.choices?.[0]?.delta?.content;
    if (content) {
      process.stdout.write(content); 
      output += content;         
    }
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

  // Save the generated code to a file
  fs.writeFileSync(OUTPUT_FILE, output);

  // Run the code and capture output or error
  const { stdout, stderr } = await runGeneratedCode();

  // If there's an error, improve the code and retry (up to maxIterations)
  if (stderr && iteration < maxIterations) {
    console.log(`\n\nError Detected:\n${stderr}`);
    console.log(`\n Re-prompting to fix the error (Attempt ${iteration + 1}/${maxIterations})...\n`);
    const fixed = await improveCode(output, stderr);
    fs.writeFileSync(OUTPUT_FILE, fixed);
    return main(fixed, iteration + 1, maxIterations);
  }


  console.log(`\n\nExecution Output:\n${stdout || "✅ Success with no output."}`);
}

// =======================================
// EXECUTE THE GENERATED CODE
// =======================================
// Runs the generated JavaScript file using Node.js

async function runGeneratedCode(): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn("node", [OUTPUT_FILE]);

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", () => {
      resolve({ stdout, stderr });
    });
  });
}

// =======================================
// IMPROVE THE CODE ON ERROR
// =======================================
// Sends the original code and the error message back to the LLM for correction

async function improveCode(code: string, feedback: string): Promise<string> {
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  const response = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a senior developer. The following code has an issue. Use the feedback to improve it."
      },
      { role: "user", content: `Code:\n${code}\n\nError:\n${feedback}` }
    ],
    model: model,
    temperature: 0.6,
    max_tokens: 8000,
    top_p: 1
  });

  return response.choices[0].message.content || "";
}


// =======================================
// TERMINAL INPUT LOOP
// =======================================
// Continuously accepts user prompts and passes them to `main()`

function promptUser() {
  rl.question("\nEnter your project description (or type 'q' to quit): ", async (answer) => {
    if (answer.trim().toLowerCase() === "q") {
      rl.close();
      return;
    }

    try {
      await main(answer);
    } catch (err) {
      console.error("Error:", err);
    }

    promptUser(); 
  });
}

promptUser(); 
