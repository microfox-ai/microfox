import React from 'react';
import { AbsoluteFill, Composition as RemotionComposition, useVideoConfig, useCurrentFrame } from 'remotion';
import { BaseRenderableData, RenderableComponentData } from '../core/types';
import { ComponentRenderer } from './base/ComponentRenderer';
import { CompositionProvider } from '../core/context/CompositionContext';

interface CompositionProps extends BaseRenderableData {
    id: string;
    width: number;
    height: number;
    duration: number;
    fps: number;
    style?: React.CSSProperties;
}

const CompositionLayout = ({ childrenData, style, duration }: {
    childrenData?: RenderableComponentData[],
    style?: React.CSSProperties,
    duration: number
}) => {

    return (
        <CompositionProvider
            value={{
                root: childrenData,
                duration,
            }}
        >
            <AbsoluteFill style={style}>
                {childrenData?.map((component) => (
                    <ComponentRenderer
                        key={component.id}
                        {...component}
                    />
                ))}
            </AbsoluteFill>
        </CompositionProvider>
    );
};

export const Composition = ({
    id,
    childrenData,
    width,
    height,
    duration,
    fps,
    style
}: CompositionProps) => {

    return <RemotionComposition
        id={id}
        component={CompositionLayout}
        durationInFrames={Math.round(duration * fps)}
        fps={fps}
        width={width}
        height={height}
        defaultProps={{ childrenData, style, duration }}
    />
}
