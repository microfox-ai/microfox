# @microfox/remotion API Documentation

## Overview

`@microfox/remotion` provides a recursive composition system for Remotion with a unified component architecture. This document covers all the public APIs and their usage.

## Core Components

### Composition

The main composition component that renders a collection of renderable components.

```typescript
import { Composition } from '@microfox/remotion';

interface CompositionProps {
  components: RenderableComponentData[];
  width: number;
  height: number;
  duration: number;
  fps: number;
  style?: React.CSSProperties;
}
```

**Example:**

```typescript
<Composition
  components={components}
  width={1920}
  height={1080}
  duration={30}
  fps={30}
/>
```

### SimpleComposition

A simplified composition component for quick setup.

```typescript
import { SimpleComposition } from '@microfox/remotion';

interface SimpleCompositionProps {
  width?: number; // Default: 1920
  height?: number; // Default: 1080
  duration?: number; // Default: 30
  fps?: number; // Default: 30
  title?: string; // Default: 'Hello World'
  subtitle?: string; // Default: 'Welcome to Microfox'
  style?: React.CSSProperties;
}
```

**Example:**

```typescript
<SimpleComposition
  title="My Video Title"
  subtitle="Created with Microfox"
  duration={60}
/>
```

## Component Types

### Frames

Scene-level containers that can hold layouts and atoms.

#### SceneFrame

Full-screen scene container.

#### OverlayFrame

Overlay scene that can be positioned over other content.

### Layouts

Arrangement directors that organize atoms and other layouts.

#### GridLayout

Grid arrangement with configurable columns and rows.

**Data Properties:**

- `columns`: number (default: 2)
- `rows`: number (default: 2)
- `spacing`: number (default: 10)

#### VerticalLayout

Vertical stacking with spacing.

**Data Properties:**

- `spacing`: number (default: 10)

#### HorizontalLayout

Horizontal arrangement with spacing.

**Data Properties:**

- `spacing`: number (default: 10)

#### CircularLayout

Circular arrangement around a center point.

**Data Properties:**

- `radius`: number (default: 200)
- `centerX`: number (optional, calculated from parent if not provided)
- `centerY`: number (optional, calculated from parent if not provided)

#### OverlayLayout

Overlay positioning with alignment options.

**Data Properties:**

- `alignment`: string (default: 'center')
  - Options: 'top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'
- `padding`: number (default: 0)

#### FlexLayout

Flexbox-like arrangement.

**Data Properties:**

- `direction`: string (default: 'row')
- `justifyContent`: string (default: 'center')
- `alignItems`: string (default: 'center')
- `flexWrap`: string (default: 'nowrap')
- `gap`: number (default: 10)

### Atoms

The smallest renderable units.

#### TextAtom

Text rendering with styling.

**Data Properties:**

- `text`: string
- `style`: React.CSSProperties

#### ImageAtom

Image rendering with positioning.

**Data Properties:**

- `src`: string
- `style`: React.CSSProperties

#### VideoAtom

Video rendering with controls.

**Data Properties:**

- `src`: string
- `style`: React.CSSProperties

#### AudioAtom

Audio rendering.

**Data Properties:**

- `src`: string
- `volume`: number (default: 1)

#### ShapeAtom

Geometric shapes.

**Data Properties:**

- `shape`: 'circle' | 'rectangle' | 'triangle' (default: 'rectangle')
- `color`: string (default: '#ffffff')
- `size`: number (default: 100)

## Hooks

### useRenderableContext

Hook for managing renderable context and boundaries.

```typescript
const context = useRenderableContext({
  parentContext?: RenderableContext;
  boundaries?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    zIndex?: number;
  };
  timing?: {
    startFrame?: number;
    durationFrames?: number;
    delay?: number;
  };
  composition: CompositionContext;
});
```

### useComponentRegistry

Hook for accessing the component registry.

```typescript
const registry = useComponentRegistry();
// registry.registerComponent, registry.getComponent, etc.
```

### useBoundaryCalculation

Hook for calculating component boundaries.

```typescript
const boundaries = useBoundaryCalculation({
  parentBoundaries: { x, y, width, height };
  constraints: BoundaryConstraints;
  layout?: LayoutConstraints;
});
```

## Utilities

### Composition Builder

Create complex compositions programmatically.

```typescript
import { createCompositionBuilder } from '@microfox/remotion';

const builder = createCompositionBuilder(1920, 1080, 30, 30);

const components = builder
  .addFrame('main-scene')
  .addLayout('grid', 'grid', { columns: 2, rows: 2 })
  .addAtom('title', 'text', { text: 'Hello World' })
  .addAtom('image', 'image', { src: 'image.jpg' })
  .build();
```

### Context Utilities

```typescript
import { createRootContext, mergeContexts } from '@microfox/remotion';

// Create a root context
const rootContext = createRootContext(1920, 1080, 30, 30);

// Merge contexts
const mergedContext = mergeContexts(parentContext, childContext);
```

### Boundary Utilities

```typescript
import {
  calculateGridPosition,
  calculateCircularPosition,
} from '@microfox/remotion';

// Calculate grid position
const gridPos = calculateGridPosition(
  index,
  columns,
  cellWidth,
  cellHeight,
  spacing
);

// Calculate circular position
const circularPos = calculateCircularPosition(
  index,
  total,
  radius,
  centerX,
  centerY
);
```

## Registry System

### Registering Components

```typescript
import { registerComponent } from '@microfox/remotion';

// Register a custom component
registerComponent('custom-layout', CustomLayout, 'layout');
registerComponent('custom-atom', CustomAtom, 'atom');
```

### Registering Packages

```typescript
import { registerPackage } from '@microfox/remotion';

// Register a package of components
registerPackage('my-package', {
  'custom-layout': CustomLayout,
  'custom-atom': CustomAtom,
});
```

## Types

### RenderableComponentData

```typescript
interface RenderableComponentData {
  id: string;
  type: 'frame' | 'layout' | 'atom';
  parentId?: string;
  children?: RenderableComponentData[];
  data: RenderableData;
  context: RenderableContext;
}
```

### RenderableContext

```typescript
interface RenderableContext {
  boundaries: {
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
  };
  timing: {
    startFrame: number;
    durationFrames: number;
    delay: number;
  };
  hierarchy: {
    depth: number;
    parentIds: string[];
    childIds: string[];
  };
  remotion: {
    currentFrame: number;
    fps: number;
    composition: {
      width: number;
      height: number;
      duration: number;
    };
  };
}
```

## Best Practices

1. **Use SimpleComposition for quick prototypes**
2. **Use Composition Builder for complex compositions**
3. **Register custom components for reusability**
4. **Leverage the recursive pattern for nested layouts**
5. **Use context utilities for consistent boundary calculations**

## Examples

See the `examples/` directory for complete working examples:

- `basic-composition.tsx` - Basic grid layout example
- `circular-layout.tsx` - Circular arrangement example
- `simple-composition.tsx` - Simple composition usage
