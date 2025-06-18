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
