import React, { useMemo } from 'react';
import { Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { BaseRenderableProps, ComponentConfig } from '../../core/types';
import { z } from 'zod';

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

export const AudioAtomMutedRangeProps = z.object({
    type: z.literal('range'),
    values: z.array(z.object({
        start: z.number(), // Start time in seconds
        end: z.number(),   // End time in seconds
    })),
});
export type AudioAtomMutedRangeProps = z.infer<typeof AudioAtomMutedRangeProps>;

export const AudioAtomMutedFullProps = z.object({
    type: z.literal('full'),
    value: z.boolean(), // true = muted, false = unmuted
});
export type AudioAtomMutedFullProps = z.infer<typeof AudioAtomMutedFullProps>;

export const AudioAtomDataProps = z.object({
    src: z.string(),                    // Audio source URL
    startFrom: z.number().optional(),   // Start playback from this time (seconds)
    endAt: z.number().optional(),       // End playback at this time (seconds)
    volume: z.number().optional(),      // Volume level (0-1)
    playbackRate: z.number().optional(), // Playback speed multiplier
    muted: z.union([AudioAtomMutedFullProps, AudioAtomMutedRangeProps]).optional(), // Mute configuration
});
export type AudioAtomDataProps = z.infer<typeof AudioAtomDataProps>;



// ============================================================================
// PROPS & COMPONENT
// ============================================================================

/**
 * Props interface for the AudioAtom component
 * Extends base renderable props with audio-specific data
 */
interface AudioAtomProps extends BaseRenderableProps {
    data: AudioAtomDataProps;
}

/**
 * AudioAtom Component
 * 
 * A Remotion component that renders audio with advanced control features:
 * - Time-based trimming (start/end points)
 * - Volume and playback rate control
 * - Flexible muting (full track or specific time ranges)
 * 
 * @param data - Audio configuration object containing all playback settings
 * @returns Remotion Audio component with applied configurations
 */
export const Atom: React.FC<AudioAtomProps> = ({ data }) => {
    const { fps } = useVideoConfig();
    const { muted } = data;
    const frame = useCurrentFrame();

    // Calculate if audio should be muted based on current frame and mute configuration
    const isMuted = useMemo(() => {
        if (muted?.type === 'full') {
            return muted.value;
        }
        if (muted?.type === 'range') {
            return muted?.values.some(value =>
                frame >= value.start * fps && frame <= value.end * fps
            );
        }
        return false;
    }, [muted, frame, fps]);

    const source = useMemo(() => {
        if (data.src.startsWith('http')) {
            return data.src;
        }
        return staticFile(data.src);
    }, [data.src]);

    console.log('source', source);
    return (
        <Audio
            src={source}
            trimBefore={data.startFrom ? data.startFrom * fps : undefined}
            trimAfter={data.endAt ? data.endAt * fps : undefined}
            volume={data.volume}
            playbackRate={data.playbackRate}
            muted={isMuted}
        />
    );
};

// ============================================================================
// STATIC HELPERS
// ============================================================================

/**
 * Static helper functions for audio data manipulation
 * Provides utility functions for working with AudioAtomDataProps outside of React components
 */
export const AudioDatahelper = {
    /**
     * Determines if audio should be muted at a given timestamp
     * 
     * @param data - Audio configuration data
     * @param options - Options object containing timestamp and fps
     * @param options.timestamp - Time in seconds to check mute status (default: 0)
     * @param options.fps - Frames per second for frame calculation (default: 30)
     * @returns boolean indicating if audio should be muted at the given timestamp
     */
    isMuted: (data: AudioAtomDataProps, options: {
        timestamp?: number;
        fps?: number;
    }) => {
        const { timestamp = 0, fps = 30 } = options;
        const frame = timestamp * fps;

        // Check full mute configuration
        if (data.muted?.type === 'full') {
            return data.muted.value;
        }

        // Check range mute configuration
        if (data.muted?.type === 'range') {
            return data.muted.values.some(value => {
                const startFrame = value.start * fps;
                const endFrame = value.end * fps;
                if (frame) {
                    return frame >= startFrame && frame <= endFrame;
                }
            });
        }

        // Default: not muted
        return false;
    }
}

export const config: ComponentConfig = {
    displayName: 'AudioAtom',
    type: 'atom',
    isInnerSequence: false,
}