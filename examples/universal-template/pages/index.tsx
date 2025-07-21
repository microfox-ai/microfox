export default function UniversalTemplate() {
  return (
    <div className="container">
      <h1 className="text-4xl font-bold mb-8">SDKs</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Reddit</h2>
        <p className="text-gray-600 mb-4">
          This package provides a powerful SDK for interacting with Reddit's
          API. You can easily fetch posts, comments, user data, and perform
          various Reddit operations with a simple and intuitive interface.
        </p>
        <a
          href="/reddit"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Reddit SDK
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">GitHub OAuth</h2>
        <p className="text-gray-600 mb-4">
          This package provides a comprehensive SDK for GitHub OAuth 2.0 authentication. 
          Features include PKCE support, complete user profile access, token management, 
          and seamless integration with the OAuth Kit for unified identity handling.
        </p>
        <a
          href="/github"
          className="inline-block bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          Try GitHub OAuth SDK
        </a>
      </div>
    </div>
  );
}
