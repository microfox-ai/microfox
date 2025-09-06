import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Video,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import {
  createSmoothSvgPath,
  useAudioData,
  visualizeAudio,
  visualizeAudioWaveform,
} from "@remotion/media-utils";

export interface WaveformOverlayProps {
  // Input source - can be video file or audio file
  mediaSource: string;
  
  // Optional audio source for the waveform. If not provided,
  // the audio from `mediaSource` will be used.
  waveformAudioSource?: string;
  
  // Media type - determines if we show video background or white background
  mediaType: "video" | "audio";
  
  // Waveform positioning and styling
  yPosition: number; // Y position as percentage (0-100)
  waveformHeight?: number; // Height of the waveform in pixels
  waveColor?: string; // Color of the waveform
  strokeWidth?: number; // Thickness of the waveform line
  gradientStartColor?: string; // Start color for gradient
  gradientEndColor?: string; // End color for gradient
  gradientDirection?: 'vertical' | 'horizontal'; // Direction of the gradient
  
  // Audio analysis parameters
  windowInSeconds?: number; // Time window for waveform analysis
  amplitude?: number; // Amplitude multiplier for waveform
  
  // Background styling (for audio-only mode)
  backgroundColor?: string;
  
  // Optional audio offset
  audioOffsetInSeconds?: number;
  
  // New props for visualization style
  visualization?: "line" | "histogram";
  horizontalSymmetry?: boolean; // Renamed from mirrorWave
  verticalMirror?: boolean; // New prop for up/down mirroring
  barWidth?: number; // For histogram
  
  // New prop to control histogram layout
  histogramStyle?: 'centered' | 'full-width';
  
  // New prop for number of histogram bars
  numberOfHistogramBars?: number;

  // Spacing for full-width histogram bars
  fullWidthBarSpacing?: number;
}

// Calculate number of samples based on window size
function calculateNumberOfSamples(windowInSeconds: number) {
  const baseSampleCount = 2048;
  
  if (windowInSeconds <= 1) {
    return baseSampleCount;
  }
  
  const scaledSamples = Math.floor(baseSampleCount * windowInSeconds);
  return Math.min(Math.max(scaledSamples, 2048), 8192);
}

