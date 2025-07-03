import { LinkedInPublic } from '..';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';

describe('LinkedIn Scraper - Profile', () => {
  let scraper: LinkedInPublic;

  beforeAll(async () => {
    scraper = new LinkedInPublic();
    await scraper.launch();
  });

  afterAll(async () => {
    await scraper.close();
  });

  it('should get a person profile', async () => {
    const searchResults = await scraper.searchPeople({
      firstName: 'Vishwajeet',
    });

    expect(searchResults.length).toBeGreaterThan(0);

    const firstProfileUrl = searchResults[0].profileUrl;
    const profile = await scraper.getProfile(firstProfileUrl);

    expect(profile).toBeDefined();
    expect(profile.name).toBeDefined();
    expect(profile.headline).toBeDefined();
    
    const profilePath = resolve(
      __dirname,
      'outputs',
      `${profile.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'profile'}.json`,
    );
    await writeFile(profilePath, JSON.stringify(profile, null, 2));

    console.log(`Scraped profile saved to ${profilePath}`);
  }, 60000);
}); 