import { z } from 'zod';
import { createRestSDK } from '@microfox/rest-sdk';
import crypto from 'crypto';
import { createDefaultMicrofoxUsageTracker } from '@microfox/usage-tracker';

// AWS SES API response schemas
const SendEmailResultSchema = z
  .object({
    MessageId: z.string().describe('The unique identifier for the sent email'),
  })
  .describe('The result of the successful SendEmail operation');

const ResponseMetadataSchema = z
  .object({
    RequestId: z.string().describe('The unique request identifier'),
  })
  .describe('Metadata about the AWS SES API request');

const SendEmailResponsePartSchema = z
  .object({
    SendEmailResult: SendEmailResultSchema,
    ResponseMetadata: ResponseMetadataSchema,
  })
  .describe('The actual response body from the SendEmail API');

const SendEmailResponseSchema = z
  .object({
    SendEmailResponse: SendEmailResponsePartSchema,
  })
  .passthrough()
  .describe('Response from AWS SES SendEmail API');

// AWS SES configuration schema
export const SESConfigSchema = z
  .object({
    accessKeyId: z
      .string()
      .min(1)
      .describe('AWS access key ID for authentication'),
    secretAccessKey: z
      .string()
      .min(1)
      .describe('AWS secret access key for authentication'),
    region: z
      .string()
      .min(1)
      .describe('AWS region where SES is configured (e.g., us-east-1)'),
  })
  .describe('AWS SES SDK configuration');

// Email parameters schema
const EmailParamsSchema = z
  .object({
    sender: z
      .string()
      .email()
      .describe('Email address of the sender (must be verified in AWS SES)'),
    recipient: z.string().email().describe('Email address of the recipient'),
    displayName: z
      .string()
      .optional()
      .describe(
        'Display name for the sender (e.g., "John Doe" <john@example.com>)',
      ),
    subject: z.string().min(1).describe('Subject line of the email'),
    bodyText: z
      .string()
      .optional()
      .describe(
        'Plain text version of the email body (recommended for email clients that cannot display HTML)',
      ),
    bodyHtml: z
      .string()
      .optional()
      .describe('HTML version of the email body (for rich text formatting)'),
  })
  .describe(
    'Parameters for sending a single email. Only one of bodyText or bodyHtml can be provided',
  );

// Bulk email parameters schema
const BulkEmailParamsSchema = z
  .object({
    sender: z
      .string()
      .email()
      .describe('Email address of the sender (must be verified in AWS SES)'),
    recipients: z
      .array(z.string().email())
      .min(1)
      .describe('List of recipient email addresses'),
    displayName: z
      .string()
      .optional()
      .describe(
        'Display name for the sender (e.g., "John Doe" <john@example.com>)',
      ),
    subject: z.string().min(1).describe('Subject line of the email'),
    bodyText: z
      .string()
      .optional()
      .describe(
        'Plain text version of the email body (recommended for email clients that cannot display HTML)',
      ),
    bodyHtml: z
      .string()
      .optional()
      .describe('HTML version of the email body (for rich text formatting)'),
  })
  .refine(data => !(data.bodyText && data.bodyHtml), {
    message: 'Cannot provide both bodyText and bodyHtml at the same time',
    path: ['bodyContent'],
  })
  .refine(data => data.recipients.length > 0, {
    message: 'Recipients array must contain at least one email address',
    path: ['recipients'],
  })
  .describe(
    'Parameters for sending bulk emails. Only one of bodyText or bodyHtml can be provided',
  );

// AWS SES request parameter schemas
const SignatureInputSchema = z
  .object({
    key: z.string().describe('AWS secret key for signature generation'),
    dateStamp: z.string().describe('AWS formatted date stamp (YYYYMMDD)'),
    regionName: z.string().describe('AWS region name'),
    serviceName: z.string().describe('AWS service name (ses)'),
  })
  .describe('Input parameters for AWS signature generation');

const CanonicalRequestInputSchema = z
  .object({
    method: z.string().describe('HTTP method (POST for SES)'),
    uri: z.string().describe('Request URI'),
    queryString: z.string().describe('URL query string'),
    headers: z.string().describe('Canonical headers string'),
    signedHeaders: z.string().describe('List of signed header names'),
    payloadHash: z.string().describe('SHA256 hash of the request payload'),
  })
  .describe('Input parameters for creating a canonical request');

