## Function: `search`

Performs a search across all of Reddit.

**Parameters:**

- `q`: string - The search query.
- `sort`: "relevance" | "hot" | "top" | "new" | "comments" (optional, default: "relevance") - The sorting method for the results.
- `t`: "hour" | "day" | "week" | "month" | "year" | "all" (optional) - The time frame for the search, used with sorts like "top".
- `after`: string (optional) - The fullname of an item to list after for pagination.
- `before`: string (optional) - The fullname of an item to list before for pagination.
- `count`: number (optional) - The number of items already seen in the listing.
- `limit`: number (optional, default: 25) - The maximum number of items to return.
- `show`: "all" | undefined (optional) - If "all", include results that would otherwise be hidden by user preferences.

**Return Type:**

- `Promise<ThingListing<Post>>`: A promise that resolves to a listing of posts matching the search query.

**ThingListing<Post> Object Details:**

- `kind`: string (always 'Listing') - The type of the object.
- `data`: object - The main data payload.
  - `after`: string | null - The fullname of the next item in the list, for pagination.
  - `before`: string | null - The fullname of the previous item in the list, for pagination.
  - `dist`: number - The number of items in the listing.
  - `modhash`: string - A token for moderation actions.
  - `geo_filter`: string | null - The geofilter used for the request.
  - `children`: `Post[]` - An array of Post objects.

**Post Object Details:**

- `approved_at_utc`: number | null
- `subreddit`: string
- `selftext`: string
- `author_fullname`: string
- `saved`: boolean
- `mod_reason_title`: string | null
- `gilded`: number
- `clicked`: boolean
- `title`: string
- `link_flair_richtext`: `RichText[]`
- `subreddit_name_prefixed`: string
- `hidden`: boolean
- `pwls`: number | null
- `link_flair_css_class`: string | null
- `downs`: number
- `thumbnail_height`: number | null
- `top_awarded_type`: string | null
- `hide_score`: boolean
- `name`: string
- `quarantine`: boolean
- `link_flair_template_id`: string | null
- `upvote_ratio`: number
- `author_flair_background_color`: string | null
- `subreddit_type`: "public" | "restricted" | "private" | "archived" | "gold_only"
- `ups`: number
- `total_awards_received`: number
- `media_embed`: `MediaEmbed`
- `thumbnail_width`: number | null
- `author_flair_template_id`: string | null
- `is_original_content`: boolean
- `user_reports`: `UserReport[]`
- `secure_media`: `Media` | null
- `is_reddit_media_domain`: boolean
- `is_meta`: boolean
- `category`: string | null
- `secure_media_embed`: `MediaEmbed`
- `link_flair_text`: string | null
- `can_mod_post`: boolean
- `score`: number
- `approved_by`: string | null
- `is_created_from_ads_ui`: boolean
- `author_premium`: boolean
- `thumbnail`: string
- `edited`: boolean | number
- `author_flair_css_class`: string | null
- `author_flair_richtext`: `RichText[]`
- `gildings`: `Gildings`
- `post_hint`: string
- `content_categories`: string[] | null
- `is_self`: boolean
- `mod_note`: string | null
- `created`: number
- `link_flair_type`: "text" | "richtext"
- `wls`: number | null
- `removed_by_category`: string | null
- `banned_by`: string | null
- `author_flair_type`: "text" | "richtext"
- `domain`: string
- `allow_live_comments`: boolean
- `selftext_html`: string | null
- `likes`: boolean | null
- `suggested_sort`: string | null
- `banned_at_utc`: number | null
- `url_overridden_by_dest`: string
- `view_count`: number | null
- `archived`: boolean
- `no_follow`: boolean
- `is_crosspostable`: boolean
- `pinned`: boolean
- `over_18`: boolean
- `preview`: `Preview`
- `all_awardings`: `Awarding[]`
- `awarders`: string[]
- `media_only`: boolean
- `can_gild`: boolean
- `spoiler`: boolean
- `locked`: boolean
- `author_flair_text`: string | null
- `treatment_tags`: string[]
- `visited`: boolean
- `removed_by`: string | null
- `num_reports`: number | null
- `distinguished`: "moderator" | "admin" | "special" | null
- `subreddit_id`: string
- `mod_reason_by`: string | null
- `removal_reason`: string | null
- `link_flair_background_color`: string
- `id`: string
- `is_robot_indexable`: boolean
- `report_reasons`: string[] | null
- `author`: string
- `discussion_type`: "CHAT" | "LIVE" | null
- `num_comments`: number
- `send_replies`: boolean
- `whitelist_status`: string | null
- `contest_mode`: boolean
- `mod_reports`: `ModReport[]`
- `author_patreon_flair`: boolean
- `author_flair_text_color`: string | null
- `permalink`: string
- `parent_whitelist_status`: string | null
- `stickied`: boolean
- `url`: string
- `subreddit_subscribers`: number
- `created_utc`: number
- `num_crossposts`: number
- `media`: `Media` | null
- `is_video`: boolean
- `comment_type`: string | null
- `replies`: `ThingListing<Comment>` | ""
- `collapsed_reason_code`: string | null
- `parent_id`: string
- `collapsed`: boolean
- `body`: string
- `is_submitter`: boolean
- `body_html`: string
- `collapsed_reason`: string | null
- `associated_award`: string | null
- `unrepliable_reason`: string | null
- `score_hidden`: boolean
- `link_id`: string
- `controversiality`: number
- `depth`: number
- `collapsed_because_crowd_control`: boolean | null

