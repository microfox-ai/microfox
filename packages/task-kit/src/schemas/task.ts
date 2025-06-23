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
  input: z.record(z.any()).optional().nullable().describe('The data the task needs to run.'),
  output: z.record(z.any()).optional().nullable().describe('The result of a successful task execution.'),
  metadata: z.record(z.any()).optional().nullable().describe('A flexible field for storing any other unstructured data.'),
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