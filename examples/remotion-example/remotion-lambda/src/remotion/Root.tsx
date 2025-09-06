import React from "react";
import { Composition } from "remotion";
import { parseMedia } from "@remotion/media-parser";
import { DynamicVideo, DynamicVideoSchema } from "./Video";
import demoInput from "./demo-input.json";
import './globals.css';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DynamicVideo"
        component={DynamicVideo}
        schema={DynamicVideoSchema}
        // These are placeholders; calculateMetadata will override them.
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={1}
        defaultProps={demoInput}
        calculateMetadata={async ({ props }) => {
          // Fallback to the demo video if no URL is provided
          const videoUrl = props.videoUrl || demoInput.videoUrl as string;
          
          const { durationInSeconds, dimensions, fps } = await parseMedia({
            src: videoUrl as string,
            fields: {
              durationInSeconds: true,
              dimensions: true,
              fps: true,
            },
          });

          return {
            durationInFrames: Math.round((durationInSeconds || 0) * 30), // Assuming 30 FPS
            width: dimensions?.width,
            height: dimensions?.height,
            fps: fps || 30,
          };
        }}
      />
    </>
  );
}; 