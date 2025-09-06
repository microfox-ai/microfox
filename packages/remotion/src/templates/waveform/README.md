# Enhanced WaveformLine Component

A powerful, beat-synchronized waveform visualization component for Remotion with advanced animation controls and customizable wave spacing.

## Features

### 🎵 Beat Synchronization

- **Manual BPM Control**: Set exact BPM for precise beat timing
- **Automatic Beat Detection**: AI-powered beat detection based on amplitude thresholds
- **Beat-Responsive Animations**: Amplitude changes synchronized with beats
- **Customizable Beat Effects**: Control amplitude multipliers and animation duration

### 🎨 Wave Spacing & Layout

- **Multi-Segment Waves**: Display multiple wave segments with configurable spacing
- **Custom Spacing**: Control spacing between wave segments (0-1)
- **Wave Offset**: Position waves with pixel-perfect offset control
- **Directional Waves**: Support for both horizontal and vertical wave directions

### ✨ Advanced Animation

- **Easing Curves**: Multiple easing functions (linear, ease-in, ease-out, ease-in-out, bounce)
- **Animation Speed Control**: Adjust animation speed with multipliers
- **Pulse Effects**: Visual pulse effects triggered by beats
- **Smooth Transitions**: Smooth amplitude transitions with configurable curves

## Installation

```bash
npm install @microfox/remotion
```

## Basic Usage

```tsx
import { WaveformLine } from '@microfox/remotion';

const MyComposition = () => {
  const config = {
    audioSrc: 'path/to/your/audio.mp3',
    numberOfSamples: 128,
    amplitude: 1.2,
  };

  return (
    <WaveformLine
      id="my-waveform"
      componentId="waveform-line"
      type="atom"
      data={{
        config,
        strokeColor: '#FF6B6B',
        strokeWidth: 4,
        beatSync: true,
        bpm: 120,
        waveSegments: 3,
        waveSpacing: 0.15,
      }}
    />
  );
};
```

## Configuration Options

### Beat Synchronization

| Property                  | Type      | Default     | Description                                       |
| ------------------------- | --------- | ----------- | ------------------------------------------------- |
| `beatSync`                | `boolean` | `false`     | Enable/disable beat synchronization               |
| `bpm`                     | `number`  | `undefined` | Manual BPM setting for precise timing             |
| `beatThreshold`           | `number`  | `0.7`       | Amplitude threshold for auto beat detection (0-1) |
| `beatAmplitudeMultiplier` | `number`  | `1.5`       | Amplitude boost multiplier on beats               |
| `beatAnimationDuration`   | `number`  | `15`        | Duration of beat animation in frames              |

### Wave Spacing & Layout

| Property        | Type                         | Default        | Description                         |
| --------------- | ---------------------------- | -------------- | ----------------------------------- |
| `waveSpacing`   | `number`                     | `0.1`          | Spacing between wave segments (0-1) |
| `waveSegments`  | `number`                     | `1`            | Number of wave segments to display  |
| `waveOffset`    | `number`                     | `0`            | Pixel offset for wave positioning   |
| `waveDirection` | `'horizontal' \| 'vertical'` | `'horizontal'` | Wave direction                      |

### Animation Controls

| Property         | Type      | Default      | Description                    |
| ---------------- | --------- | ------------ | ------------------------------ |
| `amplitudeCurve` | `string`  | `'ease-out'` | Easing function for animations |
| `animationSpeed` | `number`  | `1`          | Animation speed multiplier     |
| `pulseOnBeat`    | `boolean` | `false`      | Enable pulsing effect on beats |
| `pulseColor`     | `string`  | `'#FFD700'`  | Color for pulse effect         |
| `pulseScale`     | `number`  | `1.2`        | Scale factor for pulse effect  |

### Styling

| Property          | Type      | Default     | Description                |
| ----------------- | --------- | ----------- | -------------------------- |
| `strokeColor`     | `string`  | `'#FF6B6B'` | Wave stroke color          |
| `strokeWidth`     | `number`  | `3`         | Wave stroke width          |
| `strokeLinecap`   | `string`  | `'round'`   | Stroke line cap style      |
| `strokeLinejoin`  | `string`  | `'round'`   | Stroke line join style     |
| `fill`            | `string`  | `'none'`    | Wave fill color            |
| `opacity`         | `number`  | `1`         | Wave opacity               |
| `centerLine`      | `boolean` | `false`     | Show center reference line |
| `centerLineColor` | `string`  | `'#666'`    | Center line color          |
| `centerLineWidth` | `number`  | `1`         | Center line width          |

