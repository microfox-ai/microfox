import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { LayoutElement, RecursiveLayoutRenderer } from './RecursiveLayoutRenderer';
import { WordEntry } from '../AudioSyncedText'; // Re-using for word timing
import { AIEnhancedCaption } from '../../../core/schemas';

// This represents the final, enriched data structure that includes the AI layout
export interface AiCaptionEntry {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  words: WordEntry[];
  layout: LayoutElement; // The pre-computed AI layout for the entire caption
}

interface AiAudioSyncedTextProps {
  captions: AIEnhancedCaption[];
}

export const AiAudioSyncedText: React.FC<AiAudioSyncedTextProps> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find the active caption based on the current video time
  const activeCaption = captions.find(
    (caption) => currentTime >= caption.startTime && currentTime < caption.endTime
  );

  if (!activeCaption) {
    return null;
  }

  // The core logic: delegate the entire rendering of the active caption
  // to the recursive renderer, using the pre-computed layout.
  return (
    <AbsoluteFill>
      {activeCaption.layout && (
        <RecursiveLayoutRenderer element={activeCaption.layout.root} />
      )}
    </AbsoluteFill>
  );
}; 