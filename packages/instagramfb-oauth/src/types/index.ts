export interface InstagramfbAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
  scopes?: string[];
  state?: string;
}

export enum InstagramfbScope {
  INSTAGRAM_BASIC = 'instagram_basic',
  INSTAGRAM_CONTENT_PUBLISH = 'instagram_content_publish',
  INSTAGRAM_MANAGE_COMMENTS = 'instagram_manage_comments',
  INSTAGRAM_MANAGE_INSIGHTS = 'instagram_manage_insights',
  PAGES_SHOW_LIST = 'pages_show_list',
  PAGES_READ_ENGAGEMENT = 'pages_read_engagement',
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  long_lived_token: string;
  data_access_expiration_time: number;
}

export interface ErrorResponse {
  error: string;
  error_description?: string;
}

export interface InstagramAccountResponse {
  pageId: string;
  pageName: string;
  pageAccessToken: string;
  instagramAccountId: string;
}
