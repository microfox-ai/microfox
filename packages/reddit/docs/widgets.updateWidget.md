## Function: `updateWidget`

Updates an existing widget in a specific subreddit.

**Parameters:**

- `subreddit` (string): The subreddit where the widget exists.
- `widget_id` (string): The ID of the widget to update.
- `widget` (object): The updated widget object. The structure of this object depends on the `kind` of widget being updated.

**Widget Types:**

The `widget` parameter must be one of the following types. Please refer to the `widgets.createWidget.md` documentation for detailed type definitions of `TextareaWidget` and `ButtonWidget`.

**Return Value:**

- `Promise<Widget>`: A promise that resolves to the updated widget object.

**Usage Examples:**

```typescript
// Update an existing textarea widget
const updatedTextareaWidget = await reddit.api.widgets.updateWidget({
  subreddit: 'learnprogramming',
  widget_id: 'some_widget_id',
  widget: {
    kind: 'textarea',
    shortName: 'Welcome! [Updated]',
    text: 'Welcome to our community! Please read the rules and be excellent to each other.',
    styles: {
      backgroundColor: '#ffffff',
      headerColor: '#0079d3',
    },
  },
});
console.log(updatedTextareaWidget);
```

```typescript
// Update an existing button widget
const updatedButtonWidget = await reddit.api.widgets.updateWidget({
  subreddit: 'learnprogramming',
  widget_id: 'another_widget_id',
  widget: {
    kind: 'button',
    shortName: 'Useful Links [Updated]',
    buttons: [
      {
        kind: 'button',
        text: 'Our Expanded Wiki',
        url: 'https://www.reddit.com/r/learnprogramming/wiki/index',
      },
    ],
    styles: {
      backgroundColor: '#f5f5f5',
      headerColor: '#545454',
    },
  },
});
console.log(updatedButtonWidget);
```
