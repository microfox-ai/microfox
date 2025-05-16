// scripts/src/myCodingAgent.ts
import { generateText } from 'ai';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import dedent from 'dedent';
import { models } from './ai/models'; // Using Microfox's pre-configured models
import { logUsage } from './ai/usage/usageLogger'; // Using Microfox's usage logger
// Note: 'dotenv/config' is implicitly loaded by models.ts or other core Microfox scripts

// --- Zod Schemas for Input Validation ---
const GenerationTaskSchema = z.object({
  taskDescription: z
    .string()
    .min(10, {
      message: 'Task description must be at least 10 characters long.',
    }),
});
type GenerationTaskArgs = z.infer<typeof GenerationTaskSchema>;

const ImprovementTaskSchema = z.object({
  filePath: z
    .string()
    .refine(fs.existsSync, { message: 'File for improvement does not exist.' }),
  feedback: z
    .string()
    .min(10, { message: 'Feedback must be at least 10 characters long.' }),
});
type ImprovementTaskArgs = z.infer<typeof ImprovementTaskSchema>;

// --- Core Agent Logic ---

/**
 * Generates TypeScript code based on a task description and saves it to a file.
 * @param args - The arguments for the generation task.
 * @returns The path to the generated file, or undefined if an error occurs.
 */
export async function generateCode(
  args: GenerationTaskArgs,
): Promise<string | undefined> {
  try {
    const { taskDescription } = GenerationTaskSchema.parse(args);
    console.log(`🧠 Starting code generation task: "${taskDescription}"`);

    const systemPrompt = dedent`
      You are an expert TypeScript coding agent. You will be given a task description.
      Your goal is to generate a complete, working TypeScript code snippet or module that fulfills the task.
      The code should be self-contained or clearly specify its dependencies if any.
      Ensure the code is well-commented (e.g., JSDoc) and follows TypeScript best practices.
      Only output the TypeScript code block itself. Do not include any explanatory text before or after the code block.
    `;

    const { text: generatedCode, usage } = await generateText({
      model: models.googleGeminiFlash,
      system: systemPrompt,
      prompt: taskDescription,
    });

    logUsage(models.googleGeminiFlash.modelId, usage);
    console.log('💡 LLM Usage (Generation):', usage);

    // Clean up common markdown code block fences
    const cleanedCode = generatedCode
      .replace(/^```[a-zA-Z]*\s*\n?|\n?```$/g, '')
      .trim();

    const outputDir = path.join(__dirname, '..', 'my_agent_output'); // Output dir relative to scripts/
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputFileName = `generated_code_${Date.now()}.ts`;
    const outputFilePath = path.join(outputDir, outputFileName);
    fs.writeFileSync(outputFilePath, cleanedCode);

    console.log(`✅ Code generated and saved to: ${outputFilePath}`);
    return outputFilePath;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        '❌ Validation Error (Generation Task):',
        error.flatten().fieldErrors,
      );
    } else {
      console.error('❌ Error in generateCode:', error);
    }
    return undefined;
  }
}

/**
 * Improves existing TypeScript code in a file based on user feedback.
 * @param args - The arguments for the improvement task.
 * @returns The path to the improved file, or undefined if an error occurs.
 */
export async function improveCode(
  args: ImprovementTaskArgs,
): Promise<string | undefined> {
  try {
    const { filePath, feedback } = ImprovementTaskSchema.parse(args);
    const absoluteFilePath = path.resolve(filePath); // Ensure we have an absolute path

    console.log(
      `🧠 Improving code in ${absoluteFilePath} based on feedback: "${feedback}"`,
    );

    const existingCode = fs.readFileSync(absoluteFilePath, 'utf-8');

    const improvementSystemPrompt = dedent`
      You are an expert TypeScript code improvement agent.
      You will be given an existing TypeScript code snippet and user feedback or an error description.
      Your goal is to provide an improved version of the TypeScript code that addresses the feedback.
      Ensure the improved code is well-commented (e.g., JSDoc) and follows TypeScript best practices.
      Only output the improved TypeScript code block itself. Do not include any explanatory text before or after the code block.
    `;
    const improvementUserPrompt = dedent`
      ## Existing Code:
      \`\`\`typescript
      ${existingCode}
      \`\`\`

      ## User Feedback/Error:
      "${feedback}"

      Please provide the improved TypeScript code that addresses the feedback.
    `;

    const { text: improvedCodeResponse, usage } = await generateText({
      model: models.googleGeminiFlash,
      system: improvementSystemPrompt,
      prompt: improvementUserPrompt,
    });

    logUsage(models.googleGeminiFlash.modelId, usage);
    console.log('💡 LLM Usage (Improvement):', usage);

    const cleanedImprovedCode = improvedCodeResponse
      .replace(/^```[a-zA-Z]*\s*\n?|\n?```$/g, '')
      .trim();

    fs.writeFileSync(absoluteFilePath, cleanedImprovedCode);
    console.log(`✅ Code in ${absoluteFilePath} improved and saved.`);
    return absoluteFilePath;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        '❌ Validation Error (Improvement Task):',
        error.flatten().fieldErrors,
      );
    } else {
      console.error('❌ Error in improveCode:', error);
    }
    return undefined;
  }
}

// --- CLI Runner ---
async function mainCli() {
  const [commandOrTask, ...args] = process.argv.slice(2);

  if (!commandOrTask) {
    console.log('Usage:');
    console.log(
      '  Generation: npx tsx ./scripts/src/myCodingAgent.ts "<task_description>"',
    );
    console.log(
      '  Improvement: npx tsx ./scripts/src/myCodingAgent.ts IMPROVE "<path_to_file>" "<feedback>"',
    );
    process.exit(1);
  }

  if (commandOrTask.toUpperCase() === 'IMPROVE') {
    const [filePath, feedback] = args;
    if (!filePath || !feedback) {
      console.error(
        'For improvement, please provide the file path and feedback.',
      );
      console.log(
        '  Improvement: npx tsx ./scripts/src/myCodingAgent.ts IMPROVE "<path_to_file>" "<feedback>"',
      );
      process.exit(1);
    }
    await improveCode({ filePath, feedback });
  } else {
    // Assume it's a generation task if not 'IMPROVE'
    const taskDescription = commandOrTask; // The first argument is the task
    if (args.length > 0) {
      // If there are more arguments, it's likely a mistake for generation
      console.warn(
        'Warning: Additional arguments provided for generation task will be ignored.',
      );
    }
    await generateCode({ taskDescription });
  }
}

if (require.main === module) {
  mainCli().catch(error => {
    console.error('❌ Unhandled error in CLI execution:', error);
    process.exit(1);
  });
}
