import { z } from 'zod';

export const TaskStatusSchema = z.enum([
    'pending',
    'scheduled',
    'progress',
    'input-await',
    'completed',
    'failed',
    'archived',
]).describe('The current status of a task.');
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskTypeSchema = z.enum(['default', 'watcher', 'scheduled', 'stale'])
  .describe('The type of the task, indicating its primary function.');
export type TaskType = z.infer<typeof TaskTypeSchema>;

export const TaskPrioritySchema = z.enum(['low', 'medium', 'high', 'critical'])
  .describe('The priority level of a task.');
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;

export const TaskSchema = z.object({
  id: z.string().uuid().describe('The internal unique identifier for the task.'),
  microfox_id: z.string().describe('The project/workspace ID this task belongs to.'),
  created_at: z.string().datetime().describe('The timestamp when the task was created.'),
  updated_at: z.string().datetime().describe('The timestamp when the task was last updated.'),
  scheduled_for: z.string().datetime().optional().nullable().describe('For scheduling tasks to run at a specific time.'),
  expires_at: z.string().datetime().optional().nullable().describe('A timestamp after which the task should not be executed.'),
  name: z.string().optional().nullable().describe('A human-readable name for the task type, e.g., "ProcessStripeWebhook".'),
  task_type: TaskTypeSchema.describe('The type of the task.'),
  status: TaskStatusSchema.describe('The current lifecycle status of the task.'),
  priority: TaskPrioritySchema.optional().nullable().describe('The priority level of the task.'),
  authorized_users: z.array(z.string()).optional().nullable().describe('An array of user IDs authorized to interact with this task.'),
  triggering_event_id: z.string().uuid().optional().nullable().describe('The ID of the event that triggered this task.'),
  input: z.record(z.string(), z.any()).optional().nullable().describe('The data the task needs to run.'),
  output: z.record(z.string(), z.any()).optional().nullable().describe('The result of a successful task execution.'),
  metadata: z.record(z.string(), z.any()).optional().nullable().describe('A flexible field for storing any other unstructured data.'),
  provider_name: z.string().optional().nullable().describe('The system or event source that initiated this task.'),
  ai_description: z.string().optional().nullable().describe('An AI-generated description of the task or its purpose.'),
});
export type Task = z.infer<typeof TaskSchema>;

export const CreateTaskInputSchema = TaskSchema.pick({
  microfox_id: true,
  name: true,
  status: true,
  priority: true,
  authorized_users: true,
  triggering_event_id: true,
  input: true,
  output: true,
  metadata: true,
  provider_name: true,
  scheduled_for: true,
  expires_at: true,
  ai_description: true,
}).extend({
  task_type: TaskTypeSchema.optional(),
}).describe('The required input for creating a new task.');

export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;

export const OrchestrationOutputSchema = z.object({
    isNewTask: z.boolean().describe('True if the event was classified as a new task request.'),
    isOldTask: z.boolean().describe('True if the event was classified as relating to an old task.'),
    isTaskImportant: z.boolean().describe('True if the new task request was marked as important.'),
    classified: z.boolean().describe('True if the event was fully processed and a task was created or actions were taken.'),
    
    webhook_event: z.any().describe('The original webhook event payload that was processed.'),
    db_event: z.any().optional().describe('The event object as it was logged to the database.'),
    newTask: TaskSchema.partial().or(z.object({})).optional().describe('The details of the newly created task. Can be an empty object if not important.'),

    // Include other properties from the original SQS payload
    microfox_connections: z.array(z.any()).optional().describe('The array of microfox connections from the SQS payload.'),
    channel: z.string().optional().describe('The channel from the SQS payload, if available.'),
    react_access: z.any().optional().describe('The react_access object from the SQS payload, if available.'),
});

export type OrchestrationOutput = z.infer<typeof OrchestrationOutputSchema>; 