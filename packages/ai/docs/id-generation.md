## ID Generation

The AI SDK provides flexible utilities for generating unique identifiers.

### `generateId`

A simple function to generate a unique ID with a default configuration. This is the same function used internally by the AI SDK.

**Signature:**

```typescript
function generateId(): string;
```

**Return Value:**

- `string`: A unique 16-character alphanumeric string.

**Example:**

```typescript
import { generateId } from 'ai';

const id1 = generateId(); // e.g., 'k6Sv-aIb-_6f0-qNLW'
const id2 = generateId();

console.log(id1 !== id2); // true
```

---
