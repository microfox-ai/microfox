import { z } from 'zod';

// Base configuration
export const clickUpSDKConfigSchema = z.object({
  apiKey: z.string(),
  baseUrl: z.string().optional(),
});

export type ClickUpSDKConfig = z.infer<typeof clickUpSDKConfigSchema>;

// Common types
export const customFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  type_config: z.record(z.unknown()),
  date_created: z.string(),
  hide_from_guests: z.boolean(),
  required: z.boolean(),
});

export type CustomField = z.infer<typeof customFieldSchema>;

export const statusSchema = z.object({
  id: z.string(),
  status: z.string(),
  color: z.string(),
  orderindex: z.number(),
  type: z.string(),
});

export type Status = z.infer<typeof statusSchema>;

// Task types
export const taskSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: statusSchema,
  orderindex: z.string(),
  date_created: z.string(),
  date_updated: z.string(),
  date_closed: z.string().nullable(),
  archived: z.boolean(),
  creator: z.object({
    id: z.number(),
    username: z.string(),
    color: z.string(),
    email: z.string(),
    profilePicture: z.string().nullable(),
  }),
  assignees: z.array(
    z.object({
      id: z.number(),
      username: z.string(),
      color: z.string(),
      email: z.string(),
      profilePicture: z.string().nullable(),
    }),
  ),
  watchers: z.array(
    z.object({
      id: z.number(),
      username: z.string(),
      color: z.string(),
      email: z.string(),
      profilePicture: z.string().nullable(),
    }),
  ),
  checklists: z.array(
    z.object({
      id: z.string(),
      task_id: z.string(),
      name: z.string(),
      date_created: z.string(),
      orderindex: z.number(),
      creator: z.number(),
      resolved: z.number(),
      unresolved: z.number(),
    }),
  ),
  tags: z.array(
    z.object({
      name: z.string(),
      tag_fg: z.string(),
      tag_bg: z.string(),
      creator: z.number(),
    }),
  ),
  parent: z.string().nullable(),
  priority: z
    .object({
      id: z.string(),
      priority: z.string(),
      color: z.string(),
      orderindex: z.string(),
    })
    .nullable(),
  due_date: z.string().nullable(),
  start_date: z.string().nullable(),
  points: z.number().nullable(),
  time_estimate: z.number().nullable(),
  time_spent: z.number().nullable(),
  custom_fields: z.array(customFieldSchema),
  dependencies: z.array(
    z.object({
      task_id: z.string(),
      depends_on: z.string(),
      type: z.number(),
      date_created: z.string(),
      userid: z.number(),
    }),
  ),
  linked_tasks: z.array(
    z.object({
      task_id: z.string(),
      link_id: z.string(),
      date_created: z.string(),
      userid: z.number(),
    }),
  ),
  team_id: z.string(),
  url: z.string(),
  permission_level: z.string(),
  list: z.object({
    id: z.string(),
    name: z.string(),
    access: z.boolean(),
  }),
  project: z.object({
    id: z.string(),
    name: z.string(),
    hidden: z.boolean(),
    access: z.boolean(),
  }),
  folder: z.object({
    id: z.string(),
    name: z.string(),
    hidden: z.boolean(),
    access: z.boolean(),
  }),
  space: z.object({
    id: z.string(),
  }),
});

export type Task = z.infer<typeof taskSchema>;

// List types
export const listSchema = z.object({
  id: z.string(),
  name: z.string(),
  orderindex: z.number(),
  content: z.string().optional(),
  status: statusSchema,
  priority: z
    .object({
      id: z.string(),
      priority: z.string(),
      color: z.string(),
      orderindex: z.string(),
    })
    .nullable(),
  assignee: z
    .object({
      id: z.number(),
      username: z.string(),
      color: z.string(),
      email: z.string(),
      profilePicture: z.string().nullable(),
    })
    .nullable(),
  task_count: z.number(),
  due_date: z.string().nullable(),
  start_date: z.string().nullable(),
  folder: z.object({
    id: z.string(),
    name: z.string(),
    hidden: z.boolean(),
    access: z.boolean(),
  }),
  space: z.object({
    id: z.string(),
  }),
  archived: z.boolean(),
  override_statuses: z.boolean(),
  statuses: z.array(statusSchema),
  permission_level: z.string(),
});

