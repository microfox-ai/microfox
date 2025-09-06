import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
import { BaseRenderableProps, ComponentConfig } from '../../core/types';

export interface ZoomEffectData {
    effectTiming?: 'start' | 'end';
    zoomDuration?: number | string; // seconds or percentage
    zoomStart?: number; // seconds
    zoomEnd?: number; // seconds
    zoomStartDelay?: number | string; // seconds or percentage
    zoomEndDelay?: number | string; // seconds or percentage
    zoomDirection?: 'in' | 'out';
    zoomDepth?: number | [number, number][]; // single number or array of [progress, scale] pairs
    loopTimes?: number; // number of times to loop the animation
    zoomPosition?: [number, number] | string; // [x, y] or position string
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

const getZoomScale = (progress: number, zoomDepth: number | [number, number][]): number => {
    if (typeof zoomDepth === 'number') {
        return zoomDepth;
    }

    if (Array.isArray(zoomDepth)) {
        // Handle array of [progress, scale] pairs
        if (zoomDepth.length === 0) return 1;
        if (zoomDepth.length === 1) return zoomDepth[0][1];

        // Find the appropriate scale based on progress
        for (let i = 0; i < zoomDepth.length - 1; i++) {
            const [currentProgress, currentScale] = zoomDepth[i];
            const [nextProgress, nextScale] = zoomDepth[i + 1];

            if (progress >= currentProgress && progress <= nextProgress) {
                const localProgress = (progress - currentProgress) / (nextProgress - currentProgress);
                return interpolate(localProgress, [0, 1], [currentScale, nextScale]);
            }
        }

        // If progress is beyond the last pair, use the last scale
        return zoomDepth[zoomDepth.length - 1][1];
    }

    return 1;
};

const getZoomPosition = (position: [number, number] | string | undefined): [number, number] => {
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

export const ZoomEffect: React.FC<BaseRenderableProps> = ({
    data,
    children,
    context
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const zoomData = data as ZoomEffectData;

    const { timing } = context ?? {};
    const contextDuration = timing?.durationInFrames || 50;

    console.log(contextDuration);

    // Parse timing parameters
    const effectTiming = zoomData?.effectTiming || 'start';
    const zoomDuration = parseDuration(zoomData?.zoomDuration, contextDuration, fps);
    const zoomStartDelay = parseDelay(zoomData?.zoomStartDelay, contextDuration, fps);
    const zoomEndDelay = parseDelay(zoomData?.zoomEndDelay, contextDuration, fps);

    // Animation parameters
    const zoomDirection = zoomData?.zoomDirection || 'in';
    let zoomDepth = zoomData?.zoomDepth || 1.5;
    const loopTimes = zoomData?.loopTimes || 0;

    if (loopTimes > 1 && Array.isArray(zoomDepth)) {
        // For array zoomDepth, create loops by adjusting the x values
        const loopedZoomDepth: [number, number][] = [];
        for (let i = 0; i < loopTimes; i++) {
            const loopProgress = i / loopTimes;
            const nextLoopProgress = (i + 1) / loopTimes;

            zoomDepth.forEach(([x, y]) => {
                // Map the original x value to the current loop's progress range
                const mappedX = loopProgress + (x * (nextLoopProgress - loopProgress));
                loopedZoomDepth.push([mappedX, y]);
            });
        }
        zoomDepth = loopedZoomDepth;
    }
    else if (loopTimes > 0 && typeof zoomDepth === 'number') {
        // For number zoomDepth, create a smooth loop pattern
        const loopedZoomDepth: [number, number][] = [];
        for (let i = 0; i < loopTimes; i++) {
            const loopProgress = i / loopTimes;
            const nextLoopProgress = (i + 1) / loopTimes;

            // Create a zoom in/out pattern for each loop
            loopedZoomDepth.push([loopProgress, 1]); // Start of loop
            loopedZoomDepth.push([loopProgress + (nextLoopProgress - loopProgress) * 0.5, zoomDepth]); // Middle of loop (peak zoom)
            loopedZoomDepth.push([nextLoopProgress, 1]); // End of loop
        }
        zoomDepth = loopedZoomDepth;
    }

    const zoomPosition = getZoomPosition(zoomData?.zoomPosition);
    const animationType = zoomData?.animationType || 'linear';

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
            durationInFrames: zoomDuration,
            delay: effectTiming === 'start' ? zoomStartDelay : (contextDuration - zoomEndDelay - zoomDuration),
        });
    } else {
        // For non-spring animations, calculate progress manually
        let animationFrame: number;

        if (effectTiming === 'start') {
            animationFrame = frame - zoomStartDelay;
        } else {
            // end timing
            animationFrame = frame - (contextDuration - zoomEndDelay - zoomDuration);
        }

        const easing = getEasingFunction(animationType);
        progress = interpolate(
            animationFrame,
            [0, zoomDuration],
            [0, 1],
            {
                easing,
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
            }
        );
    }

