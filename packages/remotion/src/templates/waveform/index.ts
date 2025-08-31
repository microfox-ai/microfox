import { registerComponent } from '../../core';
import { WaveformCircle } from './components/WaveformCircle';
import { WaveformHistogram } from './components/WaveformHistogram';
import { WaveformHistogramRanged } from './components/WaveformHistogramRanged';
import { WaveformLine } from './components/WaveformLine';

// Main Waveform component and types
export { Waveform, useWaveformContext } from './Waveform';
export type {
  WaveformConfig,
  WaveformContextType,
  WaveformProps,
} from './Waveform';

// Hook
export { useWaveformData } from './hooks/useWaveformData';
export type {
  UseWaveformDataConfig,
  UseWaveformDataReturn,
} from './hooks/useWaveformData';

// Waveform style components
export { WaveformLine } from './components/WaveformLine';
export type {
  WaveformLineProps,
  WaveformLineDataProps,
} from './components/WaveformLine';

export { WaveformHistogram } from './components/WaveformHistogram';
export type {
  WaveformHistogramProps,
  WaveformHistogramDataProps,
} from './components/WaveformHistogram';

export { WaveformHistogramRanged } from './components/WaveformHistogramRanged';
export type {
  WaveformHistogramRangedProps,
  WaveformHistogramRangedDataProps,
} from './components/WaveformHistogramRanged';

export { WaveformCircle } from './components/WaveformCircle';
export type {
  WaveformCircleProps,
  WaveformCircleDataProps,
} from './components/WaveformCircle';

// Default export
export { Waveform as default } from './Waveform';

registerComponent('WaveformLine', WaveformLine, 'atom', {
  displayName: 'WaveformLine',
});

registerComponent('WaveformHistogram', WaveformHistogram, 'atom', {
  displayName: 'WaveformHistogram',
});

registerComponent('WaveformHistogramRanged', WaveformHistogramRanged, 'atom', {
  displayName: 'WaveformHistogramRanged',
});

registerComponent('WaveformCircle', WaveformCircle, 'atom', {
  displayName: 'WaveformCircle',
});

export { WaveformPresets } from './utils';
