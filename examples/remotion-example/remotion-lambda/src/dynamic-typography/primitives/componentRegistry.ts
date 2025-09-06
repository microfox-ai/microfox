"use client";
import React, { forwardRef, ComponentType } from "react";
import { BaseAtomProps } from "./types";
import { DefaultTextAtom } from "../custom-atoms/DefaultTextAtom";
import { CoolGlowAtom } from "../custom-atoms/CoolGlowAtom";

// Adjust the type to correctly handle ForwardRef components
export const componentRegistry: Record<string, ComponentType<any>> = {
  default: DefaultTextAtom,
  "cool-glow": CoolGlowAtom,
  // Register all your other custom atoms here
};
