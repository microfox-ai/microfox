import { RagUpstashSdk, createFilter, FilterHelpers } from '../index';

// Example metadata structure with nested objects
interface CityMetadata {
  city: string;
  country: string;
  is_capital: boolean;
  population: number;
  geography: {
    continent: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  economy: {
    currency: string;
    major_industries: string[];
  };
}

// Initialize the SDK
const sdk = new RagUpstashSdk<CityMetadata>({
  upstashUrl: process.env.UPSTASH_VECTOR_REST_URL!,
  upstashToken: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

/**
 * Example 1: Simple equality filters
 */
async function simpleEqualityExample() {
  // Using string filter (legacy way)
  const result1 = await sdk.queryDocsFromRAG({
    data: 'Find cities in Turkey',
    topK: 5,
    filter: "country = 'Turkey' AND population > 1000000",
  });

  // Using object filter (new way)
  const result2 = await sdk.queryDocsFromRAG({
    data: 'Find cities in Turkey',
    topK: 5,
    filter: FilterHelpers.and(
      FilterHelpers.eq('country', 'Turkey'),
      FilterHelpers.gt('population', 1000000)
    ),
  });

  // Using filter builder
  const filter = createFilter()
    .eq('country', 'Turkey')
    .gt('population', 1000000)
    .build();

  const result3 = await sdk.queryDocsFromRAG({
    data: 'Find cities in Turkey',
    topK: 5,
    filter,
  });
}

/**
 * Example 2: Nested object filters
 */
async function nestedObjectExample() {
  // Filter by nested geography properties
  const filter = createFilter()
    .eq('geography.continent', 'Asia')
    .gte('geography.coordinates.latitude', 35.0)
    .lt('geography.coordinates.longitude', 30.0)
    .build();

  const result = await sdk.queryDocsFromRAG({
    data: 'Find cities in Asia with specific coordinates',
    topK: 10,
    filter,
  });
}

/**
 * Example 3: Array filters
 */
async function arrayFiltersExample() {
  // Check if array contains specific value
  const filter1 = createFilter()
    .contains('economy.major_industries', 'Tourism')
    .build();

  // Check if array doesn't contain specific value
  const filter2 = createFilter()
    .notContains('economy.major_industries', 'Steel Production')
    .build();

  // Check specific array index
  const filter3 = createFilter()
    .eq('economy.major_industries[0]', 'Tourism')
    .build();

  // Check last array element
  const filter4 = createFilter()
    .eq('economy.major_industries[#-1]', 'Finance')
    .build();

  const result = await sdk.queryDocsFromRAG({
    data: 'Find cities with tourism as major industry',
    topK: 5,
    filter: filter1,
  });
}

/**
 * Example 4: Complex boolean combinations
 */
async function complexBooleanExample() {
  // Complex filter with AND/OR combinations
  const filter = FilterHelpers.and(
    FilterHelpers.eq('geography.continent', 'Europe'),
    FilterHelpers.or(
      FilterHelpers.gt('population', 5000000),
      FilterHelpers.eq('is_capital', true)
    ),
    FilterHelpers.notIn('economy.currency', ['USD', 'EUR']),
    FilterHelpers.contains('economy.major_industries', 'Finance')
  );

  const result = await sdk.queryDocsFromRAG({
    data: 'Find European cities with specific criteria',
    topK: 10,
    filter,
  });
}

/**
 * Example 5: String pattern matching with GLOB
 */
async function globPatternExample() {
  // Cities starting with 'I' and ending with 'bul'
  const filter1 = createFilter().glob('city', 'I*bul').build();

  // Cities with second character 's' or 'z'
  const filter2 = createFilter().glob('city', '?[sz]*').build();

  // Cities not starting with 'A'
  const filter3 = createFilter().notGlob('city', 'A*').build();

  const result = await sdk.queryDocsFromRAG({
    data: 'Find cities matching pattern',
    topK: 5,
    filter: filter1,
  });
}

/**
 * Example 6: Field existence checks
 */
async function fieldExistenceExample() {
  // Check if coordinates field exists
  const filter1 = createFilter().hasField('geography.coordinates').build();

  // Check if longitude field doesn't exist
  const filter2 = createFilter()
    .hasNotField('geography.coordinates.longitude')
    .build();

  const result = await sdk.queryDocsFromRAG({
    data: 'Find cities with coordinate data',
    topK: 5,
    filter: filter1,
  });
}

/**
 * Example 7: IN and NOT IN operators
 */
async function inOperatorsExample() {
  // Cities in specific countries
  const filter1 = createFilter()
    .in('country', ['Germany', 'Turkey', 'France'])
    .build();

  // Cities not using specific currencies
  const filter2 = createFilter()
    .notIn('economy.currency', ['USD', 'EUR'])
    .build();

  const result = await sdk.queryDocsFromRAG({
    data: 'Find cities in specific countries',
    topK: 10,
    filter: filter1,
  });
}

/**
 * Example 8: Chaining filter builder methods
 */
async function chainingExample() {
  const filter = createFilter()
    .eq('geography.continent', 'Asia')
    .gt('population', 1000000)
    .contains('economy.major_industries', 'Tourism')
    .ne('country', 'China')
    .gte('geography.coordinates.latitude', 20.0)
    .lte('geography.coordinates.latitude', 50.0)
    .build();

  const result = await sdk.queryDocsFromRAG({
    data: 'Find Asian cities with tourism industry',
    topK: 5,
    filter,
  });
}

/**
 * Example 9: Using toString() for debugging
 */
async function debugExample() {
  const filter = createFilter()
    .eq('country', 'Turkey')
    .gt('population', 1000000)
    .build();

  // Convert to string for debugging
  const filterString = filter.toString();
  console.log('Generated filter string:', filterString);
  // Output: "country = 'Turkey' AND population > 1000000"

  const result = await sdk.queryDocsFromRAG({
    data: 'Find cities in Turkey',
    topK: 5,
    filter,
  });
}

/**
 * Example 10: Validation example
 */
async function validationExample() {
  try {
    // This will throw an error due to invalid field name
    const invalidFilter = createFilter()
      .eq('invalid-field-name!', 'value')
      .build();

    await sdk.queryDocsFromRAG({
      data: 'Test query',
      topK: 5,
      filter: invalidFilter,
    });
  } catch (error) {
    console.error(
      'Validation error:',
      error instanceof Error ? error.message : String(error)
    );
  }
}

// Export all examples for testing
export {
  simpleEqualityExample,
  nestedObjectExample,
  arrayFiltersExample,
  complexBooleanExample,
  globPatternExample,
  fieldExistenceExample,
  inOperatorsExample,
  chainingExample,
  debugExample,
  validationExample,
};
