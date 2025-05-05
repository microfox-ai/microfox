import { z } from 'zod';

export const fileSchema = z.object({
  name: z.string().optional().describe("The name of the file"),
  size: z.number().optional().describe("The size of the file in bytes"),
  type: z.enum(["txt", "srt", "raw_video", "aligned_video", "raw_audio", "compressed_audio", "cloud_recording"]).describe("The type of the file"),
  download_url: z.string().url().describe("The URL to download the file"),
});

export const trackSchema = z.object({
  id: z.string().describe("The unique identifier of the track"),
  type: z.enum(["participant", "screenshare", "media board"]).describe("The type of the track"),
  status: z.enum(["done", "processing", "uploading", "stopped"]).describe("The status of the track"),
  files: z.array(fileSchema).describe("The files associated with the track"),
});

export const transcriptionSchema = z.object({
  status: z.enum(["transcribing", "done"]).describe("The status of the transcription"),
  files: z.array(fileSchema).describe("The transcription files"),
});

export const recordingSchema = z.object({
  id: z.string().describe("The unique identifier of the recording (v1)"),
  recording_id: z.string().describe("The unique identifier of the recording (v2)"),
  name: z.string().describe("The name of the recording"),
  project_id: z.string().describe("The ID of the project this recording belongs to"),
  project_name: z.string().describe("The name of the project this recording belongs to"),
  studio_id: z.string().describe("The ID of the studio this recording belongs to"),
  studio_name: z.string().describe("The name of the studio this recording belongs to"),
  status: z.enum(["uploading", "processing", "ready"]).describe("The status of the recording"),
  created_date: z.string().describe("The creation date of the recording"),
  tracks: z.array(trackSchema).describe("The tracks in the recording"),
  transcription: transcriptionSchema.optional().describe("The transcription of the recording, if available"),
});

export const projectSchema = z.object({
  id: z.string().describe("The unique identifier of the project"),
  name: z.string().describe("The name of the project"),
  created_date: z.string().describe("The creation date of the project"),
  num_recordings: z.number().describe("The number of recordings in the project"),
});

export const studioSchema = z.object({
  id: z.string().describe("The unique identifier of the studio"),
  name: z.string().describe("The name of the studio"),
  created_date: z.string().describe("The creation date of the studio"),
  projects: z.array(projectSchema).describe("The projects in the studio"),
  num_recordings: z.number().describe("The number of recordings in the studio"),
});

export const productionSchema = z.object({
  id: z.string().describe("The unique identifier of the production"),
  name: z.string().describe("The name of the production"),
  created_date: z.string().describe("The creation date of the production"),
  studios: z.array(studioSchema).describe("The studios in the production"),
  num_recordings: z.number().describe("The number of recordings in the production"),
});

export const listRecordingsResponseSchema = z.object({
  page: z.number().describe("The current page number"),
  next_page_url: z.string().url().nullable().describe("The URL for the next page, or null if there is no next page"),
  total_items: z.number().describe("The total number of items across all pages"),
  total_pages: z.number().describe("The total number of pages"),
  data: z.array(recordingSchema).describe("The recordings on the current page"),
});
