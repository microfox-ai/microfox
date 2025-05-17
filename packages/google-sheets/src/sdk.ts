import { z } from 'zod';
import { GoogleOAuthSdk, GoogleScope } from '@microfox/google-oauth';

/**
 * Represents the configuration for the Google Sheets SDK.
 */
const GoogleSheetsSdkConfigSchema = z.object({
  clientId: z.string().min(1).describe('The client ID for Google OAuth'),
  clientSecret: z
    .string()
    .min(1)
    .describe('The client secret for Google OAuth'),
  accessToken: z.string().min(1).describe('The access token for Google OAuth'),
  refreshToken: z
    .string()
    .min(1)
    .describe('The refresh token for Google OAuth'),
});

type GoogleSheetsSdkConfig = z.infer<typeof GoogleSheetsSdkConfigSchema>;

/**
 * Represents a range in a Google Sheet.
 */
const RangeSchema = z.object({
  sheetId: z.string().min(1).describe('The ID of the sheet'),
  range: z.string().min(1).describe('The A1 notation of the range'),
});

type Range = z.infer<typeof RangeSchema>;

const ValueInputOptionSchema = z
  .enum(['USER_ENTERED', 'RAW', 'INPUT_VALUE_OPTION_UNSPECIFIED'])
  .optional()
  .describe('The value input option')
  .default('USER_ENTERED');
const InsertDataOptionSchema = z
  .enum(['INSERT_ROWS', 'OVERWRITE'])
  .optional()
  .describe('The insert data option')
  .default('INSERT_ROWS');

type ValueInputOption = z.infer<typeof ValueInputOptionSchema>;
type InsertDataOption = z.infer<typeof InsertDataOptionSchema>;

/**
 * Represents the input for updating values in a Google Sheet.
 */
const UpdateValuesInputSchema = z.object({
  range: RangeSchema,
  values: z.array(z.array(z.any())).describe('The values to be updated'),
});

type UpdateValuesInput = z.infer<typeof UpdateValuesInputSchema>;

/**
 * Represents the input for appending values to a Google Sheet.
 */
const AppendValuesInputSchema = z.object({
  range: RangeSchema,
  values: z.array(z.array(z.any())).describe('The values to be appended'),
});

type AppendValuesInput = z.infer<typeof AppendValuesInputSchema>;

/**
 * Represents the input for clearing values from a Google Sheet.
 */
const ClearValuesInputSchema = RangeSchema;

type ClearValuesInput = z.infer<typeof ClearValuesInputSchema>;

/**
 * Represents the response from the Google Sheets API.
 */
const ApiResponseSchema = z.object({
  spreadsheetId: z.string().describe('The ID of the spreadsheet'),
  updatedRange: z.string().optional().describe('The range that was updated'),
  updatedRows: z.number().optional().describe('The number of rows updated'),
  updatedColumns: z
    .number()
    .optional()
    .describe('The number of columns updated'),
  updatedCells: z.number().optional().describe('The number of cells updated'),
  clearedRange: z.string().optional().describe('The range that was cleared'),
});

type ApiResponse = z.infer<typeof ApiResponseSchema>;

/**
 * Google Sheets SDK for interacting with Google Sheets API.
 */
export class GoogleSheetsSdk {
  private config: GoogleSheetsSdkConfig;
  private oauthSdk: GoogleOAuthSdk;

  /**
   * Creates an instance of GoogleSheetsSdk.
   * @param {GoogleSheetsSdkConfig} config - The configuration for the SDK.
   */
  constructor(config: GoogleSheetsSdkConfig) {
    this.config = GoogleSheetsSdkConfigSchema.parse(config);
    this.oauthSdk = new GoogleOAuthSdk({
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
      redirectUri: 'urn:ietf:wg:oauth:2.0:oob', // Default redirect URI for installed applications
      scopes: [GoogleScope.SHEETS],
    });
  }

