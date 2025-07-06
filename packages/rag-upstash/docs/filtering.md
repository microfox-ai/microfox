# Metadata Filtering

Upstash Vector allows you to filter vector search results based on metadata criteria. This enables you to perform more targeted searches by combining semantic similarity with specific metadata constraints.

## Overview

Metadata filtering works by restricting vector similarity search results to only include vectors whose metadata matches the specified filter criteria. The filtering system uses a combination of in-filtering and post-filtering to optimize performance.

**Supported Metadata Types:**

- `string`
- `number`
- `boolean`
- `object`
- `array`

## Filter Syntax

Filters use a SQL-like syntax with operators on object keys and boolean operators to combine them. The syntax is case-insensitive for operators and boolean literals.

### Basic Structure

```typescript
// Basic filter structure
filter: 'field = value AND other_field > 100';
```

## Operators

### Comparison Operators

#### Equals (=)

Filters keys whose values are equal to the given literal.

```typescript
// String equality
filter: 'category = "technology"';

// Number equality
filter: 'rating = 5';

// Boolean equality
filter: 'isPublished = true';
```

#### Not Equals (!=)

Filters keys whose values are not equal to the given literal.

```typescript
// String inequality
filter: 'category != "deprecated"';

// Number inequality
filter: 'rating != 1';

// Boolean inequality
filter: 'isPublished != false';
```

#### Less Than (<)

Filters keys whose values are less than the given literal (numbers only).

```typescript
filter: 'price < 100';
filter: 'rating < 4.5';
```

#### Less Than or Equals (<=)

Filters keys whose values are less than or equal to the given literal (numbers only).

```typescript
filter: 'price <= 99.99';
filter: 'rating <= 5';
```

#### Greater Than (>)

Filters keys whose values are greater than the given literal (numbers only).

```typescript
filter: 'price > 50';
filter: 'rating > 3.5';
```

#### Greater Than or Equals (>=)

Filters keys whose values are greater than or equal to the given literal (numbers only).

```typescript
filter: 'price >= 25.99';
filter: 'rating >= 4';
```

### String Pattern Matching

#### Glob

Filters keys whose values match a UNIX glob pattern (case-sensitive).

```typescript
// Wildcard patterns
filter: 'title GLOB "AI*"'; // Starts with "AI"
filter: 'title GLOB "*Guide*"'; // Contains "Guide"
filter: 'title GLOB "?[A-Z]*"'; // Second character is uppercase
filter: 'title GLOB "[A-Z][a-z]*"'; // Starts with uppercase, then lowercase
```

**Glob Wildcards:**

- `*` - matches zero or more characters
- `?` - matches exactly one character
- `[abc]` - matches one character from the list
- `[a-z]` - matches one character from the range
- `[^abc]` - matches any character except a, b, or c

#### Not Glob

Filters keys whose values do not match a UNIX glob pattern.

```typescript
filter: 'title NOT GLOB "Test*"'; // Does not start with "Test"
filter: 'title NOT GLOB "*Draft*"'; // Does not contain "Draft"
```

### Collection Operators

#### In

Filters keys whose values are equal to any of the given literals.

```typescript
// String values
filter: 'category IN ("technology", "science", "engineering")';

// Number values
filter: 'rating IN (4, 5)';

// Boolean values
filter: 'isPublished IN (true, false)';
```

#### Not In

Filters keys whose values are not equal to any of the given literals.

```typescript
filter: 'category NOT IN ("deprecated", "archived")';
filter: 'rating NOT IN (1, 2)';
```

#### Contains

Filters keys whose values contain the given literal (arrays only).

```typescript
filter: 'tags CONTAINS "python"';
filter: 'categories CONTAINS "machine-learning"';
```

#### Not Contains

Filters keys whose values do not contain the given literal (arrays only).

```typescript
filter: 'tags NOT CONTAINS "deprecated"';
filter: 'categories NOT CONTAINS "legacy"';
```

### Field Existence Operators

#### Has Field

Filters keys which have the given JSON field.

```typescript
filter: 'HAS FIELD metadata.author';
filter: 'HAS FIELD topic.category';
```

#### Has Not Field

Filters keys which do not have the given JSON field.

```typescript
filter: 'HAS NOT FIELD metadata.deprecated';
filter: 'HAS NOT FIELD topic.legacy';
```

## Boolean Operators

### AND

Combines multiple conditions (all must be true).

