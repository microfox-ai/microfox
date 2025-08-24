'use client';
import React from 'react';
import { LayoutInstance } from '../primitives/types';
import { layoutRegistry } from './layoutRegistry';

export const LayoutRenderer = ({ layout, frameSize }: { layout: LayoutInstance, frameSize: { width: number, height: number } }) => {
    const LayoutComponent = layoutRegistry[layout.layoutId];

    if (!LayoutComponent) {
        console.warn(`Layout with id "${layout.layoutId}" not found in registry.`);
        return null;
    }

    // The Frame component will have calculated the absolute pixel values for the layout.
    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${layout.placement.x}px`,
        top: `${layout.placement.y}px`,
        width: `${layout.placement.width}px`,
        height: `${layout.placement.height}px`,
        ...layout.style,
    };

    return (
        <div style={style}>
            <LayoutComponent
                content={layout.content}
                sentence={layout.sentence}
                fontPairing={layout.fontPairing}
                atomStyles={layout.atomStyles}
            />
        </div>
    );
}; 