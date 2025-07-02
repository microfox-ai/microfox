# Google Calendar

A TypeScript SDK for managing Google Calendar resources, including calendars, events, access control, and settings.

## Installation

```bash
npm install @microfox/google-calendar
```

## Environment Variables

To use this package, you need to set the following environment variables:

- `GOOGLE_CLIENT_ID`: The client ID obtained from the Google API Console for your OAuth2 application. ** (Required)**
- `GOOGLE_CLIENT_SECRET`: The client secret obtained from the Google API Console for your OAuth2 application. ** (Required)**
- `MICROFOX_GOOGLE_CALENDAR_ACCESS_TOKEN`: The access token for Google Calendar API. This token grants access to the user's Google Calendar data. ** (Required)**
- `MICROFOX_GOOGLE_CALENDAR_REFRESH_TOKEN`: The refresh token for Google Calendar API. This token is used to obtain a new access token when the current one expires. ** (Required)**
- `MICROFOX_GOOGLE_CALENDAR_SCOPES`: A space-separated list of scopes required for Google Calendar API access. Defaults to a predefined set of calendar scopes if not provided. Example: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events' (Optional)

## API Reference

For detailed documentation on the constructor and all available functions, please refer to the following files:

- [**createGoogleCalendarSDK** (Constructor)](./docs/createGoogleCalendarSDK.md): Initializes the client.
- [clearCalendar](./docs/clearCalendar.md)
- [deleteAclRule](./docs/deleteAclRule.md)
- [deleteCalendar](./docs/deleteCalendar.md)
- [deleteCalendarFromList](./docs/deleteCalendarFromList.md)
- [deleteEvent](./docs/deleteEvent.md)
- [getAclRule](./docs/getAclRule.md)
- [getCalendar](./docs/getCalendar.md)
- [getCalendarFromList](./docs/getCalendarFromList.md)
- [getColors](./docs/getColors.md)
- [getEvent](./docs/getEvent.md)
- [getSetting](./docs/getSetting.md)
- [importEvent](./docs/importEvent.md)
- [insertAclRule](./docs/insertAclRule.md)
- [insertCalendarToList](./docs/insertCalendarToList.md)
- [insertEvent](./docs/insertEvent.md)
- [listAclRules](./docs/listAclRules.md)
- [listCalendarList](./docs/listCalendarList.md)
- [listEventInstances](./docs/listEventInstances.md)
- [listEvents](./docs/listEvents.md)
- [listSettings](./docs/listSettings.md)
- [moveEvent](./docs/moveEvent.md)
- [queryFreebusy](./docs/queryFreebusy.md)
- [quickAddEvent](./docs/quickAddEvent.md)
- [stopChannel](./docs/stopChannel.md)
- [updateAclRule](./docs/updateAclRule.md)
- [updateCalendar](./docs/updateCalendar.md)
- [updateCalendarInList](./docs/updateCalendarInList.md)
- [updateEvent](./docs/updateEvent.md)
- [watchAcl](./docs/watchAcl.md)
- [watchCalendarList](./docs/watchCalendarList.md)
- [watchEvents](./docs/watchEvents.md)
- [watchSettings](./docs/watchSettings.md)

