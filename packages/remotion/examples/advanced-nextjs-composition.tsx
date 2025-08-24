import React from 'react';
import { Composition } from '../src';
import { RenderableComponentData } from '../src/core/types';

// Constants from the original example
const DURATION_IN_FRAMES = 200;
const VIDEO_WIDTH = 1280;
const VIDEO_HEIGHT = 720;
const VIDEO_FPS = 30;

// Advanced Next.js Logo Component (closer to original)
const AdvancedNextLogo: React.FC<{ outProgress: number }> = ({ outProgress }) => {
    return (
        <div style={{
            height: 140,
            width: 140,
            borderRadius: 70,
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            transform: `scale(${1 - outProgress})`,
            transition: 'transform 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <svg width="80" height="80" viewBox="0 0 180 180" fill="none">
                <circle cx="90" cy="90" r="90" fill="white" />
                <path
                    d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
                    fill="black"
                />
            </svg>
        </div>
    );
};

// Advanced Rings Component (closer to original)
const AdvancedRings: React.FC<{ outProgress: number }> = ({ outProgress }) => {
    const scale = 1 / (1 - outProgress);

    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${scale})`,
            width: '100%',
            height: '100%'
        }}>
            {[1, 2, 3, 4, 5].map((i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: `${i * 120}px`,
                        height: `${i * 120}px`,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        boxShadow: '0 0 100px rgba(0, 0, 0, 0.05)',
                        transform: 'translate(-50%, -50%)'
                    }}
                />
            ))}
        </div>
    );
};

// Advanced Text Fade Component (closer to original)
const AdvancedTextFade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '70px',
            fontWeight: 'bold',
            color: '#000',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
        }}>
            {children}
        </div>
    );
};

const AdvancedNextJsComposition: React.FC<{ title?: string }> = ({ title = "Next.js and Remotion" }) => {
    // Create a more complex composition structure
    const components: RenderableComponentData[] = [
        {
            id: 'main-scene',
            type: 'frame',
            data: { backgroundColor: 'white' },
            context: {
                boundaries: { x: 0, y: 0, width: VIDEO_WIDTH, height: VIDEO_HEIGHT, zIndex: 0 },
                timing: { startFrame: 0, durationFrames: DURATION_IN_FRAMES, delay: 0 },
                hierarchy: { depth: 0, parentIds: [], childIds: [] },
                remotion: {
                    currentFrame: 0,
                    fps: VIDEO_FPS,
                    composition: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT, duration: DURATION_IN_FRAMES }
                }
            },
            children: [
                {
                    id: 'rings-container',
                    type: 'layout',
                    data: { layoutType: 'overlay', alignment: 'center' },
                    context: {
                        boundaries: { x: 0, y: 0, width: VIDEO_WIDTH, height: VIDEO_HEIGHT, zIndex: 1 },
                        timing: { startFrame: 0, durationFrames: 90, delay: 0 },
                        hierarchy: { depth: 1, parentIds: ['main-scene'], childIds: [] },
                        remotion: {
                            currentFrame: 0,
                            fps: VIDEO_FPS,
                            composition: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT, duration: DURATION_IN_FRAMES }
                        }
                    },
                    children: [
                        {
                            id: 'rings',
                            type: 'atom',
                            data: {
                                atomType: 'custom',
                                component: AdvancedRings,
                                props: { outProgress: 0 }
                            },
                            context: {
                                boundaries: { x: 0, y: 0, width: VIDEO_WIDTH, height: VIDEO_HEIGHT, zIndex: 2 },
                                timing: { startFrame: 0, durationFrames: 90, delay: 0 },
                                hierarchy: { depth: 2, parentIds: ['main-scene', 'rings-container'], childIds: [] },
                                remotion: {
                                    currentFrame: 0,
                                    fps: VIDEO_FPS,
                                    composition: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT, duration: DURATION_IN_FRAMES }
                                }
                            }
                        }
                    ]
                },
                {
                    id: 'logo-container',
                    type: 'layout',
                    data: { layoutType: 'overlay', alignment: 'center' },
                    context: {
                        boundaries: { x: 0, y: 0, width: VIDEO_WIDTH, height: VIDEO_HEIGHT, zIndex: 3 },
                        timing: { startFrame: 0, durationFrames: 90, delay: 0 },
                        hierarchy: { depth: 1, parentIds: ['main-scene'], childIds: [] },
                        remotion: {
                            currentFrame: 0,
                            fps: VIDEO_FPS,
                            composition: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT, duration: DURATION_IN_FRAMES }
                        }
                    },
                    children: [
                        {
                            id: 'logo',
                            type: 'atom',
                            data: {
                                atomType: 'custom',
                                component: AdvancedNextLogo,
                                props: { outProgress: 0 }
                            },
                            context: {
                                boundaries: { x: 0, y: 0, width: VIDEO_WIDTH, height: VIDEO_HEIGHT, zIndex: 4 },
                                timing: { startFrame: 0, durationFrames: 90, delay: 0 },
                                hierarchy: { depth: 2, parentIds: ['main-scene', 'logo-container'], childIds: [] },
                                remotion: {
                                    currentFrame: 0,
                                    fps: VIDEO_FPS,
                                    composition: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT, duration: DURATION_IN_FRAMES }
                                }
                            }
                        }
                    ]
                },
                {
                    id: 'text-container',
                    type: 'layout',
                    data: { layoutType: 'overlay', alignment: 'center' },
                    context: {
                        boundaries: { x: 0, y: 0, width: VIDEO_WIDTH, height: VIDEO_HEIGHT, zIndex: 5 },
                        timing: { startFrame: 45, durationFrames: 155, delay: 0 },
                        hierarchy: { depth: 1, parentIds: ['main-scene'], childIds: [] },
                        remotion: {
                            currentFrame: 0,
                            fps: VIDEO_FPS,
                            composition: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT, duration: DURATION_IN_FRAMES }
                        }
                    },
                    children: [
                        {
                            id: 'title-text',
                            type: 'atom',
                            data: {
                                atomType: 'custom',
                                component: AdvancedTextFade,
                                props: { children: title }
                            },
                            context: {
                                boundaries: { x: 0, y: 0, width: VIDEO_WIDTH, height: VIDEO_HEIGHT, zIndex: 6 },
                                timing: { startFrame: 45, durationFrames: 155, delay: 0 },
                                hierarchy: { depth: 2, parentIds: ['main-scene', 'text-container'], childIds: [] },
                                remotion: {
                                    currentFrame: 0,
                                    fps: VIDEO_FPS,
                                    composition: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT, duration: DURATION_IN_FRAMES }
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
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
            duration={DURATION_IN_FRAMES}
            fps={VIDEO_FPS}
            style={{ backgroundColor: 'white' }}
        />
    );
};

export default AdvancedNextJsComposition; 