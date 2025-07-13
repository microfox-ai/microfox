## Functionality

The API provides the following functionalities:

### 1. Chat.post Message (`/chat-postMessage`)

**Summary:** Send a message to a Slack channel.

**Description:** The chat.postMessage function allows you to send a message to a specified Slack channel, private group, or IM channel. It supports various customization options including text formatting, attachments, blocks, and metadata. This function is essential for programmatically interacting with Slack channels and users.

### 2. Chat.update (`/chat-update`)

**Summary:** Update an existing message in a Slack channel.

**Description:** The chat.update method allows you to modify an existing message in a Slack channel. This is particularly useful for updating the status of long-running tasks or providing progressive information to users. The method supports updating text, attachments, and blocks, offering flexibility in message formatting.

### 3. Conversations.history (`/conversations-history`)

**Summary:** Fetches a conversation's history of messages and events.

**Description:** This function retrieves the message and event history for a specified conversation (channel) in Slack. It allows for pagination and filtering of results based on timestamps. The function returns an array of message objects along with metadata about the conversation and response.

### 4. Conversations.join (`/conversations-join`)

**Summary:** Join an existing public channel in Slack.

**Description:** The conversations.join method allows a user or bot to join an existing public channel in a Slack workspace. This is essential for bots that need to be active in specific channels. The method requires the channel ID and returns detailed information about the joined channel.

### 5. Conversations.list (`/conversations-list`)

**Summary:** Lists conversations (channels, private channels, DMs, and MPDMs) in a Slack workspace.

**Description:** The conversations.list method retrieves a list of conversations in a Slack workspace. It supports pagination, filtering by conversation types, and exclusion of archived channels. The method returns detailed information about each conversation, including its properties and member count.

### 6. Reactions.add (`/reactions-add`)

**Summary:** Add a reaction (emoji) to a message in a Slack channel.

**Description:** This function adds a reaction emoji to a specific message in a Slack channel. It requires the channel ID, the timestamp of the message, and the name of the reaction (emoji) to be added. The function interacts with Slack's API to perform this action.

### 7. Users.info (`/users-info`)

**Summary:** Retrieves information about a specific user in Slack.

**Description:** The users.info method fetches detailed information about a user in a Slack workspace. It returns a comprehensive user object containing various attributes such as user ID, name, team information, profile details, and user permissions. This method is useful for obtaining up-to-date user data or verifying user information within a Slack application.

### 8. Users.list (`/users-list`)

**Summary:** Retrieve a list of all users in a Slack team.

**Description:** The users.list method returns a comprehensive list of all users in a Slack team, including their profiles and various attributes. It supports pagination and allows filtering by team ID when using an org token. This method is useful for user management, directory services, or syncing user data with external systems.

### 9. Users.lookup By Email (`/users-lookupByEmail`)

**Summary:** Look up a Slack user by their email address

**Description:** This function finds a user in a Slack workspace using their email address. It's particularly useful for integrations where you have a user's email but not their Slack ID. The function returns detailed information about the user if found, including their profile data and various account flags.

### 10. Views.open (`/views-open`)

**Summary:** Opens a modal view for a user in Slack.

**Description:** The views.open method opens a modal for a user in Slack. It requires a trigger_id obtained from a user interaction and a view payload defining the modal's content and behavior. This method allows for creating interactive surfaces for various purposes such as forms, alerts, and more.

### 11. Add User To Channel (`/addUserToChannel`)

**Summary:** Invites a user to a Slack channel.

**Description:** The addUserToChannel function adds a specified user to a given Slack channel. It takes the channel ID and user ID as inputs and returns a response containing information about the channel and the success status of the operation. This function is useful for programmatically managing channel memberships in a Slack workspace.

### 12. Create Channel (`/createChannel`)

**Summary:** Create a new public or private channel in Slack.

**Description:** This function creates a new channel in a Slack workspace. It allows for the creation of either public or private channels, with the option to set the channel's privacy status. The function returns a detailed conversation object for the newly created channel, including various properties such as ID, name, privacy settings, and other relevant metadata.

### 13. Get Channel Conversation Info (`/getChannelConversationInfo`)

**Summary:** Retrieves detailed information about a specific Slack channel.

**Description:** The getChannelConversationInfo function fetches comprehensive data about a given Slack channel using its ID. It returns a conversation object containing various properties that describe the channel's characteristics, including its type (public, private, direct message, etc.), creation details, sharing status, and other relevant metadata.

### 14. Get File Info (`/getFileInfo`)

**Summary:** Get information about a specified file in Slack.

