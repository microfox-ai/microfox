import { z } from 'zod';

export const S3ObjectSchema = z.object({
  Bucket: z.string().describe('Name of the S3 bucket'),
  Name: z.string().describe('S3 object key (filename)'),
});

export const ImageSchema = z.object({
  Bytes: z.string().optional().describe('Base64 encoded image bytes'),
  S3Object: S3ObjectSchema.optional(),
}).refine((data) => data.Bytes || data.S3Object, {
  message: 'Either Bytes or S3Object must be provided',
});

export const AttributeSchema = z.enum([
  'ALL', 'DEFAULT', 'FACE_OCCLUDED', 'EYE_DIRECTION', 'AGE_RANGE', 'SMILE',
  'EYEGLASSES', 'SUNGLASSES', 'GENDER', 'BEARD', 'MUSTACHE', 'EYES_OPEN',
  'MOUTH_OPEN', 'EMOTIONS'
]).describe('Face attribute to be returned');

export const DetectFacesRequestSchema = z.object({
  Image: ImageSchema,
  Attributes: z.array(AttributeSchema).optional(),
});

export const BoundingBoxSchema = z.object({
  Width: z.number(),
  Height: z.number(),
  Left: z.number(),
  Top: z.number(),
});

export const AgeRangeSchema = z.object({
  Low: z.number(),
  High: z.number(),
});

export const SmileSchema = z.object({
  Value: z.boolean(),
  Confidence: z.number(),
});

export const EyeglassesSchema = z.object({
  Value: z.boolean(),
  Confidence: z.number(),
});

export const SunglassesSchema = z.object({
  Value: z.boolean(),
  Confidence: z.number(),
});

export const GenderSchema = z.object({
  Value: z.string(),
  Confidence: z.number(),
});

export const BeardSchema = z.object({
  Value: z.boolean(),
  Confidence: z.number(),
});

export const MustacheSchema = z.object({
  Value: z.boolean(),
  Confidence: z.number(),
});

export const EyesOpenSchema = z.object({
  Value: z.boolean(),
  Confidence: z.number(),
});

export const MouthOpenSchema = z.object({
  Value: z.boolean(),
  Confidence: z.number(),
});

export const FaceOccludedSchema = z.object({
  Value: z.boolean(),
  Confidence: z.number(),
});

export const EyeDirectionSchema = z.object({
  Pitch: z.number(),
  Yaw: z.number(),
  Confidence: z.number(),
});

export const LandmarkSchema = z.object({
  Type: z.string(),
  X: z.number(),
  Y: z.number(),
});

export const PoseSchema = z.object({
  Roll: z.number(),
  Yaw: z.number(),
  Pitch: z.number(),
});

export const QualitySchema = z.object({
  Brightness: z.number(),
  Sharpness: z.number(),
});

export const EmotionSchema = z.object({
  Type: z.string(),
  Confidence: z.number(),
});

export const FaceDetailSchema = z.object({
  BoundingBox: BoundingBoxSchema,
  AgeRange: AgeRangeSchema.optional(),
  Smile: SmileSchema.optional(),
  Eyeglasses: EyeglassesSchema.optional(),
  Sunglasses: SunglassesSchema.optional(),
  Gender: GenderSchema.optional(),
  Beard: BeardSchema.optional(),
  Mustache: MustacheSchema.optional(),
  EyesOpen: EyesOpenSchema.optional(),
  MouthOpen: MouthOpenSchema.optional(),
  Landmarks: z.array(LandmarkSchema),
  Pose: PoseSchema,
  Quality: QualitySchema,
  Confidence: z.number(),
  FaceOccluded: FaceOccludedSchema.optional(),
  EyeDirection: EyeDirectionSchema.optional(),
  Emotions: z.array(EmotionSchema).optional(),
});

export const DetectFacesResponseSchema = z.object({
  FaceDetails: z.array(FaceDetailSchema),
  ResponseMetadata: z.object({
    RequestId: z.string(),
    HTTPStatusCode: z.number(),
  }),
});

export const SdkConfigSchema = z.object({
  accessKeyId: z.string().optional(),
  secretAccessKey: z.string().optional(),
  region: z.string().optional(),
});

export type S3Object = z.infer<typeof S3ObjectSchema>;
export type Image = z.infer<typeof ImageSchema>;
export type Attribute = z.infer<typeof AttributeSchema>;
export type DetectFacesRequest = z.infer<typeof DetectFacesRequestSchema>;
export type BoundingBox = z.infer<typeof BoundingBoxSchema>;
export type AgeRange = z.infer<typeof AgeRangeSchema>;
export type Smile = z.infer<typeof SmileSchema>;
export type Eyeglasses = z.infer<typeof EyeglassesSchema>;
export type Sunglasses = z.infer<typeof SunglassesSchema>;
export type Gender = z.infer<typeof GenderSchema>;
export type Beard = z.infer<typeof BeardSchema>;
export type Mustache = z.infer<typeof MustacheSchema>;
export type EyesOpen = z.infer<typeof EyesOpenSchema>;
export type MouthOpen = z.infer<typeof MouthOpenSchema>;
export type FaceOccluded = z.infer<typeof FaceOccludedSchema>;
export type EyeDirection = z.infer<typeof EyeDirectionSchema>;
export type Landmark = z.infer<typeof LandmarkSchema>;
export type Pose = z.infer<typeof PoseSchema>;
export type Quality = z.infer<typeof QualitySchema>;
export type Emotion = z.infer<typeof EmotionSchema>;
export type FaceDetail = z.infer<typeof FaceDetailSchema>;
export type DetectFacesResponse = z.infer<typeof DetectFacesResponseSchema>;
export type SdkConfig = z.infer<typeof SdkConfigSchema>;
