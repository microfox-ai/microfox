import { z } from 'zod';

// =============================================================================
// ENUMS
// =============================================================================

export const thingTypeSchema = z
  .nativeEnum({
    UNKNOWN: 0,
    COMMENT: 1,
    ACCOUNT: 2,
    POST: 3,
    MESSAGE: 4,
    SUBREDDIT: 5,
    AWARD: 6,
    UNRECOGNIZED: -1,
  })
  .describe('Enum for different types of "things" on Reddit.');

export const crowdControlLevelSchema = z
  .nativeEnum({
    OFF: 0,
    LENIENT: 1,
    MEDIUM: 2,
    STRICT: 3,
    UNRECOGNIZED: -1,
  })
  .describe('Enum for crowd control levels on a post.');

export const distinguishTypeSchema = z
  .nativeEnum({
    NULL_VALUE: 0,
    ADMIN: 1,
    GOLD: 2,
    GOLD_AUTO: 3,
    YES: 4,
    SPECIAL: 5,
    UNRECOGNIZED: -1,
  })
  .describe('Enum for distinguished types of a post or comment.');

export const subredditTypeSchema = z
  .nativeEnum({
    ARCHIVED: 0,
    EMPLOYEES_ONLY: 1,
    GOLD_ONLY: 2,
    GOLD_RESTRICTED: 3,
    PRIVATE: 4,
    PUBLIC: 5,
    RESTRICTED: 6,
    USER: 7,
    UNRECOGNIZED: -1,
  })
  .describe('Enum for different types of subreddits.');

export const subredditRatingSchema = z
  .nativeEnum({
    UNKNOWN_SUBREDDIT_RATING: 0,
    E: 1,
    M1: 2,
    M2: 3,
    D: 4,
    V: 5,
    X: 6,
    UNRECOGNIZED: -1,
  })
  .describe('Enum for subreddit content ratings.');

export const modActionTypeSchema = z
  .nativeEnum({
    UNKNOWN: 0,
    REMOVE_POST: 1,
    REMOVE_COMMENT: 2,
    APPROVE_POST: 3,
    APPROVE_COMMENT: 4,
    EDIT_POST_FLAIR: 5,
    EDIT_USER_FLAIR: 6,
    LOCK_POST: 7,
    LOCK_COMMENT: 8,
    SPAM_POST: 9,
    SPAM_COMMENT: 10,
    DISTINGUISH_POST: 11,
    DISTINGUISH_COMMENT: 12,
    STICKY_POST: 13,
    STICKY_COMMENT: 14,
    UNRECOGNIZED: -1,
  })
  .describe('Enum for different types of moderator actions.');

export const banInfoBanInfoActionSchema = z
  .nativeEnum({
    UNKNOWN: 0,
    SPAM: 1,
    FILTER: 2,
    REMOVE: 3,
    UNRECOGNIZED: -1,
  })
  .describe('Enum for actions related to a ban.');

// =============================================================================
// COMMON INTERFACES
// =============================================================================

export const authorFlairRichTextSchema = z
  .object({
    e: z
      .string()
      .optional()
      .describe('Type of the flair element (e.g., "text", "emoji").'),
    t: z.string().optional().describe('Text of the flair element.'),
  })
  .describe('Schema for a single rich text element in author flair.');

export const userFlairRichtextSchema = z
  .object({
    e: z
      .string()
      .optional()
      .describe('Type of the flair element (e.g., "text", "emoji").'),
    t: z.string().optional().describe('Text of the flair element.'),
  })
  .describe('Schema for a single rich text element in user flair.');

export const awardingIconSchema = z
  .object({
    height: z.number().optional().describe('Height of the icon.'),
    url: z.string().optional().describe('URL of the icon.'),
    width: z.number().optional().describe('Width of the icon.'),
  })
  .describe('Schema for an award icon with different resolutions.');

export const awardingSchema = z
  .object({
    awardSubType: z.string().optional().describe('The sub-type of the award.'),
    awardType: z
      .string()
      .optional()
      .describe('The type of the award (e.g., "global", "moderator").'),
    awardingsRequiredToGrantBenefits: z
      .number()
      .optional()
      .describe('Number of awards required to grant benefits.'),
    coinPrice: z
      .number()
      .optional()
      .describe('The price of the award in Reddit Coins.'),
    coinReward: z
      .number()
      .optional()
      .describe('The amount of Reddit Coins given to the recipient.'),
    count: z
      .number()
      .optional()
      .describe('The number of this award given to the content.'),
    daysOfDripExtension: z
      .number()
      .optional()
      .describe('Number of days the drip extension lasts.'),
    daysOfPremium: z
      .number()
      .optional()
      .describe('Number of days of Reddit Premium given to the recipient.'),
    description: z
      .string()
      .optional()
      .describe('The description of the award.'),
    endDate: z
      .string()
      .optional()
      .describe("The end date of the award's availability."),
    giverCoinReward: z
      .number()
      .optional()
      .describe('The amount of Reddit Coins given to the giver.'),
    iconFormat: z
      .string()
      .optional()
      .describe('The format of the icon (e.g., "APNG", "PNG").'),
    iconHeight: z.number().optional().describe('The height of the icon.'),
    iconUrl: z.string().optional().describe('The URL of the icon.'),
    iconWidth: z.number().optional().describe('The width of the icon.'),
    id: z.string().optional().describe('The ID of the award.'),
    isEnabled: z.boolean().optional().describe('Whether the award is enabled.'),
    isNew: z.boolean().optional().describe('Whether the award is new.'),
    name: z.string().optional().describe('The name of the award.'),
    pennyDonate: z
      .number()
      .optional()
      .describe('The amount of pennies donated.'),
    pennyPrice: z
      .number()
      .optional()
      .describe('The price of the award in pennies.'),
    resizedIcons: z
      .array(awardingIconSchema)
      .describe('Array of resized icons for the award.'),
    resizedStaticIcons: z
      .array(awardingIconSchema)
      .describe('Array of resized static icons for the award.'),
    startDate: z
      .string()
      .optional()
      .describe("The start date of the award's availability."),
    staticIconHeight: z
      .number()
      .optional()
      .describe('The height of the static icon.'),
    staticIconUrl: z
      .string()
      .optional()
      .describe('The URL of the static icon.'),
    staticIconWidth: z
      .number()
      .optional()
      .describe('The width of the static icon.'),
    stickyDurationSeconds: z
      .number()
      .optional()
      .describe('The duration in seconds the award is sticky.'),
    subredditCoinReward: z
      .number()
      .optional()
      .describe('The amount of Reddit Coins given to the subreddit.'),
    subredditId: z
      .string()
      .optional()
      .describe('The ID of the subreddit where the award is available.'),
    tiersByRequiredAwardings: z
      .string()
      .optional()
      .describe('Tiers by required awardings.'),
  })
  .describe('Schema for an award given to a post or comment.');

export const commentContributionSettingsSchema = z
  .object({
    allowedMediaTypes: z
      .array(z.string())
      .describe('List of allowed media types in comments.'),
  })
  .describe('Schema for comment contribution settings in a subreddit.');

export const gildingsSchema = z
  .object({
    gid1: z.number().optional().describe('Count of silver awards.'),
    gid2: z.number().optional().describe('Count of gold awards.'),
    gid3: z.number().optional().describe('Count of platinum awards.'),
  })
  .describe('Schema for the gildings (awards) on a post or comment.');

