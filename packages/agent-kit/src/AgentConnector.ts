import { SlackWebhookSdk } from '@microfox/webhook-slack';

// Thoughts
// A top agentic connector
// - knows how to connect to multiple platforms
// - knows where to contact the user based on the requirement.
// - knows how to respond to a query from any platform.

// - indpendent webhook packages are used to subscribe to events, and add events to job queue.
// - agentic connector is used to get & parse the job in job queue to centralized schema and attach helpers to the job.
// - the agent processes the job, and uses the helper to respond/notify the user.
// - helpers = markMessageAsRead, modifyMessage, replyToMessage, etc..
//

export class AgentConnector {
  async askForApproval({
    message,
    event,
    source,
  }: {
    message: {
      text: string;
    };
    event: {
      type: string;
    };
    source: {
      type: string;
      platform: string;
    };
  }): Promise<boolean> {
    return true;
  }
}
