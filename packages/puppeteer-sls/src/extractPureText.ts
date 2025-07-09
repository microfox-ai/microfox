// import { openPage, OpenPageOptions } from './openPage';
// import { JSDOM } from 'jsdom';
// import { Readability } from '@mozilla/readability';

// /**
//  * Opens a page and extracts its "pure" text content using Mozilla's Readability library.
//  *
//  * @param options - The options for opening the page.
//  * @returns A promise that resolves to the pure text content of the page.
//  */
// export async function extractPureText(options: OpenPageOptions) {
//   const { browser, page } = await openPage(options);
//   const html = await page.evaluate(() => document.documentElement.outerHTML);

//   const doc = new JSDOM(html, {
//     url: page.url(),
//   });

//   const reader = new Readability(doc.window.document);
//   const article = reader.parse();

//   await browser.close();

//   return article?.textContent || '';
// }
