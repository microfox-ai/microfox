import { GoogleOAuthSdk, GoogleScope } from '@microfox/google-oauth';
import { z } from 'zod';
import {
  AclRule,
  Acl,
  CalendarListEntry,
  CalendarList,
  Calendar,
  Channel,
  Colors,
  Event,
  Events,
  FreeBusyRequest,
  FreeBusyResponse,
  Setting,
  Settings,
  EventDateTime,
} from './types';

export class GoogleCalendarSdk {
  private oauthSdk: GoogleOAuthSdk;
  private baseUrl = 'https://www.googleapis.com/calendar/v3';

  constructor(
    private config: {
      clientId: string;
      clientSecret: string;
      redirectUri: string;
      accessToken: string;
      refreshToken: string;
      scopes?: string[];
    },
  ) {
    this.oauthSdk = new GoogleOAuthSdk({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri,
      scopes: config.scopes ?? [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.acls.readonly',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/calendar.events.readonly',
        'https://www.googleapis.com/auth/calendar.events.public.readonly',
        'https://www.googleapis.com/auth/calendar.events.owned',
        'https://www.googleapis.com/auth/calendar.events.owned.readonly',
        'https://www.googleapis.com/auth/calendar.freebusy',
        'https://www.googleapis.com/auth/calendar.events.freebusy',
        'https://www.googleapis.com/auth/calendar.settings.readonly',
        'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
      ],
    });
  }

  private async getAccessToken(): Promise<string> {
    if (this.config.accessToken) {
      const validationResult = await this.oauthSdk.validateAccessToken(
        this.config.accessToken,
      );
      if (validationResult.isValid) {
        return this.config.accessToken;
      }
    }

    if (this.config.refreshToken) {
      const { accessToken } = await this.oauthSdk.refreshAccessToken(
        this.config.refreshToken,
      );
      this.config.accessToken = accessToken;
      return accessToken;
    }

    throw new Error('No valid access token or refresh token available');
  }

