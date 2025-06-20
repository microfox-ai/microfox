import {
  GoogleOAuthSdk,
  IdentityInfo,
  TokenResponseOutput,
} from '@microfox/google-oauth';
import { Identity } from '../schemas';

export const getGoogleIdentityInfo = async (
  tokenResponse: TokenResponseOutput,
): Promise<IdentityInfo> => {
  const identityInfo = await GoogleOAuthSdk.getUserInfo(
    tokenResponse.accessToken,
  );
  return identityInfo;
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
