'use client';
import React, { useRef, useState, useLayoutEffect } from 'react';
import { ResizeObserver } from '@juggle/resize-observer';
import { BaseLayoutProps } from '../primitives/types';
import { AtomRenderer } from '../primitives/AtomRenderer';
import { useVerticalLayout } from '../hooks/useVerticalLayout';

export const VerticalFillLayout = ({ sentence, fontPairing, atomStyles }: BaseLayoutProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            if (entry) {
                setSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        });
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    const { lines, contentHeight } = useVerticalLayout({
        sentence,
        fontPairing,
        containerWidth: size.width,
        containerHeight: size.height,
        atomStyles: atomStyles ?? [],
    });

    const scaleY = size.height > 0 && contentHeight > 0 ? size.height / contentHeight : 1;

    return (
        <div ref={containerRef} style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'stretch',
            height: '100%', width: '100%'
        }}>
            {lines.map((line, lineIndex) => (
                <div key={lineIndex} style={{ display: 'flex', flexDirection: 'row', gap: '1ch', whiteSpace: 'nowrap' }}>
                    {line.map((atom) => (
                        <AtomRenderer key={atom.id} data={atom} />
                    ))}
                </div>
            ))}
        </div>
    );
}; 