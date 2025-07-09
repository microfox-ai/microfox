import { z } from 'zod';

export const NumberedPagination = z.object({
  pageSize: z.number().min(1),
  currentPage: z.number().min(1),
  totalPages: z.number().min(1),
  totalItems: z.number().min(0),
  items: z.array(z.any()),
});

export type NumberedPagination = z.infer<typeof NumberedPagination>;

export const RecordPagination = z.object({
  items: z.record(z.string(), z.boolean()),
  currentProgress: z.number().min(0),
  totalItems: z.number().min(0),
});

export type RecordPagination = z.infer<typeof RecordPagination>;
