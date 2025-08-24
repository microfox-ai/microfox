import React, { useMemo } from "react";
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import { BaseRenderableProps, ComponentConfig } from "../../core";

const outer: React.CSSProperties = {};

interface LayoutProps extends BaseRenderableProps {
    children?: React.ReactNode;
}

export const TextFade = (props: LayoutProps) => {

    const { children, context, data } = props;
    const { animation } = data || {
        animation: {
            duration: 1,
        }
    };
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();


    const progress = spring({
        fps,
        frame,
        config: {
            damping: 200,
        },

        durationInFrames: animation.duration * fps,
    });

    const rightStop = interpolate(progress, [0, 1], [200, 0]);

    const leftStop = Math.max(0, rightStop - 60);

    const maskImage = `linear-gradient(-45deg, transparent ${leftStop}%, black ${rightStop}%)`;

    const container: React.CSSProperties = useMemo(() => {
        return {
            width: '100%',
            height: '100%',
            justifyContent: "center",
            alignItems: "center",
        };
    }, []);

    const content: React.CSSProperties = useMemo(() => {
        return {
            ...context?.boundaries,
            maskImage,
            WebkitMaskImage: maskImage,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
        };
    }, [maskImage]);

    return (
        <AbsoluteFill style={container}>
            <div style={content}>{children}</div>
        </AbsoluteFill>
    );
};

export const textFadeConfig: ComponentConfig = {
    displayName: 'TextFade',
    type: 'layout',
    isInnerSequence: false,
};