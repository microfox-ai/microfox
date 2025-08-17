import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export enum AWS_REGION {
  US_EAST_1 = 'us-east-1',
  US_WEST_1 = 'us-west-1',
  US_WEST_2 = 'us-west-2',
  EU_WEST_1 = 'eu-west-1',
  EU_CENTRAL_1 = 'eu-central-1',
  AP_SOUTHEAST_1 = 'ap-southeast-1',
  AP_NORTHEAST_1 = 'ap-northeast-1',
  SA_EAST_1 = 'sa-east-1',
}

/**
 * Configuration for the S3Space class.
 * @param forcePathStyle - Whether to force path style for the S3 client.
 * @param endpoint - The endpoint of the S3 service.
 * @param region - The region of the S3 service. default is US_EAST_1
 * @param credentials - The credentials for the S3 service.
 * @param bucket - The bucket to use for the S3 service.
 * @param folder - The folder to use for the S3 service.
 */
export interface S3SpaceConfig {
  forcePathStyle?: boolean;
  endpoint: string;
  region?: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  bucket: string;
  folder?: string;
  cdnEndpoint?: string;
}

export class S3Space {
  private s3Client: S3;
  private bucket: string;
  private folder: string;
  private cdnEndpoint?: string;

  constructor(config: S3SpaceConfig) {
    this.s3Client = new S3({
      forcePathStyle: config.forcePathStyle || false,
      endpoint: config.endpoint,
      region: config.region || AWS_REGION.US_EAST_1,
      credentials: {
        accessKeyId: config.credentials.accessKeyId,
        secretAccessKey: config.credentials.secretAccessKey,
      },
    });
    this.bucket = config.bucket;
    this.folder = config.folder || 'files';
    this.cdnEndpoint = config.cdnEndpoint;
  }

  /**
   * Uploads a file to the specified bucket on digital ocean.
   *
   * @param {Object} params - The parameters for the file upload.
   * @param {any} params.file - The file to be uploaded.
   * @param {string} params.userId - The ID of the user uploading the file.
   * @param {string} params.folder - The folder where the file will be stored.
   * @return {Promise<Object>} A promise that resolves to the response from the S3 upload request.
   */
  async uploadFile({
    file,
    userId,
    folder,
    fileInfoWithFileBuffer,
  }: {
    file?: any;
    fileInfoWithFileBuffer?: {
      fileName: string;
      fileType: string;
      fileBuffer: Buffer;
    };
    userId?: string;
    folder?: string;
  }): Promise<PutObjectCommandOutput | undefined> {
    let key;
    const fileName = file ? file.name : fileInfoWithFileBuffer?.fileName;

    if (!fileName) {
      throw new Error('File name is missing.');
    }

    if (!userId) key = `${folder || this.folder}/${fileName}`;
    else key = `${folder || this.folder}/${userId}/${fileName}`;

    try {
      const Body = file
        ? await file.arrayBuffer()
        : fileInfoWithFileBuffer?.fileBuffer;

      let fileType;
      if (file) {
        fileType = file.type;
      } else {
        fileType = fileInfoWithFileBuffer?.fileType;
      }
      const res = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file ? Buffer.from(Body) : Body,
          ACL: 'public-read',
          ContentEncoding: 'base64',
          ContentType: fileType,
          BucketKeyEnabled: true,
          Metadata: {
            name: fileName,
            type: fileType || '',
          },
        })
      );
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async downloadFile({
    userId,
    fileName,
    folder,
  }: {
    userId?: string;
    fileName: any;
    folder?: string;
  }): Promise<GetObjectCommandOutput | undefined> {
    let key;
    if (!userId) key = `${folder || this.folder}/${fileName}`;
    else key = `${folder || this.folder}/${userId}/${fileName}`;
    try {
      const res = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  streamToBuffer(stream: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      stream.on('data', (chunk: any) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  getPublicFileUrl({
    userId,
    file,
    folder,
  }: {
    userId?: string;
    file: any;
    folder?: string;
  }): string {
    if (!this.cdnEndpoint) {
      const endpointHost = this.s3Client.config.endpoint
        ? new URL(this.s3Client.config.endpoint.toString()).host
        : '';
      return userId
        ? `https://${this.bucket}.${endpointHost}/${
            folder || this.folder
          }/${userId}/${encodeURI(file.name || file.fileName)}`
        : `https://${this.bucket}.${endpointHost}/${
            folder || this.folder
          }/${encodeURI(file.name || file.fileName)}`;
    }
    const cdnBaseUrl = this.cdnEndpoint.startsWith('http')
      ? this.cdnEndpoint
      : `https://${this.bucket}.${this.cdnEndpoint}`;
    return userId
      ? `${cdnBaseUrl}/${folder || this.folder}/${userId}/${encodeURI(
          file.name || file.fileName
        )}`
      : `${cdnBaseUrl}/${folder || this.folder}/${encodeURI(
          file.name || file.fileName
        )}`;
  }

  /**
   * Retrieves the private signed URL good for 24 hrs of the file associated with the provided key.
   *
   * @param {string} key - The key used to identify the file.
   * @return {Promise<string | undefined>} The URL of the file if found, otherwise undefined.
   */

  async getPrivateFileUrl({
    userId,
    file,
    folder,
  }: {
    userId?: string;
    file: any;
    folder?: string;
  }): Promise<string | undefined> {
    let key;
    if (!userId) key = `${folder || this.folder}/${file.name}`;
    else key = `${folder || this.folder}/${userId}/${file.name}`;
    try {
      const url = await getSignedUrl(
        this.s3Client,
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
        { expiresIn: 3600 * 24 }
      );
      return url;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Deletes a file from the specified bucket on digital ocean.
   *
   * @param {Object} params - The parameters for the file deletion.
   * @param {string} params.userId - The ID of the user who owns the file.
   * @param {string} params.fileName - The name of the file to be deleted.
   * @return {Promise<Object>} A promise that resolves to the response from the S3 delete request.
   */

  async deleteFile({
    userId,
    fileName,
    folder,
  }: {
    fileName: string;
    userId?: string;
    folder?: string;
  }): Promise<DeleteObjectCommandOutput | undefined> {
    let key;
    if (!userId) key = `${folder || this.folder}/${fileName}`;
    else key = `${folder || this.folder}/${userId}/${fileName}`;
    try {
      const res = await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
      return res;
    } catch (error) {
      console.log(error);
    }
  }
}
