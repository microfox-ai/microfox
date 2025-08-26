import {
  ComponentRegistry,
  RegistryEntry,
  PackageRegistry,
  ComponentConfig,
} from '../types';

class ComponentRegistryManager {
  private registry: ComponentRegistry = {};
  private packageRegistry: PackageRegistry = {};

  registerComponent(
    name: string,
    component: React.ComponentType<any>,
    type: 'frame' | 'layout' | 'atom',
    config: ComponentConfig = { displayName: '' },
    packageName?: string
  ): void {
    this.registry[name] = { component, config };

    if (packageName) {
      if (!this.packageRegistry[packageName]) {
        this.packageRegistry[packageName] = {};
      }
      this.packageRegistry[packageName][name] = { component, config };
    }
  }

  registerEffect(
    name: string,
    component: React.ComponentType<any>,
    config: ComponentConfig = { displayName: '' },
    packageName?: string
  ): void {
    // Effects are registered as layout components since they use the same rendering logic
    this.registerComponent(
      name?.includes('effect-') ? name : `effect-${name}`,
      component,
      'layout',
      config,
      packageName
    );
  }

  getComponent(name: string): React.ComponentType<any> | undefined {
    return this.registry[name]?.component;
  }

  getComponentConfig(name: string): ComponentConfig | undefined {
    return this.registry[name]?.config;
  }

  getComponentWithConfig(
    name: string
  ):
    | { component: React.ComponentType<any>; config: ComponentConfig }
    | undefined {
    return this.registry[name];
  }

  registerPackage(
    packageName: string,
    components: Record<
      string,
      { component: React.ComponentType<any>; config: ComponentConfig }
    >
  ): void {
    this.packageRegistry[packageName] = components;

    // Register each component with package prefix
    Object.entries(components).forEach(([name, { component, config }]) => {
      this.registry[`${packageName}:${name}`] = { component, config };
    });
  }

  getPackageComponents(
    packageName: string
  ):
    | Record<
        string,
        { component: React.ComponentType<any>; config: ComponentConfig }
      >
    | undefined {
    return this.packageRegistry[packageName];
  }

  getAllComponents(): ComponentRegistry {
    return { ...this.registry };
  }

  clear(): void {
    this.registry = {};
    this.packageRegistry = {};
  }
}

export const componentRegistry = new ComponentRegistryManager();

// Convenience functions
export const registerComponent = (
  name: string,
  component: React.ComponentType<any>,
  type: 'frame' | 'layout' | 'atom',
  config: ComponentConfig = { displayName: '' },
  packageName?: string
) => {
  componentRegistry.registerComponent(
    name,
    component,
    type,
    config,
    packageName
  );
};

export const registerEffect = (
  name: string,
  component: React.ComponentType<any>,
  config: ComponentConfig = { displayName: '' },
  packageName?: string
) => {
  componentRegistry.registerEffect(name, component, config, packageName);
};

export const registerPackage = (
  packageName: string,
  components: Record<
    string,
    { component: React.ComponentType<any>; config: ComponentConfig }
  >
) => {
  componentRegistry.registerPackage(packageName, components);
};

export const getComponent = (name: string) =>
  componentRegistry.getComponent(name);

export const getComponentConfig = (name: string) =>
  componentRegistry.getComponentConfig(name);

export const getComponentWithConfig = (name: string) =>
  componentRegistry.getComponentWithConfig(name);
