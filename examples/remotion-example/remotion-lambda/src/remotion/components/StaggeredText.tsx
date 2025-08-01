import React from "react";
import { AnimatedText, AnimatedTextProps } from "./AnimatedText";

// Define the props for our new component.
// It uses Omit<> to inherit all props from AnimatedText except 'text',
// which we are redefining to be a full sentence.
interface StaggeredTextProps extends Omit<AnimatedTextProps, 'x' | 'y'> {
  staggerDelay?: number;
  x?: number | string;
  y?: number | string;
}

export const StaggeredText: React.FC<StaggeredTextProps> = ({
  text,
  staggerDelay = 5, // Default to a 5-frame delay between words
  x,
  y,
  ...props // This captures the rest of the props (animationType, color, etc.)
}) => {
  // 1. Split the input sentence into an array of words.
  const words = text.split(" ");

  // A small utility to add a consistent space after each word.
  // We base the space's width on the font size for scalability.
  const spaceWidth = (props.fontSize ?? 80) * 0.3;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    justifyContent: "center",
    position: "absolute",
    left: x ?? '50%',
    top: y ?? '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
  };

  return (
    // 2. Use a flexbox container to handle the layout automatically.
    <div style={containerStyle}>
      {words.map((word, index) => {
        return (
          <div key={index} style={{ display: "inline-flex", alignItems: "baseline" }}>
            {/* 3. Each word animates with its own delay, but all are present in the layout */}
            <AnimatedText
              {...props}
              text={word}
              delayInFrames={index * staggerDelay}
            />
            {/* Add a space for all but the last word */}
            {index < words.length - 1 && <div style={{ width: spaceWidth }} />}
          </div>
        );
      })}
    </div>
  );
}; 