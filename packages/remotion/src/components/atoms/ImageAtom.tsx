import React from 'react';
import { Img } from 'remotion';
import { BaseRenderableProps } from '../../core/types';
import { ComponentConfig } from '../../core/types';

interface ImageAtomProps extends BaseRenderableProps {
    data: {
        src: string;
        style?: React.CSSProperties;
        className?: string;
    };
}

export const Atom: React.FC<ImageAtomProps> = ({ data }) => {
    return <Img className={data.className} src={data.src} style={data.style} />;
};

// Static config for ImageAtom
export const config: ComponentConfig = {
    displayName: 'ImageAtom',
    type: 'atom',
    isInnerSequence: false,
}; 