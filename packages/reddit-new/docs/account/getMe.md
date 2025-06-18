## Function: `api.account.getMe`

Gets the account information for the currently authenticated user.

**Parameters:**

This function does not take any parameters.

**Return Value:**

- `Promise<User>`: A promise that resolves to the user object.

**User Type:**

```typescript
export interface User {
  acceptChats?: boolean; // Whether the user accepts chats.
  acceptFollowers?: boolean; // Whether the user accepts followers.
  acceptPms?: boolean; // Whether the user accepts private messages.
  awardeeKarma?: number; // The karma earned from awards received.
  awarderKarma?: number; // The karma earned from awards given.
  canCreateSubreddit?: boolean; // Whether the user can create a subreddit.
  canEditName?: boolean; // Whether the user can edit their name.
  coins?: number; // The number of Reddit Coins the user has.
  commentKarma?: number; // The user's comment karma.
  created?: number; // The timestamp of when the user account was created.
  createdUtc?: number; // The UTC timestamp of when the user account was created.
  features?: UserFeatures; // The feature flags for the user.
  forcePasswordReset?: boolean; // Whether the user is forced to reset their password.
  goldCreddits?: number; // The number of gold creddits the user has.
  goldExpiration?: string; // The expiration date of the user's gold subscription.
  hasAndroidSubscription?: boolean; // Whether the user has an Android subscription.
  hasExternalAccount?: boolean; // Whether the user has an external account linked.
  hasGoldSubscription?: boolean; // Whether the user has a gold subscription.
  hasIosSubscription?: boolean; // Whether the user has an iOS subscription.
  hasMail?: boolean; // Whether the user has unread mail.
  hasModMail?: boolean; // Whether the user has unread mod mail.
  hasPaypalSubscription?: boolean; // Whether the user has a PayPal subscription.
  hasStripeSubscription?: boolean; // Whether the user has a Stripe subscription.
  hasSubscribed?: boolean; // Whether the user is subscribed.
  hasSubscribedToPremium?: boolean; // Whether the user is subscribed to Reddit Premium.
  hasVerifiedEmail?: boolean; // Whether the user has a verified email.
  hasVisitedNewProfile?: boolean; // Whether the user has visited their new profile.
  hideFromRobots?: boolean; // Whether the user is hidden from robots.
  iconImg?: string; // The URL of the user's icon image.
  id?: string; // The ID of the user.
  inBeta?: boolean; // Whether the user is in the beta program.
  inChat?: boolean; // Whether the user is in chat.
  inRedesignBeta?: boolean; // Whether the user is in the redesign beta.
  inboxCount?: number; // The number of items in the user's inbox.
  isBlocked?: boolean; // Whether the user is blocked by the current user.
  isEmployee?: boolean; // Whether the user is a Reddit employee.
  isFriend?: boolean; // Whether the user is a friend of the current user.
  isGold?: boolean; // Whether the user has Reddit Gold.
  isMod?: boolean; // Whether the user is a moderator.
  isSponsor?: boolean; // Whether the user is a sponsor.
  isSuspended?: boolean; // Whether the user is suspended.
  linkKarma?: number; // The user's link karma.
  modhash?: string; // The user's modhash.
  name?: string; // The username of the user.
  newModmailExists?: boolean; // Whether new mod mail exists.
  numFriends?: number; // The number of friends the user has.
  over18?: boolean; // Whether the user is over 18.
  passwordSet?: boolean; // Whether the user has set a password.
  prefAutoplay?: boolean; // Whether autoplay is preferred.
  prefClickgadget?: number; // The user's clickgadget preference.
  prefGeopopular?: string; // The user's geopopular preference.
  prefNightmode?: boolean; // Whether night mode is preferred.
  prefNoProfanity?: boolean; // Whether profanity should be filtered.
  prefShowPresence?: boolean; // Whether to show presence.
  prefShowSnoovatar?: boolean; // Whether to show the Snoovatar.
  prefShowTrending?: boolean; // Whether to show trending subreddits.
  prefShowTwitter?: boolean; // Whether to show Twitter integration.
  prefTopKarmaSubreddits?: boolean; // Whether to show top karma subreddits.
  prefVideoAutoplay?: boolean; // Whether video autoplay is preferred.
  snoovatarImg?: string; // The URL of the user's Snoovatar image.
  snoovatarSize?: number[]; // The size of the Snoovatar.
  subreddit?: Subreddit; // The user's profile subreddit.
  suspensionExpirationUtc?: string; // The UTC timestamp of when the suspension expires.
  totalKarma?: number; // The user's total karma.
  verified?: boolean; // Whether the user is verified.
  hasPhoneNumber?: boolean; // Whether the user has a phone number.
  subredditsModerated?: number; // The number of subreddits the user moderates.
  hasMetaSubscription?: boolean; // Whether the user has a meta subscription.
  metaSubscriptionAge?: number; // The age of the meta subscription.
  metaPointsBalance?: string; // The user's meta points balance.
  metaLockedPointsBalance?: string; // The user's locked meta points balance.
  commentSubredditKarma?: number; // The user's comment karma in a specific subreddit.
  postSubredditKarma?: number; // The user's post karma in a specific subreddit.
  markedSpam?: boolean; // PRIVATE: Whether the user is marked as spam.
  isSubredditProxyAccount?: boolean; // Whether the user is a subreddit proxy account.
}
```

