import { z } from 'zod';

export const banSchema = z.object({
  reason: z
    .string()
    .min(10, 'Razlog mora imati najmanje 10 karaktera')
    .max(500, 'Razlog ne sme imati više od 500 karaktera'),
  durationInSeconds: z.number().min(0, 'Trajanje mora biti pozitivno ili nula').optional(),
});

export type BanSchemaType = z.infer<typeof banSchema>;
