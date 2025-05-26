```markdown
# Google Calendar API v3 TypeScript SDK Summary

This document summarizes the Google Calendar API v3 for generating a TypeScript SDK.  It includes endpoint definitions, request/response structures, authentication details, and other relevant information.

## Authentication

The Google Calendar API uses OAuth 2.0 for authentication.  Your application needs to obtain credentials (client ID and secret) and request authorization from the user.  The specific scopes required depend on the endpoint being accessed.  See the [authentication and authorization page](https://developers.google.com/workspace/calendar/guides/auth) for more information.

The common scopes used are:

* `https://www.googleapis.com/auth/calendar`: Full access to the user's calendars and events.
* `https://www.googleapis.com/auth/calendar.readonly`: Read-only access to the user's calendars and events.
* `https://www.googleapis.com/auth/calendar.calendarlist`:  Manage the user's calendar list.
* `https://www.googleapis.com/auth/calendar.calendarlist.readonly`: Read-only access to the user's calendar list.
* `https://www.googleapis.com/auth/calendar.acls`: Manage the user's access control lists.
* `https://www.googleapis.com/auth/calendar.acls.readonly`: Read-only access to the user's access control lists.
* `https://www.googleapis.com/auth/calendar.events`: Create, read, update, and delete events.
* `https://www.googleapis.com/auth/calendar.events.readonly`: Read-only access to events.
* `https://www.googleapis.com/auth/calendar.events.owned`: Create, read, update, and delete only events that the user owns.
* `https://www.googleapis.com/auth/calendar.events.owned.readonly`: Read-only access to events that the user owns.
* `https://www.googleapis.com/auth/calendar.events.public.readonly`: Read-only access to public events.
* `https://www.googleapis.com/auth/calendar.freebusy`:  Query the user's free/busy information.
* `https://www.googleapis.com/auth/calendar.settings.readonly`: Read-only access to the user's calendar settings.


## Base URL

All endpoints are relative to `https://www.googleapis.com/calendar/v3`.


## Data Types

Several common data types are used across the API.  These should be defined in the TypeScript SDK. Examples include `datetime` (RFC3339 timestamp), `date` (yyyy-mm-dd), `etag`, and `integer`.  Specific structures are detailed with each endpoint.


## Endpoints


### Acl

* **Description:** Manages Access Control Lists (ACLs) for calendars.

* **`delete`** `/calendars/{calendarId}/acl/{ruleId}`
    * **Method:** DELETE
    * **Description:** Deletes an access control rule.
    * **Path Parameters:** `calendarId` (string), `ruleId` (string)
    * **Scopes:** `calendar`, `calendar.acls`
    * **Request Body:** None
    * **Response:** Empty

