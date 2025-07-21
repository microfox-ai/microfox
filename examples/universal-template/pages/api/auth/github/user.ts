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

    // Fetch user identity on server-side
    const identity = await githubOAuth.getUserIdentity(accessToken);

    return res.status(200).json(identity);
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch user profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 