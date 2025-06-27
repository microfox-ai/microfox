## Function: `suggestSearch`

Retrieves search suggestions using the Brave Search API.

**Purpose:**
This function provides search suggestions based on a given query, helping users find relevant search terms and entities.

**Parameters:**

- `params` (SuggestSearchParams, required): An object containing the search parameters.
  - `q` (string, required): The search query.
  - `country` (string, optional): 2-letter country code.
  - `count` (number, optional): Number of suggestions to return.

**Return Value:**

- `Promise<SuggestSearchApiResponse>`: A promise that resolves to the search suggestions response containing:
  - `type`: Always "suggest"
  - `query`: Object containing the original query
    - `original`: string - The original search query
  - `results`: Array of suggestion results, each containing:
    - `query`: string - The suggested query
    - `is_entity`: boolean - Whether the suggestion is an entity
    - `title`: string - The title of the suggestion
    - `description`: string - Description of the suggestion
    - `img`: string - Image URL for the suggestion

**Examples:**

```typescript
// Example 1: Basic usage
const suggestions = await braveSDK.suggestSearch({ q: 'java' });

// Example 2: Advanced usage with all parameters
const suggestions = await braveSDK.suggestSearch({
  q: 'search',
  country: 'US',
  count: 10,
});

// Example 3: Processing the response
const suggestions = await braveSDK.suggestSearch({ q: 'typescript' });

// Access the original query
console.log('Original query:', suggestions.query.original);

// Process each suggestion
suggestions.results.forEach(suggestion => {
  console.log('Suggested query:', suggestion.query);

  if (suggestion.is_entity) {
    console.log('Entity details:');
    console.log('- Title:', suggestion.title);
    console.log('- Description:', suggestion.description);
    console.log('- Image:', suggestion.img);
  }
});

// Filter suggestions to only show entities
const entitySuggestions = suggestions.results.filter(s => s.is_entity);

// Map suggestions to a simpler format
const simplifiedSuggestions = suggestions.results.map(s => ({
  text: s.query,
  isEntity: s.is_entity,
  details: s.is_entity
    ? {
        title: s.title,
        description: s.description,
        imageUrl: s.img,
      }
    : null,
}));
```
