import { z } from 'zod';

export const veoGenerateVideoRequestSchema = z.object({
  instances: z.array(z.object({
    prompt: z.string().optional().describe('Text prompt for video generation'),
    image: z.object({
      bytesBase64Encoded: z.string().optional().describe('Base64 encoded image string'),
      gcsUri: z.string().optional().describe('Google Cloud Storage URI'),
      mimeType: z.string().describe('MIME type of the image'),
    }).optional(),
  })),
  parameters: z.object({
    aspectRatio: z.enum(['16:9', '9:16']).optional().default('16:9').describe('Aspect ratio of the generated video'),
    negativePrompt: z.string().optional().describe('Negative prompt for video generation'),
    personGeneration: z.enum(['allow_adult', 'dont_allow']).optional().default('allow_adult').describe('Person generation settings'),
    sampleCount: z.number().int().min(1).max(4).optional().default(1).describe('Number of samples to generate'),
    seed: z.number().int().min(0).max(4294967295).optional().describe('Seed for random generation'),
    storageUri: z.string().optional().describe('Google Cloud Storage URI for output'),
    durationSeconds: z.number().int().min(5).max(8).describe('Duration of the generated video in seconds'),
    enhancePrompt: z.boolean().optional().default(true).describe('Whether to enhance the prompt'),
    generateAudio: z.boolean().optional().describe('Whether to generate audio (required for veo-3.0-generate-preview)'),
  }),
});

export const veoFetchOperationRequestSchema = z.object({
  operationName: z.string().describe('Operation name from Generate Video response'),
});
