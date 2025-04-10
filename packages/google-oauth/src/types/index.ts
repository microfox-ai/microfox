/**
 * Configuration options for the Google OAuth SDK
 */
export interface GoogleAuthConfig {
  /**
   * The client ID obtained from the Google Developer Console
   */
  clientId: string;

  /**
   * The client secret obtained from the Google Developer Console
   */
  clientSecret: string;

  /**
   * The redirect URI registered in the Google Developer Console
   */
  redirectUri: string;

  /**
   * The scopes to request during authorization
   */
  scopes?: Array<GoogleScope | string>;

  /**
   * Optional state parameter for CSRF protection
   */
  state?: string;
}

/**
 * Available scopes for Google OAuth
 */
export enum GoogleScope {
  // OpenID Connect scopes
  OPENID = 'openid',
  EMAIL = 'email',
  PROFILE = 'profile',

  // Google Calendar API
  CALENDAR = 'https://www.googleapis.com/auth/calendar',
  CALENDAR_READONLY = 'https://www.googleapis.com/auth/calendar.readonly',
  CALENDAR_EVENTS = 'https://www.googleapis.com/auth/calendar.events',
  CALENDAR_EVENTS_READONLY = 'https://www.googleapis.com/auth/calendar.events.readonly',

  // Google Drive API
  DRIVE = 'https://www.googleapis.com/auth/drive',
  DRIVE_READONLY = 'https://www.googleapis.com/auth/drive.readonly',
  DRIVE_FILE = 'https://www.googleapis.com/auth/drive.file',
  DRIVE_METADATA = 'https://www.googleapis.com/auth/drive.metadata',
  DRIVE_APPDATA = 'https://www.googleapis.com/auth/drive.appdata',
  DRIVE_SCRIPTS = 'https://www.googleapis.com/auth/drive.scripts',

  // Gmail API
  GMAIL = 'https://www.googleapis.com/auth/gmail.readonly',
  GMAIL_SEND = 'https://www.googleapis.com/auth/gmail.send',
  GMAIL_COMPOSE = 'https://www.googleapis.com/auth/gmail.compose',
  GMAIL_MODIFY = 'https://www.googleapis.com/auth/gmail.modify',
  GMAIL_FULL = 'https://www.googleapis.com/auth/gmail.full',

  // Google Contacts API
  CONTACTS = 'https://www.googleapis.com/auth/contacts',
  CONTACTS_READONLY = 'https://www.googleapis.com/auth/contacts.readonly',
  CONTACTS_OTHER_READONLY = 'https://www.googleapis.com/auth/contacts.other.readonly',

  // YouTube API
  YOUTUBE = 'https://www.googleapis.com/auth/youtube',
  YOUTUBE_READONLY = 'https://www.googleapis.com/auth/youtube.readonly',
  YOUTUBE_UPLOAD = 'https://www.googleapis.com/auth/youtube.upload',
  YOUTUBE_PARTNER = 'https://www.googleapis.com/auth/youtubepartner',

  // Google Photos API
  PHOTOS = 'https://www.googleapis.com/auth/photoslibrary',
  PHOTOS_READONLY = 'https://www.googleapis.com/auth/photoslibrary.readonly',
  PHOTOS_SHARING = 'https://www.googleapis.com/auth/photoslibrary.sharing',

  // Google Fitness API
  FITNESS = 'https://www.googleapis.com/auth/fitness.activity.read',
  FITNESS_ACTIVITY_WRITE = 'https://www.googleapis.com/auth/fitness.activity.write',
  FITNESS_LOCATION_READ = 'https://www.googleapis.com/auth/fitness.location.read',
  FITNESS_LOCATION_WRITE = 'https://www.googleapis.com/auth/fitness.location.write',

  // Google Tasks API
  TASKS = 'https://www.googleapis.com/auth/tasks',
  TASKS_READONLY = 'https://www.googleapis.com/auth/tasks.readonly',

  // Google Sheets API
  SHEETS = 'https://www.googleapis.com/auth/spreadsheets',
  SHEETS_READONLY = 'https://www.googleapis.com/auth/spreadsheets.readonly',

  // Google Docs API
  DOCS = 'https://www.googleapis.com/auth/documents',
  DOCS_READONLY = 'https://www.googleapis.com/auth/documents.readonly',

  // Google Cloud Platform APIs
  CLOUD_PLATFORM = 'https://www.googleapis.com/auth/cloud-platform',
  CLOUD_PLATFORM_READONLY = 'https://www.googleapis.com/auth/cloud-platform.read-only',

  // Google Analytics API
  ANALYTICS = 'https://www.googleapis.com/auth/analytics',
  ANALYTICS_READONLY = 'https://www.googleapis.com/auth/analytics.readonly',

  // Google Classroom API
  CLASSROOM_COURSES = 'https://www.googleapis.com/auth/classroom.courses',
  CLASSROOM_COURSES_READONLY = 'https://www.googleapis.com/auth/classroom.courses.readonly',
  CLASSROOM_ROSTERS = 'https://www.googleapis.com/auth/classroom.rosters',
  CLASSROOM_PROFILE_EMAILS = 'https://www.googleapis.com/auth/classroom.profile.emails',

  // Google Meet API
  MEET = 'https://www.googleapis.com/auth/meetings.space.readonly',
  MEET_ROOMS = 'https://www.googleapis.com/auth/meetings.room.readonly',

  // Google People API
  PEOPLE = 'https://www.googleapis.com/auth/people',
  PEOPLE_READONLY = 'https://www.googleapis.com/auth/people.readonly',

  // Google Chat API
  CHAT = 'https://www.googleapis.com/auth/chat.messages',
  CHAT_READONLY = 'https://www.googleapis.com/auth/chat.messages.readonly',
}

/**
 * Token response from Google OAuth
 */
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  id_token?: string;
}

/**
 * Error response from Google OAuth
 */
export interface ErrorResponse {
  error: string;
  error_description?: string;
}
