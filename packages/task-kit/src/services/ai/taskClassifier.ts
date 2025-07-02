import { z } from 'zod';
import { GoogleAiProvider } from '@microfox/ai-provider-google';
import { Task, TaskPrioritySchema } from '../../schemas';
import { generateStructuredObject } from './ai-service';

export const preClassificationResultSchema = z.object({
    decision: z
        .enum(['new_task', 'old_task', 'irrelevant'])
        .describe("The decision based on the event content: 'new_task' for new requests, 'old_task' for updates on existing items, 'irrelevant' for conversational text."),
    reason: z.string().describe('A brief explanation for the decision.'),
});

export type PreClassificationResult = z.infer<typeof preClassificationResultSchema>;

const preClassifierSystemPrompt = `
### ROLE
You are a highly efficient message triaging AI. Your single responsibility is to perform a quick, initial analysis of a user's message and categorize its intent.

### GOAL
Categorize the message into one of three distinct types:
1.  **new_task**: The user is clearly asking for an action to be taken or something to be created. This includes direct commands ("Remind me to..."), requests ("Can you create a ticket..."), or scheduling ("Schedule a meeting...").
2.  **old_task**: The user is referencing a previous request or task. Keywords include "update," "follow-up," "done," "finished," or references to a prior conversation topic.
3.  **irrelevant**: The message is conversational, a simple acknowledgment, or lacks a clear, actionable request. Examples: "hello," "thanks!," "sounds good."

### CRITICAL RULES
- Your decision must be based *only* on the text of the message provided. Do not invent context.
- When in doubt, default to **irrelevant**. Only choose 'new_task' or 'old_task' if the user's intent is explicit and unambiguous.
- Your output must be only the JSON object, with no extra text or explanation.

### INTROSPECTION STEP
Before finalizing your decision, ask yourself: Does this message contain a verb or action that I, the assistant, am being asked to perform? If not, it is 'irrelevant'.
`;

export async function preClassifyEvent(
    googleProvider: GoogleAiProvider,
    eventContent: string,
): Promise<PreClassificationResult> {
    const model = googleProvider.languageModel('gemini-1.5-flash-latest');
    const userPrompt = `
      A user has sent the following message:
      ---
      "${eventContent}"
      ---
      Please classify the intent of this message based on the system instructions and provide your response in the required JSON format.
      `;

    return generateStructuredObject({
        model,
        schema: preClassificationResultSchema,
        prompt: userPrompt,
        system: preClassifierSystemPrompt,
    });
}

export const classificationResultSchema = z.object({
    new_task: z
        .object({
            name: z.string().describe('A concise, human-readable name for the task.'),
            ai_description: z.string().describe('A detailed, AI-generated description of the task. This will be stored in the `ai_description` column.'),
            priority: TaskPrioritySchema.describe('The priority of the task.'),
            input: z.any().optional().describe('Any structured data the task needs to execute, as a JSON object.'),
            scheduled_for: z.string().datetime().optional().describe('An ISO 8601 timestamp to schedule the task for a future time.'),
            watcher: z.object({
                provider_name: z.string().describe("The name of the originating provider, e.g., 'slack'."),
                event_type: z.string().describe("The type of event to watch for, e.g., 'message'."),
                match_query: z.record(z.string()).optional().describe("A simple key-value map to match against the event's payload. Values must be strings."),
            }).optional().describe('A rule to automatically trigger this task in the future.'),
        }).optional().describe('The new task to be created. This should be populated based on the event.'),
    notes: z.string().optional().describe('A brief explanation for how the task details were derived from the event.'),
});

export type ClassificationResult = z.infer<typeof classificationResultSchema>;