export const mediaEmbedSchema = z
  .object({
    content: z
      .string()
      .optional()
      .describe('The HTML content of the embedded media.'),
    width: z.number().optional().describe('The width of the embedded media.'),
    height: z.number().optional().describe('The height of the embedded media.'),
    sandbox: z.boolean().optional().describe('Whether the embed is sandboxed.'),
    scrolling: z
      .boolean()
      .optional()
      .describe('Whether the embed is scrollable.'),
    publicThumbnailUrl: z
      .string()
      .optional()
      .describe('The URL of the public thumbnail.'),
  })
  .describe('Schema for embedded media content.');

export const banInfoSchema = z
  .object({
    auto: z.boolean().optional().describe('Whether the ban was automatic.'),
    bannedAt: z
      .number()
      .optional()
      .describe('The UTC timestamp of when the ban was issued.'),
    banner: z
      .string()
      .optional()
      .describe('The banner associated with the ban.'),
    moderatorBanned: z
      .boolean()
      .optional()
      .describe('Whether the user was banned by a moderator.'),
    note: z.string().optional().describe('The ban note.'),
    unbanner: z.string().optional().describe('The user who unbanned.'),
    unbannedAt: z
      .number()
      .optional()
      .describe('The UTC timestamp of when the unban occurred.'),
    resetUsed: z.boolean().optional().describe('Whether a reset was used.'),
    reasonId: z.string().optional().describe('The ID of the ban reason.'),
    reasonTitle: z.string().optional().describe('The title of the ban reason.'),
    reasonMessage: z
      .string()
      .optional()
      .describe('The message of the ban reason.'),
    reasonBy: z
      .string()
      .optional()
      .describe('The user who provided the ban reason.'),
    modNote: z.string().optional().describe('A note from the moderator.'),
    banAllTriggered: z
      .boolean()
      .optional()
      .describe('Whether a "ban all" was triggered.'),
    subredditMessage: z
      .string()
      .optional()
      .describe('The message from the subreddit.'),
    removeAction: banInfoBanInfoActionSchema.describe(
      'The action taken for the removal.',
    ),
  })
  .describe('Schema for ban-related information.');

// =============================================================================
// FLAIR INTERFACES
// =============================================================================

export const linkFlairV2Schema = z
  .object({
    text: z.string().describe('The text of the flair.'),
    cssClass: z.string().describe('The CSS class of the flair.'),
    backgroundColor: z.string().describe('The background color of the flair.'),
    templateId: z.string().describe('The template ID of the flair.'),
    textColor: z.string().describe('The text color of the flair.'),
  })
  .describe('Schema for V2 link flair.');

export const userFlairV2Schema = z
  .object({
    userId: z.string().describe('The user ID associated with the flair.'),
    subredditId: z
      .string()
      .describe('The subreddit ID where the flair is used.'),
    text: z.string().describe('The text of the flair.'),
    cssClass: z.string().describe('The CSS class of the flair.'),
    templateId: z.string().describe('The template ID of the flair.'),
    textColor: z.string().describe('The text color of the flair.'),
    backgroundColor: z.string().describe('The background color of the flair.'),
    enabled: z.boolean().describe('Whether the flair is enabled.'),
  })
  .describe('Schema for V2 user flair.');

// =============================================================================
// COMMENT INTERFACES
// =============================================================================

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
    name: z.string().optional().describe('The fullname of the. comment.'),
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

// =============================================================================
// POST INTERFACES
// =============================================================================

export const mediaRedditVideoSchema = z
  .object({
    bitrateKbps: z
      .number()
      .optional()
      .describe('The bitrate of the video in kbps.'),
    dashUrl: z.string().optional().describe('The URL of the DASH manifest.'),
    duration: z
      .number()
      .optional()
      .describe('The duration of the video in seconds.'),
    fallbackUrl: z
      .string()
      .optional()
      .describe('A fallback URL for the video.'),
    height: z.number().optional().describe('The height of the video.'),
    hlsUrl: z.string().optional().describe('The URL of the HLS manifest.'),
    isGif: z.boolean().optional().describe('Whether the video is a GIF.'),
    scrubberMediaUrl: z
      .string()
      .optional()
      .describe('The URL of the scrubber media.'),
    transcodingStatus: z
      .string()
      .optional()
      .describe('The status of the video transcoding.'),
    width: z.number().optional().describe('The width of the video.'),
  })
  .describe('Schema for a Reddit-hosted video within a media object.');

export const mediaSchema = z
  .object({
    redditVideo: mediaRedditVideoSchema
      .optional()
      .describe('A Reddit-hosted video.'),
  })
  .describe('Schema for media content in a post.');

export const previewPreviewImageImageSchema = z
  .object({
    height: z.number().optional().describe('The height of the image.'),
    url: z.string().optional().describe('The URL of the image.'),
    width: z.number().optional().describe('The width of the image.'),
  })
  .describe('Schema for a specific resolution of a preview image.');

export const previewPreviewImageSchema = z
  .object({
    id: z.string().optional().describe('The ID of the preview image.'),
    resolutions: z
      .array(previewPreviewImageImageSchema)
      .describe('A list of available resolutions for the image.'),
    source: previewPreviewImageImageSchema
      .optional()
      .describe('The source image.'),
    variants: previewPreviewImageImageSchema
      .optional()
      .describe('Variants of the image.'),
  })
  .describe('Schema for a preview image with multiple resolutions.');

export const previewSchema = z
  .object({
    enabled: z
      .boolean()
      .optional()
      .describe('Whether previews are enabled for the post.'),
    images: z
      .array(previewPreviewImageSchema)
      .describe('A list of preview images.'),
  })
  .describe('Schema for the preview of a post.');

export const oEmbedSchema = z
  .object({
    authorName: z
      .string()
      .optional()
      .describe('The name of the author of the embedded content.'),
    authorUrl: z
      .string()
      .optional()
      .describe("The URL of the author's profile."),
    description: z
      .string()
      .optional()
      .describe('The description of the embedded content.'),
    title: z.string().optional().describe('The title of the embedded content.'),
  })
  .describe('Schema for oEmbed content.');

export const redditPostGallerySchema = z
  .object({
    body: z.string().optional().describe('The body of the gallery.'),
    domain: z.string().optional().describe('The domain of the gallery.'),
    url: z.string().optional().describe('The URL of the gallery.'),
  })
  .describe('Schema for a Reddit post gallery.');

