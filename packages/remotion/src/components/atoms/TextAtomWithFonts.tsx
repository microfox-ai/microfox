import React, { useEffect, useState } from 'react';
import { BaseRenderableProps } from '../../core/types';
import { ComponentConfig } from '../../core/types';
import { useFontLoader } from '../../hooks/useFontLoader';
import { getFontFamilyCSS } from '../../utils/fontUtils';

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
 * - Dynamic Google Font loading
 * - Loading states with visual indicators
 * - Error handling with fallbacks
 * - Multiple font weights and subsets support
 * - Font preloading for performance
 * - Graceful degradation to system fonts
 */
export const Atom: React.FC<TextAtomProps> = ({ data }) => {
    const [fontFamily, setFontFamily] = useState<string>('sans-serif');
    const [isFontLoading, setIsFontLoading] = useState(false);
    const [fontError, setFontError] = useState<Error | null>(null);

    const {
        loadFont,
        isFontReady,
        getFontError,
        loadingFonts,
        errorFonts,
    } = useFontLoader({
        onLoad: (family) => {
            console.log(`Font ${family} loaded successfully`);
            setIsFontLoading(false);
            setFontError(null);
        },
        onError: (family, error) => {
            console.warn(`Font ${family} failed to load:`, error);
            setFontError(error);
            setIsFontLoading(false);
        },
    });

    // Load font when component mounts or font config changes
    useEffect(() => {
        if (data.font?.family) {
            const fontFamilyName = data.font.family;

            if (!isFontReady(fontFamilyName)) {
                setIsFontLoading(true);
                loadFont(fontFamilyName, {
                    weights: data.font.weights || ['400'],
                    subsets: data.font.subsets || ['latin'],
                    display: data.font.display || 'swap',
                    preload: data.font.preload !== false,
                });
            } else {
                setIsFontLoading(false);
            }
        }
    }, [data.font, loadFont, isFontReady]);

    // Update font family when font is ready or on error
    useEffect(() => {
        if (data.font?.family) {
            const fontFamilyName = data.font.family;

            if (isFontReady(fontFamilyName)) {
                setFontFamily(getFontFamilyCSS(fontFamilyName, data.fallbackFonts));
                setIsFontLoading(false);
                setFontError(null);
            } else if (errorFonts.has(fontFamilyName)) {
                const error = getFontError(fontFamilyName);
                setFontError(error || null);
                setFontFamily(getFontFamilyCSS('sans-serif', data.fallbackFonts));
                setIsFontLoading(false);
            }
        }
    }, [data.font, data.fallbackFonts, isFontReady, errorFonts, getFontError]);

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
    if (fontError && data.errorState?.showErrorIndicator) {
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
            data-font-loaded={isFontReady(data.font?.family || '')}
            data-font-error={!!fontError}
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