import {
  ClickUpSDKConfig,
  Task,
  List,
  Folder,
  Space,
  TimeEntry,
  Goal,
  Comment,
  Webhook,
  TaskResponse,
  ListResponse,
  FolderResponse,
  SpaceResponse,
  TimeEntryResponse,
  GoalResponse,
  CommentResponse,
  WebhookResponse,
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
} from './types';
import {
  clickUpSDKConfigSchema,
  createTaskParamsSchema,
  updateTaskParamsSchema,
  createListParamsSchema,
  updateListParamsSchema,
  createFolderParamsSchema,
  updateFolderParamsSchema,
  createSpaceParamsSchema,
  updateSpaceParamsSchema,
  createTimeEntryParamsSchema,
  updateTimeEntryParamsSchema,
  createGoalParamsSchema,
  updateGoalParamsSchema,
  createCommentParamsSchema,
  updateCommentParamsSchema,
  createWebhookParamsSchema,
  updateWebhookParamsSchema,
} from './schemas';

export class ClickUpSDK {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(config: ClickUpSDKConfig) {
    const validatedConfig = clickUpSDKConfigSchema.parse(config);
    this.apiKey = validatedConfig.apiKey;
    this.baseUrl = validatedConfig.baseUrl || 'https://api.clickup.com';
  }

