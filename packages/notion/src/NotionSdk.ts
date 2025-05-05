import { z } from 'zod';
import {
  NotionSDKOptions,
  Page,
  Database,
  User,
  Comment,
  SearchResult,
  LinkPreview,
  SCIMUser,
  SCIMGroup,
} from './types';
import {
  notionSDKOptionsSchema,
  pageSchema,
  databaseSchema,
  userSchema,
  commentSchema,
  searchResultSchema,
  linkPreviewSchema,
  scimUserSchema,
  scimGroupSchema,
} from './schemas';

class NotionSDK {
  private apiKey: string;
  private baseUrl: string = 'https://api.notion.com/v1';

  constructor(options: NotionSDKOptions) {
    const validatedOptions = notionSDKOptionsSchema.parse(options);
    this.apiKey = validatedOptions.apiKey;
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Notion API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    return response.json() as Promise<T>;
  }

  // Pages
  async retrievePage(pageId: string): Promise<Page> {
    const response = await this.request<Page>(`/pages/${pageId}`, 'GET');
    return pageSchema.parse(response);
  }

  async createPage(parentId: string, properties: Record<string, unknown>): Promise<Page> {
    const response = await this.request<Page>('/pages', 'POST', { parent: { database_id: parentId }, properties });
    return pageSchema.parse(response);
  }

  async updatePage(pageId: string, properties: Record<string, unknown>): Promise<Page> {
    const response = await this.request<Page>(`/pages/${pageId}`, 'PATCH', { properties });
    return pageSchema.parse(response);
  }

  async deletePage(pageId: string): Promise<void> {
    await this.request(`/pages/${pageId}`, 'DELETE');
  }

  // Databases
  async retrieveDatabase(databaseId: string): Promise<Database> {
    const response = await this.request<Database>(`/databases/${databaseId}`, 'GET');
    return databaseSchema.parse(response);
  }

  async createDatabase(parentId: string, title: string, properties: Record<string, unknown>): Promise<Database> {
    const response = await this.request<Database>('/databases', 'POST', { parent: { page_id: parentId }, title, properties });
    return databaseSchema.parse(response);
  }

  async updateDatabase(databaseId: string, properties: Record<string, unknown>): Promise<Database> {
    const response = await this.request<Database>(`/databases/${databaseId}`, 'PATCH', { properties });
    return databaseSchema.parse(response);
  }

  async deleteDatabase(databaseId: string): Promise<void> {
    await this.request(`/databases/${databaseId}`, 'DELETE');
  }

  // Users
  async retrieveUser(userId: string): Promise<User> {
    const response = await this.request<User>(`/users/${userId}`, 'GET');
    return userSchema.parse(response);
  }

  async listUsers(): Promise<User[]> {
    const response = await this.request<{ results: User[] }>('/users', 'GET');
    return z.array(userSchema).parse(response.results);
  }

  // Comments
  async retrieveComment(commentId: string): Promise<Comment> {
    const response = await this.request<Comment>(`/comments/${commentId}`, 'GET');
    return commentSchema.parse(response);
  }

  async createComment(pageId: string, content: string): Promise<Comment> {
    const response = await this.request<Comment>('/comments', 'POST', { parent: { page_id: pageId }, rich_text: [{ text: { content } }] });
    return commentSchema.parse(response);
  }

  // Search
  async search(query: string): Promise<SearchResult[]> {
    const response = await this.request<{ results: SearchResult[] }>('/search', 'POST', { query });
    return z.array(searchResultSchema).parse(response.results);
  }

  // Link Previews (Unfurl)
  async getLinkPreview(url: string): Promise<LinkPreview> {
    const response = await this.request<LinkPreview>('/unfurl', 'POST', { url });
    return linkPreviewSchema.parse(response);
  }

  // SCIM (Enterprise)
  async createSCIMUser(userData: Partial<SCIMUser>): Promise<SCIMUser> {
    const response = await this.request<SCIMUser>('/scim/v2/Users', 'POST', userData);
    return scimUserSchema.parse(response);
  }

  async updateSCIMUser(userId: string, userData: Partial<SCIMUser>): Promise<SCIMUser> {
    const response = await this.request<SCIMUser>(`/scim/v2/Users/${userId}`, 'PATCH', userData);
    return scimUserSchema.parse(response);
  }

  async deleteSCIMUser(userId: string): Promise<void> {
    await this.request(`/scim/v2/Users/${userId}`, 'DELETE');
  }

  async createSCIMGroup(groupData: Partial<SCIMGroup>): Promise<SCIMGroup> {
    const response = await this.request<SCIMGroup>('/scim/v2/Groups', 'POST', groupData);
    return scimGroupSchema.parse(response);
  }

  async updateSCIMGroup(groupId: string, groupData: Partial<SCIMGroup>): Promise<SCIMGroup> {
    const response = await this.request<SCIMGroup>(`/scim/v2/Groups/${groupId}`, 'PATCH', groupData);
    return scimGroupSchema.parse(response);
  }

  async deleteSCIMGroup(groupId: string): Promise<void> {
    await this.request(`/scim/v2/Groups/${groupId}`, 'DELETE');
  }
}

export function createNotionSDK(options: NotionSDKOptions): NotionSDK {
  return new NotionSDK(options);
}
