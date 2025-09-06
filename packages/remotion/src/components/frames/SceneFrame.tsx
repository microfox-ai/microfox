import React, { ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { BaseRenderableProps } from '../../core/types';

interface SceneFrameProps extends BaseRenderableProps {
    children?: ReactNode;
}

export const SceneFrame: React.FC<SceneFrameProps> = ({ children }) => {
    return <AbsoluteFill>{children as any}</AbsoluteFill>
}; 