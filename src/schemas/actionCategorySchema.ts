import { z } from 'zod';

export const actionCategory = z.object({
  title: z
    .string()
    .min(2, { message: 'Naziv mora imati najmanje 2 karaktera.' })
    .max(100, { message: 'Naziv može imati najviše 100 karaktera.' }),
  description: z
    .string()
    .max(500, { message: 'Opis može imati najviše 500 karaktera.' })
    .optional(),
});

export type ActionCategoryType = z.infer<typeof actionCategory>;
