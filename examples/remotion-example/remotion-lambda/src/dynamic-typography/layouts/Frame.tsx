'use client';
import React, { useRef, useState, useLayoutEffect } from 'react';
import { LayoutInstance } from '../primitives/types';
import { LayoutRenderer } from './LayoutRenderer';
import { ResizeObserver } from '@juggle/resize-observer';

interface FrameProps {
    layouts: LayoutInstance[];
    stackedLayouts?: LayoutInstance[];
    style?: React.CSSProperties;
    className?: string;
}

export const Frame = ({ layouts, stackedLayouts = [], style, className }: FrameProps) => {
    const frameRef = useRef<HTMLDivElement>(null);
    const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (!frameRef.current) return;
        const observer = new ResizeObserver((entries) => {
            if (entries && entries.length > 0 && entries[0]) {
                const { width, height } = entries[0].contentRect;
                setFrameSize({ width, height });
            }
        });
        observer.observe(frameRef.current);
        return () => observer.disconnect();
    }, []);

    const calculatePlacement = (layout: LayoutInstance) => {
        const { alignment, minWidth, minHeight, maxWidth, maxHeight } = layout.constraints;
        let x = 0, y = 0;

        const parseValue = (value: string | undefined, totalSize: number) => {
            if (!value) return totalSize;
            if (value.endsWith('%')) {
                return totalSize * parseFloat(value) / 100;
            }
            if (value.endsWith('em')) {
                // Assuming 1em = 16px for simplicity. A more robust solution might need access to computed styles.
                return parseFloat(value) * 16;
            }
            return parseFloat(value);
        };

        let width = parseValue(minWidth, frameSize.width);
        let height = parseValue(minHeight, frameSize.height);

        // Horizontal alignment
        if (alignment.includes('right')) {
            x = frameSize.width - width;
        } else if (alignment.includes('left')) {
            x = 0;
        } else if (alignment.includes('center-x') || alignment.includes('center')) {
            x = (frameSize.width - width) / 2;
        }

        // Vertical alignment
        if (alignment.includes('bottom')) {
            y = frameSize.height - height;
        } else if (alignment.includes('top')) {
            y = 0;
        } else if (alignment.includes('center-y') || alignment.includes('center')) {
            y = (frameSize.height - height) / 2;
        }

        layout.placement = { x, y, width, height };
        return layout;
    };

    const positionedLayouts = layouts.map(calculatePlacement);
    const positionedStackedLayouts = stackedLayouts.map(calculatePlacement);

    return (
        <div ref={frameRef} className={className} style={{ ...style, position: 'relative', width: '100%', height: '100%' }}>
            {positionedLayouts.map(layout => (
                <LayoutRenderer key={layout.id} layout={layout} frameSize={frameSize} />
            ))}
            {positionedStackedLayouts.map(layout => (
                <LayoutRenderer key={layout.id} layout={layout} frameSize={frameSize} />
            ))}
        </div>
    );
}; 