export const redditSDKConfigSchema = z
  .object({
    clientId: z.string().describe('The client ID for your Reddit application.'),
    clientSecret: z
      .string()
      .describe('The client secret for your Reddit application.'),
    scopes: z
      .array(z.string())
      .describe('An array of scopes your application is requesting.'),
    accessToken: z
      .string()
      .describe('The access token for making authenticated requests.'),
    refreshToken: z
      .string()
      .optional()
      .describe('The refresh token for obtaining new access tokens.'),
  })
  .describe('Schema for the Reddit SDK configuration.');