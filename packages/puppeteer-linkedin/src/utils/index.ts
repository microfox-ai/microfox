import * as fs from 'fs';
import * as path from 'path';
import { URL } from 'url';

export function urlToFolderPath(urlString: string, baseDir: string = 'outputs'): string {
  try {
    const url = new URL(urlString);
    // Remove leading/trailing slashes and split pathname
    const pathSegments = url.pathname.replace(/^\/|\/$/g, '').split('/');
    
    const dirPath = path.join(process.cwd(), baseDir, ...pathSegments);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    return dirPath;
  } catch (error) {
    console.error('Invalid URL:', urlString);
    // Return a default path or handle error as needed
    const defaultPath = path.join(process.cwd(), baseDir, 'invalid-urls');
    if (!fs.existsSync(defaultPath)) {
      fs.mkdirSync(defaultPath, { recursive: true });
    }
    return defaultPath;
  }
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 1000,
): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < retries - 1) {
        await delay(delayMs * Math.pow(2, i)); // Exponential backoff
      }
    }
  }
  throw lastError;
} 