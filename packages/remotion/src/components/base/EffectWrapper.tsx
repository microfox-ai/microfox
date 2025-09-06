import React from 'react';
import { getComponent } from '../../core/registry';
import { BaseEffect, InternalRenderableContext } from '../../core/types';

interface EffectWrapperProps {
    effects?: BaseEffect[];
    children: React.ReactNode;
    context: InternalRenderableContext;
}

export const EffectWrapper: React.FC<EffectWrapperProps> = ({
    effects,
    children,
    context
}) => {
    if (!effects || effects.length === 0) {
        return children;
    }

    // Apply effects in order (first effect wraps the children, subsequent effects wrap the previous result)
    let wrappedContent = children;

    effects.forEach((effect, index) => {
        const effectId = typeof effect === 'string' ? `effect-${effect}` : `effect-${effect.componentId}`;
        const EffectComponent = getComponent(effectId);

        if (!EffectComponent) {
            console.warn(`Effect component ${effectId} not found in registry`);
            return;
        }

        const effectData = typeof effect === 'string' ? {} : (effect.data || {});
        const effectContext = typeof effect === 'string' ? context : (effect.context || context);

        const effectProps = {
            id: typeof effect === 'string' ? `effect-${index}` : effect.id,
            componentId: effectId,
            type: 'layout' as const, // Effects use the same rendering logic as layout
            data: effectData,
            context: effectContext,
            children: wrappedContent
        };

        wrappedContent = <EffectComponent {...effectProps} />;
    });

    return <>{wrappedContent}</>;
}; 