## Function: `getSubredditsWhere`

Gets a listing of subreddits by category.

**Parameters:**

- `where`: "popular" | "new" | "gold" | "default" - The category of subreddits to retrieve.
- `after`: string (optional) - The fullname of an item to list after for pagination.
- `before`: string (optional) - The fullname of an item to list before for pagination.
- `count`: number (optional) - The number of items already seen in the listing.
- `limit`: number (optional, default: 25) - The maximum number of items to return.
- `show`: "all" | undefined (optional) - If "all", posts that have been voted on will be included.

**Return Type:**

- `Promise<ThingListing<Subreddit>>`: A promise that resolves to a listing of `Subreddit` objects.

**ThingListing<Subreddit> Object Details:**

- `kind`: string (always 'Listing') - The type of the object.
- `data`: object - The main data payload.
  - `after`: string | null - The fullname of the next item in the list, for pagination.
  - `before`: string | null - The fullname of the previous item in the list, for pagination.
  - `dist`: number - The number of items in the listing.
  - `modhash`: string - A token for moderation actions.
  - `geo_filter`: string | null - The geofilter used for the request.
  - `children`: `Subreddit[]` - An array of Subreddit objects.

**Subreddit Object Details:**

- `user_flair_background_color`: null | string
- `submit_text_html`: null | string
- `restrict_posting`: boolean
- `user_is_banned`: boolean
- `free_form_reports`: boolean
- `wiki_enabled`: boolean
- `user_is_muted`: boolean
- `user_can_flair_in_sr`: boolean
- `display_name`: string
- `header_img`: null | string
- `title`: string
- `allow_galleries`: boolean
- `icon_size`: [number, number] | null
- `primary_color`: string
- `active_user_count`: number
- `icon_img`: null | string
- `display_name_prefixed`: string
- `accounts_active`: number
- `public_traffic`: boolean
- `subscribers`: number
- `user_flair_richtext`: `RichText[]` | []
- `name`: string
- `quarantine`: boolean
- `hide_ads`: boolean
- `prediction_leaderboard_entry_type`: string
- `emojis_enabled`: boolean
- `advertiser_category`: string
- `public_description`: string
- `comment_score_hide_mins`: number
- `allow_predictions`: boolean
- `user_has_favorited`: boolean
- `user_flair_template_id`: null | string
- `community_icon`: string
- `banner_background_image`: string
- `original_content_tag_enabled`: boolean
- `submit_text`: string
- `description_html`: string
- `spoilers_enabled`: boolean
- `header_title`: null | string
- `header_size`: [number, number] | null
- `user_flair_position`: "left" | "right" | ""
- `all_original_content`: boolean
- `has_menu_widget`: boolean
- `is_enrolled_in_new_modmail`: null | boolean
- `key_color`: string
- `can_assign_user_flair`: boolean
- `created`: number
- `wls`: number | null
- `show_media_preview`: boolean
- `submission_type`: "any" | "link" | "self"
- `user_is_subscriber`: boolean
- `disable_contributor_requests`: boolean
- `allow_videogifs`: boolean
- `user_flair_type`: "text" | "richtext"
- `allow_predictions_tournament`: boolean
- `collapse_deleted_comments`: boolean
- `emojis_custom_size`: [number, number] | null
- `public_description_html`: null | string
- `allow_videos`: boolean
- `is_crosspostable_subreddit`: boolean
- `notification_level`: null | "low" | "frequent" | "off"
- `can_assign_link_flair`: boolean
- `accounts_active_is_fuzzed`: boolean
- `submit_text_label`: null | string
- `link_flair_position`: "left" | "right" | ""
- `user_sr_flair_enabled`: boolean
- `user_flair_enabled_in_sr`: boolean
- `allow_discovery`: boolean
- `user_sr_theme_enabled`: boolean
- `link_flair_enabled`: boolean
- `subreddit_type`: "public" | "restricted" | "private" | "archived" | "gold_only"
- `suggested_comment_sort`: null | "confidence" | "top" | "new" | "controversial" | "old" | "random" | "qa" | "live"
- `banner_img`: null | string
- `user_flair_text`: null | string
- `banner_background_color`: string
- `show_media`: boolean
- `id`: string
- `user_is_moderator`: boolean
- `over18`: boolean
- `description`: string
- `submit_link_label`: null | string
- `user_flair_text_color`: null | "dark" | "light"
- `restrict_commenting`: boolean
- `user_flair_css_class`: null | string
- `allow_images`: boolean
- `lang`: string
- `whitelist_status`: string | null
- `url`: string
- `created_utc`: number
- `banner_size`: [number, number] | null
- `mobile_banner_image`: null | string
- `user_is_contributor`: boolean

**RichText Object Details:**

- `e`: string
- `t`: string
- `a`: string | undefined
- `u`: string | undefined

**Usage Example:**

```typescript
const popularSubs = await reddit.subreddits.getSubredditsWhere({
  where: 'popular',
  limit: 15,
});
console.log(popularSubs.data.children.map(sub => sub.data.display_name));
```  