export const postSchema = z
  .object({
    allAwardings: z
      .array(awardingSchema)
      .describe('A list of all awards on this post.'),
    allowLiveComments: z
      .boolean()
      .optional()
      .describe('Whether live comments are allowed.'),
    approved: z.boolean().optional().describe('Whether the post is approved.'),
    approvedAtUtc: z
      .number()
      .optional()
      .describe('The UTC timestamp of when the post was approved.'),
    approvedBy: z
      .string()
      .optional()
      .describe('The user who approved the post.'),
    archived: z.boolean().optional().describe('Whether the post is archived.'),
    author: z.string().optional().describe('The author of the post.'),
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
      .describe('A list of users who awarded the post.'),
    bannedAtUtc: z
      .number()
      .optional()
      .describe('The UTC timestamp of when the author was banned.'),
    bannedBy: z.string().optional().describe('The user who banned the author.'),
    canGild: z.boolean().optional().describe('Whether the post can be gilded.'),
    canModPost: z
      .boolean()
      .optional()
      .describe('Whether the current user can moderate the post.'),
    category: z.string().optional().describe('The category of the post.'),
    clicked: z
      .boolean()
      .optional()
      .describe('Whether the post has been clicked by the current user.'),
    contentCategories: z
      .array(z.string())
      .describe('A list of content categories.'),
    contestMode: z
      .boolean()
      .optional()
      .describe('Whether the post is in contest mode.'),
    created: z
      .number()
      .optional()
      .describe('The timestamp of when the post was created.'),
    createdUtc: z
      .number()
      .optional()
      .describe('The UTC timestamp of when the post was created.'),
    discussionType: z.string().optional().describe('The type of discussion.'),
    distinguished: z
      .string()
      .optional()
      .describe('How the post is distinguished (e.g., "moderator").'),
    domain: z.string().optional().describe('The domain of the link.'),
    downs: z.number().optional().describe('The number of downvotes.'),
    edited: z
      .boolean()
      .optional()
      .describe('Whether the post has been edited.'),
    gilded: z
      .number()
      .optional()
      .describe('The number of times the post has been gilded.'),
    gildings: gildingsSchema.optional().describe('The gildings for the post.'),
    hidden: z
      .boolean()
      .optional()
      .describe('Whether the post is hidden by the current user.'),
    hideScore: z.boolean().optional().describe('Whether the score is hidden.'),
    id: z.string().optional().describe('The ID of the post.'),
    ignoreReports: z
      .boolean()
      .optional()
      .describe('Whether reports on the post are ignored.'),
    isCreatedFromAdsUi: z
      .boolean()
      .optional()
      .describe('Whether the post was created from the ads UI.'),
    isCrosspostable: z
      .boolean()
      .optional()
      .describe('Whether the post is crosspostable.'),
    isMeta: z.boolean().optional().describe('Whether the post is a meta post.'),
    isOriginalContent: z
      .boolean()
      .optional()
      .describe('Whether the post is marked as original content.'),
    isRedditMediaDomain: z
      .boolean()
      .optional()
      .describe('Whether the post is from a Reddit media domain.'),
    isRobotIndexable: z
      .boolean()
      .optional()
      .describe('Whether the post is indexable by robots.'),
    isSelf: z
      .boolean()
      .optional()
      .describe('Whether the post is a self-post (text-only).'),
    isVideo: z
      .boolean()
      .optional()
      .describe('Whether the post contains a video.'),
    likes: z
      .boolean()
      .optional()
      .describe('Whether the current user has liked the post.'),
    linkFlairBackgroundColor: z
      .string()
      .optional()
      .describe('The background color of the link flair.'),
    linkFlairCssClass: z
      .string()
      .optional()
      .describe('The CSS class of the link flair.'),
    linkFlairRichtext: z
      .array(z.string())
      .describe('The rich text of the link flair.'),
    linkFlairTextColor: z
      .string()
      .optional()
      .describe('The text color of the link flair.'),
    linkFlairText: z
      .string()
      .optional()
      .describe('The text of the link flair.'),
    linkFlairType: z
      .string()
      .optional()
      .describe('The type of the link flair.'),
    locked: z.boolean().optional().describe('Whether the post is locked.'),
    mediaEmbed: mediaEmbedSchema
      .optional()
      .describe('Embedded media for the post.'),
    mediaOnly: z
      .boolean()
      .optional()
      .describe('Whether the post is media-only.'),
    media: mediaSchema.optional().describe('Media content of the post.'),
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
      .describe('Moderator reports on the post.'),
    name: z.string().optional().describe('The fullname of the post.'),
    noFollow: z
      .boolean()
      .optional()
      .describe('Whether to apply "nofollow" to links in the post.'),
    numComments: z
      .number()
      .optional()
      .describe('The number of comments on the post.'),
    numCrossposts: z.number().optional().describe('The number of crossposts.'),
    numDuplicates: z
      .number()
      .optional()
      .describe('The number of duplicate posts.'),
    numReports: z
      .number()
      .optional()
      .describe('The number of reports on the post.'),
    over18: z
      .boolean()
      .optional()
      .describe('Whether the post is marked as NSFW.'),
    parentWhitelistStatus: z
      .string()
      .optional()
      .describe('The whitelist status of the parent.'),
    permalink: z.string().optional().describe('The permalink of the post.'),
    pinned: z.boolean().optional().describe('Whether the post is pinned.'),
    postHint: z.string().optional().describe('A hint for the type of post.'),
    preview: previewSchema.optional().describe('The preview of the post.'),
    pwls: z
      .number()
      .optional()
      .describe('Parent whitelist status (numerical).'),
    quarantine: z
      .boolean()
      .optional()
      .describe('Whether the post is quarantined.'),
    removalReason: z
      .string()
      .optional()
      .describe("The reason for the post's removal."),
    removedByCategory: z
      .string()
      .optional()
      .describe('The category of the removal.'),
    removedBy: z.string().optional().describe('The user who removed the post.'),
    removed: z.boolean().optional().describe('Whether the post was removed.'),
    reportReasons: z
      .array(z.string())
      .describe('A list of reasons for reports.'),
    rteMode: z.string().optional().describe('The rich text editor mode used.'),
    saved: z
      .boolean()
      .optional()
      .describe('Whether the post is saved by the current user.'),
    score: z.number().optional().describe('The score of the post.'),
    secureMediaEmbed: mediaEmbedSchema
      .optional()
      .describe('Secure embedded media for the post.'),
    secureMedia: mediaSchema
      .optional()
      .describe('Secure media content of the post.'),
    selftextHtml: z
      .string()
      .optional()
      .describe('The HTML representation of the self-text.'),
    selftext: z
      .string()
      .optional()
      .describe('The self-text of the post as markdown.'),
    sendReplies: z
      .boolean()
      .optional()
      .describe('Whether the author wants to receive replies.'),
    spam: z
      .boolean()
      .optional()
      .describe('Whether the post is marked as spam.'),
    spoiler: z
      .boolean()
      .optional()
      .describe('Whether the post is marked as a spoiler.'),
    stickied: z.boolean().optional().describe('Whether the post is stickied.'),
    subredditId: z.string().optional().describe('The ID of the subreddit.'),
    subredditNamePrefixed: z
      .string()
      .optional()
      .describe('The prefixed name of the subreddit (e.g., "r/pics").'),
    subredditSubscribers: z
      .number()
      .optional()
      .describe('The number of subscribers to the subreddit.'),
    subredditType: z.string().optional().describe('The type of the subreddit.'),
    subreddit: z
      .string()
      .optional()
      .describe('The subreddit the post belongs to.'),
    suggestedSort: z
      .string()
      .optional()
      .describe('The suggested sort for comments.'),
    thumbnailHeight: z
      .number()
      .optional()
      .describe('The height of the thumbnail.'),
    thumbnailWidth: z
      .number()
      .optional()
      .describe('The width of the thumbnail.'),
    thumbnail: z.string().optional().describe('The URL of the thumbnail.'),
    title: z.string().optional().describe('The title of the post.'),
    topAwardedType: z
      .string()
      .optional()
      .describe('The type of the top award.'),
    totalAwardsReceived: z
      .number()
      .optional()
      .describe('The total number of awards received.'),
    treatmentTags: z.array(z.string()).describe('A list of treatment tags.'),
    ups: z.number().optional().describe('The number of upvotes.'),
    upvoteRatio: z
      .number()
      .optional()
      .describe('The ratio of upvotes to downvotes.'),
    urlOverriddenByDest: z
      .string()
      .optional()
      .describe('The URL overridden by the destination.'),
    url: z.string().optional().describe('The URL of the post.'),
    userReports: z
      .array(z.array(z.any()))
      .describe('User reports on the post.'),
    viewCount: z.number().optional().describe('The number of views.'),
    visited: z
      .boolean()
      .optional()
      .describe('Whether the post has been visited by the current user.'),
    whitelistStatus: z.string().optional().describe('The whitelist status.'),
    wls: z.number().optional().describe('Whitelist status (numerical).'),
    linkFlairTemplateId: z
      .string()
      .optional()
      .describe('The template ID of the link flair.'),
    crowdControlLevel: z
      .number()
      .optional()
      .describe('The crowd control level of the post.'),
    isGallery: z
      .boolean()
      .optional()
      .describe('Whether the post is a gallery.'),
    isLiveStream: z
      .boolean()
      .optional()
      .describe('Whether the post is a live stream.'),
    isMetaDiscussion: z
      .boolean()
      .optional()
      .describe('Whether the post is a meta discussion.'),
    oembed: oEmbedSchema.optional().describe('oEmbed content for the post.'),
    banInfo: banInfoSchema
      .optional()
      .describe('Information about a ban related to this post.'),
    markedSpam: z
      .boolean()
      .optional()
      .describe('PRIVATE: Whether the post is marked as spam.'),
    verdict: z.string().optional().describe('The verdict on the post.'),
    gallery: redditPostGallerySchema
      .optional()
      .describe('The gallery content of the post.'),
  })
  .describe('Schema for a Reddit post (legacy).');

