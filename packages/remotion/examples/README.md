# @microfox/remotion Examples

This directory contains examples demonstrating how to use the `@microfox/remotion` package for creating video compositions.

## Examples Overview

### 1. Basic Composition (`basic-composition.tsx`)

A simple example showing a grid layout with text and shapes.

**Features:**

- Grid layout with 2x2 arrangement
- Text atoms with custom styling
- Shape atoms (circle and triangle)
- Basic context and boundary management

**Usage:**

```typescript
import BasicComposition from './basic-composition';
```

### 2. Circular Layout (`circular-layout.tsx`)

Demonstrates circular arrangement of components around a center point.

**Features:**

- Circular layout with configurable radius
- Text positioning around a circle
- Center shape element
- Directional text (North, East, South, West)

**Usage:**

```typescript
import CircularLayoutExample from './circular-layout';
```

### 3. Simple Composition (`simple-composition.tsx`)

Shows how to use the `SimpleComposition` component for quick setup.

**Features:**

- Pre-built composition structure
- Customizable title and subtitle
- Easy-to-use interface
- Quick prototyping

**Usage:**

```typescript
import SimpleCompositionExample from './simple-composition';
```

### 4. Next.js Logo Composition (`nextjs-logo-composition.tsx`)

A simplified version of the Next.js logo animation using the composition builder.

**Features:**

- Composition builder pattern
- Custom component integration
- Simplified Next.js logo
- Rings animation effect
- Text fade-in effect

**Usage:**

```typescript
import NextJsLogoComposition from './nextjs-logo-composition';
```

### 5. Advanced Next.js Composition (`advanced-nextjs-composition.tsx`)

A more complex version showing manual composition structure with timing.

**Features:**

- Manual composition structure
- Complex timing and sequencing
- Advanced component integration
- Layered animations
- Custom SVG logo

**Usage:**

```typescript
import AdvancedNextJsComposition from './advanced-nextjs-composition';
```

## Running Examples

### Prerequisites

```bash
npm install @microfox/remotion
npm install remotion
```

### Basic Usage

```typescript
import React from 'react';
import { Composition } from '@microfox/remotion';
import BasicComposition from './examples/basic-composition';

const MyVideo = () => {
  return <BasicComposition />;
};
```

### With Custom Props

```typescript
import React from 'react';
import NextJsLogoComposition from './examples/nextjs-logo-composition';

const MyVideo = () => {
  return (
    <NextJsLogoComposition
      title="My Custom Title"
    />
  );
};
```

## Example Patterns

### 1. Using the Composition Builder

```typescript
import { createCompositionBuilder } from '@microfox/remotion';

const components = createCompositionBuilder(1920, 1080, 30, 30)
  .addFrame('main-scene')
  .addLayout('grid', 'grid', { columns: 2, rows: 2 })
  .addAtom('title', 'text', { text: 'Hello World' })
  .build();
```

### 2. Manual Composition Structure

```typescript
const components: RenderableComponentData[] = [
  {
    id: 'scene-1',
    type: 'frame',
    data: {},
    context: {
      /* context data */
    },
    children: [
      {
        id: 'layout-1',
        type: 'layout',
        data: { layoutType: 'grid', columns: 2 },
        context: {
          /* context data */
        },
        children: [
          {
            id: 'atom-1',
            type: 'atom',
            data: { text: 'Hello' },
            context: {
              /* context data */
            },
          },
        ],
      },
    ],
  },
];
```

### 3. Custom Component Integration

```typescript
const CustomComponent: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ fontSize: '48px', color: 'white' }}>
    {title}
  </div>
);

// In composition data:
{
  id: 'custom',
  type: 'atom',
  data: {
    atomType: 'custom',
    component: CustomComponent,
    props: { title: 'Hello World' }
  },
  context: { /* context data */ }
}
```

## Key Concepts Demonstrated

1. **Recursive Composition**: Components can contain other components
2. **Context Propagation**: Automatic boundary and timing calculation
3. **Layout Systems**: Grid, circular, overlay, and flex layouts
4. **Atom Components**: Text, images, shapes, and custom components
5. **Timing Control**: Frame-based timing and sequencing
6. **Custom Integration**: How to integrate existing components

## Next Steps

1. **Explore the API**: Check out the [API documentation](../docs/API.md)
2. **Read the Quick Start**: See [Quick Start Guide](../docs/QUICKSTART.md)
3. **Build Your Own**: Use these examples as templates for your compositions
4. **Extend the System**: Register your own custom components

## Contributing

Feel free to add your own examples to this directory. Make sure to:

- Include a clear description of what the example demonstrates
- Use consistent naming conventions
- Add proper TypeScript types
- Include usage instructions in comments
