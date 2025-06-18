import { z } from 'zod';

export const announcementSchema = z.object({
  id: z.string().describe('The fullname of the announcement, prefixed with "ann_".'),
  title: z.string().describe('The title of the announcement.'),
  text: z.string().describe('The body text of the announcement.'),
  url: z.string().url().describe('The URL the announcement links to.'),
  created_utc: z.number().describe('The UTC timestamp of when the announcement was created.'),
  hidden: z.boolean().describe('Whether the announcement is hidden.'),
  read: z.boolean().describe('Whether the announcement has been read.'),
  // ... other fields as needed based on actual API response
}).catchall(z.any()).describe('A Reddit announcement.');

export const announcementListingSchema = z.object({
  kind: z.literal('Listing'),
  data: z.object({
    after: z.string().nullable(),
    before: z.string().nullable(),
    dist: z.number().nullable(),
    modhash: z.string(),
    geo_filter: z.string().nullable(),
    children: z.array(z.object({
        kind: z.literal('t10'), // Assuming 't10' is the kind for announcements
        data: announcementSchema,
    })),
  }),
});

export const getAnnouncementsParamsSchema = z.object({
  after: z.string().optional().describe('Fullname of an announcement to fetch after.'),
  before: z.string().optional().describe('Fullname of an announcement to fetch before.'),
  limit: z.number().int().min(1).max(100).optional().describe('The maximum number of items to return.'),
});

export const announcementIdsSchema = z.object({
    ids: z.string().describe('A comma-separated list of announcement fullnames.'),
}); 