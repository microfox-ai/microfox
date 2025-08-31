import React from 'react';
import { Waveform, useWaveformContext } from '../Waveform';
import { BaseRenderableData } from '../../..';

// Histogram waveform specific props
export interface WaveformHistogramDataProps {
    config: any; // Extends base WaveformConfig
    className?: string;
    style?: React.CSSProperties;

    // Histogram-specific styling
    barColor?: string;
    barWidth?: number;
    barSpacing?: number;
    barBorderRadius?: number;
    opacity?: number;

    // Layout
    multiplier?: number;
    horizontalSymmetry?: boolean; // Mirror left-right
    verticalMirror?: boolean; // Mirror up-down
    waveDirection?: 'right-to-left' | 'left-to-right';
    histogramStyle?: 'centered' | 'full-width';

    // Animation
    amplitude?: number;


    // Gradient
    gradientStartColor?: string;
    gradientEndColor?: string;
    gradientDirection?: 'vertical' | 'horizontal';
    gradientStyle?: 'mirrored' | 'normal';
}

export interface WaveformHistogramProps extends BaseRenderableData {
    data: WaveformHistogramDataProps;
}

// Histogram waveform component
export const WaveformHistogram: React.FC<WaveformHistogramProps> = ({ data }) => {
    const {
        config,
        className = '',
        style = {},
        barColor = '#FF6B6B',
        barWidth = 4,
        barSpacing = 2,
        barBorderRadius = 2,
        opacity = 1,
        horizontalSymmetry = true,
        verticalMirror = false,
        histogramStyle = 'centered',
        amplitude = 1,
        multiplier = 1,
        gradientStartColor,
        gradientEndColor,
        gradientDirection = 'vertical',
        gradientStyle = 'normal',
        waveDirection = 'right-to-left',
    } = data;
    return (
        <Waveform config={config} className={className} style={style}>
            <WaveformHistogramContent
                barColor={barColor}
                barWidth={barWidth}
                barSpacing={barSpacing}
                barBorderRadius={barBorderRadius}
                opacity={opacity}
                horizontalSymmetry={horizontalSymmetry}
                verticalMirror={verticalMirror}
                histogramStyle={histogramStyle}
                amplitude={amplitude}
                gradientStartColor={gradientStartColor}
                gradientEndColor={gradientEndColor}
                gradientDirection={gradientDirection}
                multiplier={multiplier}
                gradientStyle={gradientStyle}
                waveDirection={waveDirection}
            />
        </Waveform>
    );
};

// Internal content component
const WaveformHistogramContent: React.FC<Omit<WaveformHistogramDataProps, 'config' | 'className' | 'style'>> = ({
    barColor,
    barWidth,
    barSpacing,
    barBorderRadius,
    opacity,
    horizontalSymmetry,
    verticalMirror,
    histogramStyle,
    amplitude,
    gradientStartColor,
    gradientEndColor,
    gradientDirection,
    multiplier,
    gradientStyle,
    waveDirection,
}) => {
    const { waveformData, frequencyData, amplitudes, width, height } = useWaveformContext();

    // Use amplitudes if available, otherwise fall back to waveformData
    const dataToUse = amplitudes || waveformData;

    if (!dataToUse) {
        return (
            <div className="flex items-center justify-center w-full h-full text-gray-500">
                Loading histogram...
            </div>
        );
    }

    let directedData = waveDirection === 'left-to-right' ? dataToUse.slice(1).reverse() : dataToUse;

    // Prepare frequencies for display
    const frequencies = horizontalSymmetry
        ? [...directedData, ...directedData.slice(1).reverse()]
        : Array(multiplier).fill(directedData).flat();


    // Render bars component
    const Bars = ({ growUpwards }: { growUpwards: boolean }) => {
        // Create gradient style
        const styleGradientProp = gradientStartColor && gradientEndColor
            ? {
                background: `linear-gradient(${gradientDirection === 'horizontal' ?
                    gradientStyle === 'mirrored' ? 'to right' : growUpwards ? 'to right' : 'to left' :
                    gradientStyle === 'normal' ? growUpwards ? 'to top' : 'to bottom' : 'to bottom'
                    }, ${gradientStartColor}, ${gradientEndColor})`,
            }
            : { backgroundColor: barColor };


        const containerStyle: React.CSSProperties = {
            display: 'flex',
            flexDirection: 'row',
            alignItems: growUpwards ? 'flex-end' : 'flex-start',
            height: '100%',
            width: '100%',
            ...(histogramStyle === 'centered' && {
                justifyContent: 'center',
                gap: `${barSpacing}px`,
            }),
            ...(histogramStyle === 'full-width' && {
                gap: `${barSpacing}px`,
                justifyContent: 'space-between',
            }),
            opacity: gradientStyle === 'mirrored' && !growUpwards ? 0.25 : 1,
        };

        return (
            <div style={containerStyle}>
                {frequencies.map((value, index) => (
                    <div
                        key={index}
                        style={{
                            ...(histogramStyle === 'full-width'
                                ? { width: `${barWidth}px` }
                                : { width: `${barWidth}px` }),
                            ...styleGradientProp,
                            height: `${Math.min(
                                height / 2,
                                Math.abs(value) * (height / 2) * (amplitude || 1)
                            )}px`,
                            borderRadius: growUpwards ? `${barBorderRadius}px ${barBorderRadius}px 0 0` : `0 0 ${barBorderRadius}px ${barBorderRadius}px`,
                            opacity,
                        }}
                    />
                ))}
            </div>
        );
    };

    // Render based on mirroring options
    if (verticalMirror) {
        // Top half (upward bars)
        const topHalfStyle: React.CSSProperties = {
            position: 'absolute',
            bottom: `calc(100% - ${height / 2}px)`,
            height: `${height / 2}px`,
            width: '100%',
            left: 0,
        };

        // Bottom half (downward bars)
        const bottomHalfStyle: React.CSSProperties = {
            position: 'absolute',
            top: `${height / 2}px`,
            height: `${height / 2}px`,
            width: '100%',
            left: 0,
        };

        return (
            <>
                <div style={topHalfStyle}>
                    <Bars growUpwards={true} />
                </div>
                <div style={bottomHalfStyle}>
                    <Bars growUpwards={false} />
                </div>
            </>
        );
    }

    // Default: Non-mirrored histogram
    const containerStyle: React.CSSProperties = {
        width: '100%',
        position: 'absolute',
        top: `${height / 2 - (height / 4)}px`,
        height: `${height / 2}px`,
        left: 0,
    };

    return (
        <div style={containerStyle}>
            <Bars growUpwards={true} />
        </div>
    );
}; 