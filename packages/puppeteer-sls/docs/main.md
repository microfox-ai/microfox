# @microfox/puppeteer-sls

This package provides functions to run Puppeteer on serverless environments like AWS Lambda.

## Installation

```bash
npm install @microfox/puppeteer-sls @sparticuz/chromium puppeteer-core
```

## Available Functions

### `openPage(options)`

Opens a new browser page and navigates to a URL.

- `options`:
  - `url` (string): The URL to navigate to.
  - `defaultViewport` (object, optional): Sets the viewport size.
  - `headless` (boolean, optional): Runs the browser in headless mode.

### `takeSnapShot(options)`

Takes a screenshot of a webpage.

- `options`:
  - Inherits all options from `openPage`.
  - `path` (string): The file path to save the screenshot.

### `extractWebpageContent(options)`

Extracts the text content from a webpage.

- `options`:
  - Inherits all options from `openPage`.

### `extractLinks(options)`

Extracts all hyperlink URLs from a webpage.

- `options`:
  - Inherits all options from `openPage`.

# Puppeteer SLS Provider

A simple and easy to use client for running Puppeteer on serverless functions.

## Installation

```
npm install @microfox/puppeteer-sls
```

## Usage

Import and initialize pupeteer.

```js
import { puppeteerLaunchProps } from '@microfox/puppeteer-sls';
import puppeteer from 'puppeteer-core';

(async () => {
  const launchProps = await puppeteerLaunchProps();
  const browser = await puppeteer.launch(launchProps);
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();
```
