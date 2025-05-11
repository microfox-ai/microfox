## Interface: `GoogleGenAIOptions`

Google Gen AI SDK's configuration options.


**Purpose:**

Configures the behavior of the `GoogleGenAI` SDK, allowing customization of API keys, API version, authentication, HTTP options, location, project, and whether to use Vertex AI or Gemini API.

**Properties:**

- **`apiKey`?: string**
    - Optional. The API Key, required for Gemini API clients. Required on browser runtimes.
    - This property should be a string representing your API key.

- **`apiVersion`?: string**
    - Optional. The API version to use. If unset, the default API version will be used.
    - This property should be a string representing the desired API version.

- **`googleAuthOptions`?: `GoogleAuthOptions`<`JSONClient`>**
    - Optional. Authentication options defined by the google-auth-library for Vertex AI clients. Only supported on Node runtimes, ignored on browser runtimes.
    - This property should be a `GoogleAuthOptions` object, which is defined in the google-auth-library-nodejs package.  This SDK documentation does not expand the definition of this type, as it's defined in an external library. Consult the google-auth-library-nodejs documentation for details.

- **`httpOptions`?: `HttpOptions`**
    - Optional. A set of customizable configuration for HTTP requests.
    - This property should be an `HttpOptions` object.  This SDK documentation does not expand the definition of this type, as it's not provided in the source code.

- **`location`?: string**
    - Optional. The Google Cloud project location for Vertex AI clients. Only supported on Node runtimes, ignored on browser runtimes.
    - This property should be a string representing the Google Cloud project location.  For example: "us-central1".

- **`project`?: string**
    - Optional. The Google Cloud project ID for Vertex AI clients. Find your project ID: https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects. Only supported on Node runtimes, ignored on browser runtimes.
    - This property should be a string representing your Google Cloud Project ID. For example: "my-project-12345".

- **`vertexai`?: boolean**
    - Optional. Determines whether to use the Vertex AI or the Gemini API. When true, the Vertex AI API will be used. When false, the Gemini API will be used. If unset, default SDK behavior is to use the Gemini API service.
    - This property should be a boolean value.


## Class: `GoogleGenAI`

This class represents the Google Gen AI client.  Documentation for its constructor and methods was not provided in the input.  Please provide the constructor and method definitions for complete documentation.


## Environment Variables

The following environment variables can be used to configure the Google Gen AI SDK, particularly for authentication with OAuth2 providers.  Replace `<provider>` with the name of the OAuth2 provider (e.g., "GOOGLE", "FACEBOOK", etc.).

- **`<PROVIDER>_ACCESS_TOKEN`**: (Optional) The OAuth2 access token.
- **`<PROVIDER>_REFRESH_TOKEN`**: (Optional) The OAuth2 refresh token.
- **`<PROVIDER>_CLIENT_ID`**: (Optional) The OAuth2 client ID.
- **`<PROVIDER>_CLIENT_SECRET`**: (Optional) The OAuth2 client secret.
- **`SCOPES`**: (Optional) A space-separated list of scopes to request during authentication.  For example: "scope1 scope2 scope3".  This environment variable should always be included if the constructor config includes scopes.


This documentation provides a comprehensive overview of the `GoogleGenAIOptions` interface and environment variables.  To generate complete documentation for the `GoogleGenAI` class, please provide the constructor and method definitions.
