'use client';
import React, { forwardRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { BaseAtomProps } from '../primitives/types';
import { merge } from 'lodash-es';

export const CoolGlowAtom = forwardRef<HTMLDivElement, BaseAtomProps>(
    ({ data, overrideStyle }, ref) => {
        // This component defines its own animation variants.
        const customVariants: Variants = {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
        };

        // Separate the transition from the rest of the animation config from data.
        const { transition: dataTransition, ...restDataAnimation } = data.animation || {};

        // Merge the variant-specific properties.
        const finalVariants: Variants = merge({}, customVariants, restDataAnimation);

        // Merge the transitions separately, with the override from the layout taking precedence.
        const finalTransition = merge({}, dataTransition, data.timing);

        return (
            <motion.div
                ref={ref}
                style={{ ...data.style, ...overrideStyle }}
                variants={finalVariants}
                initial="initial"
                animate="animate"
                transition={finalTransition}
            >
                {data.text}
            </motion.div>
        );
    }
);
CoolGlowAtom.displayName = "CoolGlowAtom"; 