* **`get`** `/calendars/{calendarId}/acl/{ruleId}`
    * **Method:** GET
    * **Description:** Returns an access control rule.
    * **Path Parameters:** `calendarId` (string), `ruleId` (string)
    * **Scopes:** `calendar.readonly`, `calendar`, `calendar.acls`, `calendar.acls.readonly`
    * **Request Body:** None
    * **Response:** [`AclRule`](#aclrule)

* **`insert`** `/calendars/{calendarId}/acl`
    * **Method:** POST
    * **Description:** Creates an access control rule.
    * **Path Parameters:** `calendarId` (string)
    * **Query Parameters:** `sendNotifications` (boolean, optional)
    * **Scopes:** `calendar`, `calendar.acls`
    * **Request Body:** [`AclRule`](#aclrule) (required `role` and `scope`)
    * **Response:** [`AclRule`](#aclrule)

* **`list`** `/calendars/{calendarId}/acl`
    * **Method:** GET
    * **Description:** Returns the rules in the access control list for the calendar.
    * **Path Parameters:** `calendarId` (string)
    * **Query Parameters:** `maxResults` (integer, optional), `pageToken` (string, optional), `showDeleted` (boolean, optional), `syncToken` (string, optional)
    * **Scopes:** `calendar`, `calendar.acls`, `calendar.acls.readonly`
    * **Request Body:** None
    * **Response:** [`Acl`](#acl)

* **`patch`** `/calendars/{calendarId}/acl/{ruleId}`
    * **Method:** PATCH
    * **Description:** Updates an access control rule.  Supports patch semantics.
    * **Path Parameters:** `calendarId` (string), `ruleId` (string)
    * **Query Parameters:** `sendNotifications` (boolean, optional)
    * **Scopes:** `calendar`, `calendar.acls`
    * **Request Body:** Partial [`AclRule`](#aclrule)
    * **Response:** [`AclRule`](#aclrule)

* **`update`** `/calendars/{calendarId}/acl/{ruleId}`
    * **Method:** PUT
    * **Description:** Updates an access control rule.
    * **Path Parameters:** `calendarId` (string), `ruleId` (string)
    * **Query Parameters:** `sendNotifications` (boolean, optional)
    * **Scopes:** `calendar`, `calendar.acls`
    * **Request Body:** [`AclRule`](#aclrule) (required `scope`)
    * **Response:** [`AclRule`](#aclrule)

* **`watch`** `/calendars/{calendarId}/acl/watch`
    * **Method:** POST
    * **Description:** Watch for changes to ACL resources.
    * **Path Parameters:** `calendarId` (string)
    * **Scopes:** `calendar`, `calendar.acls`, `calendar.acls.readonly`
    * **Request Body:** [`Channel`](#channel)
    * **Response:** [`Channel`](#channel)


### CalendarList

* **Description:** Manages the user's calendar list.

* **`delete`** `/users/me/calendarList/{calendarId}`
    * **Method:** DELETE
    * **Description:** Removes a calendar from the user's calendar list.
    * **Path Parameters:** `calendarId` (string)
    * **Scopes:** `calendar`, `calendar.app.created`, `calendar.calendarlist`
    * **Request Body:** None
    * **Response:** Empty

* **`get`** `/users/me/calendarList/{calendarId}`
    * **Method:** GET
    * **Description:** Returns a calendar from the user's calendar list.
    * **Path Parameters:** `calendarId` (string)
    * **Scopes:** `calendar.readonly`, `calendar`, `calendar.app.created`, `calendar.calendarlist`, `calendar.calendarlist.readonly`
    * **Request Body:** None
    * **Response:** [`CalendarListEntry`](#calendarlistentry)

* **`insert`** `/users/me/calendarList`
    * **Method:** POST
    * **Description:** Inserts an existing calendar into the user's calendar list.
    * **Query Parameters:** `colorRgbFormat` (boolean, optional)
    * **Scopes:** `calendar`, `calendar.calendarlist`
    * **Request Body:** [`CalendarListEntry`](#calendarlistentry) (required `id`)
    * **Response:** [`CalendarListEntry`](#calendarlistentry)

* **`list`** `/users/me/calendarList`
    * **Method:** GET
    * **Description:** Returns the calendars on the user's calendar list.
    * **Query Parameters:** `maxResults` (integer, optional), `minAccessRole` (string, optional), `pageToken` (string, optional), `showDeleted` (boolean, optional), `showHidden` (boolean, optional), `syncToken` (string, optional)
    * **Scopes:** `calendar.readonly`, `calendar`, `calendar.calendarlist`, `calendar.calendarlist.readonly`
    * **Request Body:** None
    * **Response:** [`CalendarList`](#calendarlist)

* **`patch`** `/users/me/calendarList/{calendarId}`
    * **Method:** PATCH
    * **Description:** Updates an existing calendar on the user's calendar list. Supports patch semantics.
    * **Path Parameters:** `calendarId` (string)
    * **Query Parameters:** `colorRgbFormat` (boolean, optional)
    * **Scopes:** `calendar`, `calendar.app.created`, `calendar.calendarlist`
    * **Request Body:** Partial [`CalendarListEntry`](#calendarlistentry)
    * **Response:** [`CalendarListEntry`](#calendarlistentry)


* **`update`** `/users/me/calendarList/{calendarId}`
    * **Method:** PUT
    * **Description:** Updates an existing calendar on the user's calendar list.
    * **Path Parameters:** `calendarId` (string)
    * **Query Parameters:** `colorRgbFormat` (boolean, optional)
    * **Scopes:** `calendar`, `calendar.app.created`, `calendar.calendarlist`
    * **Request Body:** [`CalendarListEntry`](#calendarlistentry)
    * **Response:** [`CalendarListEntry`](#calendarlistentry)

* **`watch`** `/users/me/calendarList/watch`
    * **Method:** POST
    * **Description:** Watch for changes to CalendarList resources.
    * **Scopes:** `calendar.readonly`, `calendar`, `calendar.calendarlist`, `calendar.calendarlist.readonly`
    * **Request Body:** [`Channel`](#channel)
    * **Response:** [`Channel`](#channel)


### Calendars

* **Description:** Manages calendar metadata.

* **`clear`** `/calendars/{calendarId}/clear`
    * **Method:** POST
    * **Description:** Clears a primary calendar (deletes all events).
    * **Path Parameters:** `calendarId` (string)
    * **Scopes:** `calendar`, `calendar.calendars`
    * **Request Body:** None
    * **Response:** Empty

* **`delete`** `/calendars/{calendarId}`
    * **Method:** DELETE
    * **Description:** Deletes a secondary calendar.
    * **Path Parameters:** `calendarId` (string)
    * **Scopes:** `calendar`, `calendar.app.created`, `calendar.calendars`
    * **Request Body:** None
    * **Response:** Empty

* **`get`** `/calendars/{calendarId}`
    * **Method:** GET
    * **Description:** Returns metadata for a calendar.
    * **Path Parameters:** `calendarId` (string)
    * **Scopes:** `calendar.readonly`, `calendar`, `calendar.app.created`, `calendar.calendars`, `calendar.calendars.readonly`
    * **Request Body:** None
    * **Response:** [`Calendar`](#calendar)

* **`insert`** `/calendars`
    * **Method:** POST
    * **Description:** Creates a secondary calendar.
    * **Scopes:** `calendar`, `calendar.app.created`, `calendar.calendars`
    * **Request Body:** [`Calendar`](#calendar) (required `summary`)
    * **Response:** [`Calendar`](#calendar)

* **`patch`** `/calendars/{calendarId}`
    * **Method:** PATCH
    * **Description:** Updates metadata for a calendar. Supports patch semantics.
    * **Path Parameters:** `calendarId` (string)
    * **Scopes:** `calendar`, `calendar.app.created`, `calendar.calendars`
    * **Request Body:** Partial [`Calendar`](#calendar)
    * **Response:** [`Calendar`](#calendar)

* **`update`** `/calendars/{calendarId}`
    * **Method:** PUT
    * **Description:** Updates metadata for a calendar.
    * **Path Parameters:** `calendarId` (string)
    * **Scopes:** `calendar`, `calendar.app.created`, `calendar.calendars`
    * **Request Body:** [`Calendar`](#calendar)
    * **Response:** [`Calendar`](#calendar)


### Channels

* **Description:** Manages push notifications (watch changes to resources).

* **`stop`** `/channels/stop`
    * **Method:** POST
    * **Description:** Stop watching resources through this channel.
    * **Request Body:** [`Channel`](#channel) (required `id` and `resourceId`)
    * **Response:** Empty


### Colors

* **Description:** Provides color definitions for calendars and events.

* **`get`** `/colors`
    * **Method:** GET
    * **Description:** Returns the color definitions for calendars and events.
    * **Scopes:**  Any Calendar scope (optional)
    * **Request Body:** None
    * **Response:** [`Colors`](#colors)


### Events

* **Description:** Manages events on calendars.

* **`delete`** `/calendars/{calendarId}/events/{eventId}`
    * **Method:** DELETE
    * **Description:** Deletes an event.
    * **Path Parameters:** `calendarId` (string), `eventId` (string)
    * **Query Parameters:** `sendNotifications` (boolean, deprecated), `sendUpdates` (string, optional)
    * **Scopes:** `calendar`, `calendar.events`, `calendar.app.created`, `calendar.events.owned`
    * **Request Body:** None
    * **Response:** Empty

* **`get`** `/calendars/{calendarId}/events/{eventId}`
    * **Method:** GET
    * **Description:** Returns an event.
    * **Path Parameters:** `calendarId` (string), `eventId` (string)
    * **Query Parameters:** `alwaysIncludeEmail` (boolean, deprecated), `maxAttendees` (integer, optional), `timeZone` (string, optional)
    * **Scopes:**  Any Calendar scope (optional)
    * **Request Body:** None
    * **Response:** [`Event`](#event)

* **`import`** `/calendars/{calendarId}/events/import`
    * **Method:** POST
    * **Description:** Imports an event.
    * **Path Parameters:** `calendarId` (string)
    * **Query Parameters:** `conferenceDataVersion` (integer, optional), `supportsAttachments` (boolean, optional)
    * **Scopes:** `calendar`, `calendar.events`, `calendar.app.created`, `calendar.events.owned`
    * **Request Body:** [`Event`](#event) (required `iCalUID`, `start`, `end`)
    * **Response:** [`Event`](#event)

* **`insert`** `/calendars/{calendarId}/events`
    * **Method:** POST
    * **Description:** Creates an event.
    * **Path Parameters:** `calendarId` (string)
    * **Query Parameters:** `conferenceDataVersion` (integer, optional), `maxAttendees` (integer, optional), `sendNotifications` (boolean, deprecated), `sendUpdates` (string, optional), `supportsAttachments` (boolean, optional)
    * **Scopes:** `calendar`, `calendar.events`, `calendar.app.created`, `calendar.events.owned`
    * **Request Body:** [`Event`](#event) (required `start`, `end`)
    * **Response:** [`Event`](#event)

* **`instances`** `/calendars/{calendarId}/events/{eventId}/instances`
    * **Method:** GET
    * **Description:** Returns instances of a recurring event.
    * **Path Parameters:** `calendarId` (string), `eventId` (string)
    * **Query Parameters:** `alwaysIncludeEmail` (boolean, deprecated), `maxAttendees` (integer, optional), `maxResults` (integer, optional), `originalStart` (string, optional), `pageToken` (string, optional), `showDeleted` (boolean, optional), `timeMax` (datetime, optional), `timeMin` (datetime, optional), `timeZone` (string, optional)
    * **Scopes:**  Any Calendar scope (optional)
    * **Request Body:** None
    * **Response:** [`Events`](#events)


* **`list`** `/calendars/{calendarId}/events`
    * **Method:** GET
    * **Description:** Returns events on the specified calendar.
    * **Path Parameters:** `calendarId` (string)
    * **Query Parameters:** Many - see documentation.
    * **Scopes:**  Any Calendar scope (optional)
    * **Request Body:** None
    * **Response:** [`Events`](#events)

* **`move`** `/calendars/{calendarId}/events/{eventId}/move`
    * **Method:** POST
    * **Description:** Moves an event to another calendar.
    * **Path Parameters:** `calendarId` (string), `eventId` (string)
    * **Query Parameters:** `destination` (string, required), `sendNotifications` (boolean, deprecated), `sendUpdates` (string, optional)
    * **Scopes:** `calendar`, `calendar.events`, `calendar.events.owned`
    * **Request Body:** None
    * **Response:** [`Event`](#event)

* **`patch`** `/calendars/{calendarId}/events/{eventId}`
    * **Method:** PATCH
    * **Description:** Updates an event. Supports patch semantics.
    * **Path Parameters:** `calendarId` (string), `eventId` (string)
    * **Query Parameters:**  `alwaysIncludeEmail` (boolean, deprecated), `conferenceDataVersion` (integer, optional), `maxAttendees` (integer, optional), `sendNotifications` (boolean, deprecated), `sendUpdates` (string, optional), `supportsAttachments` (boolean, optional)
    * **Scopes:** `calendar`, `calendar.events`, `calendar.app.created`, `calendar.events.owned`
    * **Request Body:** Partial [`Event`](#event)
    * **Response:** [`Event`](#event)


* **`quickAdd`** `/calendars/{calendarId}/events/quickAdd`
    * **Method:** POST
    * **Description:** Creates an event based on a text string.
    * **Path Parameters:** `calendarId` (string)
    * **Query Parameters:** `text` (string, required), `sendNotifications` (boolean, deprecated), `sendUpdates` (string, optional)
    * **Scopes:** `calendar`, `calendar.events`, `calendar.app.created`, `calendar.events.owned`
    * **Request Body:** None
    * **Response:** [`Event`](#event)

* **`update`** `/calendars/{calendarId}/events/{eventId}`
    * **Method:** PUT
    * **Description:** Updates an event.
    * **Path Parameters:** `calendarId` (string), `eventId` (string)
    * **Query Parameters:** `alwaysIncludeEmail` (boolean, deprecated), `conferenceDataVersion` (integer, optional), `maxAttendees` (integer, optional), `sendNotifications` (boolean, deprecated), `sendUpdates` (string, optional), `supportsAttachments` (boolean, optional)
    * **Scopes:** `calendar`, `calendar.events`, `calendar.app.created`, `calendar.events.owned`
    * **Request Body:** [`Event`](#event) (required `start`, `end`)
    * **Response:** [`Event`](#event)

* **`watch`** `/calendars/{calendarId}/events/watch`
    * **Method:** POST
    * **Description:** Watch for changes to Events resources.
    * **Path Parameters:** `calendarId` (string)
    * **Query Parameters:** `eventTypes` (string[], optional)
    * **Scopes:** Any Calendar scope (optional)
    * **Request Body:** [`Channel`](#channel)
    * **Response:** [`Channel`](#channel)


### Freebusy

* **Description:** Queries free/busy information for calendars.

* **`query`** `/freeBusy`
    * **Method:** POST
    * **Description:** Returns free/busy information for a set of calendars.
    * **Scopes:** `calendar.readonly`, `calendar`, `calendar.events.freebusy`, `calendar.freebusy`
    * **Request Body:** [`FreeBusyRequest`](#freebusyrequest)
    * **Response:** [`FreeBusyResponse`](#freebusyresponse)


### Settings

* **Description:** Manages user settings.

* **`get`** `/users/me/settings/{setting}`
    * **Method:** GET
    * **Description:** Returns a single user setting.
    * **Path Parameters:** `setting` (string)
    * **Scopes:** `calendar.readonly`, `calendar`, `calendar.settings.readonly`
    * **Request Body:** None
    * **Response:** [`Setting`](#setting)

* **`list`** `/users/me/settings`
    * **Method:** GET
    * **Description:** Returns all user settings.
    * **Query Parameters:** `maxResults` (integer, optional), `pageToken` (string, optional), `syncToken` (string, optional)
    * **Scopes:** `calendar.readonly`, `calendar`, `calendar.settings.readonly`
    * **Request Body:** None
    * **Response:** [`Settings`](#settings)

* **`watch`** `/users/me/settings/watch`
    * **Method:** POST
    * **Description:** Watch for changes to Settings resources.
    * **Scopes:** `calendar.readonly`, `calendar`, `calendar.settings.readonly`
    * **Request Body:** [`Channel`](#channel)
    * **Response:** [`Channel`](#channel)



## Resource Representations


###  `AclRule`

```typescript
interface Scope {
  type: 'default' | 'user' | 'group' | 'domain';
  value?: string;
}

interface AclRule {
  kind: 'calendar#aclRule';
  etag: string;
  id: string;
  scope: Scope;
  role: 'none' | 'freeBusyReader' | 'reader' | 'writer' | 'owner';
}
```


### `Acl`

```typescript
interface Acl {
  kind: 'calendar#acl';
  etag: string;
  nextPageToken?: string;
  nextSyncToken?: string;
  items: AclRule[];
}
```


### `CalendarListEntry`

```typescript
interface EventReminder {
  method: 'email' | 'popup';
  minutes: number;
}

interface CalendarNotification {
  type: 'eventCreation' | 'eventChange' | 'eventCancellation' | 'eventResponse' | 'agenda';
  method: 'email';
}

interface CalendarNotificationSettings {
  notifications: CalendarNotification[];
}

interface ConferenceProperties {
  allowedConferenceSolutionTypes: ('eventHangout' | 'eventNamedHangout' | 'hangoutsMeet')[];
}


interface CalendarListEntry {
  kind: 'calendar#calendarListEntry';
  etag: string;
  id: string;
  summary: string;
  description?: string;
  location?: string;
  timeZone?: string;
  summaryOverride?: string;
  colorId?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  hidden?: boolean;
  selected?: boolean;
  accessRole: 'freeBusyReader' | 'reader' | 'writer' | 'owner';
  defaultReminders?: EventReminder[];
  notificationSettings?: CalendarNotificationSettings;
  primary?: boolean;
  deleted?: boolean;
  conferenceProperties?: ConferenceProperties;
}
```


### `CalendarList`

```typescript
interface CalendarList {
  kind: 'calendar#calendarList';
  etag: string;
  nextPageToken?: string;
  nextSyncToken?: string;
  items: CalendarListEntry[];
}
```


### `Calendar`

```typescript
interface Calendar {
  kind: 'calendar#calendar';
  etag: string;
  id: string;
  summary: string;
  description?: string;
  location?: string;
  timeZone?: string;
  conferenceProperties?: ConferenceProperties;
}
```


### `Channel`

```typescript
interface ChannelParams {
  ttl?: string;
}

interface Channel {
  id: string;
  token?: string;
  type: string; //  Usually "web_hook"
  address: string;
  params?: ChannelParams;
  resourceId?: string; // For stop method
  resourceUri?: string; // Received in response
  expiration?: number;  // Received in response, Unix timestamp in milliseconds
  kind?: string; // Received in response, "api#channel"
}
```



### `Colors`

```typescript
interface ColorDefinition {
  background: string; // Hex color code
  foreground: string; // Hex color code
}

interface Colors {
  kind: 'calendar#colors';
  updated: string; // datetime
  calendar: { [key: string]: ColorDefinition };
  event: { [key: string]: ColorDefinition };
}
```


### `Event` (Simplified - see full definition in documentation)

```typescript
// ... (Many properties - see the documentation for the complete list and descriptions)

interface Event {
  kind: 'calendar#event';
  etag: string;
  id?: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
  // ... other properties
}
```


### `Events`

```typescript
interface Events {
  kind: 'calendar#events';
  etag: string;
  // ... other properties
  items: Event[];
}

```


### `FreeBusyRequest`

```typescript
interface FreeBusyRequestItem {
  id: string;
}

interface FreeBusyRequest {
  timeMin: string; // datetime
  timeMax: string; // datetime
  timeZone?: string;
  groupExpansionMax?: number;
  calendarExpansionMax?: number;
  items: FreeBusyRequestItem[];
}
```


### `FreeBusyResponse` (Simplified)

```typescript

interface Error {
  domain: string;
  reason: string;
}

interface TimePeriod {
  start: string; // datetime
  end: string; // datetime
}

interface FreeBusyCalendar {
  errors?: Error[];
  busy: TimePeriod[];
}


interface FreeBusyResponse {
  kind: 'calendar#freeBusy';
  timeMin: string; // datetime
  timeMax: string; // datetime
  // ... other properties
  calendars: { [key: string]: FreeBusyCalendar };
}
```


### `Setting`

```typescript
interface Setting {
  kind: 'calendar#setting';
  etag: string;
  id: string;
  value: string;
}
```


### `Settings`

```typescript
interface Settings {
  kind: 'calendar#settings';
  etag: string;
  nextPageToken?: string;
  nextSyncToken?: string;
  items: Setting[];
}
```


## Edge Cases and Considerations

* **Rate Limiting:**  Be aware of Google API rate limits and implement appropriate retry mechanisms in the SDK.
* **Partial Updates (PATCH):**  The `PATCH` method allows for partial updates, which can be more efficient than `PUT`.  The SDK should clearly differentiate between these methods.
* **`sendNotifications` vs `sendUpdates`:** The `sendNotifications` parameter is deprecated in favor of `sendUpdates`.  The SDK should use `sendUpdates`.
* **Time Zones:**  Pay close attention to time zone handling.  The API uses IANA time zone database names (e.g., "America/Los_Angeles"). The SDK should provide clear documentation and potentially helper functions for working with time zones.
* **Error Handling:** The SDK should provide robust error handling, including parsing error responses from the API and providing helpful error messages.
* **Pagination:**  Many list methods support pagination using `pageToken` and `nextPageToken`.  The SDK should handle pagination transparently for the user.
* **Incremental Synchronization:**  The `syncToken` parameter allows for efficient synchronization by retrieving only changed entries.  The SDK should support this feature.
* **Optional Parameters:**  Clearly document optional parameters and their default values in the SDK.


This summary provides the essential information for generating a robust and comprehensive TypeScript SDK for the Google Calendar API v3.  Refer to the official API documentation for complete details and examples.
```