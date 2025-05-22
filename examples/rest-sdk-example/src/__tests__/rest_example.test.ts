//microfox/examples/rest-sdk-example/src/__tests__/rest_example.test.ts

import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import {
  createRestSDK,
  APICallError,
  MicrofoxSDKError,
} from '@microfox/rest-sdk';
import { Post, CreatePost } from '../index';

describe('REST SDK Integration Tests', () => {
  const jsonPlaceholder = createRestSDK({
    baseUrl: 'https://jsonplaceholder.typicode.com',
  });

  describe('Response Types', () => {
    it('should handle JSON responses', async () => {
      const post = await jsonPlaceholder.get<Post>('/posts/1').json();
      expect(post).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
      });
    });

    it('should handle text responses', async () => {
      const text = await jsonPlaceholder
        .get('/posts/1', {
          headers: { Accept: 'text/plain' },
        })
        .text();
      expect(typeof text).toBe('string');
    });

    it('should handle form data submission', async () => {
      const formData = new FormData();
      formData.append('title', 'Test Post');
      formData.append('body', 'Test Content');

      const response = await jsonPlaceholder
        .post('/posts', formData, {
          contentType: 'multipart/form-data',
        })
        .json();

      expect(response).toHaveProperty('id');
    });
  });

  describe('Request Options', () => {
    it('should handle query parameters', async () => {
      const posts = await jsonPlaceholder
        .get<Post[]>('/posts', {
          query: {
            userId: 1,
            _limit: 2,
          },
        })
        .json();

      expect(posts).toHaveLength(2);
      expect(posts.every(post => post.userId === 1)).toBe(true);
    });

    it('should handle custom headers', async () => {
      const response = await jsonPlaceholder
        .get('/posts/1', {
          headers: {
            'X-Custom-Header': 'test',
          },
        })
        .json();
      expect(response).toBeDefined();
    });

    it('should handle retry logic', async () => {
      const response = await jsonPlaceholder
        .get('/posts/1', {
          retry: {
            attempts: 2,
            delay: 100,
            backoff: 2,
          },
        })
        .json();
      expect(response).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors', async () => {
      await expect(jsonPlaceholder.get('/nonexistent').json()).rejects.toThrow(
        APICallError,
      );
    });

    it('should handle invalid JSON responses', async () => {
      const invalidJsonClient = createRestSDK({
        baseUrl: 'https://httpbin.org',
      });

      await expect(invalidJsonClient.get('/html').json()).rejects.toThrow(
        MicrofoxSDKError,
      );
    });

    it('should handle network errors', async () => {
      const invalidClient = createRestSDK({
        baseUrl: 'https://invalid-domain-123456.com',
      });

      await expect(invalidClient.get('/test').json()).rejects.toThrow();
    });
  });

  describe('Content Types', () => {
    it('should handle URL-encoded data', async () => {
      const response = await jsonPlaceholder
        .post(
          '/posts',
          { title: 'test', body: 'content' },
          { contentType: 'application/x-www-form-urlencoded' },
        )
        .json();

      expect(response).toHaveProperty('id');
    });

    it('should handle binary data', async () => {
      const blob = new Blob(['test content'], { type: 'text/plain' });
      const response = await jsonPlaceholder
        .post('/posts', blob, {
          contentType: 'application/octet-stream',
        })
        .json();

      expect(response).toBeDefined();
    });
  });

  describe('Response Methods', () => {
    it('should access response headers', async () => {
      const headers = await jsonPlaceholder.get('/posts/1').headers();
      expect(headers).toHaveProperty('content-type');
    });

    it('should access response status', async () => {
      const status = await jsonPlaceholder.get('/posts/1').status();
      expect(status).toBe(200);
    });

    it('should access raw response', async () => {
      const response = await jsonPlaceholder.get('/posts/1').raw();
      expect(response instanceof Response).toBe(true);
    });
  });
});
