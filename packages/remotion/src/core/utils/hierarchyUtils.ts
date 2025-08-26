import { VideoConfig } from 'remotion';
import {
  RenderableComponentData,
  Hierarchy,
  CalculatedTiming,
  RenderableContext,
} from '../types';
import { calculateTiming } from './timing';

/**
 * Finds a component in the root data by its ID
 */
export const findComponentById = (
  root: RenderableComponentData[] | undefined,
  targetId: string
): RenderableComponentData | null => {
  if (!root) return null;

  const search = (
    components: RenderableComponentData[]
  ): RenderableComponentData | null => {
    for (const component of components) {
      if (component.id === targetId) {
        return component;
      }

      if (component.childrenData && component.childrenData.length > 0) {
        const found = search(component.childrenData);
        if (found) return found;
      }
    }
    return null;
  };

  return search(root);
};

/**
 * Finds the parent component of a given component
 */
export const findParentComponent = (
  root: RenderableComponentData[] | undefined,
  targetId: string
): RenderableComponentData | null => {
  if (!root) return null;

  const search = (
    components: RenderableComponentData[],
    parent: RenderableComponentData | null
  ): RenderableComponentData | null => {
    for (const component of components) {
      if (component.childrenData && component.childrenData.length > 0) {
        // Check if any child is the target
        const hasTargetChild = component.childrenData.some(
          (child) => child.id === targetId
        );
        if (hasTargetChild) {
          return component;
        }

        // Recursively search in children
        const found = search(component.childrenData, component);
        if (found) return found;
      }
    }
    return null;
  };

  return search(root, null);
};

/**
 * Calculates the hierarchy for a component based on its position in the root data
 */
export const calculateHierarchy = (
  root: RenderableComponentData[] | undefined,
  componentId: string,
  currentContext?: RenderableContext
): Hierarchy => {
  if (!root) {
    return {
      depth: (currentContext?.hierarchy?.depth || 0) + 1,
      parentIds: [...(currentContext?.hierarchy?.parentIds || []), componentId],
    };
  }

  const parentIds: string[] = [];
  let depth = 0;

  const traverse = (
    components: RenderableComponentData[],
    currentDepth: number
  ): boolean => {
    for (const component of components) {
      if (component.id === componentId) {
        depth = currentDepth;
        return true;
      }

      if (component.childrenData && component.childrenData.length > 0) {
        parentIds.push(component.id);
        const found = traverse(component.childrenData, currentDepth + 1);
        if (found) return true;
        parentIds.pop(); // Remove if not found in this branch
      }
    }
    return false;
  };

  traverse(root, 0);

  return {
    depth,
    parentIds: [...parentIds],
  };
};

/**
 * Calculates timing for a component, inheriting from parent if duration is not provided
 */
export const calculateTimingWithInheritance = (
  component: RenderableComponentData,
  root: RenderableComponentData[] | undefined,
  videoConfig: VideoConfig
): CalculatedTiming => {
  const currentContext = component.context || {};
  // First, calculate basic timing
  const baseTiming = calculateTiming(
    component.type,
    currentContext,
    videoConfig
  );

  // If duration is not provided, try to inherit from parent recursively
  if (!baseTiming.durationInFrames || baseTiming.durationInFrames <= 0) {
    const findParentWithTiming = (
      targetId: string
    ): CalculatedTiming | null => {
      const parent = findParentComponent(root, targetId);
      if (!parent) return null;

      const parentContext = parent.context || {};
      const parentTiming = calculateTiming(
        parent.type,
        parentContext,
        videoConfig
      );

      if (parentTiming.durationInFrames && parentTiming.durationInFrames > 0) {
        return parentTiming;
      }

      // Recursively search for parent's parent with timing
      return findParentWithTiming(parent.id);
    };

    const inheritedTiming = findParentWithTiming(component.id);
    if (inheritedTiming) {
      return {
        ...baseTiming,
        durationInFrames: inheritedTiming.durationInFrames
          ? inheritedTiming.durationInFrames
          : inheritedTiming.duration
            ? inheritedTiming.duration * videoConfig.fps
            : 0,
        duration: inheritedTiming.duration,
      };
    }
  }

  return baseTiming;
};
