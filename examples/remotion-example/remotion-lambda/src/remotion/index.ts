import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);

// Export all text animation components for easy importing
export { AnimatedText } from "./components/AnimatedText";
export type { AnimatedTextProps, CustomAnimationFunction } from "./components/AnimatedText";

export { StaggeredText } from "./components/StaggeredText";

export type { CaptionEntry, WordEntry } from "./components/AudioSyncedText";

// Export waveform overlay component
export { WaveformOverlay } from "./components/WaveformOverlay";
export type { WaveformOverlayProps } from "./components/WaveformOverlay";
