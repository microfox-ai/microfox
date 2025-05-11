## Function: `createIdGenerator`

Creates a customizable ID generator function.  This function allows you to configure various aspects of the generated IDs, such as the character set (alphabet), a prefix, a separator between the prefix and the random part, and the length of the random part.

**Purpose:**

The primary purpose of this function is to provide a flexible way to generate IDs within your application.  It allows you to create multiple ID generators with different configurations, ensuring that IDs are formatted consistently according to your specific needs.  This is particularly useful when you need different ID formats for different entities or purposes within your application.

**Parameters:**

* `options`: (Optional)  An object that allows you to customize the ID generator.

    * `options.alphabet`: (Optional) A string specifying the characters to use for the random part of the ID. Defaults to alphanumeric characters (0-9, A-Z, a-z).  Any valid character can be included in the alphabet.
    * `options.prefix`: (Optional) A string to prepend to all generated IDs.  Defaults to no prefix.  Any valid string can be used as a prefix.
    * `options.separator`: (Optional) A string used to separate the prefix and the random part of the ID. Defaults to "-". Any valid string can be used as a separator. The separator character must not be part of the alphabet.
    * `options.size`: (Optional) A number specifying the length of the random part of the ID. Defaults to 16.  Must be a non-negative integer.


**Return Value:**

A function that generates IDs based on the provided configuration. The generated IDs are strings.  The returned function takes no arguments.

**Examples:**

```typescript
// Example 1: Minimal usage (default settings)
import { createIdGenerator } from 'ai';
const generateId = createIdGenerator();
const id1 = generateId(); // Example: "k6Sv-aIb-_6f0-qNLW"

// Example 2: Custom alphabet
const generateCustomId = createIdGenerator({ alphabet: 'abcdef0123456789' });
const id2 = generateCustomId(); // Example: "45a167d93f0ceb2"

// Example 3: With prefix and separator
const generatePrefixedId = createIdGenerator({ prefix: 'user', separator: '_' });
const id3 = generatePrefixedId(); // Example: "user_g7H0-JqK1-Lmn2-Opq3"

// Example 4: Custom size
const generateShortId = createIdGenerator({ size: 8 });
const id4 = generateShortId(); // Example: "a1b2c3d4"

// Example 5: All options combined
const generateComplexId = createIdGenerator({
  alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  prefix: 'product',
  separator: '-',
  size: 12,
});
const id5 = generateComplexId(); // Example: "product-A1B2C3D4E5F6"

// Example 6: Separator character in alphabet (throws an error)
try {
  const generateInvalidId = createIdGenerator({
    alphabet: 'ABCDEF-',
    separator: '-',
  });
  const id6 = generateInvalidId();
} catch (error) {
  console.error('Error:', error.message); // Error: Separator character must not be part of the alphabet
}

// Example 7: Invalid size (throws an error)
try {
  const generateInvalidId = createIdGenerator({ size: -1 });
  const id7 = generateInvalidId();
} catch (error) {
  console.error('Error:', error.message); // Error: Size must be a non-negative integer
}
```
