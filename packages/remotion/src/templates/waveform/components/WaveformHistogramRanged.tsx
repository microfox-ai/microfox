import React from 'react';
import { Waveform, useWaveformContext } from '../Waveform';
import { BaseRenderableData } from '../../..';

// Histogram waveform specific props
export interface WaveformHistogramRangedDataProps {
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
    horizontalSymmetry?: boolean; // Mirror left-right
    verticalMirror?: boolean; // Mirror up-down
    histogramStyle?: 'centered' | 'full-width';
    waveDirection?: 'right-to-left' | 'left-to-right';

    // Animation
    amplitude?: number;

    // Frequency range visualization
    showFrequencyRanges?: boolean; // Show bass/mid/treble sections
    rangeDividerColor?: string; // Color for range dividers
    rangeLabels?: boolean; // Show frequency range labels

    // Ranged histogram colors (kept for backward compatibility)
    bassBarColor?: string;
    midBarColor?: string;
    trebleBarColor?: string;

    // Gradient
    gradientStartColor?: string;
    gradientEndColor?: string;
    gradientDirection?: 'vertical' | 'horizontal';
    gradientStyle?: 'mirrored' | 'normal';
}

export interface WaveformHistogramRangedProps extends BaseRenderableData {
    data: WaveformHistogramRangedDataProps;
}

// Histogram waveform component
export const WaveformHistogramRanged: React.FC<WaveformHistogramRangedProps> = ({ data }) => {
    const {
        config,
        className = '',
        style = {},
        barColor = '#FF6B6B',
        barWidth = 4,
        barSpacing = 2,
        barBorderRadius = 2,
        opacity = 1,
        verticalMirror = false,
        histogramStyle = 'centered',
        amplitude = 1,
        showFrequencyRanges = true,
        rangeDividerColor = '#666',
        rangeLabels = false,
        bassBarColor = '#5DADE2',
        midBarColor = '#58D68D',
        trebleBarColor = '#F5B041',
        gradientStartColor,
        gradientEndColor,
        gradientDirection = 'vertical',
        gradientStyle = 'normal',
        horizontalSymmetry = false,
        waveDirection = 'right-to-left',
    } = data;
    return (
        <Waveform config={config} className={className} style={style}>
            <WaveformHistogramRangedContent
                barColor={barColor}
                barWidth={barWidth}
                barSpacing={barSpacing}
                barBorderRadius={barBorderRadius}
                opacity={opacity}
                verticalMirror={verticalMirror}
                histogramStyle={histogramStyle}
                amplitude={amplitude}
                showFrequencyRanges={showFrequencyRanges}
                rangeDividerColor={rangeDividerColor}
                rangeLabels={rangeLabels}
                bassBarColor={bassBarColor}
                midBarColor={midBarColor}
                trebleBarColor={trebleBarColor}
                gradientStartColor={gradientStartColor}
                gradientEndColor={gradientEndColor}
                gradientDirection={gradientDirection}
                gradientStyle={gradientStyle}
                horizontalSymmetry={horizontalSymmetry}
                waveDirection={waveDirection}
            />
        </Waveform>
    );
};

// Internal content component
const WaveformHistogramRangedContent: React.FC<Omit<WaveformHistogramRangedDataProps, 'config' | 'className' | 'style'>> = ({
    barColor,
    barWidth,
    barSpacing,
    barBorderRadius,
    opacity,
    verticalMirror,
    histogramStyle,
    amplitude,
    showFrequencyRanges,
    rangeDividerColor,
    rangeLabels,
    bassBarColor,
    midBarColor,
    trebleBarColor,
    gradientStartColor,
    gradientEndColor,
    gradientDirection,
    gradientStyle,
    horizontalSymmetry,
    waveDirection,
}) => {
    const { amplitudes, bassValues, midValues, trebleValues, height } = useWaveformContext();

    if (!amplitudes || !bassValues || !midValues || !trebleValues) {
        return (
            <div className="flex items-center justify-center w-full h-full text-gray-500">
                Loading frequency data...
            </div>
        );
    }

    // Define frequency ranges

    // Group frequencies by range
    const bassFrequencies = bassValues;
    const midFrequencies = midValues;
    const trebleFrequencies = trebleValues;


    // Create unified waveform data
    const allFrequencies = waveDirection === 'right-to-left' ? [bassFrequencies, midFrequencies, trebleFrequencies].flat() : [trebleFrequencies, midFrequencies, bassFrequencies].flat();


    // Prepare frequencies for display
    const unifiedWaveform = horizontalSymmetry
        ? [...allFrequencies.slice(1).reverse(), ...allFrequencies]
        : allFrequencies;


    // Render bars component
    const Bars = ({ growUpwards }: { growUpwards: boolean }) => {
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
                {unifiedWaveform.map((value, index) => {
                    const rangeName = index === 0 ? 'Bass' : index === 1 ? 'Mid' : 'Treble';

                    // Create gradient style
                    const styleGradientProp = gradientStartColor && gradientEndColor
                        ? {
                            background: `linear-gradient(${gradientDirection === 'horizontal' ?
                                gradientStyle === 'mirrored' ? 'to right' : growUpwards ? 'to right' : 'to left' :
                                gradientStyle === 'normal' ? growUpwards ? 'to top' : 'to bottom' : 'to bottom'
                                }, ${gradientStartColor}, ${gradientEndColor})`,
                        }
                        : { backgroundColor: barColor };

                    return (
                        <div
                            key={index}
                            style={{
                                width: `${(barWidth || 4)}px`, // Wider bars for the three ranges
                                ...styleGradientProp,
                                height: `${Math.min(
                                    height / 2,
                                    Math.abs(value) * (height / 2) * (amplitude || 1)
                                )}px`,
                                borderRadius: growUpwards ? `${barBorderRadius}px ${barBorderRadius}px 0 0` : `0 0 ${barBorderRadius}px ${barBorderRadius}px`,
                                opacity,
                                position: 'relative',
                            }}
                            title={`${rangeName}: ${(value * 100).toFixed(1)}%`}
                        >
                            {rangeLabels && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: growUpwards ? '-20px' : 'auto',
                                    top: growUpwards ? 'auto' : '-20px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    fontSize: '10px',
                                    color: rangeDividerColor,
                                    whiteSpace: 'nowrap',
                                }}>
                                    {rangeName}
                                </div>
                            )}
                        </div>
                    )
                })}
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