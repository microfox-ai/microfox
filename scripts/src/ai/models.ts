import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAnthropic } from '@ai-sdk/anthropic';
import 'dotenv/config';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const anthrophobic = createAnthropic({
  apiKey: process.env.CLAUDE_API_KEY ?? process.env.ANTHROPIC_API_KEY ?? '',
});

export const models: Record<
  | 'default'
  | 'googleGeminiFlash'
  | 'googleGeminiPro'
  | 'googleGemini25Pro'
  | 'claudeDefault'
  | 'claude35Sonnet'
  | 'claude4Sonnet'
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
  googleGemini25Pro: google('gemini-2.5-pro-preview-06-05', {
    structuredOutputs: true,
  }),
  claudeDefault: anthrophobic('claude-4-sonnet-20250514', {}),
  claude35Sonnet: anthrophobic('claude-3-5-sonnet-20240620', {}),
  claude4Sonnet: anthrophobic('claude-4-sonnet-20250514', {}),
  claudeHaiku: anthrophobic('claude-3-haiku-20240307', {}),
};
