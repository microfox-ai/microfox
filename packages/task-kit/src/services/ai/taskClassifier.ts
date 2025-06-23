import { z } from 'zod';
import { SupabaseClient } from '@supabase/supabase-js';
import { generateObject } from 'ai';
import { GoogleAiProvider } from '@microfox/ai-provider-google';
import { CreateEventWatcherInputSchema, Task } from '../../schemas';

// --- SCHEMAS FOR AI TASK CLASSIFIER ---
const newTaskSchema = z.object({
  name: z.string().describe('A concise, descriptive name for the task. Max 10 words.'),
  description: z.string().describe('A detailed, step-by-step description of the task to be performed. Be very specific.'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).describe('The priority of the task.'),
  input: z.record(z.unknown()).optional().describe('A JSON object containing any inputs required to start the task.'),
  watcher: CreateEventWatcherInputSchema.omit({ task_id: true, microfox_id: true }).optional().describe('An optional event watcher to automatically trigger this task in the future.'),
});

export const classificationResultSchema = z.object({
    new_tasks: z.array(newTaskSchema).optional().describe("A list of new tasks to be created based on the event."),
    existing_task_ids: z.array(z.string().uuid()).optional().describe("A list of IDs for existing tasks that this event relates to."),
    notes: z.string().optional().describe("A brief explanation for the classification decisions."),
});

export type ClassificationResult = z.infer<typeof classificationResultSchema>;

// --- PROMPT FOR AI TASK CLASSIFIER ---
const taskClassifierSystemPrompt = `You are an expert task management assistant. Your role is to meticulously analyze an incoming event and a list of potentially related existing tasks.
Your goal is to identify ALL relevant actions. The event could be a new request, a follow-up, or contain multiple distinct tasks.
Based on your analysis, you must decide on one or more of the following:
1.  **New Tasks & Watchers:** If the event describes one or more new, distinct pieces of work, define them in the 'new_tasks' array.
    - **Crucially, if a new task should be triggered automatically by future events, define an 'event_watcher' for it.**
    - For example, if the request is "send me a report every Friday", the task should be created, and a watcher should be set up to match a trigger event for Fridays.
    - If the request is "notify me when a user signs up", the watcher's 'match_query' should be designed to find events where 'event_type' is 'user.created'. Use the provided schemas to build an effective 'match_query'.
2.  **Existing Tasks:** If the event is a follow-up, a response, or provides information directly related to ANY of the existing tasks, add their IDs to the 'existing_task_ids' array.
3.  **No Action:** If the event is irrelevant or requires no action, you can return empty arrays.
Your output must be a JSON object that strictly adheres to the provided schema.
--- DATABASE SCHEMAS FOR CONTEXT ---
... (schema details from previous turn) ...
`;

/**
 * Classifies an event by deciding if it maps to new or existing tasks.
 * @param googleProvider An instance of the GoogleAiProvider.
 * @param eventContent The content of the incoming event.
 * @param recentTasks A list of recent tasks for context.
 * @returns A promise that resolves to the classification result.
 */
export async function classifyTask(
  googleProvider: GoogleAiProvider,
  eventContent: unknown,
  recentTasks: Partial<Task>[],
): Promise<ClassificationResult> {
  const model = googleProvider.languageModel('gemini-1.5-flash');
  const userPrompt = `
      **Current Event Content:**
      \`\`\`json
      ${JSON.stringify(eventContent, null, 2)}
      \`\`\`

      **Recent Tasks for Context (found with an intelligent query):**
      \`\`\`json
      ${JSON.stringify(recentTasks ?? [], null, 2)}
      \`\`\`

      Please classify this event based on the system instructions.
      `;

  const { object } = await generateObject({
    model,
    schema: classificationResultSchema,
    prompt: userPrompt,
    system: taskClassifierSystemPrompt,
  });

  return object;
} 