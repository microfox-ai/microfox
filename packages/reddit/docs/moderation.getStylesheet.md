---
title: moderation.getStylesheet
---

# `moderation.getStylesheet`

This endpoint is used to get the stylesheet for a subreddit.

## GET `/r/{subreddit}/stylesheet`

### Path Parameters

| Name        | Type   | Description                |
| ----------- | ------ | -------------------------- |
| `subreddit` | string | The name of the subreddit. |

### Response

The endpoint returns a `Promise<Stylesheet>`.

```typescript
interface Stylesheet {
  stylesheet: string;
  images: {
    link: string;
    name: string;
    url: string;
  }[];
}
```

### Example

```typescript
const stylesheet = await reddit.moderation.getStylesheet({
  subreddit: 'test',
});
```