## Examples

### 1. Basic Beat-Synchronized Waveform

```tsx
const basicBeatSync = {
  config: {
    audioSrc: 'audio.mp3',
    numberOfSamples: 128,
    amplitude: 1.2,
  },
  strokeColor: '#FF6B6B',
  strokeWidth: 4,
  beatSync: true,
  bpm: 120,
  beatAmplitudeMultiplier: 2.0,
  beatAnimationDuration: 20,
  amplitudeCurve: 'ease-out',
  centerLine: true,
};
```

### 2. Multi-Segment Waveform with Spacing

```tsx
const multiSegmentWave = {
  config: {
    audioSrc: 'audio.mp3',
    numberOfSamples: 128,
    amplitude: 1.2,
  },
  strokeColor: '#4ECDC4',
  strokeWidth: 3,
  waveSegments: 3,
  waveSpacing: 0.15,
  waveOffset: 10,
  beatSync: true,
  beatThreshold: 0.6,
  pulseOnBeat: true,
  pulseColor: '#FFD700',
  pulseScale: 1.5,
  centerLine: true,
};
```

### 3. Vertical Waveform with Bounce Animation

```tsx
const verticalWave = {
  config: {
    audioSrc: 'audio.mp3',
    numberOfSamples: 128,
    amplitude: 1.2,
  },
  strokeColor: '#45B7D1',
  strokeWidth: 5,
  waveDirection: 'vertical',
  waveSegments: 2,
  waveSpacing: 0.2,
  beatSync: true,
  bpm: 140,
  beatAmplitudeMultiplier: 1.8,
  beatAnimationDuration: 15,
  amplitudeCurve: 'bounce',
  animationSpeed: 1.5,
  centerLine: true,
};
```

### 4. Automatic Beat Detection

```tsx
const autoBeatDetect = {
  config: {
    audioSrc: 'audio.mp3',
    numberOfSamples: 128,
    amplitude: 1.2,
  },
  strokeColor: '#96CEB4',
  strokeWidth: 6,
  waveSegments: 4,
  waveSpacing: 0.1,
  beatSync: true,
  beatThreshold: 0.5,
  beatAmplitudeMultiplier: 2.5,
  beatAnimationDuration: 25,
  amplitudeCurve: 'ease-in-out',
  pulseOnBeat: true,
  pulseColor: '#FF6B6B',
  pulseScale: 1.3,
  centerLine: true,
};
```

## Easing Functions

The component supports multiple easing functions for smooth animations:

- **`linear`**: Linear interpolation
- **`ease-in`**: Slow start, fast end
- **`ease-out`**: Fast start, slow end
- **`ease-in-out`**: Slow start and end, fast middle
- **`bounce`**: Bouncy animation effect

## Beat Detection

### Manual BPM Detection

When `bpm` is specified, the component uses precise timing based on the BPM value:

```tsx
{
  beatSync: true,
  bpm: 120, // 120 beats per minute
  beatAmplitudeMultiplier: 2.0,
}
```

### Automatic Beat Detection

When no `bpm` is specified, the component automatically detects beats based on amplitude:

```tsx
{
  beatSync: true,
  beatThreshold: 0.6, // 60% amplitude threshold
  beatAmplitudeMultiplier: 1.8,
}
```

## Performance Tips

1. **Optimize Sample Count**: Use appropriate `numberOfSamples` values (32, 64, 128, 256)
2. **Limit Wave Segments**: More segments = more processing
3. **Use Efficient Easing**: `linear` and `ease-out` are most performant
4. **Adjust Animation Duration**: Shorter durations reduce computation

## Troubleshooting

### Waveform Not Animating

- Check that `beatSync` is enabled
- Verify audio file is loading correctly
- Ensure `bpm` or `beatThreshold` is set appropriately

### Poor Beat Detection

- Adjust `beatThreshold` for better sensitivity
- Use manual `bpm` for precise timing
- Check audio quality and amplitude

### Performance Issues

- Reduce `numberOfSamples`
- Decrease `waveSegments`
- Use simpler easing functions
- Lower `beatAnimationDuration`

## API Reference

For complete API documentation, see the [API Reference](./api-reference.md).

## Contributing

Contributions are welcome! Please read our [Contributing Guide](../../../CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](../../../LICENSE) file for details.
