import { z } from 'zod';

// Zod schemas for xsquare SDK validation

/**
 * Schema for XsquareSdk configuration validation
 */
export const XsquareSdkConfigSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  baseUrl: z.string().url().optional(),
  name: z.string().optional(),
  version: z.string().optional(),
});

/**
 * Schema for API response validation
 */
export const XsquareSdkResponseSchema = z.object({
  data: z.any(),
  success: z.boolean(),
  status: z.number(),
  message: z.string(),
  error: z.instanceof(Error).optional(),
});

// TODO: Add your validation schemas here
// Example:
// export const UserSchema = z.object({
//   id: z.string(),
//   name: z.string().min(1, 'Name is required'),
//   email: z.string().email('Invalid email format')
// });

// export const CreateUserSchema = z.object({
//   name: z.string().min(1, 'Name is required'),
//   email: z.string().email('Invalid email format')
// });
