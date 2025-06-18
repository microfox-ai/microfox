import { z } from 'zod';
import * as schemas from '../schemas/listings';

export type GetBest = z.infer<typeof schemas.getBestSchema>;
export type GetById = z.infer<typeof schemas.getByIdSchema>;
export type GetComments = z.infer<typeof schemas.getCommentsSchema>;
export type GetDuplicates = z.infer<typeof schemas.getDuplicatesSchema>;
export type GetHot = z.infer<typeof schemas.getHotSchema>;
export type GetNew = z.infer<typeof schemas.getNewSchema>;
export type GetRising = z.infer<typeof schemas.getRisingSchema>;
export type GetSorted = z.infer<typeof schemas.getSortedSchema>; 