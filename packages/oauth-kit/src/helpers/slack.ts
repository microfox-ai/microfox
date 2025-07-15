import { Identity } from '../schemas';
import { slackOAuthResponseSchema } from '../../../slack-oauth/src/schemas';
import { z } from 'zod';

const slackUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  real_name: z.string().optional(),
  profile: z.object({
    email: z.string().optional(),
    image_192: z.string().url().optional(),
    image_original: z.string().url().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
  }),
});

const slackTeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.object({
    image_132: z.string().url(),
  }),
});

type SlackUser = z.infer<typeof slackUserSchema>;
type SlackTeam = z.infer<typeof slackTeamSchema>;

const slackUsersInfoResponseSchema = z.object({
  ok: z.boolean(),
  user: slackUserSchema.optional(),
  error: z.string().optional(),
});

const slackTeamInfoResponseSchema = z.object({
  ok: z.boolean(),
  team: slackTeamSchema.optional(),
  error: z.string().optional(),
});

async function getSlackTeamInfo(
  token: string,
  teamId: string,
): Promise<SlackTeam> {
  const response = await fetch(
    `https://slack.com/api/team.info?team=${teamId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch team info from Slack: ${response.statusText}`,
    );
  }

  const data = await response.json();
  console.log('data for team info', data);
  const parsedResponse = slackTeamInfoResponseSchema.parse(data);

  if (!parsedResponse.ok) {
    throw new Error(
      `Slack API error while fetching team info: ${parsedResponse.error}`,
    );
  }

  if (!parsedResponse.team) {
    throw new Error('Slack API error: team info not found in response');
  }

  return parsedResponse.team;
}

async function getSlackUserInfo(
  token: string,
  userId: string,
): Promise<SlackUser> {
  const response = await fetch(
    `https://slack.com/api/users.info?user=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch user info from Slack: ${response.statusText}`,
    );
  }

  const data = await response.json();
  console.log('data for user info', data);
  const parsedResponse = slackUsersInfoResponseSchema.parse(data);

  if (!parsedResponse.ok) {
    throw new Error(
      `Slack API error while fetching user info: ${parsedResponse.error}`,
    );
  }

  if (!parsedResponse.user) {
    throw new Error('Slack API error: user info not found in response');
  }

  return parsedResponse.user;
}

export async function getSlackIdentityInfo(
  tokenResponse: z.infer<typeof slackOAuthResponseSchema>,
): Promise<{ user?: SlackUser; team: SlackTeam }> {
  const team = await getSlackTeamInfo(
    tokenResponse.access_token,
    tokenResponse.team.id,
  );

  let user: SlackUser | undefined;
  if (tokenResponse.authed_user && tokenResponse.authed_user.id) {
    user = await getSlackUserInfo(
      tokenResponse.access_token,
      tokenResponse.authed_user.id,
    );
    return { user, team };
  }

  return {
    team,
  };
}

export function convertSlackIdentityToIdentity(identityInfo: {
  user?: SlackUser;
  team: SlackTeam;
}): Identity {
  const { user, team } = identityInfo;
  return {
    providerInfo: {
      provider: 'slack',
      providerUserId: user?.id || '',
      providerIcon:
        'https://raw.githubusercontent.com/microfox-ai/microfox/refs/heads/main/logos/slack-icon.svg',
    },
    userInfo: user
      ? {
          id: user.id,
          email: user.profile.email,
          name: user.real_name || user.name,
          avatarUrl: user?.profile?.image_original || user?.profile?.image_192,
        }
      : undefined,
    teamInfo: {
      id: team.id,
      name: team.name,
      icon: team.icon.image_132,
    },
  };
}
