import { createSlackSDK } from '@microfox/slack-web-tiny';

// Get channel ID from environment variables
const CHANNEL_ID = process.env.SLACK_CHANNEL_ID ?? '';

// Initialize the SDK with correct API base URL
const createSlackClient = (token: string) => {
  return createSlackSDK({
    botToken: token,
    authType: 'header'
  });
};

// Example of sending different types of messages
async function slackSDKExamples() {
  const token = process.env.SLACK_BOT_TOKEN ?? '';
  if (!token) {
    throw new Error('SLACK_BOT_TOKEN is required for production');
  }

  const channelId = process.env.SLACK_CHANNEL_ID;
  if (!channelId) {
    console.log(
      'Warning: SLACK_CHANNEL_ID is not set in environment variables, using default',
    );
  }

  console.log('Using channel ID:', CHANNEL_ID);
  console.log('Token:', token);
  const slackSDK = createSlackClient(token);

  try {
    // Basic message
    const basicMessage = await slackSDK.sendMessage({
      channel: CHANNEL_ID,
      text: 'Hello from Slack SDK! 👋',
      mrkdwn: true,
    });
    console.log('Basic message sent:', basicMessage);

    // Update the basic message after 2 seconds
    if (basicMessage && basicMessage.ts) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const updatedMessage = await slackSDK.updateMessage({
        channel: CHANNEL_ID,
        ts: basicMessage.ts,
        text: 'Updated: Hello from Slack SDK! 👋 ✨',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Updated Message*\nThis message was updated using the Slack SDK!',
            },
          },
        ],
      });
      console.log('Message updated:', updatedMessage);
    } else {
      console.log('Could not update message: message timestamp not available');
    }

    // Message with Block Kit
    const blockMessage = await slackSDK.sendMessage({
      channel: CHANNEL_ID,
      text: 'Check out this Block Kit message!',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Welcome to Block Kit*\nThis is a demo of various Block Kit components.',
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Click the button below to learn more:',
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Learn More',
              emoji: true,
            },
            value: 'learn_more',
            action_id: 'button_click',
          },
        },
      ],
    });
    console.log('Block Kit message sent:', blockMessage);

    // Threading example
    const parentMessage = await slackSDK.sendMessage({
      channel: CHANNEL_ID,
      text: '🔍 Starting investigation of issue #123',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '🔍 *Issue Investigation: #123*',
          },
        },
      ],
    });

    // Reply in thread
    if (parentMessage && parentMessage.ts) {
      await slackSDK.sendMessage({
        channel: CHANNEL_ID,
        thread_ts: parentMessage.ts,
        text: '✅ System diagnostics completed',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*System Diagnostics Results:*\n• CPU usage: Normal\n• Memory usage: High\n• Disk I/O: Normal',
            },
          },
        ],
      });
    } else {
      console.log(
        'Could not reply in thread: parent message timestamp not available',
      );
    }

    // File upload example
    const fileUpload = await slackSDK.uploadFile({
      channels: CHANNEL_ID,
      content: 'This is a test file content',
      filename: 'test.txt',
      title: 'Test File',
      initial_comment: "Here's your test file!",
    });
    console.log('File uploaded:', fileUpload);
  } catch (error) {
    console.error('Error in Slack SDK examples:', error);
  }
}

// Example with environment-specific configuration
const createProductionClient = () => {
  if (!process.env.SLACK_BOT_TOKEN) {
    throw new Error('SLACK_BOT_TOKEN is required for production');
  }
  return createSlackClient(process.env.SLACK_BOT_TOKEN);
};

// Example with parallel message sending
async function multiMessageExample() {
  const sdk = createSlackClient(process.env.SLACK_BOT_TOKEN ?? '');

  const messages = await Promise.all([
    sdk.sendMessage({
      channel: CHANNEL_ID,
      text: 'First parallel message',
    }),
    sdk.sendMessage({
      channel: CHANNEL_ID,
      text: 'Second parallel message',
    }),
    sdk.sendMessage({
      channel: CHANNEL_ID,
      text: 'Third parallel message',
    }),
  ]);

  return messages;
}

export {
  slackSDKExamples,
  createSlackClient,
  createProductionClient,
  multiMessageExample,
  CHANNEL_ID,
};
