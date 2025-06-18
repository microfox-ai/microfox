## Function: `createWidget`

Creates a new widget in a specific subreddit.

**Parameters:**

- `subreddit` (string): The subreddit where the widget will be created.
- `widget` (object): The widget object to create. The structure of this object depends on the `kind` of widget being created.

**Widget Types:**

The `widget` parameter must be one of the following types:

### Textarea Widget

A simple widget that displays text.

```typescript
export interface TextareaWidget {
  kind: 'textarea';
  shortName: string; // A short name for the widget
  text: string; // The text content of the widget
  styles: {
    backgroundColor: string; // e.g., '#f0f0f0'
    headerColor: string; // e.g., '#333333'
  };
}
```

### Button Widget

A widget that displays one or more buttons.

```typescript
export interface ButtonWidget {
  kind: 'button';
  shortName: string; // A short name for the widget
  description?: string; // An optional description
  buttons: Button[];
  styles: {
    backgroundColor: string; // e.g., '#f0f0f0'
    headerColor: string; // e.g., '#333333'
  };
}

export interface Button {
  kind: 'button';
  text: string; // The text displayed on the button
  url: string; // The URL the button links to
  color?: string; // e.g., '#0079d3'
  textColor?: string; // e.g., '#ffffff'
  fillColor?: string; // e.g., '#0079d3'
  hoverState?: {
    text: string;
    color: string;
    textColor: string;
    fillColor: string;
  };
}
```

**Return Value:**

- `Promise<Widget>`: A promise that resolves to the created widget object.

**Usage Examples:**

```typescript
// Create a new textarea widget
const textareaWidget = await reddit.api.widgets.createWidget({
  subreddit: 'learnprogramming',
  widget: {
    kind: 'textarea',
    shortName: 'Welcome!',
    text: 'Welcome to our community! Please read the rules.',
    styles: {
      backgroundColor: '#ffffff',
      headerColor: '#0079d3',
    },
  },
});
console.log(textareaWidget);
```

```typescript
// Create a new button widget
const buttonWidget = await reddit.api.widgets.createWidget({
  subreddit: 'learnprogramming',
  widget: {
    kind: 'button',
    shortName: 'Useful Links',
    description: 'Here are some helpful links to get you started.',
    buttons: [
      {
        kind: 'button',
        text: 'Our Wiki',
        url: 'https://www.reddit.com/r/learnprogramming/wiki',
      },
      {
        kind: 'button',
        text: 'Reddit Help',
        url: 'https://www.reddithelp.com',
      },
    ],
    styles: {
      backgroundColor: '#ffffff',
      headerColor: '#0079d3',
    },
  },
});
console.log(buttonWidget);
```
