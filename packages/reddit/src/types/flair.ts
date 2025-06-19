import { z } from 'zod';
import * as schemas from '../schemas/flair';

export type FlairType = z.infer<typeof schemas.flairTypeSchema>;
export type FlairPosition = z.infer<typeof schemas.flairPositionSchema>;
export type ClearFlairTemplates = z.infer<typeof schemas.clearFlairTemplatesSchema>;
export type DeleteFlair = z.infer<typeof schemas.deleteFlairSchema>;
export type DeleteFlairTemplate = z.infer<typeof schemas.deleteFlairTemplateSchema>;
export type SetFlair = z.infer<typeof schemas.setFlairSchema>;
export type FlairTemplateOrder = z.infer<typeof schemas.flairTemplateOrderSchema>;
export type FlairConfig = z.infer<typeof schemas.flairConfigSchema>;
export type FlairCsv = z.infer<typeof schemas.flairCsvSchema>;
export type FlairListParams = z.infer<typeof schemas.flairListParamsSchema>;
export type FlairSelectorParams = z.infer<typeof schemas.flairSelectorParamsSchema>;
export type FlairTemplate = z.infer<typeof schemas.flairTemplateSchema>;
export type FlairTemplateV2 = z.infer<typeof schemas.flairTemplateV2Schema>;
export type SelectFlair = z.infer<typeof schemas.selectFlairSchema>;
export type SetFlairEnabled = z.infer<typeof schemas.setFlairEnabledSchema>; 