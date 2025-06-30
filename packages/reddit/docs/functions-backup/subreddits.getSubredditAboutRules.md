## Function: `getSubredditAboutRules`

Retrieves the rules for a specific subreddit.

**Parameters:**

- `subreddit` (string): The name of the subreddit (e.g., 'learnprogramming').

**Return Value:**

- `Promise<SubredditRules>`: A promise that resolves to an object containing the subreddit's rules.

**SubredditRules Type:**

```typescript
export interface SubredditRules {
  rules: SubredditRule[];
  site_rules: SiteRule[];
}

export interface SubredditRule {
  kind: string; // The type of the rule (e.g., 'link', 'comment', 'all').
  short_name: string; // The short name or title of the rule.
  description: string; // The full description of the rule.
  created_utc: number; // The UTC timestamp of when the rule was created.
  priority: number; // The priority of the rule in the list.
  violation_reason: string; // The reason for a violation.
}

export interface SiteRule {
  // ... similar to SubredditRule but for sitewide rules
}
```

**Usage Example:**

```typescript
// Get the rules for the 'learnprogramming' subreddit
const rules = await reddit.api.subreddits.getSubredditAboutRules({
  subreddit: 'learnprogramming',
});
console.log(rules);
```
