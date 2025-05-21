## Function: `videoSearch`

Performs a video search using the Brave Search API.

**Purpose:**
This function allows you to search for videos using the Brave Search API, retrieving video results with detailed metadata and thumbnails.

**Parameters:**

- `params` (VideoSearchParams, required): An object containing the search parameters. This is the same as `WebSearchParams` but without the `summary` and `extra_snippets` properties.
  - `q` (string, required): The search query (max 400 characters, 50 words).
  - `country` (string, optional): 2-letter country code. Defaults to 'US'.
  - `search_lang` (string, optional): Search language. Defaults to 'en'.
  - `ui_lang` (string, optional): UI language. Defaults to 'en-US'.
  - `count` (number, optional): Number of results (1-20). Defaults to 20.
  - `offset` (number, optional): Offset for pagination (0-9). Defaults to 0.
  - `safesearch` (enum, optional): Safe search level ('off', 'moderate', 'strict'). Defaults to 'moderate'.
  - `freshness` (enum | string, optional): Freshness of results. Can be:
    - 'pd': Last 24 hours
    - 'pw': Last 7 days
    - 'pm': Last 31 days
    - 'py': Last 365 days
    - Custom date range in format 'YYYY-MM-DDtoYYYY-MM-DD'
  - `text_decorations` (boolean, optional): Include decoration markers. Defaults to true.
  - `spellcheck` (boolean, optional): Enable spellchecking. Defaults to true.
  - `result_filter` (string, optional): Comma-separated list of result types.
  - `goggles` (array<string>, optional): Goggle definitions for custom re-ranking.
  - `units` (enum, optional): Units for measurements ('metric', 'imperial').

**Return Value:**

- `Promise<VideoSearchApiResponse>`: A promise that resolves to the video search response containing:
  - `type`: Always 'videos'
  - `query`: Query information including:
    - `original`: Original search query
    - `altered`: Modified version of the query
    - `cleaned`: Cleaned version of the query
    - `spellcheck_off`: Whether spellchecking was disabled
    - `show_strict_warning`: Warning message for strict safe search
  - `results`: Array of video results, each containing:
    - `type`: Always 'video_result'
    - `url`: Video URL
    - `title`: Video title
    - `description`: Video description
    - `age`: Video age
    - `page_age`: Page age
    - `page_fetched`: When the page was fetched
    - `thumbnail`: Thumbnail information
    - `video`: Video metadata including:
      - `duration`: Video duration
      - `views`: Number of views
      - `creator`: Video creator
      - `publisher`: Video publisher
      - `tags`: Array of video tags
      - `author`: Author profile information
      - `requires_subscription`: Whether the video requires a subscription
    - `meta_url`: Meta URL information

**Examples:**

```typescript
// Basic video search
const results = await braveSDK.videoSearch({ q: 'cats playing' });

// Advanced video search with multiple parameters
const results = await braveSDK.videoSearch({
  q: 'cute puppies',
  country: 'US',
  search_lang: 'en',
  count: 15,
  freshness: 'pw',
  safesearch: 'moderate',
  text_decorations: true,
  spellcheck: true,
});

// Processing the results
if (results.type === 'videos') {
  // Access query information
  console.log('Original query:', results.query.original);
  console.log('Cleaned query:', results.query.cleaned);

  // Process each video result
  results.results.forEach((video, index) => {
    console.log(`\nVideo ${index + 1}:`);
    console.log('Title:', video.title);
    console.log('URL:', video.url);
    console.log('Description:', video.description);
    console.log('Age:', video.age);

    // Access video metadata
    if (video.video) {
      console.log('Duration:', video.video.duration);
      console.log('Views:', video.video.views);
      console.log('Creator:', video.video.creator);
      console.log('Publisher:', video.video.publisher);
      if (video.video.tags) {
        console.log('Tags:', video.video.tags.join(', '));
      }
    }

    // Access thumbnail if available
    if (video.thumbnail) {
      console.log('Thumbnail URL:', video.thumbnail.src);
      console.log(
        'Thumbnail dimensions:',
        video.thumbnail.width,
        'x',
        video.thumbnail.height,
      );
    }

    // Access meta URL information if available
    if (video.meta_url) {
      console.log('Source:', video.meta_url.source);
      console.log('Source Domain:', video.meta_url.domain);
    }
  });
}

// Example: Filtering videos by duration
const shortVideos = results.results.filter(video => {
  const duration = video.video?.duration;
  return duration && parseInt(duration) < 60; // Videos under 1 minute
});

// Example: Sorting by views
const sortedByViews = results.results.sort((a, b) => {
  const viewsA = parseInt(a.video?.views || '0');
  const viewsB = parseInt(b.video?.views || '0');
  return viewsB - viewsA;
});

// Example: Grouping by creator
const videosByCreator = results.results.reduce(
  (acc, video) => {
    const creator = video.video?.creator || 'Unknown';
    if (!acc[creator]) {
      acc[creator] = [];
    }
    acc[creator].push(video);
    return acc;
  },
  {} as Record<string, typeof results.results>,
);
```
