import { Client } from '@notionhq/client';
import type {
  GetPageResponse,
  ListBlockChildrenResponse,
} from '@notionhq/client/build/src/api-endpoints.js';

export interface ProcessedContent {
  text: string;
  images: Array<{
    type: 'external' | 'file';
    url: string;
    caption: string;
    expiryTime?: string;
  }>;
  codeBlocks: Array<{
    content: string;
    language: string;
  }>;
  tables: Array<{
    hasColumnHeader: boolean;
    hasRowHeader: boolean;
    tableWidth: number;
    rows: any[];
  }>;
  lists: Array<{
    type: string;
    content: string;
  }>;
}

export interface FullPageContent {
  page: GetPageResponse;
  blocks: any[];
  content: ProcessedContent;
}

/**
 * Process a text block (paragraph, heading) and extract its content
 */
function processTextBlock(block: any): string {
  if (block.type === 'paragraph' || block.type.startsWith('heading_')) {
    const richText = block[block.type]?.rich_text || [];
    return richText.map((text: any) => text.text.content).join('');
  }
  return '';
}

/**
 * Process a list block (bulleted or numbered) and extract its content
 */
function processListBlock(block: any): string {
  if (
    block.type === 'bulleted_list_item' ||
    block.type === 'numbered_list_item'
  ) {
    const richText = block[block.type]?.rich_text || [];
    return richText.map((text: any) => text.text.content).join('');
  }
  return '';
}

/**
 * Process a code block and extract its content and language
 */
function processCodeBlock(
  block: any,
): { content: string; language: string } | null {
  if (block.type === 'code') {
    const richText = block.code?.rich_text || [];
    const content = richText.map((text: any) => text.text.content).join('');
    const language = block.code?.language || 'plain text';
    return { content, language };
  }
  return null;
}

/**
 * Process an image block and extract its URL and caption
 */
function processImageBlock(block: any): {
  type: 'external' | 'file';
  url: string;
  caption: string;
  expiryTime?: string;
} | null {
  if (block.type === 'image') {
    const image = block.image;
    if (image.type === 'external') {
      return {
        type: 'external',
        url: image.external.url,
        caption: image.caption?.[0]?.text?.content || '',
      };
    } else if (image.type === 'file') {
      return {
        type: 'file',
        url: image.file.url,
        expiryTime: image.file.expiry_time,
        caption: image.caption?.[0]?.text?.content || '',
      };
    }
  }
  return null;
}

/**
 * Process a table block and extract its structure and data
 */
function processTableBlock(block: any): {
  hasColumnHeader: boolean;
  hasRowHeader: boolean;
  tableWidth: number;
  rows: any[];
} | null {
  if (block.type === 'table') {
    return {
      hasColumnHeader: block.table.has_column_header,
      hasRowHeader: block.table.has_row_header,
      tableWidth: block.table.table_width,
      rows: block.table.children?.results || [],
    };
  }
  return null;
}

/**
 * Process all blocks and extract structured content
 */
function processBlocks(blocks: any[]): ProcessedContent {
  const content: ProcessedContent = {
    text: '',
    images: [],
    codeBlocks: [],
    tables: [],
    lists: [],
  };

  blocks.forEach(block => {
    switch (block.type) {
      case 'paragraph':
      case 'heading_1':
      case 'heading_2':
      case 'heading_3':
        const text =
          block[block.type]?.rich_text
            ?.map((t: any) => t.text.content)
            .join('') || '';
        content.text += text + '\n';
        break;

      case 'image':
        const imageInfo = processImageBlock(block);
        if (imageInfo) content.images.push(imageInfo);
        break;

      case 'code':
        const codeInfo = processCodeBlock(block);
        if (codeInfo) content.codeBlocks.push(codeInfo);
        break;

      case 'table':
        const tableInfo = processTableBlock(block);
        if (tableInfo) content.tables.push(tableInfo);
        break;

      case 'bulleted_list_item':
      case 'numbered_list_item':
        const listItem = processListBlock(block);
        content.lists.push({ type: block.type, content: listItem });
        break;
    }
  });

  return content;
}

/**
 * Retrieve a complete Notion page including properties and all content blocks
 *
 * @param notion - The Notion client instance
 * @param pageId - The ID of the page to retrieve
 * @returns Promise<FullPageContent> - The complete page content with processed blocks
 *
 * @example
 * ```typescript
 * import { NotionClient, getFullPageContent } from '@microfox/notion';
 *
 * const notion = new NotionClient({
 *   auth: process.env.NOTION_TOKEN,
 * });
 *
 * const fullContent = await getFullPageContent(notion, process.env.NOTION_PAGE_ID);
 * console.log('Page title:', fullContent.page.properties.Name?.title?.[0]?.text?.content);
 * console.log('Text content:', fullContent.content.text);
 * console.log('Number of images:', fullContent.content.images.length);
 * ```
 */
export async function getFullPageContent(
  notion: Client,
  pageId: string,
): Promise<FullPageContent> {
  try {
    // Get page properties
    const page = await notion.pages.retrieve({
      page_id: pageId,
    });

    // Get all content blocks using pagination
    const allBlocks = [];
    let hasMore = true;
    let startCursor: string | undefined = undefined;

    while (hasMore) {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: startCursor,
        page_size: 100, // Maximum allowed
      });

      allBlocks.push(...response.results);
      hasMore = response.has_more;
      startCursor = response.next_cursor || undefined;
    }

    return {
      page,
      blocks: allBlocks,
      content: processBlocks(allBlocks),
    };
  } catch (error) {
    console.error('Error retrieving page:', error);
    throw error;
  }
}

/**
 * Retrieve only the text content from a Notion page
 *
 * @param notion - The Notion client instance
 * @param pageId - The ID of the page to retrieve
 * @returns Promise<string> - The extracted text content
 *
 * @example
 * ```typescript
 * import { NotionClient, getPageTextContent } from '@microfox/notion';
 *
 * const notion = new NotionClient({
 *   auth: process.env.NOTION_TOKEN,
 * });
 *
 * const textContent = await getPageTextContent(notion, process.env.NOTION_PAGE_ID);
 * console.log('Page text:', textContent);
 * ```
 */
export async function getPageTextContent(
  notion: Client,
  pageId: string,
): Promise<string> {
  const fullContent = await getFullPageContent(notion, pageId);
  return fullContent.content.text;
}

/**
 * Retrieve only the images from a Notion page
 *
 * @param notion - The Notion client instance
 * @param pageId - The ID of the page to retrieve
 * @returns Promise<Array> - Array of image objects with URLs and captions
 *
 * @example
 * ```typescript
 * import { NotionClient, getPageImages } from '@microfox/notion';
 *
 * const notion = new NotionClient({
 *   auth: process.env.NOTION_TOKEN,
 * });
 *
 * const images = await getPageImages(notion, process.env.NOTION_PAGE_ID);
 * images.forEach(img => console.log('Image URL:', img.url));
 * ```
 */
export async function getPageImages(
  notion: Client,
  pageId: string,
): Promise<ProcessedContent['images']> {
  const fullContent = await getFullPageContent(notion, pageId);
  return fullContent.content.images;
}