export const oembedSchema = z
  .object({
    type: z.string().describe('The type of the oEmbed content.'),
    version: z.string().describe('The version of the oEmbed content.'),
    title: z.string().describe('The title of the oEmbed content.'),
    description: z.string().describe('The description of the oEmbed content.'),
    authorName: z
      .string()
      .describe('The name of the author of the oEmbed content.'),
    authorUrl: z.string().describe("The URL of the author's profile."),
    providerName: z.string().describe('The name of the oEmbed provider.'),
    providerUrl: z.string().describe('The URL of the oEmbed provider.'),
    thumbnailUrl: z.string().describe('The URL of the thumbnail.'),
    thumbnailWidth: z.number().describe('The width of the thumbnail.'),
    thumbnailHeight: z.number().describe('The height of the thumbnail.'),
    html: z.string().describe('The HTML of the oEmbed content.'),
    width: z.number().describe('The width of the oEmbed content.'),
    height: z.number().describe('The height of the oEmbed content.'),
  })
  .describe('Schema for oEmbed content in a post.');

export const redditVideoSchema = z
  .object({
    bitrateKbps: z.number().describe('The bitrate of the video in kbps.'),
    fallbackUrl: z.string().describe('A fallback URL for the video.'),
    height: z.number().describe('The height of the video.'),
    width: z.number().describe('The width of the video.'),
    scrubberMediaUrl: z.string().describe('The URL of the scrubber media.'),
    dashUrl: z.string().describe('The URL of the DASH manifest.'),
    duration: z.number().describe('The duration of the video in seconds.'),
    hlsUrl: z.string().describe('The URL of the HLS manifest.'),
    isGif: z.boolean().describe('Whether the video is a GIF.'),
    transcodingStatus: z
      .string()
      .describe('The status of the video transcoding.'),
  })
  .describe('Schema for a Reddit-hosted video.');

export const mediaObjectSchema = z
  .object({
    type: z.string().describe('The type of the media object.'),
    oembed: oembedSchema
      .optional()
      .describe('oEmbed content for the media object.'),
    redditVideo: redditVideoSchema
      .optional()
      .describe('A Reddit-hosted video.'),
  })
  .describe('Schema for a media object in a post.');

export const postV2Schema = z
  .object({
    id: z.string().describe('The ID of the post.'),
    title: z.string().describe('The title of the post.'),
    selftext: z.string().describe('The self-text of the post as markdown.'),
    nsfw: z.boolean().describe('Whether the post is marked as NSFW.'),
    authorId: z.string().describe('The ID of the author.'),
    crowdControlLevel: crowdControlLevelSchema.describe(
      'The crowd control level of the post.',
    ),
    numReports: z.number().describe('The number of reports on the post.'),
    isGallery: z.boolean().describe('Whether the post is a gallery.'),
    isMeta: z.boolean().describe('Whether the post is a meta post.'),
    createdAt: z
      .number()
      .describe('The UTC timestamp of when the post was created.'),
    isApproved: z.boolean().describe('Whether the post is approved.'),
    isArchived: z.boolean().describe('Whether the post is archived.'),
    distinguished: distinguishTypeSchema.describe(
      'How the post is distinguished.',
    ),
    ignoreReports: z
      .boolean()
      .describe('Whether reports on the post are ignored.'),
    isSelf: z.boolean().describe('Whether the post is a self-post.'),
    isVideo: z.boolean().describe('Whether the post contains a video.'),
    isLocked: z.boolean().describe('Whether the post is locked.'),
    isSpoiler: z.boolean().describe('Whether the post is marked as a spoiler.'),
    subredditId: z.string().describe('The ID of the subreddit.'),
    upvotes: z.number().describe('The number of upvotes.'),
    downvotes: z.number().describe('The number of downvotes.'),
    url: z.string().describe('The URL of the post.'),
    isSticky: z.boolean().describe('Whether the post is stickied.'),
    linkFlair: linkFlairV2Schema
      .optional()
      .describe('The link flair of the post.'),
    authorFlair: userFlairV2Schema
      .optional()
      .describe('The author flair of the post.'),
    spam: z.boolean().describe('Whether the post is marked as spam.'),
    deleted: z.boolean().describe('Whether the post was deleted.'),
    languageCode: z.string().describe('The language code of the post.'),
    updatedAt: z
      .number()
      .describe('The UTC timestamp of when the post was last updated.'),
    gildings: z.number().describe('The number of gildings on the post.'),
    score: z.number().describe('The score of the post.'),
    numComments: z.number().describe('The number of comments on the post.'),
    thumbnail: z.string().describe('The URL of the thumbnail.'),
    media: mediaObjectSchema.optional().describe('Media content of the post.'),
    crosspostParentId: z
      .string()
      .describe('The ID of the parent post if crossposted.'),
    permalink: z.string().describe('The permalink of the post.'),
    isPoll: z.boolean().describe('Whether the post is a poll.'),
    isPromoted: z.boolean().describe('Whether the post is promoted.'),
    isMultiMedia: z
      .boolean()
      .describe('Whether the post contains multiple media items.'),
    type: z.string().describe('The type of the post.'),
    unlisted: z.boolean().describe('Whether the post is unlisted.'),
    galleryImages: z
      .array(z.string())
      .describe('A list of gallery image URLs.'),
    isImage: z.boolean().describe('Whether the post is a single image.'),
  })
  .describe('Schema for a Reddit post (V2).');

// =============================================================================
// SUBREDDIT INTERFACES
// =============================================================================

export const subredditPostRequirementsSchema = z
  .object({
    bodyRestrictionPolicy: z
      .string()
      .optional()
      .describe('The restriction policy for post bodies.'),
  })
  .describe('Schema for post requirements in a subreddit.');

