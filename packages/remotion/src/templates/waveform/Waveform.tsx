import React, { createContext, useContext, ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { useAudioData, visualizeAudioWaveform } from '@remotion/media-utils';
import { useWaveformData } from './hooks/useWaveformData';

// Waveform configuration interface
export interface WaveformConfig {
    // Audio source
    audioSrc: string;
    useFrequencyData?: boolean;

    // Waveform analysis parameters
    numberOfSamples?: number; // Must be power of 2 (32, 64, 128, etc.)
    windowInSeconds?: number; // Time window for analysis
    dataOffsetInSeconds?: number; // Audio offset
    normalize?: boolean; // Normalize wave data

    // Styling
    height?: number;
    width?: number;
    color?: string;
    strokeWidth?: number;
    backgroundColor?: string;

    // Animation
    amplitude?: number; // Amplitude multiplier
    smoothing?: boolean; // Enable smoothing
    posterize?: number; // Posterize effect (round frame to multiple)
}

// Waveform context interface
export interface WaveformContextType {
    waveformData: number[] | null;
    frequencyData: number[] | null;
    amplitudes: number[] | null;
    audioData: any;
    frame: number;
    fps: number;
    config: WaveformConfig;
    width: number;
    height: number;
    bass: number | null;
    mid: number | null;
    treble: number | null;
    bassValues?: number[] | null;
    midValues?: number[] | null;
    trebleValues?: number[] | null;
}

// Create context
const WaveformContext = createContext<WaveformContextType | null>(null);

// Hook to use waveform context
export const useWaveformContext = () => {
    const context = useContext(WaveformContext);
    if (!context) {
        throw new Error('useWaveformContext must be used within a Waveform component');
    }
    return context;
};

// Waveform component props
export interface WaveformProps {
    config: WaveformConfig;
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

// Base Waveform component
export const Waveform: React.FC<WaveformProps> = ({
    config,
    children,
    className = '',
    style = {},
}) => {
    const frame = useCurrentFrame();
    const { width: videoWidth, height: videoHeight, fps } = useVideoConfig();

    // Use custom hook to get waveform data
    const { waveformData, frequencyData, amplitudes, audioData, bass, mid, treble, bassValues, midValues, trebleValues } = useWaveformData({
        audioSrc: config.audioSrc,
        numberOfSamples: config.numberOfSamples || 128,
        windowInSeconds: config.windowInSeconds || 1 / fps,
        dataOffsetInSeconds: config.dataOffsetInSeconds || 0,
        normalize: config.normalize || false,
        frame,
        fps,
        posterize: config.posterize,
        includeFrequencyData: config.useFrequencyData || false,
    });

    // Calculate dimensions
    const width = config.width || videoWidth;
    const height = config.height || videoHeight;

    // Create context value
    const contextValue: WaveformContextType = {
        waveformData,
        frequencyData,
        amplitudes,
        audioData,
        frame,
        fps,
        config,
        width,
        height,
        bass,
        mid,
        treble,
        bassValues,
        midValues,
        trebleValues,
    };

    return (
        <WaveformContext.Provider value={contextValue}>
            <div
                className={`relative ${className}`}
                style={{
                    width,
                    height,
                    position: 'relative',
                    backgroundColor: config.backgroundColor || 'transparent',
                    ...style,
                }}
            >
                {children}
            </div>
        </WaveformContext.Provider>
    );
};

// Export default
export default Waveform;
