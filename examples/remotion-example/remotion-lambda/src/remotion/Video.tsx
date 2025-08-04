import React from "react";
import { AbsoluteFill, Video } from "remotion";
import { z } from "zod";
import { AIEnhancedCaptionSchema } from "../core/schemas";
import demoInput from "./demo-input.json";
import { AiAudioSyncedText, AiCaptionEntry } from "./components/ai/AiAudioSyncedText";

export const DynamicVideoSchema = z.object({
  captions: z.array(AIEnhancedCaptionSchema).optional(),
  videoUrl: z.string().optional(),
});

export const DynamicVideo: React.FC<z.infer<typeof DynamicVideoSchema>> = ({
  captions,
  videoUrl,
}) => {
  const finalCaptions = captions || demoInput.captions;
  const finalVideoUrl = videoUrl || demoInput.videoUrl;

  return (
    <AbsoluteFill>
      <Video src={finalVideoUrl} />
      <AiAudioSyncedText captions={finalCaptions} />
    </AbsoluteFill>
  );
}; 