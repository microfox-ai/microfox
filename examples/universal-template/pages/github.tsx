import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GitHubOAuthSdk } from '@microfox/github-oauth';
import { OauthKit } from '@microfox/oauth-kit';

interface GitHubUser {
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

export default function GitHub() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pkceVerifier, setPkceVerifier] = useState<string | null>(null);

  const githubOAuth = new GitHubOAuthSdk({
    clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'demo-client-id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'demo-client-secret',
    redirectUri: process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || 'http://localhost:3000/github',
    scopes: ['user', 'user:email', 'public_repo'],
  });

  useEffect(() => {
    // Handle OAuth callback
    const handleCallback = async () => {
      const { code, state, error: oauthError } = router.query;

      if (oauthError) {
        setError(`OAuth Error: ${oauthError}`);
        return;
      }

      if (code && typeof code === 'string') {
        setIsLoading(true);
        try {
          const storedVerifier = localStorage.getItem('github_code_verifier');
          const response = await githubOAuth.getCompleteOAuthResponse(
            code,
            storedVerifier || undefined
          );
          console.log("getCompleteOAuthResponse", response);

          // Store access token
          setAccessToken(response.access_token);
          localStorage.setItem('github_access_token', response.access_token);

          // Get user identity using OAuth Kit
          const identity = await OauthKit.exchangeTokenResponseForIdentity('github', response);
          console.log("exchangeTokenResponseForIdentity", identity);
          
          setUser({
            login: response.user?.login || '',
            name: identity.userInfo?.name || '',
            email: identity.userInfo?.email || '',
            avatar_url: identity.userInfo?.avatarUrl || '',
            public_repos: response.user?.public_repos || 0,
            followers: response.user?.followers || 0,
            following: response.user?.following || 0,
          });

          // Clean up localStorage
          localStorage.removeItem('github_code_verifier');
          localStorage.removeItem('github_state');

          // Clean up URL
          router.replace('/github', undefined, { shallow: true });
        } catch (err) {
          console.error('OAuth callback error:', err);
          setError(`Failed to complete OAuth: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
          setIsLoading(false);
        }
      }
    };

    // Check for existing access token
    const existingToken = localStorage.getItem('github_access_token');
    if (existingToken && !user) {
      setAccessToken(existingToken);
      fetchUserProfile(existingToken);
    } else {
      handleCallback();
    }
  }, [router.query]);

  const fetchUserProfile = async (token: string) => {
    try {
      setIsLoading(true);
      const userProfile = await githubOAuth.getUserProfile(token);
      const emails = await githubOAuth.getUserEmails(token).catch(() => []);
      const primaryEmail = emails.find(email => email.primary)?.email || userProfile.email;

      setUser({
        login: userProfile.login,
        name: userProfile.name || userProfile.login,
        email: primaryEmail || '',
        avatar_url: userProfile.avatar_url,
        public_repos: userProfile.public_repos,
        followers: userProfile.followers,
        following: userProfile.following,
      });
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError(`Failed to fetch user profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
      // Clear invalid token
      localStorage.removeItem('github_access_token');
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Generate PKCE parameters for enhanced security
      const pkceParams = await githubOAuth.generatePKCEParams();
      const state = Math.random().toString(36).substring(2, 15);

      // Store PKCE verifier and state
      localStorage.setItem('github_code_verifier', pkceParams.codeVerifier);
      localStorage.setItem('github_state', state);

      // Generate authorization URL
      const authUrl = await githubOAuth.getAuthUrl({
        state,
        usePKCE: true,
        codeChallenge: pkceParams.codeChallenge,
      });

      // Redirect to GitHub
      window.location.href = authUrl;
    } catch (err) {
      console.error('Login error:', err);
      setError(`Failed to initiate login: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (accessToken) {
        await githubOAuth.revokeToken(accessToken);
      }
    } catch (err) {
      console.log('Failed to revoke token:', err);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('github_access_token');
      localStorage.removeItem('github_code_verifier');
      localStorage.removeItem('github_state');
      setUser(null);
      setAccessToken(null);
      setError(null);
    }
  };

  const testApiCall = async () => {
    if (!accessToken) return;

    try {
      setIsLoading(true);
      const userProfile = await githubOAuth.getUserProfile(accessToken);
      alert(`API Test Successful!\n\nUser: ${userProfile.login}\nName: ${userProfile.name}\nPublic Repos: ${userProfile.public_repos}`);
    } catch (err) {
      console.error('API test failed:', err);
      setError(`API test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="text-4xl font-bold mb-8">GitHub OAuth SDK</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {isLoading ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6">
          Loading...
        </div>
      ) : user ? (
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">@{user.login}</p>
                {user.email && <p className="text-gray-600">{user.email}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{user.public_repos}</div>
                <div className="text-sm text-gray-600">Public Repos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{user.followers}</div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{user.following}</div>
                <div className="text-sm text-gray-600">Following</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Actions</h3>
            <div className="space-x-4">
              <button
                onClick={testApiCall}
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Test API Call
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* OAuth Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">OAuth Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Access Token:</strong> {accessToken?.substring(0, 20)}...</p>
              <p><strong>Scopes:</strong> user, user:email, public_repo</p>
              <p><strong>Provider:</strong> GitHub</p>
              <p><strong>SDK:</strong> @microfox/github-oauth</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">GitHub OAuth Demo</h2>
          <p className="text-gray-600 mb-6">
            This demo showcases the @microfox/github-oauth package with:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
            <li>Complete OAuth 2.0 authorization flow</li>
            <li>PKCE (Proof Key for Code Exchange) for enhanced security</li>
            <li>User profile and email fetching</li>
            <li>Token validation and revocation</li>
            <li>Integration with @microfox/oauth-kit</li>
          </ul>
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>Login with GitHub</span>
          </button>
        </div>
      )}

      {/* Documentation */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">Implementation Details</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Package:</strong> @microfox/github-oauth</p>
          <p><strong>OAuth Flow:</strong> Authorization Code with PKCE</p>
          <p><strong>Security:</strong> State parameter for CSRF protection</p>
          <p><strong>Scopes:</strong> user, user:email, public_repo</p>
          <p><strong>Integration:</strong> Works with @microfox/oauth-kit for unified identity handling</p>
        </div>
      </div>
    </div>
  );
} 