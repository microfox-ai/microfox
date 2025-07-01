## Function: `getSticky`

Retrieves a stickied post from a specific subreddit.

**Parameters:**

- `subreddit` (string): The name of the subreddit (e.g., 'learnprogramming').
- `num` (number, optional): The sticky slot to retrieve (1 or 2).

**Return Value:**

- `Promise<Post>`: A promise that resolves to the stickied post object.

**Post Type:**

```typescript
export interface Post {
  allAwardings: Awarding[]; // A list of all awards on this post.
  allowLiveComments?: boolean; // Whether live comments are allowed.
  approved?: boolean; // Whether the post is approved.
  approvedAtUtc?: number; // The UTC timestamp of when the post was approved.
  approvedBy?: string; // The user who approved the post.
  archived?: boolean; // Whether the post is archived.
  author?: string; // The author of the post.
  authorFlairBackgroundColor?: string; // The background color of the author's flair.
  authorFlairCssClass?: string; // The CSS class of the author's flair.
  authorFlairRichtext: AuthorFlairRichText[]; // The rich text of the author's flair.
  authorFlairTemplateId?: string; // The template ID of the author's flair.
  authorFlairText?: string; // The text of the author's flair.
  authorFlairTextColor?: string; // The text color of the author's flair.
  authorFlairType?: string; // The type of the author's flair.
  authorFullname?: string; // The fullname of the author.
  authorIsBlocked?: boolean; // Whether the author is blocked by the current user.
  authorPatreonFlair?: boolean; // Whether the author has Patreon flair.
  authorPremium?: boolean; // Whether the author has Reddit Premium.
  awarders: string[]; // A list of users who have awarded this post.
  bannedAtUtc?: number; // The UTC timestamp of when the user was banned.
  bannedBy?: string; // The user who banned the author for this post.
  canGild?: boolean; // Whether the post can be gilded.
  canModPost?: boolean; // Whether the user can moderate the post.
  category?: string; // The category of the post.
  clicked?: boolean; // Whether the post has been clicked.
  contentCategories?: string[]; // A list of content categories.
  contestMode?: boolean; // Whether the post is in contest mode.
  created?: number; // The timestamp of when the post was created.
  createdUtc?: number; // The UTC timestamp of when the post was created.
  discussionType?: string; // The type of discussion.
  distinguished?: string; // How the post is distinguished (e.g., "moderator").
  domain?: string; // The domain of the link.
  downs?: number; // The number of downvotes.
  edited?: boolean | number; // Whether the post has been edited.
  gilded?: number; // The number of times the post has been gilded.
  gildings: Gildings; // An object containing gilding information.
  hidden?: boolean; // Whether the post is hidden.
  hideScore?: boolean; // Whether the score is hidden.
  id?: string; // The ID of the post.
  isCreatedFromAdsUi?: boolean; // Whether the post was created from the ads UI.
  isCrosspostable?: boolean; // Whether the post is crosspostable.
  isMeta?: boolean; // Whether the post is a meta post.
  isOriginalContent?: boolean; // Whether the post is original content.
  isRedditMediaDomain?: boolean; // Whether the post is from a Reddit media domain.
  isRobotIndexable?: boolean; // Whether the post is indexable by robots.
  isSelf?: boolean; // Whether the post is a self-post.
  isSpam?: boolean; // Whether the post is marked as spam.
  isStale?: boolean; // Whether the post is stale.
  isSubmitted?: boolean; // Whether the post has been submitted.
  isVideo?: boolean; // Whether the post is a video.
  likes?: boolean; // Whether the current user has liked the post.
  linkFlairBackgroundColor?: string; // The background color of the link flair.
  linkFlairCssClass?: string; // The CSS class of the link flair.
  linkFlairRichtext: string[]; // The rich text of the link flair.
  linkFlairTextColor?: string; // The text color of the link flair.
  linkFlairText?: string; // The text of the link flair.
  linkFlairType?: string; // The type of the link flair.
  locked?: boolean; // Whether the post is locked.
  mediaEmbed?: MediaEmbed; // Embedded media for the post.
  mediaOnly?: boolean; // Whether the post is media-only.
  media?: Media; // Media content of the post.
  modNote?: string; // A note from a moderator.
  modReasonBy?: string; // The user who provided the moderator reason.
  modReasonTitle?: string; // The title of the moderator reason.
  modReports: any[][]; // Moderator reports on the post.
  name?: string; // The fullname of the post.
  noFollow?: boolean; // Whether to apply "nofollow" to links in the post.
  numComments?: number; // The number of comments on the post.
  numCrossposts?: number; // The number of crossposts.
  numDuplicates?: number; // The number of duplicate posts.
  numReports?: number; // The number of reports on the post.
  over18?: boolean; // Whether the post is marked as NSFW.
  parentWhitelistStatus?: string; // The whitelist status of the parent.
  permalink?: string; // The permalink of the post.
  pinned?: boolean; // Whether the post is pinned.
  postHint?: string; // A hint for the type of post.
  preview?: Preview; // The preview of the post.
  pwls?: number; // Parent whitelist status (numerical).
  quarantine?: boolean; // Whether the post is quarantined.
  removalReason?: string; // The reason for the post's removal.
  removedByCategory?: string; // The category of the removal.
  removedBy?: string; // The user who removed the post.
  removed?: boolean; // Whether the post was removed.
  reportReasons: string[]; // A list of reasons for reports.
  rteMode?: string; // The rich text editor mode used.
  saved?: boolean; // Whether the post is saved by the current user.
  score?: number; // The score of the post.
  secureMediaEmbed?: MediaEmbed; // Secure embedded media for the post.
  secureMedia?: Media; // Secure media content of the post.
  selftextHtml?: string; // The HTML representation of the self-text.
  selftext?: string; // The self-text of the post as markdown.
  sendReplies?: boolean; // Whether the author wants to receive replies.
  spam?: boolean; // Whether the post is marked as spam.
  spoiler?: boolean; // Whether the post is marked as a spoiler.
  stickied?: boolean; // Whether the post is stickied.
  subredditId?: string; // The ID of the subreddit.
  subredditNamePrefixed?: string; // The prefixed name of the subreddit (e.g., "r/pics").
  subredditSubscribers?: number; // The number of subscribers to the subreddit.
  subredditType?: string; // The type of the subreddit.
  subreddit?: string; // The subreddit the post belongs to.
  suggestedSort?: string; // The suggested sort for comments.
  thumbnailHeight?: number; // The height of the thumbnail.
  thumbnailWidth?: number; // The width of the thumbnail.
  thumbnail?: string; // The URL of the thumbnail.
  title?: string; // The title of the post.
  topAwardedType?: string; // The type of the top award.
  totalAwardsReceived?: number; // The total number of awards received.
  treatmentTags: string[]; // A list of treatment tags.
  ups?: number; // The number of upvotes.
  upvoteRatio?: number; // The ratio of upvotes to downvotes.
  urlOverriddenByDest?: string; // The URL overridden by the destination.
  url?: string; // The URL of the post.
  userReports: any[][]; // User reports on the post.
  viewCount?: number; // The number of views.
  visited?: boolean; // Whether the post has been visited by the current user.
  whitelistStatus?: string; // The whitelist status.
  wls?: number; // Whitelist status (numerical).
  linkFlairTemplateId?: string; // The template ID of the link flair.
  crowdControlLevel?: number; // The crowd control level of the post.
}
```

**Usage Example:**

```typescript
const stickiedPost = await reddit.api.subreddits.getSticky({
  subreddit: 'learnprogramming',
  num: 1,
});
console.log(stickiedPost);
```
