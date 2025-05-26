import fs from 'fs';
import path from 'path';

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: npx tsx scripts/run_agent.ts <agentName> <taskPrompt or pathToPromptFile>');
    process.exit(1);
  }

  const [agentName, ...taskArgs] = args;

  // Dynamically import the chosen agent
  const agentModulePath = path.resolve(__dirname, 'agents', agentName, 'agent.ts');

  if (!fs.existsSync(agentModulePath)) {
    console.error(`Agent not found: ${agentName} at ${agentModulePath}`);
    process.exit(1);
  }

  const agentModule = await import(agentModulePath);
  if (typeof agentModule.run !== 'function') {
    console.error(`Agent ${agentName} does not export a run() function`);
    process.exit(1);
  }

  // Compose prompt from args (support file path or direct prompt)
  let prompt = '';

  if (taskArgs.length === 1 && fs.existsSync(taskArgs[0]) && fs.statSync(taskArgs[0]).isFile()) {
    prompt = fs.readFileSync(taskArgs[0], 'utf-8');
  } else {
    prompt = taskArgs.join(' ');
  }

  await agentModule.run(prompt);
}

main().catch(err => {
  console.error('Error running agent:', err);
  process.exit(1);
});
