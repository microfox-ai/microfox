import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

export const ModelConfig = z.object({
  primary: z.string(),
  fallback: z.string()
});

export const modelConfigs = {
  'gemini-pro': {
    maxTokens: 8192,
    temperature: 0.7
  },
  'gpt-4': {
    maxTokens: 8192,
    temperature: 0.7
  }
};

const google = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const models: Record<
  | 'default'
  | 'googleGeminiFlash'
  | 'googleGeminiPro',
  {
    modelId: string;
    create?: () => Promise<any>;
    model?: string;
    max_tokens?: number;
  }
> = {
  default: {
    modelId: 'gemini-1.5-pro',
    create: async () => google.getGenerativeModel({
      model: 'gemini-1.5-pro',
      safetySettings: []
    }),
    model: 'gemini-1.5-pro',
    max_tokens: 8192
  },
  googleGeminiFlash: {
    modelId: 'gemini-1.5-flash',
    create: async () => google.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings: []
    }),
    model: 'gemini-1.5-flash',
    max_tokens: 8192
  },
  googleGeminiPro: {
    modelId: 'gemini-1.5-pro',
    create: async () => google.getGenerativeModel({
      model: 'gemini-1.5-pro',
      safetySettings: []
    }),
    model: 'gemini-1.5-pro',
    max_tokens: 8192
  }
};
