// Main SDK class/functions
import { puppeteerLaunchProps } from '@microfox/puppeteer-sls';
import puppeteer, { Browser, Page } from 'puppeteer-core';
import dotenv from 'dotenv';

dotenv.config();

export class SunoAuthenticated {
  /**
   * The Puppeteer browser instance.
   */
  public browser: Browser | null = null;
  /**
   * The Puppeteer page instance.
   */
  public page: Page | null = null;

  private cookies: any;
  public isLoggedIn = false;

  private _email?: string;
  private _password?: string;
  private _loginOptions?: { headless?: boolean; providerType?: 'google' };

  constructor(
    email?: string,
    password?: string,
    options?: { headless?: boolean; providerType?: 'google' },
  ) {
    this._email = email;
    this._password = password;
    this._loginOptions = {
      ...options,
      providerType: 'google', // For now, only Google is supported.
    };
  }

  async launch(options?: { headless?: boolean }) {
    const launchProps = await puppeteerLaunchProps();
    const isLocal = process.env.IS_OFFLINE || process.env.SERVERLESS_OFFLINE;

    this.browser = await puppeteer.launch({
      ...launchProps,
      headless: options?.headless ?? true,
      slowMo: isLocal ? 50 : 0,
    });
    this.page = await this.browser.newPage();
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async goto(url: string, options?: Parameters<Page['goto']>[1]) {
    if (!this.page) {
      throw new Error('Page not initialized. Call launch() first.');
    }
    return this.page.goto(url, options);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  private async _ensureLoggedIn() {
    if (this.isLoggedIn) {
      return;
    }

    if (this._email && this._password) {
      await this.login(this._email, this._password, this._loginOptions);
    } else {
      throw new Error(
        'Not logged in. Please call login() with credentials first, or provide them in the constructor.',
      );
    }
  }

  async login(
    email?: string,
    password_string?: string,
    options?: {
      headless?: boolean;
      providerType?: 'google';
    },
  ) {
    // If credentials are not passed, try to use the ones from the constructor
    const e = email || this._email;
    const p = password_string || this._password;
    const o = options || this._loginOptions;

    if (!e || !p) {
      throw new Error('Email and password are required for login.');
    }

    this._email = e;
    this._password = p;
    this._loginOptions = o;

    if (!this.page) {
      console.log('Launching browser');
      await this.launch(o);
    }

    if (!this.page) {
      throw new Error('Page not initialized');
    }

    await this.page.goto('https://suno.ai/', {
      // TODO: Check if this is the correct login page
      waitUntil: 'domcontentloaded',
    });

    // TODO: The following selectors are placeholders. I need the actual selectors from the user.
    await this.page.waitForSelector('input#username_placeholder');
    await this.page.type('input#username_placeholder', e);
    await this.page.waitForSelector('input#password_placeholder');
    await this.page.type('input#password_placeholder', p);

    await this.page.click('button[type="submit"]');

    await new Promise(resolve => setTimeout(resolve, 10000));

    try {
      // TODO: This is a placeholder. I need a selector to confirm login was successful.
      await this.page.waitForSelector(
        'div#successful_login_selector_placeholder',
        { timeout: 15000 },
      );
      console.log('Login successful');
    } catch (error) {
      console.error(
        'Login failed. Could not find feed selector. Saving screenshot to login-failure.png',
      );
      if (this.page) {
        await this.page.screenshot({ path: 'login-failure.png' });
      }
      throw new Error(
        'Login failed. You might be blocked by a captcha or have incorrect credentials.',
      );
    }

    this.isLoggedIn = true;
    this.cookies = await this.page.cookies();
  }

  getCookies() {
    return this.cookies;
  }

  async setCookies(cookies: any) {
    this.cookies = cookies;
    if (this.page && this.cookies) {
      await this.page.setCookie(...this.cookies);
      this.isLoggedIn = true;
    }
  }
}
