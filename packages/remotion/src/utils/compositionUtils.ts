// import { RenderableComponentData, RenderableContext } from '../core/types';

// export interface CompositionBuilder {
//   addFrame(id: string, data?: any): CompositionBuilder;
//   addLayout(id: string, type: string, data?: any): CompositionBuilder;
//   addAtom(id: string, type: string, data?: any): CompositionBuilder;
//   build(): RenderableComponentData[];
// }

// export class CompositionBuilderImpl implements CompositionBuilder {
//   private components: RenderableComponentData[] = [];
//   private currentFrameId: string | null = null;
//   private currentLayoutId: string | null = null;
//   private context: RenderableContext;

//   constructor(width: number, height: number, duration: number, fps: number) {
//     this.context = {
//       boundaries: { x: 0, y: 0, width, height, zIndex: 0 },
//       timing: { startFrame: 0, durationFrames: duration, delay: 0 },
//       hierarchy: { depth: 0, parentIds: [], childIds: [] },
//       remotion: {
//         currentFrame: 0,
//         fps,
//         composition: { width, height, duration },
//       },
//     };
//   }

//   addFrame(id: string, data: any = {}): CompositionBuilder {
//     const frame: RenderableComponentData = {
//       id,
//       type: 'frame',
//       data,
//       children: [],
//     };

//     this.components.push(frame);
//     this.currentFrameId = id;
//     this.currentLayoutId = null;

//     return this;
//   }

//   addLayout(id: string, type: string, data: any = {}): CompositionBuilder {
//     if (!this.currentFrameId) {
//       throw new Error('No frame added. Call addFrame() first.');
//     }

//     const layout: RenderableComponentData = {
//       id,
//       type: 'layout',
//       data: { ...data, layoutType: type },
//       context: {
//         ...this.context,
//         hierarchy: {
//           depth: 1,
//           parentIds: [this.currentFrameId],
//           childIds: [],
//         },
//       },
//       children: [],
//     };

//     // Find the current frame and add the layout
//     const frame = this.components.find((c) => c.id === this.currentFrameId);
//     if (frame) {
//       frame.children = frame.children || [];
//       frame.children.push(layout);
//     }

//     this.currentLayoutId = id;
//     return this;
//   }

//   addAtom(id: string, type: string, data: any = {}): CompositionBuilder {
//     if (!this.currentFrameId) {
//       throw new Error('No frame added. Call addFrame() first.');
//     }

//     const atom: RenderableComponentData = {
//       id,
//       type: 'atom',
//       data: { ...data, atomType: type },
//       context: {
//         ...this.context,
//         hierarchy: {
//           depth: this.currentLayoutId ? 2 : 1,
//           parentIds: this.currentLayoutId
//             ? [this.currentFrameId, this.currentLayoutId]
//             : [this.currentFrameId],
//           childIds: [],
//         },
//       },
//     };

//     if (this.currentLayoutId) {
//       // Add to current layout
//       const frame = this.components.find((c) => c.id === this.currentFrameId);
//       const layout = frame?.children?.find(
//         (c) => c.id === this.currentLayoutId
//       );
//       if (layout) {
//         layout.children = layout.children || [];
//         layout.children.push(atom);
//       }
//     } else {
//       // Add directly to frame
//       const frame = this.components.find((c) => c.id === this.currentFrameId);
//       if (frame) {
//         frame.children = frame.children || [];
//         frame.children.push(atom);
//       }
//     }

//     return this;
//   }

//   build(): RenderableComponentData[] {
//     return this.components;
//   }
// }

// export const createCompositionBuilder = (
//   width: number,
//   height: number,
//   duration: number,
//   fps: number
// ): CompositionBuilder => {
//   return new CompositionBuilderImpl(width, height, duration, fps);
// };

// export const createSimpleComposition = (
//   width: number,
//   height: number,
//   duration: number,
//   fps: number
// ): RenderableComponentData[] => {
//   return createCompositionBuilder(width, height, duration, fps)
//     .addFrame('main-scene')
//     .addLayout('main-grid', 'grid', { columns: 2, rows: 2, spacing: 20 })
//     .addAtom('title', 'text', {
//       text: 'Hello World',
//       style: { fontSize: '48px', color: 'white' },
//     })
//     .addAtom('subtitle', 'text', {
//       text: 'Welcome to Microfox',
//       style: { fontSize: '24px', color: 'yellow' },
//     })
//     .build();
// };
