import React from 'react';
import { twMerge } from "tailwind-merge";
import { generateTemplateFromText } from "./ai-generator";
import {
  AILayoutGenerationRequest,
  AILayoutGenerationRequestSchema,
  DeclarativeTemplate,
  LayoutGenerationRequest,
  LayoutGenerationRequestSchema,
  LayoutNode,
  PositioningOptions
} from "../schemas";

export type { AILayoutGenerationRequest }; // Re-export for other modules

// Note: The LayoutNode interface is defined in layout-schemas.ts
// but used implicitly by the functions here.

// --- TYPE DEFINITIONS ---

/**
 * Defines the structure for a single element in the declarative layout.
 * Can be a container or a word.
 */
export interface LayoutElement {
  id: string;
  type: 'container' | 'word';
  className?: string;
  style?: React.CSSProperties;
  content?: string;
  children: LayoutElement[];
  // Timing properties added for animation
  startTime?: number;
  endTime?: number;
}

interface LayoutOptions {
  videoWidth: number;
  videoHeight: number;
}

// --- CORE LAYOUT ENGINE ---

// Helper function to convert positioning options to Tailwind classes
function getPositioningClasses(positioning?: PositioningOptions): string {
  if (!positioning) {
    // Default: centered flex layout
    return "flex justify-center items-center";
  }

  const { horizontal, vertical, distribution = "flex" } = positioning;

  if (distribution === "grid") {
    // For grid layouts, use place-items and place-content
    const horizontalGrid = {
      left: "place-content-start",
      center: "place-content-center",
      right: "place-content-end",
      "justify-between": "place-content-between",
      "justify-around": "place-content-around",
      "justify-evenly": "place-content-evenly"
    };

    const verticalGrid = {
      top: "place-items-start",
      center: "place-items-center",
      bottom: "place-items-end",
      "justify-between": "place-items-between",
      "justify-around": "place-items-around",
      "justify-evenly": "place-items-evenly"
    };

    return `grid ${horizontalGrid[horizontal]} ${verticalGrid[vertical]}`;
  }

  // For flex layouts - improved with more dramatic positioning
  const horizontalFlex = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    "justify-between": "justify-between",
    "justify-around": "justify-around",
    "justify-evenly": "justify-evenly"
  };

  const verticalFlex = {
    top: "items-start",
    center: "items-center",
    bottom: "items-end",
    "justify-between": "items-stretch",
    "justify-around": "items-start",
    "justify-evenly": "items-end"
  };

  return `flex ${horizontalFlex[horizontal]} ${verticalFlex[vertical]}`;
}

// Preset positioning configurations for common layouts
export const POSITIONING_PRESETS = {
  CENTER: { horizontal: "center" as const, vertical: "center" as const, distribution: "flex" as const },
  TOP_LEFT: { horizontal: "left" as const, vertical: "top" as const, distribution: "flex" as const },
  TOP_CENTER: { horizontal: "center" as const, vertical: "top" as const, distribution: "flex" as const },
  TOP_RIGHT: { horizontal: "right" as const, vertical: "top" as const, distribution: "flex" as const },
  BOTTOM_LEFT: { horizontal: "left" as const, vertical: "bottom" as const, distribution: "flex" as const },
  BOTTOM_CENTER: { horizontal: "center" as const, vertical: "bottom" as const, distribution: "flex" as const },
  BOTTOM_RIGHT: { horizontal: "right" as const, vertical: "bottom" as const, distribution: "flex" as const },
  SPREAD_HORIZONTAL: { horizontal: "justify-between" as const, vertical: "center" as const, distribution: "flex" as const },
  SPREAD_VERTICAL: { horizontal: "center" as const, vertical: "justify-between" as const, distribution: "flex" as const },
  GRID_CENTER: { horizontal: "center" as const, vertical: "center" as const, distribution: "grid" as const },
} as const;

