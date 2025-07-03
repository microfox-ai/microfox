import { Page } from 'puppeteer-core';
import { _autoScroll } from '../utils/scrolling';

type EnsureLoggedIn = () => Promise<void>;
type GetPage = () => Page | null;

export class LinkedInUsers {
  private ensureLoggedIn: EnsureLoggedIn;
  private getPage: GetPage;
  
  protected get page(): Page | null {
    return this.getPage();
  }

  constructor(ensureLoggedIn: EnsureLoggedIn, getPage: GetPage) {
    this.ensureLoggedIn = ensureLoggedIn;
    this.getPage = getPage;
  }

  async sendConnectionRequest(profileUrl: string, message?: string) {
    await this.ensureLoggedIn();
    if (!this.page) {
      throw new Error('Page not initialized. Please login first.');
    }

    console.log(`Navigating to profile for connection request: ${profileUrl}`);
    await this.page.goto(profileUrl, { waitUntil: 'domcontentloaded' });

    try {
      const connectButtonSelector = `.artdeco-card button.artdeco-button--primary:not([aria-label="Message"])`;
      console.log('Waiting for the Connect button...');
      await this.page.waitForSelector(connectButtonSelector, { timeout: 10000 });
      await this.page.click(connectButtonSelector);
      await this._handleConnectionModal(message);
    } catch (error) {
      console.error('Failed to send connection request. Saving screenshot to connect-failure.png');
      if (this.page) {
        await this.page.screenshot({ path: 'connect-failure.png' });
      }
      throw new Error(`Could not send connection request: ${(error as Error).message}`);
    }
  }

  private async _handleConnectionModal(message?: string) {
    await this.ensureLoggedIn();
    if (!this.page) {
      throw new Error('Page not initialized.');
    }

    const modalSelector = 'div[role="dialog"]';
    console.log('Waiting for the connection modal...');
    await this.page.waitForSelector(modalSelector, { timeout: 10000 });

    if (message) {
      const addNoteButtonSelector = 'button[aria-label="Add a note"]';
      console.log('Waiting for the "Add a note" button...');
      await this.page.waitForSelector(addNoteButtonSelector, { timeout: 10000 });
      await this.page.click(addNoteButtonSelector);

      const messageEditorSelector = 'textarea[name="message"]';
      console.log('Waiting for the message editor...');
      await this.page.waitForSelector(messageEditorSelector, { timeout: 10000 });
      await this.page.type(messageEditorSelector, message);
    }

    const sendButtonSelector = 'button[aria-label^="Send"]';
    console.log('Waiting for the final send button...');
    await this.page.waitForSelector(sendButtonSelector, { timeout: 10000 });
    await this.page.click(sendButtonSelector);

    console.log('Successfully sent connection request.');
  }

  async followProfile(profileUrl: string) {
    await this.ensureLoggedIn();
    if (!this.page) {
      throw new Error('Page not initialized. Please login first.');
    }

    console.log(`Navigating to profile to follow: ${profileUrl}`);
    await this.page.goto(profileUrl, { waitUntil: 'domcontentloaded' });

    try {
      const followButtonSelector = `.artdeco-card .pvs-profile-actions__custom button[aria-label*="Follow"]`;
      console.log('Waiting for the Follow button...');
      await this.page.waitForSelector(followButtonSelector, { timeout: 10000 });
      await this.page.click(followButtonSelector);

      console.log('Successfully followed the profile.');
    } catch (error) {
      console.error('Failed to follow profile. Saving screenshot to follow-failure.png');
      if (this.page) {
        await this.page.screenshot({ path: 'follow-failure.png' });
      }
      throw new Error(`Could not follow profile: ${(error as Error).message}`);
    }
  }

  async sendConnectionRequestOrFollow(profileUrl: string, message?: string) {
    await this.ensureLoggedIn();
    if (!this.page) {
      throw new Error('Page not initialized. Please login first.');
    }

    console.log(`Navigating to profile: ${profileUrl}`);
    await this.page.goto(profileUrl, { waitUntil: 'domcontentloaded' });

    const connectButtonSelector = `.artdeco-card button.artdeco-button--primary:not([aria-label="Message"])`;
    const followButtonSelector = `.artdeco-card .pvs-profile-actions__custom button[aria-label*="Follow"]`;

    try {
      const connectButton = await this.page.$(connectButtonSelector);
      if (connectButton) {
        console.log('Connect button found. Sending connection request.');
        await connectButton.click();
        await this._handleConnectionModal(message);
        return;
      }

      const followButton = await this.page.$(followButtonSelector);
      if (followButton) {
        console.log('Follow button found. Following profile.');
        await followButton.click();
        console.log('Successfully followed the profile.');
        return;
      }

      throw new Error('Neither Connect nor Follow button was found on the profile.');

    } catch (error) {
      const errorMessage = `Failed to connect or follow: ${(error as Error).message}`;
      console.error(`${errorMessage} Saving screenshot to action-failure.png`);
      if (this.page) {
        await this.page.screenshot({ path: 'action-failure.png' });
      }
      throw new Error(errorMessage);
    }
  }

