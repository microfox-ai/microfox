// Type definitions

import { z } from 'zod';

export const SunoMusicOptions = z.object({
  lyrics: z.string().optional(),
  style: z.string().optional(),
  excludeStyles: z.string().optional(),
  isInstrumental: z.boolean().optional(),
});

export type SunoMusicOptions = z.infer<typeof SunoMusicOptions>;
