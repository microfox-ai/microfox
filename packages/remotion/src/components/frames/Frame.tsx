import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BaseRenderableProps } from '../../core/types';

interface FrameProps extends BaseRenderableProps {
    data?: {
        style?: React.CSSProperties;
    };
}

export const Frame = ({ children, data }: FrameProps) => {
    return <AbsoluteFill style={data?.style}>{children as any}</AbsoluteFill>
}; 