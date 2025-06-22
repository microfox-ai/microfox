import { z } from 'zod';

export type VeoModel = 'veo-2.0-generate-001' | 'veo-3.0-generate-preview';

export interface VeoGenerateVideoRequest {
  instances: {
    prompt?: string;
    image?: {
      bytesBase64Encoded?: string;
      gcsUri?: string;
      mimeType: string;
    };
  }[];
  parameters: {
    aspectRatio?: '16:9' | '9:16';
    negativePrompt?: string;
    personGeneration?: 'allow_adult' | 'dont_allow';
    sampleCount?: number;
    seed?: number;
    storageUri?: string;
    durationSeconds: number;
    enhancePrompt?: boolean;
    generateAudio?: boolean;
  };
}

export interface VeoGenerateVideoResponse {
  name: string;
}

export interface VeoFetchOperationRequest {
  operationName: string;
}

export interface VeoFetchOperationResponse {
  name: string;
  done: boolean;
  response?: {
    '@type': 'type.googleapis.com/cloud.ai.large_models.vision.GenerateVideoResponse';
    generatedSamples: {
      video: {
        uri: string;
        encoding: string;
      };
    }[];
  };
}

export interface VeoonVertexAIAPISdk {
  generateVideo(model: VeoModel, request: VeoGenerateVideoRequest): Promise<VeoGenerateVideoResponse>;
  fetchOperationStatus(model: VeoModel, request: VeoFetchOperationRequest): Promise<VeoFetchOperationResponse>;
  pollOperation(model: VeoModel, operationName: string, intervalMs?: number, timeoutMs?: number): Promise<VeoFetchOperationResponse>;
}
