import { MyCodingAgent } from './my_agent/agent.js';
import fs from 'fs';

async function main() {
  const args = process.argv.slice(2);

  let prompt = '';

  if (args.length === 0) {
    // No args — fallback to default prompt file
    const defaultFile = './prompts/example_task.txt';
    if (!fs.existsSync(defaultFile)) {
      console.error(`No prompt provided and default file not found at ${defaultFile}`);
      process.exit(1);
    }
    prompt = fs.readFileSync(defaultFile, 'utf-8');
  } else if (args.length === 1) {
    const possiblePath = args[0];
    if (fs.existsSync(possiblePath) && fs.statSync(possiblePath).isFile()) {
      // Argument is a file path
      prompt = fs.readFileSync(possiblePath, 'utf-8');
    } else {
      // Argument is treated as direct prompt text
      prompt = args[0];
    }
  } else {
    // Multiple arguments: join them as one prompt string
    prompt = args.join(' ');
  }

  const agent = new MyCodingAgent();

  try {
    await agent.run(prompt);
    process.exit(0);
  } catch (err) {
    console.error('Error running the agent:', err);
    process.exit(1);
  }
}

main();
