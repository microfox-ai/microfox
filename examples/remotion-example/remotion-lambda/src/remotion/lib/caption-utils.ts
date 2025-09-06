import { CaptionEntry } from "../components/AudioSyncedText";

/**
 * Creates a `CaptionEntry[]` array from a simpler array of timed text segments.
 * This is a utility for easily creating demo or test data.
 * It automatically generates word-level timings by distributing the segment's
 * duration evenly across its words.
 *
 * @param segments An array of objects with text, startTime, and endTime.
 * @returns A fully formed `CaptionEntry[]` array ready for the `AudioSyncedText` component.
 */
export const createCaptionsFromSegments = (
  segments: { text: string; startTime: number; endTime: number }[]
): CaptionEntry[] => {
  return segments.map((segment, index) => {
    const words = segment.text.split(/\s+/).map((word, wordIndex, arr) => {
      const duration = segment.endTime - segment.startTime;
      const wordStartTime = segment.startTime + (duration / arr.length) * wordIndex;
      const wordEndTime = segment.startTime + (duration / arr.length) * (wordIndex + 1);
      return { word, startTime: wordStartTime, endTime: wordEndTime };
    });

    return {
      id: `caption-segment-${index}`,
      text: segment.text,
      startTime: segment.startTime,
      endTime: segment.endTime,
      words: words,
    };
  });
}; 