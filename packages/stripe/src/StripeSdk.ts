import { z } from 'zod';
import {
  StripeSDKOptions,
  BalanceResponse,
  CustomerResponse,
  ChargeResponse,
  CreateCustomerParams,
  CaptureChargeParams,
  StripeError,
  ExpandableResourceParams,
  PaginationParams,
} from './types';
import {
  stripeSDKOptionsSchema,
  balanceResponseSchema,
  customerResponseSchema,
  chargeResponseSchema,
  createCustomerParamsSchema,
  captureChargeParamsSchema,
} from './schemas';

class StripeSdk {
  private apiKey: string;
  private baseUrl: string = 'https://api.stripe.com';
  private apiVersion: string;
  private stripeAccount?: string;

  constructor(options: StripeSDKOptions) {
    const validatedOptions = stripeSDKOptionsSchema.parse(options);
    this.apiKey = validatedOptions.apiKey;
    this.apiVersion = validatedOptions.apiVersion || '2025-04-30.basil';
    this.stripeAccount = validatedOptions.stripeAccount;
  }

  private async request<T>(
    method: string,
    path: string,
    params?: Record<string, any>,
    options?: {
      idempotencyKey?: string;
      expand?: string[];
    }
  ): Promise<T> {
    const url = new URL(path, this.baseUrl);
    const headers: HeadersInit = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': this.apiVersion,
    };

    if (this.stripeAccount) {
      headers['Stripe-Account'] = this.stripeAccount;
    }

    if (options?.idempotencyKey) {
      headers['Idempotency-Key'] = options.idempotencyKey;
    }

    const requestOptions: RequestInit = { method, headers };

    if (params) {
      if (method === 'GET') {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            url.searchParams.append(key, String(value));
          }
        });
      } else {
        const formData = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              value.forEach((v, i) => formData.append(`${key}[${i}]`, String(v)));
            } else if (typeof value === 'object') {
              Object.entries(value).forEach(([subKey, subValue]) => {
                formData.append(`${key}[${subKey}]`, String(subValue));
              });
            } else {
              formData.append(key, String(value));
            }
          }
        });
        requestOptions.body = formData;
      }
    }

    if (options?.expand) {
      options.expand.forEach((item) => {
        url.searchParams.append('expand[]', item);
      });
    }

    const response = await fetch(url.toString(), requestOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new StripeError(data.error);
    }

    return data as T;
  }

  async getBalance(params?: ExpandableResourceParams & PaginationParams): Promise<BalanceResponse> {
    return this.request<BalanceResponse>('GET', '/v1/balance', params);
  }

  async createCustomer(params: CreateCustomerParams, options?: { idempotencyKey?: string }): Promise<CustomerResponse> {
    return this.request<CustomerResponse>('POST', '/v1/customers', params, options);
  }

  async getCharge(id: string, params?: ExpandableResourceParams): Promise<ChargeResponse> {
    return this.request<ChargeResponse>('GET', `/v1/charges/${id}`, params);
  }

  async captureCharge(id: string, params?: CaptureChargeParams, options?: { idempotencyKey?: string }): Promise<ChargeResponse> {
    return this.request<ChargeResponse>('POST', `/v1/charges/${id}/capture`, params, options);
  }

  // Add other Stripe API methods here...
}

export function createStripeSDK(options: StripeSDKOptions): StripeSdk {
  return new StripeSdk(options);
}
