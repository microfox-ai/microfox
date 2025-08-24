import React, { useMemo } from 'react';
import { Waveform, useWaveformContext } from '../Waveform';
import { BaseRenderableData } from '../../..';

// Circular waveform specific props
export interface WaveformCircleDataProps {
    config: any; // Extends base WaveformConfig
    className?: string;
    style?: React.CSSProperties;

    // Circle-specific styling
    strokeColor?: string;
    strokeWidth?: number;
    fill?: string;
    opacity?: number;

    // Circle geometry
    radius?: number; // Radius as percentage of container
    centerX?: number; // Center X as percentage
    centerY?: number; // Center Y as percentage
    startAngle?: number; // Start angle in degrees
    endAngle?: number; // End angle in degrees

    // Animation
    amplitude?: number;
    rotationSpeed?: number; // Degrees per frame

    // Gradient
    gradientStartColor?: string;
    gradientEndColor?: string;
}

export interface WaveformCircleProps extends BaseRenderableData {
    data: WaveformCircleDataProps;
}

// Circular waveform component
export const WaveformCircle: React.FC<WaveformCircleProps> = ({ data }) => {
    const {
        config,
        className = '',
        style = {},
        strokeColor = '#FF6B6B',
        strokeWidth = 3,
        fill = 'none',
        opacity = 1,
        radius = 80,
        centerX = 50,
        centerY = 50,
        startAngle = 0,
        endAngle = 360,
        amplitude = 1,
        rotationSpeed = 0,
        gradientStartColor,
        gradientEndColor,
    } = data;
    return (
        <Waveform config={config} className={className} style={style}>
            <WaveformCircleContent
                strokeColor={strokeColor}
                strokeWidth={strokeWidth}
                fill={fill}
                opacity={opacity}
                radius={radius}
                centerX={centerX}
                centerY={centerY}
                startAngle={startAngle}
                endAngle={endAngle}
                amplitude={amplitude}
                rotationSpeed={rotationSpeed}
                gradientStartColor={gradientStartColor}
                gradientEndColor={gradientEndColor}
            />
        </Waveform>
    );
};

// Internal content component
const WaveformCircleContent: React.FC<Omit<WaveformCircleDataProps, 'config' | 'className' | 'style'>> = ({
    strokeColor,
    strokeWidth,
    fill,
    opacity,
    radius,
    centerX,
    centerY,
    startAngle,
    endAngle,
    amplitude,
    rotationSpeed,
    gradientStartColor,
    gradientEndColor,
}) => {
    const { waveformData, width, height, frame } = useWaveformContext();

    // Calculate circle parameters
    const circleRadius = (Math.min(width, height) * (radius || 80)) / 100;
    const circleCenterX = (width * (centerX || 50)) / 100;
    const circleCenterY = (height * (centerY || 50)) / 100;

    // Calculate rotation
    const rotation = (frame * (rotationSpeed || 0)) % 360;

    // Create circular path
    const circularPath = useMemo(() => {
        if (!waveformData) return '';

        const totalAngle = (endAngle || 360) - (startAngle || 0);
        const angleStep = totalAngle / waveformData.length;

        let path = '';

        waveformData.forEach((value, index) => {
            const angle = ((startAngle || 0) + index * angleStep + rotation) * (Math.PI / 180);
            const waveRadius = circleRadius + (value * (amplitude || 1) * circleRadius * 0.3);

            const x = circleCenterX + waveRadius * Math.cos(angle);
            const y = circleCenterY + waveRadius * Math.sin(angle);

            if (index === 0) {
                path += `M ${x} ${y}`;
            } else {
                path += ` L ${x} ${y}`;
            }
        });

        // Close the path if it's a full circle
        if (Math.abs((endAngle || 360) - (startAngle || 0)) >= 360) {
            path += ' Z';
        }

        return path;
    }, [waveformData, circleRadius, circleCenterX, circleCenterY, startAngle, endAngle, rotation, amplitude]);

    if (!waveformData) {
        return (
            <div className="flex items-center justify-center w-full h-full text-gray-500">
                Loading circular waveform...
            </div>
        );
    }

    // Create gradient definition
    const gradientId = 'circle-waveform-gradient';
    const hasGradient = gradientStartColor && gradientEndColor;

    return (
        <svg
            width={width}
            height={height}
            className="absolute inset-0"
            style={{ pointerEvents: 'none' }}
        >
            {/* Gradient definition */}
            {hasGradient && (
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={gradientStartColor} />
                        <stop offset="100%" stopColor={gradientEndColor} />
                    </linearGradient>
                </defs>
            )}

            {/* Circular waveform path */}
            <path
                d={circularPath}
                stroke={hasGradient ? `url(#${gradientId})` : strokeColor}
                strokeWidth={strokeWidth}
                fill={fill}
                opacity={opacity}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}; 