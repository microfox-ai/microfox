## Function: `getComments`

Part of the `listings` section. Get the comments for a post.

**Parameters:**

- `article` (string): The ID36 of a link.
- `comment` (string, optional): The ID36 of a comment.
- `context` (number, optional): An integer between 0 and 8.
- `depth` (number, optional): The maximum depth of comments to return.
- `limit` (number, optional): The maximum number of comments to return.
- `showedits` (boolean, optional): Whether to show edited comments.
- `showmedia` (boolean, optional): Whether to show media in comments.
- `showmore` (boolean, optional): Whether to include "more" comments objects.
- `showtitle` (boolean, optional): Whether to show the post title.
- `sort` (string, optional): The sort order for comments. One of: 'confidence', 'top', 'new', 'controversial', 'old', 'random', 'qa', 'live'.
- `sr_detail` (boolean, optional): Optional parameter to expand subreddit details.
- `theme` (string, optional): The theme for the comments page. One of: 'default', 'dark'.
- `threaded` (boolean, optional): Whether to thread comments.
- `truncate` (number, optional): An integer between 0 and 50.

**Return Value:**

- `Promise<[Listing<Post>, Listing<Comment>]>`: A promise that resolves to a tuple containing a listing of the post and a listing of the comments.

**Comment Type:**

```typescript
export interface Comment {
  allAwardings: Awarding[]; // A list of all awards on this comment.
  approved?: boolean; // Whether the comment is approved.
  approvedAtUtc?: number; // The UTC timestamp of when the comment was approved.
  approvedBy?: string; // The user who approved the comment.
  archived?: boolean; // Whether the comment is archived.
  associatedAward?: string; // The associated award for the comment.
  author?: string; // The author of the comment.
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
  awarders: string[]; // A list of users who awarded the comment.
  bannedAtUtc?: number; // The UTC timestamp of when the author was banned.
  bannedBy?: string; // The user who banned the author.
  body?: string; // The body of the comment as markdown.
  bodyHtml?: string; // The HTML representation of the comment body.
  canGild?: boolean; // Whether the comment can be gilded.
  canModPost?: boolean; // Whether the current user can moderate the post.
  collapsed?: boolean; // Whether the comment is collapsed.
  collapsedBecauseCrowdControl?: boolean; // Whether the comment was collapsed due to crowd control.
  collapsedReason?: string; // The reason for the comment being collapsed.
  collapsedReasonCode?: string; // The code for the reason the comment was collapsed.
  commentType?: string; // The type of the comment.
  controversiality?: number; // The controversiality score of the comment.
  created?: number; // The timestamp of when the comment was created.
  createdUtc?: number; // The UTC timestamp of when the comment was created.
  depth?: number; // The depth of the comment in a thread.
  distinguished?: string; // How the comment is distinguished (e.g., "moderator").
  downs?: number; // The number of downvotes.
  edited?: boolean; // Whether the comment has been edited.
  gilded?: number; // The number of times the comment has been gilded.
  gildings?: Gildings; // The gildings for the comment.
  id?: string; // The ID of the comment.
  ignoreReports?: boolean; // Whether reports on the comment are ignored.
  isSubmitter?: boolean; // Whether the author is the submitter of the post.
  likes?: boolean; // Whether the current user has liked the comment.
  linkId?: string; // The ID of the link (post) the comment belongs to.
  locked?: boolean; // Whether the comment is locked.
  modNote?: string; // A note from a moderator.
  modReasonBy?: string; // The user who provided the moderator reason.
  modReasonTitle?: string; // The title of the moderator reason.
  modReports: any[][]; // Moderator reports on the comment.
  name?: string; // The fullname of the comment.
  noFollow?: boolean; // Whether to apply "nofollow" to links in the comment.
  numReports?: number; // The number of reports on the comment.
  parentId?: string; // The ID of the parent comment or post.
  permalink?: string; // The permalink of the comment.
  removalReason?: string; // The reason for the comment's removal.
  removed?: boolean; // Whether the comment was removed.
  replies?: any; // Replies to this comment (can be a "more" object or a Listing of Comments).
  reportReasons: string[]; // A list of reasons for reports.
  rteMode?: string; // The rich text editor mode used.
  saved?: boolean; // Whether the comment is saved by the current user.
  score?: number; // The score of the comment.
  scoreHidden?: boolean; // Whether the score is hidden.
  sendReplies?: boolean; // Whether the author wants to receive replies.
  spam?: boolean; // Whether the comment is marked as spam.
  stickied?: boolean; // Whether the comment is stickied.
  subreddit?: string; // The subreddit the comment belongs to.
  subredditId?: string; // The ID of the subreddit.
  subredditNamePrefixed?: string; // The prefixed name of the subreddit (e.g., "r/pics").
  subredditType?: string; // The type of the subreddit.
  topAwardedType?: string; // The type of the top award.
  totalAwardsReceived?: number; // The total number of awards received.
  treatmentTags: string[]; // A list of treatment tags.
  unrepliableReason?: string; // The reason why the comment is unrepliable.
  ups?: number; // The number of upvotes.
  userReports: any[][]; // User reports on the comment.
  count?: number; // The count for "more" objects.
  children: string[]; // A list of child comment IDs for "more" objects.
}
```

**Usage Examples:**

```typescript
// 1. Get comments for a post in a subreddit
const [post, comments] = await reddit.api.listings.getComments({
  subreddit: 'learnjavascript',
  articleId: 'q12345',
});
console.log(comments);
```

```typescript
// 2. Get 10 newest comments
const [post2, newComments] = await reddit.api.listings.getComments({
  subreddit: 'learnjavascript',
  articleId: 'q12345',
  limit: 10,
  sort: 'new',
});
console.log(newComments);
```

```typescript
// 3. Get comments up to a depth of 2
const [post3, limitedDepthComments] = await reddit.api.listings.getComments({
  subreddit: 'learnjavascript',
  articleId: 'q12345',
  depth: 2,
});
console.log(limitedDepthComments);
```