```typescript
filter: 'category = "technology" AND rating >= 4';
filter: 'isPublished = true AND author = "John Doe"';
```

### OR

Combines multiple conditions (at least one must be true).

```typescript
filter: 'category = "technology" OR category = "science"';
filter: 'rating >= 4 OR isFeatured = true';
```

### Parentheses

Groups conditions to control precedence.

```typescript
// AND has higher precedence than OR
filter: 'category = "technology" AND (rating >= 4 OR isFeatured = true)';

// Complex grouping
filter: '(category = "tech" OR category = "science") AND (rating >= 4 AND isPublished = true)';
```

## Nested Object Filtering

Access nested object properties using dot notation.

```typescript
// Sample metadata structure
{
  "title": "AI Guide",
  "metadata": {
    "author": "John Doe",
    "difficulty": "intermediate",
    "topic": {
      "category": "artificial-intelligence",
      "subcategory": "machine-learning"
    }
  }
}

// Filtering examples
filter: 'metadata.author = "John Doe"'
filter: 'metadata.topic.category = "artificial-intelligence"'
filter: 'metadata.difficulty = "intermediate"'
```

## Array Element Filtering

Access individual array elements using bracket notation.

```typescript
// Sample metadata with arrays
{
  "tags": ["python", "ai", "tutorial"],
  "categories": ["technology", "programming"]
}

// Filtering examples
filter: 'tags[0] = "python"'           // First element
filter: 'tags[#-1] = "tutorial"'       // Last element
filter: 'categories[1] = "programming"' // Second element
```

**Array Indexing:**

- `[0]` - first element
- `[1]` - second element
- `[#-1]` - last element
- `[#-2]` - second to last element

## Complete Examples

### Example 1: Article Search with Multiple Filters

```typescript
interface ArticleMetadata {
  title: string;
  author: string;
  category: string;
  tags: string[];
  publishDate: string;
  rating: number;
  isPublished: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const results = await ragSDK.queryDocsFromRAG<ArticleMetadata>({
  data: 'machine learning algorithms',
  topK: 10,
  filter: `
    category = "technology" AND 
    rating >= 4 AND 
    isPublished = true AND 
    tags CONTAINS "machine-learning" AND
    publishDate >= "2024-01-01"
  `,
  includeData: true,
  includeMetadata: true,
});
```

### Example 2: Product Search with Nested Filters

```typescript
interface ProductMetadata {
  name: string;
  category: string;
  price: number;
  brand: string;
  specifications: {
    color: string;
    size: string;
    material: string;
  };
  tags: string[];
  inStock: boolean;
}

const results = await ragSDK.queryDocsFromRAG<ProductMetadata>({
  data: 'wireless headphones',
  topK: 5,
  filter: `
    category = "electronics" AND 
    price <= 200 AND 
    specifications.color IN ("black", "white") AND
    tags CONTAINS "wireless" AND
    inStock = true
  `,
  includeData: true,
  includeMetadata: true,
});
```

### Example 3: Document Search with Complex Logic

```typescript
interface DocumentMetadata {
  title: string;
  type: string;
  department: string;
  createdBy: string;
  createdDate: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

const results = await ragSDK.queryDocsFromRAG<DocumentMetadata>({
  data: 'quarterly report',
  topK: 10,
  filter: `
    (type = "report" OR type = "documentation") AND
    status IN ("published", "review") AND
    priority = "high" AND
    createdDate >= "2024-01-01" AND
    tags CONTAINS "quarterly"
  `,
  includeData: true,
  includeMetadata: true,
});
```

## Performance Considerations

1. **Filter Budget**: Each query has a filtering budget that determines how many candidate vectors can be compared against the filter.

2. **Post-filtering**: If the budget is exceeded, the system falls back to post-filtering, which may return fewer than `topK` results.

3. **Selective Filters**: Highly selective filters (those that match few vectors) are more efficient.

4. **Index Optimization**: Consider the order of conditions in complex filters for better performance.

## Best Practices

1. **Use Specific Filters**: Be as specific as possible to reduce the number of candidate vectors.

2. **Combine with Semantic Search**: Use filters to narrow down results from semantic search.

3. **Test Filter Performance**: Monitor query performance with different filter combinations.

4. **Use Appropriate Data Types**: Ensure metadata uses the correct data types for efficient filtering.

5. **Avoid Overly Complex Filters**: Break down very complex filters into multiple queries if needed.
