import { z } from 'zod';
import {
  authorFlairRichTextSchema,
  awardingSchema,
  banInfoSchema,
  gildingsSchema,
} from './index';

export const commentSchema = z
  .object({
    allAwardings: z
      .array(awardingSchema)
      .describe('A list of all awards on this comment.'),
    approved: z
      .boolean()
      .optional()
      .describe('Whether the comment is approved.'),
    approvedAtUtc: z
      .number()
      .optional()
      .describe('The UTC timestamp of when the comment was approved.'),
    approvedBy: z
      .string()
      .optional()
      .describe('The user who approved the comment.'),
    archived: z
      .boolean()
      .optional()
      .describe('Whether the comment is archived.'),
    associatedAward: z
      .string()
      .optional()
      .describe('The associated award for the comment.'),
    author: z.string().optional().describe('The author of the comment.'),
    authorFlairBackgroundColor: z
      .string()
      .optional()
      .describe("The background color of the author's flair."),
    authorFlairCssClass: z
      .string()
      .optional()
      .describe("The CSS class of the author's flair."),
    authorFlairRichtext: z
      .array(authorFlairRichTextSchema)
      .describe("The rich text of the author's flair."),
    authorFlairTemplateId: z
      .string()
      .optional()
      .describe("The template ID of the author's flair."),
    authorFlairText: z
      .string()
      .optional()
      .describe("The text of the author's flair."),
    authorFlairTextColor: z
      .string()
      .optional()
      .describe("The text color of the author's flair."),
    authorFlairType: z
      .string()
      .optional()
      .describe("The type of the author's flair."),
    authorFullname: z
      .string()
      .optional()
      .describe('The fullname of the author.'),
    authorIsBlocked: z
      .boolean()
      .optional()
      .describe('Whether the author is blocked by the current user.'),
    authorPatreonFlair: z
      .boolean()
      .optional()
      .describe('Whether the author has Patreon flair.'),
    authorPremium: z
      .boolean()
      .optional()
      .describe('Whether the author has Reddit Premium.'),
    awarders: z
      .array(z.string())
      .describe('A list of users who awarded the comment.'),
    bannedAtUtc: z
      .number()
      .optional()
      .describe('The UTC timestamp of when the author was banned.'),
    bannedBy: z.string().optional().describe('The user who banned the author.'),
    body: z
      .string()
      .optional()
      .describe('The body of the comment as markdown.'),
    bodyHtml: z
      .string()
      .optional()
      .describe('The HTML representation of the comment body.'),
    canGild: z
      .boolean()
      .optional()
      .describe('Whether the comment can be gilded.'),
    canModPost: z
      .boolean()
      .optional()
      .describe('Whether the current user can moderate the post.'),
    collapsed: z
      .boolean()
      .optional()
      .describe('Whether the comment is collapsed.'),
    collapsedBecauseCrowdControl: z
      .boolean()
      .optional()
      .describe('Whether the comment was collapsed due to crowd control.'),
    collapsedReason: z
      .string()
      .optional()
      .describe('The reason for the comment being collapsed.'),
    collapsedReasonCode: z
      .string()
      .optional()
      .describe('The code for the reason the comment was collapsed.'),
    commentType: z.string().optional().describe('The type of the comment.'),
    controversiality: z
      .number()
      .optional()
      .describe('The controversiality score of the comment.'),
    created: z
      .number()
      .optional()
      .describe('The timestamp of when the comment was created.'),
    createdUtc: z
      .number()
      .optional()
      .describe('The UTC timestamp of when the comment was created.'),
    depth: z
      .number()
      .optional()
      .describe('The depth of the comment in a thread.'),
    distinguished: z
      .string()
      .optional()
      .describe('How the comment is distinguished (e.g., "moderator").'),
    downs: z.number().optional().describe('The number of downvotes.'),
    edited: z
      .boolean()
      .optional()
      .describe('Whether the comment has been edited.'),
    gilded: z
      .number()
      .optional()
      .describe('The number of times the comment has been gilded.'),
    gildings: gildingsSchema
      .optional()
      .describe('The gildings for the comment.'),
    id: z.string().optional().describe('The ID of the comment.'),
    ignoreReports: z
      .boolean()
      .optional()
      .describe('Whether reports on the comment are ignored.'),
    isSubmitter: z
      .boolean()
      .optional()
      .describe('Whether the author is the submitter of the post.'),
    likes: z
      .boolean()
      .optional()
      .describe('Whether the current user has liked the comment.'),
    linkId: z
      .string()
      .optional()
      .describe('The ID of the link (post) the comment belongs to.'),
    locked: z.boolean().optional().describe('Whether the comment is locked.'),
    modNote: z.string().optional().describe('A note from a moderator.'),
    modReasonBy: z
      .string()
      .optional()
      .describe('The user who provided the moderator reason.'),
    modReasonTitle: z
      .string()
      .optional()
      .describe('The title of the moderator reason.'),
    modReports: z
      .array(z.array(z.any()))
      .describe('Moderator reports on the comment.'),
    name: z.string().optional().describe('The fullname of the comment.'),
    noFollow: z
      .boolean()
      .optional()
      .describe('Whether to apply "nofollow" to links in the comment.'),
    numReports: z
      .number()
      .optional()
      .describe('The number of reports on the comment.'),
    parentId: z
      .string()
      .optional()
      .describe('The ID of the parent comment or post.'),
    permalink: z.string().optional().describe('The permalink of the comment.'),
    removalReason: z
      .string()
      .optional()
      .describe("The reason for the comment's removal."),
    removed: z
      .boolean()
      .optional()
      .describe('Whether the comment was removed.'),
    replies: z
      .string()
      .optional()
      .describe('Replies to this comment (can be a "more" object).'),
    reportReasons: z
      .array(z.string())
      .describe('A list of reasons for reports.'),
    rteMode: z.string().optional().describe('The rich text editor mode used.'),
    saved: z
      .boolean()
      .optional()
      .describe('Whether the comment is saved by the current user.'),
    score: z.number().optional().describe('The score of the comment.'),
    scoreHidden: z
      .boolean()
      .optional()
      .describe('Whether the score is hidden.'),
    sendReplies: z
      .boolean()
      .optional()
      .describe('Whether the author wants to receive replies.'),
    spam: z
      .boolean()
      .optional()
      .describe('Whether the comment is marked as spam.'),
    stickied: z
      .boolean()
      .optional()
      .describe('Whether the comment is stickied.'),
    subreddit: z
      .string()
      .optional()
      .describe('The subreddit the comment belongs to.'),
    subredditId: z.string().optional().describe('The ID of the subreddit.'),
    subredditNamePrefixed: z
      .string()
      .optional()
      .describe('The prefixed name of the subreddit (e.g., "r/pics").'),
    subredditType: z.string().optional().describe('The type of the subreddit.'),
    topAwardedType: z
      .string()
      .optional()
      .describe('The type of the top award.'),
    totalAwardsReceived: z
      .number()
      .optional()
      .describe('The total number of awards received.'),
    treatmentTags: z.array(z.string()).describe('A list of treatment tags.'),
    unrepliableReason: z
      .string()
      .optional()
      .describe('The reason why the comment is unrepliable.'),
    ups: z.number().optional().describe('The number of upvotes.'),
    userReports: z
      .array(z.array(z.any()))
      .describe('User reports on the comment.'),
    count: z.number().optional().describe('The count for "more" objects.'),
    children: z
      .array(z.string())
      .describe('A list of child comment IDs for "more" objects.'),
    banInfo: banInfoSchema
      .optional()
      .describe('Information about a ban related to this comment.'),
    markedSpam: z
      .boolean()
      .optional()
      .describe('PRIVATE: Whether the comment is marked as spam.'),
    verdict: z.string().optional().describe('The verdict on the comment.'),
  })
  .describe('Schema for a Reddit comment (legacy).');

