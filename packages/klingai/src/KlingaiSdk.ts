import { z } from 'zod';
import {
  KlingaiSDKOptions,
  TextToVideoParams,
  ImageToVideoParams,
  MultiImageToVideoParams,
  VideoExtensionParams,
  LipSyncParams,
  VideoEffectsParams,
  ImageGenerationParams,
  VirtualTryOnParams,
  AccountInformation,
  BillingInformation,
} from './types';
import {
  textToVideoParamsSchema,
  imageToVideoParamsSchema,
  multiImageToVideoParamsSchema,
  videoExtensionParamsSchema,
  lipSyncParamsSchema,
  videoEffectsParamsSchema,
  imageGenerationParamsSchema,
  virtualTryOnParamsSchema,
} from './schemas';

class KlingaiSDK {
  private apiKey: string;
  private baseUrl: string = 'https://api-singapore.klingai.com';

  constructor(options: KlingaiSDKOptions) {
    this.apiKey = options.apiKey || process.env.KLINGAI_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('API key is required. Please provide it in the constructor or set the KLINGAI_API_KEY environment variable.');
    }
  }

  private async request<T>(endpoint: string, method: string, data?: unknown): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json() as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Klingai API request failed: ${error.message}`);
      }
      throw new Error('Klingai API request failed');
    }
  }

  async textToVideo(params: TextToVideoParams): Promise<string> {
    const validatedParams = textToVideoParamsSchema.parse(params);
    return this.request<string>('/text-to-video', 'POST', validatedParams);
  }

  async imageToVideo(params: ImageToVideoParams): Promise<string> {
    const validatedParams = imageToVideoParamsSchema.parse(params);
    return this.request<string>('/image-to-video', 'POST', validatedParams);
  }

  async multiImageToVideo(params: MultiImageToVideoParams): Promise<string> {
    const validatedParams = multiImageToVideoParamsSchema.parse(params);
    return this.request<string>('/multi-image-to-video', 'POST', validatedParams);
  }

  async videoExtension(params: VideoExtensionParams): Promise<string> {
    const validatedParams = videoExtensionParamsSchema.parse(params);
    return this.request<string>('/video-extension', 'POST', validatedParams);
  }

  async lipSync(params: LipSyncParams): Promise<string> {
    const validatedParams = lipSyncParamsSchema.parse(params);
    return this.request<string>('/lip-sync', 'POST', validatedParams);
  }

  async videoEffects(params: VideoEffectsParams): Promise<string> {
    const validatedParams = videoEffectsParamsSchema.parse(params);
    return this.request<string>('/video-effects', 'POST', validatedParams);
  }

  async imageGeneration(params: ImageGenerationParams): Promise<string> {
    const validatedParams = imageGenerationParamsSchema.parse(params);
    return this.request<string>('/image-generation', 'POST', validatedParams);
  }

  async virtualTryOn(params: VirtualTryOnParams): Promise<string> {
    const validatedParams = virtualTryOnParamsSchema.parse(params);
    return this.request<string>('/virtual-try-on', 'POST', validatedParams);
  }

  async getAccountInformation(): Promise<AccountInformation> {
    return this.request<AccountInformation>('/account-information', 'GET');
  }

  async getBillingInformation(): Promise<BillingInformation> {
    return this.request<BillingInformation>('/billing', 'GET');
  }
}

export function createKlingaiSDK(options: KlingaiSDKOptions): KlingaiSDK {
  return new KlingaiSDK(options);
}