**Description:** The getFileInfo function retrieves detailed information about a file in Slack using its file ID. It returns a comprehensive file object containing various attributes such as file metadata, sharing details, and related channel information. This function is useful for obtaining in-depth details about a specific file within a Slack workspace.

### 15. Get User Info (`/getUserInfo`)

**Summary:** Retrieves detailed information about a specific Slack user.

**Description:** The getUserInfo function fetches comprehensive details about a Slack user using their unique user ID. It returns a rich user object containing various attributes including personal information, team association, permissions, and profile details. This function is essential for applications that need to access or display user-specific data within a Slack workspace.

### 16. List Channels (`/listChannels`)

**Summary:** Lists all public and private channels in a Slack workspace.

**Description:** The listChannels function retrieves a comprehensive list of all channels within a Slack workspace, including both public and private channels. It returns detailed information about each channel, such as its ID, name, privacy settings, creation details, and various flags indicating its status and type. This function is useful for obtaining an overview of the workspace's structure and available communication channels.

### 17. List Channel Users (`/listChannelUsers`)

**Summary:** Lists all users in a specific Slack channel.

**Description:** The listChannelUsers function retrieves an array of user IDs for all members in a specified Slack channel. It requires a valid channel ID as input and returns a list of user IDs. This function is useful for obtaining a comprehensive list of participants in a particular Slack channel.

### 18. List Users (`/listUsers`)

**Summary:** Lists all users in a Slack workspace.

**Description:** The listUsers function retrieves information about all users in a Slack workspace. It returns an array of user objects, each containing detailed information about a workspace user including their profile, permissions, and various attributes. This function is useful for obtaining a comprehensive overview of the workspace's user base.

### 19. Message Channel (`/messageChannel`)

**Summary:** Send a message to a specific Slack channel.

**Description:** The messageChannel function allows sending a text message to a specified Slack channel using the Microfox Slack client. It takes the channel ID and the message text as input, and returns details about the sent message including its timestamp and channel information.

### 20. Message User (`/messageUser`)

**Summary:** Send a direct message to a user on Slack.

**Description:** This function allows sending a direct message to a specified user on Slack using their user ID. It provides a simple way to programmatically send messages to individual users. The function returns details about the sent message, including its timestamp and the channel where it was posted.

### 21. React Message (`/reactMessage`)

**Summary:** Add a reaction emoji to a Slack message.

**Description:** The reactMessage function allows adding an emoji reaction to a specific message in a Slack channel. It requires the channel ID, message timestamp, and the name of the emoji to be used as the reaction. This function is part of the MicrofoxSlackClient and interacts with Slack's API to perform the reaction action.

### 22. Remove User From Channel (`/removeUserFromChannel`)

**Summary:** Removes a user from a specified Slack channel.

**Description:** This function removes a user from a Slack channel using the provided channel ID and user ID. It interacts with the Slack API to perform the removal operation and returns a boolean indicating the success of the request.

### 23. Reply Message (`/replyMessage`)

**Summary:** Send a threaded reply to a message in a Slack channel.

**Description:** This function allows sending a reply to a specific message in a Slack channel, creating or continuing a thread. It takes the channel ID, the timestamp of the original message, and the reply text as inputs. The function returns details about the sent message, including its timestamp and channel information.

### 24. Search Channel (`/searchChannel`)

**Summary:** Searches for a Slack channel by its name.

**Description:** The searchChannel function finds a Slack channel by its name, performing a case-insensitive search. It returns a detailed conversation object if the channel is found, or undefined if no matching channel is located. This function is useful for retrieving channel information without knowing the exact channel ID.

### 25. Search User (`/searchUser`)

**Summary:** Searches for a user in a Slack workspace by their email address.

**Description:** The searchUser function allows you to find a user in a Slack workspace using their email address. It returns a comprehensive user object containing detailed information about the user, including their profile data, permissions, and various attributes related to their account and status within the workspace.

### 26. Send File (`/sendFile`)

**Summary:** Upload a file to a Slack channel.

**Description:** The sendFile function allows users to upload a file to a specified Slack channel. It takes the channel ID, file content, filename, and an optional title as input. The function returns details about the uploaded file, including its ID, type, size, and sharing information.

### 27. Set Reminder (`/setReminder`)

**Summary:** Sets a reminder for a user in Slack.

**Description:** The setReminder function allows setting a reminder for a specified Slack user. It takes the user ID, reminder text, and time as inputs, and returns the details of the created reminder. This function integrates with the Slack API to manage user reminders efficiently.
