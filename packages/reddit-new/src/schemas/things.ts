import { z } from 'zod';
import { commentSchema } from './comment';
import { postV2Schema } from './post';

export const thingSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('t1'),
    data: commentSchema,
  }),
  z.object({
    kind: z.literal('t3'),
    data: postV2Schema,
  }),
]);

export const thingListingSchema = z.object({
  kind: z.literal('Listing'),
  data: z.object({
    after: z.string().nullable(),
    before: z.string().nullable(),
    dist: z.number().nullable(),
    modhash: z.string(),
    geo_filter: z.string().nullable(),
    children: z.array(thingSchema),
  }),
}); 