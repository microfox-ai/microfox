import {
  convertGoogleIdentityToIdentity,
  getGoogleIdentityInfo,
} from './helpers/google';
import {
  convertRedditIdentityToIdentity,
  getRedditIdentityInfo,
} from './helpers/reddit';
import {
  convertSlackIdentityToIdentity,
  getSlackIdentityInfo,
} from './helpers/slack';
import { Identity } from './schemas';

type ProviderConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export const SupportedProviders = ['google', 'slack', 'reddit'] as const;

export class OauthKit {
  constructor() {}

  static async exchangeTokenResponseForIdentity(
    provider: string,
    tokenResponse: any,
  ): Promise<Identity> {
    switch (provider) {
      case 'google': {
        try {
          const identityInfo = await getGoogleIdentityInfo(tokenResponse);
          console.log('identityInfo', identityInfo);
          return convertGoogleIdentityToIdentity(identityInfo);
        } catch (error) {
          throw new Error(
            `Failed to exchange token response for identity: ${error}`,
          );
        }
      }
      case 'slack': {
        try {
          const identityInfo = await getSlackIdentityInfo(tokenResponse);
          return convertSlackIdentityToIdentity(identityInfo);
        } catch (error) {
          throw new Error(
            `Failed to exchange token response for identity: ${error}`,
          );
        }
      }
      case 'reddit': {
        try {
          const identityInfo = await getRedditIdentityInfo(tokenResponse);
          console.log('identityInfo', identityInfo);
          return convertRedditIdentityToIdentity(identityInfo);
        } catch (error) {
          throw new Error(
            `Failed to exchange token response for identity: ${error}`,
          );
        }
      }
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}
