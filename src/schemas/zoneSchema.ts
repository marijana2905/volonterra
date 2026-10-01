// zod schema za zonu interesa

import { z } from 'zod';

export const zoneSchema = z
  .object({
    name: z.string().min(2).max(100),
    center: z.object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    }),
    radius: z.number().min(1),
  })
  .refine(data => data.center.latitude !== undefined && data.center.longitude !== undefined, {
    message: 'Morate označiti lokaciju na mapi',
    path: ['center'],
  });

export type ZoneFormSchemaType = z.infer<typeof zoneSchema>;
