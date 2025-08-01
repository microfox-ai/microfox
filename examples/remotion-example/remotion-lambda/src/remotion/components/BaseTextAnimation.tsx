import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface BaseTextAnimationProps {
  text: string;
  fontSize: number;
  color: string;
  backgroundColor: "white" | "black" | "transparent";
}

export const BaseTextAnimation: React.FC<BaseTextAnimationProps> = ({
  text,
  fontSize,
  color,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();

  // Simple fade in animation
  const opacity = interpolate(
    frame,
    [0, 30],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Simple scale animation
  const scale = interpolate(
    frame,
    [0, 30],
    [0.8, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Get the background style based on the backgroundColor prop
  const getBackgroundStyle = () => {
    switch (backgroundColor) {
      case "white":
        return { backgroundColor: "white" };
      case "black":
        return { backgroundColor: "black" };
      case "transparent":
        // Create a checkered pattern to show transparency
        return {
          backgroundColor: "transparent",
          backgroundImage: `
            linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
            linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
            linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
          `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px"
        };
      default:
        return { backgroundColor: "white" };
    }
  };

  return (
    <AbsoluteFill 
      className="items-center justify-center"
      style={getBackgroundStyle()}
    >
      <div
        className="text-center font-bold"
        style={{
          fontSize: `${fontSize}px`,
          color,
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
}; 