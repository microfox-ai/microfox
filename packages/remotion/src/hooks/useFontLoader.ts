import { useState, useEffect, useCallback } from 'react';
import {
  loadGoogleFont,
  loadMultipleFonts,
  isFontLoaded,
  getLoadedFontFamily,
  FontLoadingOptions,
} from '../utils/fontUtils';

export interface UseFontLoaderOptions {
  preload?: boolean;
  onLoad?: (fontFamily: string, cssValue: string) => void;
  onError?: (fontFamily: string, error: Error) => void;
}

export interface FontLoaderState {
  loadedFonts: Map<string, string>; // fontFamily -> CSS value
  loadingFonts: Set<string>;
  errorFonts: Map<string, Error>;
}

/**
 * Hook for managing dynamic font loading in Remotion components
 */
export const useFontLoader = (options: UseFontLoaderOptions = {}) => {
  const [state, setState] = useState<FontLoaderState>({
    loadedFonts: new Map(),
    loadingFonts: new Set(),
    errorFonts: new Map(),
  });

  const loadFont = useCallback(
    async (
      fontFamily: string,
      fontOptions: FontLoadingOptions = {}
    ): Promise<string> => {
      const fontKey = `${fontFamily}-${JSON.stringify(fontOptions)}`;

      if (
        state.loadedFonts.has(fontKey) ||
        state.loadingFonts.has(fontFamily)
      ) {
        return state.loadedFonts.get(fontKey) || `"${fontFamily}", sans-serif`;
      }

      setState((prev) => ({
        ...prev,
        loadingFonts: new Set(prev.loadingFonts).add(fontFamily),
      }));

      try {
        const cssValue = await loadGoogleFont(fontFamily, fontOptions);

        if (cssValue !== null) {
          setState((prev) => ({
            ...prev,
            loadedFonts: new Map(prev.loadedFonts).set(fontKey, cssValue),
            loadingFonts: new Set(
              [...prev.loadingFonts].filter((f) => f !== fontFamily)
            ),
          }));

          options.onLoad?.(fontFamily, cssValue);
          return cssValue;
        } else {
          throw new Error(
            `Font Package @remotion/google-fonts/${fontFamily} not found`
          );
        }
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

        // Return fallback
        const fallbackValue = `"${fontFamily}", sans-serif`;
        return fallbackValue;
      }
    },
    [state.loadedFonts, state.loadingFonts, options]
  );

  const loadMultipleFonts = useCallback(
    async (
      fonts: Array<{ family: string; options?: FontLoadingOptions }>
    ): Promise<Map<string, string>> => {
      const fontsToLoad = fonts.filter(({ family, options = {} }) => {
        const fontKey = `${family}-${JSON.stringify(options)}`;
        return (
          !state.loadedFonts.has(fontKey) && !state.loadingFonts.has(family)
        );
      });

      if (fontsToLoad.length === 0) {
        return state.loadedFonts;
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
        const fontMap = await loadMultipleFonts(fontsToLoad);

        // Update state with new fonts using proper keys
        const newFontsMap = new Map<string, string>();
        fontsToLoad.forEach(({ family, options = {} }) => {
          const fontKey = `${family}-${JSON.stringify(options)}`;
          const cssValue = fontMap.get(family);
          if (cssValue) {
            newFontsMap.set(fontKey, cssValue);
          }
        });

        setState((prev) => ({
          ...prev,
          loadedFonts: new Map([...prev.loadedFonts, ...newFontsMap]),
          loadingFonts: new Set(
            [...prev.loadingFonts].filter(
              (f) => !fontsToLoad.some((ftl) => ftl.family === f)
            )
          ),
        }));

        fontsToLoad.forEach(({ family }) => {
          const cssValue = fontMap.get(family);
          if (cssValue) {
            options.onLoad?.(family, cssValue);
          }
        });

        return fontMap;
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

        // Return current loaded fonts
        return state.loadedFonts;
      }
    },
    [state.loadedFonts, state.loadingFonts, options]
  );

  const isFontReady = useCallback(
    (fontFamily: string, options: FontLoadingOptions = {}): boolean => {
      const fontKey = `${fontFamily}-${JSON.stringify(options)}`;
      return state.loadedFonts.has(fontKey);
    },
    [state.loadedFonts]
  );

  const areFontsReady = useCallback(
    (
      fontFamilies: Array<{ family: string; options?: FontLoadingOptions }>
    ): boolean => {
      return fontFamilies.every(({ family, options = {} }) => {
        const fontKey = `${family}-${JSON.stringify(options)}`;
        return state.loadedFonts.has(fontKey);
      });
    },
    [state.loadedFonts]
  );

  const getFontFamily = useCallback(
    (
      fontFamily: string,
      options: FontLoadingOptions = {}
    ): string | undefined => {
      const fontKey = `${fontFamily}-${JSON.stringify(options)}`;
      return state.loadedFonts.get(fontKey);
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
    getFontFamily,
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
  const { loadFont, isFontReady, getFontFamily, getFontError, ...rest } =
    useFontLoader(options);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize fontFamilyValue from cache if available, otherwise use fallback
  const initialFontFamily =
    getFontFamily(fontFamily, options) || `"${fontFamily}", sans-serif`;
  const [fontFamilyValue, setFontFamilyValue] =
    useState<string>(initialFontFamily);

  useEffect(() => {
    const loadFontAsync = async () => {
      try {
        const cssValue = await loadFont(fontFamily, options);
        setFontFamilyValue(cssValue);
        setIsLoaded(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoaded(false);
      }
    };

    if (!isFontReady(fontFamily, options)) {
      loadFontAsync();
    } else {
      const cachedValue = getFontFamily(fontFamily, options);
      if (cachedValue) {
        setFontFamilyValue(cachedValue);
      }
      setIsLoaded(true);
    }
  }, [fontFamily, loadFont, isFontReady, getFontFamily, options]);

  return {
    isLoaded,
    error,
    isReady: isFontReady(fontFamily, options),
    fontFamily: fontFamilyValue,
    ...rest,
  };
};
