import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import 'dotenv/config';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const anthrophobic = createAnthropic({
  apiKey: process.env.CLAUDE_API_KEY!,
});

export const models: Record<
  | 'default'
  | 'googleGeminiFlash'
  | 'googleGeminiPro'
  | 'claude35Sonnet'
  | 'claudeHaiku',
  {
    modelId: string;
  } & any
> = {
  default: anthrophobic('claude-3-haiku-20240307', {}),
  googleGeminiFlash: google('gemini-1.5-flash', {
    structuredOutputs: true,
  }),
  googleGeminiPro: google('gemini-1.5-pro', {
    structuredOutputs: true,
  }),
  claude35Sonnet: anthrophobic('claude-3-5-sonnet-20240620', {}),
  claudeHaiku: anthrophobic('claude-3-haiku-20240307', {}),
};
