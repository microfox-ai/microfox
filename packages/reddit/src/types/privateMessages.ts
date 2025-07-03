import { z } from 'zod';
import * as schemas from '../schemas/privateMessages';

export type BlockPrivateMessage = z.infer<typeof schemas.blockPrivateMessageSchema>;
export type MessageIdList = z.infer<typeof schemas.messageIdListSchema>;
export type ComposeMessage = z.infer<typeof schemas.composeMessageSchema>;
export type ReadAllMessages = z.infer<typeof schemas.readAllMessagesSchema>;
export type UnblockSubreddit = z.infer<typeof schemas.unblockSubredditSchema>;
export type GetMessageListing = z.infer<typeof schemas.getMessageListingSchema>; 