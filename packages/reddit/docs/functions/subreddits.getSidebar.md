## Function: `getSidebar`

Retrieves the content of a subreddit's sidebar.

**Parameters:**

- `subreddit` (string): The name of the subreddit (e.g., 'learnprogramming').

**Return Value:**

- `Promise<string>`: A promise that resolves to a string containing the sidebar's content. The format of this string can vary (e.g., HTML, Markdown).

**Usage Example:**

```typescript
const sidebarContent = await reddit.api.subreddits.getSidebar({
  subreddit: 'learnprogramming',
});
console.log(sidebarContent);
```
