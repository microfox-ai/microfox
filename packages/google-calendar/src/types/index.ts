import { z } from 'zod';

export const GoogleCalendarSdkOptionsSchema = z.object({
  clientId: z.string().describe('Google OAuth 2.0 client ID'),
  clientSecret: z.string().describe('Google OAuth 2.0 client secret'),
  redirectUri: z.string().url().describe('OAuth 2.0 redirect URI'),
  accessToken: z.string().optional().describe('OAuth 2.0 access token'),
  refreshToken: z.string().optional().describe('OAuth 2.0 refresh token'),
});

export type GoogleCalendarSdkOptions = z.infer<typeof GoogleCalendarSdkOptionsSchema>;

export const EventDateTimeSchema = z.object({
  date: z.string().optional().describe('The date, in the format "yyyy-mm-dd", if this is an all-day event.'),
  dateTime: z.string().optional().describe('The time, as a combined date-time value (formatted according to RFC3339).'),
  timeZone: z.string().optional().describe('The time zone in which the time is specified.'),
});

export type EventDateTime = z.infer<typeof EventDateTimeSchema>;

export const EventAttendeeSchema = z.object({
  id: z.string().optional().describe('The attendee\'s Profile ID, if available.'),
  email: z.string().email().describe('The attendee\'s email address, if available.'),
  displayName: z.string().optional().describe('The attendee\'s name, if available.'),
  optional: z.boolean().optional().describe('Whether this is an optional attendee.'),
  responseStatus: z.enum(['needsAction', 'declined', 'tentative', 'accepted']).optional().describe('The attendee\'s response status.'),
});

export type EventAttendee = z.infer<typeof EventAttendeeSchema>;

export const EventReminderSchema = z.object({
  method: z.enum(['email', 'popup']).describe('The method used by this reminder.'),
  minutes: z.number().int().describe('Number of minutes before the start of the event when the reminder should trigger.'),
});

export type EventReminder = z.infer<typeof EventReminderSchema>;

export const EventSchema = z.object({
  id: z.string().optional().describe('Opaque identifier of the event.'),
  summary: z.string().describe('Title of the event.'),
  description: z.string().optional().describe('Description of the event.'),
  location: z.string().optional().describe('Geographic location of the event as free-form text.'),
  start: EventDateTimeSchema.describe('The (inclusive) start time of the event.'),
  end: EventDateTimeSchema.describe('The (exclusive) end time of the event.'),
  recurrence: z.array(z.string()).optional().describe('List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event.'),
  attendees: z.array(EventAttendeeSchema).optional().describe('The attendees of the event.'),
  reminders: z.object({
    useDefault: z.boolean().describe('Whether the default reminders of the calendar apply to the event.'),
    overrides: z.array(EventReminderSchema).optional().describe('If the event doesn\'t use the default reminders, this lists the reminders specific to the event.'),
  }).optional().describe('Information about the event\'s reminders for the authenticated user.'),
});

export type Event = z.infer<typeof EventSchema>;

export const CalendarSchema = z.object({
  id: z.string().optional().describe('Identifier of the calendar.'),
  summary: z.string().describe('Title of the calendar.'),
  description: z.string().optional().describe('Description of the calendar.'),
  location: z.string().optional().describe('Geographic location of the calendar as free-form text.'),
  timeZone: z.string().describe('The time zone of the calendar.'),
});

export type Calendar = z.infer<typeof CalendarSchema>;

export const CalendarListEntrySchema = z.object({
  id: z.string().describe('Identifier of the calendar.'),
  summary: z.string().describe('Title of the calendar.'),
  description: z.string().optional().describe('Description of the calendar.'),
  location: z.string().optional().describe('Geographic location of the calendar as free-form text.'),
  timeZone: z.string().describe('The time zone of the calendar.'),
  summaryOverride: z.string().optional().describe('The summary that the authenticated user has set for this calendar.'),
  colorId: z.string().optional().describe('The color of the calendar. This is an ID referencing the predefined colors available in the Calendar UI.'),
  backgroundColor: z.string().optional().describe('The main color of the calendar in the hexadecimal format "#0088aa".'),
  foregroundColor: z.string().optional().describe('The foreground color of the calendar in the hexadecimal format "#ffffff".'),
  hidden: z.boolean().optional().describe('Whether the calendar has been hidden from the list.'),
  selected: z.boolean().optional().describe('Whether the calendar content shows up in the calendar UI.'),
  accessRole: z.enum(['freeBusyReader', 'reader', 'writer', 'owner']).describe('The effective access role that the authenticated user has on the calendar.'),
  defaultReminders: z.array(EventReminderSchema).optional().describe('The default reminders that the authenticated user has for this calendar.'),
});

export type CalendarListEntry = z.infer<typeof CalendarListEntrySchema>;

export const CalendarListSchema = z.object({
  kind: z.literal('calendar#calendarList').describe('Type of the collection ("calendar#calendarList").'),
  etag: z.string().describe('ETag of the collection.'),
  nextPageToken: z.string().optional().describe('Token used to access the next page of this result.'),
  nextSyncToken: z.string().optional().describe('Token used at a later point in time to retrieve only the entries that have changed since this result was returned.'),
  items: z.array(CalendarListEntrySchema).describe('List of calendars.'),
});

export type CalendarList = z.infer<typeof CalendarListSchema>;

export const FreeBusyRequestItemSchema = z.object({
  id: z.string().describe('The identifier of a calendar or a group.'),
});

export const FreeBusyRequestSchema = z.object({
  timeMin: z.string().describe('The start of the interval for the query formatted as per RFC3339.'),
  timeMax: z.string().describe('The end of the interval for the query formatted as per RFC3339.'),
  timeZone: z.string().optional().describe('Time zone used in the response.'),
  groupExpansionMax: z.number().int().optional().describe('Maximal number of calendar identifiers to be provided for a single group.'),
  calendarExpansionMax: z.number().int().optional().describe('Maximal number of calendars for which FreeBusy information is to be provided.'),
  items: z.array(FreeBusyRequestItemSchema).describe('List of calendars and/or groups to query.'),
});

export type FreeBusyRequest = z.infer<typeof FreeBusyRequestSchema>;

export const FreeBusyResponseSchema = z.object({
  kind: z.literal('calendar#freeBusy').describe('Type of the resource ("calendar#freeBusy").'),
  timeMin: z.string().describe('The start of the interval.'),
  timeMax: z.string().describe('The end of the interval.'),
  groups: z.record(z.array(z.string())).optional().describe('Expansion of groups.'),
  calendars: z.record(z.object({
    errors: z.array(z.object({
      domain: z.string(),
      reason: z.string(),
    })).optional().describe('Optional error(s) (if the calendar is not queryable).'),
    busy: z.array(z.object({
      start: z.string(),
      end: z.string(),
    })).optional().describe('List of time ranges during which this calendar should be regarded as busy.'),
  })).describe('List of free/busy information for calendars.'),
});

export type FreeBusyResponse = z.infer<typeof FreeBusyResponseSchema>;
