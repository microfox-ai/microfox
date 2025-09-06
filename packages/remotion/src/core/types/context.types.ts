export interface BoundaryConstraints {
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  zIndex?: number;
}

export interface TimingConstraints {
  startFrame?: number;
  durationFrames?: number;
  delay?: number;
}

export interface LayoutConstraints {
  alignment?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'center-left'
    | 'center'
    | 'center-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  padding?: number;
  spacing?: number;
  columns?: number;
  rows?: number;
}

import { RenderableComponentData } from './renderable.types';

export interface CompositionContext {
  childrenData?: RenderableComponentData[];
  width: number;
  height: number;
  duration: number;
  fps: number;
  currentFrame: number;
}
