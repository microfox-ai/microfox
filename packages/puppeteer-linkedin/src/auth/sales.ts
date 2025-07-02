import { Page } from 'puppeteer-core';

type Range = { min?: number; max?: number };

export type CompanyHeadcount = 'Self-employed' | '1-10' | '11-50' | '51-200' | '201-500' | '501-1,000' | '1,001-5,000';
export type CompanyType = 'Public Company' | 'Privately Held' | 'Non Profit' | 'Educational Institution' | 'Partnership' | 'Self Employed' | 'Self Owned' | 'Government Agency';

export interface LeadSearchFilters {
  // General
  keywords?: string;

  // Company
  currentCompany?: string | string[];
  pastCompany?: string | string[];
  companyHeadcount?: CompanyHeadcount[];
  companyType?: CompanyType[];
  companyHeadquartersLocation?: string | string[];

  // Role
  function?: string | string[];
  currentJobTitle?: string | string[];
  pastJobTitle?: string | string[];
  seniorityLevel?: ('Owner' | 'Partner' | 'CXO' | 'VP' | 'Director' | 'Manager' | 'Senior' | 'Entry' | 'Training' | 'Unpaid')[];
  yearsInCurrentCompany?: Range;
  yearsInCurrentPosition?: Range;
  
  // Personal
  geography?: string | string[];
  industry?: string | string[];
  firstName?: string;
  lastName?: string;
  profileLanguage?: string | string[];
  yearsOfExperience?: Range;
  groups?: string | string[];
  school?: string | string[];

  // Buyer Intent
  categoryInterest?: string | string[];
  followingYourCompany?: boolean;
  viewedYourProfileRecently?: boolean;

  // Best Path In
  connection?: ('1st' | '2nd' | '3rd+ degree')[];
  connectionsOf?: string | string[];
  pastColleague?: boolean;
  sharedExperiences?: boolean;

  // Recent Updates
  changedJobs?: boolean;
  postedOnLinkedIn?: boolean;

  // Workflow
  persona?: string | string[];
  accountLists?: string | string[];
  leadLists?: string | string[];
  peopleInCrm?: boolean;
  peopleYouInteractedWith?: ('Viewed' | 'Messaged')[];
  savedLeadsAndAccounts?: ('Saved leads' | 'Saved accounts' | 'All leads in saved accounts')[];
}

type EnsureLoggedIn = () => Promise<void>;
type GetPage = () => Page | null;

export class LinkedInSales {
  private ensureLoggedIn: EnsureLoggedIn;
  private getPage: GetPage;

  protected get page(): Page | null {
    return this.getPage();
  }

  constructor(ensureLoggedIn: EnsureLoggedIn, getPage: GetPage) {
    this.ensureLoggedIn = ensureLoggedIn;
    this.getPage = getPage;
  }

  async searchForLeads(options: LeadSearchFilters) {
    await this.ensureLoggedIn();
    if (!this.page) {
      throw new Error('Page not initialized. Please login with salesNavigator type first.');
    }

    const searchUrl = 'https://www.linkedin.com/sales/search/people?viewAllFilters=true';
    console.log(`Navigating to Sales Navigator search page: ${searchUrl}`);
    await this.page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

    // Wait for main filter container to ensure page is loaded
    await this.page.waitForSelector('.artdeco-modal__header');

    console.log('Applying search filters...');

    // Helper function to apply checkbox filters
    const applyCheckboxFilter = async (groupName: string, values: string[]) => {
      if (!this.page) return;

      const groupSelector = `fieldset.t-black--light:has(legend:not(.hidden__visually__):-soup-contains('${groupName}'))`;
      await this.page.waitForSelector(groupSelector, { visible: true });
      const groupElement = await this.page.$(groupSelector);

      if (groupElement) {
        for (const value of values) {
          const checkboxLabelSelector = `label[for*="${value}"]`;
          const checkbox = await groupElement.$(checkboxLabelSelector);
          if (checkbox) {
            await checkbox.click();
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
      }
    };

    // Helper function to apply text input filters
    const applyTextInputFilter = async (buttonText: string, inputPlaceholder: string, value: string | string[]) => {
        if (!this.page) return;

        const values = Array.isArray(value) ? value : [value];

        for (const val of values) {
            const button = await this.page.waitForSelector(`button::-p-text(${buttonText})`);
            if (button) {
                await button.click();
                await new Promise(resolve => setTimeout(resolve, 500)); // Wait for input to appear
                await this.page.type(`input[placeholder="${inputPlaceholder}"]`, val);
                await this.page.keyboard.press('Enter');
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
    };

    if (options.keywords) {
      await applyTextInputFilter('Keywords', 'Search by keyword', options.keywords);
    }
    
    if (options.geography) {
      await applyTextInputFilter('Geography', 'Add locations', options.geography);
    }
    
    if (options.connection && options.connection.length > 0) {
      await applyCheckboxFilter('Connection', options.connection);
    }
    
    if (options.seniorityLevel && options.seniorityLevel.length > 0) {
        await applyCheckboxFilter('Seniority level', options.seniorityLevel);
    }

    if (options.industry) {
      await applyTextInputFilter('Industry', 'Add industries', options.industry);
    }

    if (options.currentCompany) {
      await applyTextInputFilter('Current company', 'Add companies', options.currentCompany);
    }

    if (options.currentJobTitle) {
      await applyTextInputFilter('Current job title', 'Add job titles', options.currentJobTitle);
    }
    
    // ... more filters can be added here following the same pattern

    // Click the search button to apply filters
    const searchButtonSelector = 'button[data-control-name="search_form_submit"]';
    await this.page.waitForSelector(searchButtonSelector);
    await this.page.click(searchButtonSelector);
    
    console.log('All filters applied and search initiated.');

    await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
  }

  // Placeholder for future sales-related authenticated methods
} 