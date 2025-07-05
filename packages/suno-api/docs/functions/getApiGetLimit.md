# getApiGetLimit

Get quota information.

## Usage

```typescript
import { createClient, getApiGetLimit } from '@microfox/suno-api';

const client = createClient();

async function getLimit() {
  try {
    const response = await getApiGetLimit({
      client: client,
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

getLimit();
```

## Input

This function does not take any input parameters.

## Output

Returns an object with the following properties:

| Name            | Type   | Description                                           |
| --------------- | ------ | ----------------------------------------------------- |
| `credits_left`  | number | Remaining credits. Each generated audio consumes 5 credits. |
| `period`        | string | The billing period.                                   |
| `monthly_limit` | number | Monthly credit limit.                                 |
| `monthly_usage` | number | Credits used in the current month.                    | 