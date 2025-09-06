import React, { useMemo } from 'react';
import { Img, staticFile } from 'remotion';
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

    const source = useMemo(() => {
        if (data.src.startsWith('http')) {
            return data.src;
        }
        return staticFile(data.src);
    }, [data.src]);

    return <Img className={data.className} src={source} style={data.style} crossOrigin='anonymous' />;
};

// Static config for ImageAtom
export const config: ComponentConfig = {
    displayName: 'ImageAtom',
    type: 'atom',
    isInnerSequence: false,
}; 