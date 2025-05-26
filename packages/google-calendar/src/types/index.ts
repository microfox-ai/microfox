import { z } from 'zod';

export const ScopeSchema = z.object({
  type: z
    .enum(['default', 'user', 'group', 'domain'])
    .describe('The type of scope'),
  value: z
    .string()
    .optional()
    .describe('The email address or domain name for user or group scopes'),
});

export const AclRuleSchema = z.object({
  kind: z
    .literal('calendar#aclRule')
    .describe('Type of the resource ("calendar#aclRule")'),
  etag: z.string().describe('ETag of the resource'),
  id: z.string().describe('Identifier of the ACL rule'),
  scope: ScopeSchema.describe('The scope of the rule'),
  role: z
    .enum(['none', 'freeBusyReader', 'reader', 'writer', 'owner'])
    .describe('The role granted by this rule'),
});

export const AclSchema = z.object({
  kind: z
    .literal('calendar#acl')
    .describe('Type of the resource ("calendar#acl")'),
  etag: z.string().describe('ETag of the resource'),
  nextPageToken: z
    .string()
    .optional()
    .describe('Token used to access the next page of this result'),
  nextSyncToken: z
    .string()
    .optional()
    .describe(
      'Token used at a later point in time to retrieve only the entries that have changed since this result was returned',
    ),
  items: z.array(AclRuleSchema).describe('List of ACL rules'),
});

export const EventReminderSchema = z.object({
  method: z
    .enum(['email', 'popup'])
    .describe('The method used by this reminder'),
  minutes: z
    .number()
    .describe(
      'Number of minutes before the start of the event when the reminder should trigger',
    ),
});

export const CalendarNotificationSchema = z.object({
  type: z
    .enum([
      'eventCreation',
      'eventChange',
      'eventCancellation',
      'eventResponse',
      'agenda',
    ])
    .describe('The type of notification'),
  method: z.literal('email').describe('The method used for this notification'),
});

export const CalendarNotificationSettingsSchema = z.object({
  notifications: z
    .array(CalendarNotificationSchema)
    .describe('List of notifications'),
});

export const ConferencePropertiesSchema = z.object({
  allowedConferenceSolutionTypes: z
    .array(z.enum(['eventHangout', 'eventNamedHangout', 'hangoutsMeet']))
    .describe(
      'The types of conference solutions that are supported for this calendar',
    ),
});

export const CalendarListEntrySchema = z.object({
  kind: z
    .literal('calendar#calendarListEntry')
    .describe('Type of the resource ("calendar#calendarListEntry")'),
  etag: z.string().describe('ETag of the resource'),
  id: z.string().describe('Identifier of the calendar'),
  summary: z.string().describe('Title of the calendar'),
  description: z.string().optional().describe('Description of the calendar'),
  location: z
    .string()
    .optional()
    .describe('Geographic location of the calendar as free-form text'),
  timeZone: z.string().optional().describe('The time zone of the calendar'),
  summaryOverride: z
    .string()
    .optional()
    .describe(
      'The summary that the authenticated user has set for this calendar',
    ),
  colorId: z.string().optional().describe('The color of the calendar'),
  backgroundColor: z
    .string()
    .optional()
    .describe(
      'The main color of the calendar in the hexadecimal format "#0088aa"',
    ),
  foregroundColor: z
    .string()
    .optional()
    .describe(
      'The foreground color of the calendar in the hexadecimal format "#ffffff"',
    ),
  hidden: z
    .boolean()
    .optional()
    .describe('Whether the calendar has been hidden from the list'),
  selected: z
    .boolean()
    .optional()
    .describe('Whether the calendar content shows up in the calendar UI'),
  accessRole: z
    .enum(['freeBusyReader', 'reader', 'writer', 'owner'])
    .describe(
      'The effective access role that the authenticated user has on the calendar',
    ),
  defaultReminders: z
    .array(EventReminderSchema)
    .optional()
    .describe(
      'The default reminders that the authenticated user has for this calendar',
    ),
  notificationSettings: CalendarNotificationSettingsSchema.optional().describe(
    'The notifications that the authenticated user is receiving for this calendar',
  ),
  primary: z
    .boolean()
    .optional()
    .describe(
      'Whether the calendar is the primary calendar of the authenticated user',
    ),
  deleted: z
    .boolean()
    .optional()
    .describe(
      'Whether this calendar list entry has been deleted from the calendar list',
    ),
  conferenceProperties: ConferencePropertiesSchema.optional().describe(
    'Conferencing properties for this calendar',
  ),
});

