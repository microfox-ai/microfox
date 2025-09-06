# @microfox/remotion

A **recursive composition system** built on top of Remotion's core components. It provides a unified architecture where every component (frames, layouts, atoms) follows the same recursive pattern, enabling infinite nesting and flexible video composition.

## 🎯 **Core Philosophy: The Three Pillars**

### **1. Recursive Component Pattern**

Everything is a **RenderableComponent** that can contain other renderable components:

- **Frame** → Contains multiple **Layouts**
- **Layout** → Contains multiple **Atoms** OR **SubLayouts**
- **Atom** → Smallest renderable unit (text, image, video, etc.)

### **2. Context-Driven Rendering**

Each component automatically calculates its boundaries and context:

- **Spatial Boundaries**: x, y, width, height, zIndex
- **Temporal Boundaries**: startFrame, durationFrames, delay
- **Hierarchy Context**: depth, parentIds, childIds
- **Remotion Context**: currentFrame, fps, composition dimensions

### **3. Remotion-Native Design**

Built entirely on Remotion's core components:

- `AbsoluteFill` for positioning
- `Sequence` for timing
- `Img`, `Video`, `Audio` for media
- Timeline synchronization and performance optimization

## 🚀 **Installation**

```bash
npm install @microfox/remotion
```

## 📖 **Basic Usage**

```typescript
import { Composition, SceneFrame, GridLayout, TextAtom } from '@microfox/remotion';

const MyComposition = () => (
  <Composition
    components={[
      {
        id: 'scene-1',
        type: 'frame',
        data: {},
        context: {
          boundaries: { x: 0, y: 0, width: 1920, height: 1080, zIndex: 0 },
          timing: { startFrame: 0, durationFrames: 30, delay: 0 },
          hierarchy: { depth: 0, parentIds: [], childIds: [] },
          remotion: { currentFrame: 0, fps: 30, composition: { width: 1920, height: 1080, duration: 30 } }
        }
      }
    ]}
    width={1920}
    height={1080}
    duration={30}
    fps={30}
  />
);
```

## 🎬 **Component Types**

### **Frames (Scene Directors)**

- **SceneFrame**: Full composition frame
- **OverlayFrame**: Overlay on existing content

### **Layouts (Assistant Directors)**

- **GridLayout**: Grid arrangement with configurable columns/rows
- **VerticalLayout**: Vertical stacking with spacing
- **HorizontalLayout**: Horizontal arrangement with spacing

### **Atoms (Actors)**

- **TextAtom**: Text rendering with styling
- **ImageAtom**: Image rendering with positioning
- **VideoAtom**: Video rendering with controls

## 🔄 **Recursive Pattern Examples**

### **Example 1: Nested Grid Layout**

```typescript
const nestedGridExample = {
  id: 'scene-1',
  type: 'frame',
  data: {},
  context: {
    /* ... */
  },
  children: [
    {
      id: 'grid-1',
      type: 'layout',
      data: { columns: 2, rows: 2, spacing: 20 },
      context: {
        /* ... */
      },
      children: [
        {
          id: 'text-1',
          type: 'atom',
          data: { text: 'Hello World', style: { fontSize: '48px' } },
          context: {
            /* ... */
          },
        },
        {
          id: 'image-1',
          type: 'atom',
          data: { src: 'https://example.com/image.jpg' },
          context: {
            /* ... */
          },
        },
      ],
    },
  ],
};
```

## 🔧 **Advanced Features**

### **Context Propagation**

Components automatically inherit and calculate their context from parent components:

```typescript
const contextExample = {
  boundaries: {
    x: 100, // Inherited from parent
    y: 50, // Inherited from parent
    width: 800, // Calculated based on parent
    height: 600, // Calculated based on parent
    zIndex: 1, // Incremented from parent
  },
  timing: {
    startFrame: 0, // Inherited from parent
    durationFrames: 30, // Inherited from parent
    delay: 5, // Added to parent timing
  },
  hierarchy: {
    depth: 2, // Incremented from parent
    parentIds: ['root', 'parent-1'], // Tracked automatically
    childIds: [], // Populated automatically
  },
};
```

### **Registry System**

Register custom components for external package integration:

```typescript
import { registerComponent } from '@microfox/remotion';

// Register custom components
registerComponent('custom-layout', CustomLayout, 'layout');
registerComponent('custom-atom', CustomAtom, 'atom');
```

## Templates

The package includes pre-built templates for common use cases.

### RingsComposition

A composition featuring the Next.js logo animation with concentric rings and a text fade effect.

**Usage:**

```typescript
import React from 'react';
import { RingsComposition } from '@microfox/remotion';

const MyVideo = () => {
  return (
    <RingsComposition
      title="My Custom Title"
    />
  );
};
```

## �� **Key Benefits**

1. **Unified Architecture** - Single pattern for all components
2. **Infinite Nesting** - Any component can contain any other component
3. **Context Awareness** - Automatic boundary and timing calculation
4. **Remotion Native** - Built on Remotion's core components
5. **Extensible** - Easy external package integration
6. **Performance** - Optimized rendering with Remotion's engine

## 📋 **Development**

### **Building**

```bash
npm run build
```

### **Testing**

```bash
npm test
```

### **Linting**

```bash
npm run lint
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 **License**

MIT License - see LICENSE file for details.

---

_This package provides a powerful foundation for building complex video compositions with Remotion using a unified, recursive component architecture._
