import React from 'react';
import { Video } from 'remotion';
import { BaseRenderableProps, ComponentConfig } from '../../core/types';

interface VideoAtomProps extends BaseRenderableProps {
    data: {
        src: string;
        style?: React.CSSProperties;
    };
}

export const Atom: React.FC<VideoAtomProps> = ({ data }) => {
    return <Video src={data.src} style={data.style} />;
};

export const config: ComponentConfig = {
    displayName: 'VideoAtom',
    type: 'atom',
    isInnerSequence: false,
};