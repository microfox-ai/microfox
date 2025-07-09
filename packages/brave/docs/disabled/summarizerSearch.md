<!--priority:low-->

## Function: `summarizerSearch`

Performs a summarizer search using the Brave Search API.

**Purpose:**
This function allows you to retrieve AI-generated summaries and enrichments based on a provided key obtained from a prior web search.

**Parameters:**

- `params` (SummarizerSearchParams, required): An object containing the search parameters.
  - `key` (string, required): The summarizer key obtained from a prior web search with `summary=1`.
  - `entity_info` (boolean, optional): Include entity information in the response.

**Return Value:**

- `Promise<SummarizerSearchApiResponse>`: A promise that resolves to the summarizer search response containing:
  - `type`: Always 'summarizer'
  - `status`: Either 'failed' or 'complete'
  - `title`: The title of the summarized content
  - `summary`: Array of summary messages that can be of type 'token', 'enum_item', 'enum_start', or 'enum_end'
  - `enrichments`: Object containing:
    - `raw`: Raw text content
    - `images`: Array of relevant images with thumbnails and properties
    - `qa`: Array of question-answer pairs with scores and highlights
    - `entities`: Array of relevant entities with metadata
    - `context`: Array of contextual information with titles and URLs
  - `followups`: Array of suggested follow-up queries
  - `entities_infos`: Record of entity information with descriptions and providers

**Examples:**

```typescript
// Basic example: Performing a summarizer search
const results = await braveSDK.summarizerSearch({
  key: 'summary_key',
  entity_info: true,
});

// Example: Processing the summary
if (results.status === 'complete') {
  console.log('Title:', results.title);
  console.log('Summary:', results.summary);
  console.log('Follow-up questions:', results.followups);
}

// Example: Working with enrichments
if (results.status === 'complete') {
  const { enrichments } = results;

  // Access raw text content
  console.log('Raw content:', enrichments.raw);

  // Process images
  enrichments.images.forEach(image => {
    console.log('Image URL:', image.url);
    console.log('Image text:', image.text);
    console.log('Thumbnail:', image.thumbnail);
  });

  // Process Q&A pairs
  enrichments.qa.forEach(qa => {
    console.log('Answer:', qa.answer);
    console.log('Confidence score:', qa.score);
    console.log('Highlight range:', qa.highlight);
  });

  // Process entities
  enrichments.entities.forEach(entity => {
    console.log('Entity name:', entity.name);
    console.log('Entity URL:', entity.url);
    console.log('Entity text:', entity.text);
    console.log('Entity images:', entity.images);
  });

  // Process context
  enrichments.context.forEach(ctx => {
    console.log('Context title:', ctx.title);
    console.log('Context URL:', ctx.url);
    console.log('Meta URL:', ctx.meta_url);
  });
}

// Example: Working with entity information
if (results.status === 'complete') {
  // Access entity information
  Object.entries(results.entities_infos).forEach(([entityId, info]) => {
    console.log(`Entity ${entityId}:`);
    console.log('Provider:', info.provider);
    console.log('Description:', info.description);
  });
}
```
