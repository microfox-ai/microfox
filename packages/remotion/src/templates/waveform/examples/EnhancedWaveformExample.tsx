import React from 'react';
import { AbsoluteFill } from 'remotion';
import { WaveformLine } from '../components/WaveformLine';
import { WaveformLineDataProps } from '../components/WaveformLine';

// Example component showcasing enhanced WaveformLine features
export const EnhancedWaveformExample: React.FC = () => {
    // Basic configuration
    const baseConfig = {
        audioSrc: 'https://example.com/audio.mp3', // Replace with your audio file
        numberOfSamples: 128,
        windowInSeconds: 0.1,
        normalize: true,
        amplitude: 1.2,
    };

    // Example 1: Basic beat-synchronized waveform
    const basicBeatSync: WaveformLineDataProps = {
        config: baseConfig,
        strokeColor: '#FF6B6B',
        strokeWidth: 4,
        beatSync: true,
        bpm: 120, // 120 BPM track
        beatAmplitudeMultiplier: 2.0,
        beatAnimationDuration: 20,
        amplitudeCurve: 'ease-out',
        centerLine: true,
    };

    // Example 2: Multi-segment waveform with spacing
    const multiSegmentWave: WaveformLineDataProps = {
        config: baseConfig,
        strokeColor: '#4ECDC4',
        strokeWidth: 3,
        waveSegments: 3,
        waveSpacing: 0.15, // 15% spacing between segments
        waveOffset: 10, // 10px offset
        beatSync: true,
        beatThreshold: 0.6,
        pulseOnBeat: true,
        pulseColor: '#FFD700',
        pulseScale: 1.5,
        centerLine: true,
        centerLineColor: '#666',
    };

    // Example 3: Vertical waveform with custom animation
    const verticalWave: WaveformLineDataProps = {
        config: baseConfig,
        strokeColor: '#45B7D1',
        strokeWidth: 5,
        waveDirection: 'vertical',
        waveSegments: 2,
        waveSpacing: 0.2,
        beatSync: true,
        bpm: 140, // 140 BPM track
        beatAmplitudeMultiplier: 1.8,
        beatAnimationDuration: 15,
        amplitudeCurve: 'bounce',
        animationSpeed: 1.5,
        centerLine: true,
        centerLineColor: '#999',
    };

    // Example 4: Automatic beat detection (no BPM specified)
    const autoBeatDetect: WaveformLineDataProps = {
        config: baseConfig,
        strokeColor: '#96CEB4',
        strokeWidth: 6,
        waveSegments: 4,
        waveSpacing: 0.1,
        beatSync: true,
        beatThreshold: 0.5, // Lower threshold for more sensitive detection
        beatAmplitudeMultiplier: 2.5,
        beatAnimationDuration: 25,
        amplitudeCurve: 'ease-in-out',
        pulseOnBeat: true,
        pulseColor: '#FF6B6B',
        pulseScale: 1.3,
        centerLine: true,
    };

    return (
        <AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
            {/* Example 1: Basic beat-synchronized */}
            <div style={{ position: 'absolute', top: '10%', left: '5%', width: '40%', height: '30%' }}>
                <WaveformLine
                    id="basic-beat-sync"
                    componentId="waveform-line"
                    type="atom"
                    data={basicBeatSync}
                />
                <div style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '0',
                    color: 'white',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                }}>
                    Basic Beat Sync (120 BPM)
                </div>
            </div>

            {/* Example 2: Multi-segment with spacing */}
            <div style={{ position: 'absolute', top: '10%', right: '5%', width: '40%', height: '30%' }}>
                <WaveformLine
                    id="multi-segment-wave"
                    componentId="waveform-line"
                    type="atom"
                    data={multiSegmentWave}
                />
                <div style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '0',
                    color: 'white',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                }}>
                    Multi-Segment with Spacing
                </div>
            </div>

            {/* Example 3: Vertical waveform */}
            <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '30%', height: '40%' }}>
                <WaveformLine
                    id="vertical-wave"
                    componentId="waveform-line"
                    type="atom"
                    data={verticalWave}
                />
                <div style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '0',
                    color: 'white',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                }}>
                    Vertical Wave (140 BPM)
                </div>
            </div>

            {/* Example 4: Auto beat detection */}
            <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '40%', height: '30%' }}>
                <WaveformLine
                    id="auto-beat-detect"
                    componentId="waveform-line"
                    type="atom"
                    data={autoBeatDetect}
                />
                <div style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '0',
                    color: 'white',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                }}>
                    Auto Beat Detection
                </div>
            </div>

            {/* Title */}
            <div style={{
                position: 'absolute',
                top: '2%',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif'
            }}>
                Enhanced Waveform Examples
            </div>
        </AbsoluteFill>
    );
};

// Usage instructions component
export const UsageInstructions: React.FC = () => {
    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
            <h2>Enhanced WaveformLine Usage</h2>

            <h3>Beat Synchronization</h3>
            <ul>
                <li><strong>beatSync</strong>: Enable/disable beat synchronization</li>
                <li><strong>bpm</strong>: Set manual BPM for precise beat timing</li>
                <li><strong>beatThreshold</strong>: Amplitude threshold for automatic beat detection (0-1)</li>
                <li><strong>beatAmplitudeMultiplier</strong>: Amplitude boost on beats</li>
                <li><strong>beatAnimationDuration</strong>: Duration of beat animation in frames</li>
            </ul>

            <h3>Wave Spacing & Layout</h3>
            <ul>
                <li><strong>waveSpacing</strong>: Spacing between wave segments (0-1)</li>
                <li><strong>waveSegments</strong>: Number of wave segments to display</li>
                <li><strong>waveOffset</strong>: Offset for wave positioning</li>
                <li><strong>waveDirection</strong>: 'horizontal' or 'vertical' wave direction</li>
            </ul>

            <h3>Animation Controls</h3>
            <ul>
                <li><strong>amplitudeCurve</strong>: Easing function for animations ('linear', 'ease-in', 'ease-out', 'ease-in-out', 'bounce')</li>
                <li><strong>animationSpeed</strong>: Speed multiplier for animations</li>
                <li><strong>pulseOnBeat</strong>: Enable pulsing effect on beats</li>
                <li><strong>pulseColor</strong>: Color for pulse effect</li>
                <li><strong>pulseScale</strong>: Scale factor for pulse effect</li>
            </ul>

            <h3>Example Configuration</h3>
            <pre style={{ backgroundColor: '#e0e0e0', padding: '10px', borderRadius: '5px' }}>
                {`const config: WaveformLineDataProps = {
    config: {
        audioSrc: 'your-audio-file.mp3',
        numberOfSamples: 128,
        amplitude: 1.2,
    },
    strokeColor: '#FF6B6B',
    strokeWidth: 4,
    beatSync: true,
    bpm: 120,
    beatAmplitudeMultiplier: 2.0,
    waveSegments: 3,
    waveSpacing: 0.15,
    pulseOnBeat: true,
    amplitudeCurve: 'ease-out',
};`}
            </pre>
        </div>
    );
}; 