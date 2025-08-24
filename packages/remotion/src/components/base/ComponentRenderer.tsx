import React, { createContext, useContext } from 'react';
import { AbsoluteFill, Sequence, Series, useVideoConfig } from 'remotion';
import { getComponent, getComponentConfig } from '../../core/registry';
import { BaseRenderableData, CalculatedBoundaries, CalculatedTiming, Hierarchy, InternalRenderableContext, RenderableContext } from '../../core/types';
import { calculateTiming } from '../../core/registry/timing';

// Create a context for passing down calculated values
const RenderContext = createContext<RenderableContext | null>(null);

export const useRenderContext = () => {
    const context = useContext(RenderContext);
    if (!context) {
        throw new Error('useRenderContext must be used within a ComponentRenderer');
    }
    return context;
};


export const ComponentRenderer: React.FC<BaseRenderableData> = ({
    id,
    componentId,
    type,
    data,
    childrenData,
    context
}) => {
    const videoConfig = useVideoConfig();

    // Establish a default root context if we are at the top of the tree
    const defaultContext: RenderableContext = {
        boundaries: {
            left: 0,
            top: 0,
            width: videoConfig.width,
            height: videoConfig.height,
            zIndex: 0,
        },
        timing: {
            startInFrames: 0,
            durationInFrames: videoConfig.durationInFrames,
        },
        hierarchy: {
            depth: 0,
            parentIds: [],
        },
    };

    if (!context) {
        context = {
            boundaries: defaultContext.boundaries,
            hierarchy: defaultContext.hierarchy,
        };
    }

    // Calculate new context for children
    const newHierarchy = {
        depth: (context.hierarchy?.depth || 0) + 1,
        parentIds: [...(context.hierarchy?.parentIds || []), id],
    };

    // Calculate timing
    let newTiming: CalculatedTiming = calculateTiming(type, context, videoConfig);
    const newContext: InternalRenderableContext = {
        ...context,
        hierarchy: (newHierarchy || context.hierarchy) as Hierarchy,
        timing: (newTiming || context.timing) as CalculatedTiming,
        boundaries: (context.boundaries || defaultContext.boundaries) as CalculatedBoundaries,
    };

    const ComponentClass = getComponent(componentId);

    if (type === 'scene') {
        return (
            <RenderContext.Provider value={newContext}>
                <Series>
                    {childrenData?.map((child) => {
                        const childTiming = calculateTiming(child.type, child?.context || defaultContext, videoConfig);
                        return (
                            <Series.Sequence
                                key={child.id}
                                name={child.componentId + " - " + child.id}
                                offset={childTiming.startInFrames ?? 0}
                                durationInFrames={childTiming.durationInFrames ?? 0}>
                                <ComponentRenderer key={child.id} {...child} />
                            </Series.Sequence>
                        )
                    })}
                </Series>
            </RenderContext.Provider>
        );
    }


    if (!ComponentClass) {
        console.warn(`Component type ${id} not found in registry`);
        return null;
    }
    const props = { id, componentId, data, context: newContext };

    if (type === 'frame' || type === 'layout') {

        const config = getComponentConfig(componentId);

        const isInnerSequence = config?.isInnerSequence;

        if (isInnerSequence) {
            return (
                <RenderContext.Provider value={newContext}>
                    <ComponentClass {...props}>{childrenData?.map((child) => (
                        <ComponentRenderer key={child.id} {...child} />
                    ))}</ComponentClass>
                </RenderContext.Provider>
            );
        }

        return (
            <RenderContext.Provider value={newContext}>
                <Sequence name={componentId + " - " + id} from={newTiming.startInFrames} durationInFrames={newTiming.durationInFrames}>
                    <ComponentClass {...props}>{childrenData?.map((child) => (
                        <ComponentRenderer key={child.id} {...child} />
                    ))}</ComponentClass>
                </Sequence>
            </RenderContext.Provider>
        );
    }

    if (type === 'atom') {

        if (newTiming.durationInFrames && newTiming.durationInFrames > 0) {
            return (
                <RenderContext.Provider value={newContext}>
                    <Sequence name={componentId + " - " + id} from={newTiming.startInFrames} durationInFrames={newTiming.durationInFrames}>
                        <ComponentClass {...props} />
                    </Sequence>
                </RenderContext.Provider>
            );
        }

        return (
            <RenderContext.Provider value={newContext}>
                <ComponentClass {...props} />
            </RenderContext.Provider>
        );
    }
}; 