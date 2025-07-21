import { NextApiRequest, NextApiResponse } from 'next';
import { GitHubOAuthSdk } from '@microfox/github-oauth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ error: 'Access token is required' });
  }

  try {
    const githubOAuth = new GitHubOAuthSdk({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      redirectUri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI!,
      scopes: ['user', 'user:email', 'public_repo'],
    });

    // Revoke token on server-side
    await githubOAuth.revokeToken(accessToken);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log('Failed to revoke token:', error);
    return res.status(500).json({ 
      error: 'Failed to revoke token',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 