  private async request<T>(
    method: string,
    path: string,
    params?: Record<string, string | string[] | undefined>,
    body?: unknown,
  ): Promise<T> {
    const accessToken = await this.getAccessToken();
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.error.message}`);
    }

    return response.json();
  }

  // ACL methods
  async deleteAclRule(calendarId: string, ruleId: string): Promise<void> {
    await this.request('DELETE', `/calendars/${calendarId}/acl/${ruleId}`);
  }

  async getAclRule(calendarId: string, ruleId: string): Promise<AclRule> {
    return this.request<AclRule>(
      'GET',
      `/calendars/${calendarId}/acl/${ruleId}`,
    );
  }

  async insertAclRule(
    calendarId: string,
    rule: AclRule,
    sendNotifications?: string,
  ): Promise<AclRule> {
    return this.request<AclRule>(
      'POST',
      `/calendars/${calendarId}/acl`,
      { sendNotifications },
      rule,
    );
  }

  async listAclRules(
    calendarId: string,
    params?: {
      maxResults?: string;
      pageToken?: string;
      showDeleted?: string;
      syncToken?: string;
    },
  ): Promise<Acl> {
    return this.request<Acl>('GET', `/calendars/${calendarId}/acl`, params);
  }

  async updateAclRule(
    calendarId: string,
    ruleId: string,
    rule: AclRule,
    sendNotifications?: string,
  ): Promise<AclRule> {
    return this.request<AclRule>(
      'PUT',
      `/calendars/${calendarId}/acl/${ruleId}`,
      { sendNotifications },
      rule,
    );
  }

  async watchAcl(calendarId: string, channel: Channel): Promise<Channel> {
    return this.request<Channel>(
      'POST',
      `/calendars/${calendarId}/acl/watch`,
      undefined,
      channel,
    );
  }

  // CalendarList methods
  async deleteCalendarFromList(calendarId: string): Promise<void> {
    await this.request('DELETE', `/users/me/calendarList/${calendarId}`);
  }

  async getCalendarFromList(calendarId: string): Promise<CalendarListEntry> {
    return this.request<CalendarListEntry>(
      'GET',
      `/users/me/calendarList/${calendarId}`,
    );
  }

  async insertCalendarToList(
    calendarListEntry: CalendarListEntry,
    colorRgbFormat?: string,
  ): Promise<CalendarListEntry> {
    return this.request<CalendarListEntry>(
      'POST',
      '/users/me/calendarList',
      { colorRgbFormat },
      calendarListEntry,
    );
  }

  async listCalendarList(params?: {
    maxResults?: string;
    minAccessRole?: string;
    pageToken?: string;
    showDeleted?: string;
    showHidden?: string;
    syncToken?: string;
  }): Promise<CalendarList> {
    return this.request<CalendarList>('GET', '/users/me/calendarList', params);
  }

  async updateCalendarInList(
    calendarId: string,
    calendarListEntry: CalendarListEntry,
    colorRgbFormat?: string,
  ): Promise<CalendarListEntry> {
    return this.request<CalendarListEntry>(
      'PUT',
      `/users/me/calendarList/${calendarId}`,
      { colorRgbFormat },
      calendarListEntry,
    );
  }

  async watchCalendarList(channel: Channel): Promise<Channel> {
    return this.request<Channel>(
      'POST',
      '/users/me/calendarList/watch',
      undefined,
      channel,
    );
  }

  // Calendars methods
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
    return this.request<Calendar>('POST', '/calendars', undefined, calendar);
  }

  async updateCalendar(
    calendarId: string,
    calendar: Calendar,
  ): Promise<Calendar> {
    return this.request<Calendar>(
      'PUT',
      `/calendars/${calendarId}`,
      undefined,
      calendar,
    );
  }

  // Channels methods
  async stopChannel(channel: Channel): Promise<void> {
    await this.request('POST', '/channels/stop', undefined, channel);
  }

  // Colors methods
  async getColors(): Promise<Colors> {
    return this.request<Colors>('GET', '/colors');
  }

  // Events methods
  async deleteEvent(
    calendarId: string,
    eventId: string,
    sendUpdates?: string,
  ): Promise<void> {
    await this.request('DELETE', `/calendars/${calendarId}/events/${eventId}`, {
      sendUpdates,
    });
  }

  async getEvent(
    calendarId: string,
    eventId: string,
    params?: {
      maxAttendees?: string;
      timeZone?: string;
    },
  ): Promise<Event> {
    return this.request<Event>(
      'GET',
      `/calendars/${calendarId}/events/${eventId}`,
      params,
    );
  }

  async importEvent(
    calendarId: string,
    event: Event,
    params?: {
      conferenceDataVersion?: string;
      supportsAttachments?: string;
    },
  ): Promise<Event> {
    return this.request<Event>(
      'POST',
      `/calendars/${calendarId}/events/import`,
      params,
      event,
    );
  }

  async insertEvent(
    calendarId: string,
    event: Event & {
      end: EventDateTime;
      start: EventDateTime;
    },
    params?: {
      conferenceDataVersion?: string;
      maxAttendees?: string;
      sendUpdates?: string;
      supportsAttachments?: string;
    },
  ): Promise<Event> {
    return this.request<Event>(
      'POST',
      `/calendars/${calendarId}/events`,
      params,
      event,
    );
  }

  async listEventInstances(
    calendarId: string,
    eventId: string,
    params?: {
      maxAttendees?: string;
      maxResults?: string;
      originalStart?: string;
      pageToken?: string;
      showDeleted?: string;
      timeMax?: string;
      timeMin?: string;
      timeZone?: string;
    },
  ): Promise<Events> {
    return this.request<Events>(
      'GET',
      `/calendars/${calendarId}/events/${eventId}/instances`,
      params,
    );
  }

  async listEvents(
    calendarId: string,
    params?: {
      iCalUID?: string;
      maxAttendees?: string;
      maxResults?: string;
      orderBy?: string;
      pageToken?: string;
      privateExtendedProperty?: string;
      q?: string;
      sharedExtendedProperty?: string;
      showDeleted?: string;
      showHiddenInvitations?: string;
      singleEvents?: string;
      syncToken?: string;
      timeMax?: string;
      timeMin?: string;
      timeZone?: string;
      updatedMin?: string;
    },
  ): Promise<Events> {
    return this.request<Events>(
      'GET',
      `/calendars/${calendarId}/events`,
      params,
    );
  }

  async moveEvent(
    calendarId: string,
    eventId: string,
    destination: string,
    sendUpdates?: string,
  ): Promise<Event> {
    return this.request<Event>(
      'POST',
      `/calendars/${calendarId}/events/${eventId}/move`,
      { destination, sendUpdates },
    );
  }

  async updateEvent(
    calendarId: string,
    eventId: string,
    event: Event,
    params?: {
      conferenceDataVersion?: string;
      maxAttendees?: string;
      sendUpdates?: string;
      supportsAttachments?: string;
    },
  ): Promise<Event> {
    return this.request<Event>(
      'PUT',
      `/calendars/${calendarId}/events/${eventId}`,
      params,
      event,
    );
  }

  async quickAddEvent(
    calendarId: string,
    text: string,
    sendUpdates?: string,
  ): Promise<Event> {
    return this.request<Event>(
      'POST',
      `/calendars/${calendarId}/events/quickAdd`,
      { text, sendUpdates },
    );
  }

  async watchEvents(
    calendarId: string,
    channel: Channel,
    params?: {
      eventTypes?: string[];
    },
  ): Promise<Channel> {
    return this.request<Channel>(
      'POST',
      `/calendars/${calendarId}/events/watch`,
      params,
      channel,
    );
  }

  // Freebusy methods
  async queryFreebusy(
    freeBusyRequest: FreeBusyRequest,
  ): Promise<FreeBusyResponse> {
    return this.request<FreeBusyResponse>(
      'POST',
      '/freeBusy',
      undefined,
      freeBusyRequest,
    );
  }

  // Settings methods
  async getSetting(setting: string): Promise<Setting> {
    return this.request<Setting>('GET', `/users/me/settings/${setting}`);
  }

  async listSettings(params?: {
    maxResults?: string;
    pageToken?: string;
    syncToken?: string;
  }): Promise<Settings> {
    return this.request<Settings>('GET', '/users/me/settings', params);
  }

  async watchSettings(channel: Channel): Promise<Channel> {
    return this.request<Channel>(
      'POST',
      '/users/me/settings/watch',
      undefined,
      channel,
    );
  }
}

export function createGoogleCalendarSDK(config: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  accessToken: string;
  refreshToken: string;
  scopes?: string[];
}): GoogleCalendarSdk {
  return new GoogleCalendarSdk(config);
}
