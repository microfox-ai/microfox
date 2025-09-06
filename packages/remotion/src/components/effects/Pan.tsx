import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
import { BaseRenderableProps, ComponentConfig } from '../../core/types';

export interface PanEffectData {
    effectTiming?: 'start' | 'end';
    panDuration?: number | string; // seconds or percentage
    panStart?: number; // seconds
    panEnd?: number; // seconds
    panStartDelay?: number | string; // seconds or percentage
    panEndDelay?: number | string; // seconds or percentage
    panDirection?: 'left' | 'right' | 'up' | 'down' | 'diagonal' | 'custom';
    panDistance?: number | [number, number][]; // single number or array of [progress, distance] pairs
    loopTimes?: number; // number of times to loop the animation
    panStartPosition?: [number, number] | string; // [x, y] or position string
    panEndPosition?: [number, number] | string; // [x, y] or position string
    animationType?: 'linear' | 'spring' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

const parseDuration = (duration: number | string | undefined, contextDuration: number, fps: number): number => {
    if (!duration) return contextDuration;

    if (typeof duration === 'number') {
        return duration * fps;
    }

    if (typeof duration === 'string' && duration.endsWith('%')) {
        const percentage = parseFloat(duration.replace('%', '')) / 100;
        return Math.floor(contextDuration * percentage);
    }

    return contextDuration;
};

const parseDelay = (delay: number | string | undefined, contextDuration: number, fps: number): number => {
    if (!delay) return 0;

    if (typeof delay === 'number') {
        return delay * fps;
    }

    if (typeof delay === 'string' && delay.endsWith('%')) {
        const percentage = parseFloat(delay) / 100;
        return Math.floor(contextDuration * percentage);
    }

    return 0;
};

const getPanDistance = (progress: number, panDistance: number | [number, number][]): number => {
    if (typeof panDistance === 'number') {
        return panDistance;
    }

    if (Array.isArray(panDistance)) {
        // Handle array of [progress, distance] pairs
        if (panDistance.length === 0) return 0;
        if (panDistance.length === 1) return panDistance[0][1];

        // Find the appropriate distance based on progress
        for (let i = 0; i < panDistance.length - 1; i++) {
            const [currentProgress, currentDistance] = panDistance[i];
            const [nextProgress, nextDistance] = panDistance[i + 1];

            if (progress >= currentProgress && progress <= nextProgress) {
                const localProgress = (progress - currentProgress) / (nextProgress - currentProgress);
                return interpolate(localProgress, [0, 1], [currentDistance, nextDistance]);
            }
        }

        // If progress is beyond the last pair, use the last distance
        return panDistance[panDistance.length - 1][1];
    }

    return 0;
};

const getPosition = (position: [number, number] | string | undefined): [number, number] => {
    if (!position) return [0.5, 0.5]; // center

    if (Array.isArray(position)) {
        return position;
    }

    // Handle string positions
    const positions: Record<string, [number, number]> = {
        'top-left': [0, 0],
        'top': [0.5, 0],
        'top-right': [1, 0],
        'left': [0, 0.5],
        'center': [0.5, 0.5],
        'right': [1, 0.5],
        'bottom-left': [0, 1],
        'bottom': [0.5, 1],
        'bottom-right': [1, 1]
    };

    return positions[position] || [0.5, 0.5];
};

const getEasingFunction = (animationType: string) => {
    switch (animationType) {
        case 'linear':
            return Easing.linear;
        case 'ease-in':
            return Easing.in(Easing.ease);
        case 'ease-out':
            return Easing.out(Easing.ease);
        case 'ease-in-out':
            return Easing.inOut(Easing.ease);
        default:
            return Easing.linear;
    }
};

const getPanVector = (direction: string, distance: number): [number, number] => {
    switch (direction) {
        case 'left':
            return [-distance, 0];
        case 'right':
            return [distance, 0];
        case 'up':
            return [0, -distance];
        case 'down':
            return [0, distance];
        case 'diagonal':
            return [distance * 0.707, distance * 0.707]; // 45-degree diagonal
        default:
            return [0, 0];
    }
};

export const PanEffect: React.FC<BaseRenderableProps> = ({
    data,
    children,
    context
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const panData = data as PanEffectData;

    const { timing } = context ?? {};
    const contextDuration = timing?.durationInFrames || 50;

    // Parse timing parameters
    const effectTiming = panData?.effectTiming || 'start';
    const panDuration = parseDuration(panData?.panDuration, contextDuration, fps);
    const panStartDelay = parseDelay(panData?.panStartDelay, contextDuration, fps);
    const panEndDelay = parseDelay(panData?.panEndDelay, contextDuration, fps);

    // Animation parameters
    const panDirection = panData?.panDirection || 'right';
    let panDistance = panData?.panDistance || 100;
    const loopTimes = panData?.loopTimes || 0;
    const panStartPosition = getPosition(panData?.panStartPosition);
    const panEndPosition = getPosition(panData?.panEndPosition);
    const animationType = panData?.animationType || 'linear';

    // Handle loops by creating array-based panDistance
    if (loopTimes > 0 && typeof panDistance === 'number') {
        // Create a smooth loop pattern
        const loopedPanDistance: [number, number][] = [];
        for (let i = 0; i < loopTimes; i++) {
            const loopProgress = i / loopTimes;
            const nextLoopProgress = (i + 1) / loopTimes;

            // Create a pan back-and-forth pattern for each loop
            loopedPanDistance.push([loopProgress, 0]); // Start of loop
            loopedPanDistance.push([loopProgress + (nextLoopProgress - loopProgress) * 0.5, panDistance]); // Half way (back to start)
            loopedPanDistance.push([nextLoopProgress, 0]); // End of loop (back to start)
        }
        panDistance = loopedPanDistance;
    }

    // Calculate animation progress using Remotion's spring function
    let progress: number;

    if (animationType === 'spring') {
        progress = spring({
            frame,
            fps,
            config: {
                stiffness: 100,
                damping: 10,
                mass: 1,
            },
            durationInFrames: panDuration,
            delay: effectTiming === 'start' ? panStartDelay : (contextDuration - panEndDelay - panDuration),
        });
    } else {
        // For non-spring animations, calculate progress manually
        let animationFrame: number;

        if (effectTiming === 'start') {
            animationFrame = frame - panStartDelay;
        } else {
            // end timing
            animationFrame = frame - (contextDuration - panEndDelay - panDuration);
        }

        const easing = getEasingFunction(animationType);
        progress = interpolate(
            animationFrame,
            [0, panDuration],
            [0, 1],
            {
                easing,
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
            }
        );
    }

    // Calculate pan offset
    let panOffset: [number, number];

    if (panDirection === 'custom') {
        // Custom pan using start and end positions
        const [startX, startY] = panStartPosition;
        const [endX, endY] = panEndPosition;
        const offsetX = (endX - startX) * 100; // Convert to percentage
        const offsetY = (endY - startY) * 100;

        panOffset = [
            interpolate(progress, [0, 1], [0, offsetX]),
            interpolate(progress, [0, 1], [0, offsetY])
        ];
    } else {
        // Direction-based pan
        const distance = getPanDistance(progress, panDistance);
        const [vectorX, vectorY] = getPanVector(panDirection, distance);

        panOffset = [vectorX, vectorY];
    }

    const style: React.CSSProperties = useMemo(() => {
        return {
            width: '100%',
            height: '100%',
            transform: `translate(${panOffset[0]}px, ${panOffset[1]}px)`,
        };
    }, [panOffset]);

    return (
        <div style={style}>
            {children}
        </div>
    );
};

export const config: ComponentConfig = {
    displayName: 'pan',
    type: 'layout',
    isInnerSequence: false,
    props: {
        effectTiming: {
            type: 'string',
            description: 'When the pan effect should occur: "start" or "end"',
            default: 'start'
        },
        panDuration: {
            type: 'string',
            description: 'Duration of the pan animation in seconds or percentage (e.g., "2" or "50%")',
            default: undefined
        },
        panStart: {
            type: 'number',
            description: 'Start time of pan in seconds',
            default: 0
        },
        panEnd: {
            type: 'number',
            description: 'End time of pan in seconds',
            default: undefined
        },
        panStartDelay: {
            type: 'string',
            description: 'Delay before pan starts in seconds or percentage',
            default: 0
        },
        panEndDelay: {
            type: 'string',
            description: 'Delay before video ends in seconds or percentage',
            default: 0
        },
        panDirection: {
            type: 'string',
            description: 'Direction of pan: "left", "right", "up", "down", "diagonal", or "custom"',
            default: 'right'
        },
        panDistance: {
            type: 'string',
            description: 'Pan distance in pixels or array of [progress, distance] pairs',
            default: 100
        },
        panStartPosition: {
            type: 'string',
            description: 'Starting position: [x, y] coordinates or position string (top-left, center, etc.)',
            default: 'center'
        },
        panEndPosition: {
            type: 'string',
            description: 'Ending position: [x, y] coordinates or position string (top-left, center, etc.)',
            default: 'center'
        },
        animationType: {
            type: 'string',
            description: 'Animation curve: "linear", "spring", "ease-in", "ease-out", "ease-in-out"',
            default: 'linear'
        }
    }
};