const StringToSignInputSchema = z
  .object({
    algorithm: z
      .string()
      .describe('AWS signature algorithm (AWS4-HMAC-SHA256)'),
    requestDate: z.string().describe('AWS formatted request date'),
    credentialScope: z.string().describe('AWS credential scope'),
    canonicalRequest: z.string().describe('Canonical request string'),
  })
  .describe('Input parameters for creating string to sign');

const FormattedDateSchema = z
  .object({
    amzDate: z.string().describe('AWS formatted date (YYYYMMDDTHHMMSSZ)'),
    dateStamp: z.string().describe('AWS formatted date stamp (YYYYMMDD)'),
  })
  .describe('AWS formatted date components');

// Type inference from schemas
export type SESConfig = z.infer<typeof SESConfigSchema>;
export type EmailParams = z.infer<typeof EmailParamsSchema>;
export type BulkEmailParams = z.infer<typeof BulkEmailParamsSchema>;
export type SendEmailResponse = z.infer<typeof SendEmailResponseSchema>;
export type SendEmailResult = z.infer<typeof SendEmailResultSchema>;
export type ResponseMetadata = z.infer<typeof ResponseMetadataSchema>;

// Helper functions for AWS SES authentication
const getSignatureKey = (
  params: z.infer<typeof SignatureInputSchema>,
): Buffer => {
  const { key, dateStamp, regionName, serviceName } =
    SignatureInputSchema.parse(params);
  const kDate = crypto
    .createHmac('sha256', `AWS4${key}`)
    .update(dateStamp)
    .digest();
  const kRegion = crypto
    .createHmac('sha256', kDate)
    .update(regionName)
    .digest();
  const kService = crypto
    .createHmac('sha256', kRegion)
    .update(serviceName)
    .digest();
  const kSigning = crypto
    .createHmac('sha256', kService)
    .update('aws4_request')
    .digest();
  return kSigning;
};

const getCanonicalRequest = (
  params: z.infer<typeof CanonicalRequestInputSchema>,
): string => {
  const { method, uri, queryString, headers, signedHeaders, payloadHash } =
    CanonicalRequestInputSchema.parse(params);
  return `${method}\n${uri}\n${queryString}\n${headers}\n${signedHeaders}\n${payloadHash}`;
};

const getStringToSign = (
  params: z.infer<typeof StringToSignInputSchema>,
): string => {
  const { algorithm, requestDate, credentialScope, canonicalRequest } =
    StringToSignInputSchema.parse(params);
  return `${algorithm}\n${requestDate}\n${credentialScope}\n${crypto.createHash('sha256').update(canonicalRequest).digest('hex')}`;
};

const getFormattedDate = (date: Date): z.infer<typeof FormattedDateSchema> => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const amzDate = `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  const dateStamp = amzDate.slice(0, 8);
  return FormattedDateSchema.parse({ amzDate, dateStamp });
};

const flattenParams = (
  params: any,
  prefix: string = '',
): { [key: string]: string } => {
  const flatParams: { [key: string]: string } = {};
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(flatParams, flattenParams(value, newKey));
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          Object.assign(
            flatParams,
            flattenParams(item, `${newKey}.${index + 1}`),
          );
        });
      } else {
        flatParams[newKey] = String(value);
      }
    }
  }
  return flatParams;
};

const formatEmailParams = (params: EmailParams) => {
  const validatedParams = EmailParamsSchema.parse(params);

  // Create the base parameters
  const formattedParams: Record<string, string> = {
    Action: 'SendEmail',
    Version: '2010-12-01',
    Source: validatedParams.displayName
      ? `"${validatedParams.displayName}" <${validatedParams.sender}>`
      : validatedParams.sender,
    'Destination.ToAddresses.member.1': validatedParams.recipient,
    'Message.Subject.Charset': 'UTF-8',
    'Message.Subject.Data': validatedParams.subject,
  };

  // Only include HTML body if provided
  if (validatedParams.bodyHtml) {
    formattedParams['Message.Body.Html.Charset'] = 'UTF-8';
    formattedParams['Message.Body.Html.Data'] = validatedParams.bodyHtml;
  }

  // Only include Text body if provided
  if (!validatedParams.bodyHtml && validatedParams.bodyText) {
    formattedParams['Message.Body.Text.Charset'] = 'UTF-8';
    formattedParams['Message.Body.Text.Data'] = validatedParams.bodyText;
  }

  return flattenParams(formattedParams);
};

const getRequestHeaders = (config: SESConfig, params: any) => {
  const method = 'POST';
  const serviceName = 'ses';
  const host = `email.${config.region}.amazonaws.com`;
  const { amzDate, dateStamp } = getFormattedDate(new Date());

  const payload = new URLSearchParams(params).toString();
  const payloadHash = crypto.createHash('sha256').update(payload).digest('hex');

  const canonicalUri = '/';
  const canonicalQuerystring = '';
  const canonicalHeaders = `content-type:application/x-www-form-urlencoded\nhost:${host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'content-type;host;x-amz-date';

  const canonicalRequest = getCanonicalRequest({
    method,
    uri: canonicalUri,
    queryString: canonicalQuerystring,
    headers: canonicalHeaders,
    signedHeaders,
    payloadHash,
  });

  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${config.region}/${serviceName}/aws4_request`;
  const stringToSign = getStringToSign({
    algorithm,
    requestDate: amzDate,
    credentialScope,
    canonicalRequest,
  });

  const signingKey = getSignatureKey({
    key: config.secretAccessKey,
    dateStamp,
    regionName: config.region,
    serviceName,
  });
  const signature = crypto
    .createHmac('sha256', signingKey)
    .update(stringToSign)
    .digest('hex');
  const authorizationHeader = `${algorithm} Credential=${config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Amz-Date': amzDate,
    Authorization: authorizationHeader,
    Accept: 'application/json',
    Host: host,
  };
};

