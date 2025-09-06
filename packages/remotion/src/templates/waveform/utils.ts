import { WaveformLineDataProps } from './components/WaveformLine';

export const WaveformPresets = {
  stopgapLine: (props: WaveformLineDataProps) => {
    return {
      componentId: 'WaveformLine',
      type: 'atom',
      data: {
        strokeColor: '#58C4DC',
        strokeWidth: 8,
        strokeLinecap: 'round',
        opacity: 1,
        amplitudeCurve: 'ease-in-out',
        animationSpeed: 0.15,
        smoothAnimation: true,
        ...props,
        config: {
          numberOfSamples: 64, // Increased for better frequency resolution
          windowInSeconds: 1 / 30,
          amplitude: 4,
          height: 300,
          width: 1920 * 3,
          posterize: 4,
          ...props.config,
        },
      },
    };
  },
};