function populateTemplateWithWords(
  node: LayoutNode,
  words: string[],
  focusWord: string
): LayoutNode {
  const focusIndex = words.indexOf(focusWord);

  const beforeWords = focusIndex !== -1 ? words.slice(0, focusIndex) : [];
  const afterWords = focusIndex !== -1 ? words.slice(focusIndex + 1) : [];

  if (focusIndex === -1) {
    beforeWords.push(...words);
    focusWord = "";
  }

  // Flags to ensure each placeholder is only used once.
  let beforePlaced = false;
  let prominentPlaced = false;
  let afterPlaced = false;

  function traverseAndPopulate(currentNode: LayoutNode): LayoutNode {
    const populatedChildren = currentNode.children
      ? currentNode.children.map(traverseAndPopulate)
      : [];

    let currentContent = currentNode.content;
    if (currentNode.type === "word") {
      switch (currentNode.content) {
        case "PROMINENT_WORD":
          currentContent = !prominentPlaced ? focusWord : "";
          prominentPlaced = true;
          break;
        case "BEFORE_FOCUS":
          currentContent = !beforePlaced ? beforeWords.join(" ") : "";
          beforePlaced = true;
          break;
        case "AFTER_FOCUS":
          currentContent = !afterPlaced ? afterWords.join(" ") : "";
          afterPlaced = true;
          break;
        default:
          currentContent = "";
          break;
      }
    }

    return {
      ...currentNode,
      content: currentContent,
      children: populatedChildren,
    };
  }

  return traverseAndPopulate(node);
}

/**
 * Parses a Tailwind CSS font-size class and returns the size in pixels.
 * Note: This is a simplified parser for the text sizes used in the templates.
 * It assumes 1rem = 10px based on the base font size in the test HTML.
 */
function parseTailwindFontSize(className: string): number | null {
  const sizeMap: { [key: string]: number } = {
    'text-xs': 7.5, 'text-sm': 8.75, 'text-base': 10, 'text-lg': 11.25, 'text-xl': 12.5,
    'text-2xl': 15, 'text-3xl': 18.75, 'text-4xl': 22.5, 'text-5xl': 30,
    'text-6xl': 37.5, 'text-7xl': 45, 'text-8xl': 60, 'text-9xl': 80
  };
  for (const key in sizeMap) {
    if (className.includes(key)) return sizeMap[key];
  }
  const remMatch = className.match(/text-\[(\d+(\.\d+)?)rem\]/);
  if (remMatch) {
    return parseFloat(remMatch[1]) * 10;
  }
  return null;
}

function findFocusElement(
  element: LayoutElement,
  focusWord: string
): LayoutElement | null {
  if (element.type === "word" && element.content === focusWord) {
    return element;
  }
  if (element.children) {
    for (const child of element.children) {
      const found = findFocusElement(child, focusWord);
      if (found) return found;
    }
  }
  return null;
}

/**
 * A robust function to scale fonts proportionally to ensure the entire layout
 * fits within the container boundaries. This version focuses on scaling the
 * main focus word correctly.
 */
