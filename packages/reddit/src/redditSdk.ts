export class RedditSDK {
  private oauth: ReturnType<typeof createRedditOAuth>;
  private accessToken: string;
  private refreshToken?: string;
  private baseUrl = 'https://oauth.reddit.com';
  private isRefreshing = false; // Flag to prevent infinite recursion

  constructor(config: RedditSDKConfig) {
    const validatedConfig = redditSDKConfigSchema.parse(config);
    this.oauth = createRedditOAuth({
      clientId: validatedConfig.clientId,
      clientSecret: validatedConfig.clientSecret,
      scopes: validatedConfig.scopes,
    });
    this.accessToken = validatedConfig.accessToken;
    this.refreshToken = validatedConfig.refreshToken ?? undefined;
  }