import React from 'react';
import { Composition } from '../src/components/Composition';

// Example showing how to use effects
const effectsExample = {
    id: 'root',
    componentId: 'scene',
    type: 'scene' as const,
    childrenData: [
        {
            id: 'text-with-blur',
            componentId: 'text',
            type: 'atom' as const,
            data: {
                text: 'Hello World',
                fontSize: 48,
                color: '#ffffff'
            },
            effects: [
                {
                    id: 'blur-effect',
                    componentId: 'BlurEffect',
                    data: { blur: 3 }
                }
            ]
        },
        {
            id: 'text-with-multiple-effects',
            componentId: 'text',
            type: 'atom' as const,
            data: {
                text: 'Multiple Effects',
                fontSize: 36,
                color: '#ff0000'
            },
            effects: [
                'BlurEffect', // String-based effect with default parameters
                {
                    id: 'custom-blur',
                    componentId: 'BlurEffect',
                    data: { blur: 8 }
                }
            ]
        }
    ]
};

export const EffectsExample: React.FC = () => {
    return (
        <Composition
            id="effects-example"
            componentId="scene"
            type="scene"
            width={1920}
            height={1080}
            fps={30}
            duration={2} // 2 seconds
            childrenData={effectsExample.childrenData}
        />
    );
}; 