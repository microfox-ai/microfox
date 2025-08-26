import React, { createContext, useContext } from 'react';
import { RenderableComponentData } from '../types';

interface CompositionContextValue {
    root?: RenderableComponentData[];
    duration: number;
}

const CompositionContext = createContext<CompositionContextValue | null>(null);

interface CompositionProviderProps {
    children: React.ReactNode;
    value: CompositionContextValue;
}

export const CompositionProvider: React.FC<CompositionProviderProps> = ({ children, value }) => {
    return (
        <CompositionContext.Provider value={value}>
            {children}
        </CompositionContext.Provider>
    );
};

export const useComposition = (): CompositionContextValue => {
    const context = useContext(CompositionContext);
    if (!context) {
        throw new Error('useComposition must be used within a CompositionProvider');
    }
    return context;
}; 