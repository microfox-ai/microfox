# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added

- **Complete recursive composition system** with unified component architecture
- **Core Components**:

  - `Composition` - Main composition component
  - `SimpleComposition` - Simplified composition for quick setup
  - `SceneFrame` and `OverlayFrame` - Frame components
  - `GridLayout`, `VerticalLayout`, `HorizontalLayout` - Basic layouts
  - `CircularLayout`, `OverlayLayout`, `FlexLayout` - Advanced layouts
  - `TextAtom`, `ImageAtom`, `VideoAtom`, `AudioAtom`, `ShapeAtom` - Atom components

- **Core System**:

  - `RenderableComponentData` interface for recursive component structure
  - `RenderableContext` for boundary and timing management
  - Component registry system for extensibility
  - Context-driven rendering with automatic boundary calculation

- **Hooks**:

  - `useRenderableContext` - Context and boundary management
  - `useComponentRegistry` - Registry management
  - `useBoundaryCalculation` - Boundary calculation utilities

- **Utilities**:

  - `createCompositionBuilder` - Programmatic composition creation
  - `createSimpleComposition` - Quick composition setup
  - Context utilities for boundary and timing management
  - Boundary calculation utilities for positioning

- **Documentation**:
  - Comprehensive API documentation
  - Usage examples and best practices
  - Architecture and implementation guides

### Features

- **Recursive Component Pattern**: Every component can contain other components
- **Context-Driven Rendering**: Automatic boundary and timing calculation
- **Remotion-Native Design**: Built entirely on Remotion's core components
- **Extensible Registry**: Support for external package integration
- **Type Safety**: Full TypeScript support with comprehensive interfaces

### Architecture

- **Three Pillars**: Recursive Component Pattern, Context-Driven Rendering, Remotion-Native Design
- **Unified Interface**: All components follow the same recursive pattern
- **Performance Optimized**: Built on Remotion's efficient rendering engine
- **Developer Friendly**: Simple APIs with powerful capabilities

---

This is the initial release of @microfox/remotion, providing a complete foundation for building complex video compositions with Remotion using a unified, recursive component architecture.
