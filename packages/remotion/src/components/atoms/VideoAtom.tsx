import React, { useMemo } from 'react';
import { staticFile, Video, useCurrentFrame, useVideoConfig } from 'remotion';
import { BaseRenderableProps, ComponentConfig } from '../../core/types';
import { z } from 'zod';

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================


export const VideoAtomDataProps = z.object({
    src: z.string(),                    // Video source URL
    style: z.record(z.any()).optional(), // CSS styles object
    className: z.string().optional(),   // CSS class names
    startFrom: z.number().optional(),   // Start playback from this time (seconds)
    endAt: z.number().optional(),       // End playback at this time (seconds)
    playbackRate: z.number().optional(), // Playback speed multiplier
    volume: z.number().optional(),      // Volume level (0-1)
    muted: z.boolean().optional(),      // Mute video audio
    loop: z.boolean().optional(),       // Whether to loop the video
    fit: z.enum(['contain', 'cover', 'fill', 'none', 'scale-down']).optional(), // Object fit style
});
export type VideoAtomDataProps = z.infer<typeof VideoAtomDataProps>;

// ============================================================================
// PROPS & COMPONENT
// ============================================================================

/**
 * Props interface for the VideoAtom component
 * Extends base renderable props with video-specific data
 */
interface VideoAtomProps extends BaseRenderableProps {
    data: VideoAtomDataProps;
}

/**
 * VideoAtom Component
 * 
 * A Remotion component that renders video with advanced control features:
 * - Time-based trimming (start/end points)
 * - Playback rate and volume control
 * - Flexible styling and object fit options
 * - Loop functionality
 * 
 * @param data - Video configuration object containing all playback and styling settings
 * @returns Remotion Video component with applied configurations
 */
export const Atom: React.FC<VideoAtomProps> = ({ data }) => {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();

    // Calculate video source with proper handling for local vs remote files
    const source = useMemo(() => {
        if (data.src.startsWith('http')) {
            return data.src;
        }
        return staticFile(data.src);
    }, [data.src]);

    // Calculate trim values in frames
    const trimBefore = useMemo(() => {
        return data.startFrom ? data.startFrom * fps : undefined;
    }, [data.startFrom, fps]);

    const trimAfter = useMemo(() => {
        return data.endAt ? data.endAt * fps : undefined;
    }, [data.endAt, fps]);

    // Combine styles with object fit if specified
    const combinedStyle = useMemo(() => {
        const baseStyle = data.style || {};
        const objectFit = data.fit ? { objectFit: data.fit } : {};
        return { ...baseStyle, ...objectFit };
    }, [data.style, data.fit]);

    return (
        <Video
            className={data.className}
            src={source}
            style={combinedStyle}
            trimBefore={trimBefore}
            trimAfter={trimAfter}
            playbackRate={data.playbackRate}
            volume={data.volume}
            muted={data.muted}
            loop={data.loop}
        />
    );
};

// ============================================================================
// STATIC HELPERS
// ============================================================================

/**
 * Static helper functions for video data manipulation
 * Provides utility functions for working with VideoAtomDataProps outside of React components
 */
export const VideoDataHelper = {
    /**
     * Determines if a video should be trimmed at a given timestamp
     * 
     * @param data - Video configuration data
     * @param options - Options object containing timestamp and fps
     * @param options.timestamp - Time in seconds to check trim status (default: 0)
     * @param options.fps - Frames per second for frame calculation (default: 30)
     * @returns boolean indicating if video should be trimmed at the given timestamp
     */
    isTrimmed: (data: VideoAtomDataProps, options: {
        timestamp?: number;
        fps?: number;
    }) => {
        const { timestamp = 0, fps = 30 } = options;

        if (!data.startFrom || !data.endAt) return false;

        const currentTime = timestamp;
        const startTime = data.startFrom || 0;
        const endTime = data.endAt;

        if (endTime) {
            return currentTime < startTime || currentTime > endTime;
        }

        return currentTime < startTime;
    },

    /**
     * Calculates the effective duration of a video after trimming
     * 
     * @param data - Video configuration data
     * @param originalDuration - Original video duration in seconds
     * @returns Effective duration in seconds after applying trim settings
     */
    getEffectiveDuration: (data: VideoAtomDataProps, originalDuration: number) => {
        if (!data.startFrom || !data.endAt) return originalDuration;

        const startTime = data.startFrom || 0;
        const endTime = data.endAt || originalDuration;

        return Math.max(0, endTime - startTime);
    },

    /**
     * Validates video source URL format
     * 
     * @param src - Video source URL
     * @returns boolean indicating if the source URL is valid
     */
    isValidSource: (src: string) => {
        if (!src) return false;

        // Check for HTTP/HTTPS URLs
        if (src.startsWith('http://') || src.startsWith('https://')) {
            return true;
        }

        // Check for local file paths (basic validation)
        const validExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
        return validExtensions.some(ext => src.toLowerCase().includes(ext));
    }
};

export const config: ComponentConfig = {
    displayName: 'VideoAtom',
    type: 'atom',
    isInnerSequence: false,
};