export const CalendarListSchema = z.object({
  kind: z
    .literal('calendar#calendarList')
    .describe('Type of the resource ("calendar#calendarList")'),
  etag: z.string().describe('ETag of the resource'),
  nextPageToken: z
    .string()
    .optional()
    .describe('Token used to access the next page of this result'),
  nextSyncToken: z
    .string()
    .optional()
    .describe(
      'Token used at a later point in time to retrieve only the entries that have changed since this result was returned',
    ),
  items: z.array(CalendarListEntrySchema).describe('List of calendars'),
});

export const CalendarSchema = z.object({
  kind: z
    .literal('calendar#calendar')
    .describe('Type of the resource ("calendar#calendar")'),
  etag: z.string().describe('ETag of the resource'),
  id: z.string().describe('Identifier of the calendar'),
  summary: z.string().describe('Title of the calendar'),
  description: z.string().optional().describe('Description of the calendar'),
  location: z
    .string()
    .optional()
    .describe('Geographic location of the calendar as free-form text'),
  timeZone: z.string().optional().describe('The time zone of the calendar'),
  conferenceProperties: ConferencePropertiesSchema.optional().describe(
    'Conferencing properties for this calendar',
  ),
});

export const ChannelParamsSchema = z.object({
  ttl: z
    .string()
    .optional()
    .describe('The time-to-live in seconds for the notification channel'),
});

export const ChannelSchema = z.object({
  id: z
    .string()
    .describe('A UUID or similar unique string that identifies this channel'),
  token: z
    .string()
    .optional()
    .describe(
      'An arbitrary string delivered to the target address with each notification delivered over this channel',
    ),
  type: z
    .string()
    .describe('The type of delivery mechanism used for this channel'),
  address: z
    .string()
    .describe('The address where notifications are delivered for this channel'),
  params: ChannelParamsSchema.optional().describe(
    'Additional parameters controlling delivery channel behavior',
  ),
  resourceId: z
    .string()
    .optional()
    .describe(
      'An opaque ID that identifies the resource being watched on this channel',
    ),
  resourceUri: z
    .string()
    .optional()
    .describe('A version-specific identifier for the watched resource'),
  expiration: z
    .number()
    .optional()
    .describe(
      'Date and time of notification channel expiration, expressed as a Unix timestamp, in milliseconds',
    ),
  kind: z
    .literal('api#channel')
    .optional()
    .describe(
      'Identifies this as a notification channel used to watch for changes to a resource',
    ),
});

export const ColorDefinitionSchema = z.object({
  background: z
    .string()
    .describe('The background color associated with this color definition'),
  foreground: z
    .string()
    .describe(
      'The foreground color that can be used to write on top of a background with this color',
    ),
});

export const ColorsSchema = z.object({
  kind: z
    .literal('calendar#colors')
    .describe('Type of the resource ("calendar#colors")'),
  updated: z
    .string()
    .describe(
      'Last modification time of the color palette (as a RFC3339 timestamp)',
    ),
  calendar: z
    .record(ColorDefinitionSchema)
    .describe(
      'A global palette of calendar colors, mapping from the color ID to its definition',
    ),
  event: z
    .record(ColorDefinitionSchema)
    .describe(
      'A global palette of event colors, mapping from the color ID to its definition',
    ),
});

export const EventDateTimeSchema = z.object({
  date: z
    .string()
    .optional()
    .describe(
      'The date, in the format "yyyy-mm-dd", if this is an all-day event',
    ),
  dateTime: z
    .string()
    .optional()
    .describe(
      'The time, as a combined date-time value (formatted according to RFC3339)',
    ),
  timeZone: z
    .string()
    .optional()
    .describe(
      'The time zone in which the time is specified (IANA Time Zone Database name)',
    ),
});

