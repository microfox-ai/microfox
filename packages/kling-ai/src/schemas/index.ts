import { z } from 'zod';

export const textToVideoRequestBodySchema = z.object({
  model_name: z.enum(['kling-v1', 'kling-v1-6', 'kling-v2-master']).optional(),
  prompt: z.string(),
  negative_prompt: z.string().optional(),
  cfg_scale: z.number().min(0).max(1).optional(),
  mode: z.enum(['std', 'pro']).optional(),
  camera_control: z.object({
    type: z.enum(['simple', 'down_back', 'forward_up', 'right_turn_forward', 'left_turn_forward']).optional(),
    config: z.object({
      horizontal: z.number().min(-10).max(10).optional(),
      vertical: z.number().min(-10).max(10).optional(),
      pan: z.number().min(-10).max(10).optional(),
      tilt: z.number().min(-10).max(10).optional(),
      roll: z.number().min(-10).max(10).optional(),
      zoom: z.number().min(-10).max(10).optional(),
    }).optional(),
  }).optional(),
  aspect_ratio: z.enum(['16:9', '9:16', '1:1']).optional(),
  duration: z.enum(['5', '10']).optional(),
  callback_url: z.string().url().optional(),
  external_task_id: z.string().optional(),
}).describe('Text to Video Request Body');

export const imageToVideoRequestBodySchema = z.object({
  // Define the schema based on the API documentation
}).describe('Image to Video Request Body');

export const multiImageToVideoRequestBodySchema = z.object({
  // Define the schema based on the API documentation
}).describe('Multi-Image to Video Request Body');

export const videoExtendRequestBodySchema = z.object({
  // Define the schema based on the API documentation
}).describe('Video Extend Request Body');

export const lipSyncRequestBodySchema = z.object({
  // Define the schema based on the API documentation
}).describe('Lip Sync Request Body');

export const videoEffectsRequestBodySchema = z.object({
  // Define the schema based on the API documentation
}).describe('Video Effects Request Body');

export const imageGenerationRequestBodySchema = z.object({
  // Define the schema based on the API documentation
}).describe('Image Generation Request Body');

export const virtualTryOnRequestBodySchema = z.object({
  // Define the schema based on the API documentation
}).describe('Virtual Try-On Request Body');