export const subredditSchema = z
  .object({
    acceptFollowers: z
      .boolean()
      .optional()
      .describe('Whether the subreddit accepts followers.'),
    accountsActiveIsFuzzed: z
      .boolean()
      .optional()
      .describe('Whether the active accounts count is fuzzed.'),
    accountsActive: z
      .number()
      .optional()
      .describe('The number of active accounts.'),
    activeUserCount: z
      .number()
      .optional()
      .describe('The number of active users.'),
    advertiserCategory: z
      .string()
      .optional()
      .describe('The advertiser category of the subreddit.'),
    allOriginalContent: z
      .boolean()
      .optional()
      .describe('Whether all content must be original.'),
    allowChatPostCreation: z
      .boolean()
      .optional()
      .describe('Whether chat post creation is allowed.'),
    allowDiscovery: z
      .boolean()
      .optional()
      .describe('Whether the subreddit is discoverable.'),
    allowGalleries: z
      .boolean()
      .optional()
      .describe('Whether galleries are allowed.'),
    allowImages: z.boolean().optional().describe('Whether images are allowed.'),
    allowPolls: z.boolean().optional().describe('Whether polls are allowed.'),
    allowPredictionContributors: z
      .boolean()
      .optional()
      .describe('Whether prediction contributors are allowed.'),
    allowPredictionsTournament: z
      .boolean()
      .optional()
      .describe('Whether prediction tournaments are allowed.'),
    allowPredictions: z
      .boolean()
      .optional()
      .describe('Whether predictions are allowed.'),
    allowTalks: z.boolean().optional().describe('Whether talks are allowed.'),
    allowVideogifs: z
      .boolean()
      .optional()
      .describe('Whether video GIFs are allowed.'),
    allowVideos: z.boolean().optional().describe('Whether videos are allowed.'),
    allowedMediaInComments: z
      .array(z.string())
      .describe('A list of allowed media types in comments.'),
    bannerBackgroundColor: z
      .string()
      .optional()
      .describe('The background color of the banner.'),
    bannerBackgroundImage: z
      .string()
      .optional()
      .describe('The background image of the banner.'),
    bannerImg: z.string().optional().describe('The image of the banner.'),
    bannerSize: z.array(z.number()).describe('The size of the banner.'),
    canAssignLinkFlair: z
      .boolean()
      .optional()
      .describe('Whether users can assign link flair.'),
    canAssignUserFlair: z
      .boolean()
      .optional()
      .describe('Whether users can assign user flair.'),
    coins: z
      .number()
      .optional()
      .describe('The number of coins in the subreddit.'),
    collapseDeletedComments: z
      .boolean()
      .optional()
      .describe('Whether deleted comments should be collapsed.'),
    commentContributionSettings: commentContributionSettingsSchema
      .optional()
      .describe('Settings for comment contributions.'),
    commentScoreHideMins: z
      .number()
      .optional()
      .describe('The number of minutes to hide comment scores.'),
    communityIcon: z
      .string()
      .optional()
      .describe('The URL of the community icon.'),
    communityReviewed: z
      .boolean()
      .optional()
      .describe('Whether the community has been reviewed.'),
    contentCategory: z
      .string()
      .optional()
      .describe('The content category of the subreddit.'),
    createdUtc: z
      .number()
      .optional()
      .describe('The UTC timestamp of when the subreddit was created.'),
    created: z
      .number()
      .optional()
      .describe('The timestamp of when the subreddit was created.'),
    defaultSet: z
      .boolean()
      .optional()
      .describe('Whether the subreddit is in the default set.'),
    description: z
      .string()
      .optional()
      .describe('The description of the subreddit.'),
    descriptionHtml: z
      .string()
      .optional()
      .describe('The HTML representation of the description.'),
    disableContributorRequests: z
      .boolean()
      .optional()
      .describe('Whether contributor requests are disabled.'),
    displayName: z
      .string()
      .optional()
      .describe('The display name of the subreddit.'),
    displayNamePrefixed: z
      .string()
      .optional()
      .describe('The prefixed display name (e.g., "r/pics").'),
    emojisCustomSize: z
      .array(z.number())
      .describe('The custom size of emojis.'),
    emojisEnabled: z
      .boolean()
      .optional()
      .describe('Whether emojis are enabled.'),
    freeFormReports: z
      .boolean()
      .optional()
      .describe('Whether free-form reports are enabled.'),
    hasMenuWidget: z
      .boolean()
      .optional()
      .describe('Whether the subreddit has a menu widget.'),
    headerImg: z.string().optional().describe('The URL of the header image.'),
    headerSize: z.array(z.number()).describe('The size of the header image.'),
    headerTitle: z.string().optional().describe('The title of the header.'),
    hideAds: z.boolean().optional().describe('Whether ads are hidden.'),
    iconColor: z.string().optional().describe('The color of the icon.'),
    iconImg: z.string().optional().describe('The URL of the icon.'),
    iconSize: z.array(z.number()).describe('The size of the icon.'),
    id: z.string().optional().describe('The ID of the subreddit.'),
    isChatPostFeatureEnabled: z
      .boolean()
      .optional()
      .describe('Whether the chat post feature is enabled.'),
    isCrosspostableSubreddit: z
      .boolean()
      .optional()
      .describe('Whether the subreddit is crosspostable.'),
    isDefaultBanner: z
      .boolean()
      .optional()
      .describe('Whether the banner is the default.'),
    isDefaultIcon: z
      .boolean()
      .optional()
      .describe('Whether the icon is the default.'),
    isEnrolledInNewModmail: z
      .boolean()
      .optional()
      .describe('Whether the subreddit is enrolled in new modmail.'),
    keyColor: z.string().optional().describe('The key color of the subreddit.'),
    lang: z.string().optional().describe('The language of the subreddit.'),
    linkFlairEnabled: z
      .boolean()
      .optional()
      .describe('Whether link flair is enabled.'),
    linkFlairPosition: z
      .string()
      .optional()
      .describe('The position of the link flair.'),
    mobileBannerImage: z
      .string()
      .optional()
      .describe('The URL of the mobile banner image.'),
    name: z.string().optional().describe('The name of the subreddit.'),
    notificationLevel: z
      .string()
      .optional()
      .describe('The notification level for the current user.'),
    originalContentTagEnabled: z
      .string()
      .optional()
      .describe('Whether the original content tag is enabled.'),
    over18: z
      .boolean()
      .optional()
      .describe('Whether the subreddit is marked as NSFW.'),
    predictionLeaderboardEntryType: z
      .string()
      .optional()
      .describe('The entry type for the prediction leaderboard.'),
    previousNames: z
      .array(z.string())
      .describe('A list of previous names of the subreddit.'),
    primaryColor: z
      .string()
      .optional()
      .describe('The primary color of the subreddit.'),
    publicDescription: z
      .string()
      .optional()
      .describe('The public description of the subreddit.'),
    publicDescriptionHtml: z
      .string()
      .optional()
      .describe('The HTML representation of the public description.'),
    publicTraffic: z
      .boolean()
      .optional()
      .describe('Whether traffic stats are public.'),
    quarantine: z
      .boolean()
      .optional()
      .describe('Whether the subreddit is quarantined.'),
    restrictCommenting: z
      .boolean()
      .optional()
      .describe('Whether commenting is restricted.'),
    restrictPosting: z
      .boolean()
      .optional()
      .describe('Whether posting is restricted.'),
    shouldArchivePosts: z
      .boolean()
      .optional()
      .describe('Whether posts should be archived.'),
    shouldShowMediaInCommentsSetting: z
      .boolean()
      .optional()
      .describe('Whether to show media in comments setting.'),
    showMedia: z.boolean().optional().describe('Whether to show media.'),
    showMediaPreview: z
      .boolean()
      .optional()
      .describe('Whether to show media previews.'),
    spoilersEnabled: z
      .boolean()
      .optional()
      .describe('Whether spoilers are enabled.'),
    submissionType: z
      .string()
      .optional()
      .describe('The type of submissions allowed.'),
    submitLinkLabel: z
      .string()
      .optional()
      .describe('The label for the submit link button.'),
    submitText: z
      .string()
      .optional()
      .describe('The text for the submit text button.'),
    submitTextHtml: z
      .string()
      .optional()
      .describe('The HTML representation of the submit text.'),
    submitTextLabel: z
      .string()
      .optional()
      .describe('The label for the submit text button.'),
    subredditType: z.string().optional().describe('The type of the subreddit.'),
    subscribers: z.number().optional().describe('The number of subscribers.'),
    suggestedCommentSort: z
      .string()
      .optional()
      .describe('The suggested sort for comments.'),
    title: z.string().optional().describe('The title of the subreddit.'),
    url: z.string().optional().describe('The URL of the subreddit.'),
    userCanFlairInSr: z
      .boolean()
      .optional()
      .describe('Whether the user can set their own flair.'),
    userFlairBackgroundColor: z
      .string()
      .optional()
      .describe('The background color of the user flair.'),
    userFlairCssClass: z
      .string()
      .optional()
      .describe('The CSS class of the user flair.'),
    userFlairEnabledInSr: z
      .boolean()
      .optional()
      .describe('Whether user flair is enabled in the subreddit.'),
    userFlairPosition: z
      .string()
      .optional()
      .describe('The position of the user flair.'),
    userFlairRichtext: z
      .array(userFlairRichtextSchema)
      .describe('The rich text of the user flair.'),
    userFlairTemplateId: z
      .string()
      .optional()
      .describe('The template ID of the user flair.'),
    userFlairText: z
      .string()
      .optional()
      .describe('The text of the user flair.'),
    userFlairTextColor: z
      .string()
      .optional()
      .describe('The text color of the user flair.'),
    userFlairType: z
      .string()
      .optional()
      .describe('The type of the user flair.'),
    userHasFavorited: z
      .boolean()
      .optional()
      .describe('Whether the current user has favorited the subreddit.'),
    userIsBanned: z
      .boolean()
      .optional()
      .describe('Whether the current user is banned from the subreddit.'),
    userIsContributor: z
      .boolean()
      .optional()
      .describe('Whether the current user is a contributor.'),
    userIsModerator: z
      .boolean()
      .optional()
      .describe('Whether the current user is a moderator.'),
    userIsSubscriber: z
      .boolean()
      .optional()
      .describe('Whether the current user is a subscriber.'),
    userSrFlairEnabled: z
      .boolean()
      .optional()
      .describe('Whether the user has enabled their subreddit flair.'),
    userSrThemeEnabled: z
      .boolean()
      .optional()
      .describe('Whether the user has enabled the subreddit theme.'),
    videostreamLinksCount: z
      .number()
      .optional()
      .describe('The number of video stream links.'),
    whitelistStatus: z
      .string()
      .optional()
      .describe('The whitelist status of the subreddit.'),
    wikiEnabled: z
      .boolean()
      .optional()
      .describe('Whether the wiki is enabled.'),
    wls: z.number().optional().describe('Whitelist status (numerical).'),
    markedSpam: z
      .boolean()
      .optional()
      .describe('PRIVATE: Whether the subreddit is marked as spam.'),
    postRequirements: subredditPostRequirementsSchema
      .optional()
      .describe('Post requirements for the subreddit.'),
    userIsMuted: z
      .boolean()
      .describe('Whether the current user is muted in the subreddit.'),
  })
  .describe('Schema for a Reddit subreddit (legacy).');

