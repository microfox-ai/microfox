import { GitHubOAuthResponse } from '../../../github-oauth/src/types';
import { Identity } from '../schemas';

export async function getGitHubIdentityInfo(tokenResponse: GitHubOAuthResponse): Promise<any> {
  // If user information is already included in the token response, use it
  if (tokenResponse.user) {
    return {
      user: tokenResponse.user,
      emails: tokenResponse.emails,
    };
  }

  // Otherwise, fetch user information using the access token
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${tokenResponse.access_token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Microfox-OAuth-Kit',
    },
  });

  if (!userResponse.ok) {
    throw new Error(`Failed to get GitHub user identity: ${userResponse.statusText}`);
  }

  const user = await userResponse.json();

  // Fetch user emails if user:email scope is available
  let emails;
  try {
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Microfox-OAuth-Kit',
      },
    });
    
    if (emailResponse.ok) {
      emails = await emailResponse.json();
    }
  } catch (error) {
    // Email fetch failed, continue without emails
    console.warn('Failed to fetch GitHub user emails:', error);
  }

  return {
    user,
    emails,
  };
}

export function convertGitHubIdentityToIdentity(identityInfo: any): Identity {
  const user = identityInfo.user;
  const emails = identityInfo.emails;
  
  // Find primary email
  const primaryEmail = emails?.find((email: any) => email.primary)?.email;
  
  return {
    userInfo: {
      id: user?.id?.toString() || '',
      name: user?.name || user?.login || '',
      email: primaryEmail || user?.email || emails[0]?.email || '',
      avatarUrl: user?.avatar_url || '',
    },
    providerInfo: {
      provider: 'github',
      providerUserId: user?.id?.toString() || '',
      providerIcon:
        'https://raw.githubusercontent.com/microfox-ai/microfox/refs/heads/main/logos/github-icon.svg',
    },
  };
} 