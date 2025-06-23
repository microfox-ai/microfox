import { z } from 'zod';
import { generateObject } from 'ai';
import { GoogleAiProvider } from '@microfox/ai-provider-google';
import { Task } from '../../schemas';

// --- SCHEMAS FOR AI TOOL SELECTOR ---
const toolCallSchema = z.object({
  tool_name: z.string().describe('The exact name of the tool to be called.'),
  arguments: z.record(z.unknown()).describe('An object containing the arguments for the tool.'),
});

export const toolSelectionResultSchema = z.object({
  tool_calls: z.array(toolCallSchema).describe('A list of tool calls to be executed in sequence.'),
  notes: z.string().optional().describe('A brief explanation for why these tools were chosen.'),
});

export type ToolSelectionResult = z.infer<typeof toolSelectionResultSchema>;

// --- PROMPT FOR AI TOOL SELECTOR ---
const getToolSelectorSystemPrompt = (availableTools: any[]): string => `
You are an expert at decomposing a task into a sequence of concrete tool calls.
Based on the task's goal and the available tools, you must decide which tools to call, in what order, and with what arguments.

**Task Goal:**
The user wants to accomplish the objective described in the task's 'name' and 'ai_description'.

**Your Job:**
1.  Analyze the task's details and its input data.
2.  Examine the list of available tools and their schemas.
3.  Generate a sequence of one or more tool calls that will accomplish the task's goal.
4.  You can use the output of one tool as the input for a subsequent tool, but you must reason about this yourself. The execution environment does not yet support dynamic output-to-input mapping.
5.  If no tools are suitable for the task, return an empty 'tool_calls' array.

Your output MUST be a JSON object that strictly adheres to the provided schema.

--- AVAILABLE TOOLS ---
${JSON.stringify(availableTools, null, 2)}
`;

/**
 * Selects which tools to call to accomplish a task's goal.
 * @param googleProvider An instance of the GoogleAiProvider.
 * @param task The task to be executed.
 * @param availableTools An array of schemas for the available tools.
 * @returns A promise that resolves to the tool selection result.
 */
export async function selectTools(
  googleProvider: GoogleAiProvider,
  task: Task,
  availableTools: any[],
): Promise<ToolSelectionResult> {
  const model = googleProvider.languageModel('gemini-1.5-flash');
  const systemPrompt = getToolSelectorSystemPrompt(availableTools);
  const userPrompt = `
      **Task Details:**
      \`\`\`json
      ${JSON.stringify(task, null, 2)}
      \`\`\`
      Please generate the sequence of tool calls required to complete this task.
      `;

  const { object } = await generateObject({
    model,
    schema: toolSelectionResultSchema,
    prompt: userPrompt,
    system: systemPrompt,
  });

  return object;
} 