export const PersonSchema = z.object({
  id: z.string().optional().describe("The person's Profile ID, if available"),
  email: z
    .string()
    .optional()
    .describe("The person's email address, if available"),
  displayName: z
    .string()
    .optional()
    .describe("The person's name, if available"),
  self: z
    .boolean()
    .optional()
    .describe(
      'Whether this entry represents the calendar on which this copy of the event appears',
    ),
});

export const AttendeeSchema = PersonSchema.extend({
  organizer: z
    .boolean()
    .optional()
    .describe('Whether the attendee is the organizer of the event'),
  resource: z
    .boolean()
    .optional()
    .describe('Whether the attendee is a resource'),
  optional: z
    .boolean()
    .optional()
    .describe('Whether this is an optional attendee'),
  responseStatus: z
    .enum(['needsAction', 'declined', 'tentative', 'accepted'])
    .optional()
    .describe("The attendee's response status"),
  comment: z.string().optional().describe("The attendee's response comment"),
  additionalGuests: z
    .number()
    .optional()
    .describe('Number of additional guests'),
});

export const ConferenceEntryPointSchema = z.object({
  entryPointType: z
    .enum(['video', 'phone', 'sip', 'more'])
    .describe('The type of the conference entry point'),
  uri: z.string().describe('The URI of the entry point'),
  label: z.string().optional().describe('The label for the URI'),
  pin: z.string().optional().describe('The PIN to access the conference'),
  accessCode: z
    .string()
    .optional()
    .describe('The access code to access the conference'),
  meetingCode: z
    .string()
    .optional()
    .describe('The meeting code to access the conference'),
  passcode: z
    .string()
    .optional()
    .describe('The passcode to access the conference'),
  password: z
    .string()
    .optional()
    .describe('The password to access the conference'),
});

export const ConferenceSolutionKeySchema = z.object({
  type: z
    .enum(['eventHangout', 'eventNamedHangout', 'hangoutsMeet', 'addOn'])
    .describe('The conference solution type'),
});

export const ConferenceSolutionSchema = z.object({
  key: ConferenceSolutionKeySchema.describe(
    'The key which can uniquely identify the conference solution',
  ),
  name: z
    .string()
    .optional()
    .describe('The user-visible name of this solution'),
  iconUri: z
    .string()
    .optional()
    .describe('The user-visible icon for this solution'),
});

export const ConferenceCreateRequestStatusSchema = z.object({
  statusCode: z
    .enum(['pending', 'success', 'failure'])
    .describe('The current status of the conference create request'),
});

export const ConferenceCreateRequestSchema = z.object({
  requestId: z
    .string()
    .describe('The client-generated unique ID for this request'),
  conferenceSolutionKey: ConferenceSolutionKeySchema.describe(
    'The conference solution',
  ),
  status: ConferenceCreateRequestStatusSchema.optional().describe(
    'The status of the conference create request',
  ),
});

export const ConferenceDataSchema = z.object({
  createRequest: ConferenceCreateRequestSchema.optional().describe(
    'A request to generate a new conference',
  ),
  entryPoints: z
    .array(ConferenceEntryPointSchema)
    .optional()
    .describe('Information about individual conference entry points'),
  conferenceSolution: ConferenceSolutionSchema.optional().describe(
    'The conference solution',
  ),
  conferenceId: z.string().optional().describe('The ID of the conference'),
  signature: z
    .string()
    .optional()
    .describe('The signature of the conference data'),
  notes: z
    .string()
    .optional()
    .describe('Additional notes to display to the user'),
});

export const ExtendedPropertiesSchema = z.object({
  private: z
    .record(z.string())
    .optional()
    .describe('Properties that are private to the copy of the event'),
  shared: z
    .record(z.string())
    .optional()
    .describe('Properties that are shared between copies of the event'),
});

