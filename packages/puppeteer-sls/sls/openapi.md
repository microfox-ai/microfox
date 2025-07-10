# Microfox Puppeteer SLS Provider API

This agent provides a comprehensive interface for interacting with the Puppeteer SLS Provider API. It's a single entry-point API for all Microfox Puppeteer SLS Provider SDK functions, exposed via a wrapper Lambda. This allows you to perform various operations such as extracting images and links from URLs, extracting webpage content in various formats, opening web pages for scraping tasks, and taking screenshots of webpages, with powerful filtering and customization options.

## Functionality

The API provides the following functionalities:

### 1. Extract Images From U R L (`/extractImagesFromURL`)

**Summary:** Extracts image data from a specified URL using Puppeteer.

**Description:** The extractImagesFromURL function is a convenience wrapper that opens a URL, extracts images, and closes the browser. It's designed for single-use scraping tasks, returning detailed information about images found on the webpage. This function utilizes Puppeteer to render the page and extract image data including src, srcset, responsive images, and alt text.

### 2. Extract Links From Url (`/extractLinksFromUrl`)

**Summary:** Extracts hyperlink data from a specified URL

**Description:** The extractLinksFromUrl function is a convenience wrapper that opens a given URL, extracts all hyperlinks from the webpage, and then closes the browser. It returns detailed information about each extracted link, including its href, display name, type, and various boolean flags indicating the link's characteristics.

### 3. Extract Webpage (`/extractWebpage`)

**Summary:** Extracts content from a webpage in various formats.

**Description:** This function opens a URL and extracts text content, with options to also extract Markdown and HTML content. It provides a convenient wrapper for web scraping tasks, opening its own browser instance and handling page navigation.

### 4. Open Page (`/openPage`)

**Summary:** Opens a new browser page and navigates to a specified URL.

**Description:** This function is the entry point for most web scraping tasks. It initializes a new browser instance, creates a page, and navigates to the provided URL. The function allows customization of viewport dimensions, headless mode, and local execution settings.

### 5. Take Snap Shot (`/takeSnapShot`)

**Summary:** Takes a screenshot of a web page and uploads it to S3-compatible storage.

**Description:** This function opens a specified web page, captures a screenshot, and uploads it to an S3-compatible storage space. It returns the public URL of the uploaded image. The function is designed for single-use operations, opening and closing its own browser instance for each invocation.