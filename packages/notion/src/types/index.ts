import { z } from 'zod';

export type NotionSDKOptions = z.infer<typeof notionSDKOptionsSchema>;

export type Page = z.infer<typeof pageSchema>;

export type Database = z.infer<typeof databaseSchema>;

export type User = z.infer<typeof userSchema>;

export type Comment = z.infer<typeof commentSchema>;

export type SearchResult = z.infer<typeof searchResultSchema>;

export type LinkPreview = z.infer<typeof linkPreviewSchema>;

export type SCIMUser = z.infer<typeof scimUserSchema>;

export type SCIMGroup = z.infer<typeof scimGroupSchema>;

// Schemas are defined in the schemas file, but we're using them here to infer types
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
} from '../schemas';
