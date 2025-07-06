# Retrieving Page Content in Notion

This guide explains how to retrieve page content in Notion using the Microfox Notion provider. The package provides convenient functions that handle all the complexity of retrieving and processing Notion page content.

## Quick Start

```typescript
import { NotionClient, getFullPageContent } from '@microfox/notion';

const notion = new NotionClient({
  auth: process.env.NOTION_TOKEN,
});

const fullContent = await getFullPageContent(
  notion,
  process.env.NOTION_PAGE_ID,
);
console.log(
  'Page title:',
  fullContent.page.properties.Name?.title?.[0]?.text?.content,
);
console.log('Text content:', fullContent.content.text);
```

## Available Functions

The package provides three main functions for retrieving page content:

### 1. `getFullPageContent(notion, pageId)`

Retrieves complete page content including properties and all processed blocks.

```typescript
import { NotionClient, getFullPageContent } from '@microfox/notion';

const notion = new NotionClient({
  auth: process.env.NOTION_TOKEN,
});

const fullContent = await getFullPageContent(
  notion,
  process.env.NOTION_PAGE_ID,
);

// Access page properties
console.log('Page ID:', fullContent.page.id);
console.log('Created:', fullContent.page.created_time);
console.log('Last edited:', fullContent.page.last_edited_time);

// Access processed content
console.log('Text content:', fullContent.content.text);
console.log('Number of images:', fullContent.content.images.length);
console.log('Number of code blocks:', fullContent.content.codeBlocks.length);
console.log('Number of tables:', fullContent.content.tables.length);
console.log('Number of lists:', fullContent.content.lists.length);

// Access raw blocks if needed
console.log('Total blocks:', fullContent.blocks.length);
```

### 2. `getPageTextContent(notion, pageId)`

Retrieves only the text content from a page (faster for text-only needs).

```typescript
import { NotionClient, getPageTextContent } from '@microfox/notion';

const notion = new NotionClient({
  auth: process.env.NOTION_TOKEN,
});

const textContent = await getPageTextContent(
  notion,
  process.env.NOTION_PAGE_ID,
);
console.log('Page text:', textContent);
```

### 3. `getPageImages(notion, pageId)`

Retrieves only the images from a page.

```typescript
import { NotionClient, getPageImages } from '@microfox/notion';

const notion = new NotionClient({
  auth: process.env.NOTION_TOKEN,
});

const images = await getPageImages(notion, process.env.NOTION_PAGE_ID);
images.forEach(img => {
  console.log('Image URL:', img.url);
  console.log('Caption:', img.caption);
  console.log('Type:', img.type);
  if (img.expiryTime) {
    console.log('Expires:', img.expiryTime);
  }
});
```

## Content Structure

The `getFullPageContent` function returns a structured object with the following content types:

### Text Content

All text from paragraphs, headings, and other text blocks combined into a single string.

```typescript
const fullContent = await getFullPageContent(notion, pageId);
console.log('Text content:', fullContent.content.text);
```

### Images

Array of image objects with URLs, captions, and metadata.

```typescript
const fullContent = await getFullPageContent(notion, pageId);
fullContent.content.images.forEach(img => {
  console.log('URL:', img.url);
  console.log('Caption:', img.caption);
  console.log('Type:', img.type); // 'external' or 'file'
  if (img.expiryTime) {
    console.log('Expires:', img.expiryTime);
  }
});
```

### Code Blocks

Array of code blocks with content and language information.

```typescript
const fullContent = await getFullPageContent(notion, pageId);
fullContent.content.codeBlocks.forEach(code => {
  console.log('Language:', code.language);
  console.log('Content:', code.content);
});
```

### Tables

Array of table objects with structure and row data.

```typescript
const fullContent = await getFullPageContent(notion, pageId);
fullContent.content.tables.forEach(table => {
  console.log('Has column header:', table.hasColumnHeader);
  console.log('Has row header:', table.hasRowHeader);
  console.log('Table width:', table.tableWidth);
  console.log('Number of rows:', table.rows.length);
});
```

### Lists

Array of list items (bulleted and numbered).

```typescript
const fullContent = await getFullPageContent(notion, pageId);
fullContent.content.lists.forEach(list => {
  console.log('Type:', list.type); // 'bulleted_list_item' or 'numbered_list_item'
  console.log('Content:', list.content);
});
```

## Type Definitions

The functions use TypeScript interfaces for type safety:

```typescript
import {
  NotionClient,
  getFullPageContent,
  type FullPageContent,
  type ProcessedContent,
} from '@microfox/notion';

const notion = new NotionClient({
  auth: process.env.NOTION_TOKEN,
});

const fullContent: FullPageContent = await getFullPageContent(notion, pageId);
const content: ProcessedContent = fullContent.content;
```

### Interface Definitions