export const WaveformOverlay: React.FC<WaveformOverlayProps> = ({
  mediaSource,
  mediaType,
  waveformAudioSource,
  yPosition,
  waveformHeight = 200,
  waveColor = "#FF6B6B",
  strokeWidth = 3,
  gradientStartColor,
  gradientEndColor,
  gradientDirection = 'vertical',
  windowInSeconds = 1,
  amplitude = 1,
  backgroundColor = "#FFFFFF",
  audioOffsetInSeconds = 0,
  visualization = "line",
  horizontalSymmetry = true,
  verticalMirror = false,
  barWidth = 4,
  histogramStyle = 'centered',
  numberOfHistogramBars = 128,
  fullWidthBarSpacing = 2,
}) => {
  const { width, height, fps } = useVideoConfig();
  const frame = useCurrentFrame();
  
  // Calculate Y position in pixels
  const yPositionPixels = (yPosition / 100) * height;
  
  // Use waveformAudioSource if provided, otherwise fall back to mediaSource
  const audioSource = waveformAudioSource || mediaSource;
  const audioData = useAudioData(audioSource);
  
  const numberOfSamples = useMemo(
    () => calculateNumberOfSamples(windowInSeconds),
    [windowInSeconds]
  );
  
  // Calculate audio offset in frames
  const audioOffsetInFrames = Math.round(audioOffsetInSeconds * fps);
  const adjustedFrame = frame + audioOffsetInFrames;
  
  // Generate waveform data
  const waveformData = useMemo(() => {
    if (!audioData) return null;
    if (visualization === "line") {
      try {
        const waveform = visualizeAudioWaveform({
          fps,
          frame: adjustedFrame,
          audioData: audioData,
          numberOfSamples,
          windowInSeconds: windowInSeconds,
          channel: 0,
        });
        return waveform;
      } catch (error) {
        console.warn("Error generating waveform:", error);
        return null;
      }
    }
    // For histogram
    return visualizeAudio({
      fps,
      frame: adjustedFrame,
      audioData,
      numberOfSamples: numberOfHistogramBars,
    });
  }, [
    audioData,
    adjustedFrame,
    fps,
    numberOfSamples,
    windowInSeconds,
    visualization,
    numberOfHistogramBars,
  ]);
  
  // Create SVG path for the waveform
  const waveformPath = useMemo(() => {
    if (!waveformData) return "";
    
    const points = waveformData.map((y, i) => ({
      x: (i / (waveformData.length - 1)) * width,
      y: yPositionPixels + ((y * waveformHeight) / 2) * amplitude,
    }));
    
    return createSmoothSvgPath({ points });
  }, [waveformData, width, yPositionPixels, waveformHeight, amplitude, visualization]);
  
  // Render the background based on media type
  const renderBackground = () => {
    if (mediaType === "video") {
      return (
        <>
          <Video
            src={mediaSource}
            muted={Boolean(waveformAudioSource)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <Audio src={audioSource} />
        </>
      );
    } else {
      // Audio only - show background color and play audio
      return (
        <>
          <AbsoluteFill
            style={{
              backgroundColor,
            }}
          />
          <Audio src={audioSource} />
        </>
      );
    }
  };
  
  // Render the waveform overlay
  const renderWaveform = () => {
    if (visualization === "line") {
      if (!waveformPath) return null;
      return (
        <AbsoluteFill>
          <svg
            width={width}
            height={height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          >
            <path
              d={waveformPath}
              stroke={waveColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </AbsoluteFill>
      );
    }

    if (visualization === "histogram") {
      if (!waveformData) return null;

      const frequencies = waveformData as number[];
      // Horizontal Symmetry (left-right)
      const frequenciesToDisplay = horizontalSymmetry
        ? [...frequencies.slice(1).reverse(), ...frequencies]
        : frequencies;

      // A reusable component to render the bars for all histogram styles.
      const Bars = ({ growUpwards }: { growUpwards: boolean }) => {
        const containerStyle: React.CSSProperties = {
          display: "flex",
          flexDirection: "row",
          alignItems: growUpwards ? "flex-end" : "flex-start",
          height: "100%",
          width: "100%",
          ...(histogramStyle === "centered" && {
            justifyContent: "center",
            gap: `${barWidth / 2}px`,
          }),
          ...(histogramStyle === "full-width" && {
            gap: `${fullWidthBarSpacing}px`,
          }),
        };

        const gradientDirectionValue =
          gradientDirection === 'horizontal' ? 'to right' : 'to top';

        return (
          <div style={containerStyle}>
            {frequenciesToDisplay.map((v, i) => (
              <div
                key={i}
                style={{
                  ...(histogramStyle === "full-width"
                    ? { flex: 1 }
                    : { width: `${barWidth}px` }),
                  ...(gradientStartColor && gradientEndColor
                    ? {
                        background: `linear-gradient(${gradientDirectionValue}, ${gradientStartColor}, ${gradientEndColor})`,
                      }
                    : {
                        backgroundColor: waveColor,
                      }),
                  height: `${Math.min(
                    waveformHeight,
                    v * waveformHeight * amplitude,
                  )}px`,
                  borderRadius: "2px",
                }}
              />
            ))}
          </div>
        );
      };

      // Vertical Mirror (up-down)
      if (verticalMirror) {
        // This container holds the top (upward) bars.
        // Its BOTTOM is anchored to the yPosition axis.
        const topHalfContainerStyle: React.CSSProperties = {
          position: "absolute",
          bottom: `calc(100% - ${yPositionPixels}px)`,
          height: `${waveformHeight}px`,
          width: "100%",
          left: 0,
        };

        // This container holds the bottom (downward) bars.
        // Its TOP is anchored to the yPosition axis.
        const bottomHalfContainerStyle: React.CSSProperties = {
          position: "absolute",
          top: `${yPositionPixels}px`,
          height: `${waveformHeight}px`,
          width: "100%",
          left: 0,
        };

        return (
          <>
            <div style={topHalfContainerStyle}>
              <Bars growUpwards={true} />
            </div>
            <div style={bottomHalfContainerStyle}>
              <Bars growUpwards={false} />
            </div>
          </>
        );
      }
      
      // Default: Non-mirrored histogram
      const containerStyle: React.CSSProperties = {
        width: "100%",
        position: "absolute",
        // Position the bottom of the container at yPosition
        top: `${yPositionPixels - waveformHeight}px`,
        height: `${waveformHeight}px`,
        left: 0,
      };

      return (
        <div style={containerStyle}>
          <Bars growUpwards={true} />
        </div>
      );
    }

    return null;
  };
  
  return (
    <AbsoluteFill>
      {renderBackground()}
      {renderWaveform()}
    </AbsoluteFill>
  );
}; 