// index.ts
// Main entrypoint for the coding agent. Accepts input, generates code, deploys it, saves state.

import readline from "readline";
import { createPrompt, formatPrompt, Task } from "./prompt";
import { generateCode } from "./generator";
import { deployCode } from "./deployer";
import { improveCode } from "./improver";
import { loadState, saveState } from "./state";
import { log } from "./utils/logger";

// Create CLI interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  log("AI Coding Agent Started.");

  const input = await ask("Enter your coding task: ");
  const task: Task = createPrompt(input);

  log("Prompt created.");
  console.log(formatPrompt(task));

  let code = await generateCode(task);
  log("Code generation complete.");
  console.log("\nGenerated Code:\n" + code);

  const filePath = deployCode(code, task.id, task.language);
  log("Code deployed to: " + filePath);

  while (true) {
    const shouldImprove = await ask("Would you like to improve the code further? (yes/no): ");
    if (shouldImprove.toLowerCase() !== "yes") break;

    code = await improveCode(code);
    console.log("\nImproved Code:\n" + code);
  }

  const state = loadState();
  state.tasks.push(task);
  saveState(state);
  log("Task saved to history.");

  rl.close();
}

main();
