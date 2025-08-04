import React from 'react';
import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';
import { AnimatedText, AnimatedTextProps, CustomAnimationFunction } from './AnimatedText';

// --- Type Definitions ---

/**
 * Represents a single word with its timing and optional custom styling.
 * This is the core element for word-by-word animations.
 */
export interface WordEntry {
  word: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  
  // Per-word overrides for styling and animation
  color?: string;
  fontWeight?: string | number;
  animationType?: AnimatedTextProps['animationType'];
  customAnimation?: CustomAnimationFunction;
}

/**
 * Represents a single caption or subtitle, composed of multiple words.
 */
export interface CaptionEntry {
  id: string;
  text: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  words: WordEntry[]; // Word-level timing is mandatory for this component
}

// --- Main Component Props ---

/**
 * Props for the AudioSyncedText component, designed for powerful templating.
 */
export interface AudioSyncedTextProps {
  captions: CaptionEntry[];

  /** Controls the animation behavior for the text.
   * - `word-by-word`: Each word animates in sequentially. Requires word-level timings.
   * - `all-at-once`: The entire caption animates in as a single block.
   * @default 'word-by-word'
   */
  textAnimationMode?: 'word-by-word' | 'all-at-once';

  // --- Global Styling (Defaults for all text) ---
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  color?: string;
  
  // --- Background ---
  backgroundColor?: string;
  backgroundPadding?: number;
  backgroundBorderRadius?: number;

  // --- Global Animation (Defaults for all words) ---
  wordAnimationType?: AnimatedTextProps['animationType'];
  customWordAnimation?: CustomAnimationFunction;
  
  // --- Karaoke Effect ---
  activeWordColor?: string; // Color of the word currently being spoken
  inactiveWordOpacity?: number; // Opacity of words not yet spoken

  // --- Layout & Positioning ---
  position?: "top" | "center" | "bottom";
  maxWidth?: number;
  lineHeight?: number;
}

// --- The Main Component ---

export const AudioSyncedText: React.FC<AudioSyncedTextProps> = ({
  captions,
  // Animation mode
  textAnimationMode = 'word-by-word',
  // Global styling defaults
  fontFamily = "Arial, sans-serif",
  fontSize = 64,
  fontWeight = "bold",
  color = "#FFFFFF",
  // Background defaults
  backgroundColor,
  backgroundPadding = 20,
  backgroundBorderRadius = 10,
  // Global animation defaults
  wordAnimationType = "fade-in",
  customWordAnimation,
  // Karaoke effect defaults
  activeWordColor,
  inactiveWordOpacity = 0.4,
  // Layout defaults
  position = "bottom",
  maxWidth = 1200,
  lineHeight = 1.3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // 1. Find the active caption based on the current video time
  const activeCaption = captions.find(
    (caption) => currentTime >= caption.startTime && currentTime < caption.endTime
  );

  if (!activeCaption) {
    return null;
  }

  // --- Styling ---

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: position === "top" ? "flex-start" : position === "center" ? "center" : "flex-end",
    padding: "5%",
  };

  const backgroundStyle: React.CSSProperties = {
    display: "inline-block",
    backgroundColor: backgroundColor,
    padding: backgroundColor ? `${backgroundPadding}px` : 0,
    borderRadius: backgroundColor ? `${backgroundBorderRadius}px` : 0,
    boxShadow: backgroundColor ? "0 4px 12px rgba(0,0,0,0.3)" : "none",
  };
  
  const wordsWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: `${maxWidth}px`,
    lineHeight: lineHeight,
    textAlign: 'center',
  };

  // --- Rendering Logic ---
  
  return (
    <AbsoluteFill style={containerStyle}>
      <div style={backgroundStyle}>
        <div style={wordsWrapperStyle}>
          {textAnimationMode === 'all-at-once' ? (
            <AnimatedText
              text={activeCaption.text}
              animationType={wordAnimationType}
              customAnimation={customWordAnimation}
              fontFamily={fontFamily}
              fontSize={fontSize}
              color={color}
              fontWeight={fontWeight}
            />
          ) : (
            activeCaption.words.map((word, index) => {
              const delay = word.startTime * fps;
              
              // Determine word's state for karaoke effect
              const isWordActive = currentTime >= word.startTime && currentTime < word.endTime;
              const isWordSpoken = currentTime >= word.endTime;

              let wordColor = word.color ?? color;
              let wordOpacity = 1;

              if (activeWordColor) {
                wordColor = isWordActive ? activeWordColor : (word.color ?? color);
                wordOpacity = isWordActive || isWordSpoken ? 1 : inactiveWordOpacity;
              }

              return (
                <div key={`${activeCaption.id}-word-${index}`} style={{ display: 'inline-flex', alignItems: 'center', marginRight: `${fontSize * 0.25}px`, opacity: wordOpacity }}>
                  <AnimatedText
                    text={word.word}
                    animationType={word.animationType ?? wordAnimationType}
                    customAnimation={word.customAnimation ?? customWordAnimation}
                    delayInFrames={delay}
                    durationInFrames={15} // Faster animation for individual words
                    fontFamily={fontFamily}
                    fontSize={fontSize}
                    color={wordColor}
                    fontWeight={word.fontWeight ?? fontWeight}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};


// --- Utility Functions ---

/**
 * Parses SRT content into the CaptionEntry[] format.
 * NOTE: This provides sentence-level timing. For true word-by-word animation,
 * you need a source that provides word-level timestamps (like OpenAI Whisper's verbose_json).
 * This function will crudely split sentences into words and distribute timing.
 */
export const parseSRTToCaptions = (srtContent: string): CaptionEntry[] => {
  const captions: CaptionEntry[] = [];
  const blocks = srtContent.trim().replace(/\r/g, '').split('\n\n');
  
  blocks.forEach((block, index) => {
    const lines = block.split('\n');
    if (lines.length >= 2) {
      const timecodeLine = lines[1];
      const textLines = lines.slice(2).join(' ').trim();
      
      const timecodeMatch = timecodeLine.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
      
      if (timecodeMatch && textLines) {
        const startTime = 
          parseInt(timecodeMatch[1]) * 3600 +
          parseInt(timecodeMatch[2]) * 60 +
          parseInt(timecodeMatch[3]) +
          parseInt(timecodeMatch[4]) / 1000;
        
        const endTime = 
          parseInt(timecodeMatch[5]) * 3600 +
          parseInt(timecodeMatch[6]) * 60 +
          parseInt(timecodeMatch[7]) +
          parseInt(timecodeMatch[8]) / 1000;
        
        const words = textLines.split(/\s+/).map((word, wordIndex, arr) => {
          const duration = endTime - startTime;
          const wordStartTime = startTime + (duration / arr.length) * wordIndex;
          const wordEndTime = startTime + (duration / arr.length) * (wordIndex + 1);
          return { word, startTime: wordStartTime, endTime: wordEndTime };
        });

        captions.push({
          id: `caption-${index}`,
          text: textLines,
          startTime,
          endTime,
          words: words,
        });
      }
    }
  });
  
  return captions;
}; 