export const commentV2Schema = z
  .object({
    id: z.string().describe('The ID of the comment.'),
    parentId: z.string().describe('The ID of the parent comment or post.'),
    body: z.string().describe('The body of the comment as markdown.'),
    author: z.string().describe('The author of the comment.'),
    numReports: z.number().describe('The number of reports on the comment.'),
    collapsedBecauseCrowdControl: z
      .boolean()
      .describe('Whether the comment was collapsed due to crowd control.'),
    spam: z.boolean().describe('Whether the comment is marked as spam.'),
    deleted: z.boolean().describe('Whether the comment was deleted.'),
    createdAt: z
      .number()
      .describe('The UTC timestamp of when the comment was created.'),
    upvotes: z.number().describe('The number of upvotes.'),
    downvotes: z.number().describe('The number of downvotes.'),
    languageCode: z.string().describe('The language code of the comment.'),
    lastModifiedAt: z
      .number()
      .describe('The UTC timestamp of when the comment was last modified.'),
    gilded: z.boolean().describe('Whether the comment has been gilded.'),
    score: z.number().describe('The score of the comment.'),
    permalink: z.string().describe('The permalink of the comment.'),
    hasMedia: z.boolean().describe('Whether the comment contains media.'),
    postId: z.string().describe('The ID of the post the comment belongs to.'),
    subredditId: z.string().describe('The ID of the subreddit.'),
    elementTypes: z
      .array(z.string())
      .describe('A list of element types in the comment.'),
  })
  .describe('Schema for a Reddit comment (V2).');

export const commentThingSchema = z.object({
  kind: z.literal('t1'),
  data: commentSchema,
});

export const commentListingSchema = z.object({
  kind: z.literal('Listing'),
  data: z.object({
    after: z.string().nullable(),
    before: z.string().nullable(),
    dist: z.number().nullable(),
    modhash: z.string(),
    geo_filter: z.string().nullable(),
    children: z.array(commentThingSchema),
  }),
});
