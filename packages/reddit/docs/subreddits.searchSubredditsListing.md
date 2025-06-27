## Function: `searchSubredditsListing`

Searches for subreddits.

**Parameters:**

- `q` (string): The search query.
- `search_query_id` (string, optional): A UUID for the search query.
- `show_users` (boolean, optional): Whether to show users in the results.
- `sort` (string, optional): The sort order for the results. Can be 'relevance' or 'activity'.
- `typeahead_active` (boolean, optional): Whether typeahead is active.
- `limit` (number, optional): The maximum number of items to return in this slice of the listing.
- `after` (string, optional): Return items after this fullname.
- `before` (string, optional): Return items before this fullname.
- `count` (number, optional): The number of items already seen in this listing.
- `show` (string, optional): Can be 'all'.
- `sr_detail` (boolean, optional): Optional parameter to expand subreddit details.

**Return Value:**

A promise that resolves to a listing of subreddits. The response is a `Listing` object with the following structure:

```typescript
{
  "kind": "Listing",
  "data": {
    "after": string | null,
    "dist": number,
    "modhash": string | null,
    "geo_filter": string,
    "children": {
      "kind": "t5",
      "data": Subreddit
    }[],
    "before": string | null
  }
}
```

**Subreddit Type:**

The `Subreddit` object contains various details about a subreddit. Here are some of the key properties:

```typescript
interface Subreddit {
  accept_followers?: boolean; // Whether the subreddit accepts followers.
  accounts_active_is_fuzzed?: boolean; // Whether the active accounts count is fuzzed.
  accounts_active?: number; // The number of active accounts.
  active_user_count?: number; // The number of active users.
  advertiser_category?: string; // The advertiser category of the subreddit.
  all_original_content?: boolean; // Whether all content must be original.
  allow_chat_post_creation?: boolean; // Whether chat post creation is allowed.
  allow_discovery?: boolean; // Whether the subreddit is discoverable.
  allow_galleries?: boolean; // Whether galleries are allowed.
  allow_images?: boolean; // Whether images are allowed.
  allow_polls?: boolean; // Whether polls are allowed.
  allow_prediction_contributors?: boolean; // Whether prediction contributors are allowed.
  allow_predictions_tournament?: boolean; // Whether prediction tournaments are allowed.
  allow_predictions?: boolean; // Whether predictions are allowed.
  allow_talks?: boolean; // Whether talks are allowed.
  allow_videogifs?: boolean; // Whether video GIFs are allowed.
  allow_videos?: boolean; // Whether videos are allowed.
  allowed_media_in_comments: string[]; // A list of allowed media types in comments.
  banner_background_color?: string; // The background color of the banner.
  banner_background_image?: string; // The background image of the banner.
  banner_img?: string; // The image of the banner.
  banner_size: number[]; // The size of the banner.
  can_assign_link_flair?: boolean; // Whether users can assign link flair.
  can_assign_user_flair?: boolean; // Whether users can assign user flair.
  coins?: number; // The number of coins in the subreddit.
  collapse_deleted_comments?: boolean; // Whether deleted comments should be collapsed.
  comment_contribution_settings?: object; // Settings for comment contributions.
  comment_score_hide_mins?: number; // The number of minutes to hide comment scores.
  community_icon?: string; // The URL of the community icon.
  community_reviewed?: boolean; // Whether the community has been reviewed.
  content_category?: string; // The content category of the subreddit.
  created_utc?: number; // The UTC timestamp of when the subreddit was created.
  created?: number; // The timestamp of when the subreddit was created.
  default_set?: boolean; // Whether the subreddit is in the default set.
  description?: string; // The description of the subreddit.
  description_html?: string; // The HTML representation of the description.
  disable_contributor_requests?: boolean; // Whether contributor requests are disabled.
  display_name?: string; // The display name of the subreddit.
  display_name_prefixed?: string; // The prefixed display name (e.g., "r/pics").
  emojis_custom_size: number[]; // The custom size of emojis.
  emojis_enabled?: boolean; // Whether emojis are enabled.
  free_form_reports?: boolean; // Whether free-form reports are enabled.
  has_menu_widget?: boolean; // Whether the subreddit has a menu widget.
  header_img?: string; // The URL of the header image.
  header_size: number[]; // The size of the header image.
  header_title?: string; // The title of the header.
  hide_ads?: boolean; // Whether ads are hidden.
  icon_color?: string; // The color of the icon.
  icon_img?: string; // The URL of the icon.
  icon_size: number[]; // The size of the icon.
  id?: string; // The ID of the subreddit.
  is_chat_post_feature_enabled?: boolean; // Whether the chat post feature is enabled.
  is_crosspostable_subreddit?: boolean; // Whether the subreddit is crosspostable.
  is_default_banner?: boolean; // Whether the banner is the default.
  is_default_icon?: boolean; // Whether the icon is the default.
  is_enrolled_in_new_modmail?: boolean; // Whether the subreddit is enrolled in new modmail.
  key_color?: string; // The key color of the subreddit.
  lang?: string; // The language of the subreddit.
  link_flair_enabled?: boolean; // Whether link flair is enabled.
  link_flair_position?: string; // The position of the link flair.
  mobile_banner_image?: string; // The URL of the mobile banner image.
  name?: string; // The name of the subreddit.
  notification_level?: string; // The notification level for the current user.
  original_content_tag_enabled?: string; // Whether the original content tag is enabled.
  over18?: boolean; // Whether the subreddit is marked as NSFW.
  prediction_leaderboard_entry_type?: string; // The entry type for the prediction leaderboard.
  previous_names: string[]; // A list of previous names of the subreddit.
  primary_color?: string; // The primary color of the subreddit.
  public_description?: string; // The public description of the subreddit.
  public_description_html?: string; // The HTML representation of the public description.
  public_traffic?: boolean; // Whether traffic stats are public.
  quarantine?: boolean; // Whether the subreddit is quarantined.
  restrict_commenting?: boolean; // Whether commenting is restricted.
  restrict_posting?: boolean; // Whether posting is restricted.
  should_archive_posts?: boolean; // Whether posts should be archived.
  should_show_media_in_comments_setting?: boolean; // Whether to show media in comments.
  show_media_preview?: boolean; // Whether to show media previews.
  show_media?: boolean; // Whether to show media.
  spoilers_enabled?: boolean; // Whether spoilers are enabled.
  submission_type?: string; // The submission type (e.g., "any", "link", "self").
  submit_link_label?: string; // The label for the submit link button.
  submit_text_html?: string; // The HTML representation of the submit text.
  submit_text_label?: string; // The label for the submit text button.
  submit_text?: string; // The text for the submission page.
  subreddit_type?: string; // The type of the subreddit (e.g., "public", "private").
  subscribers?: number; // The number of subscribers.
  suggested_comment_sort?: string; // The suggested sort for comments.
  title?: string; // The title of the subreddit.
  url?: string; // The relative URL of the subreddit.
  user_can_flair_in_sr?: boolean; // Whether the user can flair in the subreddit.
  user_flair_background_color?: string; // The background color of the user flair.
  user_flair_css_class?: string; // The CSS class of the user flair.
  user_flair_enabled_in_sr?: boolean; // Whether user flair is enabled in the subreddit.
  user_flair_position?: string; // The position of the user flair.
  user_flair_richtext: object[]; // The rich text of the user flair.
  user_flair_template_id?: string; // The template ID of the user flair.
  user_flair_text_color?: string; // The text color of the user flair.
  user_flair_text?: string; // The text of the user flair.
  user_flair_type?: string; // The type of the user flair.
  user_has_favorited?: boolean; // Whether the user has favorited the subreddit.
  user_is_banned?: boolean; // Whether the user is banned from the subreddit.
  user_is_contributor?: boolean; // Whether the user is a contributor to the subreddit.
  user_is_moderator?: boolean; // Whether the user is a moderator of the subreddit.
  user_is_muted?: boolean; // Whether the user is muted in the subreddit.
  user_is_subscriber?: boolean; // Whether the user is subscribed to the subreddit.
  user_sr_flair_enabled?: boolean; // Whether user flair is enabled for the current user.
  user_sr_theme_enabled?: boolean; // Whether the subreddit theme is enabled for the current user.
  videostream_links_count?: number; // The number of video stream links.
  whitelist_status?: string; // The whitelist status.
  wiki_enabled?: boolean; // Whether the wiki is enabled.
  wls?: number; // Whitelist status (numerical).
}
```

**Usage Examples:**

```typescript
// Search for subreddits related to "gaming"
const gamingSubreddits = await reddit.api.subreddits.searchSubredditsListing({
  q: 'gaming',
  sort: 'relevance',
});
console.log(gamingSubreddits);
```
