# Effects System

The effects system in @microfox/remotion allows you to apply visual effects to components. Effects are registered using `registerEffect` and can be applied to any component type.

## How Effects Work

Effects are wrapper components that modify the visual appearance of their children. They use the same rendering logic as layout components and are applied in the order they are specified.

### Effect Application Rules

1. **For Scene components**: Effects are applied inside the Series.Sequence wrapper
2. **For Layout/Frame components**: Effects are applied inside the ComponentClass
3. **For Atom components**: Effects are applied around the ComponentClass

## Registering Effects

Effects are registered using the `registerEffect` function, which is essentially `registerComponent` with type set to 'layout':

```typescript
import { registerEffect } from '@microfox/remotion';

registerEffect('blur-effect', BlurEffect, {
  displayName: 'BlurEffect',
  description: 'Applies a blur effect',
});
```

## Using Effects

Effects can be specified in component data as an array of `BaseEffect`:

```typescript
// String-based effect (uses default parameters)
{
  id: 'my-component',
  componentId: 'text',
  type: 'atom',
  effects: ['BlurEffect']
}

// Object-based effect (with custom parameters)
{
  id: 'my-component',
  componentId: 'text',
  type: 'atom',
  effects: [
    {
      id: 'blur-1',
      componentId: 'BlurEffect',
      data: { blur: 10 }
    }
  ]
}

// Multiple effects (applied in order)
{
  id: 'my-component',
  componentId: 'text',
  type: 'atom',
  effects: [
    'BlurEffect',
    {
      id: 'brightness-1',
      componentId: 'BrightnessEffect',
      data: { brightness: 1.2 }
    }
  ]
}
```

## Creating Custom Effects

To create a custom effect, create a component that accepts `BaseRenderableProps`:

```typescript
import React from 'react';
import { BaseRenderableProps } from '@microfox/remotion';

interface MyEffectData {
  intensity?: number;
}

export const MyEffect: React.FC<BaseRenderableProps> = ({
  data,
  children
}) => {
  const intensity = (data as MyEffectData)?.intensity || 1;

  return (
    <div style={{
      filter: `brightness(${intensity})`,
      width: '100%',
      height: '100%'
    }}>
      {children}
    </div>
  );
};

export const config = {
  displayName: 'MyEffect',
  description: 'Custom effect description',
  category: 'effects',
  props: {
    intensity: {
      type: 'number',
      description: 'Effect intensity',
      default: 1
    }
  }
};
```

Then register it:

```typescript
import { registerEffect } from '@microfox/remotion';
import { MyEffect, config } from './MyEffect';

registerEffect(config.displayName, MyEffect, config);
```

## Built-in Effects

### BlurEffect

Applies a blur filter to its children.

**Parameters:**

- `blur` (number): Blur amount in pixels (default: 5)

**Usage:**

```typescript
{
  effects: [
    {
      componentId: 'BlurEffect',
      data: { blur: 10 },
    },
  ];
}
```

## Effect Wrapping Order

When multiple effects are applied, they wrap the component in the specified order:

```typescript
// This:
{
  effects: ['BlurEffect', 'BrightnessEffect']
}

// Results in:
<BrightnessEffect>
  <BlurEffect>
    <OriginalComponent />
  </BlurEffect>
</BrightnessEffect>
```

The innermost effect is applied first, and the outermost effect is applied last.
