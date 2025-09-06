import React, { ReactNode } from 'react';
import { Loop } from 'remotion';
import { BaseRenderableProps, ComponentConfig } from '../../core/types';

interface LoopEffectData {
    durationInFrames?: number;
    times?: number;
    layout?: 'absolute-fill' | 'none';
}

export const LoopEffect: React.FC<BaseRenderableProps> = ({
    data,
    children,
    context
}) => {
    const { timing } = context ?? {};
    const loopData = data as LoopEffectData;
    const durationInFrames = loopData?.durationInFrames || timing?.durationInFrames || 50;
    const times = loopData?.times ?? Infinity;
    const layout = loopData?.layout || 'absolute-fill';

    return (
        <Loop
            durationInFrames={durationInFrames}
            times={times}
            layout={layout}
        >
            <>
                {children}
            </>
        </Loop>
    );
};

export const config: ComponentConfig = {
    displayName: 'loop',
    type: 'layout',
    isInnerSequence: false,
    props: {
        durationInFrames: {
            type: 'number',
            description: 'How many frames one iteration of the loop should be long',
            default: 50
        },
        times: {
            type: 'number',
            description: 'How many times to loop the content (defaults to Infinity)',
            default: undefined
        },
        layout: {
            type: 'string',
            description: 'Either "absolute-fill" (default) or "none"',
            default: 'absolute-fill'
        }
    }
};
