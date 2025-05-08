export interface Production {
  id: string;
  name: string;
  created_date: string;
  studios: Studio[];
  num_recordings: number;
}

export interface Studio {
  id: string;
  name: string;
  created_date: string;
  projects: Project[];
  num_recordings: number;
}

export interface Project {
  id: string;
  name: string;
  created_date: string;
  num_recordings: number;
}

export interface Recording {
  id: string;
  recording_id: string;
  name: string;
  project_id: string;
  project_name: string;
  studio_id: string;
  studio_name: string;
  status: "uploading" | "processing" | "ready";
  created_date: string;
  tracks: Track[];
  transcription?: Transcription;
}

export interface Track {
  id: string;
  type: "participant" | "screenshare" | "media board";
  status: "done" | "processing" | "uploading" | "stopped";
  files: File[];
}

export interface File {
  name?: string;
  size?: number;
  type: "txt" | "srt" | "raw_video" | "aligned_video" | "raw_audio" | "compressed_audio" | "cloud_recording";
  download_url: string;
}

export interface Transcription {
  status: "transcribing" | "done";
  files: File[];
}

export interface ListRecordingsResponse {
  page: number;
  next_page_url: string | null;
  total_items: number;
  total_pages: number;
  data: Recording[];
}

export interface RiversideSDKOptions {
  apiKey: string;
}
