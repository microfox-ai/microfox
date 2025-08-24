import { useMemo } from 'react';
import { componentRegistry } from '../core/registry';

export const useComponentRegistry = () => {
  return useMemo(() => {
    return {
      registerComponent:
        componentRegistry.registerComponent.bind(componentRegistry),
      registerPackage:
        componentRegistry.registerPackage.bind(componentRegistry),
      getComponent: componentRegistry.getComponent.bind(componentRegistry),
      getAllComponents:
        componentRegistry.getAllComponents.bind(componentRegistry),
    };
  }, []);
};
