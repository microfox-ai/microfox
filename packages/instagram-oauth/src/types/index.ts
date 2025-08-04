export interface InstagramAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
  scopes?: InstagramScope[];
  state?: string;
}

export enum InstagramScope {
  INSTAGRAM_BUSINESS_BASIC = 'instagram_business_basic',
  INSTAGRAM_BUSINESS_CONTENT_PUBLISH = 'instagram_business_content_publish',
  INSTAGRAM_BUSINESS_MANAGE_MESSAGES = 'instagram_business_manage_messages',
  INSTAGRAM_BUSINESS_MANAGE_COMMENTS = 'instagram_business_manage_comments',
}

export interface TokenResponse {
  access_token: string;
  user_id: string;
  permissions: string;
}

export interface ErrorResponse {
  error_type: string;
  code: number;
  error_message: string;
}
