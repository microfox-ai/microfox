## Function: `cosineSimilarity`

Calculates the cosine similarity between two vectors.  This function is useful for comparing the similarity of embeddings, where a high value (close to 1) indicates high similarity and a low value (close to -1) indicates dissimilarity.

**Purpose:**

To determine the similarity between two vectors, typically used with embeddings.

**Parameters:**

* `vector1`: array<number> - **Required**. The first vector to compare.  Each element of the array represents a component of the vector.  There are no specific constraints on the values within the vector, but they should be numerical.
* `vector2`: array<number> - **Required**. The second vector to compare.  Each element of the array represents a component of the vector.  There are no specific constraints on the values within the vector, but they should be numerical.  The length of `vector2` should be the same as `vector1` for the calculation to be meaningful.
* `options`: object - **Optional**. Additional configuration options.
    * `throwErrorForEmptyVectors`: boolean - **Optional**. Defaults to `false`. If set to `true`, the function will throw an error if either `vector1` or `vector2` is an empty array.


**Return Value:**

number - A number between -1 and 1 representing the cosine similarity between the two vectors.  A value of 1 indicates perfect similarity, -1 indicates perfect dissimilarity, and 0 indicates orthogonality (no similarity).


**Examples:**

```typescript
// Example 1: Basic usage with non-empty vectors
import { cosineSimilarity } from 'ai';

const vector1 = [1, 2, 3];
const vector2 = [4, 5, 6];
const similarity = cosineSimilarity(vector1, vector2);
console.log(`cosine similarity: ${similarity}`); // Output will be a number between -1 and 1

// Example 2: Using options to throw an error for empty vectors
import { cosineSimilarity } from 'ai';

const vector3: number[] = [];
const vector4 = [1, 2, 3];

try {
  const similarity2 = cosineSimilarity(vector3, vector4, { throwErrorForEmptyVectors: true });
  console.log(`cosine similarity: ${similarity2}`);
} catch (error) {
  console.error('Error:', error.message); // Output: Error: Vectors cannot be empty
}


// Example 3: Vectors with different magnitudes
import { cosineSimilarity } from 'ai';

const vector5 = [1, 0, 0];
const vector6 = [2, 0, 0];
const similarity3 = cosineSimilarity(vector5, vector6);
console.log(`cosine similarity: ${similarity3}`); // Output: 1 (perfect similarity despite different magnitudes)

// Example 4: Vectors with negative values
import { cosineSimilarity } from 'ai';

const vector7 = [1, -2, 3];
const vector8 = [-4, 5, -6];
const similarity4 = cosineSimilarity(vector7, vector8);
console.log(`cosine similarity: ${similarity4}`); // Output will be a number between -1 and 1

// Example 5: Vectors with zero magnitude
import { cosineSimilarity } from 'ai';

const vector9: number[] = [0, 0, 0];
const vector10: number[] = [0, 0, 0];

try {
  const similarity5 = cosineSimilarity(vector9, vector10, { throwErrorForEmptyVectors: true });
  console.log(`cosine similarity: ${similarity5}`);
} catch (error) {
  console.error('Error:', error.message); // Output: Error: Vectors cannot be empty
}

const similarity6 = cosineSimilarity(vector9, vector10); // No error thrown, but the result is NaN
console.log(`cosine similarity: ${similarity6}`); // Output: NaN

// Example 6: Using with embeddings (from provided example)
import { openai } from '@ai-sdk/openai';
import { cosineSimilarity, embedMany } from 'ai';

const { embeddings } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: ['sunny day at the beach', 'rainy afternoon in the city'],
});

console.log(
  `cosine similarity: ${cosineSimilarity(embeddings[0], embeddings[1])}`,
);

```