  /**
   * Validates the access token and refreshes it if necessary.
   * @private
   */
  private async ensureValidAccessToken(): Promise<void> {
    try {
      const isValid = await this.oauthSdk.validateAccessToken(
        this.config.accessToken,
      );
      if (!isValid) {
        const { accessToken } = await this.oauthSdk.refreshAccessToken(
          this.config.refreshToken,
        );
        this.config.accessToken = accessToken;
      }
    } catch (error) {
      throw new Error(
        `Failed to validate or refresh access token: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Sends a request to the Google Sheets API.
   * @private
   * @param {string} method - The HTTP method for the request.
   * @param {string} endpoint - The API endpoint.
   * @param {object} [body] - The request body (optional).
   * @returns {Promise<any>} The API response.
   */
  private async sendRequest(
    method: string,
    endpoint: string,
    body?: object,
  ): Promise<any> {
    await this.ensureValidAccessToken();

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.config.accessToken}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  }

  /**
   * Validates the access token and refreshes it if necessary.
   */
  async validateAccessToken(): Promise<boolean> {
    const result = await this.oauthSdk.validateAccessToken(
      this.config.accessToken,
    );
    return result.isValid;
  }

  /**
   * Refreshes the access token.
   */
  async refreshAccessToken(): Promise<void> {
    const { accessToken } = await this.oauthSdk.refreshAccessToken(
      this.config.refreshToken,
    );
    this.config.accessToken = accessToken;
  }

  /**
   * Gets values from a range in a Google Sheet.
   * @param {Range} range - The range to get values from.
   * @returns {Promise<any[][]>} The values in the specified range.
   */
  async getValues(range: Range): Promise<any[][]> {
    const validatedRange = RangeSchema.parse(range);
    const response = await this.sendRequest(
      'GET',
      `${validatedRange.sheetId}/values/${validatedRange.range}`,
    );
    return response.values || [];
  }

  /**
   * Updates values in a range of a Google Sheet.
   * @param {UpdateValuesInput} input - The input for updating values.
   * @returns {Promise<ApiResponse>} The API response.
   */
  async updateValues(
    input: UpdateValuesInput,
    valueInputOption: ValueInputOption = 'USER_ENTERED',
  ): Promise<ApiResponse> {
    const validatedInput = UpdateValuesInputSchema.parse(input);
    const response = await this.sendRequest(
      'PUT',
      `${validatedInput.range.sheetId}/values/${validatedInput.range.range}?valueInputOption=${valueInputOption}`,
      {
        values: validatedInput.values,
      },
    );
    return ApiResponseSchema.parse(response);
  }

  /**
   * Appends values to a Google Sheet.
   * @param {AppendValuesInput} input - The input for appending values.
   * @returns {Promise<ApiResponse>} The API response.
   */
  async appendValues(
    input: AppendValuesInput,
    valueInputOption: ValueInputOption = 'USER_ENTERED',
    insertDataOption: InsertDataOption = 'INSERT_ROWS',
  ): Promise<ApiResponse> {
    const validatedInput = AppendValuesInputSchema.parse(input);
    const response = await this.sendRequest(
      'POST',
      `${validatedInput.range.sheetId}/values/${validatedInput.range.range}:append?valueInputOption=${valueInputOption}&insertDataOption=${insertDataOption}`,
      {
        values: validatedInput.values,
      },
    );
    return ApiResponseSchema.parse(response);
  }

  /**
   * Clears values from a range in a Google Sheet.
   * @param {ClearValuesInput} input - The input for clearing values.
   * @returns {Promise<ApiResponse>} The API response.
   */
  async clearValues(input: ClearValuesInput): Promise<ApiResponse> {
    const validatedInput = ClearValuesInputSchema.parse(input);
    const response = await this.sendRequest(
      'POST',
      `${validatedInput.sheetId}/values/${validatedInput.range}:clear`,
    );
    return ApiResponseSchema.parse(response);
  }

  /**
   * Batch gets values from multiple ranges in a Google Sheet.
   * @param {string} sheetId - The ID of the sheet.
   * @param {string[]} ranges - The ranges to get values from.
   * @returns {Promise<any[][][]>} The values in the specified ranges.
   */
  async batchGetValues(sheetId: string, ranges: string[]): Promise<any[][][]> {
    const response = await this.sendRequest(
      'GET',
      `${sheetId}/values:batchGet?ranges=${ranges.join('&ranges=')}`,
    );
    return response.valueRanges.map((vr: any) => vr.values || []);
  }

  /**
   * Batch updates values in multiple ranges of a Google Sheet.
   * @param {string} sheetId - The ID of the sheet.
   * @param {UpdateValuesInput[]} inputs - The inputs for updating values.
   * @returns {Promise<ApiResponse[]>} The API responses.
   */
  async batchUpdateValues(
    sheetId: string,
    inputs: UpdateValuesInput[],
    valueInputOption: ValueInputOption = 'USER_ENTERED',
  ): Promise<ApiResponse[]> {
    const validatedInputs = inputs.map(input =>
      UpdateValuesInputSchema.parse(input),
    );
    const response = await this.sendRequest(
      'POST',
      `${sheetId}/values:batchUpdate?valueInputOption=${valueInputOption}`,
      {
        data: validatedInputs.map(input => ({
          range: input.range.range,
          values: input.values,
        })),
      },
    );
    return response.responses.map((r: any) => ApiResponseSchema.parse(r));
  }

  /**
   * Batch clears values from multiple ranges in a Google Sheet.
   * @param {string} sheetId - The ID of the sheet.
   * @param {string[]} ranges - The ranges to clear.
   * @returns {Promise<ApiResponse>} The API response.
   */
  async batchClearValues(
    sheetId: string,
    ranges: string[],
  ): Promise<ApiResponse> {
    const response = await this.sendRequest(
      'POST',
      `${sheetId}/values:batchClear`,
      { ranges },
    );
    return ApiResponseSchema.parse(response);
  }

  /**
 * Detects duplicate rows in a Google Sheet based on full row match.
 * @param {Range} range - The range to check for duplicates.
 * @returns {Promise<any[][]>} Array of duplicate rows.
 */
async detectDuplicateRows(range: Range): Promise<any[][]> {
  const rows = await this.getValues(range);
  const seen = new Set<string>();
  const duplicates: any[][] = [];

  for (const row of rows) {
    const key = JSON.stringify(row);
    if (seen.has(key)) {
      duplicates.push(row);
    } else {
      seen.add(key);
    }
  }

  return duplicates;
}

/**
 * Sanitizes all values in a given range by trimming whitespace.
 * @param {UpdateValuesInput} input - Range and values to sanitize.
 * @returns {Promise<ApiResponse>} The API response after update.
 */
async sanitizeSheetData(input: UpdateValuesInput): Promise<ApiResponse> {
  const cleanedValues = input.values.map(row =>
    row.map(cell => (typeof cell === 'string' ? cell.trim() : cell)),
  );

  return this.updateValues({ range: input.range, values: cleanedValues });
}

}

/**
 * Creates an instance of the Google Sheets SDK.
 * @param {GoogleSheetsSdkConfig} config - The configuration for the SDK.
 * @returns {GoogleSheetsSdk} An instance of the Google Sheets SDK.
 */
export function createGoogleSheetsSdk(
  config: GoogleSheetsSdkConfig,
): GoogleSheetsSdk {
  return new GoogleSheetsSdk(config);
}

// Export types
export type {
  GoogleSheetsSdkConfig,
  Range,
  UpdateValuesInput,
  AppendValuesInput,
  ClearValuesInput,
  ApiResponse,
};
