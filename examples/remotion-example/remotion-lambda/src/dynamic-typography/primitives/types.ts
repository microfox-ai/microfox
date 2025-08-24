import { TargetAndTransition, Transition, VariantLabels } from "framer-motion";
import { Sentence } from "@/hooks/use-audio-stream";
import { FontPairing } from "./font-primitives";

export interface StyleConfig {
  [key: string]: any;
}

export type MotionTransition = Transition;

export interface AnimationConfig {
  initial?: VariantLabels | TargetAndTransition;
  animate?: VariantLabels | TargetAndTransition;
  exit?: VariantLabels | TargetAndTransition;
  whileHover?: VariantLabels | TargetAndTransition;
  transition?: MotionTransition;
}

export interface AtomData {
  id: string;
  text: string;
  // NEW: Specifies which registered component to render.
  component: string;
  as?: "div" | "p" | "span";
  style?: StyleConfig;
  animation?: AnimationConfig;
  timing?: MotionTransition;
}

// NEW: Props that every custom atom component MUST accept.
export interface BaseAtomProps {
  data: AtomData;
  // Layout-driven style overrides (e.g., from useFitText)
  overrideStyle?: React.CSSProperties;
  // Layout-driven animation overrides (e.g., for staggering delays)
  timing?: MotionTransition;
  // A ref for the layout to measure the element.
  ref?: React.ForwardedRef<HTMLElement>;
}

// NEW: Defining the structure for layout systems

export type LayoutAlignment =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "left-edge"
  | "right-edge"
  | "top-edge"
  | "bottom-edge";

export interface LayoutConstraints {
  alignment: LayoutAlignment;
  minWidth?: string; // e.g., '30em', '40%'
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
}

export interface LayoutPlacement {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LayoutInstance {
  id: string;
  layoutId: string; // Key to lookup in layoutRegistry
  content: AtomData[];
  constraints: LayoutConstraints;
  style?: React.CSSProperties;
  placement: LayoutPlacement; // Calculated by the Frame
  // New properties for dynamic layouts
  sentence: Sentence;
  fontPairing: FontPairing;
  atomStyles: string[];
}

export interface BaseLayoutProps {
  content: AtomData[];
  // New properties for dynamic layouts
  sentence: Sentence;
  fontPairing: FontPairing;
  atomStyles?: string[];
}
