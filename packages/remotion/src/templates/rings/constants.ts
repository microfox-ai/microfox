import { z } from 'zod';

export const COMP_NAME = 'RingsComposition';

export const RingsCompositionProps = z.object({
  title: z.string(),
});

export const defaultRingsCompositionProps: z.infer<
  typeof RingsCompositionProps
> = {
  title: 'Next.js and Remotion',
};

export const DURATION_IN_FRAMES = 200;
export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;
