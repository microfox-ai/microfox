import { z } from 'zod';
import * as schemas from '../schemas/newModmail';

export type BulkRead = z.infer<typeof schemas.bulkReadSchema>;
export type GetConversations = z.infer<typeof schemas.getConversationsSchema>;
export type CreateConversation = z.infer<typeof schemas.createConversationSchema>;
export type GetConversation = z.infer<typeof schemas.getConversationSchema>;
export type CreateMessage = z.infer<typeof schemas.createMessageSchema>;
export type MuteConversation = z.infer<typeof schemas.muteConversationSchema>;
export type TempBan = z.infer<typeof schemas.tempBanSchema>;
export type ConversationIds = z.infer<typeof schemas.conversationIdsSchema>; 