import {
  AtomData,
  LayoutConstraints,
  LayoutInstance,
} from "@/components/test/layouts/dynamic-typography/primitives/types";
import { Sentence, Word } from "@/hooks/use-audio-stream";
import { Font } from "@microfox/fontuse";
import { FontPairing } from "../primitives/font-primitives";

const getRandomElement = <T>(arr: T[]): T | undefined => {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
};

const layoutGenerators: {
  [key: string]: (
    sentence: Sentence,
    fontPairing: {
      main?: Font;
      pairing?: Font;
    },
    atomStyles: string[]
  ) => AtomData[];
} = {
  // "vertical-fill" is now handled dynamically in its own component
};

export const generateLayout = (
  sentence: Sentence,
  layoutStyles: string[],
  fontPairing: FontPairing,
  atomStyles: string[],
  constraints: LayoutConstraints
): LayoutInstance | null => {
  if (!sentence || sentence.words.length === 0) return null;

  const layoutId = getRandomElement(layoutStyles);
  if (!layoutId) return null;

  const generator = layoutGenerators[layoutId];

  if (!generator && layoutId !== "vertical-fill") {
    console.warn(`No layout generator found for layoutId: ${layoutId}`);
    return null;
  }

  const content = generator ? generator(sentence, fontPairing, atomStyles) : [];

  return {
    id: `layout-${sentence.id}`,
    layoutId,
    content,
    constraints,
    style: {
      padding: "0px",
    },
    placement: { x: 0, y: 0, width: 0, height: 0 },
    sentence,
    fontPairing,
    atomStyles,
  };
};
