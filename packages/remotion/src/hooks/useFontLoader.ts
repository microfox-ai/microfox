import { useState, useEffect, useCallback } from 'react';
import {
  loadGoogleFont,
  loadMultipleFonts,
  isFontLoaded,
  FontLoadingOptions,
} from '../utils/fontUtils';

export interface UseFontLoaderOptions {
  preload?: boolean;
  onLoad?: (fontFamily: string) => void;
  onError?: (fontFamily: string, error: Error) => void;
}

export interface FontLoaderState {
  loadedFonts: Set<string>;
  loadingFonts: Set<string>;
  errorFonts: Map<string, Error>;
}

/**
 * Hook for managing dynamic font loading in Remotion components
 */
export const useFontLoader = (options: UseFontLoaderOptions = {}) => {
  const [state, setState] = useState<FontLoaderState>({
    loadedFonts: new Set(),
    loadingFonts: new Set(),
    errorFonts: new Map(),
  });

  const loadFont = useCallback(
    async (
      fontFamily: string,
      fontOptions: FontLoadingOptions = {}
    ): Promise<void> => {
      if (
        state.loadedFonts.has(fontFamily) ||
        state.loadingFonts.has(fontFamily)
      ) {
        return;
      }

      setState((prev) => ({
        ...prev,
        loadingFonts: new Set(prev.loadingFonts).add(fontFamily),
      }));

      try {
        await loadGoogleFont(fontFamily, fontOptions);

        setState((prev) => ({
          ...prev,
          loadedFonts: new Set(prev.loadedFonts).add(fontFamily),
          loadingFonts: new Set(
            [...prev.loadingFonts].filter((f) => f !== fontFamily)
          ),
        }));

        options.onLoad?.(fontFamily);
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));

        setState((prev) => ({
          ...prev,
          errorFonts: new Map(prev.errorFonts).set(fontFamily, errorObj),
          loadingFonts: new Set(
            [...prev.loadingFonts].filter((f) => f !== fontFamily)
          ),
        }));

        options.onError?.(fontFamily, errorObj);
      }
    },
    [state.loadedFonts, state.loadingFonts, options]
  );

  const loadMultipleFonts = useCallback(
    async (
      fonts: Array<{ family: string; options?: FontLoadingOptions }>
    ): Promise<void> => {
      const fontsToLoad = fonts.filter(
        ({ family }) =>
          !state.loadedFonts.has(family) && !state.loadingFonts.has(family)
      );

      if (fontsToLoad.length === 0) {
        return;
      }

      // Add all fonts to loading state
      setState((prev) => ({
        ...prev,
        loadingFonts: new Set([
          ...prev.loadingFonts,
          ...fontsToLoad.map((f) => f.family),
        ]),
      }));

      try {
        await loadMultipleFonts(fontsToLoad);

        setState((prev) => ({
          ...prev,
          loadedFonts: new Set([
            ...prev.loadedFonts,
            ...fontsToLoad.map((f) => f.family),
          ]),
          loadingFonts: new Set(
            [...prev.loadingFonts].filter(
              (f) => !fontsToLoad.some((ftl) => ftl.family === f)
            )
          ),
        }));

        fontsToLoad.forEach(({ family }) => options.onLoad?.(family));
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error));

        setState((prev) => ({
          ...prev,
          errorFonts: new Map(prev.errorFonts).set('multiple', errorObj),
          loadingFonts: new Set(
            [...prev.loadingFonts].filter(
              (f) => !fontsToLoad.some((ftl) => ftl.family === f)
            )
          ),
        }));

        options.onError?.('multiple', errorObj);
      }
    },
    [state.loadedFonts, state.loadingFonts, options]
  );

  const isFontReady = useCallback(
    (fontFamily: string): boolean => {
      return state.loadedFonts.has(fontFamily);
    },
    [state.loadedFonts]
  );

  const areFontsReady = useCallback(
    (fontFamilies: string[]): boolean => {
      return fontFamilies.every((family) => state.loadedFonts.has(family));
    },
    [state.loadedFonts]
  );

  const getFontError = useCallback(
    (fontFamily: string): Error | undefined => {
      return state.errorFonts.get(fontFamily);
    },
    [state.errorFonts]
  );

  const clearErrors = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      errorFonts: new Map(),
    }));
  }, []);

  return {
    // State
    loadedFonts: state.loadedFonts,
    loadingFonts: state.loadingFonts,
    errorFonts: state.errorFonts,

    // Actions
    loadFont,
    loadMultipleFonts,
    isFontReady,
    areFontsReady,
    getFontError,
    clearErrors,
  };
};

/**
 * Hook for loading a single font with automatic loading
 */
export const useFont = (
  fontFamily: string,
  options: FontLoadingOptions & UseFontLoaderOptions = {}
) => {
  const { loadFont, isFontReady, getFontError, ...rest } =
    useFontLoader(options);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadFontAsync = async () => {
      try {
        await loadFont(fontFamily, options);
        setIsLoaded(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoaded(false);
      }
    };

    if (!isFontReady(fontFamily)) {
      loadFontAsync();
    } else {
      setIsLoaded(true);
    }
  }, [fontFamily, loadFont, isFontReady, options]);

  return {
    isLoaded,
    error,
    isReady: isFontReady(fontFamily),
    ...rest,
  };
};