export type List = z.infer<typeof listSchema>;

// Folder types
export const folderSchema = z.object({
  id: z.string(),
  name: z.string(),
  orderindex: z.number(),
  override_statuses: z.boolean(),
  hidden: z.boolean(),
  space: z.object({
    id: z.string(),
  }),
  task_count: z.string(),
  lists: z.array(listSchema),
  permission_level: z.string(),
});

export type Folder = z.infer<typeof folderSchema>;

// Space types
export const spaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  private: z.boolean(),
  avatar: z.string().nullable(),
  admin_can_manage: z.boolean(),
  statuses: z.array(statusSchema),
  multiple_assignees: z.boolean(),
  features: z.object({
    due_dates: z.object({
      enabled: z.boolean(),
      start_date: z.boolean(),
      remap_due_dates: z.boolean(),
      remap_closed_due_date: z.boolean(),
    }),
    sprints: z.object({
      enabled: z.boolean(),
    }),
    time_tracking: z.object({
      enabled: z.boolean(),
      harvest: z.boolean(),
      rollup: z.boolean(),
    }),
    points: z.object({
      enabled: z.boolean(),
    }),
    custom_items: z.object({
      enabled: z.boolean(),
    }),
    priorities: z.object({
      enabled: z.boolean(),
      priorities: z.array(
        z.object({
          id: z.string(),
          priority: z.string(),
          color: z.string(),
          orderindex: z.string(),
        }),
      ),
    }),
    tags: z.object({
      enabled: z.boolean(),
    }),
    time_estimates: z.object({
      enabled: z.boolean(),
    }),
    checklists: z.object({
      enabled: z.boolean(),
    }),
    zoom: z.object({
      enabled: z.boolean(),
    }),
    milestones: z.object({
      enabled: z.boolean(),
    }),
    custom_fields: z.object({
      enabled: z.boolean(),
    }),
    remap_dependencies: z.object({
      enabled: z.boolean(),
    }),
    dependency_warning: z.object({
      enabled: z.boolean(),
    }),
    multiple_assignees: z.object({
      enabled: z.boolean(),
    }),
    portfolios: z.object({
      enabled: z.boolean(),
    }),
  }),
});

export type Space = z.infer<typeof spaceSchema>;

// Time tracking types
export const timeEntrySchema = z.object({
  id: z.string(),
  task: z.object({
    id: z.string(),
    name: z.string(),
    status: statusSchema,
  }),
  wid: z.string(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    email: z.string(),
    color: z.string(),
    profilePicture: z.string().nullable(),
  }),
  billable: z.boolean(),
  start: z.string(),
  end: z.string(),
  duration: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  source: z.string(),
  at: z.string(),
  task_location: z.object({
    list_id: z.string(),
    folder_id: z.string(),
    space_id: z.string(),
    list_name: z.string(),
    folder_name: z.string(),
    space_name: z.string(),
  }),
});

export type TimeEntry = z.infer<typeof timeEntrySchema>;

// Goal types
export const goalSchema = z.object({
  id: z.string(),
  name: z.string(),
  team_id: z.string(),
  date_created: z.string(),
  start_date: z.string(),
  due_date: z.string(),
  description: z.string(),
  private: z.boolean(),
  archived: z.boolean(),
  creator: z.number(),
  color: z.string(),
  pretty_id: z.string(),
  multiple_owners: z.boolean(),
  owners: z.array(z.number()),
  key_results: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.string(),
      unit: z.string(),
      current: z.number(),
      target: z.number(),
      percent_completed: z.number(),
    }),
  ),
  percent_completed: z.number(),
  pretty_url: z.string(),
});

export type Goal = z.infer<typeof goalSchema>;

// Comment types
export const commentSchema = z.object({
  id: z.string(),
  comment: z.array(
    z.object({
      text: z.string(),
      type: z.string(),
    }),
  ),
  comment_text: z.string(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    email: z.string(),
    color: z.string(),
    profilePicture: z.string().nullable(),
  }),
  resolved: z.boolean(),
  assignee: z
    .object({
      id: z.number(),
      username: z.string(),
      email: z.string(),
      color: z.string(),
      profilePicture: z.string().nullable(),
    })
    .nullable(),
  reactions: z.array(
    z.object({
      emoji: z.string(),
      user: z.number(),
    }),
  ),
  date: z.string(),
});