export const GadgetSchema = z.object({
  type: z.string().optional().describe("The gadget's type"),
  title: z.string().optional().describe("The gadget's title"),
  link: z.string().optional().describe("The gadget's URL"),
  iconLink: z.string().optional().describe("The gadget's icon URL"),
  width: z.number().optional().describe("The gadget's width in pixels"),
  height: z.number().optional().describe("The gadget's height in pixels"),
  display: z
    .enum(['icon', 'chip'])
    .optional()
    .describe("The gadget's display mode"),
  preferences: z.record(z.string()).optional().describe('Preferences'),
});

export const EventReminderOverrideSchema = z.object({
  method: z
    .enum(['email', 'popup'])
    .describe('The method used by this reminder'),
  minutes: z
    .number()
    .describe(
      'Number of minutes before the start when the reminder should trigger',
    ),
});

export const EventRemindersSchema = z.object({
  useDefault: z
    .boolean()
    .optional()
    .describe(
      'Whether the default reminders of the calendar apply to the event',
    ),
  overrides: z
    .array(EventReminderOverrideSchema)
    .optional()
    .describe('List of reminders specific to the event'),
});

export const EventSourceSchema = z.object({
  url: z
    .string()
    .optional()
    .describe('URL of the source pointing to a resource'),
  title: z.string().optional().describe('Title of the source'),
});

export const WorkingLocationCustomLocationSchema = z.object({
  label: z
    .string()
    .optional()
    .describe('An optional extra label for additional information'),
});

export const WorkingLocationOfficeLocationSchema = z.object({
  buildingId: z.string().optional().describe('An optional building identifier'),
  floorId: z.string().optional().describe('An optional floor identifier'),
  floorSectionId: z
    .string()
    .optional()
    .describe('An optional floor section identifier'),
  deskId: z.string().optional().describe('An optional desk identifier'),
  label: z
    .string()
    .optional()
    .describe("The office name that's displayed in Calendar clients"),
});

export const WorkingLocationPropertiesSchema = z.object({
  type: z
    .enum(['homeOffice', 'officeLocation', 'customLocation'])
    .optional()
    .describe('Type of the working location'),
  homeOffice: z
    .any()
    .optional()
    .describe('If present, specifies that the user is working at home'),
  customLocation: WorkingLocationCustomLocationSchema.optional().describe(
    'If present, specifies that the user is working from a custom location',
  ),
  officeLocation: WorkingLocationOfficeLocationSchema.optional().describe(
    'If present, specifies that the user is working from an office',
  ),
});

export const OutOfOfficePropertiesSchema = z.object({
  autoDeclineMode: z
    .enum([
      'declineNone',
      'declineAllConflictingInvitations',
      'declineOnlyNewConflictingInvitations',
    ])
    .optional()
    .describe(
      'Whether to decline meeting invitations which overlap Out of office events',
    ),
  declineMessage: z
    .string()
    .optional()
    .describe(
      'Response message to set if an invitation is automatically declined',
    ),
});

export const FocusTimePropertiesSchema = z.object({
  autoDeclineMode: z
    .enum([
      'declineNone',
      'declineAllConflictingInvitations',
      'declineOnlyNewConflictingInvitations',
    ])
    .optional()
    .describe(
      'Whether to decline meeting invitations which overlap Focus Time events',
    ),
  declineMessage: z
    .string()
    .optional()
    .describe(
      'Response message to set if an invitation is automatically declined',
    ),
  chatStatus: z
    .enum(['available', 'doNotDisturb'])
    .optional()
    .describe('The status to mark the user in Chat and related products'),
});

export const EventAttachmentSchema = z.object({
  fileUrl: z.string().optional().describe('URL link to the attachment'),
  title: z.string().optional().describe('Attachment title'),
  mimeType: z
    .string()
    .optional()
    .describe('Internet media type (MIME type) of the attachment'),
  iconLink: z.string().optional().describe("URL link to the attachment's icon"),
  fileId: z.string().optional().describe('ID of the attached file'),
});

export const BirthdayPropertiesSchema = z.object({
  contact: z
    .string()
    .optional()
    .describe('Resource name of the contact this birthday event is linked to'),
  type: z
    .enum(['anniversary', 'birthday', 'custom', 'other', 'self'])
    .optional()
    .describe('Type of birthday or special event'),
  customTypeName: z
    .string()
    .optional()
    .describe('Custom type label specified for this event'),
});

