import { z } from 'zod';
import { useContext } from 'react';
import { LayoutContext } from '../core/types/transition.types';

export function buildLayoutHook<T extends z.ZodSchema>(
  schema: T,
  defaultValue: z.infer<T>
) {
  return () => {
    const context = useContext(LayoutContext);

    if (!context) {
      // Return default values when not in a transition context
      return defaultValue;
    }

    try {
      // Validate the context data against the schema
      const validatedData = schema.parse(context);
      return validatedData;
    } catch (error) {
      // If validation fails, return default values
      console.warn('Transition data validation failed, using defaults:', error);
      return defaultValue;
    }
  };
}
