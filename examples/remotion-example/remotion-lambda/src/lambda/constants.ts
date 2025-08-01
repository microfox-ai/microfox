import type { AwsRegion } from "@remotion/lambda";

export const DEFAULT_REGION: AwsRegion = "us-east-1";
export const DEFAULT_COMPOSITION_ID = "DynamicVideo";
export const DEFAULT_OUTPUT_NAME = "video.mp4";

export const LambdaConfig = {
  diskSizeInMb: 2048,
  memorySizeInMb: 2048,
  timeoutInSeconds: 120,
};
