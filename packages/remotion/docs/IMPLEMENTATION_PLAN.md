# @microfox/remotion - Implementation Plan & Vision

## 🎬 **Project Overview**

`@microfox/remotion` is a **recursive composition system** built on top of Remotion's core components. It provides a unified architecture where every component (frames, layouts, atoms) follows the same recursive pattern, enabling infinite nesting and flexible video composition.

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

## 📦 **Package Architecture**

### **Directory Structure**

```
@microfox/remotion/
├── src/
│   ├── core/
│   │   ├── types/
│   │   │   ├── renderable.types.ts      # Base renderable interface
│   │   │   ├── context.types.ts         # Context and boundary types
│   │   │   ├── registry.types.ts        # Registry types
│   │   │   └── index.ts
│   │   ├── registry/
│   │   │   ├── componentRegistry.ts     # Unified registry for all renderables
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── components/
│   │   ├── base/
│   │   │   ├── RenderableComponent.tsx  # Abstract base for all renderables
│   │   │   ├── ComponentRenderer.tsx    # Main renderer with context
│   │   │   └── index.ts
│   │   ├── frames/
│   │   │   ├── Frame.tsx                # Scene-level container
│   │   │   ├── SceneFrame.tsx           # Full-screen scene
│   │   │   ├── OverlayFrame.tsx         # Overlay scene
│   │   │   └── index.ts
│   │   ├── layouts/
│   │   │   ├── Layout.tsx               # Layout base class
│   │   │   ├── GridLayout.tsx           # Grid arrangement
│   │   │   ├── VerticalLayout.tsx       # Vertical stacking
│   │   │   ├── HorizontalLayout.tsx     # Horizontal arrangement
│   │   │   ├── CircularLayout.tsx       # Circular arrangement
│   │   │   ├── OverlayLayout.tsx        # Overlay positioning
│   │   │   └── index.ts
│   │   ├── atoms/
│   │   │   ├── Atom.tsx                 # Atom base class
│   │   │   ├── TextAtom.tsx             # Text rendering
│   │   │   ├── ImageAtom.tsx            # Image rendering
│   │   │   ├── VideoAtom.tsx            # Video rendering
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useRenderableContext.ts      # Context and boundary calculation
│   │   ├── useComponentRegistry.ts      # Registry management
│   │   ├── useBoundaryCalculation.ts    # Boundary and depth calculation
│   │   └── index.ts
│   ├── utils/
│   │   ├── contextUtils.ts              # Context manipulation utilities
│   │   ├── boundaryUtils.ts             # Boundary calculation utilities
│   │   └── index.ts
│   └── index.ts
```

## 🎭 **Core Interfaces**

### **RenderableComponent Interface**

```typescript
interface RenderableComponent {
  id: string;
  type: 'frame' | 'layout' | 'atom';
  parentId?: string;
  children?: RenderableComponent[];
  data: RenderableData;
  context: RenderableContext;
}
```

### **RenderableContext (Boundaries & Depth)**

```typescript
interface RenderableContext {
  // Spatial boundaries
  boundaries: {
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
  };

  // Temporal boundaries
  timing: {
    startFrame: number;
    durationFrames: number;
    delay: number;
  };

  // Hierarchy context
  hierarchy: {
    depth: number;
    parentIds: string[];
    childIds: string[];
  };

  // Remotion context
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

## 🔧 **Key Features**

### **1. Unified Registry System**

- Single registry for all component types (frames, layouts, atoms)
- Recursive component resolution
- External package registration support

### **2. Context Propagation**

- Automatic boundary calculation based on parent context
- Depth tracking for z-index management
- Parent-child relationship tracking

### **3. Remotion Integration**

- Built on `AbsoluteFill`, `Sequence`, `Img`, `Video`, `Audio`
- Timeline synchronization
- Performance optimization

### **4. Recursive Composition**

- Any layout can contain other layouts
- Infinite nesting capability
- Context-aware rendering

## 🎬 **Component Types**

### **Frames (Scene Directors)**

- **SceneFrame**: Full composition frame
- **OverlayFrame**: Overlay on existing content
- **SplitFrame**: Multiple scenes in one composition

### **Layouts (Assistant Directors)**

- **GridLayout**: Grid arrangement with configurable columns/rows
- **VerticalLayout**: Vertical stacking with spacing
- **HorizontalLayout**: Horizontal arrangement with spacing
- **CircularLayout**: Circular arrangement around center
- **OverlayLayout**: Overlay positioning with z-index management
- **FlexLayout**: Flexbox-like arrangement

### **Atoms (Actors)**

- **TextAtom**: Text rendering with styling
- **ImageAtom**: Image rendering with positioning
- **VideoAtom**: Video rendering with controls
- **AudioAtom**: Audio rendering
- **ShapeAtom**: Geometric shapes
- **CustomAtom**: External package atoms

## 🔄 **Recursive Pattern Examples**

### **Example 1: Nested Grid Layout**

```
SceneFrame
└── GridLayout (2x2)
    ├── VerticalLayout
    │   ├── TextAtom
    │   └── ImageAtom
    ├── HorizontalLayout
    │   ├── TextAtom
    │   └── VideoAtom
    ├── CircularLayout
    │   └── TextAtom
    └── OverlayLayout
        ├── TextAtom
        └── ShapeAtom
