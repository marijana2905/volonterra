import { z } from 'zod';

export const impressionFormSchema = z.object({
  rating: z
    .number({ invalid_type_error: 'Ocena mora biti broj' })
    .min(1, { message: 'Ocena mora biti najmanje 1' })
    .max(5, { message: 'Ocena mora biti najviše 5' }),
  comment: z
    .string({ required_error: 'Komentar je obavezan' })
    .nonempty('Komentar je obavezan')
    .min(32, { message: 'Komentar je previše kratak' })
    .max(3000, { message: 'Komentar ne može biti duži od 3000 karaktera' }),
});

export type ImpressionFormSchemaType = z.infer<typeof impressionFormSchema>;
