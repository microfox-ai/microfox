'use client';
import React, { forwardRef } from 'react';
import { motion, MotionProps, Variants } from 'framer-motion';
import { BaseAtomProps } from '../primitives/types';
import { merge } from 'lodash-es';

const motionComponents = { div: motion.div, p: motion.p, span: motion.span };

export const DefaultTextAtom = forwardRef<HTMLElement, BaseAtomProps>(
    ({ data, overrideStyle }, ref) => {
        const { as = 'div', style, text } = data;
        const MotionComponent = motionComponents[as];
        // This component defines its own animation variants.
        const customVariants: Variants = {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
        };

        // Separate the transition from the rest of the animation config from data.
        const { transition: dataTransition, ...restDataAnimation } = data.animation || {};

        // Merge the variant-specific properties.
        const finalVariants: Variants = merge({}, customVariants, restDataAnimation);

        // Merge the transitions separately, with the override from the layout taking precedence.
        const finalTransition = merge({}, dataTransition, data.timing);

        return (
            <MotionComponent
                ref={ref as any}
                style={{ ...data.style, ...overrideStyle }}
                variants={finalVariants}
                initial="initial"
                animate="animate"
                transition={finalTransition}
            >
                {text}
            </MotionComponent>
        );
    }
);
DefaultTextAtom.displayName = "DefaultTextAtom"; 