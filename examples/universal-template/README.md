# Universal Package Testing Template

This template provides a universal testing interface for Microfox packages that require OAuth authentication. It showcases real-world implementations of our OAuth SDKs and provides a reference for developers.

## Features

- **GitHub OAuth SDK**: Complete OAuth 2.0 implementation with PKCE
- **Reddit SDK**: Reddit API integration with OAuth
- **OAuth Kit**: Unified identity management across providers
- **AWS SES**: Email sending functionality
- Universal OAuth authentication flows
- Clean and intuitive user interfaces
- Comprehensive error handling
- Real-world SDK demonstrations

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file with your OAuth credentials:

```env
# GitHub OAuth Configuration
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
NEXT_PUBLIC_GITHUB_REDIRECT_URI=http://localhost:3000/github

# Reddit OAuth Configuration (optional)
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_REDIRECT_URI=http://localhost:3000/reddit/callback

# AWS SES Configuration (optional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
SES_FROM_EMAIL=noreply@yourdomain.com
```

3. Set up GitHub OAuth App:
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create a new OAuth App
   - Set Authorization callback URL to: `http://localhost:3000/github`
   - Copy Client ID and Client Secret to your `.env.local`

4. Run the development server:

```bash
npm run dev
```

## Available SDKs

### GitHub OAuth SDK (`/github`)
- Complete OAuth 2.0 authorization flow with PKCE
- User profile and email fetching  
- Token validation and revocation
- Integration with OAuth Kit
- Security features (state parameter, PKCE)

### Reddit SDK (`/`)
- Reddit API integration
- OAuth authentication
- Post and comment management

## How to Use

1. **Navigate to SDK Pages**: Use the navigation to visit different SDK demonstrations
2. **GitHub OAuth**: Visit `/github` to test the complete GitHub OAuth flow
3. **Authentication**: Click "Login with GitHub" to start OAuth flow
4. **Profile Information**: View fetched user profile, repositories, and follower counts
5. **API Testing**: Test various GitHub API endpoints with authenticated requests

## Customizing for Your Package

1. **OAuth Configuration**:

   - Update the OAuth endpoints in `.env.local`
   - Modify the `oauthConfig` object in `pages/index.js` if needed

2. **Function Testing**:

   - Modify `pages/api/test-function.js` to implement your package's specific function calls
   - Update the parameter structure in the frontend if needed

3. **Additional Features**:
   - Add more function testing buttons as needed
   - Modify the UI to match your package's requirements
   - Add additional OAuth scopes or parameters

## Example Usage

```javascript
// In pages/api/test-function.js
import { yourPackage } from 'your-package';

export default async function handler(req, res) {
  const { accessToken, params } = req.body;

  try {
    const result = await yourPackage.someFunction(accessToken, params);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

## Notes

- Keep sensitive information in environment variables
- Handle errors appropriately
- Test thoroughly with your specific package
- Update the UI/UX as needed for your use case