  private async request<T>(
    endpoint: string,
    method: string,
    body?: unknown,
    headers: Record<string, string> = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        Authorization: this.apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorBody}`,
      );
    }

    return response.json() as Promise<T>;
  }

  // Task methods
  async getTask(taskId: string): Promise<Task> {
    return this.request<Task>(`/api/v2/task/${taskId}`, 'GET');
  }

  async getTasks(listId: string): Promise<TaskResponse> {
    return this.request<TaskResponse>(`/api/v2/list/${listId}/task`, 'GET');
  }

  async createTask(listId: string, params: CreateTaskParams): Promise<Task> {
    const validatedParams = createTaskParamsSchema.parse(params);
    return this.request<Task>(
      `/api/v2/list/${listId}/task`,
      'POST',
      validatedParams,
    );
  }

  async updateTask(taskId: string, params: UpdateTaskParams): Promise<Task> {
    const validatedParams = updateTaskParamsSchema.parse(params);
    return this.request<Task>(`/api/v2/task/${taskId}`, 'PUT', validatedParams);
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.request(`/api/v2/task/${taskId}`, 'DELETE');
  }

  // List methods
  async getList(listId: string): Promise<List> {
    return this.request<List>(`/api/v2/list/${listId}`, 'GET');
  }

  async getLists(folderId: string): Promise<ListResponse> {
    return this.request<ListResponse>(`/api/v2/folder/${folderId}/list`, 'GET');
  }

  async createList(folderId: string, params: CreateListParams): Promise<List> {
    const validatedParams = createListParamsSchema.parse(params);
    return this.request<List>(
      `/api/v2/folder/${folderId}/list`,
      'POST',
      validatedParams,
    );
  }

  async updateList(listId: string, params: UpdateListParams): Promise<List> {
    const validatedParams = updateListParamsSchema.parse(params);
    return this.request<List>(`/api/v2/list/${listId}`, 'PUT', validatedParams);
  }

  async deleteList(listId: string): Promise<void> {
    await this.request(`/api/v2/list/${listId}`, 'DELETE');
  }

  // Folder methods
  async getFolder(folderId: string): Promise<Folder> {
    return this.request<Folder>(`/api/v2/folder/${folderId}`, 'GET');
  }

  async getFolders(spaceId: string): Promise<FolderResponse> {
    return this.request<FolderResponse>(
      `/api/v2/space/${spaceId}/folder`,
      'GET',
    );
  }

  async createFolder(
    spaceId: string,
    params: CreateFolderParams,
  ): Promise<Folder> {
    const validatedParams = createFolderParamsSchema.parse(params);
    return this.request<Folder>(
      `/api/v2/space/${spaceId}/folder`,
      'POST',
      validatedParams,
    );
  }

  async updateFolder(
    folderId: string,
    params: UpdateFolderParams,
  ): Promise<Folder> {
    const validatedParams = updateFolderParamsSchema.parse(params);
    return this.request<Folder>(
      `/api/v2/folder/${folderId}`,
      'PUT',
      validatedParams,
    );
  }

  async deleteFolder(folderId: string): Promise<void> {
    await this.request(`/api/v2/folder/${folderId}`, 'DELETE');
  }

  // Space methods
  async getSpace(spaceId: string): Promise<Space> {
    return this.request<Space>(`/api/v2/space/${spaceId}`, 'GET');
  }

  async getSpaces(teamId: string): Promise<SpaceResponse> {
    return this.request<SpaceResponse>(`/api/v2/team/${teamId}/space`, 'GET');
  }

  async createSpace(teamId: string, params: CreateSpaceParams): Promise<Space> {
    const validatedParams = createSpaceParamsSchema.parse(params);
    return this.request<Space>(
      `/api/v2/team/${teamId}/space`,
      'POST',
      validatedParams,
    );
  }

  async updateSpace(
    spaceId: string,
    params: UpdateSpaceParams,
  ): Promise<Space> {
    const validatedParams = updateSpaceParamsSchema.parse(params);
    return this.request<Space>(
      `/api/v2/space/${spaceId}`,
      'PUT',
      validatedParams,
    );
  }

  async deleteSpace(spaceId: string): Promise<void> {
    await this.request(`/api/v2/space/${spaceId}`, 'DELETE');
  }

  // Time tracking methods
  async getTimeEntries(taskId: string): Promise<TimeEntryResponse> {
    return this.request<TimeEntryResponse>(
      `/api/v2/task/${taskId}/time`,
      'GET',
    );
  }

  async createTimeEntry(
    taskId: string,
    params: CreateTimeEntryParams,
  ): Promise<TimeEntry> {
    const validatedParams = createTimeEntryParamsSchema.parse(params);
    return this.request<TimeEntry>(
      `/api/v2/task/${taskId}/time`,
      'POST',
      validatedParams,
    );
  }

  async updateTimeEntry(
    taskId: string,
    timeEntryId: string,
    params: UpdateTimeEntryParams,
  ): Promise<TimeEntry> {
    const validatedParams = updateTimeEntryParamsSchema.parse(params);
    return this.request<TimeEntry>(
      `/api/v2/task/${taskId}/time/${timeEntryId}`,
      'PUT',
      validatedParams,
    );
  }

  async deleteTimeEntry(taskId: string, timeEntryId: string): Promise<void> {
    await this.request(`/api/v2/task/${taskId}/time/${timeEntryId}`, 'DELETE');
  }

  // Goal methods
  async getGoal(goalId: string): Promise<Goal> {
    return this.request<Goal>(`/api/v2/goal/${goalId}`, 'GET');
  }

  async getGoals(teamId: string): Promise<GoalResponse> {
    return this.request<GoalResponse>(`/api/v2/team/${teamId}/goal`, 'GET');
  }

  async createGoal(teamId: string, params: CreateGoalParams): Promise<Goal> {
    const validatedParams = createGoalParamsSchema.parse(params);
    return this.request<Goal>(
      `/api/v2/team/${teamId}/goal`,
      'POST',
      validatedParams,
    );
  }

  async updateGoal(goalId: string, params: UpdateGoalParams): Promise<Goal> {
    const validatedParams = updateGoalParamsSchema.parse(params);
    return this.request<Goal>(`/api/v2/goal/${goalId}`, 'PUT', validatedParams);
  }

  async deleteGoal(goalId: string): Promise<void> {
    await this.request(`/api/v2/goal/${goalId}`, 'DELETE');
  }

  // Comment methods
  async getComment(commentId: string): Promise<Comment> {
    return this.request<Comment>(`/api/v2/comment/${commentId}`, 'GET');
  }

  async getComments(taskId: string): Promise<CommentResponse> {
    return this.request<CommentResponse>(
      `/api/v2/task/${taskId}/comment`,
      'GET',
    );
  }

  async createComment(
    taskId: string,
    params: CreateCommentParams,
  ): Promise<Comment> {
    const validatedParams = createCommentParamsSchema.parse(params);
    return this.request<Comment>(
      `/api/v2/task/${taskId}/comment`,
      'POST',
      validatedParams,
    );
  }

  async updateComment(
    commentId: string,
    params: UpdateCommentParams,
  ): Promise<Comment> {
    const validatedParams = updateCommentParamsSchema.parse(params);
    return this.request<Comment>(
      `/api/v2/comment/${commentId}`,
      'PUT',
      validatedParams,
    );
  }

  async deleteComment(commentId: string): Promise<void> {
    await this.request(`/api/v2/comment/${commentId}`, 'DELETE');
  }

  // Webhook methods
  async getWebhook(webhookId: string): Promise<Webhook> {
    return this.request<Webhook>(`/api/v2/webhook/${webhookId}`, 'GET');
  }

  async getWebhooks(teamId: string): Promise<WebhookResponse> {
    return this.request<WebhookResponse>(
      `/api/v2/team/${teamId}/webhook`,
      'GET',
    );
  }

  async createWebhook(
    teamId: string,
    params: CreateWebhookParams,
  ): Promise<Webhook> {
    const validatedParams = createWebhookParamsSchema.parse(params);
    return this.request<Webhook>(
      `/api/v2/team/${teamId}/webhook`,
      'POST',
      validatedParams,
    );
  }

  async updateWebhook(
    webhookId: string,
    params: UpdateWebhookParams,
  ): Promise<Webhook> {
    const validatedParams = updateWebhookParamsSchema.parse(params);
    return this.request<Webhook>(
      `/api/v2/webhook/${webhookId}`,
      'PUT',
      validatedParams,
    );
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    await this.request(`/api/v2/webhook/${webhookId}`, 'DELETE');
  }

  // File attachment methods
  async createTaskAttachment(
    taskId: string,
    file: File,
    customTaskIds?: boolean,
    teamId?: string,
  ): Promise<{ id: string; title: string; url: string }> {
    const formData = new FormData();
    formData.append('attachment', file);

    if (customTaskIds !== undefined) {
      formData.append('custom_task_ids', customTaskIds.toString());
    }

    if (teamId) {
      formData.append('team_id', teamId);
    }

    const url = `${this.baseUrl}/api/v2/task/${taskId}/attachment`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: this.apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      if (response.status === 400 && errorBody.includes('GBUSED_005')) {
        throw new Error('Storage limit exceeded');
      }
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorBody}`,
      );
    }

    return response.json();
  }

  async deleteTaskAttachment(
    taskId: string,
    attachmentId: string,
  ): Promise<void> {
    await this.request(
      `/api/v2/task/${taskId}/attachment/${attachmentId}`,
      'DELETE',
    );
  }
}

export function createClickUpSDK(config: ClickUpSDKConfig): ClickUpSDK {
  return new ClickUpSDK(config);
}