export type Comment = z.infer<typeof commentSchema>;

// Webhook types
export const webhookSchema = z.object({
  id: z.string(),
  userid: z.number(),
  team_id: z.string(),
  endpoint: z.string(),
  client_id: z.string(),
  events: z.array(z.string()),
  task_id: z.string().nullable(),
  list_id: z.string().nullable(),
  folder_id: z.string().nullable(),
  space_id: z.string().nullable(),
  health: z.object({
    status: z.string(),
    fail_count: z.number(),
  }),
  secret: z.string(),
});

export type Webhook = z.infer<typeof webhookSchema>;

// Response types
export type TaskResponse = {
  tasks: Task[];
};

export type ListResponse = {
  lists: List[];
};

export type FolderResponse = {
  folders: Folder[];
};

export type SpaceResponse = {
  spaces: Space[];
};

export type TimeEntryResponse = {
  data: TimeEntry[];
};

export type GoalResponse = {
  goals: Goal[];
};

export type CommentResponse = {
  comments: Comment[];
};

export type WebhookResponse = {
  webhooks: Webhook[];
};

// Request parameter types
export type CreateTaskParams = {
  name: string;
  description?: string;
  assignees?: number[];
  status?: string;
  priority?: number;
  due_date?: number;
  due_date_time?: boolean;
  time_estimate?: number;
  start_date?: number;
  start_date_time?: boolean;
  notify_all?: boolean;
  parent?: string;
  links_to?: string;
  check_required_custom_fields?: boolean;
  custom_fields?: Array<{
    id: string;
    value?: unknown;
  }>;
};

export type UpdateTaskParams = Partial<CreateTaskParams>;

export type CreateListParams = {
  name: string;
  content?: string;
  due_date?: number;
  due_date_time?: boolean;
  priority?: number;
  assignee?: number;
  status?: string;
};

export type UpdateListParams = Partial<CreateListParams>;

export type CreateFolderParams = {
  name: string;
};

export type UpdateFolderParams = Partial<CreateFolderParams>;

export type CreateSpaceParams = {
  name: string;
  multiple_assignees?: boolean;
  features?: {
    due_dates?: {
      enabled: boolean;
      start_date: boolean;
      remap_due_dates: boolean;
      remap_closed_due_date: boolean;
    };
    sprints?: {
      enabled: boolean;
    };
    time_tracking?: {
      enabled: boolean;
      harvest: boolean;
      rollup: boolean;
    };
    points?: {
      enabled: boolean;
    };
    custom_items?: {
      enabled: boolean;
    };
    priorities?: {
      enabled: boolean;
      priorities: Array<{
        id: string;
        priority: string;
        color: string;
        orderindex: string;
      }>;
    };
    tags?: {
      enabled: boolean;
    };
    time_estimates?: {
      enabled: boolean;
    };
    checklists?: {
      enabled: boolean;
    };
    zoom?: {
      enabled: boolean;
    };
    milestones?: {
      enabled: boolean;
    };
    custom_fields?: {
      enabled: boolean;
    };
    remap_dependencies?: {
      enabled: boolean;
    };
    dependency_warning?: {
      enabled: boolean;
    };
    multiple_assignees?: {
      enabled: boolean;
    };
    portfolios?: {
      enabled: boolean;
    };
  };
};

export type UpdateSpaceParams = Partial<CreateSpaceParams>;

export type CreateTimeEntryParams = {
  description: string;
  start: number;
  duration: number;
  assignee?: number;
  tid?: string;
  billable?: boolean;
  tags?: string[];
};

export type UpdateTimeEntryParams = Partial<CreateTimeEntryParams>;

export type CreateGoalParams = {
  name: string;
  due_date: number;
  description?: string;
  multiple_owners?: boolean;
  owners?: number[];
  color?: string;
};

export type UpdateGoalParams = Partial<CreateGoalParams>;

export type CreateCommentParams = {
  comment_text: string;
  assignee?: number;
  notify_all?: boolean;
};

export type UpdateCommentParams = Partial<CreateCommentParams>;

export type CreateWebhookParams = {
  endpoint: string;
  events: string[];
};

export type UpdateWebhookParams = Partial<CreateWebhookParams>;

// Export all types
export * from './index';
