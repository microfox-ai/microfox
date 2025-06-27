import { LinkedInAuthenticated } from '../core/authenticated';
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

describe('LinkedIn Authenticated', () => {
  it('should login to LinkedIn and interact with a post', async () => {
    const BROWSER_IS_HEADLESS = false;
    const credentials = {
      username: process.env.LINKEDIN_EMAIL,
      password: process.env.LINKEDIN_PASSWORD,
    };

    const postUrl = process.env.LINKEDIN_TEST_POST_URL || 'https://www.linkedin.com/posts/google_googles-newest-ai-model-is-here-say-hello-activity-7138242044395384832-c2y_';
    const commentText = process.env.LINKEDIN_TEST_COMMENT || 'Great post!';
    const connectedProfileUrl = process.env.LINKEDIN_CONNECTED_PROFILE_URL;
    const unconnectedProfileUrl = process.env.LINKEDIN_UNCONNECTED_PROFILE_URL;
    const testMessage = process.env.LINKEDIN_TEST_MESSAGE || 'Hello! This is a test message from the scraper.';
    const searchQuery = process.env.LINKEDIN_SEARCH_QUERY || 'software engineer';
    const jobSearchKeywords = process.env.LINKEDIN_JOB_SEARCH_KEYWORDS || 'Frontend Developer';
    const jobSearchLocation = process.env.LINKEDIN_JOB_SEARCH_LOCATION || 'United States';

    if (!credentials.username || !credentials.password) {
      throw new Error('LINKEDIN_EMAIL and LINKEDIN_PASSWORD environment variables must be set');
    }

    if (!connectedProfileUrl || !unconnectedProfileUrl) {
      throw new Error('LINKEDIN_CONNECTED_PROFILE_URL and LINKEDIN_UNCONNECTED_PROFILE_URL environment variables must be set');
    }

    const authenticated = new LinkedInAuthenticated();
    await authenticated.login(credentials.username, credentials.password, {
      headless: BROWSER_IS_HEADLESS,
    });
    const cookies = authenticated.getCookies();

    expect(cookies).toBeDefined();
    expect(cookies.length).toBeGreaterThan(0);

    // Save cookies to a file
    fs.writeFileSync('./cookies.json', JSON.stringify(cookies, null, 2));

    // Post interaction
    // await authenticated.posts.createPost('This is a test post from the automated script!');
    // await new Promise(resolve => setTimeout(resolve, 5000));
    // await authenticated.posts.reactToPost(postUrl, 'like');
    // await new Promise(resolve => setTimeout(resolve, 5000));
    // await authenticated.posts.commentOnPost(postUrl, commentText);
    // await new Promise(resolve => setTimeout(resolve, 5000));

    // User interaction
    console.log('--- Testing User Interactions ---');
    // const connectedProfile = await authenticated.users.getProfile(connectedProfileUrl);
    // console.log('Connected Profile Data:', connectedProfile);
    // expect(connectedProfile).toBeDefined();

    // await authenticated.users.sendMessage(connectedProfileUrl, testMessage);
    // await new Promise(resolve => setTimeout(resolve, 5000));

    const unconnectedProfile = await authenticated.users.getProfile(unconnectedProfileUrl);
    console.log('Unconnected Profile Data:', unconnectedProfile);
    expect(unconnectedProfile).toBeDefined();

    await authenticated.users.sendConnectionRequest(unconnectedProfileUrl, 'Hello! I would like to connect.');

    const searchResults = await authenticated.search.search(searchQuery, 'people');
    console.log(`Found ${searchResults.length} people for query "${searchQuery}":`);
    console.log(searchResults);

    const jobResults = await authenticated.search.search(searchQuery, 'jobs');
    console.log(`Found ${jobResults.length} jobs for query "${searchQuery}":`);
    console.log(jobResults);

    const postResults = await authenticated.search.search(searchQuery, 'posts');
    console.log(`Found ${postResults.length} posts for query "${searchQuery}":`);
    console.log(postResults);

    const groupResults = await authenticated.search.search(searchQuery, 'groups');
    console.log(`Found ${groupResults.length} groups for query "${searchQuery}":`);
    console.log(groupResults);

    const recommendedJobs = await authenticated.jobs.getRecommendedJobs(5); // Limit to 5 for testing
    console.log(`Found ${recommendedJobs.length} recommended jobs:`);
    console.log(recommendedJobs);

    const searchedJobs = await authenticated.jobs.searchJobs({ keywords: jobSearchKeywords, location: jobSearchLocation }, 5);
    console.log(`Found ${searchedJobs.length} jobs for search "${jobSearchKeywords}" in "${jobSearchLocation}":`);
    console.log(searchedJobs);

    await new Promise(resolve => setTimeout(resolve, 10000)); // Keep browser open for 10 seconds
  }, 360000);
}); 