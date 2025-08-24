import { registerComponent } from '../../core';
import { NextjsLogo, nextjsLogoConfig } from './NextjsLogo';
import { Rings, ringsConfig } from './Rings';
import { RippleOutLayout, rippleOutLayoutConfig } from './RippleOutLayout';
import { TextFade, textFadeConfig } from './TextFade';

export * from './NextjsLogo';
export * from './Rings';
export * from './RippleOutLayout';
export * from './TextFade';

registerComponent(
  nextjsLogoConfig.displayName,
  NextjsLogo,
  'atom',
  nextjsLogoConfig
);
registerComponent(
  textFadeConfig.displayName,
  TextFade,
  'layout',
  textFadeConfig
);
registerComponent(ringsConfig.displayName, Rings, 'atom', ringsConfig);
registerComponent(
  rippleOutLayoutConfig.displayName,
  RippleOutLayout,
  'layout',
  rippleOutLayoutConfig
);
