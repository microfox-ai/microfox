# Hyperbrowser Node SDK

Checkout the full documentation [here](https://docs.hyperbrowser.ai/)

## Installation

Hyperbrowser can be installed via npm by running:

```bash
npm install @hyperbrowser/sdk
```
or
```bash
yarn add @hyperbrowser/sdk
```

## Usage

### Playwright
```typescript
import { chromium } from "playwright-core";
import { Hyperbrowser } from "@hyperbrowser/sdk";
import { config } from "dotenv";

config();

const client = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});

const main = async () => {
  const session = await client.sessions.create();

  try {
    const browser = await chromium.connectOverCDP(session.wsEndpoint);

    const defaultContext = browser.contexts()[0];
    const page = await defaultContext.newPage();

    // Navigate to a website
    console.log("Navigating to Hacker News...");
    await page.goto("https://news.ycombinator.com/");
    const pageTitle = await page.title();
    console.log("Page 1:", pageTitle);
    await page.evaluate(() => {
      console.log("Page 1:", document.title);
    });

    await page.goto("https://example.com");
    console.log("Page 2:", await page.title());
    await page.evaluate(() => {
      console.log("Page 2:", document.title);
    });

    await page.goto("https://apple.com");
    console.log("Page 3:", await page.title());
    await page.evaluate(() => {
      console.log("Page 3:", document.title);
    });

    await page.goto("https://google.com");
    console.log("Page 4:", await page.title());
    await page.evaluate(() => {
      console.log("Page 4:", document.title);
    });
  } catch (err) {
    console.error(`Encountered error: ${err}`);
  } finally {
    await client.sessions.stop(session.id);
  }
};

main();
```

### Puppeteer
```typescript
import { connect } from "puppeteer-core";
import { Hyperbrowser } from "@hyperbrowser/sdk";
import { config } from "dotenv";

config();

const client = new Hyperbrowser({
  apiKey: process.env.HYPERBROWSER_API_KEY,
});

const main = async () => {
  const session = await client.sessions.create();

  try {
    const browser = await connect({
      browserWSEndpoint: session.wsEndpoint,
      defaultViewport: null,
    });

    const [page] = await browser.pages();

    // Navigate to a website
    console.log("Navigating to Hacker News...");
    await page.goto("https://news.ycombinator.com/");
    const pageTitle = await page.title();
    console.log("Page 1:", pageTitle);
    await page.evaluate(() => {
      console.log("Page 1:", document.title);
    });

    await page.goto("https://example.com");
    console.log("Page 2:", await page.title());
    await page.evaluate(() => {
      console.log("Page 2:", document.title);
    });

    await page.goto("https://apple.com");
    console.log("Page 3:", await page.title());
    await page.evaluate(() => {
      console.log("Page 3:", document.title);
    });

    await page.goto("https://google.com");
    console.log("Page 4:", await page.title());
    await page.evaluate(() => {
      console.log("Page 4:", document.title);
    });
  } catch (err) {
    console.error(`Encountered error: ${err}`);
  } finally {
    await client.sessions.stop(session.id);
  }
};

main();
```
