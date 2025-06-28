# LinkedInAuthenticated Class

The `LinkedInAuthenticated` class extends `LinkedInPublic` and provides methods for interacting with LinkedIn as an authenticated user. It handles login (both personal and Sales Navigator accounts), session management via cookies, and provides access to authenticated features like posts, jobs, users, sales, and search.

## Constructor

### `constructor(username?: string, password?: string, options?: { headless?: boolean; loginType?: 'personal' | 'salesNavigator' })`

Initializes a new instance of the `LinkedInAuthenticated` class.

-   **`username`** (optional): The user's LinkedIn email or username.
-   **`password`** (optional): The user's LinkedIn password.
-   **`options`** (optional):
    -   `headless`: Whether to run the browser in headless mode.
    -   `loginType`: The type of account to log in with, either `'personal'` (default) or `'salesNavigator'`.

## Properties

### `isLoggedIn: boolean`

A boolean flag that indicates whether the user is currently logged in.

### `loginType: 'personal' | 'salesNavigator' | null`

Specifies the type of login used for the current session.

### `posts: LinkedInPosts`

(Getter) Provides access to the `LinkedInPosts` API, allowing interaction with posts and the feed. The user must be logged in to access this.

### `jobs: LinkedInJobs`

(Getter) Provides access to the `LinkedInJobs` API for interacting with job listings. The user must be logged in.

### `users: LinkedInUsers`

(Getter) Provides access to the `LinkedInUsers` API for interacting with user profiles. The user must be logged in.

### `sales: LinkedInSales`

(Getter) Provides access to the `LinkedInSales` API for Sales Navigator features. The user must be logged in.

### `search: LinkedInSearch`

(Getter) Provides access to the `LinkedInSearch` API for performing searches. The user must be logged in.

## Methods

### `login(username?: string, password_string?: string, options?: { headless?: boolean; loginType?: 'personal' | 'salesNavigator' })`

Logs the user into LinkedIn using the provided credentials. If credentials are not provided, it attempts to use the ones from the constructor.

-   **`username`** (optional): The user's LinkedIn email or username.
-   **`password_string`** (optional): The user's LinkedIn password.
-   **`options`** (optional): Login options, including `headless` and `loginType`.

Throws an error if login fails (e.g., due to incorrect credentials or a captcha).

### `getCookies(): any`

Retrieves the cookies for the current authenticated session.

**Returns:** The session cookies.

### `setCookies(cookies: any)`

Sets the cookies for the session, allowing for session restoration without re-logging in. This will set `isLoggedIn` to `true`.

-   **`cookies`**: The cookie object to set for the page session.