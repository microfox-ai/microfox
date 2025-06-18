import { RedditSDK } from '@microfox/reddit';

export const sdkInit = (envVars: Record<string, string>): Record<string, Function> => {
    // Environment variables validation
    const requiredEnvVars = [
        'REDDIT_CLIENT_ID',
        'REDDIT_CLIENT_SECRET',
        'REDDIT_REDIRECT_URI',
        'REDDIT_ACCESS_TOKEN',
        'REDDIT_REFRESH_TOKEN',
        'SCOPES'
    ];

    for (const envVar of requiredEnvVars) {
        if (!envVars[envVar]) {
            throw new Error(`Missing required environment variables: ${requiredEnvVars.join(', ')}.`);
        }
    }

    // Initialize SDK with env vars
    const sdk = new RedditSDK({
        clientId: envVars['REDDIT_CLIENT_ID'],
        clientSecret: envVars['REDDIT_CLIENT_SECRET'],
        redirectUri: envVars['REDDIT_REDIRECT_URI'],
        accessToken: envVars['REDDIT_ACCESS_TOKEN'],
        refreshToken: envVars['REDDIT_REFRESH_TOKEN'],
        scopes: envVars['SCOPES'].split(',')
    });

    // Map functions
    const sdkMap: Record<string, Function> = {
        validateAccessToken: sdk.validateAccessToken.bind(sdk),
        refreshAccessToken: sdk.refreshAccessToken.bind(sdk),
        getMe: sdk.getMe.bind(sdk),
        getUserPreferences: sdk.getUserPreferences.bind(sdk),
        updateUserPreferences: sdk.updateUserPreferences.bind(sdk),
        getUserKarma: sdk.getUserKarma.bind(sdk),
        getUserTrophies: sdk.getUserTrophies.bind(sdk),
        getUser: sdk.getUser.bind(sdk),
        getUserContent: sdk.getUserContent.bind(sdk),
        getSubredditInfo: sdk.getSubredditInfo.bind(sdk),
        searchSubreddit: sdk.searchSubreddit.bind(sdk),
        search: sdk.search.bind(sdk),
        submitComment: sdk.submitComment.bind(sdk),
        submitPost: sdk.submitPost.bind(sdk),
        vote: sdk.vote.bind(sdk),
        deletePost: sdk.deletePost.bind(sdk),
        editUserText: sdk.editUserText.bind(sdk),
        hidePost: sdk.hidePost.bind(sdk),
        unhidePost: sdk.unhidePost.bind(sdk),
        saveItem: sdk.saveItem.bind(sdk),
        unsaveItem: sdk.unsaveItem.bind(sdk),
        reportItem: sdk.reportItem.bind(sdk),
        getInfo: sdk.getInfo.bind(sdk),
        getMoreComments: sdk.getMoreComments.bind(sdk),
        getPost: sdk.getPost.bind(sdk)
    };

    return sdkMap;
}