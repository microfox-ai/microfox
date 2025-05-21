import { z } from 'zod';

export const RequestHeadersSchema = z
  .object({
    Accept: z
      .string()
      .default('application/json')
      .optional()
      .describe('The default supported media type is application/json'),
    'Accept-Encoding': z
      .string()
      .default('gzip')
      .optional()
      .describe('The supported compression type is gzip'),
    'Api-Version': z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .describe(
        'The Brave Web Search API version to use. This is denoted by the format YYYY-MM-DD',
      ),
    'Cache-Control': z
      .string()
      .optional()
      .describe(
        'Search will return cached web search results by default. To prevent caching, set the Cache-Control header to no-cache',
      ),
    'User-Agent': z
      .string()
      .optional()
      .describe(
        'The user agent of the client sending the request. Should follow commonly used browser agent strings',
      ),
    'X-Loc-Lat': z
      .number()
      .min(-90)
      .max(90)
      .optional()
      .describe(
        "The latitude of the client's geographical location in degrees",
      ),
    'X-Loc-Long': z
      .number()
      .min(-180)
      .max(180)
      .optional()
      .describe(
        "The longitude of the client's geographical location in degrees",
      ),
    'X-Loc-Timezone': z
      .string()
      .optional()
      .describe(
        "The IANA timezone for the client's device, e.g. America/New_York",
      ),
    'X-Loc-City': z
      .string()
      .optional()
      .describe('The generic name of the client city'),
    'X-Loc-State': z
      .string()
      .max(3)
      .optional()
      .describe(
        "The code representing the client's state/region, can be up to 3 characters long",
      ),
    'X-Loc-State-Name': z
      .string()
      .optional()
      .describe("The name of the client's state/region"),
    'X-Loc-Country': z
      .string()
      .length(2)
      .optional()
      .describe("The two letter code for the client's country"),
    'X-Loc-Postal-Code': z
      .string()
      .optional()
      .describe("The postal code of the client's location"),
    'X-Subscription-Token': z
      .string()
      .describe(
        'The secret token for the subscribed plan to authenticate the request',
      ),
  })
  .describe('Request headers for Brave Search API');

export const ResponseHeadersSchema = z
  .object({
    'X-RateLimit-Limit': z
      .string()
      .describe(
        'Rate limits associated with the requested plan. Example: "1, 15000" means 1 request per second and 15000 requests per month.',
      ),
    'X-RateLimit-Policy': z
      .string()
      .describe(
        'Rate limit policies currently associated with the requested plan. Example: "1;w=1, 15000;w=2592000" means a limit of 1 request over a 1 second window and 15000 requests over a month window.',
      ),
    'X-RateLimit-Remaining': z
      .string()
      .describe(
        'Remaining quota units associated with the expiring limits. Example: "1, 1000" indicates the API is able to be accessed once during the current second, and 1000 times over the current month.',
      ),
    'X-RateLimit-Reset': z
      .string()
      .describe(
        'The number of seconds until the quota associated with the expiring limits resets. Example: "1, 1419704" means a single request can be done again in a second and in 1419704 seconds the full monthly quota will be available again.',
      ),
  })
  .describe('Response headers from Brave Search API');

export const LocalSearchHeadersSchema = RequestHeadersSchema.omit({
  'X-Loc-Lat': true,
  'X-Loc-Long': true,
  'X-Loc-Timezone': true,
  'X-Loc-City': true,
  'X-Loc-State': true,
  'X-Loc-State-Name': true,
  'X-Loc-Country': true,
  'X-Loc-Postal-Code': true,
}).describe('Request headers for Local Search API');

export type RequestHeaders = z.infer<typeof RequestHeadersSchema>;
export type ResponseHeaders = z.infer<typeof ResponseHeadersSchema>;
export type LocalSearchHeaders = z.infer<typeof LocalSearchHeadersSchema>;
