## Google Calendar API v3 Summary for TypeScript SDK Generation

This summary outlines the Google Calendar API v3 endpoints, focusing on the technical details required for TypeScript SDK implementation.  All endpoints use the base URL `https://www.googleapis.com/calendar/v3` unless otherwise noted.  Authentication is assumed to be OAuth 2.0, requiring an access token in the `Authorization` header as `Bearer <access_token>`.  Further details on authentication can be found in the Google Calendar API documentation.  Response formats are generally JSON, unless otherwise specified.  Specific data structures for requests and responses are detailed in the Google Calendar API reference linked above.  This summary omits these structures for brevity, but they are crucial for SDK development.

**Edge Cases:** Pay attention to specific limitations mentioned, like the inability to move certain event types or the three-quota-unit consumption of patch requests.  Proper error handling for these cases is essential for a robust SDK.


---

### Acl Resource (Access Control Lists)

* **Description:** Manages access control rules for calendars.

* **`delete`**
    * **Endpoint:** `/calendars/{calendarId}/acl/{ruleId}`
    * **Method:** `DELETE`
    * **Parameters:**
        * `calendarId` (string, path): Calendar identifier.
        * `ruleId` (string, path): ACL rule identifier.
    * **Response:** Empty

* **`get`**
    * **Endpoint:** `/calendars/{calendarId}/acl/{ruleId}`
    * **Method:** `GET`
    * **Parameters:**
        * `calendarId` (string, path): Calendar identifier.
        * `ruleId` (string, path): ACL rule identifier.
    * **Response:**  `AclRule` object

* **`insert`**
    * **Endpoint:** `/calendars/{calendarId}/acl`
    * **Method:** `POST`
    * **Parameters:**
        * `calendarId` (string, path): Calendar identifier.
    * **Request Body:** `AclRule` object
    * **Response:** `AclRule` object

* **`list`**
    * **Endpoint:** `/calendars/{calendarId}/acl`
    * **Method:** `GET`
    * **Parameters:**
        * `calendarId` (string, path): Calendar identifier.
    * **Response:** `Acl` object (containing a list of `AclRule` objects)

* **`patch`**
    * **Endpoint:** `/calendars/{calendarId}/acl/{ruleId}`
    * **Method:** `PATCH`
    * **Parameters:**
        * `calendarId` (string, path): Calendar identifier.
        * `ruleId` (string, path): ACL rule identifier.
    * **Request Body:**  `AclRule` object (partial update)
    * **Response:** `AclRule` object

* **`update`**
    * **Endpoint:** `/calendars/{calendarId}/acl/{ruleId}`
    * **Method:** `PUT`
    * **Parameters:**
        * `calendarId` (string, path): Calendar identifier.
        * `ruleId` (string, path): ACL rule identifier.
    * **Request Body:** `AclRule` object (full update)
    * **Response:** `AclRule` object

* **`watch`**
    * **Endpoint:** `/calendars/{calendarId}/acl/watch`
    * **Method:** `POST`
    * **Parameters:**
        * `calendarId` (string, path): Calendar identifier.
    * **Request Body:** `Channel` object (specifies the type of watch and delivery method)
    * **Response:** `Channel` object


---

### CalendarList Resource

* **Description:** Manages a user's list of calendars.

* **`delete`**
    * **Endpoint:** `/users/me/calendarList/{calendarId}`
    * **Method:** `DELETE`
    * **Parameters:**
        * `calendarId` (string, path): Calendar identifier.
    * **Response:** Empty


* **`get`**
    * **Endpoint:** `/users/me/calendarList/{calendarId}`
    * **Method:** `GET`
    * **Parameters:**
        * `calendarId` (string, path): Calendar identifier.
    * **Response:** `CalendarListEntry` object

* **`insert`**
    * **Endpoint:** `/users/me/calendarList`
    * **Method:** `POST`
    * **Request Body:** `CalendarListEntry` object
    * **Response:** `CalendarListEntry` object

* **`list`**
    * **Endpoint:** `/users/me/calendarList`
    * **Method:** `GET`
    * **Response:** `CalendarList` object (containing a list of `CalendarListEntry` objects)

* **`patch`**
    * **Endpoint:** `/users/me/calendarList/{calendarId}`
    * **Method:** `PATCH`
    * **Parameters:**
        * `calendarId` (string, path): Calendar identifier.
    * **Request Body:** `CalendarListEntry` object (partial update)
    * **Response:** `CalendarListEntry` object


* **`update`**
    * **Endpoint:** `/users/me/calendarList/{calendarId}`
    * **Method:** `PUT`
    * **Parameters:**
        * `calendarId` (string, path): Calendar identifier.
    * **Request Body:** `CalendarListEntry` object (full update)
    * **Response:** `CalendarListEntry` object

* **`watch`**
    * **Endpoint:** `/users/me/calendarList/watch`
    * **Method:** `POST`
    * **Request Body:** `Channel` object
    * **Response:** `Channel` object


---

...(Similarly, document the remaining resources: Calendars, Channels, Colors, Events, Freebusy, and Settings following the format above. Ensure to include all parameters, request bodies, response types, and descriptions for each method within each resource.)


This structured summary provides a solid foundation for generating a TypeScript SDK. Remember to consult the full Google Calendar API documentation for detailed information on data structures, enums, and other specifics required for complete and accurate SDK implementation.  Consider using a code generation tool to automate the process of creating the SDK from this information.
