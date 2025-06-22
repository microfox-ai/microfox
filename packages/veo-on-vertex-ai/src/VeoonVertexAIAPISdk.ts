import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
import {
  VeoGenerateVideoRequest,
  VeoGenerateVideoResponse,
  VeoFetchOperationRequest,
  VeoFetchOperationResponse,
  VeoModel,
} from './types';
import {
  veoGenerateVideoRequestSchema,
  veoFetchOperationRequestSchema,
} from './schemas';

const execAsync = promisify(exec);

export class VeoonVertexAIAPISdk {
  private projectId: string;
  private location: string;
  private baseUrl: string;

  constructor(projectId?: string, location?: string) {
    this.projectId = projectId || process.env.GOOGLE_CLOUD_PROJECT || '';
    this.location = location || process.env.GOOGLE_CLOUD_LOCATION || '';
    this.baseUrl = `https://${this.location}-aiplatform.googleapis.com/v1`;

    if (!this.projectId) {
      throw new Error('Project ID is required. Set GOOGLE_CLOUD_PROJECT environment variable or pass it to the constructor.');
    }
    if (!this.location) {
      throw new Error('Location is required. Set GOOGLE_CLOUD_LOCATION environment variable or pass it to the constructor.');
    }
  }

  private async getAccessToken(): Promise<string> {
    try {
      const { stdout } = await execAsync('gcloud auth print-access-token');
      return stdout.trim();
    } catch (error) {
      throw new Error('Failed to obtain Google Cloud access token. Make sure you are authenticated with gcloud CLI.');
    }
  }

  private async makeRequest<T>(endpoint: string, method: string, body?: any): Promise<T> {
    const accessToken = await this.getAccessToken();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText}\n${errorText}`);
    }

    return response.json();
  }

  async generateVideo(model: VeoModel, request: VeoGenerateVideoRequest): Promise<VeoGenerateVideoResponse> {
    const validatedRequest = veoGenerateVideoRequestSchema.parse(request);

    if (model === 'veo-3.0-generate-preview') {
      if (validatedRequest.parameters.aspectRatio === '9:16') {
        throw new Error('Aspect ratio 9:16 is not supported for veo-3.0-generate-preview');
      }
      if (!validatedRequest.parameters.generateAudio) {
        throw new Error('generateAudio must be true for veo-3.0-generate-preview');
      }
      validatedRequest.parameters.durationSeconds = 8;
    } else {
      if (validatedRequest.parameters.durationSeconds < 5 || validatedRequest.parameters.durationSeconds > 8) {
        throw new Error('durationSeconds must be between 5 and 8 for veo-2.0-generate-001');
      }
    }

    const endpoint = `/projects/${this.projectId}/locations/${this.location}/publishers/google/models/${model}:predictLongRunning`;
    return this.makeRequest<VeoGenerateVideoResponse>(endpoint, 'POST', validatedRequest);
  }

  async fetchOperationStatus(model: VeoModel, request: VeoFetchOperationRequest): Promise<VeoFetchOperationResponse> {
    const validatedRequest = veoFetchOperationRequestSchema.parse(request);
    const endpoint = `/projects/${this.projectId}/locations/${this.location}/publishers/google/models/${model}:fetchPredictOperation`;
    return this.makeRequest<VeoFetchOperationResponse>(endpoint, 'POST', validatedRequest);
  }

  async pollOperation(model: VeoModel, operationName: string, intervalMs: number = 5000, timeoutMs: number = 600000): Promise<VeoFetchOperationResponse> {
    const startTime = Date.now();
    while (true) {
      const response = await this.fetchOperationStatus(model, { operationName });
      if (response.done) {
        return response;
      }
      if (Date.now() - startTime > timeoutMs) {
        throw new Error('Operation polling timed out');
      }
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }
}

export function createVeoonVertexAIAPISDK(projectId?: string, location?: string): VeoonVertexAIAPISdk {
  return new VeoonVertexAIAPISdk(projectId, location);
}
