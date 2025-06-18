import * as jwt from 'jsonwebtoken';
import { z } from 'zod';
import {
  TextToVideoRequestBody,
  TextToVideoResponse,
  TextToVideoQueryResponse,
  TextToVideoQueryListResponse,
  ImageToVideoRequestBody,
  MultiImageToVideoRequestBody,
  VideoExtendRequestBody,
  LipSyncRequestBody,
  VideoEffectsRequestBody,
  ImageGenerationRequestBody,
  VirtualTryOnRequestBody,
  KlingaiSDKOptions,
  TaskResponse,
  QueryListResponse,
} from './types';
import {
  textToVideoRequestBodySchema,
  imageToVideoRequestBodySchema,
  multiImageToVideoRequestBodySchema,
  videoExtendRequestBodySchema,
  lipSyncRequestBodySchema,
  videoEffectsRequestBodySchema,
  imageGenerationRequestBodySchema,
  virtualTryOnRequestBodySchema,
} from './schemas';

class KlingaiSDK {
  private accessKey: string;
  private secretKey: string;
  private baseUrl: string = 'https://api-singapore.klingai.com';

  constructor(options: KlingaiSDKOptions) {
    this.accessKey = options.accessKey;
    this.secretKey = options.secretKey;
  }

  private generateApiToken(): string {
    const headers = {
      alg: 'HS256',
      typ: 'JWT',
    };
    const payload = {
      iss: this.accessKey,
      exp: Math.floor(Date.now() / 1000) + 1800, // Expires in 30 minutes
      nbf: Math.floor(Date.now() / 1000) - 5,    // Valid 5 seconds ago
    };
    return jwt.sign(payload, this.secretKey, { header: headers });
  }

