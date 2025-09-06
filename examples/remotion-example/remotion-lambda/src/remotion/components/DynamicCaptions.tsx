import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AIEnhancedCaption, Word } from "../../core/schemas";
import { RecursiveLayoutRenderer, LayoutElement } from "./ai/RecursiveLayoutRenderer";

interface DynamicCaptionsProps {
  captions: AIEnhancedCaption[];
}

export const DynamicCaptions: React.FC<DynamicCaptionsProps> = ({
  captions,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  const activeCaption = captions.find(
    (caption) => currentTime >= caption.startTime && currentTime < caption.endTime
  );

  if (!activeCaption) {
    return null;
  }

  const timedLayout = enrichLayoutWithTimings(
    activeCaption.layout.root,
    activeCaption.words
  );

  return (
    <AbsoluteFill>
      <RecursiveLayoutRenderer element={timedLayout} />
    </AbsoluteFill>
  );
};

function enrichLayoutWithTimings(
  layoutNode: any,
  words: Word[]
): LayoutElement {
  let wordIndex = 0;

  function traverse(node: LayoutElement): LayoutElement {
    if (node?.type === "word" && node?.content) {
      const nodeWords = node?.content?.split(/\s+/)?.filter(Boolean);
      if (nodeWords?.length > 1) {
        const newChildren = nodeWords.reduce(
          (acc: LayoutElement[], wordText: string) => {
            const wordData = words[wordIndex];
            if (
              wordData &&
              wordData?.word?.toLowerCase() === wordText?.toLowerCase()
            ) {
              acc.push({
                id: `${node?.id}-${wordData?.word}-${wordIndex}`,
                type: "word" as const,
                content: wordData?.word,
                className: "",
                style: {},
                children: [],
                startTime: wordData?.startTime,
                endTime: wordData?.endTime,
              });
            } else {
              console.warn(
                `Mismatch or index out of bounds: layout word "${wordText}", caption word "${
                  wordData?.word
                }"`
              );
            }
            wordIndex++;
            return acc;
          },
          []
        );

        return { ...node, children: newChildren, content: undefined };
      } else if (nodeWords?.length === 1) {
        const wordData = words[wordIndex];
        if (
          wordData &&
          wordData?.word?.toLowerCase() === nodeWords[0]?.toLowerCase()
        ) {
          wordIndex++;
          return {
            ...node,
            startTime: wordData?.startTime,
            endTime: wordData?.endTime,
          };
        }
      }
    } else if (node?.children) {
      return {
        ...node,
        children: node?.children?.map(traverse),
      };
    }

    return node;
  }
  return traverse(layoutNode);
} 