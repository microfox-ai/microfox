import { registerComponent } from '../../core/registry/componentRegistry';
import { Layout as BaseLayout, config as BaseLayoutConfig } from './BaseLayout';

export { Layout as BaseLayout, config as BaseLayoutConfig } from './BaseLayout';

// Register layout components
registerComponent(
  BaseLayoutConfig.displayName,
  BaseLayout,
  'layout',
  BaseLayoutConfig
);
