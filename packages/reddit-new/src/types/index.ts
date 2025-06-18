import { z } from 'zod';
import * as schemas from '../schemas';

// =============================================================================
// ENUMS
// =============================================================================

export const {
  thingTypeSchema,
  crowdControlLevelSchema,
  distinguishTypeSchema,
  subredditTypeSchema,
  subredditRatingSchema,
  modActionTypeSchema,
  banInfoBanInfoActionSchema
} = schemas;

export type ThingType = z.infer<typeof schemas.thingTypeSchema>;
export type CrowdControlLevel = z.infer<typeof schemas.crowdControlLevelSchema>;
export type DistinguishType = z.infer<typeof schemas.distinguishTypeSchema>;
export type SubredditType = z.infer<typeof schemas.subredditTypeSchema>;
export type SubredditRating = z.infer<typeof schemas.subredditRatingSchema>;
export type ModActionType = z.infer<typeof schemas.modActionTypeSchema>;
export type BanInfo_BanInfoAction = z.infer<typeof schemas.banInfoBanInfoActionSchema>;

// =============================================================================
// COMMON INTERFACES
// =============================================================================

export const {
  authorFlairRichTextSchema,
  userFlairRichtextSchema,
  awardingIconSchema,
  awardingSchema,
  commentContributionSettingsSchema,
  gildingsSchema,
  mediaEmbedSchema,
  banInfoSchema
} = schemas;

export type AuthorFlairRichText = z.infer<typeof schemas.authorFlairRichTextSchema>;
export type UserFlairRichtext = z.infer<typeof schemas.userFlairRichtextSchema>;
export type Awarding_Icon = z.infer<typeof schemas.awardingIconSchema>;
export type Awarding = z.infer<typeof schemas.awardingSchema>;
export type CommentContributionSettings = z.infer<typeof schemas.commentContributionSettingsSchema>;
export type Gildings = z.infer<typeof schemas.gildingsSchema>;
export type MediaEmbed = z.infer<typeof schemas.mediaEmbedSchema>;
export type BanInfo = z.infer<typeof schemas.banInfoSchema>;

// =============================================================================
// FLAIR INTERFACES
// =============================================================================

export const {
  linkFlairV2Schema,
  userFlairV2Schema
} = schemas;

export type LinkFlairV2 = z.infer<typeof schemas.linkFlairV2Schema>;
export type UserFlairV2 = z.infer<typeof schemas.userFlairV2Schema>;

// =============================================================================
// COMMENT INTERFACES
// =============================================================================

export const {
  commentSchema,
  commentV2Schema
} = schemas;

export type Comment = z.infer<typeof schemas.commentSchema>;
export type CommentV2 = z.infer<typeof schemas.commentV2Schema>;

// =============================================================================
// POST INTERFACES
// =============================================================================

export const {
  mediaRedditVideoSchema,
  mediaSchema,
  previewPreviewImageImageSchema,
  previewPreviewImageSchema,
  previewSchema,
  oEmbedSchema,
  redditPostGallerySchema,
  postSchema,
  oembedSchema,
  redditVideoSchema,
  mediaObjectSchema,
  postV2Schema
} = schemas;

export type Media_RedditVideo = z.infer<typeof schemas.mediaRedditVideoSchema>;
export type Media = z.infer<typeof schemas.mediaSchema>;
export type Preview_PreviewImage_Image = z.infer<typeof schemas.previewPreviewImageImageSchema>;
export type Preview_PreviewImage = z.infer<typeof schemas.previewPreviewImageSchema>;
export type Preview = z.infer<typeof schemas.previewSchema>;
export type OEmbed = z.infer<typeof schemas.oEmbedSchema>;
export type RedditPostGallery = z.infer<typeof schemas.redditPostGallerySchema>;
export type Post = z.infer<typeof schemas.postSchema>;
export type Oembed = z.infer<typeof schemas.oembedSchema>;
export type RedditVideo = z.infer<typeof schemas.redditVideoSchema>;
export type MediaObject = z.infer<typeof schemas.mediaObjectSchema>;
export type PostV2 = z.infer<typeof schemas.postV2Schema>;

// =============================================================================
// SUBREDDIT INTERFACES
// =============================================================================

export const {
  subredditPostRequirementsSchema,
  subredditSchema,
  subredditV2Schema
} = schemas;

export type Subreddit_PostRequirements = z.infer<typeof schemas.subredditPostRequirementsSchema>;
export type Subreddit = z.infer<typeof schemas.subredditSchema>;
export type SubredditV2 = z.infer<typeof schemas.subredditV2Schema>;

// =============================================================================
// USER INTERFACES
// =============================================================================

export const {
  userFeaturesExperimentSchema,
  userFeaturesSchema,
  userSchema,
  userV2Schema
} = schemas;

export type UserFeatures_Experiment = z.infer<typeof schemas.userFeaturesExperimentSchema>;
export type UserFeatures = z.infer<typeof schemas.userFeaturesSchema>;
export type User = z.infer<typeof schemas.userSchema>;
export type UserV2 = z.infer<typeof schemas.userV2Schema>;

// =============================================================================
// MODERATION INTERFACES
// =============================================================================

export const {
  modMailSchema,
  modActionSchema
} = schemas;

export type ModMail = z.infer<typeof schemas.modMailSchema>;
export type ModAction = z.infer<typeof schemas.modActionSchema>;

// =============================================================================
// LEGACY TYPES (for backward compatibility)
// =============================================================================

export const {
  redditSDKConfigSchema,
  searchResultSchema,
  voteDirectionSchema,
  listingParamsSchema
} = schemas;

export type RedditSDKConfig = z.infer<typeof schemas.redditSDKConfigSchema>;
export type SearchResult = z.infer<typeof schemas.searchResultSchema>;
export type VoteDirection = z.infer<typeof schemas.voteDirectionSchema>;
export type ListingParams = z.infer<typeof schemas.listingParamsSchema>; 