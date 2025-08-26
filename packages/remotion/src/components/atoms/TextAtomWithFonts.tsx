import React, { useEffect, useState } from 'react';
import { BaseRenderableProps } from '../../core/types';
import { ComponentConfig } from '../../core/types';
import { useFont } from '../../hooks/useFontLoader';

// Simplified font loading approach - similar to Remotion Google Fonts:
// const { fontFamily } = useFont('Inter', { weights: ['400', '700'] });
// 
// The fontFamily value is now directly usable in CSS:
// style={{ fontFamily }}

interface FontConfig {
    family: string;
    weights?: string[];
    subsets?: string[];
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
    preload?: boolean;
}

export interface TextAtomDataWithFonts {
    text: string;
    style?: React.CSSProperties;
    className?: string;
    font?: FontConfig;
    fallbackFonts?: string[];
    loadingState?: {
        showLoadingIndicator?: boolean;
        loadingText?: string;
        loadingStyle?: React.CSSProperties;
    };
    errorState?: {
        showErrorIndicator?: boolean;
        errorText?: string;
        errorStyle?: React.CSSProperties;
    };
}

interface TextAtomProps extends BaseRenderableProps {
    data: TextAtomDataWithFonts;
}

/**
 * Enhanced TextAtom with comprehensive dynamic font loading capabilities
 * 
 * Features:
 * - Dynamic Google Font loading with simplified API
 * - Loading states with visual indicators
 * - Error handling with fallbacks
 * - Multiple font weights and subsets support
 * - Font preloading for performance
 * - Graceful degradation to system fonts
 */
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
            onLoad: (family, cssValue) => {
                console.log(`Font ${family} loaded successfully with CSS value: ${cssValue}`);
                setIsFontLoading(false);
            },
            onError: (family, error) => {
                console.warn(`Font ${family} failed to load:`, error);
                setIsFontLoading(false);
            },
        }
    );

    // Update loading state when font status changes
    useEffect(() => {
        if (data.font?.family) {
            if (isReady || isLoaded) {
                setIsFontLoading(false);
            } else if (!isReady && !isLoaded && !error) {
                setIsFontLoading(true);
            }
        }
    }, [data.font, isReady, isLoaded, error]);

    // Enhanced style with font loading support
    const enhancedStyle: React.CSSProperties = {
        fontFamily,
        opacity: isFontLoading ? 0.8 : 1,
        transition: 'opacity 0.3s ease-in-out, font-family 0.2s ease-in-out',
        ...data.style,
    };

    // Loading state
    if (isFontLoading && data.loadingState?.showLoadingIndicator) {
        return (
            <div style={enhancedStyle} className={data.className}>
                <span style={data.loadingState.loadingStyle}>
                    {data.loadingState.loadingText || 'Loading...'}
                </span>
            </div>
        );
    }

    // Error state
    if (error && data.errorState?.showErrorIndicator) {
        return (
            <div style={enhancedStyle} className={data.className}>
                <span style={data.errorState.errorStyle}>
                    {data.errorState.errorText || data.text}
                </span>
            </div>
        );
    }

    return (
        <div
            style={enhancedStyle}
            className={data.className}
            data-font-loading={isFontLoading}
            data-font-loaded={isReady || isLoaded}
            data-font-error={!!error}
            data-font-family={data.font?.family || 'system'}
        >
            {data.text}
        </div>
    );
};

// Static config for TextAtom
export const config: ComponentConfig = {
    displayName: 'TextAtomWithFonts',
    type: 'atom',
    isInnerSequence: false,
};