export const EventSchema = z.object({
  kind: z
    .literal('calendar#event')
    .describe('Type of the resource ("calendar#event")'),
  etag: z.string().describe('ETag of the resource'),
  id: z.string().optional().describe('Opaque identifier of the event'),
  status: z
    .enum(['confirmed', 'tentative', 'cancelled'])
    .optional()
    .describe('Status of the event'),
  htmlLink: z
    .string()
    .optional()
    .describe('An absolute link to this event in the Google Calendar Web UI'),
  created: z
    .string()
    .optional()
    .describe('Creation time of the event (as a RFC3339 timestamp)'),
  updated: z
    .string()
    .optional()
    .describe('Last modification time of the event (as a RFC3339 timestamp)'),
  summary: z.string().optional().describe('Title of the event'),
  description: z.string().optional().describe('Description of the event'),
  location: z
    .string()
    .optional()
    .describe('Geographic location of the event as free-form text'),
  colorId: z.string().optional().describe('The color of the event'),
  creator: PersonSchema.optional().describe('The creator of the event'),
  organizer: PersonSchema.optional().describe('The organizer of the event'),
  start: EventDateTimeSchema.optional().describe(
    'The (inclusive) start time of the event',
  ),
  end: EventDateTimeSchema.optional().describe(
    'The (exclusive) end time of the event',
  ),
  endTimeUnspecified: z
    .boolean()
    .optional()
    .describe('Whether the end time is actually unspecified'),
  recurrence: z
    .array(z.string())
    .optional()
    .describe(
      'List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event',
    ),
  recurringEventId: z
    .string()
    .optional()
    .describe(
      'For an instance of a recurring event, this is the id of the recurring event',
    ),
  originalStartTime: EventDateTimeSchema.optional().describe(
    'For an instance of a recurring event, this is the original start time',
  ),
  transparency: z
    .enum(['opaque', 'transparent'])
    .optional()
    .describe('Whether the event blocks time on the calendar'),
  visibility: z
    .enum(['default', 'public', 'private', 'confidential'])
    .optional()
    .describe('Visibility of the event'),
  iCalUID: z
    .string()
    .optional()
    .describe('Event unique identifier as defined in RFC5545'),
  sequence: z.number().optional().describe('Sequence number as per iCalendar'),
  attendees: z
    .array(AttendeeSchema)
    .optional()
    .describe('The attendees of the event'),
  attendeesOmitted: z
    .boolean()
    .optional()
    .describe(
      "Whether attendees may have been omitted from the event's representation",
    ),
  extendedProperties: ExtendedPropertiesSchema.optional().describe(
    'Extended properties of the event',
  ),
  hangoutLink: z
    .string()
    .optional()
    .describe(
      'An absolute link to the Google Hangout associated with this event',
    ),
  conferenceData: ConferenceDataSchema.optional().describe(
    'The conference-related information',
  ),
  gadget: GadgetSchema.optional().describe('A gadget that extends this event'),
  anyoneCanAddSelf: z
    .boolean()
    .optional()
    .describe('Whether anyone can invite themselves to the event'),
  guestsCanInviteOthers: z
    .boolean()
    .optional()
    .describe('Whether attendees other than the organizer can invite others'),
  guestsCanModify: z
    .boolean()
    .optional()
    .describe(
      'Whether attendees other than the organizer can modify the event',
    ),
  guestsCanSeeOtherGuests: z
    .boolean()
    .optional()
    .describe(
      'Whether attendees other than the organizer can see who the attendees are',
    ),
  privateCopy: z
    .boolean()
    .optional()
    .describe('If set to True, Event propagation is disabled'),
  locked: z
    .boolean()
    .optional()
    .describe(
      'Whether this is a locked event copy where no changes can be made',
    ),
  reminders: EventRemindersSchema.optional().describe(
    "Information about the event's reminders",
  ),
  source: EventSourceSchema.optional().describe(
    'Source from which the event was created',
  ),
  workingLocationProperties:
    WorkingLocationPropertiesSchema.optional().describe(
      'Working location event data',
    ),
  outOfOfficeProperties: OutOfOfficePropertiesSchema.optional().describe(
    'Out of office event data',
  ),
  focusTimeProperties: FocusTimePropertiesSchema.optional().describe(
    'Focus Time event data',
  ),
  attachments: z
    .array(EventAttachmentSchema)
    .optional()
    .describe('File attachments for the event'),
  birthdayProperties: BirthdayPropertiesSchema.optional().describe(
    'Birthday or special event data',
  ),
  eventType: z
    .enum([
      'birthday',
      'default',
      'focusTime',
      'fromGmail',
      'outOfOffice',
      'workingLocation',
    ])
    .optional()
    .describe('Specific type of the event'),
});