export const subredditV2Schema = z
  .object({
    id: z.string().describe('The ID of the subreddit.'),
    name: z.string().describe('The name of the subreddit.'),
    nsfw: z.boolean().describe('Whether the subreddit is marked as NSFW.'),
    type: subredditTypeSchema.describe('The type of the subreddit.'),
    spam: z.boolean().describe('Whether the subreddit is marked as spam.'),
    quarantined: z.boolean().describe('Whether the subreddit is quarantined.'),
    topics: z.array(z.string()).describe('A list of topics for the subreddit.'),
    rating: subredditRatingSchema.describe(
      'The content rating of the subreddit.',
    ),
    subscribersCount: z.number().describe('The number of subscribers.'),
    permalink: z.string().describe('The permalink of the subreddit.'),
  })
  .describe('Schema for a Reddit subreddit (V2).');

// =============================================================================
// USER INTERFACES
// =============================================================================

export const userFeaturesExperimentSchema = z
  .object({
    experimentId: z.number().optional().describe('The ID of the experiment.'),
    owner: z.string().optional().describe('The owner of the experiment.'),
    variant: z.string().optional().describe('The variant of the experiment.'),
  })
  .describe('Schema for a feature experiment on a user.');

export const userFeaturesSchema = z
  .object({
    awardsOnStreams: z
      .boolean()
      .optional()
      .describe('Whether awards on streams are enabled.'),
    canMakeMobileTestBuildPurchases: z
      .boolean()
      .optional()
      .describe('Whether the user can make mobile test build purchases.'),
    chatGroupRollout: z
      .boolean()
      .optional()
      .describe('Whether the user is in the chat group rollout.'),
    chatSubreddit: z
      .boolean()
      .optional()
      .describe('Whether chat subreddits are enabled.'),
    chatUserSettings: z
      .boolean()
      .optional()
      .describe('Whether chat user settings are enabled.'),
    chat: z.boolean().optional().describe('Whether chat is enabled.'),
    cookieConsentBanner: z
      .boolean()
      .optional()
      .describe('Whether the cookie consent banner is shown.'),
    crosspostNotif: z
      .boolean()
      .optional()
      .describe('Whether crosspost notifications are enabled.'),
    crowdControlForPost: z
      .boolean()
      .optional()
      .describe('Whether crowd control for posts is enabled.'),
    customFeedImage: z
      .boolean()
      .optional()
      .describe('Whether custom feed images are enabled.'),
    doNotTrack: z
      .boolean()
      .optional()
      .describe('Whether "do not track" is enabled.'),
    expensiveCoinsPackage: z
      .boolean()
      .optional()
      .describe('Whether expensive coin packages are available.'),
    isEmailPermissionRequired: z
      .boolean()
      .optional()
      .describe('Whether email permission is required.'),
    liveComments: z
      .boolean()
      .optional()
      .describe('Whether live comments are enabled.'),
    liveOrangereds: z
      .boolean()
      .optional()
      .describe('Whether live orangereds (notifications) are enabled.'),
    modAwards: z
      .boolean()
      .optional()
      .describe('Whether moderator awards are enabled.'),
    modServiceMuteReads: z
      .boolean()
      .optional()
      .describe('Whether moderator service mute reads are enabled.'),
    modServiceMuteWrites: z
      .boolean()
      .optional()
      .describe('Whether moderator service mute writes are enabled.'),
    modlogCopyrightRemoval: z
      .boolean()
      .optional()
      .describe('Whether modlog copyright removal is enabled.'),
    mwebNsfwXpromo: userFeaturesExperimentSchema
      .optional()
      .describe('Experiment for NSFW mobile web cross-promotion.'),
    mwebXpromoInterstitialCommentsAndroid: z
      .boolean()
      .optional()
      .describe(
        'Whether the mobile web cross-promotion interstitial for comments is enabled on Android.',
      ),
    mwebXpromoInterstitialCommentsIos: z
      .boolean()
      .optional()
      .describe(
        'Whether the mobile web cross-promotion interstitial for comments is enabled on iOS.',
      ),
    mwebXpromoModalListingClickDailyDismissibleAndroid: z
      .boolean()
      .optional()
      .describe(
        'Whether the dismissible mobile web cross-promotion modal is enabled on Android.',
      ),
    mwebXpromoModalListingClickDailyDismissibleIos: z
      .boolean()
      .optional()
      .describe(
        'Whether the dismissible mobile web cross-promotion modal is enabled on iOS.',
      ),
    mwebXpromoRevampV2: userFeaturesExperimentSchema
      .optional()
      .describe('Experiment for mobile web cross-promotion revamp V2.'),
    mwebXpromoRevampV3: userFeaturesExperimentSchema
      .optional()
      .describe('Experiment for mobile web cross-promotion revamp V3.'),
    noreferrerToNoopener: z
      .boolean()
      .optional()
      .describe('Whether "noreferrer" is changed to "noopener".'),
    pollsMobile: z
      .boolean()
      .optional()
      .describe('Whether polls are enabled on mobile.'),
    premiumSubscriptionsTable: z
      .boolean()
      .optional()
      .describe('Whether the premium subscriptions table is shown.'),
    promotedTrendBlanks: z
      .boolean()
      .optional()
      .describe('Whether promoted trend blanks are shown.'),
    resizedStylesImages: z
      .boolean()
      .optional()
      .describe('Whether resized style images are used.'),
    showAmpLink: z.boolean().optional().describe('Whether to show AMP links.'),
    showNpsSurvey: z
      .boolean()
      .optional()
      .describe('Whether to show the NPS survey.'),
    spezModal: z
      .boolean()
      .optional()
      .describe('Whether the "spez" modal is shown.'),
    usePrefAccountDeployment: z
      .boolean()
      .optional()
      .describe('Whether to use the preferred account deployment.'),
    userFlairMigrationTesting: z
      .boolean()
      .optional()
      .describe(
        'Whether the user is in the user flair migration testing group.',
      ),
    webhookConfig: z
      .boolean()
      .optional()
      .describe('Whether webhook configuration is enabled.'),
  })
  .describe('Schema for the feature flags of a user.');