```

### **Example 2: Complex Overlay Scene**

```
SceneFrame
├── VideoAtom (background)
├── OverlayFrame
│   ├── GridLayout (3x1)
│   │   ├── TextAtom
│   │   ├── ImageAtom
│   │   └── TextAtom
│   └── CircularLayout
│       └── TextAtom
└── OverlayFrame
    └── VerticalLayout
        ├── TextAtom
        └── HorizontalLayout
            ├── ImageAtom
            └── TextAtom
```

## 🎯 **Implementation Strategy**

### **Phase 1: Core Foundation (Week 1)**

1. **RenderableComponent Interface** - Base for all components
2. **Context System** - Boundary and hierarchy management
3. **Registry System** - Component registration and resolution
4. **Base Component Classes** - Abstract renderable components

### **Phase 2: Base Components (Week 2)**

1. **Frame Components** - Scene-level containers
2. **Layout Components** - Arrangement directors
3. **Atom Components** - Basic renderable units
4. **Component Renderer** - Main rendering engine

### **Phase 3: Advanced Features (Week 3)**

1. **Recursive Rendering** - Nested component support
2. **Context Propagation** - Automatic boundary calculation
3. **External Integration** - Package registration system
4. **Performance Optimization** - Efficient rendering

### **Phase 4: Testing & Documentation (Week 4)**

1. **Unit Tests** - Component testing
2. **Integration Tests** - End-to-end testing
3. **Documentation** - API documentation
4. **Examples** - Usage examples

## 🔌 **External Package Integration**

### **Component Registration**

```typescript
// External packages can register any component type
registerComponent('custom-layout', CustomLayout);
registerComponent('custom-atom', CustomAtom);
registerComponent('custom-frame', CustomFrame);
```

### **Package Integration**

```typescript
// @microfox/remotion-atoms-text
registerAtomPackage('text', {
  'glow-text': GlowTextAtom,
  waveform: WaveformAtom,
});

// @microfox/remotion-layouts-advanced
registerLayoutPackage('advanced', {
  spiral: SpiralLayout,
  masonry: MasonryLayout,
});
```

## 🎯 **Key Benefits**

1. **Unified Architecture** - Single pattern for all components
2. **Infinite Nesting** - Any component can contain any other component
3. **Context Awareness** - Automatic boundary and timing calculation
4. **Remotion Native** - Built on Remotion's core components
5. **Extensible** - Easy external package integration
6. **Performance** - Optimized rendering with Remotion's engine

## 🚀 **Getting Started**

### **Installation**

```bash
npm install @microfox/remotion
```

### **Basic Usage**

```typescript
import { SceneFrame, GridLayout, TextAtom } from '@microfox/remotion';

const MyComposition = () => (
  <SceneFrame>
    <GridLayout columns={2} rows={2}>
      <TextAtom text="Hello" />
      <TextAtom text="World" />
    </GridLayout>
  </SceneFrame>
);
```

## 📋 **Development Guidelines**

### **Code Style**

- TypeScript for type safety
- React functional components with hooks
- Remotion-first design patterns
- Comprehensive error handling

### **Testing Strategy**

- Unit tests for each component
- Integration tests for composition
- Performance benchmarks
- Visual regression testing

### **Documentation Standards**

- JSDoc comments for all public APIs
- TypeScript interfaces for all types
- Usage examples for each component
- Architecture diagrams

## 🎬 **Future Roadmap**

### **v1.0 - Core System**

- Basic recursive composition
- Registry system
- Core layouts and atoms

### **v1.1 - Advanced Features**

- Animation system
- Advanced layouts
- Performance optimizations

### **v1.2 - Ecosystem**

- External package support
- Plugin system
- Developer tools

### **v2.0 - Enterprise Features**

- Collaboration tools
- Version control
- Advanced rendering pipeline

---

_This document serves as the implementation guide for the @microfox/remotion package. All development should follow the patterns and principles outlined here._
