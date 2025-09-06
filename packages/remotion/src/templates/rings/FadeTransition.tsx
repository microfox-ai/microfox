import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, Sequence, AbsoluteFill } from 'remotion';
import { z } from 'zod';
import { LayoutProps, LayoutContext } from '../../core/types/transition.types';
import { buildLayoutHook } from '../../hooks/buildTransitionHook';

// Define the Zod schema for this transition's data
const FadeTransitionSchema = z.object({
    progress: z.number().min(0).max(1),
    fadeOut: z.number().min(0).max(1),
    fadeIn: z.number().min(0).max(1),
});

// Define default values
const defaultFadeData = {
    progress: 0,
    fadeOut: 0,
    fadeIn: 0,
};

// Create the typed transition hook
export const useFadeTransition = buildLayoutHook(
    FadeTransitionSchema,
    defaultFadeData
);

// Export the type for use in other components
export type FadeTransitionData = z.infer<typeof FadeTransitionSchema>;

const container: React.CSSProperties = {
    backgroundColor: "white",
};

export const FadeTransition: React.FC<LayoutProps> = ({ data, context, children }) => {
    const {
        transitionStart = 2,
        transitionDuration = 1
    } = data || {};

    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const transitionStartFrame = transitionStart * fps;
    const transitionDurationFrames = transitionDuration * fps;

    const fadeOut = spring({
        fps,
        frame,
        config: {
            damping: 200,
        },
        durationInFrames: transitionDurationFrames / 2,
        delay: transitionStartFrame,
    });

    const fadeIn = spring({
        fps,
        frame,
        config: {
            damping: 200,
        },
        durationInFrames: transitionDurationFrames / 2,
        delay: transitionStartFrame + transitionDurationFrames / 2,
    });

    const transitionData = {
        progress: (fadeOut + fadeIn) / 2,
        fadeOut,
        fadeIn,
    };

    const [from, to] = React.Children.toArray(children);

    return (
        <LayoutContext.Provider value={transitionData}>
            <AbsoluteFill style={{
                ...container,
                ...context?.boundaries,
            }}>
                <Sequence from={0} durationInFrames={transitionStartFrame + transitionDurationFrames}>
                    <div style={{ opacity: 1 - fadeOut }}>
                        {from as any}
                    </div>
                </Sequence>
                <Sequence from={transitionStartFrame + transitionDurationFrames / 2}>
                    <div style={{ opacity: fadeIn }}>
                        {to as any}
                    </div>
                </Sequence>
            </AbsoluteFill>
        </LayoutContext.Provider>
    );
}; 