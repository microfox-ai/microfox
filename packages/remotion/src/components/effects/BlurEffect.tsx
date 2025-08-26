import React from 'react';
import { BaseRenderableProps } from '../../core/types';

interface BlurEffectData {
    blur?: number;
    children?: React.ReactNode;
}

export const BlurEffect: React.FC<BaseRenderableProps> = ({
    data,
    children
}) => {
    const blurAmount = (data as BlurEffectData)?.blur || 5;

    return (
        <div style={{
            filter: `blur(${blurAmount}px)`,
            width: '100%',
            height: '100%'
        }}>
            {children}
        </div>
    );
};

export const config = {
    displayName: 'blur',
    description: 'Applies a blur effect to its children',
    category: 'effects',
    props: {
        blur: {
            type: 'number',
            description: 'Blur amount in pixels',
            default: 5
        }
    }
}; 