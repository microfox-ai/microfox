import React, { createContext, useContext } from 'react';
import {
  BaseRenderableProps,
  RenderableComponentData,
} from './renderable.types';

export interface LayoutData {
  [key: string]: any;
}

export const LayoutContext = createContext<LayoutData | null>(null);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

export interface LayoutProps extends BaseRenderableProps {
  children: React.ReactNode | React.ReactNode[];
}
