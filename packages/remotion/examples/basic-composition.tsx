import React from 'react';
import { Composition } from '../src/components/Composition';
import { RenderableComponentData } from '../src/core/types';

const BasicComposition: React.FC = () => {
    const components: RenderableComponentData[] = [
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
                    id: 'grid-1',
                    type: 'layout',
                    data: { columns: 2, rows: 2, spacing: 20 },
                    context: {
                        boundaries: { x: 0, y: 0, width: 1920, height: 1080, zIndex: 1 },
                        timing: { startFrame: 0, durationFrames: 30, delay: 0 },
                        hierarchy: { depth: 1, parentIds: ['scene-1'], childIds: [] },
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
                            context: {
                                boundaries: { x: 0, y: 0, width: 950, height: 530, zIndex: 2 },
                                timing: { startFrame: 0, durationFrames: 30, delay: 0 },
                                hierarchy: { depth: 2, parentIds: ['scene-1', 'grid-1'], childIds: [] },
                                remotion: {
                                    currentFrame: 0,
                                    fps: 30,
                                    composition: { width: 1920, height: 1080, duration: 30 }
                                }
                            }
                        },
                        {
                            id: 'text-2',
                            type: 'atom',
                            data: { text: 'Welcome to Microfox', style: { fontSize: '36px', color: 'yellow' } },
                            context: {
                                boundaries: { x: 970, y: 0, width: 950, height: 530, zIndex: 2 },
                                timing: { startFrame: 0, durationFrames: 30, delay: 0 },
                                hierarchy: { depth: 2, parentIds: ['scene-1', 'grid-1'], childIds: [] },
                                remotion: {
                                    currentFrame: 0,
                                    fps: 30,
                                    composition: { width: 1920, height: 1080, duration: 30 }
                                }
                            }
                        },
                        {
                            id: 'shape-1',
                            type: 'atom',
                            data: { shape: 'circle', color: '#ff6b6b', size: 100 },
                            context: {
                                boundaries: { x: 0, y: 550, width: 950, height: 530, zIndex: 2 },
                                timing: { startFrame: 0, durationFrames: 30, delay: 0 },
                                hierarchy: { depth: 2, parentIds: ['scene-1', 'grid-1'], childIds: [] },
                                remotion: {
                                    currentFrame: 0,
                                    fps: 30,
                                    composition: { width: 1920, height: 1080, duration: 30 }
                                }
                            }
                        },
                        {
                            id: 'shape-2',
                            type: 'atom',
                            data: { shape: 'triangle', color: '#4ecdc4', size: 120 },
                            context: {
                                boundaries: { x: 970, y: 550, width: 950, height: 530, zIndex: 2 },
                                timing: { startFrame: 0, durationFrames: 30, delay: 0 },
                                hierarchy: { depth: 2, parentIds: ['scene-1', 'grid-1'], childIds: [] },
                                remotion: {
                                    currentFrame: 0,
                                    fps: 30,
                                    composition: { width: 1920, height: 1080, duration: 30 }
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
            duration={30}
            fps={30}
        />
    );
};

export default BasicComposition; 