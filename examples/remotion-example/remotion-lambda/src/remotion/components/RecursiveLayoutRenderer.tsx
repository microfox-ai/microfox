import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { AnimatedText } from './AnimatedText';

export interface LayoutElement {
  id: string;
  type: "container" | "word";
  content?: string;
  className: string;
  style: React.CSSProperties;
  children: LayoutElement[];
  startTime?: number;
  endTime?: number;
}

interface RecursiveLayoutRendererProps {
  element: LayoutElement;
}

export const RecursiveLayoutRenderer: React.FC<RecursiveLayoutRendererProps> = ({ element }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { type, content, className, style, children, startTime } = element;

  const renderType = type === 'word' && children && children.length > 0 ? 'container' : type;

  const elementStyle: React.CSSProperties = {
    ...style,
  };

  if (renderType === 'word' && content) {
    const delay = (startTime || 0) * fps;
    
    return (
      <AnimatedText
        text={content}
        animationType="fade-in"
        delayInFrames={delay}
        durationInFrames={15}
        fontSize={parseInt(elementStyle.fontSize as string) || undefined}
        fontFamily={elementStyle.fontFamily}
        fontWeight={elementStyle.fontWeight as any}
        color={elementStyle.color}
        className={className}
      />
    );
  }

  if (renderType === 'container') {
    return (
      <div style={elementStyle} className={className}>
        {children.map((child) => (
          <RecursiveLayoutRenderer key={child.id} element={child} />
        ))}
      </div>
    );
  }

  return null;
}; 