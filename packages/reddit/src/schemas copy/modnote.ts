import { z } from 'zod';

export const deleteModNoteSchema = z.object({
  note_id: z.string().describe('A unique ID for the note to be deleted'),
  subreddit: z.string(),
  user: z.string(),
});

export const getModNotesSchema = z.object({
  before: z.string().optional(),
  filter: z.enum([
    'NOTE', 'APPROVAL', 'REMOVAL', 'BAN', 'MUTE', 'INVITE', 
    'SPAM', 'CONTENT_CHANGE', 'MOD_ACTION', 'ALL'
  ]).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  subreddit: z.string(),
  user: z.string(),
});

export const createModNoteSchema = z.object({
  label: z.enum([
    'BOT_BAN', 'PERMA_BAN', 'BAN', 'ABUSE_WARNING', 'SPAM_WARNING', 
    'SPAM_WATCH', 'SOLID_CONTRIBUTOR', 'HELPFUL_USER'
  ]).optional(),
  note: z.string().max(250),
  reddit_id: z.string().optional(),
  subreddit: z.string(),
  user: z.string(),
});

export const getRecentModNotesSchema = z.object({
  subreddits: z.string().describe('A comma delimited list of subreddits by name'),
  users: z.string().describe('A comma delimited list of usernames'),
}); 