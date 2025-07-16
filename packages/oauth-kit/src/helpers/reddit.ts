import { Identity } from '../schemas';

export async function getRedditIdentityInfo(tokenResponse: any): Promise<any> {
  const response = await fetch('https://oauth.reddit.com/api/v1/me', {
    headers: {
      Authorization: `Bearer ${tokenResponse.access_token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to get Reddit user identity: ${response.statusText}`);
  }
  return response.json();
}

export function convertRedditIdentityToIdentity(identityInfo: any): Identity {
  return {
    providerInfo: {
      provider: 'reddit',
      providerUserId: identityInfo.id,
      providerIcon:
      'https://raw.githubusercontent.com/microfox-ai/microfox/refs/heads/main/logos/reddit.svg',
    },
    userInfo: {
      id: identityInfo.id,
      name: identityInfo.name,
      // Reddit API does not provide user email address
      avatarUrl: identityInfo.icon_img || identityInfo.snoovatar_img || '',
    },
  };
}