export const userSchema = z
  .lazy(() =>
    z.object({
      acceptChats: z
        .boolean()
        .optional()
        .describe('Whether the user accepts chats.'),
      acceptFollowers: z
        .boolean()
        .optional()
        .describe('Whether the user accepts followers.'),
      acceptPms: z
        .boolean()
        .optional()
        .describe('Whether the user accepts private messages.'),
      awardeeKarma: z
        .number()
        .optional()
        .describe('The karma earned from awards received.'),
      awarderKarma: z
        .number()
        .optional()
        .describe('The karma earned from awards given.'),
      canCreateSubreddit: z
        .boolean()
        .optional()
        .describe('Whether the user can create a subreddit.'),
      canEditName: z
        .boolean()
        .optional()
        .describe('Whether the user can edit their name.'),
      coins: z
        .number()
        .optional()
        .describe('The number of Reddit Coins the user has.'),
      commentKarma: z.number().optional().describe("The user's comment karma."),
      created: z
        .number()
        .optional()
        .describe('The timestamp of when the user account was created.'),
      createdUtc: z
        .number()
        .optional()
        .describe('The UTC timestamp of when the user account was created.'),
      features: userFeaturesSchema
        .optional()
        .describe('The feature flags for the user.'),
      forcePasswordReset: z
        .boolean()
        .optional()
        .describe('Whether the user is forced to reset their password.'),
      goldCreddits: z
        .number()
        .optional()
        .describe('The number of gold creddits the user has.'),
      goldExpiration: z
        .string()
        .optional()
        .describe("The expiration date of the user's gold subscription."),
      hasAndroidSubscription: z
        .boolean()
        .optional()
        .describe('Whether the user has an Android subscription.'),
      hasExternalAccount: z
        .boolean()
        .optional()
        .describe('Whether the user has an external account linked.'),
      hasGoldSubscription: z
        .boolean()
        .optional()
        .describe('Whether the user has a gold subscription.'),
      hasIosSubscription: z
        .boolean()
        .optional()
        .describe('Whether the user has an iOS subscription.'),
      hasMail: z
        .boolean()
        .optional()
        .describe('Whether the user has unread mail.'),
      hasModMail: z
        .boolean()
        .optional()
        .describe('Whether the user has unread mod mail.'),
      hasPaypalSubscription: z
        .boolean()
        .optional()
        .describe('Whether the user has a PayPal subscription.'),
      hasStripeSubscription: z
        .boolean()
        .optional()
        .describe('Whether the user has a Stripe subscription.'),
      hasSubscribed: z
        .boolean()
        .optional()
        .describe('Whether the user is subscribed.'),
      hasSubscribedToPremium: z
        .boolean()
        .optional()
        .describe('Whether the user is subscribed to Reddit Premium.'),
      hasVerifiedEmail: z
        .boolean()
        .optional()
        .describe('Whether the user has a verified email.'),
      hasVisitedNewProfile: z
        .boolean()
        .optional()
        .describe('Whether the user has visited their new profile.'),
      hideFromRobots: z
        .boolean()
        .optional()
        .describe('Whether the user is hidden from robots.'),
      iconImg: z
        .string()
        .optional()
        .describe("The URL of the user's icon image."),
      id: z.string().optional().describe('The ID of the user.'),
      inBeta: z
        .boolean()
        .optional()
        .describe('Whether the user is in the beta program.'),
      inChat: z.boolean().optional().describe('Whether the user is in chat.'),
      inRedesignBeta: z
        .boolean()
        .optional()
        .describe('Whether the user is in the redesign beta.'),
      inboxCount: z
        .number()
        .optional()
        .describe("The number of items in the user's inbox."),
      isBlocked: z
        .boolean()
        .optional()
        .describe('Whether the user is blocked by the current user.'),
      isEmployee: z
        .boolean()
        .optional()
        .describe('Whether the user is a Reddit employee.'),
      isFriend: z
        .boolean()
        .optional()
        .describe('Whether the user is a friend of the current user.'),
      isGold: z
        .boolean()
        .optional()
        .describe('Whether the user has Reddit Gold.'),
      isMod: z
        .boolean()
        .optional()
        .describe('Whether the user is a moderator.'),
      isSponsor: z
        .boolean()
        .optional()
        .describe('Whether the user is a sponsor.'),
      isSuspended: z
        .boolean()
        .optional()
        .describe('Whether the user is suspended.'),
      linkKarma: z.number().optional().describe("The user's link karma."),
      modhash: z.string().optional().describe("The user's modhash."),
      name: z.string().optional().describe('The username of the user.'),
      newModmailExists: z
        .boolean()
        .optional()
        .describe('Whether new mod mail exists.'),
      numFriends: z
        .number()
        .optional()
        .describe('The number of friends the user has.'),
      over18: z.boolean().optional().describe('Whether the user is over 18.'),
      passwordSet: z
        .boolean()
        .optional()
        .describe('Whether the user has set a password.'),
      prefAutoplay: z
        .boolean()
        .optional()
        .describe('Whether autoplay is preferred.'),
      prefClickgadget: z
        .number()
        .optional()
        .describe("The user's clickgadget preference."),
      prefGeopopular: z
        .string()
        .optional()
        .describe("The user's geopopular preference."),
      prefNightmode: z
        .boolean()
        .optional()
        .describe('Whether night mode is preferred.'),
      prefNoProfanity: z
        .boolean()
        .optional()
        .describe('Whether profanity should be filtered.'),
      prefShowPresence: z
        .boolean()
        .optional()
        .describe('Whether to show presence.'),
      prefShowSnoovatar: z
        .boolean()
        .optional()
        .describe('Whether to show the Snoovatar.'),
      prefShowTrending: z
        .boolean()
        .optional()
        .describe('Whether to show trending subreddits.'),
      prefShowTwitter: z
        .boolean()
        .optional()
        .describe('Whether to show Twitter integration.'),
      prefTopKarmaSubreddits: z
        .boolean()
        .optional()
        .describe('Whether to show top karma subreddits.'),
      prefVideoAutoplay: z
        .boolean()
        .optional()
        .describe('Whether video autoplay is preferred.'),
      snoovatarImg: z
        .string()
        .optional()
        .describe("The URL of the user's Snoovatar image."),
      snoovatarSize: z.array(z.number()).describe('The size of the Snoovatar.'),
      subreddit: subredditSchema
        .optional()
        .describe("The user's profile subreddit."),
      suspensionExpirationUtc: z
        .string()
        .optional()
        .describe('The UTC timestamp of when the suspension expires.'),
      totalKarma: z.number().optional().describe("The user's total karma."),
      verified: z
        .boolean()
        .optional()
        .describe('Whether the user is verified.'),
      hasPhoneNumber: z
        .boolean()
        .optional()
        .describe('Whether the user has a phone number.'),
      subredditsModerated: z
        .number()
        .optional()
        .describe('The number of subreddits the user moderates.'),
      hasMetaSubscription: z
        .boolean()
        .optional()
        .describe('Whether the user has a meta subscription.'),
      metaSubscriptionAge: z
        .number()
        .optional()
        .describe('The age of the meta subscription.'),
      metaPointsBalance: z
        .string()
        .optional()
        .describe("The user's meta points balance."),
      metaLockedPointsBalance: z
        .string()
        .optional()
        .describe("The user's locked meta points balance."),
      commentSubredditKarma: z
        .number()
        .optional()
        .describe("The user's comment karma in a specific subreddit."),
      postSubredditKarma: z
        .number()
        .optional()
        .describe("The user's post karma in a specific subreddit."),
      markedSpam: z
        .boolean()
        .optional()
        .describe('PRIVATE: Whether the user is marked as spam.'),
      isSubredditProxyAccount: z
        .boolean()
        .optional()
        .describe('Whether the user is a subreddit proxy account.'),
    }),
  )
  .describe('Schema for a Reddit user (legacy).');