export const EventsSchema = z.object({
  kind: z
    .literal('calendar#events')
    .describe('Type of the resource ("calendar#events")'),
  etag: z.string().describe('ETag of the resource'),
  summary: z.string().optional().describe('Title of the calendar'),
  description: z.string().optional().describe('Description of the calendar'),
  updated: z
    .string()
    .describe(
      'Last modification time of the events collection (as a RFC3339 timestamp)',
    ),
  timeZone: z.string().optional().describe('The time zone of the calendar'),
  accessRole: z
    .enum(['none', 'freeBusyReader', 'reader', 'writer', 'owner'])
    .optional()
    .describe("The user's access role for this calendar"),
  defaultReminders: z
    .array(EventReminderSchema)
    .optional()
    .describe(
      'The default reminders on the calendar for the authenticated user',
    ),
  nextPageToken: z
    .string()
    .optional()
    .describe('Token used to access the next page of this result'),
  nextSyncToken: z
    .string()
    .optional()
    .describe(
      'Token used at a later point in time to retrieve only the entries that have changed since this result was returned',
    ),
  items: z.array(EventSchema).describe('List of events on the calendar'),
});

export const FreeBusyRequestItemSchema = z.object({
  id: z.string().describe('The identifier of a calendar or a group'),
});

export const FreeBusyRequestSchema = z.object({
  timeMin: z
    .string()
    .describe(
      'The start of the interval for the query formatted as per RFC3339',
    ),
  timeMax: z
    .string()
    .describe('The end of the interval for the query formatted as per RFC3339'),
  timeZone: z.string().optional().describe('Time zone used in the response'),
  groupExpansionMax: z
    .number()
    .optional()
    .describe(
      'Maximal number of calendar identifiers to be provided for a single group',
    ),
  calendarExpansionMax: z
    .number()
    .optional()
    .describe(
      'Maximal number of calendars for which FreeBusy information is to be provided',
    ),
  items: z
    .array(FreeBusyRequestItemSchema)
    .describe('List of calendars and/or groups to query'),
});

export const ErrorSchema = z.object({
  domain: z.string().describe('Domain, or broad category, of the error'),
  reason: z.string().describe('Specific reason for the error'),
});

export const TimePeriodSchema = z.object({
  start: z.string().describe('The (inclusive) start of the time period'),
  end: z.string().describe('The (exclusive) end of the time period'),
});

export const FreeBusyCalendarSchema = z.object({
  errors: z
    .array(ErrorSchema)
    .optional()
    .describe('Optional error(s) (if the request failed)'),
  busy: z
    .array(TimePeriodSchema)
    .describe(
      'List of time ranges during which this calendar should be regarded as busy',
    ),
});

export const FreeBusyResponseSchema = z.object({
  kind: z
    .literal('calendar#freeBusy')
    .describe('Type of the resource ("calendar#freeBusy")'),
  timeMin: z.string().describe('The start of the interval'),
  timeMax: z.string().describe('The end of the interval'),
  groups: z
    .record(z.array(z.string()))
    .optional()
    .describe('Expansion of groups'),
  calendars: z
    .record(FreeBusyCalendarSchema)
    .describe('List of free/busy information for calendars'),
});

export const SettingSchema = z.object({
  kind: z
    .literal('calendar#setting')
    .describe('Type of the resource ("calendar#setting")'),
  etag: z.string().describe('ETag of the resource'),
  id: z.string().describe('The id of the user setting'),
  value: z.string().describe('The value of the user setting'),
});

