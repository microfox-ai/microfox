import { VideoConfig } from 'remotion';
import { CalculatedTiming, ComponentType, RenderableContext } from '../types';

export const calculateTiming = (
  type: ComponentType,
  context: RenderableContext,
  videoConfig: VideoConfig
) => {
  let newTiming: CalculatedTiming;
  if (type !== 'atom' && context?.timing) {
    const { start = 0, duration = 0 } = context.timing;
    newTiming = {
      startInFrames: Math.round(
        context.timing?.startInFrames
          ? context.timing.startInFrames
          : type === 'scene'
            ? start * videoConfig.fps
            : start * videoConfig.fps
      ),
      durationInFrames: Math.round(
        context.timing?.durationInFrames
          ? context.timing.durationInFrames
          : type === 'scene'
            ? duration * videoConfig.fps
            : duration * videoConfig.fps
      ),
      duration: duration,
      start: start,
    };
  } else {
    newTiming = {
      startInFrames: context.timing?.startInFrames
        ? context.timing.startInFrames
        : context.timing?.start
          ? Math.round(videoConfig.fps * (context.timing.start || 0))
          : 0,
      durationInFrames: Math.round(
        context.timing?.durationInFrames
          ? context.timing.durationInFrames
          : context.timing?.duration
            ? Math.round(videoConfig.fps * (context.timing.duration || 0))
            : 0
      ),
      duration: context.timing?.duration,
      start: context.timing?.start,
    };
  }
  return newTiming;
};
