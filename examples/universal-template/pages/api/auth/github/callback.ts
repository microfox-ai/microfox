import { NextApiRequest, NextApiResponse } from 'next';
import { GitHubOAuthSdk } from '@microfox/github-oauth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, codeVerifier } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    const githubOAuth = new GitHubOAuthSdk({
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      redirectUri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI!,
      scopes: ['user', 'user:email', 'public_repo'],
    });

    // Exchange code for tokens on server-side
    const response = await githubOAuth.getCompleteOAuthResponse(code, codeVerifier);

    return res.status(200).json(response);
  } catch (error) {
    console.log('OAuth callback error:', error);
    return res.status(500).json({ 
      error: 'Failed to exchange authorization code',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 