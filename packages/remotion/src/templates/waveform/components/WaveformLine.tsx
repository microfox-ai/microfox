import React, { useMemo } from 'react';
import { createSmoothSvgPath } from '@remotion/media-utils';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Waveform, WaveformConfig, useWaveformContext } from '../Waveform';
import { BaseRenderableData } from '../../..';

// Line waveform specific props
export interface WaveformLineDataProps {
    config: WaveformConfig & {
        useFrequencyData?: boolean; // Enable frequency data for better beat detection
    };
    className?: string;
    style?: React.CSSProperties;

    // Line-specific styling
    strokeColor?: string;
    strokeWidth?: number;
    strokeLinecap?: 'butt' | 'round' | 'square';
    strokeLinejoin?: 'miter' | 'round' | 'bevel';
    fill?: string;
    opacity?: number;

    // Animation
    centerLine?: boolean; // Show center line
    centerLineColor?: string;
    centerLineWidth?: number;

    // Beat synchronization
    beatSync?: boolean; // Enable beat synchronization
    bpm?: number; // Beats per minute for manual beat detection
    beatThreshold?: number; // Threshold for beat detection (0-1)
    beatAmplitudeMultiplier?: number; // Amplitude multiplier on beats
    beatAnimationDuration?: number; // Duration of beat animation in frames
    smoothAnimation?: boolean; // Enable smooth animation to reduce vibration

    // Wave spacing and layout
    waveSpacing?: number; // Spacing between wave segments (0-1)
    waveSegments?: number; // Number of wave segments to display
    waveOffset?: number; // Offset for wave positioning
    waveDirection?: 'horizontal' | 'vertical'; // Wave direction

    // Advanced animation
    amplitudeCurve?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce';
    animationSpeed?: number; // Animation speed multiplier
    pulseOnBeat?: boolean; // Enable pulsing effect on beats
    pulseColor?: string; // Color for pulse effect
    pulseScale?: number; // Scale factor for pulse effect
}

export interface WaveformLineProps extends BaseRenderableData {
    data: WaveformLineDataProps;
}

// Beat detection utility using frequency data
const detectBeat = (
    frequencyData: number[] | null,
    amplitudes: number[] | null,
    threshold: number = 0.7,
    bpm?: number,
    frame: number = 0,
    fps: number = 30
): boolean => {
    if (!frequencyData || !amplitudes || frequencyData.length === 0) return false;

    // Manual beat detection based on BPM
    if (bpm) {
        const beatInterval = (60 / bpm) * fps; // Convert BPM to frames
        const beatFrame = Math.round(frame / beatInterval) * beatInterval;
        return Math.abs(frame - beatFrame) < 2; // 2 frame tolerance
    }

    // Frequency-based beat detection
    // Focus on bass frequencies (typically 60-250 Hz) for beat detection
    const bassFrequencies = amplitudes.slice(0, Math.floor(amplitudes.length * 0.15)); // First 15% are usually bass
    const midFrequencies = amplitudes.slice(Math.floor(amplitudes.length * 0.15), Math.floor(amplitudes.length * 0.4)); // 15-40% are mid

    // Calculate RMS energy in bass and mid frequencies
    const bassEnergy = Math.sqrt(bassFrequencies.reduce((sum, val) => sum + val * val, 0) / bassFrequencies.length);
    const midEnergy = Math.sqrt(midFrequencies.reduce((sum, val) => sum + val * val, 0) / midFrequencies.length);

    // Calculate peak detection for sudden changes
    const bassPeak = Math.max(...bassFrequencies);
    const midPeak = Math.max(...midFrequencies);

    // Combined energy with bass emphasis and peak detection
    const totalEnergy = (bassEnergy * 0.6) + (midEnergy * 0.2) + (bassPeak * 0.15) + (midPeak * 0.05);

    // Normalize energy to 0-1 range
    const normalizedEnergy = Math.min(totalEnergy, 1);

    return normalizedEnergy > threshold;
};

