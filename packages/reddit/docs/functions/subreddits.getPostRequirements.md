## Function: `getPostRequirements`

Retrieves the posting requirements and rules for a specific subreddit.

**Parameters:**

- `subreddit`: string - The name of the subreddit.

**Return Type:**

- `Promise<PostRequirements>`: A promise that resolves to an object containing the posting requirements for the subreddit.

**PostRequirements Object Details:**

- `guidelines_text`: string - The text of the posting guidelines.
- `guidelines_display_html`: string - The HTML representation of the posting guidelines.
- `submission_text`: string - The text displayed on the submission page.
- `submission_text_html`: string - The HTML representation of the text on the submission page.

**Usage Example:**

```typescript
const requirements = await reddit.subreddits.getPostRequirements({ subreddit: 'AskScience' });
console.log(requirements.guidelines_text);
```

**Code Example:**

```typescript
async function checkPostRules(subredditName) {
  try {
    const postRules = await reddit.subreddits.getPostRequirements({ subreddit: subredditName });
    console.log(`--- Posting Guidelines for r/${subredditName} ---`);
    console.log(postRules.guidelines_text);
    console.log(`\n--- Submission Page Text ---`);
    console.log(postRules.submission_text);
  } catch (error) {
    console.error(`Could not fetch posting requirements for r/${subredditName}:`, error);
  }
}

checkPostRules('explainlikeimfive');
``` 