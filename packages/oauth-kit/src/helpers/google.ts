import {
  IdentityInfo,
  TokenResponseOutput,
} from '../../../google-oauth/src/schemas';
import { Identity } from '../schemas';

const USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';
export const getGoogleIdentityInfo = async (
  tokenResponse: TokenResponseOutput,
): Promise<IdentityInfo> => {
  try {
    const response = await fetch(USER_INFO_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenResponse.accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data?.error?.message ||
        data?.error_description ||
        'Failed to fetch user info';
      throw new Error(errorMessage);
    }

    return data as IdentityInfo;
  } catch (error) {
    throw new Error(`Failed to fetch user info: ${error}`);
  }
};

export const convertGoogleIdentityToIdentity = (
  identity: IdentityInfo,
): Identity => {
  return {
    userInfo: {
      id: identity.sub,
      name: identity.name,
      email: identity.email,
      avatarUrl: identity.picture,
    },
    providerInfo: {
      provider: 'google',
      providerUserId: identity.sub,
      providerIcon:
        'https://raw.githubusercontent.com/microfox-ai/microfox/refs/heads/main/logos/google.svg',
    },
  };
};
