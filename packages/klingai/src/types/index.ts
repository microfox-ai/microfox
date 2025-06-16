import { z } from 'zod';

export interface KlingaiSDKOptions {
  apiKey?: string;
}

export interface TextToVideoParams {
  prompt: string;
  style?: string;
  duration?: number;
}

export interface ImageToVideoParams {
  imageUrl: string;
  style?: string;
  duration?: number;
}

export interface MultiImageToVideoParams {
  imageUrls: string[];
  style?: string;
  duration?: number;
}

export interface VideoExtensionParams {
  videoUrl: string;
  duration: number;
}

export interface LipSyncParams {
  videoUrl: string;
  audioUrl: string;
}

export interface VideoEffectsParams {
  videoUrl: string;
  effectName: string;
}

export interface ImageGenerationParams {
  prompt: string;
  style?: string;
}

export interface VirtualTryOnParams {
  imageUrl?: string;
  videoUrl?: string;
  itemId: string;
}

export interface AccountInformation {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  apiUsage: {
    totalRequests: number;
    remainingCredits: number;
  };
}

export interface BillingInformation {
  id: string;
  plan: string;
  nextBillingDate: string;
  paymentMethod: {
    type: string;
    last4: string;
  };
  invoices: {
    id: string;
    date: string;
    amount: number;
    status: string;
  }[];
}
