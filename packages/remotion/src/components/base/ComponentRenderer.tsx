import React, { createContext, useContext } from 'react';
import { Sequence, Series, useVideoConfig } from 'remotion';
import { useComposition } from '../../core/context';
import { getComponent, getComponentConfig } from '../../core/registry';
import { BaseRenderableData, CalculatedBoundaries, CalculatedTiming, InternalRenderableContext, RenderableContext } from '../../core/types';
import { calculateHierarchy, calculateTimingWithInheritance } from '../../core/utils/hierarchyUtils';
import { EffectWrapper } from './EffectWrapper';

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
    context,
    effects
}) => {
    const videoConfig = useVideoConfig();
    const { root } = useComposition();

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
        };
    }


    // Calculate new hierarchy based on position in root data
    const newHierarchy = calculateHierarchy(root, id, context ?? defaultContext);


    // Calculate timing with inheritance from parent
    const componentData = {
        id,
        componentId,
        type,
        data,
        childrenData,
        context,
        effects
    };
    let newTiming: CalculatedTiming = calculateTimingWithInheritance(componentData, root, videoConfig);


    const newContext: InternalRenderableContext = {
        ...context,
        boundaries: (context?.boundaries) as CalculatedBoundaries,
        hierarchy: newHierarchy,
        timing: newTiming
    };

    const ComponentClass = getComponent(componentId);

    if (type === 'scene') {
        return (
            <RenderContext.Provider value={newContext}>
                <Series>
                    {childrenData?.map((child) => {
                        // reverse should happen here, not based on toot layout actually
                        const childTiming = calculateTimingWithInheritance(child, root, videoConfig);
                        return (
                            <Series.Sequence
                                key={child.id}
                                name={child.componentId + " - " + child.id}
                                offset={childTiming.startInFrames ?? 0}
                                durationInFrames={childTiming.durationInFrames ?? 0}>
                                {child.effects && child.effects.length > 0 ? (
                                    <EffectWrapper effects={child.effects} context={newContext}>
                                        <ComponentRenderer key={child.id} {...child} />
                                    </EffectWrapper>
                                ) : (
                                    <ComponentRenderer key={child.id} {...child} />
                                )}
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
    const props = {
        id, componentId, data, context: context
    };

    if (type === 'layout') {

        const config = getComponentConfig(componentId);

        const isInnerSequence = config?.isInnerSequence;

        if (isInnerSequence) {
            return (
                <RenderContext.Provider value={newContext}>
                    <ComponentClass {...props}>
                        {effects && effects.length > 0 ? (
                            <EffectWrapper effects={effects} context={newContext}>
                                {childrenData?.map((child) => (
                                    <ComponentRenderer key={child.id} {...child} />
                                ))}
                            </EffectWrapper>
                        ) : (
                            childrenData?.map((child) => (
                                <ComponentRenderer key={child.id} {...child} />
                            ))
                        )}
                    </ComponentClass>
                </RenderContext.Provider>
            );
        }

        return (
            <RenderContext.Provider value={newContext}>
                <Sequence layout='none' name={componentId + " - " + id} from={newTiming.startInFrames} durationInFrames={newTiming.durationInFrames}>
                    <ComponentClass {...props}>
                        {effects && effects.length > 0 ? (
                            <EffectWrapper effects={effects} context={newContext}>
                                {childrenData?.map((child) => (
                                    <ComponentRenderer key={child.id} {...child} />
                                ))}
                            </EffectWrapper>
                        ) : (
                            childrenData?.map((child) => (
                                <ComponentRenderer key={child.id} {...child} />
                            ))
                        )}
                    </ComponentClass>
                </Sequence>
            </RenderContext.Provider>
        );
    }

    if (type === 'atom') {

        if (newTiming.durationInFrames && newTiming.durationInFrames > 0) {
            return (
                <RenderContext.Provider value={newContext}>
                    <Sequence layout='none' name={componentId + " - " + id} from={newTiming.startInFrames} durationInFrames={newTiming.durationInFrames}>
                        {effects && effects.length > 0 ? (
                            <EffectWrapper effects={effects} context={newContext}>
                                <ComponentClass {...props} />
                            </EffectWrapper>
                        ) : (
                            <ComponentClass {...props} />
                        )}
                    </Sequence>
                </RenderContext.Provider>
            );
        }

        return (
            <RenderContext.Provider value={newContext}>
                {effects && effects.length > 0 ? (
                    <EffectWrapper effects={effects} context={newContext}>
                        <ComponentClass {...props} />
                    </EffectWrapper>
                ) : (
                    <ComponentClass {...props} />
                )}
            </RenderContext.Provider>
        );
    }
}; 