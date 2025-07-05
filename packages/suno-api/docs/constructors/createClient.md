# createClient

Creates a new instance of the Suno API client.

## Usage

```typescript
import { createClient } from '@microfox/suno-api';

const client = createClient({
  // You can add client configurations here, like a custom fetch implementation
  // baseUrl is already configured to point to the Suno API proxy
});
```

## Configuration

The `createClient` function accepts a configuration object with the following properties:

| Name                | Type                                      | Description                                                                                                                              |
| ------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `baseUrl`           | string                                    | Base URL for all requests. Defaults to the Suno API proxy.                                                                               |
| `bodySerializer`    | `(body: unknown) => unknown`              | A function to serialize the request body.                                                                                                |
| `fetch`             | `(request: Request) => Promise<Response>` | A custom `fetch` implementation. Defaults to the global `fetch`.                                                                         |
| `headers`           | `HeadersInit`                             | Default headers to be sent with every request.                                                                                           |
| `parseAs`           | 'arrayBuffer' │ 'auto' │ 'blob' │ 'formData' │ 'json' │ 'stream' │ 'text' | How to parse the response body. Defaults to `auto`, which infers from the `Content-Type` header. |
| `querySerializer`   | `(query: Record<string, unknown>) => string` | A function to serialize query parameters.                                                                                                |
| `responseStyle`     | 'data' │ 'fields'                         | Whether to return only the `data` field or the full response object (`data`, `error`, `response`). Defaults to `fields`.                   |
| `throwOnError`      | boolean                                   | If `true`, the client will throw an error on a failed request instead of returning it in the `error` field. Defaults to `false`.            |
| `requestValidator`  | `(request: RequestOptions) => Promise<void>` | An async function to validate the request options before the request is sent.                                                            |
| `responseValidator` | `(response: unknown) => Promise<void>`    | An async function to validate the response data after it's received and parsed.                                                          |
| `responseTransformer`| `(response: unknown) => Promise<unknown>` | An async function to transform the response data before it's returned.                                                                   |

... and any other properties from the standard `RequestInit` object (except `body`, `headers`, and `method`).