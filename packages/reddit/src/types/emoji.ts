import { z } from 'zod';
import * as schemas from '../schemas/emoji';

export type S3LeaseRequest = z.infer<typeof schemas.s3LeaseRequestSchema>;
export type S3LeaseField = z.infer<typeof schemas.s3LeaseFieldSchema>;
export type S3LeaseResponse = z.infer<typeof schemas.s3LeaseResponseSchema>;
export type AddEmoji = z.infer<typeof schemas.addEmojiSchema>;
export type Emoji = z.infer<typeof schemas.emojiSchema>;
export type AllEmojisResponse = z.infer<typeof schemas.allEmojisResponseSchema>;
export type SetCustomEmojiSize = z.infer<typeof schemas.setCustomEmojiSizeSchema>; 