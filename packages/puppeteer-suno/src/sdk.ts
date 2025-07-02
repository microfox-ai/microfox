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
    try {
      const isLocal =
        !!process.env.IS_OFFLINE || !!process.env.SERVERLESS_OFFLINE;
      const launchProps = await puppeteerLaunchProps(
        { width: 1280, height: 720 },
        isLocal,
        options?.headless,
      );

      this.browser = await puppeteer.launch({
        //...launchProps,
        executablePath: launchProps.executablePath,
        headless: launchProps.headless,
        slowMo: isLocal ? 50 : 0,
      });
      this.page = await this.browser.newPage();
      await this.page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      );
      await this.page.setViewport({ width: 1920, height: 1080 });
    } catch (error) {
      console.error('Failed to launch browser:', error);
      throw new Error('Failed to launch browser.');
    }
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

    console.log('Logging in', e, p);

    await this.page.goto('https://suno.com/', {
      // TODO: Check if this is the correct login page
      waitUntil: 'networkidle0',
    });

    console.log('Navigated to login page');

    // Click the "Sign In" button to open the login modal.
    const signInButtonXPath = `//button[.//span[normalize-space()='Sign In']]`;
    await (this.page as any).waitForXPath(signInButtonXPath);
    const [signInButton] = await (this.page as any).$x(signInButtonXPath);
    if (signInButton) {
      await signInButton.click();
    } else {
      throw new Error('Could not find "Sign In" button.');
    }

    // Wait for the login dialog to appear.
    await this.page.waitForSelector('.cl-modalContent');

    // Click the "Continue with Google" button.
    const googleButtonSelector = '.cl-socialButtonsIconButton__google';
    await this.page.waitForSelector(googleButtonSelector);

    const googlePagePromise = new Promise<Page>(resolve => {
      this.browser?.once('targetcreated', async target => {
        const newPage = await target.page();
        if (newPage) {
          resolve(newPage);
        }
      });
    });

    await this.page.click(googleButtonSelector);

    const googlePage = await googlePagePromise;
    if (!googlePage) {
      throw new Error('Google Login page not opened');
    }

    await googlePage.bringToFront();

    await googlePage.waitForSelector('input[type="email"]');
    await googlePage.type('input[type="email"]', e);

    const nextButtonXPath = `//button[.//span[normalize-space()='Next']]`;
    await (googlePage as any).waitForXPath(nextButtonXPath);
    const [nextButton] = await (googlePage as any).$x(nextButtonXPath);
    if (nextButton) {
      await nextButton.click();
    } else {
      throw new Error('Could not find "Next" button.');
    }

    await googlePage.waitForSelector('input[type="password"]', {
      visible: true,
    });
    await googlePage.type('input[type="password"]', p);

    await (googlePage as any).waitForXPath(nextButtonXPath);
    const [passwordNextButton] = await (googlePage as any).$x(nextButtonXPath);
    if (passwordNextButton) {
      await passwordNextButton.click();
    } else {
      throw new Error('Could not find "Next" button for password.');
    }

    // Wait for the original page to reflect the login status.
    await this.page.bringToFront();

    try {
      // Verify you are logged in by checking for this element.
      await this.page.waitForSelector(
        'button[data-testid="profile-menu-button"]',
        { timeout: 30000 },
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
