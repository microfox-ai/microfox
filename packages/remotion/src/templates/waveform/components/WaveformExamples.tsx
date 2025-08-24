import React from 'react';
import { WaveformConfig } from '../Waveform';
import { WaveformLine } from './WaveformLine';
import { WaveformHistogram } from './WaveformHistogram';
import { WaveformCircle } from './WaveformCircle';

// Example configuration
const exampleConfig: WaveformConfig = {
    audioSrc: 'https://cdn1.suno.ai/6bc4e103-10c2-45f5-a6cf-830707f2baa0.mp3',
    numberOfSamples: 128,
    windowInSeconds: 1,
    height: 200,
    backgroundColor: '#1a1a1a',
};


// Histogram waveform example
export const HistogramWaveformExample: React.FC = () => (
    <div className="p-4 bg-gray-900 rounded-lg">
        <h3 className="text-white mb-4 text-lg font-semibold">Histogram Waveform</h3>
        <WaveformHistogram
            id="histogram-waveform"
            componentId="histogram-waveform"
            type="atom"
            data={{
                config: exampleConfig,
                barColor: '#4ECDC4',
                barWidth: 4,
                barSpacing: 2,
                barBorderRadius: 2,
                horizontalSymmetry: true,
                verticalMirror: false,
                histogramStyle: 'centered',
                amplitude: 1.5,
                className: 'rounded-lg',
            }}
        />
    </div>
);

// Circular waveform example
export const CircleWaveformExample: React.FC = () => (
    <div className="p-4 bg-gray-900 rounded-lg">
        <h3 className="text-white mb-4 text-lg font-semibold">Circular Waveform</h3>
        <WaveformCircle
            id="circle-waveform"
            componentId="circle-waveform"
            type="atom"
            data={{
                config: exampleConfig,
                strokeColor: '#FF6B6B',
                strokeWidth: 3,
                radius: 70,
                centerX: 50,
                centerY: 50,
                startAngle: 0,
                endAngle: 360,
                amplitude: 1.5,
                rotationSpeed: 0.5,
                className: 'rounded-lg',
            }}
        />
    </div>
);

// Gradient histogram example
export const GradientHistogramExample: React.FC = () => (
    <div className="p-4 bg-gray-900 rounded-lg">
        <h3 className="text-white mb-4 text-lg font-semibold">Gradient Histogram</h3>
        <WaveformHistogram
            id="gradient-histogram"
            componentId="gradient-histogram"
            type="atom"
            data={{
                config: exampleConfig,
                barColor: '#4ECDC4',
                barWidth: 4,
                barSpacing: 2,
                barBorderRadius: 2,
                horizontalSymmetry: true,
                verticalMirror: false,
                histogramStyle: 'centered',
                amplitude: 1.5,
                gradientStartColor: '#FF6B6B',
                gradientEndColor: '#4ECDC4',
                gradientDirection: 'vertical',
                className: 'rounded-lg',
            }}
        />
    </div>
);


// All examples combined
export const AllWaveformExamples: React.FC = () => (
    <div className="space-y-6 p-6 bg-black min-h-screen">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
            Waveform Component Examples
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <HistogramWaveformExample />
            <CircleWaveformExample />
            <GradientHistogramExample />
        </div>
    </div>
);

export default AllWaveformExamples; 