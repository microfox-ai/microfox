import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, Sequence, AbsoluteFill, Series } from 'remotion';
import { z } from 'zod';
import { LayoutProps, LayoutContext } from '../../core/types/transition.types';
import { buildLayoutHook } from '../../hooks/buildTransitionHook';
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";
import { useRenderContext } from '../../components/base/ComponentRenderer';
import { ComponentConfig } from '../../core/types';

loadFont("normal", {
    subsets: ["latin"],
    weights: ["400", "700"],
});

// Define the Zod schema for this transition's data
const RippleOutTransitionSchema = z.object({
    progress: z.number().min(0).max(1),
    logoOut: z.number().min(0).max(1),
});

// Define default values
const defaultRippleOutData = {
    progress: 0,
    logoOut: 0,
};

// Create the typed transition hook
export const useRippleOutLayout = buildLayoutHook(
    RippleOutTransitionSchema,
    defaultRippleOutData
);

// Export the type for use in other components
export type RippleOutTransitionData = z.infer<typeof RippleOutTransitionSchema>;

const container: React.CSSProperties = {
    backgroundColor: "white",
};

const logo: React.CSSProperties = {
    justifyContent: "center",
    alignItems: "center",
};

export const RippleOutLayout: React.FC<LayoutProps> = ({ data, context, children }) => {
    const {
        transitionStart,
        transitionDuration
    } = data || { transitionStart: 2, transitionDuration: 1 };

    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const { hierarchy } = useRenderContext();

    const transitionStartFrame = transitionStart * fps;
    const transitionDurationFrames = transitionDuration * fps;

    const logoOut = spring({
        fps,
        frame,
        config: {
            damping: 200,
        },
        durationInFrames: transitionDurationFrames,
        delay: transitionStartFrame,
    });

    const transitionData = {
        progress: logoOut,
        logoOut,
    };

    const childrenArray = React.Children.toArray(children).filter(child =>
        React.isValidElement(child)
    );
    const [from, to] = childrenArray;


    return (
        <LayoutContext.Provider value={transitionData}>
            <AbsoluteFill style={{
                ...container,
                ...context?.boundaries,
            }}>
                <Sequence name={(from as any).props.componentId + " - " + (from as any).props.id} from={0} durationInFrames={transitionStartFrame + transitionDurationFrames}>
                    {from as any}
                </Sequence>
                <Sequence name={(to as any).props.componentId + " - " + (to as any).props.id} from={transitionStartFrame + transitionDurationFrames / 2}>
                    {to as any}
                </Sequence>
            </AbsoluteFill>
        </LayoutContext.Provider>
    );
};

export const rippleOutLayoutConfig: ComponentConfig = {
    displayName: 'RippleOutLayout',
    type: 'layout',
    isInnerSequence: true,
};