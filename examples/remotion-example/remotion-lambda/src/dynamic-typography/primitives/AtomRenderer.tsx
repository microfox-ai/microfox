'use client';
import React, { forwardRef } from 'react';
import { BaseAtomProps } from './types';
import { componentRegistry } from './componentRegistry';

export const AtomRenderer = forwardRef<HTMLElement, Omit<BaseAtomProps, 'ref'>>(
    ({ data, ...props }, ref) => {
        const ComponentToRender = componentRegistry[data.component] || componentRegistry.default;

        if (!ComponentToRender) {
            return null; // or a fallback component
        }

        return <ComponentToRender ref={ref} data={data} {...props} />;
    }
);
AtomRenderer.displayName = "AtomRenderer"; 