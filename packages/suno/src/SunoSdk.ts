import { z } from 'zod';
import { SunoSDKOptions, MusicGenerationParams, MusicGenerationResponse, TextToSpeechParams, TextToSpeechResponse } from './types';
import { musicGenerationParamsSchema, textToSpeechParamsSchema } from './schemas';

class SunoSDK {
  private apiKey: string;
  private baseUrl: string = 'https://api.sunoapi.org/v1';

  constructor(options?: SunoSDKOptions) {
    this.apiKey = options?.apiKey || process.env.SUNO_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('API key is required. Please provide it in the constructor or set the SUNO_API_KEY environment variable.');
    }
  }

  private async request<T>(endpoint: string, method: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorBody = await response.json();
        errorMessage += ` - ${errorBody.message || JSON.stringify(errorBody)}`;
      } catch (e) {
        // If parsing fails, we'll just use the status code
      }
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  }

  async generateMusic(params: MusicGenerationParams): Promise<MusicGenerationResponse> {
    const validatedParams = musicGenerationParamsSchema.parse(params);
    return this.request<MusicGenerationResponse>('/music/generate', 'POST', validatedParams);
  }

  async generateSpeech(params: TextToSpeechParams): Promise<TextToSpeechResponse> {
    const validatedParams = textToSpeechParamsSchema.parse(params);
    return this.request<TextToSpeechResponse>('/tts/generate', 'POST', validatedParams);
  }
}

export function createSunoSDK(options?: SunoSDKOptions): SunoSDK {
  return new SunoSDK(options);
}
