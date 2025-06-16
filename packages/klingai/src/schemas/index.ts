import { z } from 'zod';

export const textToVideoParamsSchema = z.object({
  prompt: z.string().min(1).max(1000).describe('The text prompt to generate the video from'),
  style: z.string().optional().describe('The style of the generated video'),
  duration: z.number().positive().optional().describe('The desired duration of the video in seconds'),
});

export const imageToVideoParamsSchema = z.object({
  imageUrl: z.string().url().describe('The URL of the image to generate the video from'),
  style: z.string().optional().describe('The style of the generated video'),
  duration: z.number().positive().optional().describe('The desired duration of the video in seconds'),
});

export const multiImageToVideoParamsSchema = z.object({
  imageUrls: z.array(z.string().url()).min(2).max(10).describe('An array of image URLs to generate the video from'),
  style: z.string().optional().describe('The style of the generated video'),
  duration: z.number().positive().optional().describe('The desired duration of the video in seconds'),
});

export const videoExtensionParamsSchema = z.object({
  videoUrl: z.string().url().describe('The URL of the video to extend'),
  duration: z.number().positive().describe('The desired duration of the extended video in seconds'),
});

export const lipSyncParamsSchema = z.object({
  videoUrl: z.string().url().describe('The URL of the video to apply lip sync to'),
  audioUrl: z.string().url().describe('The URL of the audio to sync with the video'),
});

export const videoEffectsParamsSchema = z.object({
  videoUrl: z.string().url().describe('The URL of the video to apply effects to'),
  effectName: z.string().min(1).describe('The name of the effect to apply'),
});

export const imageGenerationParamsSchema = z.object({
  prompt: z.string().min(1).max(1000).describe('The text prompt to generate the image from'),
  style: z.string().optional().describe('The style of the generated image'),
});

export const virtualTryOnParamsSchema = z.object({
  imageUrl: z.string().url().optional().describe('The URL of the image for virtual try-on'),
  videoUrl: z.string().url().optional().describe('The URL of the video for virtual try-on'),
  itemId: z.string().min(1).describe('The ID of the item to try on'),
}).refine(data => data.imageUrl || data.videoUrl, {
  message: "Either imageUrl or videoUrl must be provided",
});
