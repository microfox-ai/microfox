import { z } from 'zod';

export const copyMultiSchema = z.object({
  description_md: z.string().optional(),
  display_name: z.string().max(50),
  expand_srs: z.boolean().optional(),
  from: z.string(),
  to: z.string(),
});

export const getMultisSchema = z.object({
  expand_srs: z.boolean().optional(),
});

export const getUserMultisSchema = z.object({
    expand_srs: z.boolean().optional(),
    username: z.string(),
});

export const multiPathSchema = z.object({
  expand_srs: z.boolean().optional(),
  multipath: z.string(),
});

const multiSubredditSchema = z.object({
  name: z.string(),
});

export const createOrUpdateMultiSchema = z.object({
  multipath: z.string(),
  expand_srs: z.boolean().optional(),
  model: z.object({
    description_md: z.string().optional(),
    display_name: z.string().max(50),
    icon_img: z.enum(['png', 'jpg', 'jpeg']).optional(),
    key_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    subreddits: z.array(multiSubredditSchema),
    visibility: z.enum(['private', 'public', 'hidden']),
  }),
});

export const updateMultiDescriptionSchema = z.object({
  multipath: z.string(),
  model: z.object({
    body_md: z.string(),
  }),
});

export const manageMultiSubredditSchema = z.object({
  multipath: z.string(),
  srname: z.string(),
});

export const addSubredditToMultiSchema = z.object({
    multipath: z.string(),
    srname: z.string(),
    model: z.object({
        name: z.string(),
    }),
}); 