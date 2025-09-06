import {
  CalculatedBoundaries,
  CalculatedTiming,
  RenderableContext,
} from '../core/types';

export const createRootContext = (
  width: number,
  height: number,
  duration: number,
  fps: number
): RenderableContext => {
  return {
    boundaries: {
      left: 0,
      top: 0,
      width,
      height,
      zIndex: 0,
    },
    timing: {
      startInFrames: 0,
      durationInFrames: duration,
    },
    hierarchy: {
      depth: 0,
      parentIds: [],
    },
  };
};

export const mergeContexts = (
  parent: RenderableContext,
  child: Partial<RenderableContext>
): RenderableContext => {
  return {
    boundaries: {
      ...parent.boundaries,
      ...child.boundaries,
    } as CalculatedBoundaries,
    timing: { ...parent.timing, ...child.timing } as CalculatedTiming,
    hierarchy: {
      depth: (parent.hierarchy?.depth || 0) + 1,
      parentIds: [...(parent.hierarchy?.parentIds || []), 'root'] as string[],
    },
  };
};
