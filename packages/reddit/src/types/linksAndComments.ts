import { z } from 'zod';
import * as schemas from '../schemas/linksAndComments';

export type SubmitComment = z.infer<typeof schemas.submitCommentSchema>;
export type Delete = z.infer<typeof schemas.deleteSchema>;
export type EditUserText = z.infer<typeof schemas.editUserTextSchema>;
export type FollowPost = z.infer<typeof schemas.followPostSchema>;
export type Hide = z.infer<typeof schemas.hideSchema>;
export type InfoParams = z.infer<typeof schemas.infoParamsSchema>;
export type Lock = z.infer<typeof schemas.lockSchema>;
export type MarkNsfw = z.infer<typeof schemas.markNsfwSchema>;
export type MoreChildren = z.infer<typeof schemas.moreChildrenSchema>;
export type Report = z.infer<typeof schemas.reportSchema>;
export type Save = z.infer<typeof schemas.saveSchema>;
export type SendReplies = z.infer<typeof schemas.sendRepliesSchema>;
export type SetContestMode = z.infer<typeof schemas.setContestModeSchema>;
export type SetSubredditSticky = z.infer<typeof schemas.setSubredditStickySchema>;
export type SetSuggestedSort = z.infer<typeof schemas.setSuggestedSortSchema>;
export type Spoiler = z.infer<typeof schemas.spoilerSchema>;
export type StoreVisits = z.infer<typeof schemas.storeVisitsSchema>;
export type SubmitLink = z.infer<typeof schemas.submitLinkSchema>;
export type Unhide = z.infer<typeof schemas.unhideSchema>;
export type Unlock = z.infer<typeof schemas.unlockSchema>;
export type UnmarkNsfw = z.infer<typeof schemas.unmarkNsfwSchema>;
export type Unsave = z.infer<typeof schemas.unsaveSchema>;
export type Unspoiler = z.infer<typeof schemas.unspoilerschema>;
export type Vote = z.infer<typeof schemas.voteSchema>; 