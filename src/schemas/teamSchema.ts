import { z } from 'zod';

export const teamFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Ime tima mora imati najmanje 2 karaktera',
    })
    .max(100, {
      message: 'Ime tima mora imati najviše 100 karaktera',
    }),
  bio: z.string().max(500).optional(),
});

export type TeamFormSchemaType = z.infer<typeof teamFormSchema>;
