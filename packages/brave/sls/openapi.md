# Microfox Brave SDK API

This agent provides a comprehensive interface for interacting with the Brave SDK API. It's a single entry-point API for all Microfox Brave SDK functions, exposed via a wrapper Lambda. This allows you to perform various operations such as image search, news search, video search, and web search with powerful filtering and customization options.

## Functionality

The API provides the following functionalities:

### 1. Image Search (`/imageSearch`)

**Summary:** The imageSearch function performs image searches using the Brave Search API, allowing users to find and retrieve images based on specified search queries and optional parameters.

**Description:** The imageSearch function enables users to search for images using the Brave Search API with customizable parameters. It supports various search criteria including query text, country, language, result count, and content filtering options. The function returns a Promise that resolves to an ImageSearchApiResponse object containing detailed information about the search results and query metadata.

### 2. News Search (`/newsSearch`)

**Summary:** Perform a news search using the Brave Search API.

**Description:** This function allows users to search for news articles using the Brave Search API. It provides a wide range of parameters to customize the search, including query, country, language, and result filtering options. The function returns a promise that resolves to a detailed news search response containing article information and metadata.

### 3. Video Search (`/videoSearch`)

**Summary:** Performs a video search using the Brave Search API, retrieving video results with detailed metadata and thumbnails.

**Description:** The videoSearch function allows users to search for videos using the Brave Search API. It provides a wide range of customizable search parameters, including query, country, language, result count, and various filters. The function returns detailed video results including metadata, thumbnails, and related information.

### 4. Web Search (`/webSearch`)

**Summary:** Performs a web search using the Brave Search API and returns comprehensive search results.

**Description:** This function allows users to conduct web searches using the Brave Search API, providing access to a wide range of content including web pages, news, videos, discussions, and FAQs. It offers extensive customization options for refining search parameters and supports both single and batch search operations with optional progress tracking.