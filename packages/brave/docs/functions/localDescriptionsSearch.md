# Brave Search API: Local Descriptions Search

The `localDescriptionsSearch` function enables searching for local descriptions using the Brave Search API, allowing you to retrieve detailed information about specific locations based on their IDs.

## Function Signature

```typescript
localDescriptionsSearch(params: LocalSearchParams): Promise<LocalDescriptionsSearchApiResponse>
```

## Parameters

The function accepts a single parameter object with the following properties:

### Required Parameters

- `ids` (array<string>): List of location IDs to search for
  - Maximum number of IDs: 20

### Optional Parameters

- `search_lang` (string): Language for search results
- `ui_lang` (string): Language for user interface elements
- `units` (enum): Units for measurements
  - Values: 'metric' | 'imperial'

## Return Value

Returns a Promise that resolves to a `LocalDescriptionsSearchApiResponse` object containing the local descriptions search results.

### Response Type Structure

```typescript
interface LocalDescriptionsSearchApiResponse {
  type: 'local_descriptions';
  results?: Array<{
    type: 'local_description';
    id: string;
    description?: string;
  }>;
}
```

## Example Usage

```typescript
// Basic local descriptions search
const results = await braveSDK.localDescriptionsSearch({
  ids: ['location1', 'location2'],
});

// Advanced search with multiple parameters
const results = await braveSDK.localDescriptionsSearch({
  ids: ['location1', 'location2', 'location3'],
  search_lang: 'en',
  ui_lang: 'en',
  units: 'metric',
});

// Processing the results
const processResults = async () => {
  try {
    const response = await braveSDK.localDescriptionsSearch({
      ids: ['location1', 'location2'],
    });

    // Access the location descriptions
    const descriptions = response.results || [];

    // Process each description
    descriptions.forEach(desc => {
      console.log(`Location ID: ${desc.id}`);
      console.log(
        `Description: ${desc.description || 'No description available'}`,
      );
    });
  } catch (error) {
    console.error('Error performing local descriptions search:', error);
  }
};
```

## Notes

- The function is specifically designed for retrieving detailed information about locations
- Maximum of 20 location IDs can be searched in a single request
- All parameters except `ids` are optional

## Best Practices

1. **Error Handling**

   - Always wrap API calls in try-catch blocks
   - Handle rate limiting and network errors appropriately

2. **Result Processing**

   - Validate the response data before processing
   - Handle cases where some location IDs might not return results
   - Check for optional description field before using it

3. **Performance**

   - Batch location IDs when possible to minimize API calls
   - Cache results when appropriate for frequently accessed locations

4. **Language and Units**
   - Set appropriate language parameters based on your user base
   - Use consistent units throughout your application
   - Consider user preferences when setting the units parameter