function scaleFontsToFit(
  rootElement: LayoutElement,
  containerWidth: number,
  containerHeight: number,
  focusWord: string
) {
  // 1. Find the element containing the focus word.
  const focusElement = findFocusElement(rootElement, focusWord);
  if (!focusElement || !focusElement.content) {
    // If no focus word is found, don't scale anything to avoid errors.
    return;
  }

  // 2. Estimate the original size of the focus word element.
  const originalFontSize = parseTailwindFontSize(focusElement.className || '') || 32; // Default size
  const estimatedWidth = focusElement.content.length * originalFontSize * 0.6; // Heuristic
  const estimatedHeight = originalFontSize * 1.2;

  // 3. Calculate scale factor to fit the focus word within the container (with a small margin).
  const availableWidth = containerWidth * 0.95;
  const availableHeight = containerHeight * 0.95;

  const widthScale =
    estimatedWidth > availableWidth ? availableWidth / estimatedWidth : 1;
  const heightScale =
    estimatedHeight > availableHeight ? availableHeight / estimatedHeight : 1;

  // 4. Use the smaller scale factor to ensure it fits both ways, and never scale up.
  const scaleFactor = Math.min(widthScale, heightScale, 1.0);

  // 5. Apply the calculated scale factor to ALL text elements in the tree.
  // This preserves the relative size differences from the original template.
  function applyScaling(element: LayoutElement) {
    if (element.type === "word") {
      const originalSize = parseTailwindFontSize(element.className || '');
      if (originalSize) {
        const scaledSize = Math.max(
          8,
          Math.floor(originalSize * scaleFactor)
        ); // Minimum 8px

        // Remove any existing text-size and leading classes
        const existingClasses = (element.className || '').split(' ').filter(c =>
          !c.startsWith('text-') && !c.startsWith('leading-')
        );

        // Add the new, calculated text-size and a fixed line-height class
        element.className = [
          ...existingClasses,
          `text-[${scaledSize}px]`,
          'leading-none'
        ].join(' ');

        // Ensure the style object is not used for font sizing
        if (element.style) {
          delete element.style.fontSize;
          delete element.style.lineHeight;
        }
      }
    }
    if (element.children) element.children.forEach(applyScaling);
  }

  applyScaling(rootElement);
}


/**
 * New function to generate a layout using an AI-generated template.
 * It calls the AI service to create a template and then uses the
 * standard dynamic layout generation process.
 */
export async function generateLayoutWithAI(
  request: AILayoutGenerationRequest, anthropicKey: string
): Promise<LayoutElement> {
  // 1. Validate the incoming request against the new AI schema
  const validatedRequest = AILayoutGenerationRequestSchema.parse(request);

  // 2. Call the AI to generate a template based on the sentence and focus word
  const aiGeneratedTemplate = await generateTemplateFromText(
    validatedRequest.sentence,
    validatedRequest.focus_word,
    anthropicKey || process.env.ANTHROPIC_API_KEY as string
  );

  // 3. Call the original layout generation function with the new template
  const fullRequest: LayoutGenerationRequest = {
    ...validatedRequest,
    reference_layout: aiGeneratedTemplate,
  };

  return generateDynamicLayout(fullRequest);
}


export function generateDynamicLayout(
  request: LayoutGenerationRequest
): LayoutElement {
  const {
    sentence,
    focus_word,
    targets,
    reference_layout,
    background_color,
    positioning,
  } = LayoutGenerationRequestSchema.parse(request);

  // 1. Populate the user's template with the words from the sentence
  const words = sentence.split(/\s+/);
  const populatedRootNode = populateTemplateWithWords(
    reference_layout.root,
    words,
    focus_word
  );
  const templateLayoutElement = nodeToElement(populatedRootNode, 'template');

  // 2. Calculate template size based on positioning
  // Account for p-4 padding (32px total) and be more conservative
  const availableWidth = targets.width - 32; // Subtract padding
  const availableHeight = targets.height - 32; // Subtract padding

  // Use smaller percentages to ensure content always fits
  const isPositioned = positioning && (positioning.horizontal !== 'center' || positioning.vertical !== 'center');
  const sizePercent = isPositioned ? 0.65 : 0.75; // More conservative sizing

  const maxTemplateWidth = Math.floor(availableWidth * sizePercent);
  const maxTemplateHeight = Math.floor(availableHeight * sizePercent);

  // 3. Scale fonts to fit the calculated container size
  scaleFontsToFit(templateLayoutElement, maxTemplateWidth, maxTemplateHeight, focus_word);

  // 4. Add size constraints to template element directly (no wrapper container)
  templateLayoutElement.style = {
    ...templateLayoutElement.style,
    width: `${maxTemplateWidth}px`,
    height: `${maxTemplateHeight}px`,
    boxSizing: 'border-box', // Include any borders/padding in dimensions
  };

  // 5. Generate positioning classes using Tailwind principles
  const positioningClasses = getPositioningClasses(positioning);

  // 6. Determine background color class or style
  let backgroundClasses = "";
  let backgroundStyle = {};

  if (background_color.startsWith('#') || background_color.startsWith('rgb') || background_color.startsWith('hsl')) {
    // Custom color - use inline style
    backgroundStyle = { backgroundColor: background_color };
  } else {
    // Assume it's a Tailwind color class
    backgroundClasses = background_color.startsWith('bg-') ? background_color : `bg-${background_color}`;
  }

  // 7. Create the main canvas element with Tailwind classes for positioning
  const canvasElement: LayoutElement = {
    id: "canvas-root",
    type: "container",
    className: twMerge(
      "w-full h-full text-white p-4", // Base classes with padding for margins
      backgroundClasses, // Background color class if applicable
      positioningClasses // Positioning classes
    ),
    style: {
      width: targets.width,
      height: targets.height,
      boxSizing: 'border-box', // Include padding in dimensions
      ...backgroundStyle, // Background color style if custom
    },
    children: [templateLayoutElement],
  };

  return canvasElement;
}