**RichText Object Details:**

- `e`: string
- `t`: string
- `a`: string | undefined
- `u`: string | undefined

**MediaEmbed Object Details:**

- `content`: string | undefined
- `width`: number | undefined
- `scrolling`: boolean | undefined
- `height`: number | undefined

**UserReport Object Details:**

- `[string, number, boolean, string]`

**Media Object Details:**

- `type`: string | undefined
- `oembed`: `OEmbed` | undefined

**OEmbed Object Details:**

- `provider_url`: string
- `description`: string
- `title`: string
- `author_name`: string
- `height`: number
- `width`: number
- `html`: string
- `thumbnail_width`: number
- `version`: string
- `provider_name`: string
- `thumbnail_url`: string
- `type`: "video" | "rich"
- `thumbnail_height`: number

**Gildings Object Details:**

- `gid_1`: number | undefined
- `gid_2`: number | undefined
- `gid_3`: number | undefined

**Preview Object Details:**

- `images`: `Image[]`
- `enabled`: boolean

**Image Object Details:**

- `source`: `ImageSource`
- `resolutions`: `ImageSource[]`
- `variants`: object
- `id`: string

**ImageSource Object Details:**

- `url`: string
- `width`: number
- `height`: number

**Awarding Object Details:**

- `giver_coin_reward`: number | null
- `subreddit_id`: string | null
- `is_new`: boolean
- `days_of_drip_extension`: number | null
- `coin_price`: number
- `id`: string
- `penny_donate`: number | null
- `award_sub_type`: "GLOBAL" | "PREMIUM" | "GROUP" | "COMMUNITY" | "APPRECIATION" | "MODERATOR"
- `coin_reward`: number
- `icon_url`: string
- `days_of_premium`: number | null
- `tiers_by_required_awardings`: object | null
- `resized_icons`: `ImageSource[]`
- `icon_width`: number
- `static_icon_width`: number
- `start_date`: number | null
- `is_enabled`: boolean
- `awardings_required_to_grant_benefits`: number | null
- `description`: string
- `end_date`: number | null
- `sticky_duration_seconds`: number | null
- `subreddit_coin_reward`: number
- `count`: number
- `static_icon_height`: number
- `name`: string
- `resized_static_icons`: `ImageSource[]`
- `icon_format`: "APNG" | "PNG" | "JPG" | "GIF" | null
- `icon_height`: number
- `penny_price`: number | null
- `award_type`: "global" | "community" | "moderator"
- `static_icon_url`: string

**ModReport Object Details:**

- `[string, string]`

**Usage Example:**

```typescript
// Search all of Reddit for "gemini" and sort by new
const searchResults = await reddit.listings.search({
  q: 'gemini',
  sort: 'new',
});

console.log(`Found ${searchResults.data.children.length} results.`);
```

**Code Example:**

```typescript
async function searchAllReddit(query, sortBy) {
  try {
    const results = await reddit.listings.search({ q: query, sort: sortBy });
    console.log(`--- Search Results for "${query}" (sorted by ${sortBy}) ---`);
    results.data.children.forEach(post => {
      console.log(`- [${post.data.score}] ${post.data.title} (r/${post.data.subreddit})`);
    });
  } catch (error) {
    console.error("Failed to perform search:", error);
  }
}

searchAllReddit('reactjs', 'top');
```  