  private async request<T>(endpoint: string, method: string, body?: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.generateApiToken()}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.message || response.statusText}`);
    }

    return response.json();
  }

  async textToVideo(params: TextToVideoRequestBody): Promise<TextToVideoResponse> {
    const validatedParams = textToVideoRequestBodySchema.parse(params);
    return this.request<TextToVideoResponse>('/v1/videos/text2video', 'POST', validatedParams);
  }

  async queryTextToVideoTask(taskId: string): Promise<TextToVideoQueryResponse> {
    return this.request<TextToVideoQueryResponse>(`/v1/videos/text2video/${taskId}`, 'GET');
  }

  async listTextToVideoTasks(pageNum: number = 1, pageSize: number = 30): Promise<TextToVideoQueryListResponse> {
    return this.request<TextToVideoQueryListResponse>(`/v1/videos/text2video?pageNum=${pageNum}&pageSize=${pageSize}`, 'GET');
  }

  async imageToVideo(params: ImageToVideoRequestBody): Promise<TaskResponse> {
    const validatedParams = imageToVideoRequestBodySchema.parse(params);
    return this.request<TaskResponse>('/v1/videos/image2video', 'POST', validatedParams);
  }

  async queryImageToVideoTask(taskId: string): Promise<TaskResponse> {
    return this.request<TaskResponse>(`/v1/videos/image2video/${taskId}`, 'GET');
  }

  async listImageToVideoTasks(pageNum: number = 1, pageSize: number = 30): Promise<QueryListResponse> {
    return this.request<QueryListResponse>(`/v1/videos/image2video?pageNum=${pageNum}&pageSize=${pageSize}`, 'GET');
  }

  async multiImageToVideo(params: MultiImageToVideoRequestBody): Promise<TaskResponse> {
    const validatedParams = multiImageToVideoRequestBodySchema.parse(params);
    return this.request<TaskResponse>('/v1/videos/multi-image2video', 'POST', validatedParams);
  }

  async queryMultiImageToVideoTask(taskId: string): Promise<TaskResponse> {
    return this.request<TaskResponse>(`/v1/videos/multi-image2video/${taskId}`, 'GET');
  }

  async listMultiImageToVideoTasks(pageNum: number = 1, pageSize: number = 30): Promise<QueryListResponse> {
    return this.request<QueryListResponse>(`/v1/videos/multi-image2video?pageNum=${pageNum}&pageSize=${pageSize}`, 'GET');
  }

  async videoExtend(params: VideoExtendRequestBody): Promise<TaskResponse> {
    const validatedParams = videoExtendRequestBodySchema.parse(params);
    return this.request<TaskResponse>('/v1/videos/video-extend', 'POST', validatedParams);
  }

  async queryVideoExtendTask(taskId: string): Promise<TaskResponse> {
    return this.request<TaskResponse>(`/v1/videos/video-extend/${taskId}`, 'GET');
  }

  async listVideoExtendTasks(pageNum: number = 1, pageSize: number = 30): Promise<QueryListResponse> {
    return this.request<QueryListResponse>(`/v1/videos/video-extend?pageNum=${pageNum}&pageSize=${pageSize}`, 'GET');
  }

  async lipSync(params: LipSyncRequestBody): Promise<TaskResponse> {
    const validatedParams = lipSyncRequestBodySchema.parse(params);
    return this.request<TaskResponse>('/v1/videos/lip-sync', 'POST', validatedParams);
  }

  async queryLipSyncTask(taskId: string): Promise<TaskResponse> {
    return this.request<TaskResponse>(`/v1/videos/lip-sync/${taskId}`, 'GET');
  }

  async listLipSyncTasks(pageNum: number = 1, pageSize: number = 30): Promise<QueryListResponse> {
    return this.request<QueryListResponse>(`/v1/videos/lip-sync?pageNum=${pageNum}&pageSize=${pageSize}`, 'GET');
  }

  async videoEffects(params: VideoEffectsRequestBody): Promise<TaskResponse> {
    const validatedParams = videoEffectsRequestBodySchema.parse(params);
    return this.request<TaskResponse>('/v1/videos/effects', 'POST', validatedParams);
  }

  async queryVideoEffectsTask(taskId: string): Promise<TaskResponse> {
    return this.request<TaskResponse>(`/v1/videos/effects/${taskId}`, 'GET');
  }

  async listVideoEffectsTasks(pageNum: number = 1, pageSize: number = 30): Promise<QueryListResponse> {
    return this.request<QueryListResponse>(`/v1/videos/effects?pageNum=${pageNum}&pageSize=${pageSize}`, 'GET');
  }

  async imageGeneration(params: ImageGenerationRequestBody): Promise<TaskResponse> {
    const validatedParams = imageGenerationRequestBodySchema.parse(params);
    return this.request<TaskResponse>('/v1/images/generations', 'POST', validatedParams);
  }

  async queryImageGenerationTask(taskId: string): Promise<TaskResponse> {
    return this.request<TaskResponse>(`/v1/images/generations/${taskId}`, 'GET');
  }

  async listImageGenerationTasks(pageNum: number = 1, pageSize: number = 30): Promise<QueryListResponse> {
    return this.request<QueryListResponse>(`/v1/images/generations?pageNum=${pageNum}&pageSize=${pageSize}`, 'GET');
  }

  async virtualTryOn(params: VirtualTryOnRequestBody): Promise<TaskResponse> {
    const validatedParams = virtualTryOnRequestBodySchema.parse(params);
    return this.request<TaskResponse>('/v1/tryon', 'POST', validatedParams);
  }

  async queryVirtualTryOnTask(taskId: string): Promise<TaskResponse> {
    return this.request<TaskResponse>(`/v1/tryon/${taskId}`, 'GET');
  }

  async listVirtualTryOnTasks(pageNum: number = 1, pageSize: number = 30): Promise<QueryListResponse> {
    return this.request<QueryListResponse>(`/v1/tryon?pageNum=${pageNum}&pageSize=${pageSize}`, 'GET');
  }
}

export function createKlingaiSDK(options: KlingaiSDKOptions): KlingaiSDK {
  return new KlingaiSDK(options);
}
