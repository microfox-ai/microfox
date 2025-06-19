import { z } from 'zod';

export const flairTypeSchema = z.enum(['USER_FLAIR', 'LINK_FLAIR']);
export const flairPositionSchema = z.enum(['left', 'right']);

export const clearFlairTemplatesSchema = z.object({
  flair_type: flairTypeSchema,
});

export const deleteFlairSchema = z.object({
  name: z.string().describe('A user by name.'),
});

export const deleteFlairTemplateSchema = z.object({
  flair_template_id: z.string(),
});

export const setFlairSchema = z.object({
  css_class: z.string().optional(),
  link: z.string().optional().describe('A fullname of a link.'),
  name: z.string().optional().describe('A user by name.'),
  text: z.string().max(64).optional(),
});

export const flairTemplateOrderSchema = z.object({
    flair_type: flairTypeSchema,
    // The documentation is unclear on the parameter name for the order.
    // Assuming 'order' as a comma-separated string of flair_template_ids
    order: z.string().describe('Comma-separated list of all flair template IDs in the desired order.'),
});

export const flairConfigSchema = z.object({
  flair_enabled: z.boolean(),
  flair_position: flairPositionSchema,
  flair_self_assign_enabled: z.boolean(),
  link_flair_position: z.enum(['', 'left', 'right']),
  link_flair_self_assign_enabled: z.boolean(),
});

export const flairCsvSchema = z.object({
  flair_csv: z.string().describe("Up to 100 lines of 'user,flairtext,cssclass'"),
});

export const flairListParamsSchema = z.object({
  after: z.string().optional(),
  before: z.string().optional(),
  count: z.number().int().positive().optional(),
  limit: z.number().int().min(1).max(1000).optional(),
  name: z.string().optional(),
  show: z.literal('all').optional(),
  sr_detail: z.boolean().optional().describe('Expand subreddits.'),
});

export const flairSelectorParamsSchema = z.object({
    is_newlink: z.boolean().optional(),
    link: z.string().optional(),
    name: z.string().optional(),
});

export const flairTemplateSchema = z.object({
  css_class: z.string().optional(),
  flair_template_id: z.string().optional(),
  flair_type: flairTypeSchema,
  text: z.string().max(64).optional(),
  text_editable: z.boolean().optional(),
});

export const flairTemplateV2Schema = z.object({
  allowable_content: z.enum(['all', 'emoji', 'text']).optional(),
  background_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  css_class: z.string().optional(),
  flair_template_id: z.string().optional(),
  flair_type: flairTypeSchema,
  max_emojis: z.number().int().min(1).max(10).optional(),
  mod_only: z.boolean().optional(),
  override_css: z.boolean().optional(),
  text: z.string().max(64).optional(),
  text_color: z.enum(['light', 'dark']).optional(),
  text_editable: z.boolean().optional(),
});

export const selectFlairSchema = z.object({
  background_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  css_class: z.string().optional(),
  flair_template_id: z.string().optional(),
  link: z.string().optional(),
  name: z.string().optional(),
  return_rtson: z.enum(['all', 'only', 'none']).optional(),
  text: z.string().max(64).optional(),
  text_color: z.enum(['light', 'dark']).optional(),
});

export const setFlairEnabledSchema = z.object({
  flair_enabled: z.boolean(),
}); 