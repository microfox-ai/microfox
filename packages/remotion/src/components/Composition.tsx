import React from 'react';
import { AbsoluteFill, Composition as RemotionComposition, useVideoConfig } from 'remotion';
import { BaseRenderableData, RenderableComponentData } from '../core/types';
import { ComponentRenderer } from './base/ComponentRenderer';

interface CompositionProps extends BaseRenderableData {
    id: string;
    width: number;
    height: number;
    duration: number;
    fps: number;
    style?: React.CSSProperties;
}

const CompositionLayout = ({ childrenData, style }: { childrenData?: RenderableComponentData[], style?: React.CSSProperties }) => {
    if (!childrenData) {
        return null;
    }

    return (
        <AbsoluteFill style={style}>
            {childrenData.map((component) => (
                <ComponentRenderer
                    key={component.id}
                    {...component}
                />
            ))}
        </AbsoluteFill>
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
        defaultProps={{ childrenData, style }}
    />
}
