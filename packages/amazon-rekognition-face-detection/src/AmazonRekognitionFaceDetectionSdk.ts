import { createHmac, createHash } from 'crypto';
import { DetectFacesRequest, DetectFacesResponse, SdkConfig } from './types';

export class AmazonRekognitionFaceDetectionSdk {
  private accessKeyId: string;
  private secretAccessKey: string;
  private region: string;
  private endpoint: string;

  constructor(config: SdkConfig) {
    this.accessKeyId = config.accessKeyId || process.env.AWS_ACCESS_KEY_ID || '';
    this.secretAccessKey = config.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY || '';
    this.region = config.region || process.env.AWS_REGION || 'us-east-1';
    this.endpoint = `https://rekognition.${this.region}.amazonaws.com`;

    if (!this.accessKeyId || !this.secretAccessKey) {
      throw new Error('AWS credentials not found. Please provide them in the constructor or set the AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
    }
  }

  private async signRequest(method: string, path: string, body: string): Promise<Record<string, string>> {
    const now = new Date();
    const amzdate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const datestamp = amzdate.slice(0, 8);

    const canonicalUri = path;
    const canonicalQuerystring = '';
    const canonicalHeaders = `content-type:application/x-amz-json-1.1\nhost:rekognition.${this.region}.amazonaws.com\nx-amz-date:${amzdate}\nx-amz-target:RekognitionService.DetectFaces\n`;
    const signedHeaders = 'content-type;host;x-amz-date;x-amz-target';

    const payloadHash = createHash('sha256').update(body).digest('hex');
    const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${datestamp}/${this.region}/rekognition/aws4_request`;
    const stringToSign = `${algorithm}\n${amzdate}\n${credentialScope}\n${createHash('sha256').update(canonicalRequest).digest('hex')}`;

    const kDate = createHmac('sha256', `AWS4${this.secretAccessKey}`).update(datestamp).digest();
    const kRegion = createHmac('sha256', kDate).update(this.region).digest();
    const kService = createHmac('sha256', kRegion).update('rekognition').digest();
    const kSigning = createHmac('sha256', kService).update('aws4_request').digest();

    const signature = createHmac('sha256', kSigning).update(stringToSign).digest('hex');

    const authorizationHeader = `${algorithm} Credential=${this.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    return {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Date': amzdate,
      'X-Amz-Target': 'RekognitionService.DetectFaces',
      'Authorization': authorizationHeader,
    };
  }

  private async makeRequest<T>(method: string, path: string, body: string): Promise<T> {
    const headers = await this.signRequest(method, path, body);
    const response = await fetch(`${this.endpoint}${path}`, {
      method,
      headers,
      body,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    return response.json() as Promise<T>;
  }

  public async detectFaces(params: DetectFacesRequest): Promise<DetectFacesResponse> {
    const body = JSON.stringify(params);
    try {
      const response = await this.makeRequest<DetectFacesResponse>('POST', '/', body);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to detect faces: ${error.message}`);
      }
      throw new Error('An unknown error occurred while detecting faces');
    }
  }
}

export function createAmazonRekognitionFaceDetectionSDK(config: SdkConfig): AmazonRekognitionFaceDetectionSdk {
  return new AmazonRekognitionFaceDetectionSdk(config);
}
