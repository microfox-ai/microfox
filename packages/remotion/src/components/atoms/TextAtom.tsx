import React, { useEffect, useState } from 'react';
import { BaseRenderableProps } from '../../core/types';
import { ComponentConfig } from '../../core/types';
import { useFont } from '../../hooks/useFontLoader';

// Simplified font loading approach - similar to Remotion Google Fonts:
// const { fontFamily } = useFont('Inter', { weights: ['400', '700'] });
// 
// The fontFamily value is now directly usable in CSS:
// style={{ fontFamily }}

interface TextAtomData {
    text: string;
    style?: React.CSSProperties;
    className?: string;
    font?: {
        family: string;
        weights?: string[];
        subsets?: string[];
        display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
        preload?: boolean;
    };
    fallbackFonts?: string[];
}

interface TextAtomProps extends BaseRenderableProps {
    data: TextAtomData;
}

export const Atom: React.FC<TextAtomProps> = ({ data }) => {
    const [isFontLoading, setIsFontLoading] = useState(false);

    // Font loading logic - now returns fontFamily CSS value directly
    const { isLoaded, error, isReady, fontFamily } = useFont(
        data.font?.family || 'Inter',
        {
            weights: data.font?.weights || ['400'],
            subsets: data.font?.subsets || ['latin'],
            display: data.font?.display || 'swap',
            preload: data.font?.preload !== false,
        }
    );

    useEffect(() => {
        if (data.font?.family) {
            setIsFontLoading(true);
            if (isReady || isLoaded) {
                setIsFontLoading(false);
            }
        }
    }, [data.font, isReady, isLoaded]);

    // Enhanced style with font loading support
    const enhancedStyle: React.CSSProperties = {
        fontFamily,
        opacity: isFontLoading ? 0.8 : 1, // Slight opacity during loading
        transition: 'opacity 0.2s ease-in-out',
        ...data.style,
    };

    // Show loading state or error handling
    if (error) {
        console.warn(`Font loading error for ${data.font?.family}:`, error);
    }

    return (
        <div
            style={enhancedStyle}
            className={data.className}
            data-font-loading={isFontLoading}
            data-font-loaded={isReady || isLoaded}
        >
            {data.text}
        </div>
    );
};

// Static config for TextAtom
export const config: ComponentConfig = {
    displayName: 'TextAtom',
    type: 'atom',
    isInnerSequence: false,
}; 