function nodeToElement(node: LayoutNode, idPrefix: string): LayoutElement {
  const id = `${idPrefix}-${node.type}`;

  const children = node.children
    ? node.children.map((child: LayoutNode, index: number) => nodeToElement(child, `${id}-${index}`))
    : [];

  // Ensure proper Tailwind class handling with twMerge
  const mergedClassName = node.className ? twMerge(node.className) : "";

  return {
    id,
    type: node.type,
    content: node.content,
    className: mergedClassName,
    style: {}, // Style is now primarily handled by Tailwind classes
    children,
  };
}

export function generateLayout(
  template: DeclarativeTemplate,
  options: LayoutOptions
): LayoutElement {
  const rootElement = nodeToElement(template.root, 'root');

  // Ensure the top-level container has the full video dimensions
  rootElement.style = {
    ...rootElement.style,
    width: options.videoWidth,
    height: options.videoHeight,
  };

  return rootElement;
}

/**
 * Convenient wrapper function to generate a layout with preset positioning
 */
export function generateLayoutWithPositioning(
  request: Omit<LayoutGenerationRequest, 'positioning'>,
  positioningPreset: keyof typeof POSITIONING_PRESETS
): LayoutElement {
  return generateDynamicLayout({
    ...request,
    positioning: POSITIONING_PRESETS[positioningPreset],
  });
}

/**
 * Generate a layout with custom positioning options
 */
export function generateLayoutWithCustomPositioning(
  request: Omit<LayoutGenerationRequest, 'positioning'>,
  positioning: PositioningOptions
): LayoutElement {
  return generateDynamicLayout({
    ...request,
    positioning,
  });
}

/**
 * @returns A JSX element ready for rendering in Remotion.
 */
export function renderLayoutToReact(element: LayoutElement): React.ReactElement {
  const { type, className, style, content, children, id } = element;

  // The style object can still be used for properties not controllable by Tailwind,
  // or for dynamic values that aren't font sizes.
  const finalStyle = style || {};

  if (type === 'word') {
    return React.createElement(
      'span',
      {
        key: id,
        style: finalStyle,
        className: className || '',
      },
      content
    );
  }

  const processedChildren = children.map((child) => {
    if (typeof child === 'string') {
      return child;
    }
    return renderLayoutToReact(child);
  });

  const Component = type === 'container' ? 'div' : 'span';

  return React.createElement(
    Component,
    {
      key: id,
      style: finalStyle,
      className: className || '',
    },
    ...processedChildren
  );
}

// Helper to get a child by its ID
export function getChildById(element: LayoutElement, id: string): LayoutElement | null {
  if (element.id === id) {
    return element;
  }
  for (const child of element.children) {
    const found = getChildById(child, id);
    if (found) return found;
  }
  return null;
}
