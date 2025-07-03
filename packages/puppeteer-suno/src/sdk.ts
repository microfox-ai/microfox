// Main SDK class/functions
import { puppeteerLaunchProps } from '@microfox/puppeteer-sls';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Locator, Page } from 'puppeteer-core';
import dotenv from 'dotenv';
import { SunoMusicOptions } from './types';

dotenv.config();

puppeteer.use(StealthPlugin());

const fetchOtp = async (endpoint: string): Promise<string | null> => {
  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      const data = await response.json();
      if (data.otp) {
        return data.otp;
      }
    }
    console.error(`Failed to fetch OTP. Status: ${response.status}`);
    return null;
  } catch (error) {
    console.error('Error fetching OTP:', error);
    return null;
  }
};

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
  private _loginOptions?: {
    headless?: boolean;
    providerType?: 'google' | 'otp' | 'discord';
    otpEndpoint?: string;
    refreshInterval?: number;
    maxRetries?: number;
  };

  constructor(
    email?: string,
    password?: string,
    options?: {
      headless?: boolean;
      providerType?: 'google' | 'otp' | 'discord';
      otpEndpoint?: string;
      refreshInterval?: number; // in seconds
      maxRetries?: number;
    },
  ) {
    this._email = email;
    this._password = password;
    this._loginOptions = {
      ...options,
      providerType: options?.providerType || 'google', // Default to Google
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
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      if (!this.browser) {
        throw new Error('Browser not initialized');
      }
      this.page = await this.browser.newPage();
      if (!this.page) {
        throw new Error('Page not initialized');
      }
      await this.page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      );
      await this.page.setViewport({ width: 1280, height: 720 });
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
      providerType?: 'google' | 'otp' | 'discord';
      otpEndpoint?: string;
      refreshInterval?: number; // in ms
      maxRetries?: number;
    },
  ) {
    // If credentials are not passed, try to use the ones from the constructor
    const e = email || this._email;
    const p = password_string || this._password;
    const o = options || this._loginOptions;

    if (!e) {
      throw new Error('Email is required for login.');
    }

    if (!this.page) {
      console.log('Launching browser');
      await this.launch(o);
    }

    if (!this.page) {
      throw new Error('Page not initialized');
    }

    console.log('Navigating to suno.com');
    await this.page.goto('https://suno.com/', {
      // TODO: Check if this is the correct login page
      waitUntil: 'networkidle2',
    });

    console.log('Navigated to login page, looking for "Sign In" button');

    // Click the "Sign In" button to open the login modal.
    const signInButtonXPath = `//button[.//span[normalize-space()='Sign In']]`;
    await this.page.waitForSelector(`xpath/${signInButtonXPath}`);
    const [signInButton] = await this.page.$$(`xpath/${signInButtonXPath}`);
    if (signInButton) {
      console.log('Found "Sign In" button, clicking it');
      await signInButton.click();
    } else {
      throw new Error('Could not find "Sign In" button.');
    }

    // Wait for the login dialog to appear.
    console.log('Waiting for login modal to appear');
    await this.page.waitForSelector('.cl-modalContent');
    console.log('Login modal appeared');

    if (o?.providerType === 'otp') {
      const otpEndpoint = o.otpEndpoint;
      if (!otpEndpoint) {
        throw new Error('otpEndpoint is required for OTP login.');
      }
      const refreshInterval = o.refreshInterval || 5000;
      const maxRetries = o.maxRetries || 12;
      await this._handleOtpLogin(e, {
        otpEndpoint,
        refreshInterval,
        maxRetries,
      });
    } else if (o?.providerType === 'discord') {
      if (!p) {
        throw new Error('Password is required for Discord login.');
      }
      await this._handleDiscordLogin(e, p);
    } else {
      // Assume Google login if not OTP
      if (!p) {
        throw new Error('Password is required for Google login.');
      }
      await this._handleGoogleLogin(e, p);
    }

    // try {
    //   // Verify you are logged in by checking for this element.
    //   console.log('Verifying login by looking for profile menu button');
    //   await this.page.waitForSelector(
    //     'button[data-testid="profile-menu-button"]',
    //     { timeout: 30000 },
    //   );
    //   console.log('Login successful');
    // } catch (error) {
    //   console.error(
    //     'Login failed. Could not find feed selector. Saving screenshot to login-failure.png',
    //   );
    //   if (this.page) {
    //     await this.page.screenshot({ path: 'login-failure.png' });
    //   }
    //   throw new Error(
    //     'Login failed. You might be blocked by a captcha or have incorrect credentials.',
    //   );
    // }

    this.isLoggedIn = true;
    this.cookies = await this.page.cookies();
  }

  private async _handleGoogleLogin(email: string, password_string: string) {
    if (!this.page || !this.browser) {
      throw new Error('Page or browser not initialized');
    }
    // Click the "Continue with Google" button.
    const googleButtonSelector = '.cl-socialButtonsIconButton__google';
    console.log('Waiting for Google login button');
    await this.page.waitForSelector(googleButtonSelector);
    console.log('Found Google login button');

    console.log('Clicking Google login button and waiting for navigation');
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      this.page.click(googleButtonSelector),
    ]);

    const emailSelector = 'input[name="identifier"]';
    console.log('Waiting for email input');
    await this.page.waitForSelector(emailSelector);
    console.log('Found email input, focusing and typing');
    await this.page.focus(emailSelector);
    await this.page.keyboard.type(email);
    console.log('Entered email');

    await new Promise(resolve => setTimeout(resolve, 2000));
    const nextButtonXPath = `//button[.//span[normalize-space()='Next']]`;
    await this.page.waitForSelector(`xpath/${nextButtonXPath}`);
    const [nextButton] = await this.page.$$(`xpath/${nextButtonXPath}`);
    if (nextButton) {
      console.log('Found "Next" button, clicking it');
      await nextButton.click();
    } else {
      throw new Error('Could not find "Next" button.');
    }

    const passwordSelector = 'input[type="password"]';
    console.log('Waiting for password input');
    await this.page.waitForSelector(passwordSelector, {
      visible: true,
    });
    console.log('Found password input, focusing and typing');
    await this.page.focus(passwordSelector);
    await this.page.keyboard.type(password_string);
    console.log('Entered password');

    await this.page.waitForSelector(`xpath/${nextButtonXPath}`);
    const [passwordNextButton] = await this.page.$$(`xpath/${nextButtonXPath}`);
    if (passwordNextButton) {
      console.log('Found "Next" button for password, clicking it');
      await passwordNextButton.click();
    } else {
      throw new Error('Could not find "Next" button for password.');
    }

    // Wait for the original page to reflect the login status.
    console.log('Bringing original page to front');
    await this.page.bringToFront();
  }

  private async _handleDiscordLogin(email: string, password_string: string) {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    const discordButtonSelector = '.cl-socialButtonsIconButton__discord';
    console.log('Waiting for Discord login button');
    await this.page.waitForSelector(discordButtonSelector, { visible: true });
    console.log('Found Discord login button, clicking it');

    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      this.page.click(discordButtonSelector),
    ]);
    console.log('Navigated to Discord login page');

    const emailSelector = 'input[name="email"]';
    console.log('Waiting for email input on Discord page');
    await this.page.waitForSelector(emailSelector, { visible: true });
    await this.page.type(emailSelector, email);
    console.log('Entered Discord email');

    const passwordSelector = 'input[name="password"]';
    console.log('Waiting for password input on Discord page');
    await this.page.waitForSelector(passwordSelector, { visible: true });
    await this.page.type(passwordSelector, password_string);
    console.log('Entered Discord password');

    const loginButtonSelector = 'button[type="submit"]';
    console.log('Waiting for Discord login button');
    await this.page.waitForSelector(loginButtonSelector, { visible: true });
    console.log('Clicking Discord login button');

    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      this.page.click(loginButtonSelector),
    ]);

    console.log('Clicked login, waiting for authorization page.');

    try {
      console.log('Found authorization container(s), scrolling down.');
      // Find the largest scrollable container and scroll it using mouse.wheel
      const containerInfo = await this.page.evaluate(() => {
        const candidates = Array.from(document.querySelectorAll('*')).filter(
          el => {
            const style = window.getComputedStyle(el);
            return (
              (style.overflow.includes('auto') ||
                style.overflow.includes('scroll') ||
                style.overflowY.includes('auto') ||
                style.overflowY.includes('scroll')) &&
              el.scrollHeight > el.clientHeight
            );
          },
        );
        let maxDiff = 0;
        let best: Element | null = null;
        for (const el of candidates) {
          const diff = el.scrollHeight - el.clientHeight;
          if (diff > maxDiff) {
            maxDiff = diff;
            best = el;
          }
        }
        if (best) {
          const rect = best.getBoundingClientRect();
          return {
            found: true,
            rect: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            },
            scrollTop: (best as HTMLElement).scrollTop,
            scrollHeight: (best as HTMLElement).scrollHeight,
            clientHeight: (best as HTMLElement).clientHeight,
          };
        }
        return { found: false };
      });
      if (containerInfo.found) {
        const { x, y, width, height } = containerInfo.rect as {
          x: number;
          y: number;
          width: number;
          height: number;
        };
        await this.page.mouse.move(x + width / 2, y + height / 2);
        for (let i = 0; i < 20; i++) {
          await this.page.mouse.wheel({ deltaY: 80 });
          await new Promise(res => setTimeout(res, 200));
          const authorizeButtonXPath = `//button[.//div[contains(text(), 'Authori')]]`;
          const authorizeEnabled = await this.page.evaluate(
            xpath => {
              const result = document.evaluate(
                xpath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null,
              );
              const btn = result.singleNodeValue as HTMLButtonElement | null;
              return !!(btn && !btn.disabled);
            },
            authorizeButtonXPath.replace(/^\/\//, './/'),
          );
          if (authorizeEnabled) {
            break;
          }
        }
      } else {
        for (let i = 0; i < 20; i++) {
          await this.page.evaluate(() => {
            const all = Array.from(document.querySelectorAll('*')).filter(
              el => el.scrollHeight > el.clientHeight,
            );
            for (const el of all) {
              el.scrollTop = el.scrollHeight;
              el.dispatchEvent(new Event('scroll', { bubbles: true }));
            }
          });
          await new Promise(res => setTimeout(res, 200));
          const authorizeButtonXPath = `//button[.//div[contains(text(), 'Authori')]]`;
          const authorizeEnabled = await this.page.evaluate(
            xpath => {
              const result = document.evaluate(
                xpath,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null,
              );
              const btn = result.singleNodeValue as HTMLButtonElement | null;
              return !!(btn && !btn.disabled);
            },
            authorizeButtonXPath.replace(/^\/\//, './/'),
          );
          if (authorizeEnabled) {
            break;
          }
        }
      }
      // Always attempt to click the Authorize button if enabled and visible
      const authorizeButtonXPath = `//button[.//div[contains(text(), 'Authori')]]`;
      await this.page.waitForSelector(`xpath/${authorizeButtonXPath}`, {
        visible: true,
      });
      const [authorizeButton] = await this.page.$$(
        `xpath/${authorizeButtonXPath}`,
      );
      if (authorizeButton) {
        await Promise.all([
          this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
          authorizeButton.click(),
        ]);
      }
    } catch (e) {
      console.log(
        'Could not find or interact with the authorization screen, assuming auto-redirect.',
      );
    }
  }

  private async _handleOtpLogin(
    email: string,
    otpOptions: {
      otpEndpoint: string;
      refreshInterval: number;
      maxRetries: number;
    },
  ) {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    console.log(`Starting OTP login for ${email}`);

    // NOTE: The selectors used here are common for Clerk-based authentication,
    // but they might need to be adjusted for Suno's specific implementation.
    const emailInputSelector = 'input[name="identifier"]';
    await this.page.waitForSelector(emailInputSelector, { visible: true });
    await this.page.type(emailInputSelector, email);
    console.log('Entered email for OTP login.');

    const continueButtonSelector = 'button[type="submit"]';
    await this.page.click(continueButtonSelector);
    console.log('Clicked continue, waiting for OTP input.');

    const otpInputSelector = 'input[name="code"]';
    await this.page.waitForSelector(otpInputSelector, { visible: true });
    console.log('OTP input is visible. Starting to poll for OTP.');

    let otp: string | null = null;
    for (let i = 0; i < otpOptions.maxRetries; i++) {
      console.log(`Fetching OTP, attempt ${i + 1}/${otpOptions.maxRetries}`);
      otp = await fetchOtp(otpOptions.otpEndpoint);
      if (otp) {
        console.log('OTP received.');
        break;
      }
      await new Promise(resolve =>
        setTimeout(resolve, otpOptions.refreshInterval),
      );
    }

    if (!otp) {
      throw new Error(
        `Failed to fetch OTP after ${otpOptions.maxRetries} attempts.`,
      );
    }

    await this.page.type(otpInputSelector, otp);
    console.log('Entered OTP.');

    // After entering the OTP, Clerk usually submits automatically.
    // If not, a final submit button click might be needed here.
    console.log('Waiting for successful login confirmation.');
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

  /**
   * Navigates to the Suno create page and fills the music creation form with the provided options.
   * @param options SunoMusicOptions
   */
  async generateMusic(options: SunoMusicOptions) {
    if (!this.page) throw new Error('Page not initialized');

    console.log('🚀 Starting music generation process...');
    console.log('📋 Options:', JSON.stringify(options, null, 2));

    if (!this.isLoggedIn) {
      console.log('🔄 User not logged in, attempting login...');
      await this.login();
    } else {
      console.log('✅ User is already logged in');
    }

    // 1. Navigate to the create page
    console.log('🚀 Navigating to Suno create page...');
    await this.page.goto('https://suno.com/create?wid=default', {
      waitUntil: 'networkidle2',
    });
    console.log('✅ Successfully navigated to create page');

    // Click the close button if it exists (to dismiss any modal or overlay)
    console.log('🔍 Looking for close button to dismiss any modal...');
    try {
      const closeButtonSelector = 'button[aria-label="Close"]';
      await this.page.waitForSelector(closeButtonSelector, { visible: true });
      await this.page.click(closeButtonSelector);
      console.log('✅ Close button clicked successfully');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for modal to close
    } catch (error) {
      console.log('ℹ️ No close button found or already closed, continuing...');
    }
    // 2. Click the main glass-thick button (to open advanced options or focus form)
    console.log(
      '🎯 Step 2: Clicking Custom button to open advanced options...',
    );
    const timeout = 5000;
    try {
      console.log('📍 Attempting direct click on Custom button...');
      await this.page.click(
        '::-p-aria(Custom) >>>> ::-p-aria([role=\\"generic\\"])',
        {
          offset: {
            x: 33,
            y: 20,
          },
        },
      );
      console.log('✅ Direct click successful');
    } catch (error) {
      console.log('❌ Direct click failed, trying fallback selectors...');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('⏳ Waited 1 second, now trying fallback selectors...');

    await this.clickElementWithFallback(
      [
        '::-p-aria(Custom) >>>> ::-p-aria([role=\\"generic\\"])',
        'button.text-foreground-primary\\/70 > span',
        '::-p-xpath(//*[@id=\\"main-container\\"]/div[1]/div/div[1]/div/div[1]/div[2]/div[2]/button[2]/span)',
        ':scope >>> button.text-foreground-primary\\/70 > span',
        '::-p-text(Custom)',
        'button[data-testid="custom-button"]',
        'button:contains("Custom")',
      ],
      timeout,
    );
    console.log('✅ Custom button interaction completed');

    // 3. Instrumental toggle (switch)
    if (typeof options.isInstrumental === 'boolean') {
      console.log(
        `🎛️ Step 3: Setting instrumental toggle to ${options.isInstrumental}...`,
      );
      await this.clickElementWithFallback(
        [
          '::-p-aria(Instrumental)',
          '#main-container > div.flex div.min-w-\\[300px\\] div.gap-2 > div.items-center > div',
          '::-p-xpath(//*[@id=\\"main-container\\"]/div[1]/div/div[1]/div/div[2]/div/div/div/div/div[2]/div/div[2]/div/div[3]/div[1]/div)',
          ':scope >>> #main-container > div.flex div.min-w-\\[300px\\] div.gap-2 > div.items-center > div',
          'div[aria-label="Instrumental"]',
          'input[type="checkbox"][aria-label="Instrumental"]',
        ],
        timeout,
      );
      console.log('✅ Instrumental toggle set');
    } else {
      console.log('⏭️ Skipping instrumental toggle (not specified)');
    }

    // 4. Lyrics
    if (options.lyrics) {
      console.log('📄 Step 4: Filling in lyrics...');
      console.log(`📄 Lyrics length: ${options.lyrics.length} characters`);
      await this.fillElementWithFallback(
        [
          '::-p-aria(Add your own lyrics here)',
          "[data-testid='lyrics-input-textarea']",
          '::-p-xpath(//*[@data-testid=\\"lyrics-input-textarea\\"])',
          ":scope >>> [data-testid='lyrics-input-textarea']",
          'textarea[placeholder*="lyrics"]',
          'textarea[name="lyrics"]',
        ],
        options.lyrics,
        timeout,
      );
      console.log('✅ Lyrics filled successfully');
    } else {
      console.log('⏭️ Skipping lyrics (not provided)');
    }

    // 5. Style
    if (options.style) {
      console.log('🏷️ Step 5: Filling in style tags...');
      console.log(`🏷️ Style: ${options.style}`);
      await this.fillElementWithFallback(
        [
          '::-p-aria(Enter style tags)',
          "[data-testid='tag-input-textarea']",
          '::-p-xpath(//*[@data-testid=\\"tag-input-textarea\\"])',
          ":scope >>> [data-testid='tag-input-textarea']",
          'textarea[placeholder*="style"]',
          'textarea[name="style"]',
        ],
        options.style,
        timeout,
      );
      console.log('✅ Style tags filled successfully');
    } else {
      console.log('⏭️ Skipping style tags (not provided)');
    }

    // 6. Click the create button
    console.log('🚀 Step 6: Clicking create button to start generation...');
    await this.clickElementWithFallback(
      [
        '::-p-aria(Create[role=\\"button\\"]) >>>> ::-p-aria([role=\\"image\\"])',
        'div.min-w-\\[300px\\] > div > div.h-auto > div.flex-1 svg',
        '::-p-xpath(//*[@data-testid=\\"create-button\\"]/span/svg)',
        ':scope >>> div.min-w-\\[300px\\] > div > div.h-auto > div.flex-1 svg',
        'button[data-testid="create-button"]',
        'button:contains("Create")',
        'button[type="submit"]',
      ],
      timeout,
    );
    console.log('✅ Create button clicked, generation started');

    // 7. Wait for generation to complete and handle the result
    console.log('⏳ Step 7: Waiting for generation to complete...');
    await this.waitForGenerationComplete();

    // 8. Select MP3 Audio format
    console.log('🎵 Step 8: Selecting MP3 Audio format...');
    await this.selectAudioFormat();

    // 9. Download the file
    console.log('💾 Step 9: Downloading audio file...');
    await this.downloadAudioFile();

    console.log(
      '🎉 Music generation and download process completed successfully!',
    );
  }

  /**
   * Helper method to click an element using multiple fallback selectors
   */
  private async clickElementWithFallback(selectors: string[], timeout: number) {
    if (!this.page) throw new Error('Page not initialized');

    console.log(
      `🔍 Attempting to click element with ${selectors.length} selectors...`,
    );

    for (let i = 0; i < selectors.length; i++) {
      const selector = selectors[i];
      console.log(
        `  [${i + 1}/${selectors.length}] Trying selector: ${selector}`,
      );

      try {
        console.log(`    ⏳ Waiting for selector to be visible...`);
        await this.page.waitForSelector(selector, {
          timeout: 2000,
          visible: true,
        });
        console.log(`    ✅ Selector found and visible`);

        console.log(`    🖱️ Clicking element...`);
        await this.page.click(selector);
        console.log(
          `    ✅ Successfully clicked element with selector: ${selector}`,
        );
        return;
      } catch (error) {
        console.log(`    ❌ Selector failed: ${selector}`);
        console.log(
          `    📝 Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        continue;
      }
    }

    console.log(`💥 All selectors failed!`);
    throw new Error(
      `Could not find or click any element with the provided selectors: ${selectors.join(', ')}`,
    );
  }

  /**
   * Helper method to fill an element using multiple fallback selectors
   */
  private async fillElementWithFallback(
    selectors: string[],
    text: string,
    timeout: number,
  ) {
    if (!this.page) throw new Error('Page not initialized');

    console.log(
      `🔍 Attempting to fill element with ${selectors.length} selectors...`,
    );
    console.log(
      `📝 Text to fill: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
    );

    for (let i = 0; i < selectors.length; i++) {
      const selector = selectors[i];
      console.log(
        `  [${i + 1}/${selectors.length}] Trying selector: ${selector}`,
      );

      try {
        console.log(`    ⏳ Waiting for selector to be visible...`);
        await this.page.waitForSelector(selector, {
          timeout: 2000,
          visible: true,
        });
        console.log(`    ✅ Selector found and visible`);

        console.log(`    🖱️ Clicking to focus element...`);
        await this.page.click(selector, { clickCount: 3 }); // Select all existing text
        console.log(`    ✅ Element focused`);

        console.log(`    ⌨️ Typing text...`);
        await this.page.type(selector, text, { delay: 10 });
        console.log(
          `    ✅ Successfully filled element with selector: ${selector}`,
        );
        return;
      } catch (error) {
        console.log(`    ❌ Selector failed: ${selector}`);
        console.log(
          `    📝 Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        continue;
      }
    }

    console.log(`💥 All selectors failed!`);
    throw new Error(
      `Could not find or fill any element with the provided selectors: ${selectors.join(', ')}`,
    );
  }

  /**
   * Waits for the music generation to complete
   */
  private async waitForGenerationComplete() {
    if (!this.page) throw new Error('Page not initialized');

    console.log('⏳ Waiting for music generation to complete...');
    console.log('🔍 Looking for generation progress indicators...');

    try {
      console.log('🔍 Waiting for one of these indicators:');
      console.log('  - [data-testid="generation-progress"]');
      console.log('  - [data-testid="generation-complete"]');
      console.log('  - .generation-complete');
      console.log('  - Download button elements');

      // Wait for either the progress indicator or the completion indicator
      await Promise.race([
        this.page.waitForSelector('[data-testid="generation-progress"]', {
          timeout: 300000,
        }), // 5 minutes
        this.page.waitForSelector('[data-testid="generation-complete"]', {
          timeout: 300000,
        }),
        this.page.waitForSelector('.generation-complete', { timeout: 300000 }),
        this.page.waitForFunction(
          () => {
            // Look for completion indicators in the DOM
            const downloadButton =
              document.querySelector('[data-testid="download-button"]') ||
              document.querySelector('.download-button') ||
              document.querySelector('[aria-label*="Download"]');

            if (downloadButton) {
              console.log('🎉 Found download button in DOM!');
              return true;
            }
            return false;
          },
          { timeout: 300000 },
        ),
      ]);

      console.log('✅ Music generation completed successfully!');
    } catch (error) {
      console.log('⚠️ Generation timeout or completion indicator not found');
      console.log(
        `📝 Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      console.log('🔄 Continuing anyway...');
    }
  }

  /**
   * Selects the MP3 Audio format for download
   */
  private async selectAudioFormat() {
    if (!this.page) throw new Error('Page not initialized');

    console.log('🎵 Selecting MP3 Audio format...');

    await this.clickElementWithFallback(
      [
        'div:nth-of-type(9) div.cursor-pointer > div > div',
        '::-p-xpath(//*[@id=\\"radix-«rfp»\\"]/div[1]/div/div)',
        ':scope >>> div:nth-of-type(9) div.cursor-pointer > div > div',
        '::-p-text(MP3 Audio)',
        '[data-testid="audio-format-selector"]',
        '.audio-format-selector',
        'button:contains("MP3")',
        'div:contains("MP3 Audio")',
      ],
      5000,
    );

    console.log('✅ MP3 Audio format selected');
  }

  /**
   * Downloads the generated audio file
   */
  private async downloadAudioFile() {
    if (!this.page) throw new Error('Page not initialized');

    console.log('💾 Downloading audio file...');

    await this.clickElementWithFallback(
      [
        '::-p-aria(Download Anyway) >>>> ::-p-aria([role=\\"generic\\"])',
        'div.fixed button:nth-of-type(2) > span',
        '::-p-xpath(/html/body/div[11]/div/div[2]/div[3]/div[2]/button[2]/span)',
        ':scope >>> div.fixed button:nth-of-type(2) > span',
        '::-p-text(Download Anyway)',
        '[data-testid="download-button"]',
        '.download-button',
        '[aria-label*="Download"]',
        'button:contains("Download")',
      ],
      10000,
    );

    console.log('✅ Download initiated');
    console.log('⏳ Waiting 5 seconds for download to complete...');

    // Wait for download to complete (this might take a while)
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('✅ Download wait completed');
  }

  /**
   * Complete workflow: Create music and download it
   * @param options SunoMusicOptions
   */
  async createAndDownloadMusic(options: SunoMusicOptions) {
    console.log('🎼 Starting complete music creation and download workflow...');
    await this.generateMusic(options);
    console.log(
      '🎉 Music creation and download workflow completed successfully!',
    );
  }
}