**UserFeatures Type:**

```typescript
export interface UserFeatures {
  awardsOnStreams?: boolean; // Whether awards on streams are enabled.
  canMakeMobileTestBuildPurchases?: boolean; // Whether the user can make mobile test build purchases.
  chatGroupRollout?: boolean; // Whether the user is in the chat group rollout.
  chatSubreddit?: boolean; // Whether chat subreddits are enabled.
  chatUserSettings?: boolean; // Whether chat user settings are enabled.
  chat?: boolean; // Whether chat is enabled.
  cookieConsentBanner?: boolean; // Whether the cookie consent banner is shown.
  crosspostNotif?: boolean; // Whether crosspost notifications are enabled.
  crowdControlForPost?: boolean; // Whether crowd control for posts is enabled.
  customFeedImage?: boolean; // Whether custom feed images are enabled.
  doNotTrack?: boolean; // Whether "do not track" is enabled.
  expensiveCoinsPackage?: boolean; // Whether expensive coin packages are available.
  isEmailPermissionRequired?: boolean; // Whether email permission is required.
  liveComments?: boolean; // Whether live comments are enabled.
  liveOrangereds?: boolean; // Whether live orangereds (notifications) are enabled.
  modAwards?: boolean; // Whether moderator awards are enabled.
  modServiceMuteReads?: boolean; // Whether moderator service mute reads are enabled.
  modServiceMuteWrites?: boolean; // Whether moderator service mute writes are enabled.
  modlogCopyrightRemoval?: boolean; // Whether modlog copyright removal is enabled.
  mwebNsfwXpromo?: UserFeaturesExperiment; // Experiment for NSFW mobile web cross-promotion.
  mwebXpromoInterstitialCommentsAndroid?: boolean; // Whether the mobile web cross-promotion interstitial for comments is enabled on Android.
  mwebXpromoInterstitialCommentsIos?: boolean; // Whether the mobile web cross-promotion interstitial for comments is enabled on iOS.
  mwebXpromoModalListingClickDailyDismissibleAndroid?: boolean; // Whether the dismissible mobile web cross-promotion modal is enabled on Android.
  mwebXpromoModalListingClickDailyDismissibleIos?: boolean; // Whether the dismissible mobile web cross-promotion modal is enabled on iOS.
  mwebXpromoRevampV2?: UserFeaturesExperiment; // Experiment for mobile web cross-promotion revamp V2.
  mwebXpromoRevampV3?: UserFeaturesExperiment; // Experiment for mobile web cross-promotion revamp V3.
  noreferrerToNoopener?: boolean; // Whether "noreferrer" is changed to "noopener".
  pollsMobile?: boolean; // Whether polls are enabled on mobile.
  premiumSubscriptionsTable?: boolean; // Whether the premium subscriptions table is shown.
  promotedTrendBlanks?: boolean; // Whether promoted trend blanks are shown.
  resizedStylesImages?: boolean; // Whether resized style images are used.
  showAmpLink?: boolean; // Whether to show AMP links.
  showNpsSurvey?: boolean; // Whether to show the NPS survey.
  spezModal?: boolean; // Whether the "spez" modal is shown.
  usePrefAccountDeployment?: boolean; // Whether to use the preferred account deployment.
  userFlairMigrationTesting?: boolean; // Whether the user is in the user flair migration testing group.
  webhookConfig?: boolean; // Whether webhook configuration is enabled.
}
```

