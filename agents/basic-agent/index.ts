import fs from 'fs';
import path from 'path';

interface TaskInput {
  prompt: string;
}

export async function handleTask(input: TaskInput) {
  console.log(`🤖 Coding Agent received prompt: "${input.prompt}"`);

  // Basic logic — generates a JS file that logs the input
  const outputCode = `console.log("Generated code says: ${input.prompt}");`;

  const outputPath = path.join(__dirname, 'generated-output.js');
  fs.writeFileSync(outputPath, outputCode);

  console.log(`✅ Code generated at: ${outputPath}`);
  return outputPath;
}

// Optional auto-run for CLI testing
if (require.main === module) {
  const prompt = process.argv[2] || 'Hello world from agent';
  handleTask({ prompt });
}
