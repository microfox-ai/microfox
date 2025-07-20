# RAG Upstash SDK

A TypeScript SDK for working with Upstash Vector for RAG (Retrieval-Augmented Generation) applications.

## Features

- **Type-safe filter system** with support for nested objects and complex queries
- **Multiple filter syntaxes**: String-based (legacy) and object-based (new)
- **Comprehensive operator support**: All Upstash Vector filter operators
- **Validation**: Built-in Zod schema validation for filters
- **Builder pattern**: Fluent API for building complex filters

## Installation

```bash
npm install rag-upstash
```

## Quick Start

```typescript
import { RagUpstashSdk, createFilter, FilterHelpers } from 'rag-upstash';

// Initialize the SDK
const sdk = new RagUpstashSdk({
  upstashUrl: process.env.UPSTASH_VECTOR_REST_URL!,
  upstashToken: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

// Query with simple string filter (legacy way)
const result1 = await sdk.queryDocsFromRAG({
  data: 'Find cities in Turkey',
  topK: 5,
  filter: "country = 'Turkey' AND population > 1000000",
});

// Query with object filter (new way)
const result2 = await sdk.queryDocsFromRAG({
  data: 'Find cities in Turkey',
  topK: 5,
  filter: createFilter()
    .eq('country', 'Turkey')
    .gt('population', 1000000)
    .build(),
});
```

## Filter System

The SDK supports both string-based filters (legacy) and object-based filters (new). The object-based system provides type safety and better developer experience.

### Filter Types

```typescript
// Simple condition
interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: FilterValue;
}

// Compound filter with boolean operators
interface CompoundFilter {
  operator: 'AND' | 'OR';
  filters: (FilterCondition | CompoundFilter)[];
}

// Union type for all filters
type Filter = FilterCondition | CompoundFilter | string;
```

### Supported Operators

| Operator        | Description           | Example                                |
| --------------- | --------------------- | -------------------------------------- |
| `=`             | Equals                | `eq('country', 'Turkey')`              |
| `!=`            | Not equals            | `ne('country', 'Germany')`             |
| `<`             | Less than             | `lt('population', 1000000)`            |
| `<=`            | Less than or equal    | `lte('population', 1000000)`           |
| `>`             | Greater than          | `gt('population', 1000000)`            |
| `>=`            | Greater than or equal | `gte('population', 1000000)`           |
| `GLOB`          | Pattern matching      | `glob('city', 'I*bul')`                |
| `NOT GLOB`      | Not pattern matching  | `notGlob('city', 'A*')`                |
| `IN`            | In array              | `in('country', ['Turkey', 'Germany'])` |
| `NOT IN`        | Not in array          | `notIn('currency', ['USD', 'EUR'])`    |
| `CONTAINS`      | Array contains        | `contains('industries', 'Tourism')`    |
| `NOT CONTAINS`  | Array not contains    | `notContains('industries', 'Steel')`   |
| `HAS FIELD`     | Field exists          | `hasField('coordinates')`              |
| `HAS NOT FIELD` | Field doesn't exist   | `hasNotField('coordinates')`           |

### Creating Filters

#### 1. Using Filter Builder (Recommended)

```typescript
import { createFilter } from 'rag-upstash';

const filter = createFilter()
  .eq('country', 'Turkey')
  .gt('population', 1000000)
  .contains('industries', 'Tourism')
  .build();

// Or chain with boolean operators
const complexFilter = createFilter()
  .eq('continent', 'Europe')
  .gt('population', 5000000)
  .or(); // Combines all conditions with OR

const andFilter = createFilter()
  .eq('country', 'Germany')
  .lt('population', 10000000)
  .and(); // Combines all conditions with AND
```

#### 2. Using Filter Helpers

```typescript
import { FilterHelpers } from 'rag-upstash';

const filter = FilterHelpers.and(
  FilterHelpers.eq('country', 'Turkey'),
  FilterHelpers.gt('population', 1000000),
  FilterHelpers.or(
    FilterHelpers.eq('is_capital', true),
    FilterHelpers.contains('industries', 'Tourism')
  )
);
```

#### 3. Direct Object Creation

```typescript
const filter: FilterCondition = {
  field: 'country',
  operator: '=',
  value: 'Turkey',
};

const compoundFilter: CompoundFilter = {
  operator: 'AND',
  filters: [
    { field: 'country', operator: '=', value: 'Turkey' },
    { field: 'population', operator: '>', value: 1000000 },
  ],
};
```

### Nested Object Support

The filter system supports nested objects using dot notation:

```typescript
const filter = createFilter()
  .eq('geography.continent', 'Asia')
  .gte('geography.coordinates.latitude', 35.0)
  .lt('geography.coordinates.longitude', 30.0)
  .build();
```

### Array Support

#### Array Elements

```typescript
const filter = createFilter()
  .eq('industries[0]', 'Tourism') // First element
  .eq('industries[#-1]', 'Finance') // Last element
  .contains('industries', 'Technology') // Array contains
  .notContains('industries', 'Steel') // Array not contains
  .build();
```

#### Array Operators

```typescript
const filter = createFilter()
  .in('country', ['Turkey', 'Germany', 'France'])
  .notIn('currency', ['USD', 'EUR'])
  .build();
```

### String Pattern Matching

