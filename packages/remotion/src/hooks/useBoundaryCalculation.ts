import { useMemo } from 'react';
import { BoundaryConstraints, LayoutConstraints } from '../core/types';

interface UseBoundaryCalculationProps {
  parentBoundaries: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  constraints: BoundaryConstraints;
  layout?: LayoutConstraints;
}

export const useBoundaryCalculation = ({
  parentBoundaries,
  constraints,
  layout,
}: UseBoundaryCalculationProps) => {
  return useMemo(() => {
    const { x, y, width, height } = parentBoundaries;

    // Calculate boundaries based on constraints
    const calculatedX = typeof constraints.x === 'number' ? constraints.x : x;
    const calculatedY = typeof constraints.y === 'number' ? constraints.y : y;
    const calculatedWidth =
      typeof constraints.width === 'number' ? constraints.width : width;
    const calculatedHeight =
      typeof constraints.height === 'number' ? constraints.height : height;

    return {
      x: calculatedX,
      y: calculatedY,
      width: calculatedWidth,
      height: calculatedHeight,
      zIndex: constraints.zIndex || 0,
    };
  }, [parentBoundaries, constraints, layout]);
};
