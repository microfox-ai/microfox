# Quick Start Guide

Get started with @microfox/remotion in minutes!

## Installation

```bash
npm install @microfox/remotion
```

## Basic Usage

### 1. Simple Composition (Recommended for beginners)

```typescript
import React from 'react';
import { SimpleComposition } from '@microfox/remotion';

const MyVideo = () => (
  <SimpleComposition
    title="Welcome to My Video"
    subtitle="Created with Microfox"
    duration={60}
    fps={30}
  />
);
```

### 2. Custom Composition

```typescript
import React from 'react';
import { Composition, createCompositionBuilder } from '@microfox/remotion';

const MyVideo = () => {
  const components = createCompositionBuilder(1920, 1080, 30, 30)
    .addFrame('main-scene')
    .addLayout('grid', 'grid', { columns: 2, rows: 2 })
    .addAtom('title', 'text', { text: 'Hello World' })
    .addAtom('image', 'image', { src: 'image.jpg' })
    .build();

  return (
    <Composition
      components={components}
      width={1920}
      height={1080}
      duration={30}
      fps={30}
    />
  );
};
```

### 3. Manual Composition

```typescript
import React from 'react';
import { Composition } from '@microfox/remotion';

const MyVideo = () => {
  const components = [
    {
      id: 'scene-1',
      type: 'frame',
      data: {},
      context: {
        boundaries: { x: 0, y: 0, width: 1920, height: 1080, zIndex: 0 },
        timing: { startFrame: 0, durationFrames: 30, delay: 0 },
        hierarchy: { depth: 0, parentIds: [], childIds: [] },
        remotion: {
          currentFrame: 0,
          fps: 30,
          composition: { width: 1920, height: 1080, duration: 30 }
        }
      },
      children: [
        {
          id: 'text-1',
          type: 'atom',
          data: { text: 'Hello World', style: { fontSize: '48px', color: 'white' } },
          context: { /* ... context data ... */ }
        }
      ]
    }
  ];

  return (
    <Composition
      components={components}
      width={1920}
      height={1080}
      duration={30}
      fps={30}
    />
  );
};
```

## Component Types

### Frames

- **SceneFrame**: Full-screen scene
- **OverlayFrame**: Overlay on existing content

### Layouts

- **GridLayout**: Grid arrangement
- **VerticalLayout**: Vertical stacking
- **HorizontalLayout**: Horizontal arrangement
- **CircularLayout**: Circular arrangement
- **OverlayLayout**: Overlay positioning
- **FlexLayout**: Flexbox-like arrangement

### Atoms

- **TextAtom**: Text rendering
- **ImageAtom**: Image rendering
- **VideoAtom**: Video rendering
- **AudioAtom**: Audio rendering
- **ShapeAtom**: Geometric shapes

## Next Steps

1. **Explore Examples**: Check out the `examples/` directory
2. **Read API Docs**: See `docs/API.md` for complete documentation
3. **Build Complex Compositions**: Use the composition builder for advanced layouts
4. **Create Custom Components**: Register your own components using the registry system

## Common Patterns

### Nested Layouts

```typescript
const builder = createCompositionBuilder(1920, 1080, 30, 30);

const components = builder
  .addFrame('main')
  .addLayout('outer-grid', 'grid', { columns: 2, rows: 1 })
  .addLayout('inner-vertical', 'vertical', { spacing: 20 })
  .addAtom('title', 'text', { text: 'Title' })
  .addAtom('subtitle', 'text', { text: 'Subtitle' })
  .build();
```

### Multiple Frames

```typescript
const components = [
  {
    id: 'intro',
    type: 'frame',
    // ... context for 0-30 frames
  },
  {
    id: 'main-content',
    type: 'frame',
    // ... context for 30-90 frames
  },
  {
    id: 'outro',
    type: 'frame',
    // ... context for 90-120 frames
  },
];
```

## Tips

1. **Start Simple**: Use `SimpleComposition` for quick prototypes
2. **Use the Builder**: `createCompositionBuilder` makes complex compositions easier
3. **Leverage Context**: Components automatically inherit context from parents
4. **Register Custom Components**: Extend the system with your own components
5. **Think Recursively**: Any component can contain any other component

## Need Help?

- Check the [API Documentation](API.md)
- Look at the [examples](../examples/)
- Review the [architecture plan](ARCHITECTURE_PLAN.md)
- Read the [implementation plan](IMPLEMENTATION_PLAN.md)
