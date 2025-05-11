# Environment Variables

The following environment variables are required to use this SDK:

## Gemini API Key

**Key:** `GEMINI_API_KEY`
**Required:** Yes

The API key for the Gemini Developer API.

## Gemini API Key

**Key:** `GEMINI_API_KEY`
**Required:** Yes

API Key for Gemini API

## Vertex AI Project ID

**Key:** `PROJECT_ID`
**Required:** Yes

Project ID for Vertex AI

## Vertex AI Project Location

**Key:** `PROJECT_LOCATION`
**Required:** Yes

Project Location for Vertex AI

## API Key

**Key:** `API_KEY`
**Required:** No

The API Key, required for Gemini API clients. Required on browser runtimes.

## API Version

**Key:** `API_VERSION`
**Required:** No

Optional. The API version to use. If unset, the default API version will be used.

## Google Auth Options

**Key:** `GOOGLE_AUTH_OPTIONS`
**Required:** No

Optional. Authentication options defined by the by google-auth-library for Vertex AI clients. See GoogleAuthOptions interface in google-auth-library-nodejs. Only supported on Node runtimes, ignored on browser runtimes.

## HTTP Options

**Key:** `HTTP_OPTIONS`
**Required:** No

Optional. A set of customizable configuration for HTTP requests.

## Location

**Key:** `LOCATION`
**Required:** No

Optional. The Google Cloud project location for Vertex AI clients. Only supported on Node runtimes, ignored on browser runtimes.

## Project

**Key:** `PROJECT`
**Required:** No

Optional. The Google Cloud project ID for Vertex AI clients. Find your project ID: https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects  Only supported on Node runtimes, ignored on browser runtimes.

## Vertex AI

**Key:** `VERTEX_AI`
**Required:** No

Optional. Determines whether to use the Vertex AI or the Gemini API. When true, the Vertex AI API will used. When false, the Gemini API will be used. If unset, default SDK behavior is to use the Gemini API service.