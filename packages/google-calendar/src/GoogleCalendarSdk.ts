import { GoogleOAuthSdk } from '@microfox/google-oauth';
import { z } from 'zod';
import {
Calendar,
CalendarList,
Event,
EventAttendee,
EventDateTime,
EventReminder,
FreeBusyRequest,
FreeBusyResponse,
GoogleCalendarSdkOptions,
} from './types';

export class GoogleCalendarSdk {
private baseUrl = 'https://www.googleapis.com/calendar/v3';
private oauthSdk: GoogleOAuthSdk;
private accessToken: string;

constructor(options: GoogleCalendarSdkOptions) {
  this.oauthSdk = new GoogleOAuthSdk({
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    redirectUri: options.redirectUri,
    scopes: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
  });
  this.accessToken = options.accessToken as string;
}

private async request<T>(
  method: string,
  path: string,
  params: Record<string, string> = {},
  body?: unknown
): Promise<T> {
  const url = new URL(`${this.baseUrl}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

async validateAccessToken(): Promise<void> {
  try {
    const result = await this.oauthSdk.validateAccessToken(this.accessToken);
    if (!result.isValid) {
      throw new Error('Invalid access token');
    }
  } catch (error) {
    throw new Error(`Failed to validate access token: ${error}`);
  }
}

async refreshAccessToken(refreshToken: string): Promise<string> {
  try {
    const result = await this.oauthSdk.refreshAccessToken(refreshToken);
    this.accessToken = result.accessToken;
    return result.accessToken;
  } catch (error) {
    throw new Error(`Failed to refresh access token: ${error}`);
  }
}

// Calendar List methods
async getCalendarList(params: { minAccessRole?: string; showDeleted?: string; showHidden?: string; syncToken?: string } = {}): Promise<CalendarList> {
  return this.request<CalendarList>('GET', '/users/me/calendarList', params);
}

async getCalendar(calendarId: string): Promise<Calendar> {
  return this.request<Calendar>('GET', `/calendars/${calendarId}`);
}

// Events methods
async listEvents(calendarId: string, params: { timeMin?: string; timeMax?: string; maxResults?: string; orderBy?: string; q?: string; singleEvents?: string; } = {}): Promise<{ items: Event[] }> {
  return this.request<{ items: Event[] }>('GET', `/calendars/${calendarId}/events`, params);
}

async getEvent(calendarId: string, eventId: string): Promise<Event> {
  return this.request<Event>('GET', `/calendars/${calendarId}/events/${eventId}`);
}

async createEvent(calendarId: string, event: Omit<Event, 'id'>): Promise<Event> {
  return this.request<Event>('POST', `/calendars/${calendarId}/events`, {}, event);
}

async updateEvent(calendarId: string, eventId: string, event: Partial<Event>): Promise<Event> {
  return this.request<Event>('PUT', `/calendars/${calendarId}/events/${eventId}`, {}, event);
}

async deleteEvent(calendarId: string, eventId: string): Promise<void> {
  await this.request<void>('DELETE', `/calendars/${calendarId}/events/${eventId}`);
}

// Free/Busy methods
async getFreebusy(request: FreeBusyRequest): Promise<FreeBusyResponse> {
  return this.request<FreeBusyResponse>('POST', '/freeBusy', {}, request);
}

// Calendar methods
async createCalendar(calendar: Omit<Calendar, 'id'>): Promise<Calendar> {
  return this.request<Calendar>('POST', '/calendars', {}, calendar);
}

async updateCalendar(calendarId: string, calendar: Partial<Calendar>): Promise<Calendar> {
  return this.request<Calendar>('PUT', `/calendars/${calendarId}`, {}, calendar);
}

async deleteCalendar(calendarId: string): Promise<void> {
  await this.request<void>('DELETE', `/calendars/${calendarId}`);
}

// ACL methods
async getAcl(calendarId: string): Promise<{ items: any[] }> {
  return this.request<{ items: any[] }>('GET', `/calendars/${calendarId}/acl`);
}

async createAcl(calendarId: string, rule: any): Promise<any> {
  return this.request<any>('POST', `/calendars/${calendarId}/acl`, {}, rule);
}

async updateAcl(calendarId: string, ruleId: string, rule: any): Promise<any> {
  return this.request<any>('PUT', `/calendars/${calendarId}/acl/${ruleId}`, {}, rule);
}

async deleteAcl(calendarId: string, ruleId: string): Promise<void> {
  await this.request<void>('DELETE', `/calendars/${calendarId}/acl/${ruleId}`);
}

// Settings methods
async getSettings(): Promise<{ items: any[] }> {
  return this.request<{ items: any[] }>('GET', '/users/me/settings');
}

async getSetting(settingId: string): Promise<any> {
  return this.request<any>('GET', `/users/me/settings/${settingId}`);
}
}

export function createGoogleCalendarSDK(options: GoogleCalendarSdkOptions): GoogleCalendarSdk {
return new GoogleCalendarSdk(options);
}