import { Identity } from '../schemas';

interface InstagramUserInfo {
    id: string,
    username: string,
    account_type: string,
    media_count: number,
    name: string,
    profile_picture_url: string,
    follows_count: number,
    followers_count: number,
    biography: string,
    website: string,
}

interface InstagramTokenResponse {
    userId: string;
    accessToken: string;
    permissions: string[];
}

async function getInstagramUserInfo(
    accessToken: string,
): Promise<InstagramUserInfo> {
    const response = await fetch(
        `https://graph.instagram.com/me?fields=id,username,account_type,media_count,name,profile_picture_url,follows_count,followers_count,biography,website`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        },
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch user info from Instagram: ${response.statusText}`,
        );
    }

    const data = await response.json();
    console.log('data for user info', data);

    if (!data) {
        throw new Error('Instagram API error: user info not found in response');
    }

    return data;
}

export async function getInstagramIdentityInfo(
    tokenResponse: InstagramTokenResponse,
): Promise<{ user?: InstagramUserInfo; }> {
    if (!tokenResponse.accessToken) {
        throw new Error('Instagram API error: access token not found in response');
    }

    let user: InstagramUserInfo;
    user = await getInstagramUserInfo(
        tokenResponse.accessToken,
    );

    return {
        user,
    };
}

export function convertInstagramIdentityToIdentity(identityInfo: {
    user?: InstagramUserInfo;
}): Identity {
    const { user } = identityInfo;
    return {
        providerInfo: {
            provider: 'instagram',
            providerUserId: user?.id || '',
            providerIcon:
                'https://raw.githubusercontent.com/microfox-ai/microfox/refs/heads/main/logos/instagram-icon.svg',
        },
        userInfo: user
            ? {
                id: user.id,
                name: user?.name || user?.username,
                avatarUrl: user?.profile_picture_url,
            }
            : undefined,
    };
}
