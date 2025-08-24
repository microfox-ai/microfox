import { useMemo } from 'react';
import {
  useAudioData,
  visualizeAudioWaveform,
  visualizeAudio,
} from '@remotion/media-utils';

// Hook configuration interface
export interface UseWaveformDataConfig {
  audioSrc: string;
  numberOfSamples: number;
  windowInSeconds: number;
  dataOffsetInSeconds?: number;
  normalize?: boolean;
  frame: number;
  fps: number;
  posterize?: number;
  // Frequency analysis options
  includeFrequencyData?: boolean;
  minDb?: number;
  maxDb?: number;
}

// Hook return interface
export interface UseWaveformDataReturn {
  waveformData: number[] | null;
  frequencyData: number[] | null;
  amplitudes: number[] | null;
  audioData: any;
  isLoading: boolean;
  error: string | null;
}

// Validate that numberOfSamples is a power of 2
const isValidPowerOfTwo = (num: number): boolean => {
  return num > 0 && (num & (num - 1)) === 0;
};

// Get the closest power of 2
const getClosestPowerOfTwo = (num: number): number => {
  if (num <= 0) return 32;

  let power = 1;
  while (power < num) {
    power *= 2;
  }

  // Return the closest power of 2
  const lower = power / 2;
  const upper = power;

  return Math.abs(num - lower) < Math.abs(num - upper) ? lower : upper;
};

export const useWaveformData = (
  config: UseWaveformDataConfig
): UseWaveformDataReturn => {
  const {
    audioSrc,
    numberOfSamples,
    windowInSeconds,
    dataOffsetInSeconds = 0,
    normalize = false,
    frame,
    fps,
    posterize,
    includeFrequencyData = false,
    minDb = -100,
    maxDb = -30,
  } = config;

  // Validate and adjust numberOfSamples
  const validatedNumberOfSamples = useMemo(() => {
    if (!isValidPowerOfTwo(numberOfSamples)) {
      console.warn(
        `numberOfSamples must be a power of 2. Adjusting ${numberOfSamples} to ${getClosestPowerOfTwo(numberOfSamples)}`
      );
      return getClosestPowerOfTwo(numberOfSamples);
    }
    return numberOfSamples;
  }, [numberOfSamples]);

  // Get audio data
  const audioData = useAudioData(audioSrc);

  // Calculate adjusted frame for posterize effect
  const adjustedFrame = useMemo(() => {
    if (posterize && posterize > 1) {
      return Math.round(frame / posterize) * posterize;
    }
    return frame;
  }, [frame, posterize]);

  // Generate waveform data
  const waveformData = useMemo(() => {
    if (!audioData) return null;

    try {
      const waveform = visualizeAudioWaveform({
        fps,
        frame: adjustedFrame,
        audioData,
        numberOfSamples: validatedNumberOfSamples,
        windowInSeconds,
        dataOffsetInSeconds,
        normalize,
      });

      return waveform;
    } catch (error) {
      console.error('Error generating waveform:', error);
      return null;
    }
  }, [
    audioData,
    adjustedFrame,
    fps,
    validatedNumberOfSamples,
    windowInSeconds,
    dataOffsetInSeconds,
    normalize,
  ]);

  // Generate frequency data and amplitudes
  const { frequencyData, amplitudes } = useMemo(() => {
    if (!audioData || !includeFrequencyData) {
      return { frequencyData: null, amplitudes: null };
    }

    try {
      const frequencyData = visualizeAudio({
        fps,
        frame: adjustedFrame,
        audioData,
        numberOfSamples: validatedNumberOfSamples,
      });

      // Convert frequency data to decibel-scaled amplitudes
      const amplitudes = frequencyData.map((value) => {
        // Convert to decibels (will be in the range `-Infinity` to `0`)
        const db = 20 * Math.log10(value);

        // Scale to fit between min and max
        const scaled = (db - minDb) / (maxDb - minDb);

        // Clamp to valid range [0, 1]
        return Math.max(0, Math.min(1, scaled));
      });

      return { frequencyData, amplitudes };
    } catch (error) {
      console.error('Error generating frequency data:', error);
      return { frequencyData: null, amplitudes: null };
    }
  }, [
    audioData,
    includeFrequencyData,
    adjustedFrame,
    fps,
    validatedNumberOfSamples,
    windowInSeconds,
    dataOffsetInSeconds,
    minDb,
    maxDb,
  ]);

  // Determine loading and error states
  const isLoading = !audioData;
  const error =
    audioData === null && !isLoading ? 'Failed to load audio data' : null;

  return {
    waveformData,
    frequencyData,
    amplitudes,
    audioData,
    isLoading,
    error,
  };
};
