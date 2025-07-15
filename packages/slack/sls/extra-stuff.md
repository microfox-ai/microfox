## Functionality

The API provides the following functionalities:

### 1. Add User To Channel (`/addUserToChannel`)

**Summary:** Invites a user to a Slack channel.

**Description:** The addUserToChannel function adds a specified user to a given Slack channel. It takes the channel ID and user ID as inputs and returns a response containing information about the channel and the success status of the operation. This function is useful for programmatically managing channel memberships in a Slack workspace.

### 2. Create Channel (`/createChannel`)

**Summary:** Create a new public or private channel in Slack.

**Description:** This function creates a new channel in a Slack workspace. It allows for the creation of either public or private channels, with the option to set the channel's privacy status. The function returns a detailed conversation object for the newly created channel, including various properties such as ID, name, privacy settings, and other relevant metadata.

### 3. Get Channel Conversation Info (`/getChannelConversationInfo`)

**Summary:** Retrieves detailed information about a specific Slack channel.

**Description:** The getChannelConversationInfo function fetches comprehensive data about a given Slack channel using its ID. It returns a conversation object containing various properties that describe the channel's characteristics, including its type (public, private, direct message, etc.), creation details, sharing status, and other relevant metadata.

### 4. Get File Info (`/getFileInfo`)

**Summary:** Get information about a specified file in Slack.

**Description:** The getFileInfo function retrieves detailed information about a file in Slack using its file ID. It returns a comprehensive file object containing various attributes such as file metadata, sharing details, and related channel information. This function is useful for obtaining in-depth details about a specific file within a Slack workspace.

### 5. Get User Info (`/getUserInfo`)

**Summary:** Retrieves detailed information about a specific Slack user.

**Description:** The getUserInfo function fetches comprehensive details about a Slack user using their unique user ID. It returns a rich user object containing various attributes including personal information, team association, permissions, and profile details. This function is essential for applications that need to access or display user-specific data within a Slack workspace.

### 6. List Channels (`/listChannels`)

**Summary:** Lists all public and private channels in a Slack workspace.

**Description:** The listChannels function retrieves a comprehensive list of all channels within a Slack workspace, including both public and private channels. It returns detailed information about each channel, such as its ID, name, privacy settings, creation details, and various flags indicating its status and type. This function is useful for obtaining an overview of the workspace's structure and available communication channels.

### 7. List Channel Users (`/listChannelUsers`)

**Summary:** Lists all users in a specific Slack channel.

**Description:** The listChannelUsers function retrieves an array of user IDs for all members in a specified Slack channel. It requires a valid channel ID as input and returns a list of user IDs. This function is useful for obtaining a comprehensive list of participants in a particular Slack channel.

### 8. List Active Users (`/listActiveUsers`)

**Summary:** Lists all active users in a Slack workspace.

**Description:** The listUsers function retrieves information about all active users in a Slack workspace. It returns an array of user objects, each containing detailed information about a workspace user including their profile, permissions, and various attributes. This function is useful for obtaining a comprehensive overview of the workspace's user base.

### 9. Message Channel (`/messageChannel`)

**Summary:** Send a message to a specific Slack channel.

**Description:** The messageChannel function allows sending a text message to a specified Slack channel using the Microfox Slack client. It takes the channel ID and the message text as input, and returns details about the sent message including its timestamp and channel information.

### 10. Message User (`/messageUser`)

**Summary:** Send a direct message to a user on Slack.

**Description:** This function allows sending a direct message to a specified user on Slack using their user ID. It provides a simple way to programmatically send messages to individual users. The function returns details about the sent message, including its timestamp and the channel where it was posted.

### 11. React Message (`/reactMessage`)

**Summary:** Add a reaction emoji to a Slack message.

**Description:** The reactMessage function allows adding an emoji reaction to a specific message in a Slack channel. It requires the channel ID, message timestamp, and the name of the emoji to be used as the reaction. This function is part of the MicrofoxSlackClient and interacts with Slack's API to perform the reaction action.

### 12. Remove User From Channel (`/removeUserFromChannel`)

**Summary:** Removes a user from a specified Slack channel.

**Description:** This function removes a user from a Slack channel using the provided channel ID and user ID. It interacts with the Slack API to perform the removal operation and returns a boolean indicating the success of the request.

### 13. Reply Message (`/replyMessage`)

**Summary:** Send a threaded reply to a message in a Slack channel.

**Description:** This function allows sending a reply to a specific message in a Slack channel, creating or continuing a thread. It takes the channel ID, the timestamp of the original message, and the reply text as inputs. The function returns details about the sent message, including its timestamp and channel information.

### 14. Search User (`/searchUserByEmail`)

**Summary:** Searches for a user in a Slack workspace by their email address.

**Description:** The searchUserByEmail function allows you to find a user in a Slack workspace using their email address. It returns a comprehensive user object containing detailed information about the user, including their profile and other attributes.

### 15. Send File (`/sendFile`)

**Summary:** Upload a file to a Slack channel.

**Description:** The sendFile function allows users to upload a file to a specified Slack channel. It takes the channel ID, file content, filename, and an optional title as input. The function returns details about the uploaded file, including its ID, type, size, and sharing information.

### 16. Set Reminder (`/setReminder`)

**Summary:** Sets a reminder for a user in Slack.

**Description:** The setReminder function allows setting a reminder for a specified Slack user. It takes the user ID, reminder text, and time as inputs, and returns the details of the created reminder. This function integrates with the Slack API to manage user reminders efficiently.
