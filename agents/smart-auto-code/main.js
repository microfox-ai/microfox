import readline from "readline";
import { generateCode, runCode, improveCode } from "./agent.js";
import { saveToMemory } from "./memory_manager.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("💡 What do you want to build today?\n> ", async (task) => {
  let attempt = 0;
  const maxAttempts = 3;
  let originalTask = task;
  
  console.log(`\nAttempt: ${attempt + 1}`);
  let code = await generateCode(task);

  while (attempt < maxAttempts) {
    console.log(`\nGenerated Code:\n${code}`);

    try {
      const { success, output } = await runCode(code, originalTask);

      if (success) {
        console.log(`\nSuccess: ${success}`);
        await saveToMemory(originalTask, code);
        break;
      } else {
        console.log(`\nError:\n${output}`);
        code = await improveCode(code, output);
        attempt++;
      }
    } catch (err) {
      console.log(`\nError:\n${err.output || err}`);
      code = await improveCode(code, err.output || err);
      attempt++;
    }
  }


  if (attempt === maxAttempts) {
    console.log("Failed to get a working version after 3 attempts.");
  }

  rl.close();
});