const taskCreatorSystemPrompt = `
### ROLE
You are a world-class Executive Assistant AI. You have been assigned to process a user request that has been pre-screened and confirmed to be a **new task**. Your job is to extract all relevant details with surgical precision and structure them into a formal task object.

### GOAL
Your goal is to meticulously populate the \`new_task\` JSON object. Every field should be considered and filled in intelligently based on the context provided. Do not leave out details.

### DEEP DIVE: The \`new_task\` Schema Fields
This is the structure you must create. Let's break down each field:

- \`name\` (string, required): This is the task's headline. It should be a short, active summary of the core request.
  - **Good**: "Draft Q4 Sales Report"
  - **Bad**: "user wants a report"

- \`ai_description\` (string, required): This is the detailed body of the task. Be descriptive. Explain the user's goal and include all context.
  - **Action**: Mention *who* requested the task (the sender) and *where* it came from (the provider/event type). This is crucial for context.
  - **Example**: "Task requested by Dave (ID: U12345) via a Slack mention. He needs a reminder to submit the Q3 performance report, which he noted is of high importance."

- \`priority\` (enum, required): You must assess the urgency from the user's message.
  - \`'critical'\`: Life-or-death, system-down scenarios.
  - \`'high'\`: Explicitly mentioned urgency (e.g., "urgent," "ASAP," "by end of day").
  - \`'medium'\`: The default for standard, actionable requests (e.g., "schedule a meeting," "create a ticket").
  - \`'low'\`: Non-urgent tasks or casual reminders (e.g., "remind me to check my email").

- \`input\` (JSON object, optional): If the message contains specific data points, parameters, or entities, capture them here as key-value pairs.
  - **Example Request**: "order a new keyboard, model K860, for user ID 558"
  - **Example \`input\`**: \`{ "item": "keyboard", "model": "K860", "user_id": "558" }\`
  - If the request is simple text, you can omit this field.

- \`scheduled_for\` (ISO 8601 string, optional): Populate this *only* if the user specifies a deadline or a future time.
  - **Action**: Use the provided "Current Time" as your reference to calculate the exact ISO 8601 UTC timestamp.
  - **Warning**: The system does NOT support recurring dates (e.g., "every Monday"). If you see one, schedule only the *very next* occurrence.

- \`watcher\` (object, optional): Use this *only* for requests that explicitly ask for a new automated rule.
  - **Trigger Phrases**: "Every time...", "When a new...", "If this happens, then..."
  - If the user isn't asking to create a new trigger, **do not** create a watcher.

### INTROSPECTION & QUALITY CHECK
Before you output the final JSON, take a moment to review your work.
1.  Is the \`name\` a clear and concise summary?
2.  Does the \`ai_description\` contain all the necessary context, including the sender?
3.  Is the \`priority\` level justified by the language in the request?
4.  If \`scheduled_for\` is set, is the timestamp accurate and in the future?
5.  Is every string field properly escaped for JSON?

Your reputation for precision depends on getting this right every time.
`;

/**
 * Generates the details for a new task based on structured event content.
 * @param googleProvider An instance of the GoogleAiProvider.
 * @param eventDetails An object containing the clean text, provider, event type, and sender.
 * @returns A promise that resolves to the structured task details.
 */
export async function generateTaskDetails(
    googleProvider: GoogleAiProvider,
    eventDetails: {
        cleanText: string;
        providerName: string;
        eventType: string;
        sender: any;
    }
): Promise<ClassificationResult> {
    const model = googleProvider.languageModel('gemini-1.5-flash-latest');
    const userPrompt = `
      An important new task request has arrived. Please process it according to your system instructions.

      ---
      **Request Details:**
      - **From:** ${JSON.stringify(eventDetails.sender)}
      - **Source:** ${eventDetails.providerName} (${eventDetails.eventType})
      - **Message:** "${eventDetails.cleanText}"
      ---

      **Reference Information:**
      - **Current Time:** ${new Date().toISOString()}

      Generate the \`new_task\` JSON object now.
      `;

    return generateStructuredObject({
        model,
        schema: classificationResultSchema,
        prompt: userPrompt,
        system: taskCreatorSystemPrompt,
    });
} 