  async sendMessage(profileUrl: string, message: string) {
    if (!this.page) {
      throw new Error('Page not initialized. Please login first.');
    }

    console.log(`Navigating to profile: ${profileUrl} to send a message.`);
    await this.page.goto(profileUrl, { waitUntil: 'domcontentloaded' });

    try {
      // Click the message button on the profile
      const messageButtonSelector = `.artdeco-card button[aria-label^="Message"]`;
      console.log('Waiting for the message button...');
      await this.page.waitForSelector(messageButtonSelector, { timeout: 10000 });
      await this.page.click(messageButtonSelector);

      // Wait for the message composer to appear
      const composerSelector = 'div.msg-form__contenteditable[role="textbox"]';
      console.log('Waiting for the message composer...');
      await this.page.waitForSelector(composerSelector, { timeout: 10000 });

      console.log('Typing message...');
      await this.page.type(composerSelector, message);

      // Click the send button
      const sendButtonSelector = '.msg-form__send-button';
      console.log('Waiting for the send button...');
      await this.page.waitForSelector(sendButtonSelector, { timeout: 10000 });
      await this.page.click(sendButtonSelector);

      console.log('Successfully sent message.');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait to ensure it's sent
    } catch (error) {
      console.error('Failed to send message. Saving screenshot to message-failure.png');
      if (this.page) {
        await this.page.screenshot({ path: 'message-failure.png' });
      }
      throw new Error(`Could not send message: ${(error as Error).message}`);
    }
  }

  async getProfile(profileUrl: string) {
    if (!this.page) {
      throw new Error('Page not initialized. Please login first.');
    }

    console.log(`Navigating to profile: ${profileUrl} to scrape data.`);
    await this.page.goto(profileUrl, { waitUntil: 'domcontentloaded' });

    console.log('Scrolling to load all profile sections...');
    await _autoScroll(this.page);

    console.log('Scraping profile data...');

    const profileData = await this.page.evaluate(() => {
      const name = (document.querySelector('h1') as HTMLElement)?.innerText || 'TBD';
      const headline = (document.querySelector('div.text-body-medium.break-words') as HTMLElement)?.innerText || 'TBD';
      const location = (document.querySelector('span.text-body-small.inline.break-words') as HTMLElement)?.innerText || 'TBD';

      // About section
      const aboutElement = document.querySelector('div.display-flex.ph5.pv3 > div.display-flex.full-width > div > div > span');
      const about = aboutElement ? (aboutElement as HTMLElement).innerText : 'TBD';

      // Experience
      const experience: any[] = [];
      const experienceElements = document.querySelectorAll('#experience-section ul > li');
      experienceElements.forEach(el => {
        const company = el.querySelector('p.text-body-small > span:nth-child(2)')?.textContent?.trim();
        const position = el.querySelector('h3.t-16')?.textContent?.trim();
        const dateRange = el.querySelector('h4.t-14 > span:nth-child(2)')?.textContent?.trim();
        experience.push({ company, position, dateRange });
      });

      // Education
      const education: any[] = [];
      const educationElements = document.querySelectorAll('#education-section ul > li');
      educationElements.forEach(el => {
        const school = el.querySelector('h3.pv-entity__school-name')?.textContent?.trim();
        const degree = el.querySelector('p.pv-entity__degree-name > span:nth-child(2)')?.textContent?.trim();
        const field = el.querySelector('p.pv-entity__fos > span:nth-child(2)')?.textContent?.trim();
        const dateRange = el.querySelector('p.pv-entity__dates > span:nth-child(2)')?.textContent?.trim();
        education.push({ school, degree, field, dateRange });
      });

      // Skills
      const skills: string[] = [];
      const skillsElements = document.querySelectorAll('.pv-skill-category-entity__name-text');
      skillsElements.forEach(el => {
        skills.push((el as HTMLElement).innerText.trim());
      });

      return {
        url: window.location.href,
        name,
        headline,
        location,
        about,
        experience,
        education,
        skills,
      };
    });

    console.log(profileData);

    return profileData;
  }

  // Placeholder for future user-related authenticated methods
} 