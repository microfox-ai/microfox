import { Font } from "@microfox/fontuse";

export interface FontPairing {
  main: Font;
  sub: Font;
}

export const getFontFamily = (font: Font) => {
  return `${font.id
    ?.replace(/_/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")}, ${font.category.toLowerCase()}`;
};
