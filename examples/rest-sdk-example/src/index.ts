// microfox/examples/rest-sdk-example/src/index.ts

import { z } from 'zod';
import {
  APICallError,
  MicrofoxSDKError,
  createRestSDK,
} from '@microfox/rest-sdk';

// Define type schemas for JSONPlaceholder API
const PostSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  body: z.string(),
});

const CreatePostSchema = PostSchema.omit({ id: true });
const UpdatePostSchema = CreatePostSchema.partial();

type Post = z.infer<typeof PostSchema>;
type CreatePost = z.infer<typeof CreatePostSchema>;
type UpdatePost = z.infer<typeof UpdatePostSchema>;

// Initialize SDKs with different configurations
const jsonPlaceholder = createRestSDK({
  baseUrl: 'https://jsonplaceholder.typicode.com',
});

const github = createRestSDK({
  baseUrl: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
  },
});


console.log("example started");

// Example usage with different content types and response formats
async function restSDKExamples() {
  try {
    // GET request with JSON response
    const posts = await github
      .get('/search/repositories', {
        query: {
          q: 'typescript',
          sort: 'stars',
          order: 'desc',
          per_page: 5,
        },
      })
      .json();
    console.log('Top TypeScript repos:', posts);

    // GET request with text response
    const readme = await github
      .get('/repos/microsoft/typescript/readme', {
        headers: { Accept: 'text/plain' },
      })
      .text();
    console.log('README content:', readme);

    // POST with form data
    const formData = new FormData();
    formData.append('title', 'New Post');
    formData.append('body', 'Content');
    formData.append('file', new Blob(['test content'], { type: 'text/plain' }));

    const formResponse = await jsonPlaceholder
      .post('/posts', formData, {
        contentType: 'multipart/form-data',
      })
      .json();
    console.log('Form submission result:', formResponse);

    // POST with URL-encoded data
    const urlEncodedResponse = await jsonPlaceholder
      .post(
        '/posts',
        {
          title: 'URL Encoded Post',
          content: 'Test content',
        },
        {
          contentType: 'application/x-www-form-urlencoded',
        },
      )
      .json();
    console.log('URL-encoded submission:', urlEncodedResponse);

    // GET with blob response (e.g., downloading a file)
    const imageBlob = await github
      .get('/repos/microsoft/typescript/contents/logo.png', {
        headers: { Accept: 'application/octet-stream' },
      })
      .blob();
    console.log('Image size:', imageBlob.size);

    // Request with retry
    const retryableRequest = await jsonPlaceholder
      .get('/posts/1', {
        retry: {
          attempts: 3,
          delay: 1000,
          backoff: 2,
        },
      })
      .json();
    console.log('Retried request result:', retryableRequest);
  } catch (error) {
    if (APICallError.isInstance(error)) {
      console.error('API Error:', {
        message: error.message,
        statusCode: error.statusCode,
        url: error.url,
      });
    } else if (MicrofoxSDKError.isInstance(error)) {
      console.error('SDK Error:', {
        name: error.name,
        message: error.message,
      });
    } else {
      console.error('Unknown error:', error);
    }
  }
}

// Factory function for creating authenticated clients
const createAuthenticatedClient = (baseUrl: string, token: string) => {
  return createRestSDK({
    baseUrl,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
};

// Example with environment-specific configuration
const createGitHubClient = (token?: string) => {
  return createRestSDK({
    baseUrl: 'https://api.github.com',
    headers: {
      ...(token && { Authorization: `token ${token}` }),
      Accept: 'application/vnd.github.v3+json',
    },
  });
};

// Example with different API versions (OpenWeatherMap)
const createWeatherClient = (
  apiKey: string,
  version: 'free' | 'pro' = 'free',
) => {
  const baseUrls = {
    free: 'https://api.openweathermap.org/data/2.5',
    pro: 'https://api.openweathermap.org/data/3.0',
  };

  return createRestSDK({
    baseUrl: baseUrls[version],
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    timeout: 10000, // weather API might be slower
  });
};

// Example with parallel requests to different APIs
async function multiApiExample() {
  const [posts, repos] = await Promise.all([
    jsonPlaceholder.get<Post[]>('/posts'),
    github.get('/search/repositories', {
      query: { q: 'javascript', sort: 'stars' },
    }),
  ]);

  return { posts, repos };
}

// Without timeout (will use default 30000ms)
const client = createRestSDK({
  baseUrl: 'https://api.example.com',
  headers: { 'Content-Type': 'application/json' },
});

// With custom timeout
const clientWithTimeout = createRestSDK({
  baseUrl: 'https://api.example.com',
  timeout: 5000,
});

//added line
restSDKExamples();



export {
  restSDKExamples,
  createAuthenticatedClient,
  createGitHubClient,
  createWeatherClient,
  multiApiExample,
  Post,
  CreatePost,
  UpdatePost,
};
