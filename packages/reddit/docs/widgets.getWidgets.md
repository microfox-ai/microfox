## Function: `getWidgets`

Retrieves a list of widgets for a specific subreddit.

**Parameters:**

- `subreddit` (string): The subreddit to retrieve widgets from.

**Return Value:**

- `Promise<WidgetList>`: A promise that resolves to a list of widgets.

**WidgetList Type:**

```typescript
export interface WidgetList {
  items: Widget[];
  kind: 'Listing';
}
```

The `Widget` objects in the `items` array can be of different kinds. Please refer to the `widgets.createWidget.md` documentation for detailed type definitions of `TextareaWidget` and `ButtonWidget`.

**Usage Examples:**

```typescript
// Get all widgets for a subreddit
const widgets = await reddit.api.widgets.getWidgets({
  subreddit: 'learnprogramming',
});
console.log(widgets.items);
```
