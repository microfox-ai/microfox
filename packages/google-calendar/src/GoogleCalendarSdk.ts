import { GoogleOAuthSdk, GoogleScope } from '@microfox/google-oauth';
import { z } from 'zod';
import {
  AclRule,
  CalendarListEntry,
  Calendar,
  Channel,
  Colors,
  Event,
  FreeBusyRequest,
  FreeBusyResponse,
  Setting,
} from './types';

export class GoogleCalendarSDK {
  private oauthSdk: GoogleOAuthSdk;
  private baseUrl = 'https://www.googleapis.com/calendar/v3';

  constructor(
    private config: {
      clientId: string;
      clientSecret: string;
      redirectUri: string;
      accessToken?: string;
      refreshToken?: string;
    }
  ) {
    this.oauthSdk = new GoogleOAuthSdk({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri,
      scopes: [
        GoogleScope.CALENDAR,
        GoogleScope.CALENDAR_READONLY,
        GoogleScope.CALENDAR_EVENTS,
        GoogleScope.CALENDAR_EVENTS_READONLY,
      ],
    });
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    params?: Record<string, string>
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.config.accessToken}`,
    };

    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async validateAccessToken(): Promise<void> {
    if (!this.config.accessToken) {
      throw new Error('Access token is not set');
    }

    try {
      const result = await this.oauthSdk.validateAccessToken(this.config.accessToken);
      if (!result.isValid) {
        throw new Error('Invalid access token');
      }
    } catch (error) {
      throw new Error(`Failed to validate access token: ${error}`);
    }
  }

  async refreshAccessToken(): Promise<void> {
    if (!this.config.refreshToken) {
      throw new Error('Refresh token is not set');
    }

    try {
      const result = await this.oauthSdk.refreshAccessToken(this.config.refreshToken);
      this.config.accessToken = result.accessToken;
    } catch (error) {
      throw new Error(`Failed to refresh access token: ${error}`);
    }
  }

  // ACL Resource

  async deleteAclRule(calendarId: string, ruleId: string): Promise<void> {
    await this.request('DELETE', `/calendars/${calendarId}/acl/${ruleId}`);
  }

  async getAclRule(calendarId: string, ruleId: string): Promise<AclRule> {
    return this.request<AclRule>('GET', `/calendars/${calendarId}/acl/${ruleId}`);
  }

  async insertAclRule(calendarId: string, rule: AclRule): Promise<AclRule> {
    return this.request<AclRule>('POST', `/calendars/${calendarId}/acl`, rule);
  }

  async listAclRules(calendarId: string): Promise<{ items: AclRule[] }> {
    return this.request<{ items: AclRule[] }>('GET', `/calendars/${calendarId}/acl`);
  }

  async updateAclRule(calendarId: string, ruleId: string, rule: AclRule): Promise<AclRule> {
    return this.request<AclRule>('PUT', `/calendars/${calendarId}/acl/${ruleId}`, rule);
  }

  async watchAcl(calendarId: string, channel: Channel): Promise<Channel> {
    return this.request<Channel>('POST', `/calendars/${calendarId}/acl/watch`, channel);
  }

  // CalendarList Resource

  async deleteCalendarFromList(calendarId: string): Promise<void> {
    await this.request('DELETE', `/users/me/calendarList/${calendarId}`);
  }

  async getCalendarFromList(calendarId: string): Promise<CalendarListEntry> {
    return this.request<CalendarListEntry>('GET', `/users/me/calendarList/${calendarId}`);
  }

  async insertCalendarToList(calendarListEntry: CalendarListEntry): Promise<CalendarListEntry> {
    return this.request<CalendarListEntry>('POST', '/users/me/calendarList', calendarListEntry);
  }

  async listCalendarList(): Promise<{ items: CalendarListEntry[] }> {
    return this.request<{ items: CalendarListEntry[] }>('GET', '/users/me/calendarList');
  }

  async updateCalendarInList(calendarId: string, calendarListEntry: CalendarListEntry): Promise<CalendarListEntry> {
    return this.request<CalendarListEntry>('PUT', `/users/me/calendarList/${calendarId}`, calendarListEntry);
  }

  async watchCalendarList(channel: Channel): Promise<Channel> {
    return this.request<Channel>('POST', '/users/me/calendarList/watch', channel);
  }

  // Calendars Resource

  async clearCalendar(calendarId: string): Promise<void> {
    await this.request('POST', `/calendars/${calendarId}/clear`);
  }

  async deleteCalendar(calendarId: string): Promise<void> {
    await this.request('DELETE', `/calendars/${calendarId}`);
  }

  async getCalendar(calendarId: string): Promise<Calendar> {
    return this.request<Calendar>('GET', `/calendars/${calendarId}`);
  }

  async insertCalendar(calendar: Calendar): Promise<Calendar> {
    return this.request<Calendar>('POST', '/calendars', calendar);
  }

  async updateCalendar(calendarId: string, calendar: Calendar): Promise<Calendar> {
    return this.request<Calendar>('PUT', `/calendars/${calendarId}`, calendar);
  }

  // Channels Resource

  async stopChannel(channel: Channel): Promise<void> {
    await this.request('POST', '/channels/stop', channel);
  }

  // Colors Resource

  async getColors(): Promise<Colors> {
    return this.request<Colors>('GET', '/colors');
  }

  // Events Resource

  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    await this.request('DELETE', `/calendars/${calendarId}/events/${eventId}`);
  }

  async getEvent(calendarId: string, eventId: string): Promise<Event> {
    return this.request<Event>('GET', `/calendars/${calendarId}/events/${eventId}`);
  }

  async insertEvent(calendarId: string, event: Event): Promise<Event> {
    return this.request<Event>('POST', `/calendars/${calendarId}/events`, event);
  }

  async listEvents(calendarId: string): Promise<{ items: Event[] }> {
    return this.request<{ items: Event[] }>('GET', `/calendars/${calendarId}/events`);
  }

  async moveEvent(calendarId: string, eventId: string, destination: string): Promise<Event> {
    return this.request<Event>('POST', `/calendars/${calendarId}/events/${eventId}/move`, { destination });
  }

  async updateEvent(calendarId: string, eventId: string, event: Event): Promise<Event> {
    return this.request<Event>('PUT', `/calendars/${calendarId}/events/${eventId}`, event);
  }

  async watchEvents(calendarId: string, channel: Channel): Promise<Channel> {
    return this.request<Channel>('POST', `/calendars/${calendarId}/events/watch`, channel);
  }

  // Freebusy Resource

  async queryFreebusy(query: FreeBusyRequest): Promise<FreeBusyResponse> {
    return this.request<FreeBusyResponse>('POST', '/freeBusy', query);
  }

  // Settings Resource

  async getSetting(settingId: string): Promise<Setting> {
    return this.request<Setting>('GET', `/users/me/settings/${settingId}`);
  }

  async listSettings(): Promise<{ items: Setting[] }> {
    return this.request<{ items: Setting[] }>('GET', '/users/me/settings');
  }

  async watchSettings(channel: Channel): Promise<Channel> {
    return this.request<Channel>('POST', '/users/me/settings/watch', channel);
  }
}

export function createGoogleCalendarSDK(config: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  accessToken?: string;
  refreshToken?: string;
}): GoogleCalendarSDK {
  return new GoogleCalendarSDK(config);
}
