## Function: `spellcheckSearch`

Performs a spell check using the Brave Search API.

**Purpose:**
This function checks the spelling of a given query and provides corrections if needed.

**Parameters:**

- `params` (SpellcheckSearchParams, required): An object containing the search parameters.
  - `q` (string, required): The search query to check for spelling.
  - `country` (string, optional): 2-letter country code to use for region-specific spell checking.

**Return Value:**

- `Promise<SpellCheckSearchApiResponse>`: A promise that resolves to the spell check response containing:
  - `type`: Always "spellcheck"
  - `query`: Object containing the original query
  - `results`: Array of spell check results

**Examples:**

```typescript
// Example 1: Basic spell check
const spellcheckResult = await braveSDK.spellcheckSearch({ q: 'javascrpt' });

// Example 2: Spell check with country specification
const spellcheckResult = await braveSDK.spellcheckSearch({
  q: 'colour',
  country: 'US', // Will suggest 'color' for US English
});

// Example 3: Spell check for technical terms
const spellcheckResult = await braveSDK.spellcheckSearch({
  q: 'microservis',
  country: 'GB', // Will suggest 'microservice' for British English
});
```
