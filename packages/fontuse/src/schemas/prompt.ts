import { z } from 'zod';

// Zod schema for structured output validation
export const fontUsecaseSchema = z.object({
  useCases: z
    .array(
      z.object({
        title: z
          .string()
          .describe(
            "A catchy title for the use case, e.g., 'Modern Tech Startup Branding'."
          ),
        description: z
          .string()
          .describe(
            'A 100-word descriptive use case for RAG search. Should be detailed and evocative.'
          ),
        industryKeywords: z
          .array(z.string())
          .describe(
            "Keywords for industries where this font fits, e.g., ['Technology', 'Healthcare', 'Education']."
          ),
        audienceKeywords: z
          .array(z.string())
          .describe(
            "Keywords for target audiences, e.g., ['Children', 'Young Adults', 'Academics']."
          ),
        toneAndFeelKeywords: z
          .array(z.string())
          .describe(
            "Keywords for the font's tone, e.g., ['Friendly', 'Formal', 'Playful', 'Authoritative']."
          ),
        pairing: z
          .object({
            pairing_lower: z
              .array(z.string())
              .describe(
                'Body fonts that pair well when this font is used for headings.'
              ),
            pairing_upper: z
              .array(z.string())
              .describe(
                'Heading fonts that pair well when this font is used for body text.'
              ),
          })
          .describe('Font pairing suggestions for this specific use case.'),
      })
    )
    .min(3)
    .describe('At least 3 detailed use cases for the font.'),
  scores: z.object({
    popularity: z
      .number()
      .min(1)
      .max(10)
      .describe(
        "An estimated 1-10 score of the font's general popularity, where 1 is obscure and 10 is ubiquitous."
      ),
    designScore: z
      .number()
      .min(1)
      .max(10)
      .describe(
        'An estimated 1-10 score of how suitable the font is for professional design work, considering its versatility, quality, and aesthetic appeal.'
      ),
    readabilityScore: z
      .number()
      .min(1)
      .max(10)
      .describe(
        'An estimated 1-10 score for the readability of the font, especially for long-form text. High scores for fonts with clear letterforms and good spacing.'
      ),
  }),
  properties: z.object({
    allCaps: z
      .boolean()
      .describe(
        'Indicates if the font is effective or designed to be used in all-caps settings.'
      ),
  }),
});

export type FontUsecase = z.infer<typeof fontUsecaseSchema>;
