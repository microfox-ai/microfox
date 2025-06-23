import { z } from 'zod';
import { GoogleAiProvider } from '@microfox/ai-provider-google';
import { generateStructuredObject } from './ai-service';

// --- SCHEMAS FOR AI QUERY GENERATOR ---
const queryFilterSchema = z.object({
  column: z.string().describe("The name of the column in the 'tasks' table to filter on."),
  operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'in'])
    .describe('The filter operator to use.'),
  value: z.any().describe('The value for the filter. For the "in" operator, this should be an array.'),
});

const queryGeneratorSchema = z.object({
  and: z.array(queryFilterSchema)
    .optional()
    .describe('An array of filters to be applied with AND logic. Do not include microfox_id or provider_name here.'),
  or: z.string()
    .optional()
    .describe("A PostgREST filter string for OR conditions, e.g., 'status.eq.pending,priority.eq.high'."),
});

type AiQuery = z.infer<typeof queryGeneratorSchema>;

// --- PROMPT FOR AI QUERY GENERATOR ---
const queryGeneratorSystemPrompt = `You are a Supabase query expert. Your task is to generate a JSON filter object to find tasks relevant to an incoming event.
You MUST ONLY generate filters based on the event's content to find the most relevant context.
DO NOT include 'microfox_id' or 'provider_name' in your generated filters; they are applied automatically and are mandatory.
Here is the schema for the 'tasks' table you can query:
- \`id\` (uuid), \`name\` (text), \`description\` (text), \`status\` (enum), \`priority\` (enum), \`task_type\` (enum), \`input\` (jsonb), \`created_at\` (timestamp)
Analyze the event content to infer the best filters. For example, if the event mentions "urgent", you might filter for high-priority tasks.
Your output MUST be a JSON object matching the defined schema.`;

/**
 * Uses an AI model to generate a dynamic Supabase query filter based on the event content.
 * @param googleProvider An instance of the GoogleAiProvider.
 * @param eventContent The content of the incoming event.
 * @returns A promise that resolves to the generated AiQuery object.
 */
export async function generateTaskQuery(
  googleProvider: GoogleAiProvider,
  eventContent: unknown,
): Promise<AiQuery> {
  const model = googleProvider.languageModel('gemini-1.5-flash');
  const userPrompt = `
      **Current Event Content:**
      \`\`\`json
      ${JSON.stringify(eventContent, null, 2)}
      \`\`\`
      Please generate the query filter object based on these event details.
      `;

  return generateStructuredObject({
    model,
    schema: queryGeneratorSchema,
    prompt: userPrompt,
    system: queryGeneratorSystemPrompt,
  });
} 