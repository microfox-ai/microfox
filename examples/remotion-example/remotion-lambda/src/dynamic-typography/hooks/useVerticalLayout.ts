import { useState, useLayoutEffect, useCallback } from "react";
import { AtomData } from "../primitives/types";
import { Sentence, Word } from "@/hooks/use-audio-stream";
import { FontPairing, getFontFamily } from "../primitives/font-primitives";
import { useFontLoader } from "@/hooks/use-font-loader";

interface UseVerticalLayoutParams {
  sentence: Sentence;
  fontPairing: FontPairing;
  containerWidth: number;
  containerHeight: number;
  atomStyles?: string[];
}

const measureText = (
  text: string,
  style: React.CSSProperties
): { width: number; height: number } => {
  if (typeof document === "undefined") return { width: 0, height: 0 };
  const element = document.createElement("div");
  document.body.appendChild(element);
  Object.assign(element.style, {
    position: "absolute",
    visibility: "hidden",
    pointerEvents: "none",
    width: "auto",
    height: "auto",
    whiteSpace: "nowrap",
    ...style,
  });
  element.textContent = text;
  const dimensions = {
    width: element.scrollWidth,
    height: element.scrollHeight,
  };
  document.body.removeChild(element);
  return dimensions;
};

const getRandomElement = <T>(arr: T[]): T | undefined => {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
};

