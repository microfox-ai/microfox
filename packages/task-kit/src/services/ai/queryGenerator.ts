import { z } from 'zod';
import { GoogleAiProvider } from '@microfox/ai-provider-google';
import { generateStructuredObject } from './ai-service';

const queryGeneratorSchema = z.object({
    filters: z
        .object({
            status: z.string().optional().describe("A PostgREST filter fragment, e.g., 'eq.pending' or 'in.(new,open)'. Omit if not needed."),
            priority: z.string().optional().describe("A PostgREST filter fragment, e.g., 'eq.high'. Omit if not needed."),
            task_type: z.string().optional().describe("A PostgREST filter fragment, e.g., 'eq.follow-up'. Omit if not needed."),
            name: z.string().optional().describe("A PostgREST filter fragment, e.g., 'like.*report*'. Omit if not needed."),
            description: z.string().optional().describe("A PostgREST filter fragment, e.g., 'ilike.*onboarding*'. Omit if not needed."),
        })
        .optional()
        .describe('An object of PostgREST filter fragments. Keys are column names.'),
});

export type AiQuery = z.infer<typeof queryGeneratorSchema>;

const queryGeneratorSystemPrompt = `
### ROLE
You are an expert at building PostgREST queries for a Supabase database.

### GOAL
Your goal is to analyze an incoming event and generate a JSON object containing filter fragments to find the most relevant existing tasks. The purpose is to provide context for a subsequent AI agent.

### CONTEXT: DATABASE SCHEMA
You are querying the \`tasks\` table. Here are the columns you can use for filtering:
- \`name\` (text): The title of the task.
- \`description\` (text): A detailed explanation of the task.
- \`status\` (enum): The current status of the task. Possible values are \`'pending', 'scheduled', 'progress', 'input-await', 'completed', 'failed', 'archived'\`.
- \`priority\` (enum): The priority of the task. Possible values are \`'low', 'medium', 'high', 'critical'\`.
- \`task_type\` (enum): The category of the task. Possible values are \`'default', 'watcher', 'scheduled', 'stale'\`.

### RULES
- **DO NOT** include \`microfox_id\` or \`provider_name\` in your filters. They are applied automatically by the system.
- You **MUST** generate values that are valid PostgREST filter fragments.
  - The format is \`operator.value\`. For example, to find tasks with high priority, use \`eq.high\`.
  - Common operators:
    - \`eq\`: equals
    - \`neq\`: not equals
    - \`gt\`: greater than
    - \`lt\`: less than
    - \`gte\`: greater than or equal to
    - \`lte\`: less than or equal to
    - \`like\`: for wildcard text search (use \`*\` as a wildcard)
    - \`ilike\`: for case-insensitive wildcard text search
    - \`in\`: for matching any value in a list (e.g., \`in.(pending,progress)\`)
- If the event content does not imply any specific filters, return an empty object \`{}\`.

### INPUT
You will receive a JSON object representing the current event. Analyze its content to decide which filters are relevant.

### OUTPUT
Your output **MUST** be a JSON object that strictly adheres to this Zod schema:
\`\`\`typescript
z.object({
    filters: z.object({
        status: z.string().optional(),
        priority: z.string().optional(),
        task_type: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
    }).optional()
})
\`\`\`

**Examples**:
- **Event**: A user mentions needing an "urgent report on the Q3 financials".
  - **Output**: \`{ "filters": { "priority": "eq.high", "name": "like.*Q3 financials*", "description": "ilike.*report*" } }\`
- **Event**: An automated alert for a "failed payment".
  - **Output**: \`{ "filters": { "name": "ilike.*payment*", "status": "eq.failed" } }\`
- **Event**: A generic message like "thanks!".
  - **Output**: \`{ "filters": {} }\`
`;

/**
 * Uses an AI model to generate a dynamic Supabase query filter based on the event content.
 * @param googleProvider An instance of the GoogleAiProvider.
 * @param eventContent The content of the incoming event.
 * @returns A promise that resolves to the generated query object or null.
 */
export async function generateTaskQuery(
    googleProvider: GoogleAiProvider,
    eventContent: unknown,
): Promise<AiQuery | null> {
    const model = googleProvider.languageModel('gemini-1.5-flash-latest');

    try {
        const result = await generateStructuredObject({
            model,
            schema: queryGeneratorSchema,
            prompt: `
      **Current Event Content:**
      \`\`\`json
      ${JSON.stringify(eventContent, null, 2)}
      \`\`\`
      Please generate the query filter object based on these event details.
      `,
            system: queryGeneratorSystemPrompt,
        });

        return result;
    } catch (error: any) {
        if (error.message.includes('No object generated') && error.text) {
            console.warn('[TaskKit] AI response was not clean JSON. Attempting to recover...');
            try {
                const cleanedText = error.text.substring(error.text.indexOf('{'), error.text.lastIndexOf('}') + 1);
                const parsed = JSON.parse(cleanedText);
                console.log('[TaskKit] Successfully recovered and parsed AI response.');
                return queryGeneratorSchema.parse(parsed);
            } catch (recoveryError) {
                console.error('[TaskKit] Failed to recover from malformed AI response:', recoveryError);
            }
        }
        console.error('[TaskKit] Failed to generate task query:', error);
        return null;
    }
} 