## Function: `getBillingInformation`

Retrieves the billing information associated with the API key currently in use. This includes the current plan, payment details, and invoice history.

**Purpose:**
To programmatically access billing details, check subscription status, and review past invoices.

**Parameters:**
This function does not take any parameters.

**Return Value:**

- **`Promise<BillingInformation>`**: A promise that resolves to a `BillingInformation` object.
  - **`BillingInformation`** (object):
    - **`id`** (string): The unique identifier for the billing profile.
    - **`plan`** (string): The name of the current subscription plan (e.g., 'Free', 'Pro').
    - **`nextBillingDate`** (string): The ISO 8601 timestamp for the next billing cycle.
    - **`paymentMethod`** (object): An object containing payment method details.
      - **`type`** (string): The type of payment method (e.g., 'card').
      - **`last4`** (string): The last four digits of the payment card.
    - **`invoices`** (array<object>): An array of past invoices.
      - **`id`** (string): The unique identifier for the invoice.
      - **`date`** (string): The ISO 8601 timestamp of when the invoice was issued.
      - **`amount`** (number): The total amount of the invoice.
      - **`status`** (string): The status of the invoice (e.g., 'paid', 'pending').

**Examples:**

```typescript
// Example: Fetching billing information
try {
  const billingInfo = await klingai.getBillingInformation();
  console.log('Current Plan:', billingInfo.plan);
  console.log('Next Billing Date:', billingInfo.nextBillingDate);
  if (billingInfo.invoices.length > 0) {
    console.log('Latest Invoice Amount:', billingInfo.invoices[0].amount);
  }
} catch (error) {
  console.error('Failed to get billing information:', error);
}
```