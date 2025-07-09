# Microfox Slack Web Tiny API

This agent provides a simplified, tiny client for interacting with the Slack Web API. It's a single entry-point API for all Microfox Slack Web Tiny functions, exposed via a wrapper Lambda. This allows you to perform common Slack operations like sending messages, updating existing messages, and uploading files to Slack channels with ease.

## Functionality

The API provides the following functionalities:

### 1. Send Message (`/sendMessage`)

**Summary:** Sends a message to a specified Slack channel.

**Description:** This function posts a message to a Slack channel. It's versatile, supporting simple text, rich formatting with Block Kit, threaded replies, and interactive components. It also supports changing the bot icon or name as it appears as needed. On success, it returns details of the sent message.


### 2. Update Message (`/updateMessage`)

**Summary:** Updates an existing message in a Slack channel.

**Description:** This function allows you to modify a previously sent message by its timestamp. You can change its text, blocks, or attachments. The response contains information about the updated message.


### 3. Upload File (`/uploadFile`)

**Summary:** Uploads a file to Slack channels or conversations.

**Description:** This function facilitates sharing files in Slack. You can specify the file content, name, type, and an initial comment. It returns details about the uploaded file.