    // Calculate scale based on zoomDepth type
    let scale: number;

    if (typeof zoomDepth === 'number') {
        // Simple number case - interpolate between 1 and zoomDepth
        const baseScale = zoomDirection === 'in' ? 1 : zoomDepth;
        const targetScale = zoomDirection === 'in' ? zoomDepth : 1;
        scale = interpolate(progress, [0, 1], [baseScale, targetScale]);
    } else if (Array.isArray(zoomDepth)) {
        // Array case - get the scale directly from the array based on current progress
        // When using arrays, the zoom direction is already encoded in the array values
        scale = getZoomScale(progress, zoomDepth);
    } else {
        // Fallback
        const baseScale = zoomDirection === 'in' ? 1 : 1.5;
        const targetScale = zoomDirection === 'in' ? 1.5 : 1;
        scale = interpolate(progress, [0, 1], [baseScale, targetScale]);
    }

    // Calculate transform origin
    const [originX, originY] = zoomPosition;
    const transformOrigin = `${originX * 100}% ${originY * 100}%`;

    const style: React.CSSProperties = useMemo(() => {
        return {
            width: '100%',
            height: '100%',
            transform: `scale(${scale})`,
            transformOrigin,
        };
    }, [scale, transformOrigin]);

    return (
        <div style={style}>
            {children}
        </div>
    );
};

export const config: ComponentConfig = {
    displayName: 'zoom',
    type: 'layout',
    isInnerSequence: false,
    props: {
        effectTiming: {
            type: 'string',
            description: 'When the zoom effect should occur: "start" or "end"',
            default: 'start'
        },
        zoomDuration: {
            type: 'string',
            description: 'Duration of the zoom animation in seconds or percentage (e.g., "2" or "50%")',
            default: undefined
        },
        zoomStart: {
            type: 'number',
            description: 'Start time of zoom in seconds',
            default: 0
        },
        zoomEnd: {
            type: 'number',
            description: 'End time of zoom in seconds',
            default: undefined
        },
        zoomStartDelay: {
            type: 'string',
            description: 'Delay before zoom starts in seconds or percentage',
            default: 0
        },
        zoomEndDelay: {
            type: 'string',
            description: 'Delay before video ends in seconds or percentage',
            default: 0
        },
        zoomDirection: {
            type: 'string',
            description: 'Direction of zoom: "in" or "out"',
            default: 'in'
        },
        zoomDepth: {
            type: 'string',
            description: 'Zoom scale factor or array of [progress, scale] pairs',
            default: 1.5
        },
        zoomPosition: {
            type: 'string',
            description: 'Zoom anchor point: [x, y] coordinates or position string (top-left, center, etc.)',
            default: 'center'
        },
        animationType: {
            type: 'string',
            description: 'Animation curve: "linear", "spring", "ease-in", "ease-out", "ease-in-out"',
            default: 'linear'
        }
    }
};
