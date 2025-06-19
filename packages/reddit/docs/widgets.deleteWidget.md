## Function: `deleteWidget`

Deletes a widget from a specific subreddit.

**Parameters:**

- `subreddit` (string): The subreddit where the widget exists.
- `widget_id` (string): The ID of the widget to delete.

**Return Value:**

- `Promise<void>`: A promise that resolves when the widget has been deleted.

**Usage Examples:**

```typescript
// Delete a widget
await reddit.api.widgets.deleteWidget({
  subreddit: 'learnprogramming',
  widget_id: 'some_widget_id',
});
console.log('Widget has been deleted.');
```
