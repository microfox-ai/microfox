import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export type CustomAnimationFunction = (progress: number) => React.CSSProperties;

export interface AnimatedTextProps {
  text: string;
  animationType?:
    | 'fade-in'
    | 'slide-in-from-left'
    | 'slide-in-from-right'
    | 'slide-in-from-top'
    | 'slide-in-from-bottom'
    | 'scale-in'
    | 'bounce-in'
    | 'rotate-in';
  customAnimation?: CustomAnimationFunction;
  x?: number;
  y?: number;
  className?: string;
  delayInFrames?: number;
  durationInFrames?: number;
  animationFrame?: number;
}

const useFadeInAnimation = (progress: number): React.CSSProperties => ({
  opacity: interpolate(progress, [0, 1], [0, 1]),
});

const useSlideInFromLeftAnimation = (
  progress: number
): React.CSSProperties => ({
  opacity: interpolate(progress, [0, 1], [0, 1]),
  transform: `translateX(${interpolate(progress, [0, 1], [-100, 0])}px)`,
});

const useSlideInFromRightAnimation = (
  progress: number
): React.CSSProperties => ({
  opacity: interpolate(progress, [0, 1], [0, 1]),
  transform: `translateX(${interpolate(progress, [0, 1], [100, 0])}px)`,
});

const useSlideInFromTopAnimation = (progress: number): React.CSSProperties => ({
  opacity: interpolate(progress, [0, 1], [0, 1]),
  transform: `translateY(${interpolate(progress, [0, 1], [-100, 0])}px)`,
});

const useSlideInFromBottomAnimation = (
  progress: number
): React.CSSProperties => ({
  opacity: interpolate(progress, [0, 1], [0, 1]),
  transform: `translateY(${interpolate(progress, [0, 1], [100, 0])}px)`,
});

const useScaleInAnimation = (progress: number): React.CSSProperties => ({
  opacity: interpolate(progress, [0, 1], [0, 1]),
  transform: `scale(${interpolate(progress, [0, 1], [0, 1])})`,
});

const useBounceInAnimation = (progress: number): React.CSSProperties => {
  const bounceScale = interpolate(
    progress,
    [0, 0.5, 0.8, 1],
    [0, 1.2, 0.9, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return {
    opacity: interpolate(progress, [0, 0.3], [0, 1]),
    transform: `scale(${bounceScale})`,
  };
};

const useRotateInAnimation = (progress: number): React.CSSProperties => ({
  opacity: interpolate(progress, [0, 1], [0, 1]),
  transform: `rotate(${interpolate(progress, [0, 1], [180, 0])}deg) scale(${interpolate(progress, [0, 1], [0.5, 1])})`,
});

export const AnimatedText: React.FC<AnimatedTextProps> = (props) => {
  const {
    text,
    animationType = 'fade-in',
    customAnimation,
    x,
    y,
    delayInFrames = 0,
    durationInFrames = 60,
    animationFrame,
    className,
  } = props;

  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Use the override if provided, otherwise use the composition's current frame
  const frame = animationFrame !== undefined ? animationFrame : currentFrame;

  // Apply delay to the animation
  const adjustedFrame = Math.max(0, frame - delayInFrames);

  // 1. A spring-based progress value that drives all animations.
  const animationProgress = spring({
    frame: adjustedFrame,
    fps,
    durationInFrames,
    config: {
      damping: 200,
      stiffness: 150,
    },
  });

  // 2. The HYBRID LOGIC: Prioritize custom animations, otherwise use built-ins.
  const animationStyle = useMemo(() => {
    if (customAnimation) {
      return customAnimation(animationProgress);
    }

    switch (animationType) {
      case 'slide-in-from-left':
        return useSlideInFromLeftAnimation(animationProgress);
      case 'slide-in-from-right':
        return useSlideInFromRightAnimation(animationProgress);
      case 'slide-in-from-top':
        return useSlideInFromTopAnimation(animationProgress);
      case 'slide-in-from-bottom':
        return useSlideInFromBottomAnimation(animationProgress);
      case 'scale-in':
        return useScaleInAnimation(animationProgress);
      case 'bounce-in':
        return useBounceInAnimation(animationProgress);
      case 'rotate-in':
        return useRotateInAnimation(animationProgress);
      case 'fade-in':
      default:
        return useFadeInAnimation(animationProgress);
    }
  }, [animationType, customAnimation, animationProgress]);

  // 3. Determine positioning based on props
  const useAbsolutePosition = x !== undefined || y !== undefined;

  const positionStyle: React.CSSProperties = useAbsolutePosition
    ? {
        position: 'absolute',
        left: x ?? '50%',
        top: y ?? '50%',
        // Combine transforms carefully
        transform:
          `translate(-50%, -50%) ${animationStyle.transform || ''}`.trim(),
      }
    : {};

  // 4. Merge all styles together
  const finalStyle: React.CSSProperties = {
    ...positionStyle,
    ...animationStyle,
  };

  return (
    <div style={finalStyle} className={className}>
      {text}
    </div>
  );
};
