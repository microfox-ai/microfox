import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { BaseRenderableProps, ComponentConfig } from '../../core/types';

type Shape = 'circle' | 'rectangle' | 'star' | 'triangle';

interface ShapeAtomProps extends BaseRenderableProps {
    data: {
        shape: Shape;
        color: string;
        rotation?: {
            duration: number; // in frames
        };
        style?: React.CSSProperties;
    };
}

export const Atom: React.FC<ShapeAtomProps> = ({ data }) => {
    const frame = useCurrentFrame();
    const { shape, color, rotation, style } = data;

    const rotationStyle: React.CSSProperties = rotation
        ? {
            transform: `rotate(${interpolate(
                frame % rotation.duration,
                [0, rotation.duration],
                [0, 360],
                {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.linear,
                }
            )}deg)`,
        }
        : {};

    const baseStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        ...style,
        ...rotationStyle,
    };

    switch (shape) {
        case 'circle':
            return <div style={{ ...baseStyle, backgroundColor: color, borderRadius: '50%' }} />;
        case 'rectangle':
            return <div style={{ ...baseStyle, backgroundColor: color }} />;
        default:
            return null;
    }
};

export const config: ComponentConfig = {
    displayName: 'ShapeAtom',
    type: 'atom',
    isInnerSequence: false,
};