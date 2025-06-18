## Function: `getAnnouncements`

Part of the `announcements` section. Gets the current announcements.

**Parameters:**

- `params`: object (optional)
  - An object containing listing parameters.
  - `after`: string (optional) - Fullname of an announcement to fetch after.
  - `before`: string (optional) - Fullname of an announcement to fetch before.
  - `limit`: number (optional) - The maximum number of items to return (1-100).

**Return Value:**

- `Promise<AnnouncementListing>`: A promise that resolves to a listing of announcements.

**AnnouncementListing Type:**

```typescript
export interface AnnouncementListing {
  kind: "Listing";
  data: {
    after: string | null;
    before: string | null;
    dist: number | null;
    modhash: string;
    geo_filter: string | null;
    children: AnnouncementContainer[];
  };
}
```

**AnnouncementContainer Type:**

```typescript
export interface AnnouncementContainer {
  kind: "t10";
  data: Announcement;
}
```

**Announcement Type:**

```typescript
export interface Announcement {
  id: string; // The fullname of the announcement, prefixed with "ann_".
  title: string; // The title of the announcement.
  text: string; // The body text of the announcement.
  url: string; // The URL the announcement links to.
  created_utc: number; // The UTC timestamp of when the announcement was created.
  hidden: boolean; // Whether the announcement is hidden.
  read: boolean; // Whether the announcement has been read.
  [key: string]: any; // Other fields as returned by the API.
}
```

**Usage Example:**

```typescript
// Example: Get the latest announcements
const announcements = await redditSdk.api.announcements.getAnnouncements({ limit: 5 });
announcements.data.children.forEach(ann => {
  console.log(ann.data.title);
});
``` 