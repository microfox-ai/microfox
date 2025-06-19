import { z } from 'zod';

export const allowEditorSchema = z.object({
  act: z.enum(['add', 'del']),
  page: z.string(),
  username: z.string(),
});

export const editWikiPageSchema = z.object({
  content: z.string(),
  page: z.string(),
  reason: z.string().optional(),
});

export const hideWikiPageSchema = z.object({
  page: z.string(),
  revision: z.string().optional(),
});

export const revertWikiPageSchema = z.object({
  page: z.string(),
  revision: z.string(),
});

export const getWikiDiscussionsSchema = z.object({
  page: z.string(),
});

export const wikiPageListSchema = z.object({
  kind: z.literal('WikiPageList'),
  data: z.object({
    pages: z.array(z.string()),
  }),
});

export const wikiRevisionSchema = z.object({
  timestamp: z.number(),
  reason: z.string().nullable(),
  page: z.string(),
  id: z.string(),
  // TODO: author: userSchema,
});

export const wikiRevisionListingSchema = z.object({
  kind: z.literal('Listing'),
  data: z.object({
    after: z.string().nullable(),
    before: z.string().nullable(),
    dist: z.number().nullable(),
    children: z.array(
      z.object({
        kind: z.literal('WikiPageRevision'),
        data: wikiRevisionSchema,
      }),
    ),
  }),
});

export const wikiPageSettingsSchema = z.object({
  permlevel: z.number(),
  listed: z.boolean(),
  editors: z.array(z.any()), // TODO: use userSchema
});

export const updateWikiPageSettingsSchema = z.object({
  page: z.string(),
  listed: z.boolean(),
  permlevel: z.number(),
});

export const wikiPageSchema = z.object({
  may_revise: z.boolean(),
  revision_date: z.number(),
  content_md: z.string(),
  content_html: z.string(),
  // TODO: revision_by: userSchema
}); 