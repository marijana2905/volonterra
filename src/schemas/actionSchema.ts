import { z } from 'zod';

// Step 1 - Title and Description
export const step1Schema = z.object({
  title: z.string().min(3, 'Naslov mora imati bar 3 karaktera'),
  description: z.string().min(20, 'Opis mora biti detaljniji'),
  categories: z.array(z.string()).min(1, 'Morate odabrati bar jednu kategoriju'),
});
export type Step1Values = z.infer<typeof step1Schema>;

// Step 2 - Location (Latitude, Longitude, Custom Address)
export const step2Schema = z
  .object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    city: z.string().nonempty('Grad je obavezno polje.'),
    address: z.string().min(2),
  })
  .refine(data => data.latitude !== undefined && data.longitude !== undefined, {
    message: 'Morate označiti lokaciju na mapi',
    path: ['latitude'],
  });
export type Step2Values = z.infer<typeof step2Schema>;

// Step 3 - Date Range, Start Time, End Time (if date range are then start time must be before end time)
export const step3Schema = z.object({
  dateRange: z.object({
    from: z.date({ required_error: 'Početni datum je obavezno polje.' }),
    to: z.date({ required_error: 'Završni datum je obavezno polje.' }),
  }),
  startTime: z.string().nonempty(),
  endTime: z.string().nonempty(),
});
export type Step3Values = z.infer<typeof step3Schema>;

// Step 4 - Banner Image, Contact Phone, Min/Max Participants
const step4BaseSchema = z.object({
  bannerImage: z.string().nullable(),
  minParticipants: z.number().int().positive('Minimalan broj učesnika mora biti veći od 0'),
  maxParticipants: z.number().int().positive('Maksimalan broj učesnika mora biti veći od 0'),
});

export const step4Schema = step4BaseSchema.refine(
  data => data.minParticipants < data.maxParticipants,
  {
    message: 'Minimalan broj učesnika mora biti manji od maksimalnog',
    path: ['minParticipants'],
  }
);
export type Step4Values = z.infer<typeof step4BaseSchema>;

// Combined Action Schema with validation
export const actionSchema = step1Schema
  .merge(
    z.object({
      latitude: z.number({ required_error: 'Morate označiti lokaciju na mapi' }),
      longitude: z.number({ required_error: 'Morate označiti lokaciju na mapi' }),
      city: z.string().nonempty('Grad je obavezno polje.'),
      address: z.string().min(2),
    })
  )
  .merge(step3Schema)
  .merge(step4BaseSchema)
  .refine(data => data.minParticipants < data.maxParticipants, {
    message: 'Minimalan broj učesnika ne može biti veći od maksimalnog',
    path: ['minParticipants'],
  });
export type ActionFormValues = z.infer<typeof actionSchema>;