```typescript
const filter = createFilter()
  .glob('city', 'I*bul') // Cities starting with 'I' and ending with 'bul'
  .glob('city', '?[sz]*') // Cities with second character 's' or 'z'
  .notGlob('city', 'A*') // Cities not starting with 'A'
  .build();
```

### Field Existence

```typescript
const filter = createFilter()
  .hasField('geography.coordinates') // Field exists
  .hasNotField('geography.coordinates.longitude') // Field doesn't exist
  .build();
```

### Complex Boolean Combinations

```typescript
const filter = FilterHelpers.and(
  FilterHelpers.eq('geography.continent', 'Europe'),
  FilterHelpers.or(
    FilterHelpers.gt('population', 5000000),
    FilterHelpers.eq('is_capital', true)
  ),
  FilterHelpers.notIn('economy.currency', ['USD', 'EUR']),
  FilterHelpers.contains('economy.major_industries', 'Finance')
);
```

### Validation

The filter system includes built-in validation:

```typescript
import { validateFilter } from 'rag-upstash';

try {
  const filter = createFilter()
    .eq('invalid-field-name!', 'value') // Invalid field name
    .build();

  const validatedFilter = validateFilter(filter);
} catch (error) {
  console.error('Validation error:', error.message);
}
```

### Debugging

Convert filters to strings for debugging:

```typescript
const filter = createFilter()
  .eq('country', 'Turkey')
  .gt('population', 1000000)
  .build();

const filterString = filter.toString();
console.log('Generated filter:', filterString);
// Output: "country = 'Turkey' AND population > 1000000"
```

## Complete Example

```typescript
import { RagUpstashSdk, createFilter } from 'rag-upstash';

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

const sdk = new RagUpstashSdk<CityMetadata>({
  upstashUrl: process.env.UPSTASH_VECTOR_REST_URL!,
  upstashToken: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

// Complex query with nested objects and arrays
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

console.log('Found cities:', result);
```

## API Reference

### RagUpstashSdk

#### Constructor

```typescript
new RagUpstashSdk(config: RagUpstashSdkConfig)
```

#### Methods

- `queryDocsFromRAG(query, namespace?)` - Query documents with filters
- `feedDocsToRAG(docs, namespace?)` - Add documents to the index
- `getDocFromRAG(id, namespace?)` - Get a specific document
- `deleteDocFromRAG(id, namespace?)` - Delete a document

### Filter Builder

- `createFilter()` - Create a new filter builder
- `FilterBuilder.eq(field, value)` - Add equality condition
- `FilterBuilder.ne(field, value)` - Add not equality condition
- `FilterBuilder.lt(field, value)` - Add less than condition
- `FilterBuilder.lte(field, value)` - Add less than or equal condition
- `FilterBuilder.gt(field, value)` - Add greater than condition
- `FilterBuilder.gte(field, value)` - Add greater than or equal condition
- `FilterBuilder.glob(field, pattern)` - Add glob pattern condition
- `FilterBuilder.notGlob(field, pattern)` - Add not glob pattern condition
- `FilterBuilder.in(field, values)` - Add in array condition
- `FilterBuilder.notIn(field, values)` - Add not in array condition
- `FilterBuilder.contains(field, value)` - Add contains condition
- `FilterBuilder.notContains(field, value)` - Add not contains condition
- `FilterBuilder.hasField(field)` - Add has field condition
- `FilterBuilder.hasNotField(field)` - Add has not field condition
- `FilterBuilder.and()` - Combine conditions with AND
- `FilterBuilder.or()` - Combine conditions with OR
- `FilterBuilder.build()` - Build the filter
- `FilterBuilder.toString()` - Convert to string

### Filter Helpers

- `FilterHelpers.eq(field, value)` - Create equality condition
- `FilterHelpers.ne(field, value)` - Create not equality condition
- `FilterHelpers.lt(field, value)` - Create less than condition
- `FilterHelpers.lte(field, value)` - Create less than or equal condition
- `FilterHelpers.gt(field, value)` - Create greater than condition
- `FilterHelpers.gte(field, value)` - Create greater than or equal condition
- `FilterHelpers.glob(field, pattern)` - Create glob pattern condition
- `FilterHelpers.notGlob(field, pattern)` - Create not glob pattern condition
- `FilterHelpers.in(field, values)` - Create in array condition
- `FilterHelpers.notIn(field, values)` - Create not in array condition
- `FilterHelpers.contains(field, value)` - Create contains condition
- `FilterHelpers.notContains(field, value)` - Create not contains condition
- `FilterHelpers.hasField(field)` - Create has field condition
- `FilterHelpers.hasNotField(field)` - Create has not field condition
- `FilterHelpers.and(...filters)` - Create AND compound filter
- `FilterHelpers.or(...filters)` - Create OR compound filter

### Utility Functions

- `filterToString(filter)` - Convert filter to string
- `validateFilter(filter)` - Validate filter with Zod schema

## Migration from String Filters

If you're currently using string filters, you can gradually migrate to object filters:

```typescript
// Before (string filter)
const result = await sdk.queryDocsFromRAG({
  data: 'query',
  topK: 5,
  filter: "country = 'Turkey' AND population > 1000000",
});

// After (object filter)
const result = await sdk.queryDocsFromRAG({
  data: 'query',
  topK: 5,
  filter: createFilter()
    .eq('country', 'Turkey')
    .gt('population', 1000000)
    .build(),
});
```

String filters are still supported for backward compatibility.

## License

MIT
