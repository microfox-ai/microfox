import { z } from 'zod';

export interface StripeSDKOptions {
apiKey: string;
apiVersion?: string;
stripeAccount?: string;
}

export interface ExpandableResourceParams {
expand?: string[];
}

export interface PaginationParams {
limit?: number;
starting_after?: string;
ending_before?: string;
}

export interface BalanceResponse {
object: 'balance';
available: BalanceAmount[];
pending: BalanceAmount[];
connect_reserved?: BalanceAmount[];
livemode: boolean;
instant_available?: BalanceAmount[];
}

export interface BalanceAmount {
amount: number;
currency: string;
source_types?: {
  card?: number;
  bank_account?: number;
  fpx?: number;
  alipay_account?: number;
};
}

export interface CustomerResponse {
id: string;
object: 'customer';
address?: Address | null;
balance?: number;
created: number;
currency?: string | null;
default_source?: string | null;
delinquent?: boolean;
description?: string | null;
discount?: Discount | null;
email?: string | null;
invoice_prefix?: string;
invoice_settings?: InvoiceSettings;
livemode: boolean;
metadata: { [key: string]: string };
name?: string | null;
next_invoice_sequence?: number;
phone?: string | null;
preferred_locales?: string[];
shipping?: Shipping | null;
tax_exempt?: 'none' | 'exempt' | 'reverse';
test_clock?: string | null;
}

export interface CreateCustomerParams {
address?: Address;
description?: string;
email?: string;
metadata?: { [key: string]: string };
name?: string;
payment_method?: string;
phone?: string;
shipping?: Shipping;
source?: string;
}

export interface ChargeResponse {
id: string;
object: 'charge';
amount: number;
amount_captured: number;
amount_refunded: number;
application?: string | null;
application_fee?: string | null;
application_fee_amount?: number | null;
balance_transaction?: string | null;
billing_details: BillingDetails;
calculated_statement_descriptor?: string | null;
captured: boolean;
created: number;
currency: string;
customer?: string | null;
description?: string | null;
destination?: string | null;
dispute?: string | null;
disputed: boolean;
failure_balance_transaction?: string | null;
failure_code?: string | null;
failure_message?: string | null;
fraud_details?: {
  stripe_report?: string;
  user_report?: string;
};
invoice?: string | null;
livemode: boolean;
metadata: { [key: string]: string };
on_behalf_of?: string | null;
order?: string | null;
outcome?: Outcome | null;
paid: boolean;
payment_intent?: string | null;
payment_method: string;
payment_method_details: PaymentMethodDetails;
receipt_email?: string | null;
receipt_number?: string | null;
receipt_url?: string | null;
refunded: boolean;
refunds: RefundList;
review?: string | null;
shipping?: Shipping | null;
source?: Source;
source_transfer?: string | null;
statement_descriptor?: string | null;
statement_descriptor_suffix?: string | null;
status: 'succeeded' | 'pending' | 'failed';
transfer_data?: TransferData | null;
transfer_group?: string | null;
}

export interface CaptureChargeParams {
amount?: number;
application_fee?: number;
receipt_email?: string;
statement_descriptor?: string;
statement_descriptor_suffix?: string;
transfer_data?: {
  amount?: number;
};
}

export interface Address {
city?: string | null;
country?: string | null;
line1?: string | null;
line2?: string | null;
postal_code?: string | null;
state?: string | null;
}

export interface Discount {
id: string;
object: 'discount';
checkout_session?: string | null;
coupon: Coupon;
customer?: string | null;
end?: number | null;
invoice?: string | null;
invoice_item?: string | null;
promotion_code?: string | null;
start: number;
subscription?: string | null;
}

export interface Coupon {
id: string;
object: 'coupon';
amount_off?: number | null;
created: number;
currency?: string | null;
duration: 'forever' | 'once' | 'repeating';
duration_in_months?: number | null;
livemode: boolean;
max_redemptions?: number | null;
metadata: { [key: string]: string };
name?: string | null;
percent_off?: number | null;
redeem_by?: number | null;
times_redeemed: number;
valid: boolean;
}

export interface InvoiceSettings {
custom_fields?: CustomField[] | null;
default_payment_method?: string | null;
footer?: string | null;
rendering_options?: RenderingOptions | null;
}

export interface CustomField {
name: string;
value: string;
}

export interface RenderingOptions {
amount_tax_display?: string | null;
}

export interface Shipping {
address?: Address;
carrier?: string | null;
name?: string | null;
phone?: string | null;
tracking_number?: string | null;
}

export interface BillingDetails {
address?: Address | null;
email?: string | null;
name?: string | null;
phone?: string | null;
}

export interface Outcome {
network_status?: string | null;
reason?: string | null;
risk_level?: string | null;
risk_score?: number | null;
seller_message?: string | null;
type: string;
}

export interface PaymentMethodDetails {
card?: CardDetails;
// Add other payment method types as needed
}

export interface CardDetails {
brand: string;
checks?: {
  address_line1_check?: string | null;
  address_postal_code_check?: string | null;
  cvc_check?: string | null;
};
country?: string | null;
exp_month: number;
exp_year: number;
fingerprint?: string | null;
funding: string;
installments?: {
  plan?: {
    count: number;
    interval: string;
    type: string;
  } | null;
} | null;
last4: string;
network?: string | null;
three_d_secure?: {
  authenticated?: boolean | null;
  succeeded?: boolean | null;
  version?: string | null;
} | null;
wallet?: {
  type: string;
  // Add specific wallet details as needed
} | null;
}

export interface RefundList {
object: 'list';
data: Refund[];
has_more: boolean;
url: string;
}

export interface Refund {
id: string;
object: 'refund';
amount: number;
balance_transaction?: string | null;
charge: string;
created: number;
currency: string;
metadata: { [key: string]: string };
payment_intent?: string | null;
reason?: string | null;
receipt_number?: string | null;
source_transfer_reversal?: string | null;
status: string;
transfer_reversal?: string | null;
}

export interface Source {
id: string;
object: 'source';
// Add other source properties as needed
}

export interface TransferData {
amount?: number | null;
destination: string;
}

export class StripeError extends Error {
code?: string;
decline_code?: string;
param?: string;
type!: 'api_error' | 'card_error' | 'idempotency_error' | 'invalid_request_error';
doc_url?: string;
request_log_url?: string;
charge?: string;
advice_code?: string;
network_advice_code?: string;
network_decline_code?: string;

constructor(error: any) {
  super(error.message);
  this.name = 'StripeError';
  Object.assign(this, error);
}
}