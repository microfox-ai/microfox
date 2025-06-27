import { LinkedInPublic, Job } from '..';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';

describe('LinkedIn Scraper - Jobs', () => {
  let scraper: LinkedInPublic;

  beforeAll(async () => {
    scraper = new LinkedInPublic();
    await scraper.launch();
  });

  afterAll(async () => {
    await scraper.close();
  });

  it('should get a list of jobs', async () => {
    try {
      const results = await scraper.searchJobs({
        keywords: 'Software Engineer',
        location: 'Hyderabad',
      });

      expect(results.length).toBeGreaterThan(0);

      const jobsPath = resolve(
        __dirname,
        'outputs',
        'job_results.json',
      );
      await writeFile(jobsPath, JSON.stringify(results, null, 2));

      console.log(`Scraped jobs saved to ${jobsPath}`);
    } catch (error) {
      const screenshotPath = resolve(__dirname, 'outputs', 'jobs_error.png') as `${string}.png`;
      await scraper.page?.screenshot({ path: screenshotPath, fullPage: true });
      console.error(`Screenshot saved to ${screenshotPath}`);
      throw error;
    }
  }, 60000);
}); 