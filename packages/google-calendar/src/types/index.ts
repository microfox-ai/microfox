import { z } from 'zod';

export const AclRuleSchema = z.object({
  kind: z.literal('calendar#aclRule'),
  etag: z.string(),
  id: z.string(),
  scope: z.object({
    type: z.enum(['default', 'user', 'group', 'domain']),
    value: z.string().optional(),
  }),
  role: z.enum(['none', 'freeBusyReader', 'reader', 'writer', 'owner']),
}).describe('Access Control List Rule');

export type AclRule = z.infer<typeof AclRuleSchema>;

export const CalendarListEntrySchema = z.object({
  kind: z.literal('calendar#calendarListEntry'),
  etag: z.string(),
  id: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  timeZone: z.string(),
  summaryOverride: z.string().optional(),
  colorId: z.string().optional(),
  backgroundColor: z.string().optional(),
  foregroundColor: z.string().optional(),
  hidden: z.boolean().optional(),
  selected: z.boolean().optional(),
  accessRole: z.enum(['none', 'freeBusyReader', 'reader', 'writer', 'owner']),
  defaultReminders: z.array(z.object({
    method: z.string(),
    minutes: z.number(),
  })).optional(),
  notificationSettings: z.object({
    notifications: z.array(z.object({
      type: z.string(),
      method: z.string(),
    })),
  }).optional(),
  primary: z.boolean().optional(),
  deleted: z.boolean().optional(),
}).describe('Calendar List Entry');

export type CalendarListEntry = z.infer<typeof CalendarListEntrySchema>;

export const CalendarSchema = z.object({
  kind: z.literal('calendar#calendar'),
  etag: z.string(),
  id: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  timeZone: z.string(),
}).describe('Calendar');

export type Calendar = z.infer<typeof CalendarSchema>;

export const ChannelSchema = z.object({
  kind: z.literal('api#channel'),
  id: z.string(),
  resourceId: z.string(),
  resourceUri: z.string(),
  token: z.string().optional(),
  expiration: z.number().optional(),
}).describe('Channel for watch requests');

export type Channel = z.infer<typeof ChannelSchema>;

export const ColorsSchema = z.object({
  kind: z.literal('calendar#colors'),
  updated: z.string(),
  calendar: z.record(z.object({
    background: z.string(),
    foreground: z.string(),
  })),
  event: z.record(z.object({
    background: z.string(),
    foreground: z.string(),
  })),
}).describe('Calendar colors');

export type Colors = z.infer<typeof ColorsSchema>;

export const EventSchema = z.object({
  kind: z.literal('calendar#event'),
  etag: z.string(),
  id: z.string(),
  status: z.enum(['confirmed', 'tentative', 'cancelled']),
  htmlLink: z.string(),
  created: z.string(),
  updated: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  colorId: z.string().optional(),
  creator: z.object({
    id: z.string().optional(),
    email: z.string().optional(),
    displayName: z.string().optional(),
    self: z.boolean().optional(),
  }),
  organizer: z.object({
    id: z.string().optional(),
    email: z.string().optional(),
    displayName: z.string().optional(),
    self: z.boolean().optional(),
  }),
  start: z.object({
    date: z.string().optional(),
    dateTime: z.string().optional(),
    timeZone: z.string().optional(),
  }),
  end: z.object({
    date: z.string().optional(),
    dateTime: z.string().optional(),
    timeZone: z.string().optional(),
  }),
  recurrence: z.array(z.string()).optional(),
  attendees: z.array(z.object({
    id: z.string().optional(),
    email: z.string().optional(),
    displayName: z.string().optional(),
    organizer: z.boolean().optional(),
    self: z.boolean().optional(),
    resource: z.boolean().optional(),
    optional: z.boolean().optional(),
    responseStatus: z.enum(['needsAction', 'declined', 'tentative', 'accepted']),
    comment: z.string().optional(),
    additionalGuests: z.number().optional(),
  })).optional(),
  reminders: z.object({
    useDefault: z.boolean(),
    overrides: z.array(z.object({
      method: z.string(),
      minutes: z.number(),
    })).optional(),
  }).optional(),
}).describe('Calendar event');

export type Event = z.infer<typeof EventSchema>;

export const FreeBusyRequestSchema = z.object({
  timeMin: z.string(),
  timeMax: z.string(),
  timeZone: z.string().optional(),
  groupExpansionMax: z.number().optional(),
  calendarExpansionMax: z.number().optional(),
  items: z.array(z.object({
    id: z.string(),
  })),
}).describe('Free/Busy request');

export type FreeBusyRequest = z.infer<typeof FreeBusyRequestSchema>;

export const FreeBusyResponseSchema = z.object({
  kind: z.literal('calendar#freeBusy'),
  timeMin: z.string(),
  timeMax: z.string(),
  calendars: z.record(z.object({
    errors: z.array(z.object({
      domain: z.string(),
      reason: z.string(),
    })).optional(),
    busy: z.array(z.object({
      start: z.string(),
      end: z.string(),
    })).optional(),
  })),
}).describe('Free/Busy response');

export type FreeBusyResponse = z.infer<typeof FreeBusyResponseSchema>;

export const SettingSchema = z.object({
  kind: z.literal('calendar#setting'),
  etag: z.string(),
  id: z.string(),
  value: z.string(),
}).describe('User setting');

export type Setting = z.infer<typeof SettingSchema>;
