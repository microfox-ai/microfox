import { Page } from 'puppeteer-core';
import { LinkedInPublic } from './public';
import { LinkedInPosts } from '../auth/posts';
import { LinkedInJobs } from '../auth/jobs';
import { LinkedInUsers } from '../auth/users';
import { LinkedInSales } from '../auth/sales';
import { LinkedInSearch } from '../auth/search';

export class LinkedInAuthenticated extends LinkedInPublic {
  private cookies: any;
  public isLoggedIn = false;
  public loginType: 'personal' | 'salesNavigator' | null = null;

  private _username?: string;
  private _password?: string;
  private _loginOptions?: { headless?: boolean; loginType?: 'personal' | 'salesNavigator' };

  private _posts: LinkedInPosts | null = null;
  private _jobs: LinkedInJobs | null = null;
  private _users: LinkedInUsers | null = null;
  private _sales: LinkedInSales | null = null;
  private _search: LinkedInSearch | null = null;

  constructor(username?: string, password?: string, options?: { headless?: boolean; loginType?: 'personal' | 'salesNavigator' }) {
    super();
    this._username = username;
    this._password = password;
    this._loginOptions = options;
  }

  private async _ensureLoggedIn() {
    if (this.isLoggedIn) {
      return;
    }

    if (this._username && this._password) {
      await this.login(this._username, this._password, this._loginOptions);
    } else {
      throw new Error('Not logged in. Please call login() with credentials first, or provide them in the constructor.');
    }
  }

  public get posts(): LinkedInPosts {
    if (!this._posts) {
      this._posts = new LinkedInPosts(this._ensureLoggedIn.bind(this), () => this.page);
    }
    return this._posts;
  }

  public get jobs(): LinkedInJobs {
    if (!this._jobs) {
      this._jobs = new LinkedInJobs(this._ensureLoggedIn.bind(this), () => this.page);
    }
    return this._jobs;
  }

  public get users(): LinkedInUsers {
    if (!this._users) {
      this._users = new LinkedInUsers(this._ensureLoggedIn.bind(this), () => this.page);
    }
    return this._users;
  }

  public get sales(): LinkedInSales {
    if (!this._sales) {
      this._sales = new LinkedInSales(this._ensureLoggedIn.bind(this), () => this.page);
    }
    return this._sales;
  }

  public get search(): LinkedInSearch {
    if (!this._search) {
      this._search = new LinkedInSearch(this._ensureLoggedIn.bind(this), () => this.page);
    }
    return this._search;
  }

  private async _salesNavigatorLogin(username: string, password_string: string) {
    if (!this.page) {
      throw new Error('Page not initialized');
    }

    await this.page.goto('https://www.linkedin.com/sales/login', {
      waitUntil: 'domcontentloaded',
    });

    await this.page.waitForSelector('input#username');
    await this.page.type('input#username', username);
    await this.page.waitForSelector('input#password');
    await this.page.type('input#password', password_string);

    await this.page.click('button[type="submit"]');

    await new Promise(resolve => setTimeout(resolve, 10000));

    try {
      await this.page.waitForSelector('a#ember13', { timeout: 15000 });
      console.log('Sales Navigator login successful');
    } catch (error) {
      console.error('Sales Navigator login failed. Saving screenshot to sales-login-failure.png');
      if (this.page) {
        await this.page.screenshot({ path: 'sales-login-failure.png' });
      }
      throw new Error('Sales Navigator login failed. You might be blocked by a captcha or have incorrect credentials.');
    }

    this.isLoggedIn = true;
    this.cookies = await this.page.cookies();
  }

  async login(
    username?: string,
    password_string?: string,
    options?: {
      headless?: boolean;
      loginType?: 'personal' | 'salesNavigator';
    }
  ) {
    // If credentials are not passed, try to use the ones from the constructor
    const u = username || this._username;
    const p = password_string || this._password;
    const o = options || this._loginOptions;

    if (!u || !p) {
      throw new Error('Username and password are required for login.');
    }

    this._username = u;
    this._password = p;
    this._loginOptions = o;

    if (!this.page) {
      await this.launch(o);
    }

    if (!this.page) {
      throw new Error('Page not initialized');
    }

    this.loginType = o?.loginType || 'personal';

    if (this.loginType === 'salesNavigator') {
      await this._salesNavigatorLogin(u, p);
    } else {
      await this.page.goto('https://www.linkedin.com/login', {
        waitUntil: 'domcontentloaded',
      });

      await this.page.waitForSelector('#username');
      await this.page.type('#username', u);
      await this.page.waitForSelector('#password');
      await this.page.type('#password', p);

      await this.page.click('button[type="submit"]');

      await new Promise(resolve => setTimeout(resolve, 10000));

      try {
        await this.page.waitForSelector('input.search-global-typeahead__input', { timeout: 15000 });
        console.log('Login successful');
      } catch (error) {
        console.error('Login failed. Could not find feed selector. Saving screenshot to login-failure.png');
        if (this.page) {
          await this.page.screenshot({ path: 'login-failure.png' });
        }
        throw new Error('Login failed. You might be blocked by a captcha or have incorrect credentials.');
      }
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
