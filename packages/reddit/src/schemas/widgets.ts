import { z } from 'zod';

export const baseWidgetSchema = z.object({
  id: z.string().optional(),
  shortName: z.string(),
  styles: z.object({
    backgroundColor: z.string(),
    headerColor: z.string(),
  }),
});

export const buttonObjectSchema = z.object({
    kind: z.literal('button'),
    text: z.string(),
    url: z.string(),
    color: z.string().optional(),
    textColor: z.string().optional(),
    fillColor: z.string().optional(),
    hoverState: z.object({
        text: z.string(),
        color: z.string(),
        textColor: z.string(),
        fillColor: z.string(),
    }).optional(),
});

export const buttonWidgetSchema = baseWidgetSchema.extend({
    kind: z.literal('button'),
    description: z.string().optional(),
    buttons: z.array(buttonObjectSchema),
});

export const textareaWidgetSchema = baseWidgetSchema.extend({
    kind: z.literal('textarea'),
    text: z.string(),
    textHtml: z.string().optional(),
});

export const widgetSchema = z.discriminatedUnion('kind', [
    buttonWidgetSchema,
    textareaWidgetSchema,
]);

export const widgetImageUploadLeaseSchema = z.object({
    filepath: z.string(),
    mimetype: z.enum(['image/jpeg', 'image/png']),
});

export const widgetOrderSchema = z.object({
    order: z.array(z.string()),
});

export const widgetListSchema = z.object({
    items: z.array(widgetSchema),
    kind: z.literal('Listing'),
}); 