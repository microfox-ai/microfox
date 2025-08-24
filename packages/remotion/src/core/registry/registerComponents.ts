import { registerComponent } from './componentRegistry';

// Import all components
import { SceneFrame } from '../../components/frames';

// Register frame components
registerComponent('SceneFrame', SceneFrame, 'frame');