// SDK interface with method descriptions
export const SESSdkSchema = z
  .object({
    sendEmail: z
      .function()
      .args(EmailParamsSchema)
      .returns(z.promise(SendEmailResponseSchema))
      .describe('Send a single email using AWS SES'),
    sendBulkEmails: z
      .function()
      .args(BulkEmailParamsSchema)
      .returns(z.promise(z.array(SendEmailResponseSchema)))
      .describe('Send multiple emails in parallel using AWS SES'),
  })
  .describe('AWS SES SDK interface');

export type SESSDK = z.infer<typeof SESSdkSchema>;

/**
 * Create an AWS SES SDK instance for sending emails.
 *
 * @example
 * ```typescript
 * const ses = createSESSdk({
 *   accessKeyId: 'YOUR_AWS_ACCESS_KEY_ID',
 *   secretAccessKey: 'YOUR_AWS_SECRET_ACCESS_KEY',
 *   region: 'us-east-1'
 * });
 *
 * // Send a plain text email
 * await ses.sendEmail({
 *   sender: 'sender@example.com',
 *   recipient: 'recipient@example.com',
 *   subject: 'Hello!',
 *   bodyText: 'This is a plain text email'
 * });
 *
 * // Send an HTML email
 * await ses.sendEmail({
 *   sender: 'sender@example.com',
 *   recipient: 'recipient@example.com',
 *   subject: 'Hello!',
 *   bodyHtml: '<p>This is an HTML email</p>'
 * });
 * ```
 */
export const createSESSdk = (config: SESConfig): SESSDK => {
  const validatedConfig = SESConfigSchema.parse(config);

  const sendEmail = async (params: EmailParams): Promise<SendEmailResponse> => {
    const validatedParams = EmailParamsSchema.parse(params);
    const formattedParams = formatEmailParams(validatedParams);
    const headers = getRequestHeaders(validatedConfig, formattedParams);

    const sdk = createRestSDK({
      baseUrl: `https://email.${validatedConfig.region}.amazonaws.com`,
      headers,
    });

    try {
      const response = await sdk
        .post<SendEmailResponse>('/', formattedParams, {
          contentType: 'application/x-www-form-urlencoded',
        })
        .json();

      if (process.env.AWS_SES_SECRET_TEMPLATE_TYPE === 'markup') {
        const tracker = createDefaultMicrofoxUsageTracker();
        tracker?.trackApi1Usage('aws-ses', 'outboundEmail', {
          requestCount: 1,
        });
      }

      return SendEmailResponseSchema.parse(response);
    } catch (error) {
      throw new Error(
        `Failed to send email: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  const sendBulkEmails = async (
    params: BulkEmailParams,
  ): Promise<SendEmailResponse[]> => {
    const validatedParams = BulkEmailParamsSchema.parse(params);
    const { recipients, ...rest } = validatedParams;

    const emailPromises = recipients.map(recipient =>
      sendEmail({
        ...rest,
        recipient,
      }),
    );

    const responses = await Promise.all(emailPromises);
    return z.array(SendEmailResponseSchema).parse(responses);
  };

  return SESSdkSchema.parse({
    sendEmail,
    sendBulkEmails,
  });
};

export default createSESSdk;