// Easing functions for amplitude curves
const easingFunctions = {
    linear: (t: number) => t,
    'ease-in': (t: number) => t * t,
    'ease-out': (t: number) => 1 - (1 - t) * (1 - t),
    'ease-in-out': (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    bounce: (t: number) => {
        if (t < 1 / 2.75) return 7.5625 * t * t;
        if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
};

// Line waveform component
export const WaveformLine: React.FC<WaveformLineProps> = ({ data }) => {
    const {
        config,
        className = '',
        style = {},
        strokeColor = '#FF6B6B',
        strokeWidth = 3,
        strokeLinecap = 'round',
        strokeLinejoin = 'round',
        fill = 'none',
        opacity = 1,
        centerLine = false,
        centerLineColor = '#666',
        centerLineWidth = 1,
        beatSync = false,
        bpm,
        beatThreshold = 0.7,
        beatAmplitudeMultiplier = 1.2,
        beatAnimationDuration = 30,
        smoothAnimation = true,
        waveSpacing = 0.1,
        waveSegments = 1,
        waveOffset = 0,
        waveDirection = 'horizontal',
        amplitudeCurve = 'ease-out',
        animationSpeed = 0.5,
        pulseOnBeat = false,
        pulseColor = '#FFD700',
        pulseScale = 1.2,
    } = data;

    return (
        <Waveform config={config} className={className} style={style}>
            <WaveformLineContent
                strokeColor={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap={strokeLinecap}
                strokeLinejoin={strokeLinejoin}
                fill={fill}
                opacity={opacity}
                centerLine={centerLine}
                centerLineColor={centerLineColor}
                centerLineWidth={centerLineWidth}
                beatSync={beatSync}
                bpm={bpm}
                beatThreshold={beatThreshold}
                beatAmplitudeMultiplier={beatAmplitudeMultiplier}
                beatAnimationDuration={beatAnimationDuration}
                smoothAnimation={smoothAnimation}
                waveSpacing={waveSpacing}
                waveSegments={waveSegments}
                waveOffset={waveOffset}
                waveDirection={waveDirection}
                amplitudeCurve={amplitudeCurve}
                animationSpeed={animationSpeed}
                pulseOnBeat={pulseOnBeat}
                pulseColor={pulseColor}
                pulseScale={pulseScale}
            />
        </Waveform>
    );
};

// Internal content component
const WaveformLineContent: React.FC<Omit<WaveformLineDataProps, 'config' | 'className' | 'style'>> = ({
    strokeColor,
    strokeWidth,
    strokeLinecap,
    strokeLinejoin,
    fill,
    opacity,
    centerLine,
    centerLineColor,
    centerLineWidth,
    beatSync,
    bpm,
    beatThreshold,
    beatAmplitudeMultiplier,
    beatAnimationDuration,
    smoothAnimation,
    waveSpacing,
    waveSegments,
    waveOffset,
    waveDirection,
    amplitudeCurve,
    animationSpeed,
    pulseOnBeat,
    pulseColor,
    pulseScale,
}) => {
    const { waveformData, frequencyData, amplitudes, width, height, config, frame, fps } = useWaveformContext();
    const currentFrame = useCurrentFrame();
    const videoConfig = useVideoConfig();

    // Beat detection
    const isBeat = useMemo(() => {
        if (!beatSync || !frequencyData || !amplitudes) return false;
        return detectBeat(frequencyData, amplitudes, beatThreshold, bpm, currentFrame, fps);
    }, [beatSync, frequencyData, amplitudes, beatThreshold, bpm, currentFrame, fps]);

    // Beat animation progress with smoothing
    const beatProgress = useMemo(() => {
        if (!isBeat || !beatAnimationDuration) return 0;
        const beatStartFrame = Math.floor(currentFrame / beatAnimationDuration) * beatAnimationDuration;
        const progress = (currentFrame - beatStartFrame) / beatAnimationDuration;
        const clampedProgress = Math.max(0, Math.min(1, progress));

        // Apply smoothing to reduce vibration
        if (smoothAnimation) {
            // Use a smoother easing function to reduce sudden changes
            return 1 - Math.pow(1 - clampedProgress, 3); // Cubic ease-out
        }

        return clampedProgress;
    }, [isBeat, currentFrame, beatAnimationDuration, smoothAnimation]);

    // Calculate beat amplitude multiplier
    const currentBeatMultiplier = useMemo(() => {
        if (!beatSync || !isBeat || !beatAmplitudeMultiplier || !amplitudeCurve) return 1;
        const easing = easingFunctions[amplitudeCurve];
        const easedProgress = easing(beatProgress);
        return 1 + (beatAmplitudeMultiplier - 1) * (1 - easedProgress);
    }, [beatSync, isBeat, beatProgress, beatAmplitudeMultiplier, amplitudeCurve]);

    // Calculate smooth animation factor to reduce vibration
    const smoothFactor = useMemo(() => {
        if (!beatSync) {
            // When beat sync is disabled, use very smooth animation
            return 0.3; // Reduce animation intensity by 70%
        }
        return smoothAnimation ? 0.7 : 1; // Use smoothing factor when enabled
    }, [beatSync, smoothAnimation]);

    // Create SVG paths for the waveform segments
    const waveformPaths = useMemo(() => {
        if (!waveformData) return [];

        const paths = [];
        const segments = waveSegments || 1;
        const spacing = waveSpacing || 0.1;
        const offset = waveOffset || 0;
        const speed = animationSpeed || 1;
        const segmentWidth = width / segments;
        const segmentSpacing = segmentWidth * spacing;

        for (let i = 0; i < segments; i++) {
            const segmentStart = i * segmentWidth;
            const segmentEnd = (i + 1) * segmentWidth;
            const segmentDataWidth = segmentEnd - segmentStart;

            // Create points for this segment
            const points = waveformData.map((y, index) => {
                const progress = index / (waveformData.length - 1);
                const x = segmentStart + progress * segmentDataWidth + offset;

                // Apply beat synchronization and animation with smoothing
                let animatedAmplitude = y * (config.amplitude || 1) * currentBeatMultiplier * speed;

                // Apply smoothing to reduce vibration
                const baseAmplitude = y * (config.amplitude || 1) * speed;
                const beatAmplitude = animatedAmplitude - baseAmplitude;
                animatedAmplitude = baseAmplitude + (beatAmplitude * smoothFactor);

                const yPos = waveDirection === 'horizontal'
                    ? (animatedAmplitude * height) / 2 + height / 2
                    : (animatedAmplitude * width) / 2 + width / 2;

                return waveDirection === 'horizontal'
                    ? { x, y: yPos }
                    : { x: yPos, y: x };
            });

            const path = createSmoothSvgPath({ points });
            paths.push({ path, segmentIndex: i });
        }

        return paths;
    }, [waveformData, width, height, config.amplitude, currentBeatMultiplier, animationSpeed, waveSegments, waveSpacing, waveOffset, waveDirection, smoothFactor]);

    if (!waveformData) {
        return (
            <div className="flex items-center justify-center w-full h-full text-gray-500">
                Loading waveform...
            </div>
        );
    }

    return (
        <svg
            width={width}
            height={height}
            className="absolute inset-0"
            style={{ pointerEvents: 'none' }}
        >
            {/* Center line */}
            {centerLine && (
                <line
                    x1={waveDirection === 'horizontal' ? 0 : width / 2}
                    y1={waveDirection === 'horizontal' ? height / 2 : 0}
                    x2={waveDirection === 'horizontal' ? width : width / 2}
                    y2={waveDirection === 'horizontal' ? height / 2 : height}
                    stroke={centerLineColor}
                    strokeWidth={centerLineWidth}
                    opacity={0.3}
                />
            )}

            {/* Waveform paths */}
            {waveformPaths.map(({ path, segmentIndex }) => (
                <g key={segmentIndex}>
                    {/* Pulse effect on beat */}
                    {pulseOnBeat && isBeat && (
                        <path
                            d={path}
                            stroke={pulseColor}
                            strokeWidth={(strokeWidth || 3) * (pulseScale || 1.2)}
                            strokeLinecap={strokeLinecap}
                            strokeLinejoin={strokeLinejoin}
                            fill="none"
                            opacity={(opacity || 1) * (1 - beatProgress)}
                        />
                    )}

                    {/* Main waveform path */}
                    <path
                        d={path}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeLinecap={strokeLinecap}
                        strokeLinejoin={strokeLinejoin}
                        fill={fill}
                        opacity={opacity}
                    />
                </g>
            ))}
        </svg>
    );
}; 