**UserFeaturesExperiment Type:**
```typescript
export interface UserFeaturesExperiment {
  experimentId?: number; // The ID of the experiment.
  owner?: string; // The owner of the experiment.
  variant?: string; // The variant of the experiment.
}
```

**Subreddit Type:**

```typescript
export interface Subreddit {
  acceptFollowers?: boolean; // Whether the subreddit accepts followers.
  accountsActiveIsFuzzed?: boolean; // Whether the active accounts count is fuzzed.
  accountsActive?: number; // The number of active accounts.
  activeUserCount?: number; // The number of active users.
  advertiserCategory?: string; // The advertiser category of the subreddit.
  allOriginalContent?: boolean; // Whether all content must be original.
  allowChatPostCreation?: boolean; // Whether chat post creation is allowed.
  allowDiscovery?: boolean; // Whether the subreddit is discoverable.
  allowGalleries?: boolean; // Whether galleries are allowed.
  allowImages?: boolean; // Whether images are allowed.
  allowPolls?: boolean; // Whether polls are allowed.
  allowPredictionContributors?: boolean; // Whether prediction contributors are allowed.
  allowPredictionsTournament?: boolean; // Whether prediction tournaments are allowed.
  allowPredictions?: boolean; // Whether predictions are allowed.
  allowTalks?: boolean; // Whether talks are allowed.
  allowVideogifs?: boolean; // Whether video GIFs are allowed.
  allowVideos?: boolean; // Whether videos are allowed.
  allowedMediaInComments?: string[]; // A list of allowed media types in comments.
  bannerBackgroundColor?: string; // The background color of the banner.
  bannerBackgroundImage?: string; // The background image of the banner.
  bannerImg?: string; // The image of the banner.
  bannerSize?: number[]; // The size of the banner.
  canAssignLinkFlair?: boolean; // Whether users can assign link flair.
  canAssignUserFlair?: boolean; // Whether users can assign user flair.
  coins?: number; // The number of coins in the subreddit.
  collapseDeletedComments?: boolean; // Whether deleted comments should be collapsed.
  commentContributionSettings?: CommentContributionSettings; // Settings for comment contributions.
  commentScoreHideMins?: number; // The number of minutes to hide comment scores.
  communityIcon?: string; // The URL of the community icon.
  communityReviewed?: boolean; // Whether the community has been reviewed.
  contentCategory?: string; // The content category of the subreddit.
  createdUtc?: number; // The UTC timestamp of when the subreddit was created.
  created?: number; // The timestamp of when the subreddit was created.
  defaultSet?: boolean; // Whether the subreddit is in the default set.
  description?: string; // The description of the subreddit.
  descriptionHtml?: string; // The HTML representation of the description.
  disableContributorRequests?: boolean; // Whether contributor requests are disabled.
  displayName?: string; // The display name of the subreddit.
  displayNamePrefixed?: string; // The prefixed display name (e.g., "r/pics").
  emojisCustomSize?: number[]; // The custom size of emojis.
  emojisEnabled?: boolean; // Whether emojis are enabled.
  freeFormReports?: boolean; // Whether free-form reports are enabled.
  hasMenuWidget?: boolean; // Whether the subreddit has a menu widget.
  headerImg?: string; // The URL of the header image.
  headerSize?: number[]; // The size of the header image.
  headerTitle?: string; // The title of the header.
  hideAds?: boolean; // Whether ads are hidden.
  iconColor?: string; // The color of the icon.
  iconImg?: string; // The URL of the icon.
  iconSize?: number[]; // The size of the icon.
  id?: string; // The ID of the subreddit.
  isChatPostFeatureEnabled?: boolean; // Whether the chat post feature is enabled.
  isCrosspostableSubreddit?: boolean; // Whether the subreddit is crosspostable.
  isDefaultBanner?: boolean; // Whether the banner is the default.
  isDefaultIcon?: boolean; // Whether the icon is the default.
  isEnrolledInNewModmail?: boolean; // Whether the subreddit is enrolled in new modmail.
  keyColor?: string; // The key color of the subreddit.
  lang?: string; // The language of the subreddit.
  linkFlairEnabled?: boolean; // Whether link flair is enabled.
  linkFlairPosition?: string; // The position of the link flair.
  mobileBannerImage?: string; // The URL of the mobile banner image.
  name?: string; // The name of the subreddit.
  notificationLevel?: string; // The notification level for the current user.
  originalContentTagEnabled?: string; // Whether the original content tag is enabled.
  over18?: boolean; // Whether the subreddit is marked as NSFW.
  predictionLeaderboardEntryType?: string; // The entry type for the prediction leaderboard.
  previousNames?: string[]; // A list of previous names of the subreddit.
  primaryColor?: string; // The primary color of the subreddit.
  publicDescription?: string; // The public description of the subreddit.
  publicDescriptionHtml?: string; // The HTML representation of the public description.
  publicTraffic?: boolean; // Whether traffic stats are public.
  quarantine?: boolean; // Whether the subreddit is quarantined.
  restrictCommenting?: boolean; // Whether commenting is restricted.
  restrictPosting?: boolean; // Whether posting is restricted.
  shouldArchivePosts?: boolean; // Whether posts should be archived.
  shouldShowMediaInCommentsSetting?: boolean; // Whether to show media in comments setting.
  showMedia?: boolean; // Whether to show media.
  showMediaPreview?: boolean; // Whether to show media previews.
  spoilersEnabled?: boolean; // Whether spoilers are enabled.
  submissionType?: string; // The type of submissions allowed.
  submitLinkLabel?: string; // The label for the submit link button.
  submitText?: string; // The text for the submit text button.
  submitTextHtml?: string; // The HTML representation of the submit text.
  submitTextLabel?: string; // The label for the submit text button.
  subredditType?: string; // The type of the subreddit.
  subscribers?: number; // The number of subscribers.
  suggestedCommentSort?: string; // The suggested sort for comments.
  title?: string; // The title of the subreddit.
  url?: string; // The URL of the subreddit.
  userCanFlairInSr?: boolean; // Whether the user can set their own flair.
  userFlairBackgroundColor?: string; // The background color of the user flair.
  userFlairCssClass?: string; // The CSS class of the user flair.
  userFlairEnabledInSr?: boolean; // Whether user flair is enabled in the subreddit.
  userFlairPosition?: string; // The position of the user flair.
  userFlairRichtext?: UserFlairRichtext[]; // The rich text of the user flair.
  userFlairTemplateId?: string; // The template ID of the user flair.
  userFlairText?: string; // The text of the user flair.
  userFlairTextColor?: string; // The text color of the user flair.
  userFlairType?: string; // The type of the user flair.
  userHasFavorited?: boolean; // Whether the current user has favorited the subreddit.
  userIsBanned?: boolean; // Whether the current user is banned from the subreddit.
  userIsContributor?: boolean; // Whether the current user is a contributor.
  userIsModerator?: boolean; // Whether the current user is a moderator.
  userIsSubscriber?: boolean; // Whether the current user is a subscriber.
  userSrFlairEnabled?: boolean; // Whether the user has enabled their subreddit flair.
  userSrThemeEnabled?: boolean; // Whether the user has enabled the subreddit theme.
  videostreamLinksCount?: number; // The number of video stream links.
  whitelistStatus?: string; // The whitelist status of the subreddit.
  wikiEnabled?: boolean; // Whether the wiki is enabled.
  wls?: number; // Whitelist status (numerical).
  markedSpam?: boolean; // PRIVATE: Whether the subreddit is marked as spam.
  postRequirements?: SubredditPostRequirements; // Post requirements for the subreddit.
  userIsMuted?: boolean; // Whether the current user is muted in the subreddit.
}
```

**CommentContributionSettings Type:**

```typescript
export interface CommentContributionSettings {
  allowedMediaTypes: string[]; // List of allowed media types in comments.
}
```

**UserFlairRichtext Type:**
```typescript
export interface UserFlairRichtext {
  e?: string; // Type of the flair element (e.g., "text", "emoji").
  t?: string; // Text of the flair element.
}
```

**SubredditPostRequirements Type:**

```typescript
export interface SubredditPostRequirements {
  bodyRestrictionPolicy?: string; // The restriction policy for post bodies.
}
```

**Examples:**

```typescript
// Example: Get current user's info
const myInfo = await sdk.api.account.getMe();
console.log(myInfo.name);
``` 
