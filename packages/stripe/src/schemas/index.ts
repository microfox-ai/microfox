import { z } from 'zod';

export const stripeSDKOptionsSchema = z.object({
  apiKey: z.string().describe('Stripe API key'),
  apiVersion: z.string().optional().describe('Stripe API version'),
  stripeAccount: z.string().optional().describe('Stripe account ID for connected accounts'),
});

export const addressSchema = z.object({
  city: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  line1: z.string().nullable().optional(),
  line2: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
});

export const shippingSchema = z.object({
  address: addressSchema.optional(),
  carrier: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  tracking_number: z.string().nullable().optional(),
});

export const balanceAmountSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  source_types: z.object({
    card: z.number().optional(),
    bank_account: z.number().optional(),
    fpx: z.number().optional(),
    alipay_account: z.number().optional(),
  }).optional(),
});

export const balanceResponseSchema = z.object({
  object: z.literal('balance'),
  available: z.array(balanceAmountSchema),
  pending: z.array(balanceAmountSchema),
  connect_reserved: z.array(balanceAmountSchema).optional(),
  livemode: z.boolean(),
  instant_available: z.array(balanceAmountSchema).optional(),
});

export const customerResponseSchema = z.object({
  id: z.string(),
  object: z.literal('customer'),
  address: addressSchema.nullable().optional(),
  balance: z.number().optional(),
  created: z.number(),
  currency: z.string().nullable().optional(),
  default_source: z.string().nullable().optional(),
  delinquent: z.boolean().optional(),
  description: z.string().nullable().optional(),
  discount: z.any().nullable().optional(), // Replace with a proper discount schema if needed
  email: z.string().nullable().optional(),
  invoice_prefix: z.string().optional(),
  invoice_settings: z.any().optional(), // Replace with a proper invoice settings schema if needed
  livemode: z.boolean(),
  metadata: z.record(z.string()),
  name: z.string().nullable().optional(),
  next_invoice_sequence: z.number().optional(),
  phone: z.string().nullable().optional(),
  preferred_locales: z.array(z.string()).optional(),
  shipping: shippingSchema.nullable().optional(),
  tax_exempt: z.enum(['none', 'exempt', 'reverse']).optional(),
  test_clock: z.string().nullable().optional(),
});

export const createCustomerParamsSchema = z.object({
  address: addressSchema.optional(),
  description: z.string().optional(),
  email: z.string().optional(),
  metadata: z.record(z.string()).optional(),
  name: z.string().optional(),
  payment_method: z.string().optional(),
  phone: z.string().optional(),
  shipping: shippingSchema.optional(),
  source: z.string().optional(),
});

export const chargeResponseSchema = z.object({
  id: z.string(),
  object: z.literal('charge'),
  amount: z.number(),
  amount_captured: z.number(),
  amount_refunded: z.number(),
  application: z.string().nullable().optional(),
  application_fee: z.string().nullable().optional(),
  application_fee_amount: z.number().nullable().optional(),
  balance_transaction: z.string().nullable().optional(),
  billing_details: z.any(), // Replace with a proper billing details schema if needed
  calculated_statement_descriptor: z.string().nullable().optional(),
  captured: z.boolean(),
  created: z.number(),
  currency: z.string(),
  customer: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  destination: z.string().nullable().optional(),
  dispute: z.string().nullable().optional(),
  disputed: z.boolean(),
  failure_balance_transaction: z.string().nullable().optional(),
  failure_code: z.string().nullable().optional(),
  failure_message: z.string().nullable().optional(),
  fraud_details: z.object({
    stripe_report: z.string().optional(),
    user_report: z.string().optional(),
  }).optional(),
  invoice: z.string().nullable().optional(),
  livemode: z.boolean(),
  metadata: z.record(z.string()),
  on_behalf_of: z.string().nullable().optional(),
  order: z.string().nullable().optional(),
  outcome: z.any().nullable().optional(), // Replace with a proper outcome schema if needed
  paid: z.boolean(),
  payment_intent: z.string().nullable().optional(),
  payment_method: z.string(),
  payment_method_details: z.any(), // Replace with a proper payment method details schema if needed
  receipt_email: z.string().nullable().optional(),
  receipt_number: z.string().nullable().optional(),
  receipt_url: z.string().nullable().optional(),
  refunded: z.boolean(),
  refunds: z.any(), // Replace with a proper refunds schema if needed
  review: z.string().nullable().optional(),
  shipping: shippingSchema.nullable().optional(),
  source: z.any().optional(), // Replace with a proper source schema if needed
  source_transfer: z.string().nullable().optional(),
  statement_descriptor: z.string().nullable().optional(),
  statement_descriptor_suffix: z.string().nullable().optional(),
  status: z.enum(['succeeded', 'pending', 'failed']),
  transfer_data: z.any().nullable().optional(), // Replace with a proper transfer data schema if needed
  transfer_group: z.string().nullable().optional(),
});

export const captureChargeParamsSchema = z.object({
  amount: z.number().optional(),
  application_fee: z.number().optional(),
  receipt_email: z.string().optional(),
  statement_descriptor: z.string().optional(),
  statement_descriptor_suffix: z.string().optional(),
  transfer_data: z.object({
    amount: z.number().optional(),
  }).optional(),
});