export const useVerticalLayout = ({
  sentence,
  fontPairing,
  containerWidth,
  containerHeight,
  atomStyles = ["default"],
}: UseVerticalLayoutParams) => {
  const [layout, setLayout] = useState<{
    lines: AtomData[][];
    contentHeight: number;
  }>({ lines: [], contentHeight: 0 });
  const { loadFonts, areFontsReady } = useFontLoader();

  useLayoutEffect(() => {
    const fontIds = [fontPairing.main.id];
    if (fontPairing.sub) fontIds.push(fontPairing.sub.id);
    loadFonts(fontIds);
  }, [fontPairing, loadFonts]);

  useLayoutEffect(() => {
    const calculateLayout = () => {
      const requiredFontIds = [fontPairing.main.id];
      if (fontPairing.sub) requiredFontIds.push(fontPairing.sub.id);

      if (
        containerWidth <= 1 ||
        containerHeight <= 1 ||
        sentence.words.length === 0 ||
        !areFontsReady(requiredFontIds)
      ) {
        setLayout({ lines: [], contentHeight: 0 });
        return;
      }

      // 1. Select hero word based on duration
      const heroWord = sentence.words.reduce(
        (l, c) => (c.duration > l.duration ? c : l),
        sentence.words[0]!
      );

      if (!heroWord) {
        setLayout({ lines: [], contentHeight: 0 });
        return;
      }
      const heroWordIndex = sentence.words.findIndex(
        (w) => w.start === heroWord.start && w.text === heroWord.text
      );

      // 2. Group words into pre-hero, hero, and post-hero sections
      const preHeroWords = sentence.words.slice(0, heroWordIndex);
      const postHeroWords = sentence.words.slice(heroWordIndex + 1);

      let heroLineWords: Word[] = [heroWord];
      let remainingPreWords = preHeroWords;
      let remainingPostWords = postHeroWords;

      // 3. Combine short pre/post sections into the hero line
      const preHeroChars = preHeroWords.map((w) => w.text).join("").length;
      const heroChars = heroWord.text.length;
      if (preHeroChars > 0 && preHeroChars < heroChars) {
        heroLineWords = [...preHeroWords, ...heroLineWords];
        remainingPreWords = [];
      }

      const postHeroChars = postHeroWords.map((w) => w.text).join("").length;
      if (postHeroChars > 0 && postHeroChars < heroChars) {
        heroLineWords = [...heroLineWords, ...postHeroWords];
        remainingPostWords = [];
      }

      const heroLineTextContent = heroLineWords.map((w) => w.text).join("");
      const remainingPreTextContent = remainingPreWords
        .map((w) => w.text)
        .join("");
      const remainingPostTextContent = remainingPostWords
        .map((w) => w.text)
        .join("");

      if (
        heroLineTextContent.length < 4 &&
        (remainingPreTextContent.length >= heroLineTextContent.length ||
          remainingPostTextContent.length >= heroLineTextContent.length)
      ) {
        // Hero line is too short and not justified by even shorter other lines.
        // Dissolve it and treat all words as sub words.
        remainingPreWords = sentence.words;
        heroLineWords = [];
        remainingPostWords = [];
      }

      const mainFontFamily = getFontFamily(fontPairing.main);
      const subFontFamily = fontPairing.sub
        ? getFontFamily(fontPairing.sub)
        : mainFontFamily;
      const subFontTempStyle = { fontFamily: subFontFamily, fontSize: "10px" };

      // Helper to break a list of words into lines based on container width
      const breakWordsIntoLines = (words: Word[]): Word[][] => {
        if (!words.length) return [];
        const lines: Word[][] = [];
        let currentLine: Word[] = [];
        for (const word of words) {
          const testLineText = [...currentLine, word]
            .map((w) => w.text)
            .join(" ");
          const { width } = measureText(testLineText, subFontTempStyle);
          const relativeWidth = (width / 10) * 24; // Rough estimation

          if (relativeWidth > containerWidth && currentLine.length > 0) {
            lines.push(currentLine);
            currentLine = [word];
          } else {
            currentLine.push(word);
          }
        }
        if (currentLine.length > 0) lines.push(currentLine);
        return lines;
      };

      // 4. Construct the final lines of words
      const linesOfWords: Word[][] = [
        ...breakWordsIntoLines(remainingPreWords),
        ...(heroLineWords.length > 0 ? [heroLineWords] : []),
        ...breakWordsIntoLines(remainingPostWords),
      ];
      const heroLineText = heroLineWords.map((w) => w.text).join(" ");

      // 5. Calculate styles for each line and generate AtomData
      const atomsByLine: AtomData[][] = [];
      let totalHeight = 0;

      linesOfWords.forEach((lineWords, lineIndex) => {
        const lineText = lineWords.map((w) => w.text).join(" ");
        const isHeroLine =
          heroLineWords.length > 0 &&
          lineWords[0] === heroLineWords[0] &&
          lineText === heroLineText;

        const fontFamily = isHeroLine ? mainFontFamily : subFontFamily;

        let bestFontSize = 0;
        let minFont = 1,
          maxFont = 300;
        for (let i = 0; i < 8; i++) {
          const midFont = (minFont + maxFont) / 2;
          const { width } = measureText(lineText, {
            fontFamily,
            fontSize: `${midFont}px`,
          });
          if (width <= containerWidth) {
            bestFontSize = midFont;
            minFont = midFont;
          } else {
            maxFont = midFont;
          }
        }

        const finalStyle = {
          fontFamily,
          fontSize: `${bestFontSize}px`,
          textTransform: "uppercase" as const,
          lineHeight: lineWords.length === 1 ? "1em" : "1.25em",
          color: "white",
        };
        const { height: lineHeight } = measureText(lineText, finalStyle);
        totalHeight += lineHeight;

        const atomLine = lineWords.map((word, wordIndex) => ({
          id: `${sentence.id}-${lineIndex}-${wordIndex}`,
          text: word.text.trim(),
          component: getRandomElement(atomStyles) || "default",
          as: "span" as const,
          style: { ...finalStyle },
          timing: {
            delay: word.start - sentence.start - 0.1,
            duration:
              lineWords.length === 1
                ? word.duration
                : word.duration > 0.4
                  ? word.duration
                  : 0.1,
          },
        }));
        atomsByLine.push(atomLine);
      });

      setLayout({ lines: atomsByLine, contentHeight: totalHeight });
    };

    calculateLayout();
  }, [
    sentence,
    fontPairing,
    containerWidth,
    containerHeight,
    areFontsReady,
    atomStyles,
  ]);

  return layout;
};
