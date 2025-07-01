## Function: `getSubredditAboutTraffic`

Retrieves traffic statistics for a specific subreddit.

**Parameters:**

- `subreddit` (string): The name of the subreddit (e.g., 'learnprogramming').

**Return Value:**

- `Promise<SubredditTraffic>`: A promise that resolves to an object containing the subreddit's traffic data.

**SubredditTraffic Type:**

```typescript
export interface SubredditTraffic {
  day: [number, number, number][]; // Array of [timestamp, uniques, pageviews] for each day.
  week: [number, number, number][]; // Array of [timestamp, uniques, pageviews] for each week.
  month: [number, number, number][]; // Array of [timestamp, uniques, pageviews] for each month.
}
```

**Usage Example:**

```typescript
// Get traffic data for the 'learnprogramming' subreddit
const traffic = await reddit.api.subreddits.getSubredditAboutTraffic({
  subreddit: 'learnprogramming',
});
console.log(traffic.day); // Daily traffic data
console.log(traffic.week); // Weekly traffic data
console.log(traffic.month); // Monthly traffic data
```
