# Microfox Brave SDK API

This agent provides a comprehensive interface for interacting with the Brave Search API. It's a single entry-point API for all Microfox Brave SDK functions, exposed via a wrapper Lambda. This allows you to perform various search operations including web search, image search, video search, and news search with powerful filtering and customization options.

## Functionality

The API provides the following functionalities:

### 1. Web Search (`/webSearch`)

**Summary:** Performs a web search using the Brave Search API.

**Description:** This function allows users to perform web searches and retrieve results from the Brave Search API. It supports a wide range of search parameters including query, country, language, result count, and various filters. The function returns comprehensive search results including web pages, news, videos, discussions, FAQs, and more.

**Key Features:**

- Advanced filtering with result_filter parameter
- Custom date ranges for freshness
- Safe search controls
- Spell checking and text decorations
- Support for custom goggles for re-ranking
- Summary generation capabilities

### 2. Image Search (`/imageSearch`)

**Summary:** The imageSearch function enables image search capabilities through the Brave Search API, allowing users to find and retrieve images based on search queries.

**Description:** The imageSearch function provides a powerful interface to search for images using the Brave Search API. It accepts a wide range of parameters to customize the search, including query, language, country, content filtering, and result limits. The function returns a Promise that resolves to an object containing detailed image search results and metadata.

**Key Features:**

- Image-specific search parameters
- Thumbnail and size information
- Family-friendly content filtering
- Support for up to 20 results per search
- Pagination with offset support

### 3. Video Search (`/videoSearch`)

**Summary:** Execute videoSearch function

**Description:** Executes the videoSearch function with provided parameters to search for video content through the Brave Search API.

### 4. News Search (`/newsSearch`)

**Summary:** The newsSearch function performs a news search using the Brave Search API.

**Description:** This function allows users to search for news articles using various parameters through the Brave Search API. It provides flexibility in specifying search criteria such as query, country, language, and result filtering. The function returns a promise that resolves to a comprehensive news search response containing detailed information about each article.

**Key Features:**

- Breaking news detection
- Article age and page age information
- Thumbnail support for news articles
- Extra snippets for enhanced content
- Source and domain metadata
- Support for custom date ranges

## Authentication

All API endpoints require authentication using an API key strategy. The `BRAVE_API_KEY` must be provided in the authentication variables for each request.

## Common Parameters

Most search functions support these common parameters:

- **q**: The search query (max 400 characters, 50 words)
- **country**: Two-letter country code (e.g., 'US', 'GB')
- **search_lang**: Language for search results
- **ui_lang**: Language for user interface elements
- **count**: Number of results to return (1-20)
- **offset**: Pagination offset (0-9)
- **safesearch**: Content filtering level ('off', 'moderate', 'strict')
- **freshness**: Result freshness filter (preset values or custom date ranges)
- **text_decorations**: Include text decoration markers in results
- **spellcheck**: Enable automatic spell checking
- **goggles**: Array of goggle definitions for custom re-ranking
- **units**: Measurement units ('metric', 'imperial')
