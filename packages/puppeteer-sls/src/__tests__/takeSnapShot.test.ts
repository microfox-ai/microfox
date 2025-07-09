import { describe, it, expect, vi } from 'vitest';
import { takeSnapShot, TakeSnapShotOptions } from '../functions/takeSnapShot';
import { S3Space } from '@microfox/s3-space';

// Mock the S3Space module
vi.mock('@microfox/s3-space', () => {
  const S3SpaceMock = vi.fn();
  S3SpaceMock.prototype.uploadFile = vi.fn().mockResolvedValue(undefined);
  S3SpaceMock.prototype.getPublicFileUrl = vi
    .fn()
    .mockReturnValue('https://s3.example.com/screenshot.png');
  return { S3Space: S3SpaceMock };
});

describe(
  'takeSnapShot',
  () => {
    it('should take a snapshot and upload to S3', async () => {
      // TODO: Replace with a real URL for testing
      const options: TakeSnapShotOptions = {
        url: 'https://example.com',
        fileName: 'test-snapshot.png',
        s3Config: {
          bucket: 'test-bucket',
          region: 'us-east-1',
          endpoint: 'https://s3.amazonaws.com',
          credentials: {
            accessKeyId: 'test-access-key',
            secretAccessKey: 'test-secret-key',
          },
        },
        isLocal: true,
        headless: true,
      };

      const publicUrl = await takeSnapShot(options);

      expect(S3Space).toHaveBeenCalledWith(options.s3Config);
      const s3Instance = (S3Space as any).mock.instances[0];
      expect(s3Instance.uploadFile).toHaveBeenCalled();
      expect(s3Instance.getPublicFileUrl).toHaveBeenCalled();
      expect(publicUrl).toBe('https://s3.example.com/screenshot.png');
    });
  },
  { timeout: 50000 },
);
