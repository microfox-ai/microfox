import { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import OAuth from './components/OAuth';
import Sheets from './components/Sheets';
import './App.css';
import { GoogleOAuthSdk, GoogleScope } from '@microfox/google-oauth';

interface Tokens {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  isValid: boolean;
}

export default function App() {
  const [tokens, setTokens] = useState<Tokens>({
    isValid: false,
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load tokens from localStorage on component mount
    const loadTokens = () => {
      const savedTokens = localStorage.getItem('google_tokens');
      console.log('savedTokens', savedTokens);
      if (savedTokens) {
        try {
          const parsedTokens = JSON.parse(savedTokens);
          setTokens({
            ...parsedTokens,
            isValid: parsedTokens.expiresAt > Date.now(),
          });
        } catch (error) {
          console.error('Error parsing saved tokens:', error);
          localStorage.removeItem('google_tokens');
        }
      }
    };

    loadTokens();
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');

      if (code) {
        try {
          // Exchange code for tokens
          const clientId = localStorage.getItem('clientId');
          const clientSecret = localStorage.getItem('clientSecret');
          const redirectUri =
            window.location.origin + '/api/auth/callback/google';
          const scopes = [GoogleScope.SHEETS];
          const oauthSdk = new GoogleOAuthSdk({
            clientId: clientId || '',
            clientSecret: clientSecret || '',
            redirectUri: redirectUri,
            scopes: scopes,
          });
          const response = await oauthSdk.exchangeCodeForTokens(code);
          console.log('response', response);

          const newTokens = {
            accessToken: response.accessToken || '',
            refreshToken: response.refreshToken || '',
            expiresAt: Date.now() + response.expiresIn * 1000,
            isValid: true,
          };

          // Save tokens
          localStorage.setItem('google_tokens', JSON.stringify(newTokens));
          setTokens(newTokens);

          // Redirect to sheets page
          navigate('/sheets');
        } catch (error) {
          console.error('Error handling OAuth callback:', error);
          navigate('/');
        }
      }
    };

    if (location.pathname === '/api/auth/callback/google') {
      handleCallback();
    }
  }, [location, navigate]);

  const updateTokens = (newTokens: Tokens) => {
    setTokens(newTokens);
    if (newTokens.accessToken && newTokens.refreshToken) {
      localStorage.setItem('google_tokens', JSON.stringify(newTokens));
    } else {
      localStorage.removeItem('google_tokens');
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Google Sheets Integration</h1>
        <nav>
          <Link to="/">OAuth</Link>
          <Link to="/sheets">Sheets</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route
            path="/"
            element={<OAuth tokens={tokens} updateTokens={updateTokens} />}
          />
          <Route path="/sheets" element={<Sheets tokens={tokens} />} />
          <Route path="/api/auth/callback/google" element={null} />
        </Routes>
      </main>

      <footer>
        <p>Powered by Microfox</p>
      </footer>
    </div>
  );
}
