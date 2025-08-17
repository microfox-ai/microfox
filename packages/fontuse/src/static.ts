import { Font, UseCaseWithFont } from './schemas/types';

export const getRecommendedPairing = (
  usecase: UseCaseWithFont
): {
  pairingFont: string | null;
  pairingType: 'lower' | 'upper';
} | null => {
  if (!usecase.font) return null;
  const font = usecase.font;
  const pairingType =
    usecase.font &&
    usecase.font.readabilityScore &&
    usecase.font.readabilityScore < 4
      ? 'lower'
      : 'upper';
  const pairingFont =
    pairingType === 'lower'
      ? usecase.pairing?.pairing_lower?.length > 0
        ? usecase.pairing?.pairing_lower[0]
        : null
      : usecase.pairing?.pairing_upper?.length > 0
        ? usecase.pairing?.pairing_upper[0]
        : null;

  if (!pairingFont) {
    if (usecase.pairing?.pairing_lower?.length > 0) {
      return {
        pairingFont: usecase.pairing?.pairing_lower[0],
        pairingType: 'lower',
      };
    }
    if (usecase.pairing?.pairing_upper?.length > 0) {
      return {
        pairingFont: usecase.pairing?.pairing_upper[0],
        pairingType: 'upper',
      };
    }
  }
  return {
    pairingFont,
    pairingType,
  };
};

export const createGoogleFontUrl = (
  font: Font | null | undefined
): string | null => {
  if (!font?.name) return null;

  const fontName = font.name.replace(/ /g, '+');

  if (!font.fonts || font.fonts.length === 0) {
    return `https://fonts.googleapis.com/css2?family=${fontName}:wght@400&display=swap`;
  }

  const hasItalic = font.fonts.some((f) => f.style === 'italic');

  if (!hasItalic) {
    const weights = [
      ...new Set(font.fonts.map((f) => f.weight).filter(Boolean)),
    ];
    if (weights.length === 0) weights.push(400);
    return `https://fonts.googleapis.com/css2?family=${fontName}:wght@${weights.join(';')}&display=swap`;
  }

  // Has italics. Format is family=Name:ital,wght@ital_val,weight;...
  const weightPairs = new Set<string>();
  font.fonts.forEach((f) => {
    const weight = f.weight || 400;
    if (f.style === 'italic') {
      weightPairs.add(`1,${weight}`);
    } else {
      // normal or undefined style
      weightPairs.add(`0,${weight}`);
    }
  });

  if (weightPairs.size > 0) {
    return `https://fonts.googleapis.com/css2?family=${fontName}:ital,wght@${Array.from(weightPairs).join(';')}&display=swap`;
  }

  // Fallback
  return `https://fonts.googleapis.com/css2?family=${fontName}&display=swap`;
};
