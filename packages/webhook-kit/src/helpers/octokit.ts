import { type WebhookEvent } from '@microfox/webhook-core';
import {
  type IssueCommentCreatedEvent,
  type IssuesOpenedEvent,
  type PullRequestOpenedEvent,
  type PullRequestReviewCommentCreatedEvent,
} from '@octokit/webhooks-types';
import { ConnectorConfig } from '../schemas';

const messageEvents = [
  'issue_comment.created',
  'pull_request_review_comment.created',
];
const openedEvents = ['issues.opened', 'pull_request.opened'];

export const githubMainEventsToTrack: string[] = [
  ...messageEvents,
  ...openedEvents,
];

// This should be coming from a config
const GITHUB_BOT_NAME = 'microfox-ai';

export const isBotMentioned = (
  payload: any,
  connectorConfig: ConnectorConfig,
): boolean => {
  const body =
    payload.comment?.body ?? payload.issue?.body ?? payload.pull_request?.body;
  if (!body) {
    return false;
  }
  return (
    body.includes(`@${GITHUB_BOT_NAME}`) ||
    body.includes(`@${connectorConfig.appMentionId}`)
  );
};

const cleanText = (text: string, connectorConfig: ConnectorConfig): string => {
  return text
    .replace(`@${GITHUB_BOT_NAME}`, `@${connectorConfig.appName}`)
    .trim();
};

export const convertGitHubPayloadToWebhookEvent = (
  rawPayload: any,
  eventType: string,
  connectorConfig: ConnectorConfig,
): WebhookEvent | null => {
  const is_bot_mentioned = isBotMentioned(rawPayload, connectorConfig);

  const getBaseEvent = (payload: any) => ({
    provider: 'github' as const,
    bot: {
      id: payload.installation?.id.toString(),
      app_id: payload.installation?.id.toString(),
      is_bot_mentioned,
      bot_name: GITHUB_BOT_NAME,
    },
    provider_info: {
      team: {
        id: payload.repository?.owner.login,
      },
      org: {
        id: payload.organization?.login,
      },
    },
    sender: {
      id: payload.sender?.id.toString(),
      name: payload.sender?.login,
      avatar_url: payload.sender?.avatar_url,
    },
    original_payload: payload,
  });

  switch (eventType) {
    case 'issue_comment.created': {
      const payload = rawPayload as IssueCommentCreatedEvent;
      const text = payload.comment.body;

      return {
        ...getBaseEvent(payload),
        event_id: `github-issue_comment-${payload.comment.id}`,
        base_type: 'message',
        event_type: eventType,
        timestamp: new Date(payload.comment.created_at).getTime() / 1000,
        text,
        clean_text: cleanText(text, connectorConfig),
        blocks: [],
        channel: {
          id: payload.issue.number.toString(),
          type: 'issue',
        },
        event: {
          id: payload.comment.id.toString(),
          type: 'issue_comment',
          subtype: payload.action,
          text,
          ts: String(new Date(payload.comment.created_at).getTime() / 1000),
          parent_ts: payload.issue.node_id,
        },
      };
    }

    case 'pull_request_review_comment.created': {
      const payload = rawPayload as PullRequestReviewCommentCreatedEvent;
      const text = payload.comment.body;

      return {
        ...getBaseEvent(payload),
        event_id: `github-pr_comment-${payload.comment.id}`,
        base_type: 'message',
        event_type: eventType,
        timestamp: new Date(payload.comment.created_at).getTime() / 1000,
        text,
        clean_text: cleanText(text, connectorConfig),
        blocks: [],
        channel: {
          id: payload.pull_request.number.toString(),
          type: 'pull_request',
        },
        event: {
          id: payload.comment.id.toString(),
          type: 'pull_request_review_comment',
          subtype: payload.action,
          text,
          ts: String(new Date(payload.comment.created_at).getTime() / 1000),
          parent_ts: payload.pull_request.node_id,
        },
      };
    }

    case 'issues.opened': {
      const payload = rawPayload as IssuesOpenedEvent;
      const text = payload.issue.body ?? '';

      return {
        ...getBaseEvent(payload),
        event_id: `github-issue-${payload.issue.id}`,
        base_type: 'opened',
        event_type: eventType,
        timestamp: new Date(payload.issue.created_at).getTime() / 1000,
        text,
        clean_text: cleanText(text, connectorConfig),
        blocks: [],
        channel: {
          id: payload.issue.number.toString(),
          type: 'issue',
        },
        event: {
          id: payload.issue.id.toString(),
          type: 'issues',
          subtype: payload.action,
          text,
          ts: String(new Date(payload.issue.created_at).getTime() / 1000),
        },
      };
    }

    case 'pull_request.opened': {
      const payload = rawPayload as PullRequestOpenedEvent;
      const text = payload.pull_request.body ?? '';

      return {
        ...getBaseEvent(payload),
        event_id: `github-pr-${payload.pull_request.id}`,
        base_type: 'opened',
        event_type: eventType,
        timestamp: new Date(payload.pull_request.created_at).getTime() / 1000,
        text,
        clean_text: cleanText(text, connectorConfig),
        blocks: [],
        channel: {
          id: payload.pull_request.number.toString(),
          type: 'pull_request',
        },
        event: {
          id: payload.pull_request.id.toString(),
          type: 'pull_request',
          subtype: payload.action,
          text,
          ts: String(
            new Date(payload.pull_request.created_at).getTime() / 1000,
          ),
        },
      };
    }

    default:
      return null;
  }
};