export const userV2Schema = z
  .object({
    id: z.string().describe('The ID of the user.'),
    name: z.string().describe('The username of the user.'),
    isGold: z.boolean().describe('Whether the user has Reddit Gold.'),
    snoovatarImage: z
      .string()
      .describe("The URL of the user's Snoovatar image."),
    url: z.string().describe("The URL of the user's profile."),
    spam: z.boolean().describe('Whether the user is marked as spam.'),
    banned: z.boolean().describe('Whether the user is banned.'),
    flair: userFlairV2Schema.optional().describe("The user's flair."),
    karma: z.number().describe("The user's karma."),
    iconImage: z.string().describe("The URL of the user's icon image."),
    description: z.string().describe("The user's profile description."),
    suspended: z.boolean().describe('Whether the user is suspended.'),
  })
  .describe('Schema for a Reddit user (V2).');

// =============================================================================
// MODERATION INTERFACES
// =============================================================================

export const modMailSchema = z
  .object({
    messageAuthor: userV2Schema
      .optional()
      .describe('The author of the message.'),
    createdAt: z
      .date()
      .optional()
      .describe('The timestamp of when the message was created.'),
    messageAuthorType: z
      .string()
      .describe(
        'The type of the message author (moderator, participant_user, etc.).',
      ),
    conversationState: z
      .string()
      .describe('The state of the conversation (new, in-progress, archived).'),
    conversationType: z
      .string()
      .describe('The type of conversation (internal, sr_user, sr_sr).'),
    isAutoGenerated: z
      .boolean()
      .describe('Whether the conversation was auto-generated.'),
    conversationSubreddit: subredditV2Schema
      .optional()
      .describe('The subreddit owning the modmail conversation.'),
    destinationSubreddit: subredditV2Schema
      .optional()
      .describe('The subreddit the modmail is sent to.'),
    conversationId: z.string().describe('The ID of the conversation.'),
    messageId: z.string().describe('The ID of the message.'),
  })
  .describe('Schema for a modmail conversation.');

export const modActionSchema = z
  .object({
    action: z
      .string()
      .optional()
      .describe('The type of action performed (e.g., "removelink").'),
    actionedAt: z
      .date()
      .optional()
      .describe('The timestamp of when the action was performed.'),
    subreddit: subredditV2Schema
      .optional()
      .describe('The subreddit where the action occurred.'),
    moderator: userV2Schema
      .optional()
      .describe('The moderator who performed the action.'),
    targetUser: userV2Schema
      .optional()
      .describe('The user targeted by the action.'),
    targetComment: commentV2Schema
      .optional()
      .describe('The comment targeted by the action.'),
    targetPost: postV2Schema
      .optional()
      .describe('The post targeted by the action.'),
  })
  .describe('Schema for a moderator action.');

// =============================================================================
// LEGACY TYPES
// =============================================================================

export const redditSDKConfigSchema = z
  .object({
    clientId: z.string().describe('The client ID for your Reddit application.'),
    clientSecret: z
      .string()
      .describe('The client secret for your Reddit application.'),
    scopes: z
      .array(z.string())
      .describe('An array of scopes your application is requesting.'),
    accessToken: z
      .string()
      .describe('The access token for making authenticated requests.'),
    refreshToken: z
      .string()
      .optional()
      .describe('The refresh token for obtaining new access tokens.'),
  })
  .describe('Schema for the Reddit SDK configuration.');

export const searchResultSchema = z
  .object({
    id: z.string().optional().describe('The ID of the search result item.'),
    title: z
      .string()
      .optional()
      .describe('The title of the search result item.'),
    url: z.string().optional().describe('The URL of the search result item.'),
    score: z
      .number()
      .optional()
      .describe('The score of the search result item.'),
    created: z
      .number()
      .optional()
      .describe('The creation timestamp of the search result item.'),
    subreddit: z
      .string()
      .optional()
      .describe('The subreddit of the search result item.'),
    author: z
      .string()
      .optional()
      .describe('The author of the search result item.'),
  })
  .catchall(z.any())
  .describe('Schema for a generic search result.');

export const voteDirectionSchema = z
  .union([z.literal(1), z.literal(0), z.literal(-1)])
  .describe(
    'The direction of a vote: 1 for upvote, -1 for downvote, 0 to rescind vote.',
  );

export const listingParamsSchema = z
  .object({
    limit: z
      .number()
      .optional()
      .describe(
        'The maximum number of items to return in this slice of the listing.',
      ),
    before: z
      .string()
      .optional()
      .describe('Return items before this fullname.'),
    after: z.string().optional().describe('Return items after this fullname.'),
    count: z
      .number()
      .optional()
      .describe('The number of items already seen in this listing.'),
    show: z.string().optional().describe('Optional parameter for listings.'),
    sr_detail: z
      .boolean()
      .optional()
      .describe('Optional parameter to expand subreddit details.'),
  })
  .describe('Schema for parameters used in listings.');
