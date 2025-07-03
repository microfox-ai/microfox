## Function: `cosineSimilarity`

Calculates the cosine similarity between two vectors. Cosine similarity is a measure of similarity between two non-zero vectors that measures the cosine of the angle between them. A value of 1 means the vectors are identical in orientation, 0 means they are orthogonal, and -1 means they are in opposite directions.

### Purpose

To determine the similarity between two vectors, which is especially useful for comparing embeddings.

### Parameters

- `vector1`: `number[]` - The first vector. (Required)
- `vector2`: `number[]` - The second vector. (Required)

**Note:** The two vectors must have the same length.

### Return Value

- `number`: A number between -1 and 1 representing the cosine similarity.

### Throws

- `Error`: If the vectors have different lengths.

### Examples

```typescript
import { cosineSimilarity } from 'ai';

// Example 1: Basic usage
const vector1 = [1, 2, 3];
const vector2 = [4, 5, 6];
const similarity = cosineSimilarity(vector1, vector2);
// similarity will be approximately 0.9746

// Example 2: Identical vectors
const vector3 = [1, 0, 0];
const vector4 = [1, 0, 0];
const similarity2 = cosineSimilarity(vector3, vector4);
// similarity2 will be 1

// Example 3: Orthogonal vectors
const vector5 = [1, 0];
const vector6 = [0, 1];
const similarity3 = cosineSimilarity(vector5, vector6);
// similarity3 will be 0

// Example 4: Opposite vectors
const vector7 = [1, 2];
const vector8 = [-1, -2];
const similarity4 = cosineSimilarity(vector7, vector8);
// similarity4 will be -1
```

A common use case is to compare embeddings:

```typescript
import { cosineSimilarity, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';

const { embeddings } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'He enjoys sunbathing on the sand.',
  ],
});

const similarityBeachVsRain = cosineSimilarity(embeddings[0], embeddings[1]);
// A lower value, indicating less similarity.

const similarityBeachVsSunbathing = cosineSimilarity(
  embeddings[0],
  embeddings[2],
);
// A higher value, indicating more similarity.
```
