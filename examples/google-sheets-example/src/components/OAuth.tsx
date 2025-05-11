import { useState, useEffect } from 'react';
import { GoogleOAuthSdk, GoogleScope } from '@microfox/google-oauth';

interface OAuthProps {
  tokens: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    isValid: boolean;
  };
  updateTokens: (tokens: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    isValid: boolean;
  }) => void;
}

const OAuth = ({ tokens, updateTokens }: OAuthProps) => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load client credentials from localStorage on component mount
  useEffect(() => {
    const savedClientId = localStorage.getItem('clientId1');
    const savedClientSecret = localStorage.getItem('clientSecret1');

    if (savedClientId) setClientId(savedClientId);
    if (savedClientSecret) setClientSecret(savedClientSecret);
  }, []);

  // Check if user is authenticated
  useEffect(() => {
    setIsAuthenticated(!!tokens.accessToken && tokens.isValid);
  }, [tokens]);

  const handleSaveCredentials = () => {
    if (!clientId || !clientSecret) {
      setError('Client ID and Client Secret are required');
      return;
    }

    // Save credentials to localStorage
    localStorage.setItem('clientId1', clientId);
    localStorage.setItem('clientSecret1', clientSecret);
    setError(null);
  };

  const handleAuthenticate = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if credentials are saved
      if (
        !localStorage.getItem('clientId1') ||
        !localStorage.getItem('clientSecret1')
      ) {
        setError('Please save your credentials first');
        setIsLoading(false);
        return;
      }

      // Initialize the OAuth SDK
      const oauthSdk = new GoogleOAuthSdk({
        clientId,
        clientSecret,
        redirectUri: window.location.origin + '/api/auth/callback/google',
        scopes: [GoogleScope.SHEETS],
      });

      // Get the authorization URL
      const authUrl = oauthSdk.getAuthUrl();

      // Redirect to the authorization URL
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating OAuth flow:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to initiate OAuth flow',
      );
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem('google_tokens');
    // Reset tokens state
    updateTokens({ isValid: false });
    setIsAuthenticated(false);
  };

  return (
    <div className="card">
      <h2>Google OAuth Authentication</h2>

      {isAuthenticated ? (
        <div>
          <p className="success">You are authenticated with Google!</p>
          <p>
            Access Token: {tokens.accessToken?.substring(0, 10)}...
            <br />
            Refresh Token: {tokens.refreshToken ? 'Available' : 'Not available'}
            <br />
            Expires At:{' '}
            {tokens.expiresAt
              ? new Date(tokens.expiresAt).toLocaleString()
              : 'Unknown'}
          </p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <div>
            <label htmlFor="clientId">Client ID:</label>
            <input
              type="text"
              id="clientId"
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              placeholder="Enter your Google OAuth Client ID"
            />
          </div>

          <div>
            <label htmlFor="clientSecret">Client Secret:</label>
            <input
              type="password"
              id="clientSecret"
              value={clientSecret}
              onChange={e => setClientSecret(e.target.value)}
              placeholder="Enter your Google OAuth Client Secret"
            />
          </div>

          {error && <p className="error">{error}</p>}

          <div
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
          >
            <button onClick={handleSaveCredentials} disabled={isLoading}>
              Save Credentials
            </button>
            <button onClick={handleAuthenticate} disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Authenticate with Google'}
            </button>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'left' }}>
            <h3>Instructions:</h3>
            <ol>
              <li>
                Create a Google Cloud project and enable the Google Sheets API
              </li>
              <li>
                Create OAuth 2.0 credentials (Client ID and Client Secret)
              </li>
              <li>
                Add your redirect URI: {window.location.origin}
                /api/auth/callback/google
              </li>
              <li>Enter your credentials above and click "Save Credentials"</li>
              <li>Click "Authenticate with Google" to start the OAuth flow</li>
              <li>
                After authentication, go to the Sheets page to interact with
                Google Sheets
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default OAuth;
