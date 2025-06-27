## Function: `listCalendarList`

Retrieves the authenticated user's calendar list. This includes all calendars that the user has added to their list, such as their primary calendar, calendars they own, and calendars they are subscribed to.

**Purpose:**
To fetch a list of calendars associated with the authenticated user's account, allowing applications to display or interact with these calendars.

**Parameters:**
- `params` (optional object): An object containing optional query parameters to filter and paginate the results.
  - `maxResults` (optional string): The maximum number of entries returned on one page. Optional. The default is 100.
  - `minAccessRole` (optional string): The minimum access role for the user in the returned entries. Optional. The default is no restriction.
    Valid values are:
    - `"freeBusyReader"`: The user can read free/busy information.
    - `"owner"`: The user has owner rights to the calendar. 
    - `"reader"`: The user can read the calendar entries.
    - `"writer"`: The user can write to the calendar entries.
  - `pageToken` (optional string): Token specifying the next page of results to return. Optional.
  - `showDeleted` (optional string): Whether to include deleted calendar list entries in the result. Optional. The default is False.
  - `showHidden` (optional string): Whether to show hidden entries. Optional. The default is False.
  - `syncToken` (optional string): Token obtained from the nextSyncToken field returned on the last page of a previous list operation. It makes the result of this list operation contain only entries that have changed since then. Optional. The default is to return all entries.

**Return Value:**
- A `Promise` that resolves to a `CalendarList` object.
- `CalendarList` (object): An object representing the list of calendars.
  - `kind` (string): Identifies this as a calendar list. Value: `"calendar#calendarList"`.
  - `etag` (string): ETag of the collection.
  - `nextPageToken` (string, optional): Token used to access the next page of this result. Omitted if no further results are available.
  - `nextSyncToken` (string, optional): Token used at a later point in time to retrieve only the entries that have changed since this result was returned. Omitted if further results are available, in which case `nextPageToken` is provided.
  - `items` (array<object>): List of `CalendarListEntry` objects.
    - Each `CalendarListEntry` object represents a calendar in the user's calendar list. Refer to the `CalendarListEntry` type definition for its detailed structure.

**Examples:**
```typescript
// Example 1: Minimal usage - list all calendars with default settings
const calendarList = await sdk.listCalendarList();
console.log(calendarList.items);

// Example 2: List calendars with specific parameters
const params = {
  maxResults: "10",
  minAccessRole: "reader",
  showHidden: "true"
};
const filteredCalendarList = await sdk.listCalendarList(params);
console.log(filteredCalendarList.items);

// Example 3: Paginate through calendar list
async function getAllCalendars() {
  let pageToken: string | undefined = undefined;
  let allItems: CalendarListEntry[] = [];
  do {
    const result: CalendarList = await sdk.listCalendarList({ pageToken });
    allItems = allItems.concat(result.items);
    pageToken = result.nextPageToken;
  } while (pageToken);
  return allItems;
}

getAllCalendars().then(calendars => console.log('All calendars:', calendars));
```