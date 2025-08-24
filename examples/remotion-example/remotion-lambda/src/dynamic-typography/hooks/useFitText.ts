"use client";

import { useLayoutEffect, useState, RefObject } from "react";
import { ResizeObserver } from "@juggle/resize-observer";

type FitStrategy =
  | "fill-width" // Stretches text to fill the container's width
  | "fill-height" // Stretches text to fill the container's height
  | "fit" // Fits text within bounds, preserving aspect ratio
  | "align-center" // Centers text, does not resize
  | "none"; // No fitting logic, just passes through styles

interface FitTextOptions {
  containerRef: RefObject<HTMLElement | null>;
  textRef: RefObject<HTMLElement | null>;
  strategy: FitStrategy;
}

export const useFitText = ({
  containerRef,
  textRef,
  strategy,
}: FitTextOptions) => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    if (!containerRef.current || !textRef.current || strategy === "none") {
      return;
    }

    if (strategy.startsWith("align")) {
      setStyle({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      });
      return;
    }

    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;
      const textEl = textRef.current;
      if (!textEl) return;

      const clonedNode = textEl.cloneNode(true) as HTMLElement;
      document.body.appendChild(clonedNode);
      clonedNode.style.position = "absolute";
      clonedNode.style.visibility = "hidden";
      clonedNode.style.pointerEvents = "none";
      clonedNode.style.width = "auto";
      clonedNode.style.height = "auto";
      clonedNode.style.whiteSpace = "nowrap";
      clonedNode.style.lineHeight = "1em";

      let newStyle: React.CSSProperties = {};

      if (strategy === "fill-width" || strategy === "fit") {
        let min = 1;
        let max = 2000;
        let fsWidth = min;

        while (max - min > 1) {
          const mid = Math.floor((min + max) / 2);
          clonedNode.style.fontSize = `${mid}px`;
          if (clonedNode.scrollWidth > width) {
            max = mid;
          } else {
            min = mid;
          }
        }
        fsWidth = min;

        // Apply the determined font size to measure its height
        clonedNode.style.fontSize = `${fsWidth}px`;

        if (strategy === "fit") {
          // If the text overflows the height, scale the font size down
          if (clonedNode.scrollHeight > height) {
            fsWidth *= height / clonedNode.scrollHeight;
            // Re-apply the adjusted font size for the final measurement
            clonedNode.style.fontSize = `${fsWidth}px`;
          }
        }

        const textHeight = clonedNode.scrollHeight;
        const isLarge = textHeight > height * 0.8;

        newStyle = {
          fontSize: fsWidth,
          whiteSpace: "nowrap",
          lineHeight: isLarge ? "0.8em" : "1em",
        };
      } else if (strategy === "fill-height") {
        newStyle = { fontSize: height * 0.8, lineHeight: "1em" };
      }

      document.body.removeChild(clonedNode);
      setStyle(newStyle);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef, textRef, strategy]);

  return style;
};
