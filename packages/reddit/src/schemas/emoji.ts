import { z } from 'zod';

export const s3LeaseRequestSchema = z.object({
  filepath: z.string().describe('The name and extension of the image file (e.g., image.png).'),
  mimetype: z.string().describe('The MIME type of the image (e.g., image/png).'),
});

export const s3LeaseFieldSchema = z.object({
    name: z.string(),
    value: z.string(),
});

export const s3LeaseResponseSchema = z.object({
    action: z.string(),
    fields: z.array(s3LeaseFieldSchema),
}).catchall(z.any());


export const addEmojiSchema = z.object({
  name: z.string().max(24).regex(/^[a-zA-Z0-9_-]+$/, 'Emoji name must be alphanumeric with dashes or underscores.'),
  s3_key: z.string().describe('The S3 key of the uploaded image.'),
  mod_flair_only: z.boolean().optional().describe('If true, this emoji may only be used in mod-exclusive user flair.'),
  post_flair_allowed: z.boolean().optional().describe('If true, this emoji may be used in post flair.'),
  user_flair_allowed: z.boolean().optional().describe('If true, this emoji may be used in user flair.'),
});

export const emojiSchema = z.object({
    url: z.string().url(),
    created_by: z.string(),
    mod_flair_only: z.boolean(),
    name: z.string(),
    post_flair_allowed: z.boolean(),
    user_flair_allowed: z.boolean(),
}).catchall(z.any());

export const allEmojisResponseSchema = z.record(z.record(emojiSchema));


export const setCustomEmojiSizeSchema = z.object({
  width: z.number().int().min(1).max(40).optional(),
  height: z.number().int().min(1).max(40).optional(),
}); 