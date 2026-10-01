import { z } from 'zod';

export const cancelActionSchema = z.object({
  reason: z
    .string()
    .min(10, { message: 'Razlog otkazivanja mora imati najmanje 10 karaktera' })
    .max(1000, { message: 'Razlog otkazivanja ne sme imati više od 1000 karaktera' }),
});

export type CancelActionSchemaType = z.infer<typeof cancelActionSchema>;
