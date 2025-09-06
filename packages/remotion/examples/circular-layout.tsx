import React from 'react';
import { Composition } from '../src/components/Composition';
import { RenderableComponentData } from '../src/core/types';

const CircularLayoutExample: React.FC = () => {
    const components: RenderableComponentData[] = [
        {
            id: 'scene-1',
            type: 'frame',
            data: {},
            context: {
                boundaries: { x: 0, y: 0, width: 1920, height: 1080, zIndex: 0 },
                timing: { startFrame: 0, durationFrames: 60, delay: 0 },
                hierarchy: { depth: 0, parentIds: [], childIds: [] },
                remotion: {
                    currentFrame: 0,
                    fps: 30,
                    composition: { width: 1920, height: 1080, duration: 60 }
                }
            },
            children: [
                {
                    id: 'circular-1',
                    type: 'layout',
                    data: { radius: 300, centerX: 960, centerY: 540 },
                    context: {
                        boundaries: { x: 0, y: 0, width: 1920, height: 1080, zIndex: 1 },
                        timing: { startFrame: 0, durationFrames: 60, delay: 0 },
                        hierarchy: { depth: 1, parentIds: ['scene-1'], childIds: [] },
                        remotion: {
                            currentFrame: 0,
                            fps: 30,
                            composition: { width: 1920, height: 1080, duration: 60 }
                        }
                    },
                    children: [
                        {
                            id: 'text-1',
                            type: 'atom',
                            data: { text: 'North', style: { fontSize: '32px', color: 'white', fontWeight: 'bold' } },
                            context: {
                                boundaries: { x: 960, y: 240, width: 100, height: 50, zIndex: 2 },
                                timing: { startFrame: 0, durationFrames: 60, delay: 0 },
                                hierarchy: { depth: 2, parentIds: ['scene-1', 'circular-1'], childIds: [] },
                                remotion: {
                                    currentFrame: 0,
                                    fps: 30,
                                    composition: { width: 1920, height: 1080, duration: 60 }
                                }
                            }
                        },
                        {
                            id: 'text-2',
                            type: 'atom',
                            data: { text: 'East', style: { fontSize: '32px', color: 'white', fontWeight: 'bold' } },
                            context: {
                                boundaries: { x: 1260, y: 540, width: 100, height: 50, zIndex: 2 },
                                timing: { startFrame: 0, durationFrames: 60, delay: 0 },
                                hierarchy: { depth: 2, parentIds: ['scene-1', 'circular-1'], childIds: [] },
                                remotion: {
                                    currentFrame: 0,
                                    fps: 30,
                                    composition: { width: 1920, height: 1080, duration: 60 }
                                }
                            }
                        },
                        {
                            id: 'text-3',
                            type: 'atom',
                            data: { text: 'South', style: { fontSize: '32px', color: 'white', fontWeight: 'bold' } },
                            context: {
                                boundaries: { x: 960, y: 840, width: 100, height: 50, zIndex: 2 },
                                timing: { startFrame: 0, durationFrames: 60, delay: 0 },
                                hierarchy: { depth: 2, parentIds: ['scene-1', 'circular-1'], childIds: [] },
                                remotion: {
                                    currentFrame: 0,
                                    fps: 30,
                                    composition: { width: 1920, height: 1080, duration: 60 }
                                }
                            }
                        },
                        {
                            id: 'text-4',
                            type: 'atom',
                            data: { text: 'West', style: { fontSize: '32px', color: 'white', fontWeight: 'bold' } },
                            context: {
                                boundaries: { x: 660, y: 540, width: 100, height: 50, zIndex: 2 },
                                timing: { startFrame: 0, durationFrames: 60, delay: 0 },
                                hierarchy: { depth: 2, parentIds: ['scene-1', 'circular-1'], childIds: [] },
                                remotion: {
                                    currentFrame: 0,
                                    fps: 30,
                                    composition: { width: 1920, height: 1080, duration: 60 }
                                }
                            }
                        },
                        {
                            id: 'shape-center',
                            type: 'atom',
                            data: { shape: 'circle', color: '#ff6b6b', size: 80 },
                            context: {
                                boundaries: { x: 960, y: 540, width: 80, height: 80, zIndex: 2 },
                                timing: { startFrame: 0, durationFrames: 60, delay: 0 },
                                hierarchy: { depth: 2, parentIds: ['scene-1', 'circular-1'], childIds: [] },
                                remotion: {
                                    currentFrame: 0,
                                    fps: 30,
                                    composition: { width: 1920, height: 1080, duration: 60 }
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ];

    return (
        <Composition
            components={components}
            width={1920}
            height={1080}
            duration={60}
            fps={30}
        />
    );
};

export default CircularLayoutExample; 