export const SettingsSchema = z.object({
  kind: z
    .literal('calendar#settings')
    .describe('Type of the resource ("calendar#settings")'),
  etag: z.string().describe('ETag of the resource'),
  nextPageToken: z
    .string()
    .optional()
    .describe('Token used to access the next page of this result'),
  nextSyncToken: z
    .string()
    .optional()
    .describe(
      'Token used at a later point in time to retrieve only the entries that have changed since this result was returned',
    ),
  items: z.array(SettingSchema).describe('List of user settings'),
});

export type Scope = z.infer<typeof ScopeSchema>;
export type AclRule = z.infer<typeof AclRuleSchema>;
export type Acl = z.infer<typeof AclSchema>;
export type EventReminder = z.infer<typeof EventReminderSchema>;
export type CalendarNotification = z.infer<typeof CalendarNotificationSchema>;
export type CalendarNotificationSettings = z.infer<
  typeof CalendarNotificationSettingsSchema
>;
export type ConferenceProperties = z.infer<typeof ConferencePropertiesSchema>;
export type CalendarListEntry = z.infer<typeof CalendarListEntrySchema>;
export type CalendarList = z.infer<typeof CalendarListSchema>;
export type Calendar = z.infer<typeof CalendarSchema>;
export type ChannelParams = z.infer<typeof ChannelParamsSchema>;
export type Channel = z.infer<typeof ChannelSchema>;
export type ColorDefinition = z.infer<typeof ColorDefinitionSchema>;
export type Colors = z.infer<typeof ColorsSchema>;
export type EventDateTime = z.infer<typeof EventDateTimeSchema>;
export type Person = z.infer<typeof PersonSchema>;
export type Attendee = z.infer<typeof AttendeeSchema>;
export type ConferenceEntryPoint = z.infer<typeof ConferenceEntryPointSchema>;
export type ConferenceSolutionKey = z.infer<typeof ConferenceSolutionKeySchema>;
export type ConferenceSolution = z.infer<typeof ConferenceSolutionSchema>;
export type ConferenceCreateRequestStatus = z.infer<
  typeof ConferenceCreateRequestStatusSchema
>;
export type ConferenceCreateRequest = z.infer<
  typeof ConferenceCreateRequestSchema
>;
export type ConferenceData = z.infer<typeof ConferenceDataSchema>;
export type ExtendedProperties = z.infer<typeof ExtendedPropertiesSchema>;
export type Gadget = z.infer<typeof GadgetSchema>;
export type EventReminderOverride = z.infer<typeof EventReminderOverrideSchema>;
export type EventReminders = z.infer<typeof EventRemindersSchema>;
export type EventSource = z.infer<typeof EventSourceSchema>;
export type WorkingLocationCustomLocation = z.infer<
  typeof WorkingLocationCustomLocationSchema
>;
export type WorkingLocationOfficeLocation = z.infer<
  typeof WorkingLocationOfficeLocationSchema
>;
export type WorkingLocationProperties = z.infer<
  typeof WorkingLocationPropertiesSchema
>;
export type OutOfOfficeProperties = z.infer<typeof OutOfOfficePropertiesSchema>;
export type FocusTimeProperties = z.infer<typeof FocusTimePropertiesSchema>;
export type EventAttachment = z.infer<typeof EventAttachmentSchema>;
export type BirthdayProperties = z.infer<typeof BirthdayPropertiesSchema>;
export type Event = z.infer<typeof EventSchema>;
export type Events = z.infer<typeof EventsSchema>;
export type FreeBusyRequestItem = z.infer<typeof FreeBusyRequestItemSchema>;
export type FreeBusyRequest = z.infer<typeof FreeBusyRequestSchema>;
export type Error = z.infer<typeof ErrorSchema>;
export type TimePeriod = z.infer<typeof TimePeriodSchema>;
export type FreeBusyCalendar = z.infer<typeof FreeBusyCalendarSchema>;
export type FreeBusyResponse = z.infer<typeof FreeBusyResponseSchema>;
export type Setting = z.infer<typeof SettingSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
