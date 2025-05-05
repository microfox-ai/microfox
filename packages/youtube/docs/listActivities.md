## Function: `listActivities`

Lists activities (uploads, likes, comments, etc.) for a given channel or user.

**Purpose:**
Retrieves a list of activities.

**Parameters:**

* `params`: `ListActivitiesParams` (required). An object containing the following properties:
    * `part`: `array<string>` (required). Specifies the parts of the activity resource to include in the response. Valid values include `snippet`, `contentDetails`, etc.
    * `channelId`: `string` (optional). The ID of the channel for which to retrieve activities.
    * `mine`: `boolean` (optional). Set to `true` to retrieve activities for the authenticated user.
    * `maxResults`: `number` (optional). The maximum number of results to return (0-50, default is 5).
    * `pageToken`: `string` (optional). A token to retrieve a specific page of results.
    * `publishedAfter`: `string` (optional). The earliest publishing date/time for activities to include.
    * `publishedBefore`: `string` (optional). The latest publishing date/time for activities to include.
    * `regionCode`: `string` (optional). The region code to filter results by.

**Return Value:**

* `Promise<ActivityListResponse>`: A promise that resolves with a list of activities.
    * `kind`: `string`.
    * `etag`: `string`.
    * `nextPageToken`: `string` (optional).
    * `prevPageToken`: `string` (optional).
    * `pageInfo`: `object`. Contains `totalResults` and `resultsPerPage`.
    * `items`: `array<Activity>`. An array of activity objects. Each `Activity` object has the following structure:
        * `kind`: `string`.
        * `etag`: `string`.
        * `id`: `string`.
        * `snippet`: `object`. Contains details about the activity.
        * `contentDetails`: `object`. Contains details about the activity content.

**Examples:**

```typescript
const activities = await youtube.listActivities({ part: ["snippet", "contentDetails"], channelId: "UC_x5XG1OV2P6uZZ5FSM9Ttw" });
console.log(activities);

const myActivities = await youtube.listActivities({ part: ["snippet"], mine: true });
console.log(myActivities);
```