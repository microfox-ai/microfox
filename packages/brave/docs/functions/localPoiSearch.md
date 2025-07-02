## Function: `localPoiSearch`

Performs a local POI (Points of Interest) search using the Brave Search API.

**Purpose:**
This function allows you to search for points of interest based on location IDs, retrieving detailed information about specific locations.

**Parameters:**

- `params` (LocalSearchParams, required): An object containing the search parameters.
  - `ids` (array<string>, required): List of location IDs (max 20).
  - `search_lang` (string, optional): Search language.
  - `ui_lang` (string, optional): UI language.
  - `units` (enum, optional): Units for measurements ('metric', 'imperial').

**Return Value:**

- `Promise<LocalPoiSearchApiResponse>`: A promise that resolves to the local POI search response.

**Response Type Structure:**

```typescript
interface LocalPoiSearchApiResponse {
  type: 'local_pois';
  results?: Array<{
    type: 'location_result';
    id?: string;
    provider_url: string;
    coordinates?: number[];
    zoom_level: number;
    thumbnail?: Thumbnail;
    postal_address?: PostalAddress;
    opening_hours?: OpeningHours;
    contact?: Contact;
    price_range?: string;
    rating?: Rating;
    distance?: Unit;
    profiles?: DataProvider[];
    reviews?: Reviews;
    pictures?: PictureResults;
    action?: Action;
    serves_cuisine?: string[];
    categories?: string[];
    icon_category?: string;
    results?: LocationWebResult;
    timezone?: string;
    timezone_offset?: string;
  }>;
}
```

**Examples:**

```typescript
// Basic local POI search
const results = await braveSDK.localPoiSearch({
  ids: ['location1', 'location2'],
});

// Advanced search with multiple parameters
const results = await braveSDK.localPoiSearch({
  ids: ['location1', 'location2', 'location3'],
  search_lang: 'en',
  ui_lang: 'en',
  units: 'metric',
});

// Processing the results
const processResults = async () => {
  try {
    const response = await braveSDK.localPoiSearch({
      ids: ['location1', 'location2'],
    });

    // Access the location results
    const locations = response.results || [];

    // Process each location
    locations.forEach(location => {
      console.log(`Location ID: ${location.id}`);
      console.log(`Provider URL: ${location.provider_url}`);
      if (location.postal_address) {
        console.log(`Address: ${location.postal_address.street_address}`);
      }
      if (location.rating) {
        console.log(`Rating: ${location.rating.rating_value}`);
      }
    });
  } catch (error) {
    console.error('Error performing local POI search:', error);
  }
};
```

**Notes:**

- The function is specifically designed for retrieving detailed information about points of interest
- Maximum of 20 location IDs can be searched in a single request
- All parameters except `ids` are optional
- Requires a Pro plan subscription to use

**Best Practices:**

1. **Error Handling**

   - Always wrap API calls in try-catch blocks
   - Handle rate limiting and network errors appropriately

2. **Result Processing**

   - Validate the response data before processing
   - Handle cases where some location IDs might not return results
   - Check for optional fields before using them

3. **Performance**

   - Batch location IDs when possible to minimize API calls
   - Cache results when appropriate for frequently accessed locations

4. **Language and Units**
   - Set appropriate language parameters based on your user base
   - Use consistent units throughout your application
   - Consider user preferences when setting the units parameter
