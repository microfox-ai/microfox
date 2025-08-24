import { z } from "zod";
import {
    AbsoluteFill,
    Sequence,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import { NextjsLogo } from "./NextjsLogo";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";
import React, { useMemo } from "react";
import { Rings } from "./Rings";
import { TextFade } from "./TextFade";
import { RingsCompositionProps } from "./constants";
import { BaseRenderableProps } from "../../core";

loadFont("normal", {
    subsets: ["latin"],
    weights: ["400", "700"],
});

const container: React.CSSProperties = {
    backgroundColor: "white",
};

const logo: React.CSSProperties = {
    justifyContent: "center",
    alignItems: "center",
};

interface RingsLayoutProps extends BaseRenderableProps {
    data: z.infer<typeof RingsCompositionProps>;
}

export const RingsLayout = (props: RingsLayoutProps) => {
    const { data, context } = props;
    const { title } = data;

    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const transitionStart = 2 * fps;
    const transitionDuration = 1 * fps;

    const logoOut = spring({
        fps,
        frame,
        config: {
            damping: 200,
        },
        durationInFrames: transitionDuration,
        delay: transitionStart,
    });

    const titleStyle: React.CSSProperties = useMemo(() => {
        return { fontFamily, fontSize: 70 };
    }, []);

    return (
        <AbsoluteFill style={{
            ...container,
            ...context?.boundaries,
        }}>
            <Sequence durationInFrames={transitionStart + transitionDuration}>
                <Rings></Rings>
                <AbsoluteFill style={logo}>
                    <NextjsLogo></NextjsLogo>
                </AbsoluteFill>
            </Sequence>
            <Sequence from={transitionStart + transitionDuration / 2}>
                <TextFade id="TextFade" type="atom">
                    <h1 style={titleStyle}>{title}</h1>
                </TextFade>
            </Sequence>
        </AbsoluteFill>
    );
}; 