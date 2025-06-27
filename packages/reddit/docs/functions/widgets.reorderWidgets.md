## Function: `reorderWidgets`

Reorders the widgets in a specific section of a subreddit.

**Parameters:**

- `subreddit` (string): The subreddit where the widgets exist.
- `section` (string): The section of the page where the widgets are located (e.g., 'sidebar').
- `order` (string[]): An array of widget IDs in the desired order.

**Return Value:**

- `Promise<void>`: A promise that resolves when the widgets have been reordered.

**Usage Examples:**

```typescript
// Reorder widgets in the sidebar
await reddit.api.widgets.reorderWidgets({
  subreddit: 'learnprogramming',
  section: 'sidebar',
  order: ['widget_id_3', 'widget_id_1', 'widget_id_2'],
});
console.log('Widgets have been reordered.');
```
