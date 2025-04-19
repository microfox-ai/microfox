import { z } from 'zod';
import {
  CreateTaskParams,
  UpdateTaskParams,
  CreateListParams,
  UpdateListParams,
  CreateFolderParams,
  UpdateFolderParams,
  CreateSpaceParams,
  UpdateSpaceParams,
  CreateTimeEntryParams,
  UpdateTimeEntryParams,
  CreateGoalParams,
  UpdateGoalParams,
  CreateCommentParams,
  UpdateCommentParams,
  CreateWebhookParams,
  UpdateWebhookParams,
} from '../types';

export const clickUpSDKConfigSchema = z.object({
  apiKey: z.string().describe('ClickUp API key'),
  baseUrl: z.string().url().optional().describe('Base URL for ClickUp API'),
});

export const auditLogFilterSchema = z.object({
  applicability: z
    .enum(['auth-and-security', 'user-activity'])
    .describe('Type of audit logs to retrieve'),
  pagination: z
    .record(z.unknown())
    .optional()
    .describe('Pagination parameters'),
});

// Task schemas
export const createTaskParamsSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  assignees: z.array(z.number()).optional(),
  status: z.string().optional(),
  priority: z.number().optional(),
  due_date: z.number().optional(),
  due_date_time: z.boolean().optional(),
  time_estimate: z.number().optional(),
  start_date: z.number().optional(),
  start_date_time: z.boolean().optional(),
  notify_all: z.boolean().optional(),
  parent: z.string().optional(),
  links_to: z.string().optional(),
  check_required_custom_fields: z.boolean().optional(),
  custom_fields: z
    .array(
      z.object({
        id: z.string(),
        value: z.unknown().optional(),
      }),
    )
    .optional(),
}) satisfies z.ZodType<CreateTaskParams>;

export const updateTaskParamsSchema =
  createTaskParamsSchema.partial() satisfies z.ZodType<UpdateTaskParams>;

// List schemas
export const createListParamsSchema = z.object({
  name: z.string(),
  content: z.string().optional(),
  due_date: z.number().optional(),
  due_date_time: z.boolean().optional(),
  priority: z.number().optional(),
  assignee: z.number().optional(),
  status: z.string().optional(),
}) satisfies z.ZodType<CreateListParams>;

export const updateListParamsSchema =
  createListParamsSchema.partial() satisfies z.ZodType<UpdateListParams>;

// Folder schemas
export const createFolderParamsSchema = z.object({
  name: z.string(),
}) satisfies z.ZodType<CreateFolderParams>;

export const updateFolderParamsSchema =
  createFolderParamsSchema.partial() satisfies z.ZodType<UpdateFolderParams>;

// Space schemas
export const createSpaceParamsSchema = z.object({
  name: z.string(),
  multiple_assignees: z.boolean().optional(),
  features: z
    .object({
      due_dates: z
        .object({
          enabled: z.boolean(),
          start_date: z.boolean(),
          remap_due_dates: z.boolean(),
          remap_closed_due_date: z.boolean(),
        })
        .optional(),
      sprints: z
        .object({
          enabled: z.boolean(),
        })
        .optional(),
      time_tracking: z
        .object({
          enabled: z.boolean(),
          harvest: z.boolean(),
          rollup: z.boolean(),
        })
        .optional(),
      points: z
        .object({
          enabled: z.boolean(),
        })
        .optional(),
      custom_items: z
        .object({
          enabled: z.boolean(),
        })
        .optional(),
      priorities: z
        .object({
          enabled: z.boolean(),
          priorities: z.array(
            z.object({
              id: z.string(),
              priority: z.string(),
              color: z.string(),
              orderindex: z.string(),
            }),
          ),
        })
        .optional(),
      tags: z
        .object({
          enabled: z.boolean(),
        })
        .optional(),
      time_estimates: z
        .object({
          enabled: z.boolean(),
        })
        .optional(),
      checklists: z
        .object({
          enabled: z.boolean(),
        })
        .optional(),
      zoom: z
        .object({
          enabled: z.boolean(),
        })
        .optional(),
      milestones: z
        .object({
          enabled: z.boolean(),
        })
        .optional(),
      custom_fields: z
        .object({
          enabled: z.boolean(),
        })
        .optional(),
      remap_dependencies: z
        .object({
          enabled: z.boolean(),
        })
        .optional(),
      dependency_warning: z
        .object({
          enabled: z.boolean(),
        })
        .optional(),
      multiple_assignees: z
        .object({
          enabled: z.boolean(),
        })
        .optional(),
      portfolios: z
        .object({
          enabled: z.boolean(),
        })
        .optional(),
    })
    .optional(),
}) satisfies z.ZodType<CreateSpaceParams>;

export const updateSpaceParamsSchema =
  createSpaceParamsSchema.partial() satisfies z.ZodType<UpdateSpaceParams>;

// Time entry schemas
export const createTimeEntryParamsSchema = z.object({
  description: z.string(),
  start: z.number(),
  duration: z.number(),
  assignee: z.number().optional(),
  tid: z.string().optional(),
  billable: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
}) satisfies z.ZodType<CreateTimeEntryParams>;

export const updateTimeEntryParamsSchema =
  createTimeEntryParamsSchema.partial() satisfies z.ZodType<UpdateTimeEntryParams>;

// Goal schemas
export const createGoalParamsSchema = z.object({
  name: z.string(),
  due_date: z.number(),
  description: z.string().optional(),
  multiple_owners: z.boolean().optional(),
  owners: z.array(z.number()).optional(),
  color: z.string().optional(),
}) satisfies z.ZodType<CreateGoalParams>;

export const updateGoalParamsSchema =
  createGoalParamsSchema.partial() satisfies z.ZodType<UpdateGoalParams>;

// Comment schemas
export const createCommentParamsSchema = z.object({
  comment_text: z.string(),
  assignee: z.number().optional(),
  notify_all: z.boolean().optional(),
}) satisfies z.ZodType<CreateCommentParams>;

export const updateCommentParamsSchema =
  createCommentParamsSchema.partial() satisfies z.ZodType<UpdateCommentParams>;

// Webhook schemas
export const createWebhookParamsSchema = z.object({
  endpoint: z.string(),
  events: z.array(z.string()),
}) satisfies z.ZodType<CreateWebhookParams>;

export const updateWebhookParamsSchema =
  createWebhookParamsSchema.partial() satisfies z.ZodType<UpdateWebhookParams>;
