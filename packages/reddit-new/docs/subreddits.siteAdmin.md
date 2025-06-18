## Function: `siteAdmin`

Part of the `subreddits` section. Used to update a wide variety of subreddit settings. This is a powerful endpoint available to subreddit moderators.

**Parameters:**

- `name` (string): The name of the subreddit to modify.
- `accept_followers` (boolean, optional): Allow users to follow this subreddit.
- `admin_override_spam_comments` (boolean, optional): Override admin spam filter for comments.
- `admin_override_spam_links` (boolean, optional): Override admin spam filter for links.
- `admin_override_spam_selfposts` (boolean, optional): Override admin spam filter for self-posts.
- `all_original_content` (boolean, optional): All content must be original content.
- `allow_chat_post_creation` (boolean, optional): Allow chat post creation.
- `allow_discovery` (boolean, optional): Allow this subreddit to be discovered.
- `allow_galleries` (boolean, optional): Allow gallery submissions.
- `allow_images` (boolean, optional): Allow image submissions.
- `allow_polls` (boolean, optional): Allow poll submissions.
- `allow_post_crossposts` (boolean, optional): Allow crossposting of content from this subreddit.
- `allow_prediction_contributors` (boolean, optional): Allow prediction contributors.
- `allow_predictions` (boolean, optional): Allow predictions.
- `allow_predictions_tournament` (boolean, optional): Allow prediction tournaments.
- `allow_talks` (boolean,optional): Allow talk posts.
- `allow_top` (boolean, optional): Allow this subreddit to be in r/all.
- `allow_videos` (boolean, optional): Allow video submissions.
- `collapse_deleted_comments` (boolean, optional): Collapse deleted comments.
- `comment_contribution_settings` (object, optional): Settings for comment contributions.
- `comment_score_hide_mins` (number, optional): Minutes to hide comment scores (0-1440).
- `crowd_control_chat_level` (number, optional): Crowd control level for chat (0-3).
- `crowd_control_filter` (boolean, optional): Enable crowd control filter.
- `crowd_control_level` (number, optional): Crowd control level (0-3).
- `crowd_control_mode` (boolean, optional): Enable crowd control mode.
- `crowd_control_post_level` (number, optional): Crowd control level for posts (0-3).
- `description` (string, optional): Subreddit description.
- `disable_contributor_requests` (boolean, optional): Disable contributor requests.
- `exclude_banned_modqueue` (boolean, optional): Exclude banned users from modqueue.
- `free_form_reports` (boolean, optional): Allow free-form reports.
- `g-recaptcha-response` (string, optional): Google reCAPTCHA response.
- `hateful_content_threshold_abuse` (number, optional): Hateful content threshold for abuse (0-3).
- `hateful_content_threshold_identity` (number, optional): Hateful content threshold for identity (0-3).
- `header-title` (string, optional): Header title.
- `hide_ads` (boolean, optional): Hide ads.
- `key_color` (string, optional): Key color as a hex string (e.g., "#RRGGBB").
- `link_type` (string, optional): Type of links allowed ('any', 'link', 'self').
- `modmail_harassment_filter_enabled` (boolean, optional): Enable modmail harassment filter.
- `new_pinned_post_pns_enabled` (boolean, optional): Enable push notifications for new pinned posts.
- `original_content_tag_enabled` (boolean, optional): Enable original content tag.
- `over_18` (boolean, optional): Mark subreddit as NSFW.
- `prediction_leaderboard_entry_type` (number, optional): Prediction leaderboard entry type (0-2).
- `public_description` (string, optional): Public description of the subreddit.
- `restrict_commenting` (boolean, optional): Restrict commenting.
- `restrict_posting` (boolean, optional): Restrict posting.
- `should_archive_posts` (boolean, optional): Archive posts.
- `show_media` (boolean, optional): Show media.
- `show_media_preview` (boolean, optional): Show media preview.
- `spam_comments` (string, optional): Spam filter strength for comments ('low', 'high', 'all').
- `spam_links` (string, optional): Spam filter strength for links ('low', 'high', 'all').
- `spam_selfposts` (string, optional): Spam filter strength for self-posts ('low', 'high', 'all').
- `spoilers_enabled` (boolean, optional): Enable spoiler tags.
- `sr` (string, optional): Fullname of the subreddit.
- `submit_link_label` (string, optional): Custom submit link label.
- `submit_text` (string, optional): Custom submit text.
- `submit_text_label` (string, optional): Custom submit text label.
- `subreddit_discovery_settings` (object, optional): Subreddit discovery settings.
- `suggested_comment_sort` (string, optional): Suggested comment sort.
- `title` (string, optional): Subreddit title.
- `toxicity_threshold_chat_level` (number, optional): Toxicity threshold for chat (0-1).
- `type` (string, optional): Subreddit type ('gold_restricted', 'archived', 'restricted', 'private', 'employees_only', 'gold_only', 'public', 'user').
- `user_flair_pns_enabled` (boolean, optional): Enable user flair push notifications.
- `welcome_message_enabled` (boolean, optional): Enable welcome message for new members.
- `welcome_message_text` (string, optional): The text of the welcome message.
- `wiki_edit_age` (number, optional): Minimum account age to edit wiki (0-36600).
- `wiki_edit_karma` (number, optional): Minimum karma to edit wiki (0-1000000000).
- `wikimode` (string, optional): Wiki mode ('disabled', 'modonly', 'anyone').

**Return Value:**

- `Promise<void>`: A promise that resolves when the settings are updated.

**Usage Examples:**

```typescript
// Update the title and description of a subreddit
await reddit.api.subreddits.siteAdmin({
  name: 'test',
  title: 'New Title',
  public_description: 'A new description for our test subreddit.',
});
console.log('Subreddit settings updated.');
```
