// Import registerEffect function
import { registerEffect } from '../../core/registry';

// Import effect components for registration
import { BlurEffect, config as BlurEffectConfig } from './BlurEffect';
import { LoopEffect, config as LoopEffectConfig } from './Loop';
import { PanEffect, config as PanEffectConfig } from './Pan';
import { ZoomEffect, config as ZoomEffectConfig } from './Zoom';

// Register all effect components
registerEffect(BlurEffectConfig.displayName, BlurEffect, BlurEffectConfig);
registerEffect(LoopEffectConfig.displayName, LoopEffect, LoopEffectConfig);
registerEffect(PanEffectConfig.displayName, PanEffect, PanEffectConfig);
registerEffect(ZoomEffectConfig.displayName, ZoomEffect, ZoomEffectConfig);

// Export effect components
export { BlurEffect, config as BlurEffectConfig } from './BlurEffect';
export { LoopEffect, config as LoopEffectConfig } from './Loop';
export {
  PanEffect,
  config as PanEffectConfig,
  type PanEffectData,
} from './Pan';
export {
  ZoomEffect,
  config as ZoomEffectConfig,
  type ZoomEffectData,
} from './Zoom';
