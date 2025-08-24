// Export all atom components
export { Atom as ShapeAtom, config as ShapeAtomConfig } from './ShapeAtom';
export { Atom as ImageAtom, config as ImageAtomConfig } from './ImageAtom';
export { Atom as TextAtom, config as TextAtomConfig } from './TextAtom';
export { Atom as VideoAtom, config as VideoAtomConfig } from './VideoAtom';
export { Atom as AudioAtom, config as AudioAtomConfig } from './AudioAtom';
export {
  Atom as TextAtomWithFonts,
  config as TextAtomWithFontsConfig,
  type TextAtomDataWithFonts,
} from './TextAtomWithFonts';

// Import registerComponent function
import { registerComponent } from '../../core/registry';

// Import components for registration
import { Atom as ShapeAtom, config as ShapeAtomConfig } from './ShapeAtom';
import { Atom as ImageAtom, config as ImageAtomConfig } from './ImageAtom';
import { Atom as TextAtom, config as TextAtomConfig } from './TextAtom';
import { Atom as VideoAtom, config as VideoAtomConfig } from './VideoAtom';
import { Atom as AudioAtom, config as AudioAtomConfig } from './AudioAtom';
import {
  Atom as TextAtomWithFonts,
  config as TextAtomWithFontsConfig,
} from './TextAtomWithFonts';

// Register all atom components using their displayName as the ID
registerComponent(
  ShapeAtomConfig.displayName,
  ShapeAtom,
  'atom',
  ShapeAtomConfig
);
registerComponent(
  ImageAtomConfig.displayName,
  ImageAtom,
  'atom',
  ImageAtomConfig
);
registerComponent(TextAtomConfig.displayName, TextAtom, 'atom', TextAtomConfig);
registerComponent(
  VideoAtomConfig.displayName,
  VideoAtom,
  'atom',
  VideoAtomConfig
);
registerComponent(
  AudioAtomConfig.displayName,
  AudioAtom,
  'atom',
  AudioAtomConfig
);
registerComponent(
  TextAtomWithFontsConfig.displayName,
  TextAtomWithFonts,
  'atom',
  TextAtomWithFontsConfig
);
