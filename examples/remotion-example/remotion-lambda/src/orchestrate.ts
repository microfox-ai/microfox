import { transcribeAudio } from "./core/transcription/assemblyai";
import { analyzeCaption } from "./core/analyzer";
import { processCaptions } from "./core/caption-processor";
import { render } from "./lambda/api";
import type { AwsRegion } from "@remotion/lambda";
import type { Caption } from "./core/schemas";
import { parseMedia } from "@remotion/media-parser";

interface RenderDynamicVideoOptions {
  videoUrl: string;
  serveUrl: string;
  composition?: string;
  assemblyAIKey?: string;
  anthropicKey?: string;
  region?: AwsRegion;
  outputName?: string;
}

export async function renderDynamicVideo(options: RenderDynamicVideoOptions) {
  const {
    videoUrl,
    serveUrl,
    assemblyAIKey,
    anthropicKey,
  } = options;

  // In a real application, you would first extract the audio from the
  // video and upload it to a public URL. For this example, we'll
  // assume the videoUrl is a direct link to the audio.
  const audioUrl = videoUrl;

  const { dimensions } = await parseMedia({
    src: videoUrl as string,
    fields: {
      dimensions: true,
    },
  });

  const rawCaptions = await transcribeAudio(audioUrl, assemblyAIKey || "");
  const captions = processCaptions(rawCaptions);

  const aiEnhancedCaptions = await Promise.all(
    captions.map((caption: Caption) => analyzeCaption(caption, dimensions || { width: 1080, height: 1920 }, anthropicKey || ""))
  );

  return await render({
    serveUrl,
    inputProps: {
      captions: aiEnhancedCaptions,
      videoUrl,
    },
  });
} 
