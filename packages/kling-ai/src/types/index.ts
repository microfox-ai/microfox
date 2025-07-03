import { z } from 'zod';

export interface KlingaiSDKOptions {
  accessKey: string;
  secretKey: string;
}

export interface TextToVideoRequestBody {
  model_name?: 'kling-v1' | 'kling-v1-6' | 'kling-v2-master';
  prompt: string;
  negative_prompt?: string;
  cfg_scale?: number;
  mode?: 'std' | 'pro';
  camera_control?: {
    type?: 'simple' | 'down_back' | 'forward_up' | 'right_turn_forward' | 'left_turn_forward';
    config?: {
      horizontal?: number;
      vertical?: number;
      pan?: number;
      tilt?: number;
      roll?: number;
      zoom?: number;
    };
  };
  aspect_ratio?: '16:9' | '9:16' | '1:1';
  duration?: 5 | 10;
  callback_url?: string;
  external_task_id?: string;
}

export interface TextToVideoResponse {
  code: number;
  message: string;
  request_id: string;
  data: {
    task_id: string;
    task_status: 'submitted' | 'processing' | 'succeed' | 'failed';
    task_info: {
      external_task_id?: string;
    };
    created_at: number;
    updated_at: number;
  };
}

export interface TextToVideoQueryResponse extends TextToVideoResponse {
  data: TextToVideoResponse['data'] & {
    task_status_msg?: string;
    task_result?: {
      videos: {
        id: string;
        url: string;
        duration: string;
      }[];
    };
  };
}

export interface TextToVideoQueryListResponse {
  code: number;
  message: string;
  request_id: string;
  data: TextToVideoQueryResponse['data'][];
}

export interface ImageToVideoRequestBody {
  // Define the structure based on the API documentation
}

export interface MultiImageToVideoRequestBody {
  // Define the structure based on the API documentation
}

export interface VideoExtendRequestBody {
  // Define the structure based on the API documentation
}

export interface LipSyncRequestBody {
  // Define the structure based on the API documentation
}

export interface VideoEffectsRequestBody {
  // Define the structure based on the API documentation
}

export interface ImageGenerationRequestBody {
  // Define the structure based on the API documentation
}

export interface VirtualTryOnRequestBody {
  // Define the structure based on the API documentation
}

export interface TaskResponse {
  code: number;
  message: string;
  request_id: string;
  data: {
    task_id: string;
    task_status: 'submitted' | 'processing' | 'succeed' | 'failed';
    task_status_msg?: string;
    task_info: {
      external_task_id?: string;
    };
    created_at: number;
    updated_at: number;
    task_result?: {
      [key: string]: any;
    };
  };
}

export interface QueryListResponse {
  code: number;
  message: string;
  request_id: string;
  data: TaskResponse['data'][];
}
