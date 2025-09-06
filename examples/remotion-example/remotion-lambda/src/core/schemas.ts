import { z } from "zod";

// --- AssemblyAI Schemas ---
export const AssemblyAIWordSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
  confidence: z.number(),
});

export const AssemblyAIUtteranceSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
  words: z.array(AssemblyAIWordSchema),
});

// --- Transcription Schemas ---
export const WordSchema = z.object({
  word: z.string(),
  startTime: z.number(),
  endTime: z.number(),
});

export const WordEntrySchema = z.object({
  word: z.string(),
  startTime: z.number(),
  endTime: z.number(),
  color: z.string().optional(),
  fontWeight: z.string().optional(),
  animationType: z.string().optional(),
  customAnimation: z.string().optional(),
});

export const CaptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  startTime: z.number(),
  endTime: z.number(),
  words: z.array(WordSchema),
});

// --- Layout Schemas ---
export const LayoutNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    type: z.enum(["container", "word"]),
    content: z.string().optional(),
    className: z.string().optional(),
    children: z.array(LayoutNodeSchema).optional(),
  })
);

export const DeclarativeTemplateSchema = z.object({
  name: z.string(),
  root: LayoutNodeSchema,
});

// --- AI-Enhanced Schema ---
export const AIEnhancedCaptionSchema = CaptionSchema.extend({
  focusWord: z.string(),
  layout: DeclarativeTemplateSchema,
});

// --- Positioning Schema ---
export const PositioningOptionsSchema = z.object({
  horizontal: z.enum(["left", "center", "right", "justify-between", "justify-around", "justify-evenly"]).default("center"),
  vertical: z.enum(["top", "center", "bottom", "justify-between", "justify-around", "justify-evenly"]).default("center"),
  distribution: z.enum(["flex", "grid"]).default("flex"),
});

// --- Layout Generation Schemas ---
export const LayoutGenerationRequestSchema = z.object({
  sentence: z.string(),
  focus_word: z.string(),
  targets: z.object({
    width: z.number(),
    height: z.number(),
  }),
  reference_layout: DeclarativeTemplateSchema,
  background_color: z.string(),
  positioning: PositioningOptionsSchema.optional(),
});

export const AILayoutGenerationRequestSchema = LayoutGenerationRequestSchema.omit({
  reference_layout: true,
});

// --- Inferred Types ---
export type AssemblyAIWord = z.infer<typeof AssemblyAIWordSchema>;
export type AssemblyAIUtterance = z.infer<typeof AssemblyAIUtteranceSchema>;
export type Word = z.infer<typeof WordSchema>;
export type WordEntry = z.infer<typeof WordEntrySchema>;
export type Caption = z.infer<typeof CaptionSchema>;
export type DeclarativeTemplate = z.infer<typeof DeclarativeTemplateSchema>;
export type AIEnhancedCaption = z.infer<typeof AIEnhancedCaptionSchema>;
export type PositioningOptions = z.infer<typeof PositioningOptionsSchema>;
export type LayoutGenerationRequest = z.infer<typeof LayoutGenerationRequestSchema>;
export type AILayoutGenerationRequest = z.infer<typeof AILayoutGenerationRequestSchema>;
export type LayoutNode = z.infer<typeof LayoutNodeSchema>; 
