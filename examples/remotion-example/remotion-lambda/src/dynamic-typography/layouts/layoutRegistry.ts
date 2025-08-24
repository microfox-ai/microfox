import { ComponentType } from "react";
import { BaseLayoutProps } from "../primitives/types";
import { VerticalFillLayout } from "./VerticalFillLayout";

export const layoutRegistry: Record<string, ComponentType<BaseLayoutProps>> = {
  "vertical-fill": VerticalFillLayout,
  // Register other layouts here
};
