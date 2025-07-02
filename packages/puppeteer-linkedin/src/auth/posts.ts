import { Page } from 'puppeteer-core';

type EnsureLoggedIn = () => Promise<void>;
type GetPage = () => Page | null;

export class LinkedInPosts {
  private ensureLoggedIn: EnsureLoggedIn;
  private getPage: GetPage;
  
  protected get page(): Page | null {
    return this.getPage();
  }

  constructor(ensureLoggedIn: EnsureLoggedIn, getPage: GetPage) {
    this.ensureLoggedIn = ensureLoggedIn;
    this.getPage = getPage;
  }

  async reactToPost(postUrl: string, reaction: 'like' | 'celebrate' | 'support' | 'love' | 'insightful' | 'funny') {
    await this.ensureLoggedIn();
    if (!this.page) {
      throw new Error('Page not initialized. Please login first.');
    }

    console.log(`Navigating to post: ${postUrl}`);
    await this.page.goto(postUrl, { waitUntil: 'domcontentloaded' });
    
    try {
      // Wait for the post to be loaded
      await this.page.waitForSelector('.feed-shared-social-action-bar', { timeout: 15000 });

      const likeButtonSelector = 'button.react-button__trigger';
      await this.page.waitForSelector(likeButtonSelector, { timeout: 10000 });

      if (reaction === 'like') {
        console.log('Liking the post');
        await this.page.click(likeButtonSelector);
      } else {
        // For other reactions, we need to hover over the like button to show them
        console.log(`Hovering over the like button to show other reactions`);
        await this.page.hover(likeButtonSelector);
        
        const reactionSelector = `button[aria-label="Send ${reaction}"]`;
        console.log(`Waiting for reaction button: ${reactionSelector}`);
        await this.page.waitForSelector(reactionSelector, { timeout: 5000 });
        
        console.log(`Clicking the "${reaction}" button`);
        await this.page.click(reactionSelector);
      }

      console.log('Successfully reacted to the post.');
    } catch (error) {
      console.error('Failed to react to the post. Saving screenshot to reaction-failure.png');
      if (this.page) {
        await this.page.screenshot({ path: 'reaction-failure.png' });
      }
      throw new Error(`Could not react to post: ${(error as Error).message}`);
    }
  }

  async commentOnPost(postUrl: string, commentText: string) {
    await this.ensureLoggedIn();
    if (!this.page) {
      throw new Error('Page not initialized. Please login first.');
    }
    
    console.log(`Navigating to post: ${postUrl}`);
    await this.page.goto(postUrl, { waitUntil: 'domcontentloaded' });

    try {
      // Click the comment button to open the comment box
      const commentButtonSelector = 'button[aria-label="Comment"]';
      console.log('Waiting for the comment button...');
      await this.page.waitForSelector(commentButtonSelector, { timeout: 10000 });
      await this.page.click(commentButtonSelector);

      // Wait for the comment editor to appear and type the comment
      const editorSelector = '.ql-editor[contenteditable="true"]';
      console.log('Waiting for the comment editor...');
      await this.page.waitForSelector(editorSelector, { timeout: 10000 });
      console.log('Typing the comment...');
      await this.page.type(editorSelector, commentText);

      // Click the post button to submit the comment
      const postButtonSelector = 'button.comments-comment-box__submit-button--cr';
      console.log('Waiting for the post button...');
      await this.page.waitForSelector(postButtonSelector, { timeout: 10000 });
      await this.page.click(postButtonSelector);

      console.log('Successfully commented on the post.');
    } catch (error) {
      console.error('Failed to comment on the post. Saving screenshot to comment-failure.png');
      if (this.page) {
        await this.page.screenshot({ path: 'comment-failure.png' });
      }
      throw new Error(`Could not comment on post: ${(error as Error).message}`);
    }
  }

  async createPost(text: string) {
    await this.ensureLoggedIn();
    if (!this.page) {
      throw new Error('Page not initialized. Please login first.');
    }

    console.log('Navigating to the feed to create a post...');
    await this.page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded' });

    try {
      // Click the "Start a post" button
      const startPostSelector = '.share-box-feed-entry__top-bar > button';
      console.log('Waiting for the "Start a post" button...');
      await this.page.waitForSelector(startPostSelector, { timeout: 10000 });
      await this.page.click(startPostSelector);

      // Wait for the post creation modal and the editor
      const editorSelector = '.ql-editor[contenteditable="true"]';
      console.log('Waiting for the post editor...');
      await this.page.waitForSelector(editorSelector, { timeout: 10000 });
      console.log('Typing the post content...');
      await this.page.type(editorSelector, text);

      // Click the post button to publish
      const postButtonSelector = 'button.share-actions__primary-action';
      console.log('Waiting for the post button...');
      await this.page.waitForSelector(postButtonSelector, { timeout: 10000 });
      await this.page.click(postButtonSelector);

      console.log('Successfully created a new post.');
      // Wait a bit for the post to actually appear if we want to verify
      await new Promise(resolve => setTimeout(resolve, 5000));

    } catch (error) {
      console.error('Failed to create a post. Saving screenshot to create-post-failure.png');
      if (this.page) {
        await this.page.screenshot({ path: 'create-post-failure.png' });
      }
      throw new Error(`Could not create post: ${(error as Error).message}`);
    }
  }
} 