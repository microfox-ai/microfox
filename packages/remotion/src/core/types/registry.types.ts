import { ComponentType } from './renderable.types';
import { BaseRenderableProps } from './renderable.types';

export interface ComponentConfig {
  displayName: string;
  type?: ComponentType;
  isInnerSequence?: boolean;
  // Component-specific configuration
  [key: string]: any;
}

export interface ComponentRegistry {
  [key: string]: {
    component: React.ComponentType<BaseRenderableProps>;
    config: ComponentConfig;
  };
}

export interface RegistryEntry {
  type: ComponentType;
  component: React.ComponentType<BaseRenderableProps>;
  config: ComponentConfig;
  package?: string;
}

export interface PackageRegistry {
  [packageName: string]: {
    [componentName: string]: {
      component: React.ComponentType<BaseRenderableProps>;
      config: ComponentConfig;
    };
  };
}
