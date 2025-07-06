import { z } from 'zod';

export const musicGenerationParamsSchema = z.object({
  genre: z.string().describe('The genre of the music to generate (e.g., "rock", "jazz", "classical")'),
  duration: z.number().positive().describe('The duration of the music in seconds'),
  tempo: z.number().positive().describe('The tempo of the music in beats per minute (bpm)'),
  otherParameters: z.record(z.unknown()).optional().describe('Additional parameters for music generation'),
});

export const textToSpeechParamsSchema = z.object({
  text: z.string().describe('The text to be converted to speech'),
  voice: z.string().describe('The voice to use (e.g., "male", "female", or specific voice names)'),
  language: z.string().describe('The language code (e.g., "en-US", "es-ES")'),
});

export const musicGenerationResponseSchema = z.object({
  audioUrl: z.string().url().describe('URL to download the generated music'),
  status: z.string().describe('Status of the music generation (e.g., "success", "failed")'),
  message: z.string().optional().describe('Optional message providing additional information'),
});

export const textToSpeechResponseSchema = z.object({
  audioUrl: z.string().url().describe('URL to download the generated audio'),
  status: z.string().describe('Status of the text-to-speech conversion'),
  message: z.string().optional().describe('Optional message providing additional information'),
});