```typescript
interface FullPageContent {
  page: GetPageResponse; // Raw page data from Notion API
  blocks: any[]; // Raw block data from Notion API
  content: ProcessedContent; // Processed and structured content
}

interface ProcessedContent {
  text: string; // Combined text content
  images: Array<{
    // Image objects
    type: 'external' | 'file';
    url: string;
    caption: string;
    expiryTime?: string;
  }>;
  codeBlocks: Array<{
    // Code block objects
    content: string;
    language: string;
  }>;
  tables: Array<{
    // Table objects
    hasColumnHeader: boolean;
    hasRowHeader: boolean;
    tableWidth: number;
    rows: any[];
  }>;
  lists: Array<{
    // List item objects
    type: string;
    content: string;
  }>;
}
```

## Practical Examples

### Example 1: Extract Article Content

```typescript
import { NotionClient, getFullPageContent } from '@microfox/notion';

const notion = new NotionClient({
  auth: process.env.NOTION_TOKEN,
});

async function extractArticleContent(pageId: string) {
  const fullContent = await getFullPageContent(notion, pageId);

  return {
    title: fullContent.page.properties.Name?.title?.[0]?.text?.content || '',
    text: fullContent.content.text,
    images: fullContent.content.images.map(img => img.url),
    codeSnippets: fullContent.content.codeBlocks.map(code => ({
      language: code.language,
      content: code.content,
    })),
  };
}

const article = await extractArticleContent(process.env.NOTION_PAGE_ID);
console.log('Article title:', article.title);
console.log('Article text:', article.text);
console.log('Image URLs:', article.images);
```

### Example 2: Process Multiple Pages

```typescript
import { NotionClient, getPageTextContent } from '@microfox/notion';

const notion = new NotionClient({
  auth: process.env.NOTION_TOKEN,
});

async function processPages(pageIds: string[]) {
  const results = [];

  for (const pageId of pageIds) {
    try {
      const textContent = await getPageTextContent(notion, pageId);
      results.push({
        pageId,
        content: textContent,
        wordCount: textContent.split(/\s+/).length,
      });
    } catch (error) {
      console.error(`Error processing page ${pageId}:`, error);
      results.push({
        pageId,
        content: '',
        wordCount: 0,
        error: error.message,
      });
    }
  }

  return results;
}

const pageIds = [
  process.env.NOTION_PAGE_ID_1,
  process.env.NOTION_PAGE_ID_2,
  process.env.NOTION_PAGE_ID_3,
];

const processedPages = await processPages(pageIds);
processedPages.forEach(page => {
  console.log(`Page ${page.pageId}: ${page.wordCount} words`);
});
```

### Example 3: Extract Images with Metadata

```typescript
import { NotionClient, getPageImages } from '@microfox/notion';

const notion = new NotionClient({
  auth: process.env.NOTION_TOKEN,
});

async function extractImagesWithMetadata(pageId: string) {
  const images = await getPageImages(notion, pageId);

  return images.map(img => ({
    url: img.url,
    caption: img.caption,
    type: img.type,
    isExternal: img.type === 'external',
    hasExpiry: !!img.expiryTime,
    expiryTime: img.expiryTime,
  }));
}

const images = await extractImagesWithMetadata(process.env.NOTION_PAGE_ID);
images.forEach(img => {
  console.log(`Image: ${img.url}`);
  console.log(`  Caption: ${img.caption}`);
  console.log(`  Type: ${img.type}`);
  if (img.hasExpiry) {
    console.log(`  Expires: ${img.expiryTime}`);
  }
});
```

## Error Handling

All functions include proper error handling:

```typescript
import { NotionClient, getFullPageContent } from '@microfox/notion';

const notion = new NotionClient({
  auth: process.env.NOTION_TOKEN,
});

try {
  const fullContent = await getFullPageContent(
    notion,
    process.env.NOTION_PAGE_ID,
  );
  console.log('Successfully retrieved page content');
} catch (error) {
  if (error.code === 'not_found') {
    console.error('Page not found or not accessible');
  } else if (error.code === 'unauthorized') {
    console.error('Check your Notion token and permissions');
  } else if (error.code === 'forbidden') {
    console.error('Integration lacks read content capabilities');
  } else {
    console.error('Error retrieving page:', error);
  }
}
```

## Performance Considerations

- **`getFullPageContent`**: Use when you need complete page data and processed content
- **`getPageTextContent`**: Use when you only need text content (faster)
- **`getPageImages`**: Use when you only need images (faster)

The functions automatically handle pagination for pages with many blocks, so you don't need to worry about content limits.

## Requirements

- **Notion Integration Token**: Required for authentication
- **Page Access**: The page must be shared with your integration
- **Read Permissions**: Your integration must have read content capabilities

## Integration Setup

1. Create a Notion integration at [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Copy your integration token
3. Share the pages you want to access with your integration
4. Use the token in your code:

```typescript
const notion = new NotionClient({
  auth: process.env.NOTION_TOKEN, // Your integration token
});
```
