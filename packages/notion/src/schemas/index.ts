import { z } from 'zod';

export const notionSDKOptionsSchema = z.object({
  apiKey: z.string().min(1).describe('The API key for authenticating with the Notion API'),
});

export const richTextSchema = z.object({
  type: z.enum(['text', 'mention', 'equation']),
  text: z.object({
    content: z.string(),
    link: z.object({ url: z.string().url() }).optional(),
  }).optional(),
  annotations: z.object({
    bold: z.boolean(),
    italic: z.boolean(),
    strikethrough: z.boolean(),
    underline: z.boolean(),
    code: z.boolean(),
    color: z.string(),
  }).optional(),
  plain_text: z.string(),
  href: z.string().url().optional(),
});

export const propertySchema = z.object({
  id: z.string(),
  type: z.enum(['title', 'rich_text', 'number', 'select', 'multi_select', 'date', 'people', 'files', 'checkbox', 'url', 'email', 'phone_number', 'formula', 'relation', 'rollup', 'created_time', 'created_by', 'last_edited_time', 'last_edited_by']),
  name: z.string(),
});

export const pageSchema = z.object({
  id: z.string().describe('Unique identifier for the page'),
  created_time: z.string().describe('Timestamp when the page was created'),
  last_edited_time: z.string().describe('Timestamp when the page was last edited'),
  created_by: z.object({ id: z.string() }).describe('User who created the page'),
  last_edited_by: z.object({ id: z.string() }).describe('User who last edited the page'),
  cover: z.object({}).nullable().describe('Cover image for the page'),
  icon: z.object({}).nullable().describe('Icon for the page'),
  parent: z.object({
    type: z.enum(['database_id', 'page_id', 'workspace']),
    database_id: z.string().optional(),
    page_id: z.string().optional(),
  }).describe('Parent of the page (database or another page)'),
  archived: z.boolean().describe('Whether the page is archived'),
  properties: z.record(z.unknown()).describe('Page properties'),
  url: z.string().url().describe('URL of the page'),
});

export const databaseSchema = z.object({
  id: z.string().describe('Unique identifier for the database'),
  created_time: z.string().describe('Timestamp when the database was created'),
  last_edited_time: z.string().describe('Timestamp when the database was last edited'),
  icon: z.object({}).nullable().describe('Icon for the database'),
  cover: z.object({}).nullable().describe('Cover image for the database'),
  url: z.string().url().describe('URL of the database'),
  title: z.array(richTextSchema).describe('Title of the database'),
  description: z.array(richTextSchema).optional().describe('Description of the database'),
  properties: z.record(propertySchema).describe('Database properties'),
});

export const userSchema = z.object({
  id: z.string().describe('Unique identifier for the user'),
  name: z.string().describe('Name of the user'),
  avatar_url: z.string().url().nullable().describe('URL of the user\'s avatar'),
  type: z.enum(['person', 'bot']).describe('Type of user'),
  person: z.object({
    email: z.string().email(),
  }).optional().describe('Additional information for person type users'),
  bot: z.object({}).optional().describe('Additional information for bot type users'),
});

export const commentSchema = z.object({
  id: z.string().describe('Unique identifier for the comment'),
  parent: z.object({
    type: z.enum(['page_id', 'block_id']),
    page_id: z.string().optional(),
    block_id: z.string().optional(),
  }).describe('Parent of the comment (page or block)'),
  discussion_id: z.string().describe('ID of the discussion thread'),
  created_time: z.string().describe('Timestamp when the comment was created'),
  last_edited_time: z.string().describe('Timestamp when the comment was last edited'),
  created_by: z.object({ id: z.string() }).describe('User who created the comment'),
  rich_text: z.array(richTextSchema).describe('Content of the comment'),
});

export const searchResultSchema = z.object({
  object: z.enum(['page', 'database']),
  id: z.string(),
  properties: z.record(z.unknown()),
});

export const linkPreviewSchema = z.object({
  url: z.string().url().describe('URL of the previewed link'),
  title: z.string().describe('Title of the previewed page'),
  description: z.string().optional().describe('Description of the previewed page'),
  icon: z.string().url().optional().describe('Icon URL for the previewed page'),
  og_image: z.string().url().optional().describe('Open Graph image URL for the previewed page'),
});

export const scimUserSchema = z.object({
  id: z.string().describe('Unique identifier for the SCIM user'),
  userName: z.string().describe('Username of the SCIM user'),
  name: z.object({
    givenName: z.string(),
    familyName: z.string(),
  }).describe('Name of the SCIM user'),
  emails: z.array(z.object({
    value: z.string().email(),
    type: z.enum(['work', 'home', 'other']),
    primary: z.boolean(),
  })).describe('Email addresses of the SCIM user'),
  active: z.boolean().describe('Whether the SCIM user is active'),
});

export const scimGroupSchema = z.object({
  id: z.string().describe('Unique identifier for the SCIM group'),
  displayName: z.string().describe('Display name of the SCIM group'),
  members: z.array(z.object({
    value: z.string(),
    display: z.string(),
  })).optional().describe('Members of the SCIM group'),
});
