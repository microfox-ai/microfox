import { z } from 'zod';
import {
  Production,
  Studio,
  Project,
  Recording,
  Track,
  File,
  Transcription,
  ListRecordingsResponse,
  RiversideSDKOptions,
} from './types';
import {
  productionSchema,
  listRecordingsResponseSchema,
  recordingSchema,
} from './schemas';

class RiversideSDK {
  private apiKey: string;
  private baseUrl: string = 'https://api.riverside.fm';

  constructor(options: RiversideSDKOptions) {
    this.apiKey = options.apiKey;
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'DELETE' = 'GET',
    params: Record<string, string> = {}
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (method === 'DELETE') {
      return undefined as T;
    }

    const data = await response.json();
    return data as T;
  }

  async listProductions(): Promise<Production[]> {
    const data = await this.request<Production[]>('/api/v2/productions');
    return z.array(productionSchema).parse(data);
  }

  async listRecordings(options: {
    studioId?: string;
    projectId?: string;
    page?: number;
  } = {}): Promise<ListRecordingsResponse> {
    const params: Record<string, string> = {};
    if (options.studioId) params.studioId = options.studioId;
    if (options.projectId) params.projectId = options.projectId;
    if (options.page !== undefined) params.page = options.page.toString();

    const data = await this.request<ListRecordingsResponse>('/api/v2/recordings', 'GET', params);
    return listRecordingsResponseSchema.parse(data);
  }

  async getRecording(recordingId: string): Promise<Recording> {
    const data = await this.request<Recording>(`/api/v1/recordings/${recordingId}`);
    return recordingSchema.parse(data);
  }

  async downloadFile(fileId: string): Promise<ReadableStream> {
    const response = await fetch(`${this.baseUrl}/api/v1/download/file/${fileId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.body!;
  }

  async downloadTranscription(fileId: string, type: 'srt' | 'txt'): Promise<ReadableStream> {
    const response = await fetch(`${this.baseUrl}/api/v1/download/transcription/${fileId}?type=${type}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.body!;
  }

  async deleteRecording(recordingId: string): Promise<void> {
    await this.request(`/api/v1/recordings/${recordingId}`, 'DELETE');
  }
}

export function createRiversideSDK(options: RiversideSDKOptions): RiversideSDK {
  return new RiversideSDK(options);
}
