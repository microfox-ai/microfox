import { z } from 'zod';
import {
  RequestHeadersSchema,
  LocalSearchHeadersSchema,
} from '../schemas/request-headers';

export type RequestHeaders = z.infer<typeof RequestHeadersSchema>;
export type LocalSearchHeaders = z.infer<typeof LocalSearchHeadersSchema>;

export const DEFAULT_USER_AGENTS = {
  android:
    'Mozilla/5.0 (Linux; Android 13; Pixel 7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36',
  ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
  macos:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/',
  windows:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/',
} as const;

export type Platform = keyof typeof DEFAULT_USER_AGENTS;

export interface LocationHeaders {
  latitude?: number;
  longitude?: number;
  timezone?: string;
  city?: string;
  state?: string;
  stateName?: string;
  country?: string;
  postalCode?: string;
}

export function createHeaders(options: {
  apiKey: string;
  platform?: Platform;
  location?: LocationHeaders;
  apiVersion?: string;
  cacheControl?: string;
}): RequestHeaders {
  const headers: RequestHeaders = {
    Accept: 'application/json',
    'Accept-Encoding': 'gzip',
    'X-Subscription-Token': options.apiKey,
  };

  if (options.platform) {
    headers['User-Agent'] = DEFAULT_USER_AGENTS[options.platform];
  }

  if (options.apiVersion) {
    headers['Api-Version'] = options.apiVersion;
  }

  if (options.cacheControl) {
    headers['Cache-Control'] = options.cacheControl;
  }

  if (options.location) {
    const {
      latitude,
      longitude,
      timezone,
      city,
      state,
      stateName,
      country,
      postalCode,
    } = options.location;

    if (latitude !== undefined) headers['X-Loc-Lat'] = latitude;
    if (longitude !== undefined) headers['X-Loc-Long'] = longitude;
    if (timezone) headers['X-Loc-Timezone'] = timezone;
    if (city) headers['X-Loc-City'] = city;
    if (state) headers['X-Loc-State'] = state;
    if (stateName) headers['X-Loc-State-Name'] = stateName;
    if (country) headers['X-Loc-Country'] = country;
    if (postalCode) headers['X-Loc-Postal-Code'] = postalCode;
  }

  return headers;
}

export function createLocalSearchHeaders(options: {
  apiKey: string;
  platform?: Platform;
  apiVersion?: string;
  cacheControl?: string;
}): LocalSearchHeaders {
  const headers: LocalSearchHeaders = {
    Accept: 'application/json',
    'Accept-Encoding': 'gzip',
    'X-Subscription-Token': options.apiKey,
  };

  if (options.platform) {
    headers['User-Agent'] = DEFAULT_USER_AGENTS[options.platform];
  }

  if (options.apiVersion) {
    headers['Api-Version'] = options.apiVersion;
  }

  if (options.cacheControl) {
    headers['Cache-Control'] = options.cacheControl;
  }

  return headers;
}
