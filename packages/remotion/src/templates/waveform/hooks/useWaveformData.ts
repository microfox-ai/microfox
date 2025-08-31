import { useMemo } from 'react';
import {
  useAudioData,
  visualizeAudioWaveform,
  visualizeAudio,
} from '@remotion/media-utils';
import { staticFile } from 'remotion';

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
  bass: number | null;
  bassValues?: number[] | null;
  mid: number | null;
  midValues?: number[] | null;
  treble: number | null;
  trebleValues?: number[] | null;
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

  const source = useMemo(() => {
    if (audioSrc.startsWith('http')) {
      return audioSrc;
    }
    return staticFile(audioSrc);
  }, [audioSrc]);

  // Get audio data
  const audioData = useAudioData(source);

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
  const {
    frequencyData,
    amplitudes,
    bass,
    mid,
    treble,
    bassValues,
    midValues,
    trebleValues,
  } = useMemo(() => {
    if (!audioData || !includeFrequencyData) {
      //console.log('No audio data or frequency data requested');
      return {
        frequencyData: null,
        amplitudes: null,
        bass: null,
        mid: null,
        treble: null,
        bassValues: null,
        midValues: null,
        trebleValues: null,
      };
    }

    try {
      const frequencyData = visualizeAudio({
        fps,
        frame: adjustedFrame,
        audioData,
        numberOfSamples: validatedNumberOfSamples,
      });

      // Calculate frequency bands
      const { sampleRate } = audioData;
      const bassValues: number[] = [];
      const midValues: number[] = [];
      const trebleValues: number[] = [];

      for (let i = 0; i < frequencyData.length; i++) {
        const freq = (i * sampleRate) / (2 * frequencyData.length);
        const value = frequencyData[i];

        if (freq >= 0 && freq < 250) {
          bassValues.push(value * 2.5);
        } else if (freq >= 250 && freq < 4000) {
          midValues.push(value * 3);
          midValues.push(value * 4.5);
          midValues.push(value * 5);
        } else if (freq >= 4000 && freq < sampleRate / 2) {
          trebleValues.push(value * 30);
        }
      }

      // Averaging the frequency values within each band simplifies the data to a single,
      // representative number. This is useful for creating smoother and more stable visualizations
      // that react to the overall energy of a frequency range, rather than noisy, rapid fluctuations.
      const getAverage = (arr: number[]) =>
        arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

      const bass = getAverage(bassValues);
      const mid = getAverage(midValues);
      const treble = getAverage(trebleValues);

      // Convert frequency data to decibel-scaled amplitudes
      const amplitudes = frequencyData.map((value) => {
        // Convert to decibels (will be in the range `-Infinity` to `0`)
        const db = 20 * Math.log10(value);

        // Scale to fit between min and max
        const scaled = (db - minDb) / (maxDb - minDb);

        // Clamp to valid range [0, 1]
        return Math.max(0, Math.min(1, scaled));
      });

      return {
        frequencyData,
        amplitudes,
        bass,
        mid,
        treble,
        bassValues,
        midValues,
        trebleValues: trebleValues.reverse(),
      };
    } catch (error) {
      console.error('Error generating frequency data:', error);
      return {
        frequencyData: null,
        amplitudes: null,
        bass: null,
        mid: null,
        treble: null,
      };
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
    bass,
    bassValues,
    mid,
    midValues,
    treble,
    trebleValues,
  };
};
