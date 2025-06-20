import { Identity } from '../schemas';
import { slackOAuthResponseSchema } from '../../../slack-oauth/src/schemas';
import { z } from 'zod';

const slackUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  real_name: z.string().optional(),
  profile: z.object({
    email: z.string().optional(),
    image_original: z.string().url(),
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
  user: slackUserSchema,
  error: z.string().optional(),
});

const slackTeamInfoResponseSchema = z.object({
  ok: z.boolean(),
  team: slackTeamSchema,
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
  const parsedResponse = slackTeamInfoResponseSchema.parse(data);

  if (!parsedResponse.ok) {
    throw new Error(
      `Slack API error while fetching team info: ${parsedResponse.error}`,
    );
  }

  return parsedResponse.team;
}

export async function getSlackIdentityInfo(
  tokenResponse: z.infer<typeof slackOAuthResponseSchema>,
): Promise<{ user: SlackUser; team: SlackTeam }> {
  const authedUser = tokenResponse.authed_user;
  if (!authedUser || !authedUser.access_token || !authedUser.id) {
    throw new Error('Missing authed_user information in Slack token response');
  }

  const userResponse = await fetch(
    `https://slack.com/api/users.info?user=${authedUser.id}`,
    {
      headers: {
        Authorization: `Bearer ${authedUser.access_token}`,
      },
    },
  );

  if (!userResponse.ok) {
    throw new Error(
      `Failed to fetch user info from Slack: ${userResponse.statusText}`,
    );
  }

  const userData = await userResponse.json();
  const parsedUserResponse = slackUsersInfoResponseSchema.parse(userData);

  if (!parsedUserResponse.ok) {
    throw new Error(
      `Slack API error while fetching user info: ${parsedUserResponse.error}`,
    );
  }

  const team = await getSlackTeamInfo(
    authedUser.access_token,
    tokenResponse.team.id,
  );

  return { user: parsedUserResponse.user, team };
}

export function convertSlackIdentityToIdentity(identityInfo: {
  user: SlackUser;
  team: SlackTeam;
}): Identity {
  const { user, team } = identityInfo;
  return {
    providerInfo: {
      provider: 'slack',
      providerUserId: user.id,
      providerIcon:
        'https://raw.githubusercontent.com/microfox-ai/microfox/refs/heads/main/logos/slack-icon.svg',
    },
    userInfo: {
      id: user.id,
      email: user.profile.email,
      name: user.real_name || user.name,
      avatarUrl: user.profile.image_original,
    },
    teamInfo: {
      id: team.id,
      name: team.name,
      icon: team.icon.image_132,
    },
  };
}
